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
// extraction returns empty and the record is discarded. The 2026-09-04
// injection guard put --tools "" at the end of argv, which is what made a
// trailing prompt unreachable. Both properties are asserted together: the guard
// stays, and no positional rides behind it.
// A reintroduced positional does not fail loudly: with both channels supplied
// this CLI runs the argv turn and then the stdin turn, so the extraction's JSON
// arrives with an extra turn in front of it rather than erroring.
test("buildHaikuArgs keeps --tools \"\" and carries no positional prompt", () => {
  const args = buildHaikuArgs();
  const toolsAt = args.indexOf("--tools");
  assert.notEqual(toolsAt, -1, "--tools \"\" is the injection guard — it must not be dropped");
  assert.equal(args[toolsAt + 1], "", "--tools must disable every built-in tool");
  // Indexed by position, not by value: argv already carries "" twice, so
  // resolving an element to its first occurrence would judge a repeated one
  // against the wrong predecessor. A flag pair appended after --tools "" is
  // admitted; anything not preceded by a flag is not.
  for (const [i, a] of args.entries()) {
    assert.ok(a.startsWith("-") || args[i - 1]?.startsWith("-"),
      `argv carries a stray positional at ${i}: ${JSON.stringify(a)}`);
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

// Every prompt but clue's exceeds the 64 KiB pipe buffer (MAX_ALL_CHARS is
// 80_000), so a child that exits before draining stdin fails the parent's write
// rather than its read: spawnSync reports EPIPE as the whole error and the
// child's own diagnosis reaches `stderr` alone. The call sites log `message`,
// so an unjoined pair is an extraction failing with nothing in it to act on.
test("callHaiku carries the child's stderr out with an EPIPE write failure", () => {
  const prompt = "x".repeat(80_000);
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
});
