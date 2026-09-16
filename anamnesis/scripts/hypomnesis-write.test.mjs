// Tests for hypomnesis-write.mjs typed cross_refs anchors (v0.7.0) and
// evidence-mode frontmatter. Run with: node --test
// Repo precedent: scripts/package.test.js (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractCrossRefs,
  buildClueMd,
  buildMarkersMd,
  buildHaikuArgs,
  callHaiku,
  buildSourceScans,
  computeSourceScan,
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

// --- source_scan: the record says how much of its source it read ---

const TEXT_SEPARATOR_LEN = "\n---\n".length;

test("computeSourceScan: omitted_chars is the gap between source and sample", () => {
  const scan = computeSourceScan(127_209, 30_000, 0);
  assert.equal(scan.omitted_chars, 97_209);
  assert.equal(scan.skipped_lines, 0);
  // Claude has no cross-check channel for human turns; 0 means unwitnessed.
  assert.equal(scan.unverified_user_turns, 0);
});

test("computeSourceScan: a wholly-read source omits nothing and never goes negative", () => {
  assert.equal(computeSourceScan(1_200, 1_200, 0).omitted_chars, 0);
  assert.equal(computeSourceScan(900, 30_000, 0).omitted_chars, 0);
});

// The separators a joined sample spends are characters of the bound, so a
// whole-source count that omits them subtracts to less than the real gap. The
// falsifying case is two texts that exactly fill the bound between them: the
// prompt is truncated and a raw-sum count still reports a complete read.
test("omitted_chars: a sample the prompt flagged as truncated never publishes zero", () => {
  const texts = ["a".repeat(15_000), "b".repeat(15_000)];
  const { sample, truncated } = fullTextSample(texts);
  assert.ok(truncated, "the joined form exceeds the bound — the fixture must reach the cut");
  const rawSum = texts.reduce((n, t) => n + t.length, 0);
  assert.equal(computeSourceScan(rawSum, sample.length, 0).omitted_chars, 0,
    "a raw-sum count is what this guards against; if this stops holding the fixture drifted");
  // The composition main() performs.
  const scan = computeSourceScan(joinedLength(rawSum, texts.length), sample.length, 0);
  assert.ok(scan.omitted_chars > 0,
    "truncated prompt with omitted_chars 0 — the frontmatter contradicts the prompt");
  assert.equal(scan.omitted_chars, TEXT_SEPARATOR_LEN);
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

test("computeSourceScan: unparsable transcript lines are counted", () => {
  assert.equal(computeSourceScan(10, 10, 3).skipped_lines, 3);
});

// The six artifacts are built from three different samples, so a scan measured
// on one of them describes the other two wrongly. Each case below is a session
// shape where two paths disagree; a single shared scan cannot satisfy any of
// them.
test("buildSourceScans: the clue bound cuts where the full-text bound does not", () => {
  const text = "u".repeat(25_000);
  const scans = buildSourceScans({
    userMsgs: [{ text, ts: "" }], allTexts: [text],
    totalTextChars: text.length, totalTextCount: 1,
    totalUserChars: text.length, totalUserCount: 1,
    skippedLines: 0,
  });
  // 25,000 characters of user text: the clue prompt takes 20,000 of them, and
  // neither the 30k semantic bound nor the 80k buffer bound is reached.
  assert.equal(scans.clue.omitted_chars, 5_000);
  assert.equal(scans.semantic.omitted_chars, 0);
  assert.equal(scans.retained.omitted_chars, 0);
});

test("buildSourceScans: the semantic bound cuts where the parse buffer does not", () => {
  const texts = ["a".repeat(25_000), "b".repeat(25_000)];
  const scans = buildSourceScans({
    userMsgs: [], allTexts: texts,
    totalTextChars: 50_000, totalTextCount: 2,
    totalUserChars: 0, totalUserCount: 0,
    skippedLines: 0,
  });
  assert.equal(scans.semantic.omitted_chars, 50_000 + TEXT_SEPARATOR_LEN - 30_000);
  assert.equal(scans.retained.omitted_chars, 0, "the 80k buffer held the whole session");
  assert.notEqual(scans.semantic.omitted_chars, scans.retained.omitted_chars,
    "one shared scan cannot describe both — that is what the split exists for");
});

test("buildSourceScans: user messages dropped past the retention cap are counted", () => {
  const text = "m".repeat(100);
  const scans = buildSourceScans({
    userMsgs: Array.from({ length: 150 }, () => ({ text, ts: "" })),
    allTexts: [text],
    totalTextChars: 100, totalTextCount: 1,
    // 200 user messages reached the transcript; MAX_USER_MSGS retained 150.
    totalUserChars: 100 * 200, totalUserCount: 200,
    skippedLines: 0,
  });
  assert.ok(scans.clue.omitted_chars > 0,
    "50 user messages never reached the clue stream — the record must not read as whole");
});

test("buildSourceScans: skipped_lines is a parse-level count and is shared", () => {
  const scans = buildSourceScans({
    userMsgs: [{ text: "hello there", ts: "" }], allTexts: ["hello there"],
    totalTextChars: 11, totalTextCount: 1,
    totalUserChars: 11, totalUserCount: 1,
    skippedLines: 7,
  });
  for (const [name, scan] of Object.entries(scans)) {
    assert.equal(scan.skipped_lines, 7, `${name} lost the parse-level count`);
    assert.equal(scan.omitted_chars, 0, `${name} read a short session whole`);
  }
});

test("sourceScanLines: emits one inline mapping, and nothing when uncaptured", () => {
  const [line] = sourceScanLines({ skipped_lines: 2, unverified_user_turns: 0, omitted_chars: 41 });
  assert.equal(line, "source_scan: {skipped_lines: 2, unverified_user_turns: 0, omitted_chars: 41}");
  assert.deepEqual(sourceScanLines(undefined), []);
  assert.deepEqual(sourceScanLines(null), []);
});

test("buildClueMd: carries source_scan beside derived_from when scanned", () => {
  const scan = computeSourceScan(50_000, 30_000, 1);
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
