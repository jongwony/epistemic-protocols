// Tests for hypomnesis-write.mjs typed cross_refs anchors (v0.7.0) and
// evidence-mode frontmatter. Run with: node --test
// Repo precedent: scripts/package.test.js (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractCrossRefs,
  buildClueMd,
  buildMarkersMd,
  buildHaikuArgs,
  callHaiku,
  stderrDetail,
  invokes,
  skillCalls,
  resolveSkillProtocol,
  protocolMap,
  HAIKU_FLAG_ARITY,
  MAX_ALL_CHARS,
  CLUE_SAMPLE_CHARS,
  PROMPT_SAMPLE_CHARS,
  STDERR_DETAIL_CHARS,
} from "./hypomnesis-write.mjs";
import {
  formatReport,
  REPORT_MAX_LINES,
  REPORT_MAX_LINE_CHARS,
} from "./hypomnesis-dispatch.mjs";

// The CLI's own consumption rule, applied to the argv the writer emits: a token
// is legal as a flag the arity map names, or as the value of one whose arity is
// 1. Everything else is a positional — which is what `--tools` eats.
function strayTokens(args, arity = HAIKU_FLAG_ARITY) {
  const stray = [];
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--") { stray.push(`${i}:${a} (end-of-options: what follows is positional)`); continue; }
    if (!a.startsWith("-")) { stray.push(`${i}:${JSON.stringify(a)}`); continue; }
    const name = a.includes("=") ? a.slice(0, a.indexOf("=")) : a;
    if (!(name in arity)) { stray.push(`${i}:${name} (undeclared flag)`); continue; }
    if (arity[name] === 1 && !a.includes("=")) i += 1;
  }
  return stray;
}

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
// tool-name list. What the argv must satisfy is therefore not "nothing follows
// --tools" but the CLI's own consumption rule: every token is a declared flag or
// the value of one that takes a value. `strayTokens` above is that rule, and the
// arity map it reads lives beside `buildHaikuArgs`, so a flag added without a
// declared arity fails here rather than widening the guard silently.
test("buildHaikuArgs carries no stray positional under the CLI's consumption rule", () => {
  const args = buildHaikuArgs();
  assert.deepEqual(strayTokens(args), [], "argv carries a token the CLI would read as positional");
});

// A flag written twice is not a stray token, so the rule above cannot see it —
// and a second --tools is the case that matters: a reader checking the first one
// would report tools disabled while the last occurrence is what the CLI takes.
test("buildHaikuArgs declares --tools \"\" exactly once, and no flag twice", () => {
  const args = buildHaikuArgs();
  const flags = args.filter((a) => a.startsWith("-"));
  const repeated = flags.filter((f, i) => flags.indexOf(f) !== i);
  assert.deepEqual(repeated, [], "a repeated flag makes the effective value the last one");
  const toolsAt = args.indexOf("--tools");
  assert.notEqual(toolsAt, -1, "--tools \"\" is the injection guard — it must not be dropped");
  assert.equal(args[toolsAt + 1], "", "--tools must disable every built-in tool");
});

// The mutations the rule rejects, asserted rather than described. Each is a
// shape a later edit to buildHaikuArgs could produce; the previous guard, which
// read "preceded by something flag-shaped", admitted all but the last two.
test("the consumption rule rejects every argv shape that reintroduces a positional", () => {
  const base = buildHaikuArgs();
  const cases = {
    "positional after a nullary flag": ["-p", "THE PROMPT", ...base.slice(1)],
    "positional after --dangerously-skip-permissions":
      [...base.slice(0, 7), "THE PROMPT", ...base.slice(7)],
    "positional appended behind --tools \"\"": [...base, "THE PROMPT"],
    "positional behind an end-of-options marker": [...base, "--", "THE PROMPT"],
    "positional behind an undeclared flag pair": [...base, "--output-format", "json", "THE PROMPT"],
    "positional behind an attached-value flag": [...base, "--output-format=json", "THE PROMPT"],
    "positional inserted before --tools": [...base.slice(0, 9), "THE PROMPT", ...base.slice(9)],
  };
  for (const [name, argv] of Object.entries(cases)) {
    assert.notDeepEqual(strayTokens(argv), [], `rule admits ${name}`);
  }
  // The control: the rule accepts what the writer actually emits, so the cases
  // above fail for their own shape rather than because the rule rejects all.
  assert.deepEqual(strayTokens(base), []);
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

// The OS pipe buffer is a BYTE limit. The sample bounds are character counts,
// and UTF-8 spends up to 4 bytes on one character, so a bound below this number
// settles nothing on its own — what decides a write is the payload's encoded
// size. Named for the unit it is in, because the earlier name said CHARS and a
// character bound was compared against it for two rounds.
const PIPE_BUFFER_BYTES = 64 * 1024;

// Where the sample bounds actually stand against that limit. MAX_ALL_CHARS
// bounds the parse buffer, not the payload: what reaches the child is a sample
// cut from it. Measured, a 30,000-character sample of Korean prose encodes to
// about 76,000 bytes and a sample of ASCII to 30,000, so EPIPE is reachable on
// one and not the other from the same bound. Both spawn-level classes are
// therefore live, which is what the join has to cover; the tests below drive
// EPIPE because it is the one a test can produce deterministically.
test("the prompt bounds leave the spawn-level class reachable, in bytes", () => {
  assert.ok(MAX_ALL_CHARS > PROMPT_SAMPLE_CHARS,
    "the parse buffer is what the sample is cut from, so it must exceed it");
  for (const [name, bound] of [["clue", CLUE_SAMPLE_CHARS], ["full-text", PROMPT_SAMPLE_CHARS]]) {
    // Not an assertion that the bound is safe — an assertion that nobody may
    // read it as safe. A character bound whose worst-case encoding clears the
    // pipe buffer would make EPIPE unreachable and the comments above stale in
    // the other direction, so that case has to be noticed too.
    assert.ok(bound * 4 > PIPE_BUFFER_BYTES,
      `${name} prompts are bounded at ${bound} characters, whose worst-case UTF-8 encoding is ${bound * 4} bytes — now under the ${PIPE_BUFFER_BYTES}-byte pipe buffer, so EPIPE is no longer reachable and the comments naming it live are stale`);
  }
});

// The measurement the bound above rests on, pinned rather than recalled: the
// same character count crosses the buffer in one script and not in another.
// Built from the Hangul syllables block (U+AC00-U+D7A3) by code point rather
// than from a prose sample, because the property under test is the encoding
// width of a three-byte script and not any particular sentence. This is the
// script these sessions are written in, and the case a character-indexed check
// cannot see.
const HANGUL_SYLLABLES_START = 0xAC00;
const HANGUL_SYLLABLES_COUNT = 11172;

test("a three-byte script under the character bound exceeds the pipe buffer in bytes", () => {
  const sample = Array.from({ length: PROMPT_SAMPLE_CHARS }, (_, i) =>
    String.fromCodePoint(HANGUL_SYLLABLES_START + (i % HANGUL_SYLLABLES_COUNT))).join("");
  const ascii = "x".repeat(PROMPT_SAMPLE_CHARS);

  assert.equal(sample.length, PROMPT_SAMPLE_CHARS,
    "the sample must sit exactly on the character bound the writer cuts at");
  assert.ok(Buffer.byteLength(sample, "utf8") > PIPE_BUFFER_BYTES,
    `a ${sample.length}-character sample of a three-byte script encodes to ${Buffer.byteLength(sample, "utf8")} bytes, which no longer clears the ${PIPE_BUFFER_BYTES}-byte pipe buffer — the character bound and the byte limit have stopped diverging and the comments above need re-reading`);
  assert.ok(Buffer.byteLength(ascii, "utf8") < PIPE_BUFFER_BYTES,
    "the ASCII control must stay under it: the same character count, one byte each, is what makes the bound alone undecidable");
});

// The spawn-level class in general: `message` is bare and the child's diagnosis
// reaches `stderr` alone, so the call sites that log `message` get an extraction
// failing with nothing in it to act on. Driven here through EPIPE because it is
// the one a test can produce deterministically — a payload above the pipe buffer
// and a child that exits without draining. The behaviour asserted is the join,
// which is what ETIMEDOUT needs too.
test("callHaiku carries the child's stderr out with a spawn-level failure", () => {
  const prompt = "x".repeat(PIPE_BUFFER_BYTES + 16_000);
  const child = "process.stderr.write('Error: Input must be provided\\n'); process.exit(1)";
  let err = null;
  try {
    callHaiku(prompt, {
      run: (_file, _args, opts) => execFileSync(process.execPath, ["-e", child], opts),
    });
  } catch (e) { err = e; }
  assert.ok(err, "a child exiting non-zero must reach the caller as a throw");
  // Without this the test would pass on a payload small enough to keep the
  // child's message in `message` on its own, proving nothing.
  assert.match(err.message, /EPIPE/, "precondition: the write, not the read, is what failed");
  assert.match(err.message, /Input must be provided/,
    "the child's diagnosis must reach the caller that logs message");
  assert.match(err.message, /child stderr:/,
    "the child's stream must be named, not concatenated as though it were the cause");
  assert.equal(err.code, "EPIPE", "the original error's own fields must survive the join");
});

// The class Node already joined itself: a plain non-zero exit puts the child's
// stderr in `message` and leaves `code` unset. Joining there would spend the
// forwarding window on a duplicate.
test("callHaiku leaves a plain non-zero exit untouched", () => {
  const child = "require('node:fs').readFileSync(0); process.stderr.write('BOOM\\n'); process.exit(3)";
  let err = null;
  try {
    callHaiku("short", {
      run: (_file, _args, opts) => execFileSync(process.execPath, ["-e", child], opts),
    });
  } catch (e) { err = e; }
  assert.ok(err);
  assert.equal(err.code, undefined, "precondition: a plain non-zero exit sets no code");
  assert.match(err.message, /BOOM/, "Node already carries the child's stderr here");
  assert.doesNotMatch(err.message, /child stderr:/, "so this must not append it a second time");
});

// Where the diagnosis sits in the stream is the child's choice. A tail-only
// window loses a cause that a long trace pushes out of it, and says nothing
// about having lost it.
test("stderrDetail keeps both ends and states what it dropped", () => {
  const long = `Error: account expired\n${Array.from({ length: 80 }, (_, i) => `    at frame${i} (/very/long/path/to/module/file-${i}.js:${i}:${i})`).join("\n")}`;
  const detail = stderrDetail(long);
  assert.ok(long.length > STDERR_DETAIL_CHARS, "precondition: the input must exceed the budget");
  assert.match(detail, /account expired/, "the cause sits at the head and must survive");
  assert.match(detail, /frame79/, "the tail must survive too");
  assert.match(detail, /chars elided/, "a cut presented as whole is the defect this replaces");
  assert.doesNotMatch(detail, /\n/, "the detail rides on one line through the dispatcher");
});

// Colour reaches a piped stderr, so the escapes travel unless removed — and they
// compete for the same window as the text.
test("stderrDetail strips terminal escapes", () => {
  const detail = stderrDetail("\u001b[31mError: Invalid MCP configuration:\u001b[39m bad path");
  assert.equal(detail, "Error: Invalid MCP configuration: bad path");
});

// --- writer → dispatcher composition ---
//
// The writer bounds each diagnostic line; the dispatcher bounds how many lines
// it forwards. These are two budgets in two files, and the failure they have to
// survive together is the one where every extraction fails identically at once:
// four lines competing for one window. A character window over the whole stream
// kept four lines before the child's stderr was joined on and none after, so the
// richer diagnosis arrived as strictly less observable output. These two tests
// are what fails if the budgets drift apart again.

test("the dispatcher's per-line budget admits a writer line at full budget", () => {
  const worstLine = `[hypomnesis-write] narrative extraction failed: spawnSync claude EPIPE | child stderr: ${"x".repeat(STDERR_DETAIL_CHARS)}`;
  assert.ok(worstLine.length <= REPORT_MAX_LINE_CHARS,
    `a writer line at full budget (${worstLine.length}) exceeds the dispatcher's per-line window (${REPORT_MAX_LINE_CHARS})`);
  assert.equal(formatReport(worstLine), worstLine, "and must pass through uncut");
});

test("every simultaneous extraction failure survives the dispatcher's forward", () => {
  const names = ["clue", "vector", "narrative", "marker"];
  const lines = names.map((n) =>
    `[hypomnesis-write] ${n} extraction failed: spawnSync claude EPIPE | child stderr: ${"x".repeat(STDERR_DETAIL_CHARS)}`);
  const forwarded = formatReport(lines.join("\n"));
  for (const n of names) {
    assert.ok(forwarded.includes(`${n} extraction failed`), `${n}'s failure did not survive the forward`);
  }
  assert.ok(names.length <= REPORT_MAX_LINES, "precondition: the line window must admit one line per extraction");
});

test("formatReport says how many lines it dropped", () => {
  const many = Array.from({ length: REPORT_MAX_LINES + 3 }, (_, i) => `line ${i}`).join("\n");
  const forwarded = formatReport(many);
  assert.match(forwarded, /^\[3 earlier lines dropped\]\n/, "a truncated forward must say it was truncated");
  assert.ok(forwarded.includes(`line ${REPORT_MAX_LINES + 2}`), "the newest line must survive");
  assert.ok(!forwarded.includes("line 0\n"), "the oldest must be the one dropped");
});
