#!/usr/bin/env node
/**
 * SessionEnd + PreCompact hook: write hypomnesis store entries for /recollect access.
 *
 * Entry points:
 *   - SessionEnd: cooldown-gated by narrative.md mtime (skip if last write
 *     < 300s ago). Post-extraction discard when clue/vector/narrative are all
 *     empty — enables retry on next SessionEnd once cooldown expires.
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

// v0.4.0 two-track extension budgets.
// Soft cap on deterministic extract/detect/coinage; the haiku calls above are
// bounded separately by HAIKU_TIMEOUT and are unaffected by this budget.
const TWO_TRACK_BUDGET_MS = 5_000;
const COINAGE_MIN_REMAINING_MS = 500;
const COINAGE_PRECISION_THRESHOLD = 0.5;
const COINAGE_MIN_SESSION_OCC = 2;
const COINAGE_MAX_OUTPUT = 30;
const MARKER_CAT_LIMIT = 30;
const ENTROPY_MAX_OUTPUT = 40;
// Observed reason values in ~/.claude/logs/hooks.log (33 days, 1408 records):
// other, prompt_input_exit, resume, clear. "compact" never observed — PreCompact
// does not trigger SessionEnd; the two events are temporally independent.
const SKIP_REASONS = new Set(["clear"]);
const KNOWN_EVENTS = new Set(["SessionEnd", "PreCompact"]);

// SessionEnd gate: cooldown against narrative.md mtime. Skip if last index
// write occurred < 300s ago — prevents resume-cycle spam during active
// multi-day sessions while permitting indexing once activity gap exceeds
// the cooldown window. PreCompact bypasses cooldown entirely.
const COOLDOWN_MS = 300 * 1000;

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
  let lastTurnHadFreshInput = false;
  let sawAnyAssistantUsage = false;

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
        sawAnyAssistantUsage = true;
        const inTok = Number(usage.input_tokens ?? 0) || 0;
        const outTok = Number(usage.output_tokens ?? 0) || 0;
        if (inTok > 0) {
          lastAssistantInputTokens = inTok;
          lastTurnHadFreshInput = true;
        } else {
          lastTurnHadFreshInput = false;
        }
        outputTokensSum += outTok;
      } else {
        lastTurnHadFreshInput = false;
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
    lastTurnHadFreshInput,
    sawAnyAssistantUsage,
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

// --- v0.4.0 Two-Track Extension: deterministic extract / detect / coinage ---
//
// Morphism laws (see SKILL.md ── ENTROPY EXTRACTION ── and ── SALIENCE MARKERS ──):
//   extract: identity, locality, compositionality (pattern registry union)
//   detect:  monotonicity, locality, idempotence (pure pattern match, modulo truncation)
//   coinage: corpus-comparative (Zipf deviation), budget-bounded
//
// Output: entropy.md (IdentifierTuples), markers.md (MarkerProfile), coinage.md (CoinageSet).

// extract: Session → Set(IdentifierTuple) — entropy-track anchors
// ORDER INVARIANT: "url" must precede "path_ref". extractEntropyRefs records url
// spans during iteration and suppresses path_ref matches that fall inside them.
// Reordering without updating the dedup logic will silently break URL-substring
// dedup (path_ref would count github.com/foo/bar.ts on top of the matching URL).
const ENTROPY_EXTRACTORS = [
  { name: "url", pattern: /\bhttps?:\/\/[^\s<>"'`)\]]+/g },
  { name: "pr_ref", pattern: /\bPR\s*#\d+\b/gi },
  { name: "issue_ref", pattern: /(?<![\w-])#\d{1,5}\b/g },
  { name: "session_id", pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g },
  { name: "commit_sha", pattern: /(?<![\w-])[0-9a-f]{7,40}(?![\w-])/g },
  { name: "path_ref", pattern: /\b[\w.-]+\/[\w./-]+\.\w{1,6}\b/g },
];

function extractEntropyRefs(allTexts) {
  const refs = new Map();
  for (const text of allTexts) {
    const urlSpans = [];
    for (const { name, pattern } of ENTROPY_EXTRACTORS) {
      for (const match of text.matchAll(pattern)) {
        const literal = match[0];
        if (literal.length > 300) continue;
        const start = match.index;
        const end = start + literal.length;
        if (name === "path_ref" && urlSpans.some(([s, e]) => start >= s && end <= e)) continue;
        if (name === "url") urlSpans.push([start, end]);
        const existing = refs.get(literal);
        if (existing) {
          existing.count += 1;
        } else {
          refs.set(literal, { literal, source: name, count: 1 });
        }
      }
    }
  }
  return [...refs.values()]
    .sort((a, b) => b.count - a.count || a.literal.localeCompare(b.literal))
    .slice(0, ENTROPY_MAX_OUTPUT);
}

// detect: Session → MarkerProfile — salience-track profile
// Laws: monotonicity/locality hold exactly; idempotence holds up to output truncation.
const MARKER_PATTERNS = {
  actor: /@[\w-]{2,40}\b/g,
  temporal: /\b(\d{4}-\d{2}-\d{2}|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|yesterday|today|tomorrow|last\s+\w+|next\s+\w+|어제|오늘|내일|이번주|지난주|다음주|주말)\b/gi,
  emotional: /(?:!{2,}|\?{2,}|\bwow\b|\bexactly\b|\bperfect\b|완벽|맞습니다|최고|중요합니다?)/gi,
  cognitive: /\b(?:however|therefore|because|hence|thus|nonetheless|moreover)\b|따라서|그래서|왜냐하면|그러나|하지만|결국/gi,
};
const COINAGE_PATTERN = /\b(?:[a-z]+(?:[A-Z][a-z]+)+|[A-Z][a-z]+(?:[A-Z][a-z]+){1,3})\b/g;

function detectMarkers(userMsgs, allTexts) {
  const profile = {
    coinage: new Set(),
    actor: new Set(),
    temporal: new Set(),
    emotional: new Set(),
    cognitive: new Set(),
    singularity: new Set(),
  };
  for (const text of allTexts) {
    for (const match of text.matchAll(COINAGE_PATTERN)) {
      if (profile.coinage.size >= MARKER_CAT_LIMIT) break;
      profile.coinage.add(match[0]);
    }
    for (const [category, pattern] of Object.entries(MARKER_PATTERNS)) {
      if (profile[category].size >= MARKER_CAT_LIMIT) continue;
      for (const match of text.matchAll(pattern)) {
        if (profile[category].size >= MARKER_CAT_LIMIT) break;
        profile[category].add(match[0]);
      }
    }
  }
  for (const msg of userMsgs.slice(0, 30)) {
    if (profile.singularity.size >= 10) break;
    const text = cleanText(msg.text).trim();
    if (text.length >= 80 && text.length <= 500 && /[!?]|\*\*/.test(text)) {
      profile.singularity.add(text.slice(0, 200));
    }
  }
  return Object.fromEntries(
    Object.entries(profile).map(([k, v]) => [k, [...v]])
  );
}

// coinage: Session × Corpus × θ → CoinageSet
// salience_precision(t, s, corpus) = |occ(t, s)| / (1 + |occ(t, corpus \ {s})|)
function computeCoinage(userMsgs, allTexts, corpusPath, currentSessionId, budgetMs) {
  const start = Date.now();
  const sessionText = [
    ...userMsgs.map((m) => m.text),
    ...allTexts,
  ].join(" ").toLowerCase();
  const tokenRe = /\b[a-zA-Z가-힣_][a-zA-Z가-힣_0-9-]{3,29}\b/g;
  const sessionCounts = new Map();
  for (const match of sessionText.matchAll(tokenRe)) {
    const t = match[0];
    sessionCounts.set(t, (sessionCounts.get(t) ?? 0) + 1);
  }

  const corpusCounts = new Map();
  let corpusSampled = 0;
  try {
    if (fs.existsSync(corpusPath)) {
      const entries = fs.readdirSync(corpusPath);
      for (const entry of entries) {
        if (entry === currentSessionId) continue;
        if (Date.now() - start > budgetMs) break;
        const cluePath = path.join(corpusPath, entry, "clue.md");
        if (!fs.existsSync(cluePath)) continue;
        try {
          const content = fs.readFileSync(cluePath, "utf8").toLowerCase();
          if (Date.now() - start > budgetMs) {
            logErr(`coinage: budget overrun by ${(Date.now() - start) - budgetMs}ms (triggered on ${entry})`);
          }
          for (const match of content.matchAll(tokenRe)) {
            const t = match[0];
            corpusCounts.set(t, (corpusCounts.get(t) ?? 0) + 1);
          }
          corpusSampled += 1;
        } catch (e) {
          if (e.code !== "ENOENT") logErr(`coinage: failed to read ${cluePath}: ${e.message}`);
        }
      }
    }
  } catch (e) {
    logErr(`coinage corpus scan failed: ${e.message}`);
  }

  const coinage = [];
  for (const [token, sessionOcc] of sessionCounts.entries()) {
    if (sessionOcc < COINAGE_MIN_SESSION_OCC) continue;
    const corpusOcc = corpusCounts.get(token) ?? 0;
    const precision = sessionOcc / (1 + corpusOcc);
    if (precision >= COINAGE_PRECISION_THRESHOLD) {
      coinage.push({ token, precision, sessionOcc, corpusOcc });
    }
  }
  coinage.sort((a, b) => b.precision - a.precision);
  return {
    coinage: coinage.slice(0, COINAGE_MAX_OUTPUT),
    corpus_sessions_sampled: corpusSampled,
    elapsed_ms: Date.now() - start,
  };
}

function buildEntropyMd(sessionId, date, refs) {
  const lines = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `identifier_count: ${refs.length}`,
    `extractors: [${ENTROPY_EXTRACTORS.map((e) => e.name).join(", ")}]`,
    "---",
    "",
    "## Identifier Tuples",
    "",
  ];
  if (refs.length === 0) {
    lines.push("No structured identifiers extracted.");
  } else {
    lines.push("| literal | source | session_count |");
    lines.push("|---------|--------|---------------|");
    for (const r of refs) {
      lines.push(`| \`${escMd(r.literal)}\` | ${r.source} | ${r.count} |`);
    }
  }
  return lines.join("\n") + "\n";
}

function buildMarkersMd(sessionId, date, profile) {
  const counts = Object.fromEntries(
    Object.entries(profile).map(([k, v]) => [k, v.length])
  );
  const lines = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `marker_categories: [${Object.keys(profile).join(", ")}]`,
    `marker_counts: ${JSON.stringify(counts)}`,
    "---",
    "",
    "## MarkerProfile",
    "",
  ];
  for (const [category, items] of Object.entries(profile)) {
    lines.push(`### ${category} (${items.length})`);
    if (items.length === 0) {
      lines.push("_none_");
    } else {
      for (const item of items) {
        lines.push(`- ${escMd(item)}`);
      }
    }
    lines.push("");
  }
  return lines.join("\n") + "\n";
}

function buildCoinageMd(sessionId, date, result, skipped, skipReason) {
  const lines = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `coinage_count: ${result?.coinage.length ?? 0}`,
    `budget_skipped: ${skipped}`,
    `corpus_sessions_sampled: ${result?.corpus_sessions_sampled ?? 0}`,
    `elapsed_ms: ${result?.elapsed_ms ?? 0}`,
    `threshold: ${COINAGE_PRECISION_THRESHOLD}`,
    "---",
    "",
    "## Zipf-Deviation Coinage Set",
    "",
  ];
  if (skipped) {
    lines.push(`Coinage computation skipped: ${skipReason}.`);
    lines.push("MarkerProfile and IdentifierTuples remain intact (Anamnesis R1 fallback).");
  } else if (!result || result.coinage.length === 0) {
    lines.push("No high-precision coinage detected against current corpus.");
  } else {
    lines.push("| token | precision | session_occ | corpus_occ |");
    lines.push("|-------|-----------|-------------|------------|");
    for (const c of result.coinage) {
      lines.push(`| \`${escMd(c.token)}\` | ${c.precision.toFixed(3)} | ${c.sessionOcc} | ${c.corpusOcc} |`);
    }
  }
  return lines.join("\n") + "\n";
}

function escMd(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/`/g, "\\`")
    .replace(/\n/g, " ");
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

function isLowInfo(clue, vector, narrative) {
  const clueEmpty = !clue?.initial_request?.trim() && !clue?.key_utterances?.length;
  const vectorEmpty = !vector?.decisions?.length;
  const narrativeEmpty = !narrative?.origin?.trim() && !narrative?.outcome?.trim();
  // Discard ONLY when all 3 are empty (conservative — retry via next SessionEnd
  // once cooldown expires). Missing extraction (null) is treated as empty.
  return clueEmpty && vectorEmpty && narrativeEmpty;
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

  const event = eventName ?? "SessionEnd";
  if (!KNOWN_EVENTS.has(event)) {
    logErr(`unrecognized hook_event_name "${event}"; skipping`);
    return;
  }
  if (event === "SessionEnd" && SKIP_REASONS.has(reason)) return;

  const stat = fs.statSync(transcriptPath, { throwIfNoEntry: false });
  if (!stat || stat.size < MIN_SESSION_BYTES) return;

  // Store lives in user's working directory so /recollect can find it,
  // not in Claude's internal transcript storage (~/.claude/projects/...).
  const projectDir = cwd || path.dirname(transcriptPath);
  const storeDir = path.join(projectDir, "hypomnesis", sessionId);

  const {
    userMsgs, allTexts, timestamps, protocols, tokenEstimate,
    lastTurnHadFreshInput, sawAnyAssistantUsage,
  } = parseSession(transcriptPath);
  if (userMsgs.length === 0) return;

  // Observability for stale token estimates (final assistant turn had no fresh
  // input_tokens — full cache hit or tool-use-only turn can leave the estimate
  // based on an earlier turn).
  if (sawAnyAssistantUsage && !lastTurnHadFreshInput && tokenEstimate > 0) {
    logErr(`last assistant turn lacked fresh input_tokens; tokenEstimate ${tokenEstimate} may use stale value`);
  }
  // Diagnostic: zero tokenEstimate despite observed assistant usage indicates
  // corrupted JSONL or format change. No longer gates the write (cooldown gate
  // replaces tokens threshold), but retained as an anomaly signal.
  if (sawAnyAssistantUsage && tokenEstimate === 0) {
    logErr(`tokenEstimate is 0 despite observed assistant usage; possible corrupted JSONL or format change`);
  }

  // PreCompact: runtime already classified the session as worth summarizing
  // (manual = user accepted "Resume from summary"; auto = context-fill).
  // SessionEnd: cooldown gate against narrative.md mtime — silent skip if
  // last write < 300s ago. ENOENT returns undefined via throwIfNoEntry
  // (first-write path); unexpected errors (EACCES, EIO) are logged and fail open.
  if (event === "SessionEnd") {
    const narrativePath = path.join(storeDir, "narrative.md");
    let narrativeStat;
    try {
      narrativeStat = fs.statSync(narrativePath, { throwIfNoEntry: false });
    } catch (e) {
      logErr(`narrative.md stat failed unexpectedly (${e.code ?? e.message}); failing open`);
    }
    if (narrativeStat && Date.now() - narrativeStat.mtimeMs < COOLDOWN_MS) {
      const remainingSec = Math.round((COOLDOWN_MS - (Date.now() - narrativeStat.mtimeMs)) / 1000);
      logErr(`cooldown active — skipping SessionEnd (${remainingSec}s remaining)`);
      return;
    }
  }

  const startedAt = timestamps[0] ?? "";
  const lastTurnAt = timestamps.at(-1) ?? "";
  const date = startedAt.slice(0, 10) || new Date().toISOString().slice(0, 10);
  const crossRefs = extractCrossRefs(userMsgs, allTexts);

  const files = {};
  let clueData = null;
  let vectorData = null;
  let narrativeData = null;

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
    vectorData = parseHaikuOutput(vectorRaw);
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
    narrativeData = parseHaikuOutput(narrativeRaw);
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

  // Post-extraction low-info discard: silent skip when all 3 haiku extractions
  // produced empty payloads — enables retry via next SessionEnd once cooldown
  // expires. Two-track extensions (entropy/markers/coinage) are also skipped
  // since ghost sessions lack the semantic content they depend on.
  if (isLowInfo(clueData, vectorData, narrativeData)) {
    logErr(`low-info discard: all 3 extractions produced empty payloads — skipping write, retry eligible at next SessionEnd`);
    return;
  }

  // --- v0.4.0 Two-Track Extension ---
  // Deterministic extract/detect run first; coinage runs if budget allows.
  // Soft cap: TWO_TRACK_BUDGET_MS. On exhaustion, coinage is skipped while
  // markers + entropy refs remain intact (Anamnesis R1 fallback).
  const twoTrackStart = Date.now();

  try {
    const refs = extractEntropyRefs(allTexts);
    files["entropy.md"] = buildEntropyMd(sessionId, date, refs);
  } catch (e) {
    logErr(`entropy extraction failed: ${e.message}`);
  }

  try {
    const profile = detectMarkers(userMsgs, allTexts);
    files["markers.md"] = buildMarkersMd(sessionId, date, profile);
  } catch (e) {
    logErr(`marker detection failed: ${e.message}`);
  }

  try {
    const elapsed = Date.now() - twoTrackStart;
    const remaining = TWO_TRACK_BUDGET_MS - elapsed;
    if (remaining < COINAGE_MIN_REMAINING_MS) {
      files["coinage.md"] = buildCoinageMd(
        sessionId, date, null, true,
        `budget ${TWO_TRACK_BUDGET_MS}ms exhausted after ${elapsed}ms`,
      );
    } else {
      const corpusRoot = path.join(projectDir, "hypomnesis");
      const result = computeCoinage(userMsgs, allTexts, corpusRoot, sessionId, remaining);
      files["coinage.md"] = buildCoinageMd(sessionId, date, result, false, null);
    }
  } catch (e) {
    logErr(`coinage extraction failed: ${e.message}`);
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
