#!/usr/bin/env node
/**
 * Persist per-extractor and publication outcomes for Claude lifecycle capture.
 * SessionEnd applies the complete-publication cooldown; PreCompact bypasses that gate.
 * Semantic files and outcome sidecars are separate. Failed stages retain prior
 * published files; each replacement is atomic and acknowledged independently.
 * Nested extraction receives the prompt on stdin with tools and settings disabled.
 * The writer reports persisted state; startup failure exits nonzero for the dispatcher.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { randomUUID, createHash } from "node:crypto";
import { beginAttempt, finishAttempt, readOutcome, captureArtifacts, errorEvidence, boundedText, formatOutcome, takeSessionLock } from "../skills/recollect/scripts/hypomnesis-outcome.mjs";

function logErr(msg) {
  try { process.stderr.write(`[hypomnesis-write] ${msg}\n`); } catch {}
}

function toDateString(iso) {
  if (iso && iso.length >= 10) return iso.slice(0, 10);
  // Fallback uses extraction time, which may misalign for sessions spanning
  // midnight (relative-phrase normalization anchors to wrong day). Logged so
  // observability can surface degraded normalization frequency.
  const fallback = new Date().toISOString().slice(0, 10);
  logErr(`toDateString: missing/short ISO input (got ${JSON.stringify(iso)}); falling back to extraction time ${fallback} — temporal anchor may misalign for cross-day sessions`);
  return fallback;
}

// --- SIGHUP guard ---
try { process.on("SIGHUP", () => {}); } catch {}

const MIN_SESSION_BYTES = 1024;
const MAX_USER_MSGS = 150;

// A protocol is INVOKED in exactly two ways, and both leave a record: the user
// types the command, which the harness wraps in <command-name> (bare or
// plugin-namespaced), or the assistant calls the Skill tool. A bare mention in
// prose ("don't run /apportion") is neither, so it is not counted.
const invokes = (text, slash, plugin) => {
  // A namespace identifies the owner. A plugin-bound command admits its own
  // namespace or none; an unbound utility command admits only the bare form,
  // since a namespaced call of that name belongs to some other plugin.
  const ns = plugin ? `(?:${plugin}:)?` : "";
  return new RegExp(`<command-name>\\s*/${ns}${slash.slice(1)}(?![\\w-])`, "m").test(text);
};

const skillCalls = (content) =>
  Array.isArray(content)
    ? content
        .filter((b) => b?.type === "tool_use" && b.name === "Skill")
        .map((b) => String(b.input?.skill ?? ""))
        .filter(Boolean)
    : [];

// A Skill call names its skill as `plugin:skill` or bare. The namespace is part
// of the identity, and this applies the same rule invokes() applies to the
// user-command path: a bound plugin admits its own namespace or none, and an
// unbound utility command admits only the bare form — otherwise another
// plugin's same-named skill would be recorded as this one.
const resolveSkillProtocol = (called) => {
  const sep = called.indexOf(":");
  const ns = sep === -1 ? null : called.slice(0, sep);
  const hit = protocolMap[`/${sep === -1 ? called : called.slice(sep + 1)}`];
  if (!hit) return null;
  return ns === null || ns === hit[1] ? hit[0] : null;
};

// One entry per protocol plugin command, plus the utility commands worth
// recording. hypomnesis-write.test.mjs checks this against the plugin skill
// directories, so a protocol rename fails the suite instead of going silent.
const protocolMap = {
  "/inquire": ["inquire", "aitesis"],
  "/ground": ["ground", "analogia"], "/recollect": ["recollect", "anamnesis"],
  "/sublate": ["sublate", "elenchus"], "/contextualize": ["contextualize", "epharmoge"],
  "/elicit": ["elicit", "euporia"], "/ideate": ["ideate", "heuresis"],
  "/bound": ["bound", "horismos"], "/conduct": ["conduct", "hyphegesis"],
  "/grasp": ["grasp", "katalepsis"], "/apportion": ["apportion", "merismos"],
  "/induce": ["induce", "periagoge"], "/preview": ["preview", "proplasma"],
  "/frame": ["frame", "prothesis"], "/sketch": ["sketch", "hypotyposis"],
  "/route": ["route", "route"],
  "/clarify": ["clarify", null], "/goal": ["goal", null],
  "/reflect": ["reflect", null], "/write": ["write", null],
  "/verify": ["verify", null],
};

const MAX_ALL_CHARS = 80_000;
// String.slice sample limits are UTF-16 code units; MAX_ALL_CHARS bounds
// the parse buffer. Encoded stdin byte length also includes the prompt template.
const CLUE_SAMPLE_CHARS = 20_000;
const PROMPT_SAMPLE_CHARS = 30_000;
const HAIKU_TIMEOUT = 120_000;

// v0.4.0 two-track extension budgets.
// Soft cap on deterministic extract/coinage; the haiku calls (clue, vector,
// narrative, markers) are bounded separately by HAIKU_TIMEOUT and are
// unaffected by this budget.
//
// v0.4.24: MarkerProfile salience markers (actor/temporal/emotional/cognitive/
// singularity) migrated from regex to Haiku LLM extraction; coinage remains
// deterministic (Zipf-statistical, defined in SKILL.md ── SALIENCE MARKERS ──).
const TWO_TRACK_BUDGET_MS = 5_000;
const COINAGE_MIN_REMAINING_MS = 500;
const COINAGE_PRECISION_THRESHOLD = 0.5;
const COINAGE_MIN_SESSION_OCC = 2;
const COINAGE_MAX_OUTPUT = 30;
const MARKER_CAT_LIMIT = 30;
const ENTROPY_MAX_OUTPUT = 40;
const MARKER_EXTRACTION_METHOD = "haiku-marker-v1";
// Evidence modes — derived BY CONSTRUCTION from each artifact's production
// path (deterministic mjs metadata), never a Haiku judgment. The tier
// measures the EVIDENTIAL STANDING of the content (who stands behind it:
// user_constituted > attested > observed > inferred), NOT extractor
// reliability (extraction_method's concern). Ordering is recall ranking
// weight only, NEVER exclusion.
// HARMONIZATION: cross_refs as a whole are mechanically extracted (observed); the per-ref channel field (user/transcript) is an orthogonal utterance-channel annotation, not an evidence-mode override.
const EVIDENCE_MODES = Object.freeze({
  // initial_request / key_utterances pass through Haiku extraction (lossy INDEX
  // copy, same production path as markers) — attested, with the quote itself as
  // the claimed witness. user_constituted is reserved for SSOT-grade paths where
  // the user directly authors the artifact content; no such path exists here.
  clue: { initial_request: "attested", key_utterances: "attested",
          topics: "inferred", keywords: "inferred", cross_refs: "observed" },
  vector: "inferred",
  narrative: "inferred",
  entropy: "observed",
  coinage: "observed",
  markers: { coinage: "observed", actor: "attested", temporal: "attested",
             emotional: "attested", cognitive: "attested", singularity: "attested" },
});
// Observed reason values in ~/.claude/logs/hooks.log (33 days, 1408 records):
// other, prompt_input_exit, resume, clear. "compact" never observed — PreCompact
// does not trigger SessionEnd; the two events are temporally independent.
// "clear" was previously skipped without documented rationale, but /clear fires
// SessionEnd with intact payload; MIN_SESSION_BYTES + COOLDOWN_MS already cover
// the noise/duplicate cases an exclusion would address.
const SKIP_REASONS = new Set([]);
const KNOWN_EVENTS = new Set(["SessionEnd", "PreCompact"]);

// SessionEnd rate limit after a useful, physically complete publication.
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

function parseSession(raw) {
  const userMsgs = [];
  const allTexts = [];
  const timestamps = [];
  const protocols = new Set();
  let lastAssistantInputTokens = 0;
  let outputTokensSum = 0;
  let lastTurnHadFreshInput = false;
  let sawAnyAssistantUsage = false;
  // Latest cwd wins — Claude Code resolves the project slug from invocation cwd at resume time.
  let cwd = "";

  let parseFailed = false;
  let totalChars = 0;

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { parseFailed = true; continue; }

    const ts = entry.timestamp ?? "";
    if (ts) timestamps.push(ts);
    const etype = entry.type ?? "";
    if (typeof entry.cwd === "string" && entry.cwd) cwd = entry.cwd;

    if (etype === "user") {
      const text = textFromContent(entry.message?.content ?? "");
      if (!text) continue;
      for (const [slash, [name, plugin]] of Object.entries(protocolMap)) {
        if (invokes(text, slash, plugin)) protocols.add(name);
      }
      if (userMsgs.length < MAX_USER_MSGS) userMsgs.push({ text, ts });
    }

    if (etype === "assistant") {
      for (const called of skillCalls(entry.message?.content)) {
        const name = resolveSkillProtocol(called);
        if (name) protocols.add(name);
      }
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
    parseFailed,
    tokenEstimate,
    lastTurnHadFreshInput,
    sawAnyAssistantUsage,
    cwd,
  };
}

// --- Prompt Builders ---

function buildCluePrompt(userMsgs) {
  const cleaned = userMsgs
    .filter((m) => !isNoise(m.text))
    .map((m) => cleanText(m.text))
    .filter((t) => t.length > 5);

  const sample = cleaned.slice(0, 30).join("\n---\n").slice(0, CLUE_SAMPLE_CHARS);

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
  const sample = allTexts.join("\n---\n").slice(0, PROMPT_SAMPLE_CHARS);

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
  const sample = allTexts.join("\n---\n").slice(0, PROMPT_SAMPLE_CHARS);
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

function buildMarkerPrompt(allTexts, startedAt) {
  const sample = allTexts.join("\n---\n").slice(0, PROMPT_SAMPLE_CHARS);
  const dateAnchor = toDateString(startedAt);

  return `You are a session indexer. Extract salience markers as concrete, anchored entities.

Output EXACTLY valid JSON, nothing else:
{
  "actor":      [{"name": "...", "role": "...", "phrase_in_text": "..."}],
  "temporal":   [{"iso": "YYYY-MM-DD", "phrase_in_text": "...", "kind": "date|datetime|range"}],
  "emotional":  [{"verbatim": "...", "polarity": "positive|negative|emphatic"}],
  "cognitive":  [{"verbatim": "...", "function": "contrast|cause|conclusion|qualification"}],
  "singularity":[{"verbatim": "..."}]
}

Rules:
- actor: named human individuals, role descriptors, and external advisor systems whose attribution persists across sessions.
- temporal: each entry must resolve to an absolute calendar reference. Convert relative time expressions to ISO date by anchoring against ${dateAnchor}. The kind field declares the resolved precision.
- emotional: verbatim quotes whose pragmatic function is stance signaling — emphasis, evaluative reaction, or affective intensity. The polarity field declares the resolved valence.
- cognitive: verbatim quotes featuring discourse connectives whose pragmatic function is signaling reasoning transitions — causal, adversative, or conclusive relations within argument structure. The function field declares the relation type.
- singularity: memorable user statements distinctive enough to anchor session recall — decisive judgments, strong stances, or distinctive coinage that summarizes the session's character.
- Each category: maximum ${MARKER_CAT_LIMIT} items. Empty arrays are valid; entries must be verifiable in the session text.
- All values stay in the language they were originally written in.

Session start date (for temporal anchoring): ${dateAnchor}

Session content:
${sample}`;
}

// --- Haiku Invocation ---

// The prompt is absent from argv by contract: --tools is variadic, so a
// positional prompt following it is consumed as a tool-name list.
//
function buildHaikuArgs() {
  return [
    "-p",
    "--no-session-persistence",
    "--model", "haiku",
    "--disable-slash-commands",
    "--strict-mcp-config",
    "--dangerously-skip-permissions",
    "--setting-sources", "",
    "--tools", "",
  ];
}

function callHaiku(prompt, { run = execFileSync } = {}) {
  return run("claude", buildHaikuArgs(), {
    encoding: "utf8", input: prompt, timeout: HAIKU_TIMEOUT,
    stdio: ["pipe", "pipe", "pipe"], maxBuffer: 8 * 1024 * 1024, cwd: "/tmp",
  }).trim();
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

function validateMarkers(data) {
  if (!data || typeof data !== "object") return false;
  for (const key of ["actor", "temporal", "emotional", "cognitive", "singularity"]) {
    if (!Array.isArray(data[key])) return false;
  }
  return true;
}

// --- File Builders ---

function buildClueMd(sessionId, date, startedAt, lastTurnAt, cwd, data, crossRefs) {
  const lines = [
    "---",
    `session_id: ${sessionId}`,
    `cwd: "${esc(cwd)}"`,
    `date: ${date}`,
    `started_at: ${startedAt}`,
    `last_turn_at: ${lastTurnAt}`,
    `topics: [${data.topics.map((t) => `"${esc(t)}"`).join(", ")}]`,
    `keywords: [${data.keywords.map((k) => `"${esc(k)}"`).join(", ")}]`,
    `initial_request: "${esc(data.initial_request)}"`,
    "key_utterances:",
    ...data.key_utterances.map((u) => `  - "${esc(u)}"`),
    ...(crossRefs.length === 0
      ? ["cross_refs: []"]
      : ["cross_refs:",
         ...crossRefs.map((r) => `  - {kind: ${r.kind}, ref: "${esc(r.ref)}", channel: ${r.channel}}`)]),
    "evidence_modes:",
    ...Object.entries(EVIDENCE_MODES.clue).map(([field, mode]) => `  ${field}: ${mode}`),
    `derived_from: ssot:${sessionId}`,
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
    `evidence_mode: ${EVIDENCE_MODES.vector}`,
    `derived_from: ssot:${sessionId}`,
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

function buildNarrativeMd(sessionId, date, startedAt, lastTurnAt, cwd, topics, protocols, data) {
  return [
    "---",
    `session_id: ${sessionId}`,
    `cwd: "${esc(cwd)}"`,
    `started_at: ${startedAt}`,
    `last_turn_at: ${lastTurnAt}`,
    `date: ${date}`,
    `topics: [${topics.join(", ")}]`,
    `protocols_used: [${protocols.join(", ")}]`,
    "continuations: []",
    "forks: []",
    // Re-indexing a pre-0.7 entry appends to narrative.md whose head
    // frontmatter keeps the old schema — acceptable under per-artifact
    // Null-neutral semantics.
    `evidence_mode: ${EVIDENCE_MODES.narrative}`,
    `derived_from: ssot:${sessionId}`,
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
//
// StructuredAnchor = { kind, ref, channel } — extends-edge sediment: a
// context-adding annotation for a later reader, never an authorization.
// kind reuses the ENTROPY_EXTRACTORS source_namespace vocabulary where
// overlapping (github_issue, github_pr); "memory" is sediment-local.
// StructuredAnchor is NOT an IdentifierTuple: no precision, no
// compatible_anchor — shared value vocabulary, separate machinery.
// Merge rules are order-independent: dedup key = ref; github_pr supersedes
// github_issue; channel "user" supersedes "transcript".
// Behavior preserved vs the pre-0.7 Set version: same regexes, same
// normalization, same cap 10, same lexicographic sort; bonus — recovers the
// PR-vs-issue distinction the old code discarded.

function extractCrossRefs(userMsgs, allTexts) {
  const refs = new Map(); // ref -> { kind, ref, channel }
  const memRe = /(?:memory\/[\w_]+\.md|project_[\w_]+\.md|feedback_[\w_]+\.md)/g;
  const issueRe = /(?:PR |#)(\d{1,4})\b/g;
  const add = (kind, ref, channel) => {
    const prev = refs.get(ref);
    if (!prev) { refs.set(ref, { kind, ref, channel }); return; }
    if (prev.kind === "github_issue" && kind === "github_pr") prev.kind = "github_pr";
    if (channel === "user") prev.channel = "user";
  };
  const channels = [
    ["user", userMsgs.slice(0, 20).map((m) => m.text)],
    ["transcript", allTexts.slice(0, 20)],
  ];
  for (const [channel, texts] of channels) {
    for (const t of texts) {
      for (const m of t.matchAll(memRe)) {
        const ref = m[0].startsWith("memory/") ? m[0] : `memory/${m[0]}`;
        add("memory", ref, channel);
      }
      for (const m of t.matchAll(issueRe)) {
        add(m[0].startsWith("PR") ? "github_pr" : "github_issue", `#${m[1]}`, channel);
      }
    }
  }
  return [...refs.values()]
    .sort((a, b) => a.ref.localeCompare(b.ref))
    .slice(0, 10);
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
// `namespace` is the canonical source_namespace materialized into each IdentifierTuple
// (entropy.md `source_namespace` column). It is the runtime witness for compatible_anchor:
// the recall trace's claim_kind must be authorized by this namespace via the SKILL.md registry.
const ENTROPY_EXTRACTORS = [
  { name: "url", namespace: "url", pattern: /\bhttps?:\/\/[^\s<>"'`)\]]+/g },
  { name: "pr_ref", namespace: "github_pr", pattern: /\bPR\s*#\d+\b/gi },
  { name: "issue_ref", namespace: "github_issue", pattern: /(?<![\w-])#\d{1,5}\b/g },
  { name: "session_id", namespace: "session", pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g },
  { name: "commit_sha", namespace: "git_commit", pattern: /(?<![\w-])[0-9a-f]{7,40}(?![\w-])/g },
  { name: "path_ref", namespace: "fs_path", pattern: /\b[\w.-]+\/[\w./-]+\.\w{1,6}\b/g },
];

function extractEntropyRefs(allTexts) {
  const refs = new Map();
  for (const text of allTexts) {
    const urlSpans = [];
    for (const { name, namespace, pattern } of ENTROPY_EXTRACTORS) {
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
          refs.set(literal, { literal, source: name, source_namespace: namespace, count: 1 });
        }
      }
    }
  }
  return [...refs.values()]
    .sort((a, b) => b.count - a.count || a.literal.localeCompare(b.literal))
    .slice(0, ENTROPY_MAX_OUTPUT);
}

// MarkerProfile salience extraction — migrated from regex (v0.4.0) to Haiku
// LLM extraction (v0.4.24). The 5 semantic categories (actor / temporal /
// emotional / cognitive / singularity) are extracted by buildMarkerPrompt +
// callHaiku; the 6th category (coinage) remains deterministic via
// computeCoinage below — the SKILL.md coinage(s, corpus, θ) formula is the
// authoritative definition and must remain byte-aligned with this function.
//
// Per SKILL.md ── SALIENCE MARKERS ── (v0.4.24): semantic invariants
// (traceability, boundedness, stability) replace prior exact laws
// (monotonicity, locality, idempotence) for Haiku-extracted categories.

// coinage: Session × Corpus × θ → CoinageSet
// salience_precision(t, s, corpus) = |occ(t, s)| / (1 + |occ(t, corpus \ {s})|)
function computeCoinage(userMsgs, allTexts, corpusPath, currentSessionId, budgetMs) {
  const start = Date.now();
  const sessionText = [
    ...userMsgs.map((m) => m.text),
    ...allTexts,
  ].join(" ").toLowerCase();
  // Coinage targets English technical vocabulary (function names, identifiers,
  // jargon). Korean natural-language tokens are handled by Haiku extraction in
  // the 5 semantic categories above; admitting the Hangul range
  // (U+AC00..U+D7A3) here would pollute coinage with common conversation
  // tokens that carry no salience.
  const tokenRe = /\b[a-zA-Z_][a-zA-Z_0-9-]{3,29}\b/g;
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
    `evidence_mode: ${EVIDENCE_MODES.entropy}`,
    `derived_from: ssot:${sessionId}`,
    "---",
    "",
    "## Identifier Tuples",
    "",
  ];
  if (refs.length === 0) {
    lines.push("No structured identifiers extracted.");
  } else {
    lines.push("| literal | source | source_namespace | session_count |");
    lines.push("|---------|--------|------------------|---------------|");
    for (const r of refs) {
      lines.push(`| \`${escMd(r.literal)}\` | ${r.source} | ${r.source_namespace} | ${r.count} |`);
    }
  }
  return lines.join("\n") + "\n";
}

// buildMarkersMd: assembles markers.md combining Haiku-extracted semantic
// categories (actor/temporal/emotional/cognitive/singularity) with the
// deterministic coinage statistics. extractionMethod is recorded in
// frontmatter for cross-version observability (no ranking influence).
function buildMarkersMd(sessionId, date, haikuMarkers, coinageResult, extractionMethod) {
  const coinageItems = coinageResult?.coinage ?? [];
  const counts = {
    coinage: coinageItems.length,
    actor: haikuMarkers.actor.length,
    temporal: haikuMarkers.temporal.length,
    emotional: haikuMarkers.emotional.length,
    cognitive: haikuMarkers.cognitive.length,
    singularity: haikuMarkers.singularity.length,
  };
  const lines = [
    "---",
    `session_id: ${sessionId}`,
    `date: ${date}`,
    `marker_categories: [coinage, actor, temporal, emotional, cognitive, singularity]`,
    `marker_counts: ${JSON.stringify(counts)}`,
    `extraction_method: ${extractionMethod}`,
    "evidence_modes:",
    ...Object.entries(EVIDENCE_MODES.markers).map(([field, mode]) => `  ${field}: ${mode}`),
    `derived_from: ssot:${sessionId}`,
    "---",
    "",
    "## MarkerProfile",
    "",
    `### coinage (${coinageItems.length})`,
  ];
  if (coinageItems.length === 0) {
    lines.push("_none_");
  } else {
    for (const c of coinageItems) {
      lines.push(`- \`${escMd(c.token)}\` (precision ${c.precision.toFixed(3)}, session ${c.sessionOcc} / corpus ${c.corpusOcc})`);
    }
  }
  lines.push("");

  // Optional chaining (i?.x) guards against null/undefined array elements,
  // since validateMarkers only checks Array shape, not item structure.
  const renderers = {
    actor: (items) => items.map((i) => `- ${escMd(i?.name ?? "")} (role: ${escMd(i?.role ?? "")}, phrase: \`${escMd(i?.phrase_in_text ?? "")}\`)`),
    temporal: (items) => items.map((i) => `- ${escMd(i?.iso ?? "")} (phrase: \`${escMd(i?.phrase_in_text ?? "")}\`, kind: ${escMd(i?.kind ?? "")})`),
    emotional: (items) => items.map((i) => `- ${escMd(i?.verbatim ?? "")} (polarity: ${escMd(i?.polarity ?? "")})`),
    cognitive: (items) => items.map((i) => `- ${escMd(i?.verbatim ?? "")} (function: ${escMd(i?.function ?? "")})`),
    singularity: (items) => items.map((i) => `- ${escMd(i?.verbatim ?? "")}`),
  };
  for (const cat of ["actor", "temporal", "emotional", "cognitive", "singularity"]) {
    const items = haikuMarkers[cat];
    lines.push(`### ${cat} (${items.length})`);
    if (items.length === 0) {
      lines.push("_none_");
    } else {
      lines.push(...renderers[cat](items));
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
    `evidence_mode: ${EVIDENCE_MODES.coinage}`,
    `derived_from: ssot:${sessionId}`,
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

function writeStore(targetDir, files, revision) {
  fs.mkdirSync(targetDir, { recursive: true, mode: 0o755 });
  const artifacts = [];
  const errors = {};
  for (const [name, content] of Object.entries(files)) {
    const dest = path.join(targetDir, name);
    const tmp = path.join(targetDir, `.${name}.${randomUUID()}.tmp`);
    try {
      const priorBytes = name === "narrative.md" && fs.existsSync(dest) ? fs.readFileSync(dest) : null;
      const previous = priorBytes ? priorBytes.toString("utf8") + "\n" : "";
      fs.writeFileSync(tmp, previous + content, "utf8");
      const acknowledged = captureArtifacts([tmp]).map((artifact) => ({ ...artifact, path: path.resolve(dest), revision,
        ...(priorBytes?.length ? { appended_from_sha256: createHash("sha256").update(priorBytes).digest("hex") } : {}),
      }));
      fs.renameSync(tmp, dest);
      artifacts.push(...acknowledged);
    } catch (error) { errors[name] = errorEvidence(error); }
    finally { try { fs.unlinkSync(tmp); } catch {} }
  }
  return { state: Object.keys(errors).length ? artifacts.length ? "partial" : "failed" : "complete", artifacts, errors };
}

function readClaudeSnapshot(filename) {
  const fd = fs.openSync(filename, "r");
  try {
    const stat = fs.fstatSync(fd);
    const bytes = fs.readFileSync(fd).subarray(0, stat.size);
    return { raw: bytes.toString("utf8"), revision: {
      mtime_ms: Math.floor(stat.mtimeMs), size: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    } };
  } finally { fs.closeSync(fd); }
}

function processClaudeInput(input, { run = execFileSync, publish = writeStore } = {}) {
  const sessionId = input?.session_id;
  const transcriptPath = input?.transcript_path;
  if (typeof sessionId !== "string" || !/^[A-Za-z0-9_-]+$/.test(sessionId)
    || typeof transcriptPath !== "string" || !path.isAbsolute(transcriptPath)) {
    logErr("invalid hook input: no trustworthy session/store locator");
    return null;
  }
  const event = input.hook_event_name ?? "SessionEnd";
  if (!KNOWN_EVENTS.has(event) || (event === "SessionEnd" && SKIP_REASONS.has(input.reason))) return null;
  const root = path.join(path.dirname(transcriptPath), "hypomnesis");
  const storeDir = path.join(root, sessionId);
  const release = takeSessionLock(root, sessionId);
  if (!release) return readOutcome(root, sessionId);
  let attempt;
  const extractors = {};
  let publication = { state: "none", artifacts: [] };
  try {
    let revision = null;
    let snapshot;
    let inputError;
    try { snapshot = readClaudeSnapshot(transcriptPath); revision = snapshot.revision; } catch (error) { inputError = error; }
    const previous = readOutcome(root, sessionId, "claude");
    const published = previous.attempt?.last_publication;
    const cooldown = event === "SessionEnd" && published?.state === "complete" && published.artifacts.length > 0
      && Date.now() - Date.parse(published.at) < COOLDOWN_MS
      && published.artifacts.every((artifact) => previous.artifacts.some((item) => item.path === artifact.path && item.sha256 === artifact.sha256 && !["missing", "mismatch", "outside_scope"].includes(item.verification)));
    attempt = beginAttempt(root, sessionId, { runtime: "claude", revision, source_transcript: transcriptPath, source_event: event });
    if (!attempt) return readOutcome(root, sessionId);
    if (inputError) throw Object.assign(inputError, { stage: "input_failed" });
    if (cooldown) {
      extractors.input = { state: "skipped", reason: "complete capture cooldown active" };
      finishAttempt(root, attempt, { state: "complete", extractors, publication });
      return readOutcome(root, sessionId);
    }
    if (revision.size < MIN_SESSION_BYTES) {
      extractors.input = { state: "skipped", reason: "transcript below minimum capture size" };
      finishAttempt(root, attempt, { state: "complete", extractors, publication });
      return readOutcome(root, sessionId);
    }
    let session;
    try { session = parseSession(snapshot.raw); } catch (error) { throw Object.assign(error, { stage: "input_failed" }); }
    if (session.parseFailed) extractors.input = { state: "input_failed", reason: "malformed JSONL input" };
    if (session.userMsgs.length === 0) {
      extractors.input ??= { state: "empty", reason: "no user messages" };
      finishAttempt(root, attempt, { state: "complete", extractors, publication });
      return readOutcome(root, sessionId);
    }
    const { userMsgs, allTexts, timestamps, protocols, cwd } = session;
    const startedAt = timestamps[0] ?? "";
    const lastTurnAt = timestamps.at(-1) ?? "";
    const date = toDateString(startedAt);
    const crossRefs = extractCrossRefs(userMsgs, allTexts);
    const files = {};
    const extract = (name, prompt, validate, empty, filename, build) => {
      let raw;
      try { raw = callHaiku(prompt, { run }); }
      catch (error) { extractors[name] = { state: "invocation_failed", evidence: errorEvidence(error) }; return null; }
      try {
        const data = parseHaikuOutput(raw);
        if (!validate(data)) throw new Error("extraction schema rejected");
        const isEmpty = empty(data);
        extractors[name] = { state: isEmpty ? "empty" : "succeeded" };
        if (!isEmpty) files[filename] = build(data);
        return data;
      } catch (error) {
        extractors[name] = { state: "validation_failed", evidence: errorEvidence(error), output: boundedText(raw) };
        return null;
      }
    };
    const clue = extract("clue", buildCluePrompt(userMsgs), validateClue,
      (data) => !data.initial_request.trim() && !data.key_utterances.length && !data.topics.length && !data.keywords.length,
      "clue.md", (data) => buildClueMd(sessionId, date, startedAt, lastTurnAt, cwd, data, crossRefs));
    extract("vector", buildVectorPrompt(allTexts), validateVector,
      (data) => !data.decisions.length, "vector.md", (data) => buildVectorMd(sessionId, date, data));
    extract("narrative", buildNarrativePrompt(allTexts, protocols), validateNarrative,
      (data) => !data.origin.trim() && !data.direction.trim() && !data.outcome.trim(), "narrative.md",
      (data) => buildNarrativeMd(sessionId, date, startedAt, lastTurnAt, cwd, clue?.topics ?? [], protocols, data));
    if (["clue", "vector", "narrative"].every((name) => extractors[name].state === "empty")) {
      extractors.marker = extractors.entropy = extractors.coinage = { state: "skipped", reason: "validated-empty primary extraction" };
      finishAttempt(root, attempt, { state: "complete", extractors, publication });
      return readOutcome(root, sessionId);
    }
    const markers = extract("marker", buildMarkerPrompt(allTexts, startedAt), validateMarkers,
      (data) => Object.values(data).every((items) => Array.isArray(items) && !items.length), "markers.md",
      (data) => buildMarkersMd(sessionId, date, data, null, MARKER_EXTRACTION_METHOD));
    const started = Date.now();
    try {
      const refs = extractEntropyRefs(allTexts);
      extractors.entropy = { state: refs.length ? "succeeded" : "empty" };
      if (refs.length) files["entropy.md"] = buildEntropyMd(sessionId, date, refs);
    } catch (error) { extractors.entropy = { state: "validation_failed", evidence: errorEvidence(error) }; }
    try {
      const remaining = TWO_TRACK_BUDGET_MS - (Date.now() - started);
      if (remaining < COINAGE_MIN_REMAINING_MS) extractors.coinage = { state: "skipped", reason: "computation budget exhausted" };
      else {
        const coinage = computeCoinage(userMsgs, allTexts, root, sessionId, remaining);
        extractors.coinage = { state: coinage.coinage.length ? "succeeded" : "empty" };
        if (coinage.coinage.length) files["coinage.md"] = buildCoinageMd(sessionId, date, coinage, false, null);
        if (markers && (extractors.marker.state === "succeeded" || coinage.coinage.length)) files["markers.md"] = buildMarkersMd(sessionId, date, markers, coinage, MARKER_EXTRACTION_METHOD);
      }
    } catch (error) { extractors.coinage = { state: "validation_failed", evidence: errorEvidence(error) }; }
    if (!release.owned() || readOutcome(root, sessionId, "claude").attempt?.attempt_id !== attempt.attempt_id) {
      return readOutcome(root, sessionId, "claude");
    }
    if (Object.keys(files).length) {
      try { publication = publish(storeDir, files, revision); }
      catch (error) { publication = { state: "failed", artifacts: [], evidence: errorEvidence(error) }; }
    }
    finishAttempt(root, attempt, { state: "complete", extractors, publication });
    return readOutcome(root, sessionId);
  } catch (error) {
    if (error.operation === "outcome_persistence") throw error;
    const failure = error.stage === "input_failed"
      ? { extractors: { ...extractors, input: { state: "input_failed", evidence: errorEvidence(error) } } }
      : { execution: { state: "failed", evidence: errorEvidence(error) } };
    if (attempt) {
      finishAttempt(root, attempt, { state: "complete", extractors, publication, ...failure });
      return readOutcome(root, sessionId);
    }
    throw error;
  } finally { release(); }
}

function main() {
  const result = processClaudeInput(readHookInput());
  if (result) process.stderr.write(formatOutcome(result) + "\n");
}

export {
  extractCrossRefs,
  buildClueMd,
  buildMarkersMd,
  buildHaikuArgs,
  processClaudeInput,
  writeStore,
  callHaiku,
  invokes,
  skillCalls,
  resolveSkillProtocol,
  protocolMap,
  PROMPT_SAMPLE_CHARS,
};
// realpath comparison so symlinked invocation (plugin cache) still runs main; import-detection is best-effort, fail-open to main.
let isMain = true; // fail-open: a hook that cannot prove it is imported must run
try {
  isMain = !!process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
} catch { isMain = true; }
if (isMain) {
  try { main(); } catch (e) { logErr(`top-level: ${e.message}`); process.exitCode = 1; }
}
