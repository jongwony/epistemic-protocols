// Tests for hypomnesis-write.mjs typed cross_refs anchors (v0.7.0) and
// evidence-mode frontmatter. Run with: node --test
// Repo precedent: scripts/package.test.js (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractCrossRefs,
  buildClueMd,
  buildMarkersMd,
  buildHaikuArgs,
  callHaiku,
  buildCoverages,
  scanOf,
  parseSession,
  joinedLength,
  sourceScanLines,
  fullTextSample,
  buildNarrativePrompt,
  invokes,
  skillCalls,
  resolveSkillProtocol,
  protocolMap,
} from "./hypomnesis-write.mjs";

const msg = (text) => ({ text, ts: "2026-06-11T00:00:00Z" });

// Note: the PR-branch of issueRe /(?:PR |#)(\d{1,4})\b/ matches the literal
// form "PR 5" (PR + space + digits). In "PR #5" the regex consumes "#5"
// (issue form) — regex preserved verbatim from pre-0.7 behavior.
test("PR-vs-issue kind split", () => {
  const prOnly = extractCrossRefs([msg("see PR 5")], []);
  assert.deepEqual(prOnly, [{ kind: "github_pr", ref: "#5", channel: "user" }]);

  const issueOnly = extractCrossRefs([msg("see #5")], []);
  assert.deepEqual(issueOnly, [{ kind: "github_issue", ref: "#5", channel: "user" }]);

  const both = extractCrossRefs([msg("see #5 and later PR 5")], []);
  assert.deepEqual(both, [{ kind: "github_pr", ref: "#5", channel: "user" }]);
});

test("github_pr supersedes github_issue regardless of order", () => {
  const prFirst = extractCrossRefs([msg("PR 5 then #5")], []);
  assert.equal(prFirst[0].kind, "github_pr");
  const issueFirst = extractCrossRefs([msg("#5 then PR 5")], []);
  assert.equal(issueFirst[0].kind, "github_pr");
});

test("channel supersession: ref in both lists -> user", () => {
  const refs = extractCrossRefs([msg("issue #42")], ["transcript mentions #42 too"]);
  assert.deepEqual(refs, [{ kind: "github_issue", ref: "#42", channel: "user" }]);

  // transcript-only ref stays transcript
  const tOnly = extractCrossRefs([], ["assistant cites #43"]);
  assert.deepEqual(tOnly, [{ kind: "github_issue", ref: "#43", channel: "transcript" }]);
});

test("memory normalization: project_x.md -> memory/project_x.md, kind memory", () => {
  const refs = extractCrossRefs([msg("check project_x.md please")], []);
  assert.deepEqual(refs, [{ kind: "memory", ref: "memory/project_x.md", channel: "user" }]);

  const already = extractCrossRefs([msg("check memory/feedback_y.md")], []);
  assert.deepEqual(already, [{ kind: "memory", ref: "memory/feedback_y.md", channel: "user" }]);
});

test("cap 10 + lexicographic sort stability", () => {
  const text = Array.from({ length: 15 }, (_, i) => `issue #${100 + i}`).join(" ");
  const refs = extractCrossRefs([msg(text)], []);
  assert.equal(refs.length, 10);
  const sorted = [...refs].sort((a, b) => a.ref.localeCompare(b.ref));
  assert.deepEqual(refs, sorted);
});

const clueData = {
  topics: ["topic1"],
  keywords: ["kw1"],
  initial_request: "do the thing",
  key_utterances: ["just ship it"],
};

test("buildClueMd: empty cross_refs renders cross_refs: []", () => {
  const md = buildClueMd("sid-1", "2026-06-11", "2026-06-11T00:00:00Z", "2026-06-11T01:00:00Z", "/tmp", clueData, []);
  assert.ok(md.split("\n").includes("cross_refs: []"));
  assert.ok(!md.includes("cross_refs:\n"));
});

test("buildClueMd: structured anchor lines are valid inline mappings with quoted ref", () => {
  const refs = extractCrossRefs([msg("see #309 and memory/project_x.md")], []);
  const md = buildClueMd("sid-2", "2026-06-11", "2026-06-11T00:00:00Z", "2026-06-11T01:00:00Z", "/tmp", clueData, refs);
  assert.ok(md.includes('ref: "#309"'));
  const itemLines = md.split("\n").filter((l) => l.startsWith("  - {"));
  assert.equal(itemLines.length, 2);
  const itemRe = /^ {2}- \{kind: (memory|github_issue|github_pr), ref: ".*", channel: (user|transcript)\}$/;
  for (const line of itemLines) {
    assert.match(line, itemRe);
  }
});

test("buildClueMd: evidence_modes block + derived_from present", () => {
  const md = buildClueMd("sid-3", "2026-06-11", "2026-06-11T00:00:00Z", "2026-06-11T01:00:00Z", "/tmp", clueData, []);
  const lines = md.split("\n");
  assert.ok(lines.includes("evidence_modes:"));
  assert.ok(lines.includes("  initial_request: attested"));
  assert.ok(lines.includes("  key_utterances: attested"));
  assert.ok(lines.includes("  topics: inferred"));
  assert.ok(lines.includes("  keywords: inferred"));
  assert.ok(lines.includes("  cross_refs: observed"));
  assert.ok(lines.includes("derived_from: ssot:sid-3"));
});

const emptyMarkers = { actor: [], temporal: [], emotional: [], cognitive: [], singularity: [] };

test("buildMarkersMd: evidence_modes is a multi-line YAML mapping (clue.md pattern), not inline JSON", () => {
  const md = buildMarkersMd("sid-4", "2026-06-11", emptyMarkers, { coinage: [] }, "haiku");
  const lines = md.split("\n");
  assert.ok(lines.includes("evidence_modes:"));
  assert.ok(lines.includes("  coinage: observed"));
  assert.ok(lines.includes("  actor: attested"));
  assert.ok(lines.includes("  temporal: attested"));
  assert.ok(lines.includes("  emotional: attested"));
  assert.ok(lines.includes("  cognitive: attested"));
  assert.ok(lines.includes("  singularity: attested"));
  assert.ok(!md.includes("evidence_modes: {"));
  assert.ok(lines.includes("derived_from: ssot:sid-4"));
});

// --- protocol invocation detection ---

test("invokes counts only real invocation records, not prose mentions", () => {
  // the two channels that actually record an invocation
  assert.equal(invokes("<command-name>/apportion</command-name>", "/apportion", "merismos"), true);
  assert.equal(invokes("<command-name>/merismos:apportion</command-name>", "/apportion", "merismos"), true);
  assert.equal(invokes("  <command-name>/apportion</command-name> ok", "/apportion", "merismos"), true);
  // a mention is not a use
  assert.equal(invokes("don't run /apportion here", "/apportion", "merismos"), false);
  assert.equal(invokes("/apportion the goal", "/apportion", "merismos"), false);
  // wrong plugin namespace, prefix collision, absent command
  assert.equal(invokes("<command-name>/unrelated:apportion</command-name>", "/apportion", "merismos"), false);
  assert.equal(invokes("<command-name>/apportionment</command-name>", "/apportion", "merismos"), false);
  assert.equal(invokes("<command-name>/background</command-name>", "/ground", "analogia"), false);
  assert.equal(invokes("nothing here", "/apportion", "merismos"), false);
});

test("skillCalls extracts assistant-side Skill invocations only", () => {
  assert.deepEqual(
    skillCalls([
      { type: "tool_use", name: "Skill", input: { skill: "merismos:apportion" } },
      { type: "tool_use", name: "Bash", input: { command: "echo /apportion" } },
      { type: "text", text: "/apportion mentioned" },
      { type: "tool_use", name: "Skill", input: { skill: "conduct" } },
    ]),
    ["merismos:apportion", "conduct"],
  );
  assert.deepEqual(skillCalls("not an array"), []);
  assert.deepEqual(skillCalls([{ type: "tool_use", name: "Skill", input: {} }]), []);
});

// The assistant path must reject a foreign namespace exactly as invokes() does
// on the user-command path; otherwise unrelated:apportion records as Merismos.
test("resolveSkillProtocol honours the plugin namespace", () => {
  assert.equal(resolveSkillProtocol("merismos:apportion"), "apportion");
  assert.equal(resolveSkillProtocol("apportion"), "apportion");
  assert.equal(resolveSkillProtocol("unrelated:apportion"), null);
  assert.equal(resolveSkillProtocol("nosuchskill"), null);
  // An unbound utility command admits only the bare form: a namespaced call of
  // that name belongs to another plugin, on both paths.
  assert.equal(resolveSkillProtocol("verify"), "verify");
  assert.equal(resolveSkillProtocol("anything:verify"), null);
  assert.equal(invokes("<command-name>/verify", "/verify", null), true);
  assert.equal(invokes("<command-name>/anything:verify", "/verify", null), false);
  assert.equal(invokes("<command-name>/unrelated:apportion", "/apportion", "merismos"), false);
});

// A protocol rename, or a newly added protocol plugin, must fail here rather
// than silently dropping the protocol from every hypomnesis record.
test("protocolMap covers every protocol plugin command on disk", () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  const skipDirs = new Set(["epistemic-cooperative", "node_modules", "scripts", "docs"]);
  const commands = [];
  for (const plugin of fs.readdirSync(repoRoot, { withFileTypes: true })) {
    if (!plugin.isDirectory() || plugin.name.startsWith(".") || skipDirs.has(plugin.name)) continue;
    const skillsDir = path.join(repoRoot, plugin.name, "skills");
    if (!fs.existsSync(skillsDir)) continue;
    for (const skill of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!skill.isDirectory()) continue;
      if (!fs.existsSync(path.join(skillsDir, skill.name, "SKILL.md"))) continue;
      commands.push([`/${skill.name}`, plugin.name]);
    }
  }
  assert.ok(commands.length > 0, "discovery found no protocol skills — the sweep itself is broken");
  const missing = commands.filter(([c]) => !(c in protocolMap));
  assert.deepEqual(missing, [], `protocolMap is missing: ${missing.map(([c]) => c).join(", ")}`);
  const wrongPlugin = commands.filter(([c, p]) => protocolMap[c]?.[1] !== p);
  assert.deepEqual(wrongPlugin, [], `protocolMap plugin mismatch: ${wrongPlugin.map(([c, p]) => `${c} should be ${p}`).join(", ")}`);
});

// --tools is variadic, so anything positional trailing it is parsed as a
// tool-name list and the CLI then exits with "Input must be provided" — every
// extraction returns empty and the record is discarded. Both properties are
// asserted together: the guard stays, and no positional rides behind it.
test("buildHaikuArgs keeps --tools \"\" and carries no positional prompt", () => {
  const args = buildHaikuArgs();
  const toolsAt = args.indexOf("--tools");
  assert.notEqual(toolsAt, -1, "--tools \"\" is the injection guard — it must not be dropped");
  assert.equal(args[toolsAt + 1], "", "--tools must disable every built-in tool");
  assert.equal(toolsAt + 1, args.length - 1, "nothing may follow --tools: it would be read as a tool name");
  for (const a of args) {
    assert.ok(a === "" || a.startsWith("-") || args[args.indexOf(a) - 1]?.startsWith("-"),
      `argv carries a stray positional: ${JSON.stringify(a)}`);
  }
});

test("callHaiku delivers the prompt on stdin, never in argv", () => {
  const prompt = "Session content:\n--tools !errors.As --base -p decoy tokens";
  let seen = null;
  const out = callHaiku(prompt, {
    run: (file, args, opts) => { seen = { file, args, opts }; return "  result  "; },
  });
  assert.equal(out, "result");
  assert.equal(seen.file, "claude");
  assert.equal(seen.opts.input, prompt, "prompt must travel on stdin");
  assert.ok(!seen.args.includes(prompt), "prompt must not appear in argv");
  // A prompt fragment reaching argv would be captured by --tools just as the
  // whole prompt was; assert the argv is exactly the flag set.
  assert.deepEqual(seen.args, buildHaikuArgs());
});

// The assertion above reads the options object; it would still hold if the
// options stopped delivering stdin to a child at all (stdio "ignore" passes it).
// This one substitutes only the binary and keeps the options callHaiku built,
// so a real child process has to receive the prompt on fd 0 for it to pass.
test("callHaiku's options deliver stdin to a real child process", () => {
  const prompt = `carried-on-stdin-${process.pid}-${Date.now()}`;
  const echo = "process.stdout.write(require('node:fs').readFileSync(0, 'utf8'))";
  const out = callHaiku(prompt, {
    run: (_file, _args, opts) => execFileSync(process.execPath, ["-e", echo], opts),
  });
  assert.equal(out, prompt, "the child read something other than the prompt from stdin");
});

// --- source_scan: the record says how much of its source it read ---

const TEXT_SEPARATOR_LEN = "\n---\n".length;

// The separators a joined sample spends are characters of the bound, so a
// whole-source count that omits them subtracts to less than the real gap. The
// falsifying case is two texts that exactly fill the bound between them: the
// prompt is truncated and a raw-sum count still reports a complete read.
test("omitted_chars: a sample the prompt flagged as truncated never publishes zero", () => {
  const texts = ["a".repeat(15_000), "b".repeat(15_000)];
  const { sample, truncated } = fullTextSample(texts);
  assert.ok(truncated, "the joined form exceeds the bound — the fixture must reach the cut");
  const rawSum = texts.reduce((n, t) => n + t.length, 0);
  assert.equal(Math.max(0, rawSum - sample.length), 0,
    "a raw-sum count is what this guards against; if this stops holding the fixture drifted");
  // The measurement buildCoverages performs, both sides joined.
  const cov = buildCoverages({
    userMsgs: [], allTexts: texts, allTextIsUser: [false, false],
    totalTextChars: rawSum, totalTextCount: texts.length,
    totalUserChars: 0, totalUserCount: 0,
  });
  assert.ok(cov.semantic > 0,
    "truncated prompt with omitted_chars 0 — the frontmatter contradicts the prompt");
  assert.equal(cov.semantic, TEXT_SEPARATOR_LEN);
});

test("joinedLength: one separator per pair, none for a single text or none at all", () => {
  assert.equal(joinedLength(0, 0), 0);
  assert.equal(joinedLength(100, 1), 100);
  assert.equal(joinedLength(100, 2), 100 + TEXT_SEPARATOR_LEN);
  assert.equal(joinedLength(100, 4), 100 + TEXT_SEPARATOR_LEN * 3);
  // Measured against the real join rather than against the formula restated.
  const texts = ["ab", "cd", "ef"];
  assert.equal(joinedLength(6, 3), texts.join("\n---\n").length);
});

test("scanOf: unparsable transcript lines are counted", () => {
  assert.equal(scanOf(3, [{ ok: true }, 0]).skipped_lines, 3);
  // Claude has no cross-check channel for human turns; 0 means unwitnessed.
  assert.equal(scanOf(3, [{ ok: true }, 0]).unverified_user_turns, 0);
});

// An extraction's coverage is what its own bound kept it from reading. The
// cases below are session shapes where two bounds disagree; one number cannot
// satisfy both.
test("buildCoverages: each bound reports its own omission", () => {
  const text = "u".repeat(25_000);
  const cov = buildCoverages({
    userMsgs: [{ text, ts: "" }], allTexts: [text], allTextIsUser: [true],
    totalTextChars: text.length, totalTextCount: 1,
    totalUserChars: text.length, totalUserCount: 1,
  });
  // 25,000 characters of user text: the clue prompt takes 20,000 of them, and
  // neither the 30k semantic bound nor the 80k buffer bound is reached.
  assert.equal(cov.cluePrompt, 5_000);
  assert.equal(cov.semantic, 0);
  assert.equal(cov.entropy, 0);
});

test("buildCoverages: the semantic bound cuts where the parse buffer does not", () => {
  const texts = ["a".repeat(25_000), "b".repeat(25_000)];
  const cov = buildCoverages({
    userMsgs: [], allTexts: texts, allTextIsUser: [false, false],
    totalTextChars: 50_000, totalTextCount: 2,
    totalUserChars: 0, totalUserCount: 0,
  });
  assert.equal(cov.semantic, 50_000 + TEXT_SEPARATOR_LEN - 30_000);
  assert.equal(cov.entropy, 0, "the 80k buffer held the whole session");
  assert.notEqual(cov.semantic, cov.entropy,
    "one shared number cannot describe both — that is what the split exists for");
});

test("buildCoverages: user messages dropped past the retention cap are counted", () => {
  const text = "m".repeat(100);
  const cov = buildCoverages({
    userMsgs: Array.from({ length: 150 }, () => ({ text, ts: "" })),
    allTexts: [text], allTextIsUser: [true],
    totalTextChars: 100, totalTextCount: 1,
    // 200 user messages reached the transcript; MAX_USER_MSGS retained 150.
    totalUserChars: 100 * 200, totalUserCount: 200,
  });
  assert.ok(cov.cluePrompt > 0,
    "50 user messages never reached the clue stream — the record must not read as whole");
});

test("buildCoverages: the cross-ref bound cuts where the clue prompt's does not", () => {
  // 21 short user messages. The clue prompt takes 30, so its own bound cuts
  // nothing; extractCrossRefs takes 20, so the 21st message never reached it.
  const texts = Array.from({ length: 21 }, (_, i) => `message-${String(i).padStart(2, "0")}`);
  const chars = texts.reduce((n, t) => n + t.length, 0);
  const cov = buildCoverages({
    userMsgs: texts.map((text) => ({ text, ts: "" })),
    allTexts: texts, allTextIsUser: texts.map(() => true),
    totalTextChars: chars, totalTextCount: texts.length,
    totalUserChars: chars, totalUserCount: texts.length,
  });
  assert.equal(cov.cluePrompt, 0, "the clue prompt's own bound took all 21");
  assert.equal(cov.crossRefs, texts[20].length + TEXT_SEPARATOR_LEN,
    "the message past the cross-ref bound is what that extractor did not read");
});

test("buildCoverages: coinage is not charged for text its second channel delivered", () => {
  // The final user message is past MAX_ALL_CHARS and so never enters allTexts,
  // but computeCoinage also reads userMsgs, which still carries it. entropy
  // reads allTexts alone and is charged for it; coinage is not.
  const first = "u".repeat(15);
  const bulk = "a".repeat(80_000);
  const last = "l".repeat(26);
  const cov = buildCoverages({
    userMsgs: [{ text: first, ts: "" }, { text: last, ts: "" }],
    allTexts: [first, bulk], allTextIsUser: [true, false],
    totalTextChars: first.length + bulk.length + last.length, totalTextCount: 3,
    totalUserChars: first.length + last.length, totalUserCount: 2,
  });
  assert.equal(cov.coinage, 0, "coinage read every source message across its two channels");
  assert.equal(cov.entropy, last.length + TEXT_SEPARATOR_LEN,
    "entropy reads the parse buffer alone, so the final message is absent from it");
});

// A file is charged for a bound only where something actually came through it.
test("scanOf: an extraction that produced nothing contributes no coverage", () => {
  assert.equal(scanOf(0, [null, 5_000], [{ ok: true }, 0]).omitted_chars, 0,
    "a failed extraction must not charge the file it never reached");
  assert.equal(scanOf(0, [{ ok: true }, 5_000], [{ ok: true }, 0]).omitted_chars, 5_000,
    "the widest omission among what did contribute");
  assert.equal(scanOf(3, [{ ok: true }, 0]).skipped_lines, 3,
    "the parse-level count rides on every published scan");
});

test("scanOf: nothing contributed means no scan, not a scan of zeros", () => {
  assert.equal(scanOf(0, [null, 5_000]), null);
  assert.equal(scanOf(4, [null, 0], [undefined, 9]), null);
  assert.deepEqual(sourceScanLines(scanOf(0, [null, 5_000])), [],
    "an unmeasured read publishes no field; zeros would claim a read nobody performed");
});

test("parseSession hands buildCoverages every field it reads", () => {
  // The wiring, not the arithmetic. buildCoverages is reachable with a
  // hand-built object that a real parse never produces, so a field the parse
  // stops returning fails nowhere else — it reaches the writer as undefined and
  // only the written artifact shows it.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hyp-parse-"));
  const tp = path.join(dir, "sid.jsonl");
  const row = (type, text) => JSON.stringify({
    type, timestamp: "2026-09-16T00:00:00.000Z", cwd: "/tmp",
    message: { role: type, content: [{ type: "text", text }] },
  });
  fs.writeFileSync(tp, [
    row("user", "first user message with enough length"),
    row("assistant", "an assistant reply of some length"),
    row("user", "second user message with enough length"),
  ].join("\n") + "\n");
  try {
    const parsed = parseSession(tp);
    assert.ok(Array.isArray(parsed.allTextIsUser), "parseSession returns the channel flags");
    assert.deepEqual(parsed.allTextIsUser, [true, false, true]);
    const cov = buildCoverages(parsed);
    for (const [name, omitted] of Object.entries(cov)) {
      assert.equal(omitted, 0, `${name} read this short session whole`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// The published artifact, not a builder. Every defect this field has carried
// survived a green unit suite, because a unit test hands a builder the scan it
// wants and never asks which scan the writer would have paired with that file.
// This runs the writer whole, fails one extraction, and reads what landed.
test("a file is not charged for an extraction that failed", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hyp-e2e-"));
  try {
    const sid = "probe";
    const bin = path.join(dir, "bin");
    fs.mkdirSync(bin);
    // Fails the clue call and answers the rest. narrative.md still gets built,
    // with `topics` falling back to [] — so nothing of the clue extraction is
    // in it, and its clue bound must not reach the published count.
    fs.writeFileSync(path.join(bin, "claude"), `#!/usr/bin/env node
const p = require("node:fs").readFileSync(0, "utf8");
if (p.includes("Extract recall anchors")) process.exit(3);
const out = p.includes("Extract decisions and direction changes")
  ? { decisions: [{ label: "d", what: "w", why: "y" }] }
  : p.includes("Write a concise session narrative")
  ? { origin: "o", direction: "d", outcome: "oc" }
  : { actor: [], temporal: [], emotional: [], cognitive: [], singularity: [] };
process.stdout.write(JSON.stringify(out));
`, { mode: 0o755 });
    // 25,000 characters in one user message: past the clue prompt's 20,000
    // bound, inside the semantic prompt's 30,000 one.
    const tp = path.join(dir, `${sid}.jsonl`);
    fs.writeFileSync(tp, JSON.stringify({
      type: "user", timestamp: "2026-09-17T00:00:00.000Z", cwd: "/probe",
      message: { role: "user", content: [{ type: "text", text: "x".repeat(25_000) }] },
    }) + "\n");

    const writer = fileURLToPath(new URL("./hypomnesis-write.mjs", import.meta.url));
    execFileSync(process.execPath, [writer], {
      input: JSON.stringify({
        session_id: sid, transcript_path: tp, hook_event_name: "PreCompact",
      }),
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      encoding: "utf8", stdio: ["pipe", "pipe", "pipe"],
    });

    const narrative = fs.readFileSync(
      path.join(dir, "hypomnesis", sid, "narrative.md"), "utf8",
    );
    const scan = narrative.match(/source_scan: \{[^}]*\}/)?.[0] ?? "";
    assert.ok(scan, "narrative.md published no scan at all");
    assert.match(scan, /omitted_chars: 0\b/,
      "the clue extraction failed and reached nothing into this file, "
      + "so its bound must not be charged here");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("sourceScanLines: emits one inline mapping, and nothing when uncaptured", () => {
  const [line] = sourceScanLines({ skipped_lines: 2, unverified_user_turns: 0, omitted_chars: 41 });
  assert.equal(line, "source_scan: {skipped_lines: 2, unverified_user_turns: 0, omitted_chars: 41}");
  assert.deepEqual(sourceScanLines(undefined), []);
  assert.deepEqual(sourceScanLines(null), []);
});

test("buildClueMd: carries source_scan beside derived_from when scanned", () => {
  const scan = { skipped_lines: 1, unverified_user_turns: 0, omitted_chars: 20_000 };
  const md = buildClueMd("sid-4", "2026-06-11", "2026-06-11T00:00:00Z", "2026-06-11T01:00:00Z", "/tmp", clueData, [], scan);
  const lines = md.split("\n");
  const scanIdx = lines.findIndex((l) => l.startsWith("source_scan:"));
  const derivedIdx = lines.findIndex((l) => l.startsWith("derived_from:"));
  assert.ok(scanIdx > 0, "source_scan present");
  assert.equal(derivedIdx, scanIdx + 1, "sits immediately before derived_from");
  assert.ok(lines[scanIdx].includes("omitted_chars: 20000"));
  // A legacy call without a scan stays valid and claims nothing.
  const legacy = buildClueMd("sid-5", "2026-06-11", "2026-06-11T00:00:00Z", "2026-06-11T01:00:00Z", "/tmp", clueData, []);
  assert.ok(!legacy.includes("source_scan:"));
});

test("fullTextSample: bounds the prompt and reports whether it cut", () => {
  const short = fullTextSample(["abc", "def"]);
  assert.equal(short.sample, "abc\n---\ndef");
  assert.equal(short.truncated, false);

  const long = fullTextSample(["x".repeat(40_000)]);
  assert.equal(long.sample.length, 30_000);
  assert.equal(long.truncated, true);
});

test("buildNarrativePrompt: a truncated sample tells the extractor it is a prefix", () => {
  const whole = buildNarrativePrompt(["a short session"], []);
  assert.ok(!whole.includes("opening portion"), "no notice when nothing was cut");

  const cut = buildNarrativePrompt(["y".repeat(40_000)], []);
  assert.ok(cut.includes("opening portion of a longer session"));
  assert.ok(cut.includes("does not reach an outcome"));
});
