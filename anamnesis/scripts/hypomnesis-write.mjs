#!/usr/bin/env node
/**
 * SessionEnd + PreCompact hook: write hypomnesis store entries for /recollect access.
 *
 * Entry points:
 *   - SessionEnd: gated by age ≥ 24h AND tokens ≥ 100k (mirrors Claude Code's
 *     resume-summary prompt heuristic, tuned for cross-session recall worth).
 *   - PreCompact: ungated — user/runtime already classified the session as
 *     worth summarizing; index before /compact lossily rewrites the transcript.
 *
 * Architecture: deterministic mjs harness + claude -p haiku LLM extraction.
 *   1. Read stdin (hook input) + parse session JSONL (deterministic)
 *   2. Apply gate per entry point
 *   3. Build 3 prompts (clue: user-only, vector: full, narrative: full)
 *   4. Call claude -p --model haiku per prompt (LLM semantic extraction)
 *   5. Validate JSON output + assemble md files (deterministic)
 *   6. Atomic write to hypomnesis/{session-id}/
 *
 * Recursion safety: --setting-sources "" prevents hook loading in child process.
 * Fail-open: top-level try/catch → process.exit(0).
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

function logErr(msg) {
  try { process.stderr.write(`[hypomnesis-write] ${msg}\n`); } catch {}
}

// --- SIGHUP guard ---
try { process.on("SIGHUP", () => {}); } catch {}

const MIN_SESSION_BYTES = 1024;
const MAX_USER_MSGS = 150;
const MAX_ALL_CHARS = 80_000;
const HAIKU_TIMEOUT = 120_000;
// "compact" added: PreCompact hook already indexes pre-compaction; the
// post-compact SessionEnd would index the lossy summary.
const SKIP_REASONS = new Set(["clear", "compact"]);

// SessionEnd gate: age + token thresholds mirror Claude Code's resume-summary
// prompt heuristic (cli.js `HF7` modal). Age raised from 70min → 24h because
// sub-day sessions rarely warrant cross-session recall indexing.
const GATE_MIN_AGE_MS = 24 * 60 * 60 * 1000;
const GATE_MIN_TOKENS = 100_000;

// --- Helpers ---

function readHookInput() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    logErr(`failed to parse hook input: ${e.message}`);
    return null;
  }
}

function textFromContent(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((b) => b?.type === "text")
      .map((b) => b.text ?? "")
      .join("\n");
  }
  return "";
}

function isNoise(text) {
  const t = text.trimStart();
  return (
    t.startsWith("Base directory for this skill:") ||
    t.startsWith("<local-command-") ||
    t.startsWith("<system-reminder>") ||
    t.startsWith("Tool loaded") ||
    t.includes("<local-command-caveat>") ||
    t.includes("<local-command-stdout>")
  );
}

function cleanText(text) {
  return text
    .replace(/<command-[^>]*>[^<]*<\/command-[^>]*>\s*/g, "")
    .replace(/<local-command-[^>]*>[\s\S]*?<\/local-command-[^>]*>/g, "")
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// --- JSONL Parsing ---

function parseSession(transcriptPath) {
  const userMsgs = [];
  const allTexts = [];
  const timestamps = [];
  const protocols = new Set();
  let lastAssistantInputTokens = 0;
  let outputTokensSum = 0;

  const protocolMap = {
    "/frame": "frame", "/gap": "gap", "/clarify": "clarify",
    "/goal": "goal", "/bound": "bound", "/inquire": "inquire",
    "/ground": "ground", "/attend": "attend",
    "/contextualize": "contextualize", "/grasp": "grasp",
    "/reflect": "reflect", "/recollect": "recollect",
    "/write": "write", "/verify": "verify",
  };

  let raw;
  try {
    raw = fs.readFileSync(transcriptPath, "utf8");
  } catch (e) {
    logErr(`failed to read transcript ${transcriptPath}: ${e.message}`);
    return {
      userMsgs, allTexts, timestamps, protocols: [],
      tokenEstimate: 0,
    };
  }
  let totalChars = 0;

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }

    const ts = entry.timestamp ?? "";
    if (ts) timestamps.push(ts);
    const etype = entry.type ?? "";

    if (etype === "user" && userMsgs.length < MAX_USER_MSGS) {
      const text = textFromContent(entry.message?.content ?? "");
      if (!text) continue;
      for (const [slash, name] of Object.entries(protocolMap)) {
        if (text.includes(slash)) protocols.add(name);
      }
      userMsgs.push({ text, ts });
    }

    if (etype === "user" || etype === "assistant") {
      const text = textFromContent(entry.message?.content ?? "");
      if (text && totalChars < MAX_ALL_CHARS) {
        allTexts.push(text);
        totalChars += text.length;
      }
    }

    if (etype === "assistant") {
      const usage = entry.message?.usage;
      if (usage) {
        const inTok = Number(usage.input_tokens ?? 0) || 0;
        const outTok = Number(usage.output_tokens ?? 0) || 0;
        if (inTok > 0) lastAssistantInputTokens = inTok;
        outputTokensSum += outTok;
      }
    }
  }

  // Mirrors the context-weight estimate: final assistant turn's input_tokens
  // captures full accumulated context; output_tokens sum reflects total
  // generation. cache_read/cache_creation excluded — conservative estimate.
  const tokenEstimate = lastAssistantInputTokens + outputTokensSum;

  return {
    userMsgs, allTexts, timestamps,
    protocols: [...protocols].sort(),
    tokenEstimate,
  };
}

// --- Prompt Builders ---

function buildCluePrompt(userMsgs) {
  const cleaned = userMsgs
    .filter((m) => !isNoise(m.text))
    .map((m) => cleanText(m.text))
    .filter((t) => t.length > 5);

  const sample = cleaned.slice(0, 30).join("\n---\n").slice(0, 20_000);

  return `You are a session indexer. Extract recall anchors from user messages only.

Output EXACTLY valid JSON, nothing else:
{
  "topics": ["topic1", "topic2"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "initial_request": "first user request verbatim (truncated to 300 chars)",
  "key_utterances": ["notable quote 1", "notable quote 2"]
}

Rules:
- topics: 3-5 broad subject areas discussed (Korean or English as appropriate)
- keywords: 8-12 specific terms for grep-based recall (file names, protocol names, technical terms)
- initial_request: the very first substantive user message, verbatim
- key_utterances: 3-5 memorable user statements (decisions, strong opinions, key requests)
- All values in the language they were originally written in

User messages:
${sample}`;
}

function buildVectorPrompt(allTexts) {
  const sample = allTexts.join("\n---\n").slice(0, 30_000);

  return `You are a session indexer. Extract decisions and direction changes from the full session.

Output EXACTLY valid JSON, nothing else:
{
  "decisions": [
    {"label": "short label", "description": "what was decided and why", "alternatives_rejected": "what was considered but not chosen"}
  ]
}

Rules:
- Extract 3-8 significant decisions (architectural choices, direction changes, confirmed approaches)
- Include what alternatives were considered and rejected
- Use the language of the original discussion
- If no clear decisions, return {"decisions": []}

Session content:
${sample}`;
}

function buildNarrativePrompt(allTexts, protocols) {
  const sample = allTexts.join("\n---\n").slice(0, 30_000);
  const protoList = protocols.length > 0 ? protocols.join(", ") : "none detected";

  return `You are a session indexer. Write a concise session narrative from the full conversation.

Output EXACTLY valid JSON, nothing else:
{
  "origin": "What started this session (1-2 sentences)",
  "direction": "What path was taken, key turns (2-3 sentences)",
  "outcome": "What was resolved or deferred (1-2 sentences)"
}

Rules:
- Write in the language predominantly used in the session
- Be specific: mention file names, protocol names, concrete decisions
- Protocols used: ${protoList}

Session content:
${sample}`;
}

// --- Haiku Invocation ---

function callHaiku(prompt) {
  const output = execFileSync("claude", [
    "-p",
    "--no-session-persistence",
    "--model", "haiku",
    "--disable-slash-commands",
    "--strict-mcp-config",
    "--dangerously-skip-permissions",
    "--setting-sources", "",
    prompt,
  ], {
    encoding: "utf8",
    timeout: HAIKU_TIMEOUT,
    stdio: ["pipe", "pipe", "pipe"],
    maxBuffer: 8 * 1024 * 1024,
  });
  return output.trim();
}

function extractJson(raw) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const braced = raw.match(/\{[\s\S]*\}/);
  if (braced) return braced[0].trim();

  return null;
}

function parseHaikuOutput(raw) {
  const jsonStr = extractJson(raw);
  if (jsonStr === null) {
    throw new Error(
      `no JSON payload found in haiku output (first 500 chars): ${raw.slice(0, 500)}`
    );
  }
  return JSON.parse(jsonStr);
}

// --- Schema Validation ---

function validateClue(data) {
  return (
    Array.isArray(data.topics) &&
    Array.isArray(data.keywords) &&
    typeof data.initial_request === "string" &&
    Array.isArray(data.key_utterances)
  );
}

function validateVector(data) {
  return Array.isArray(data.decisions);
}

function validateNarrative(data) {
  return (
    typeof data.origin === "string" &&
    typeof data.direction === "string" &&
    typeof data.outcome === "string"
  );
}

// --- File Builders ---

function buildClueMd(sessionId, date, startedAt, lastTurnAt, data, crossRefs) {
  const lines = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `started_at: ${startedAt}`,
    `last_turn_at: ${lastTurnAt}`,
    `topics: [${data.topics.map((t) => `"${esc(t)}"`).join(", ")}]`,
    `keywords: [${data.keywords.map((k) => `"${esc(k)}"`).join(", ")}]`,
    `initial_request: "${esc(data.initial_request)}"`,
    "key_utterances:",
    ...data.key_utterances.map((u) => `  - "${esc(u)}"`),
    "cross_refs:",
    ...crossRefs.map((r) => `  - ${r}`),
    "---",
    "",
    `Session started with: ${data.initial_request.slice(0, 200)}`,
    data.topics.length > 0 ? `Main topics: ${data.topics.join(", ")}` : "",
    "",
    "Notable user statements:",
    ...data.key_utterances.map((u) => `- ${u}`),
  ];
  return lines.filter((l) => l !== undefined).join("\n") + "\n";
}

function buildVectorMd(sessionId, date, data) {
  const labels = data.decisions.map((d) => d.label ?? "").slice(0, 5);
  const lines = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `decisions: [${labels.map((l) => `"${esc(l)}"`).join(", ")}]`,
    "---",
    "",
  ];
  if (data.decisions.length > 0) {
    lines.push("## Decisions");
    for (const d of data.decisions) {
      lines.push(`### ${d.label}`);
      lines.push(d.description ?? "");
      if (d.alternatives_rejected) {
        lines.push(`Alternatives rejected: ${d.alternatives_rejected}`);
      }
      lines.push("");
    }
  } else {
    lines.push("No explicit decisions detected in this session.");
  }
  return lines.join("\n") + "\n";
}

function buildNarrativeMd(sessionId, date, startedAt, lastTurnAt, topics, protocols, data) {
  return [
    "---",
    `session_id: ${sessionId}`,
    `started_at: ${startedAt}`,
    `last_turn_at: ${lastTurnAt}`,
    `date: ${date}`,
    `topics: [${topics.join(", ")}]`,
    `protocols_used: [${protocols.join(", ")}]`,
    "continuations: []",
    "forks: []",
    "---",
    "",
    `## ${startedAt.slice(0, 16)} — Initial Narrative`,
    "### Origin",
    data.origin,
    "### Direction",
    data.direction,
    "### Outcome",
    data.outcome,
  ].join("\n") + "\n";
}

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

// --- Cross-refs extraction (deterministic) ---

function extractCrossRefs(userMsgs, allTexts) {
  const refs = new Set();
  const memRe = /(?:memory\/[\w_]+\.md|project_[\w_]+\.md|feedback_[\w_]+\.md)/g;
  const issueRe = /(?:PR |#)(\d{1,4})\b/g;
  const texts = [
    ...userMsgs.slice(0, 20).map((m) => m.text),
    ...allTexts.slice(0, 20),
  ];
  for (const t of texts) {
    for (const m of t.matchAll(memRe)) {
      const ref = m[0].startsWith("memory/") ? m[0] : `memory/${m[0]}`;
      refs.add(ref);
    }
    for (const m of t.matchAll(issueRe)) {
      refs.add(`#${m[1]}`);
    }
  }
  return [...refs].sort().slice(0, 10);
}

// --- Atomic Writer ---

function writeStore(targetDir, files) {
  const parent = path.dirname(targetDir);
  fs.mkdirSync(parent, { recursive: true });

  if (fs.existsSync(targetDir)) {
    for (const [name, content] of Object.entries(files)) {
      const dest = path.join(targetDir, name);
      try {
        if (name === "narrative.md" && fs.existsSync(dest)) {
          fs.appendFileSync(dest, "\n" + content, "utf8");
        } else {
          fs.writeFileSync(dest, content, "utf8");
        }
      } catch (e) {
        logErr(`write ${dest} failed: ${e.message}`);
      }
    }
  } else {
    const tmp = fs.mkdtempSync(path.join(parent, ".hyp-"));
    try {
      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(tmp, name), content, "utf8");
      }
      fs.renameSync(tmp, targetDir);
    } catch (e) {
      fs.rmSync(tmp, { recursive: true, force: true });
      throw e;
    }
  }
}

// --- Gate ---

function sessionAgeMs(timestamps) {
  // Mirrors Claude Code's findLast-with-60s-grace reference: most recent
  // message not counting the current turn. Anamnesis runs post-turn, so the
  // last timestamp is effectively the reference point.
  const last = timestamps.at(-1);
  if (!last) return 0;
  const t = Date.parse(last);
  return Number.isFinite(t) ? Date.now() - t : 0;
}

function passesSessionEndGate(ageMs, tokenEstimate) {
  return ageMs >= GATE_MIN_AGE_MS && tokenEstimate >= GATE_MIN_TOKENS;
}

// --- Main ---

function main() {
  const input = readHookInput();
  if (!input) return;

  const {
    session_id: sessionId,
    transcript_path: transcriptPath,
    cwd,
    reason,
    hook_event_name: eventName,
  } = input;
  if (!sessionId || !transcriptPath) return;

  const event = eventName || "SessionEnd";
  if (event === "SessionEnd" && SKIP_REASONS.has(reason)) return;

  const stat = fs.statSync(transcriptPath, { throwIfNoEntry: false });
  if (!stat || stat.size < MIN_SESSION_BYTES) return;

  // Store lives in user's working directory so /recollect can find it,
  // not in Claude's internal transcript storage (~/.claude/projects/...).
  const projectDir = cwd || path.dirname(transcriptPath);
  const storeDir = path.join(projectDir, "hypomnesis", sessionId);

  const { userMsgs, allTexts, timestamps, protocols, tokenEstimate } = parseSession(transcriptPath);
  if (userMsgs.length === 0) return;

  // PreCompact: runtime already classified the session as worth summarizing
  // (manual = user accepted "Resume from summary"; auto = context-fill).
  // SessionEnd: apply AND gate to filter ephemeral sessions.
  if (event === "SessionEnd") {
    const ageMs = sessionAgeMs(timestamps);
    if (!passesSessionEndGate(ageMs, tokenEstimate)) return;
  }

  const startedAt = timestamps[0] ?? "";
  const lastTurnAt = timestamps.at(-1) ?? "";
  const date = startedAt.slice(0, 10) || new Date().toISOString().slice(0, 10);
  const crossRefs = extractCrossRefs(userMsgs, allTexts);

  const files = {};
  let clueData = null;

  // --- Clue: user messages only ---
  try {
    const clueRaw = callHaiku(buildCluePrompt(userMsgs));
    clueData = parseHaikuOutput(clueRaw);
    if (validateClue(clueData)) {
      files["clue.md"] = buildClueMd(sessionId, date, startedAt, lastTurnAt, clueData, crossRefs);
    } else {
      logErr(`clue validation failed: invalid schema`);
    }
  } catch (e) {
    logErr(`clue extraction failed: ${e.message}`);
  }

  // --- Vector: full context ---
  try {
    const vectorRaw = callHaiku(buildVectorPrompt(allTexts));
    const vectorData = parseHaikuOutput(vectorRaw);
    if (validateVector(vectorData)) {
      files["vector.md"] = buildVectorMd(sessionId, date, vectorData);
    } else {
      logErr(`vector validation failed: invalid schema`);
    }
  } catch (e) {
    logErr(`vector extraction failed: ${e.message}`);
  }

  // --- Narrative: full context ---
  try {
    const narrativeRaw = callHaiku(buildNarrativePrompt(allTexts, protocols));
    const narrativeData = parseHaikuOutput(narrativeRaw);
    if (validateNarrative(narrativeData)) {
      const topics = clueData?.topics ?? [];
      files["narrative.md"] = buildNarrativeMd(
        sessionId, date, startedAt, lastTurnAt,
        topics, protocols, narrativeData,
      );
    } else {
      logErr(`narrative validation failed: invalid schema`);
    }
  } catch (e) {
    logErr(`narrative extraction failed: ${e.message}`);
  }

  if (Object.keys(files).length > 0) {
    writeStore(storeDir, files);
  }
}

try {
  main();
} catch (e) {
  logErr(`top-level: ${e.message}`);
}
process.exit(0);
