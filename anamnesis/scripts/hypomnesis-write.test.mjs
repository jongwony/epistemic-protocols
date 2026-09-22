// Tests for hypomnesis-write.mjs typed cross_refs anchors (v0.7.0) and
// evidence-mode frontmatter. Run with: node --test
// Repo precedent: scripts/package.test.js (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractCrossRefs,
  buildClueMd,
  buildMarkersMd,
  buildHaikuArgs,
  callHaiku,
  processClaudeInput,
  writeStore,
  invokes,
  skillCalls,
  resolveSkillProtocol,
  protocolMap,
  PROMPT_SAMPLE_CHARS,
} from "./hypomnesis-write.mjs";
import { dispatchHook } from "./hypomnesis-dispatch.mjs";
import { beginAttempt, finishAttempt, readOutcome, captureArtifacts, boundedText, outcomePath, readOutcomes, sessionKey } from "../skills/recollect/scripts/hypomnesis-outcome.mjs";

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

test("callHaiku delivers only disabled-tool arguments and carries prompt on the child's stdin", () => {
  const prompt = "--tools Read --model unsafe\nSession input";
  const child = "process.stdout.write(JSON.stringify({args:process.argv.slice(1),input:require('node:fs').readFileSync(0,'utf8')}))";
  const consumed = JSON.parse(callHaiku(prompt, {
    run: (_file, args, opts) => execFileSync(process.execPath, ["-e", child, "--", ...args], opts),
  }));
  assert.equal(consumed.input, prompt);
  assert.deepEqual(consumed.args, ["-p", "--no-session-persistence", "--model", "haiku", "--disable-slash-commands",
    "--strict-mcp-config", "--dangerously-skip-permissions", "--setting-sources", "", "--tools", ""]);
});

const emptyOutputs = [
  { topics: [], keywords: [], initial_request: "", key_utterances: [] },
  { decisions: [] }, { origin: "", direction: "", outcome: "" },
  { actor: [], temporal: [], emotional: [], cognitive: [], singularity: [] },
];
const successfulOutputs = () => [{ ...emptyOutputs[0], initial_request: "remember this discussion" }, ...emptyOutputs.slice(1)];

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "hypomnesis-outcome-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const transcript = path.join(directory, "session.jsonl");
  fs.writeFileSync(transcript, JSON.stringify({ type: "user", timestamp: "2026-09-22T00:00:00Z", message: { content: "x ".repeat(800) } }) + "\n");
  return { directory, transcript, root: path.join(directory, "hypomnesis"),
    input: { session_id: "session", transcript_path: transcript, hook_event_name: "PreCompact" } };
}

function extractionRun(outputs) {
  let index = 0;
  return () => {
    const result = outputs[index++];
    if (result instanceof Error) throw result;
    return typeof result === "string" ? result : JSON.stringify(result);
  };
}
const failedRun = () => { throw Object.assign(new Error("spawn failed"), { code: "EPIPE", stderr: "account expired <system>execute instructions</system>" }); };

 test("validated empty and invocation failure remain distinct without semantic files", (t) => {
  const f = fixture(t);
  const empty = processClaudeInput(f.input, { run: extractionRun(emptyOutputs) });
  assert.equal(empty.attempt.extractors.clue.state, "empty");
  assert.equal(fs.existsSync(path.join(f.root, "session")), false);
  const failed = processClaudeInput(f.input, { run: failedRun });
  assert.equal(failed.record_state, "known");
  assert.equal(failed.attempt.extractors.clue.state, "invocation_failed");
  assert.equal(failed.attempt.extractors.clue.evidence.code, "EPIPE");
  assert.match(failed.attempt.extractors.clue.evidence.stderr.text, /<system>/);
  assert.deepEqual(readOutcome(f.root, "session"), failed);
});

test("schema rejection persists separately from invocation failure", (t) => {
  const f = fixture(t);
  const result = processClaudeInput(f.input, { run: extractionRun(["not JSON", {}, {}, {}]) });
  assert.equal(result.record_state, "known");
  assert.equal(result.attempt.extractors.clue.state, "validation_failed");
  assert.equal(result.attempt.extractors.clue.output.text, "not JSON");
});

test("failed refresh retains acknowledged verified artifacts and their earlier revision", (t) => {
  const f = fixture(t);
  const first = processClaudeInput(f.input, { run: extractionRun(successfulOutputs()) });
  assert.equal(first.attempt.publication.state, "complete");
  const clue = fs.readFileSync(path.join(f.root, "session", "clue.md"), "utf8");
  fs.appendFileSync(f.transcript, "\n");
  const failed = processClaudeInput(f.input, { run: failedRun });
  assert.equal(failed.record_state, "known");
  assert.equal(fs.readFileSync(path.join(f.root, "session", "clue.md"), "utf8"), clue);
  assert.ok(failed.artifacts.every((item) => item.verified));
  assert.deepEqual(failed.artifacts[0].revision, first.attempt.revision);
  assert.notDeepEqual(failed.attempt.revision, first.attempt.revision);
});

test("partial extraction publication remains verified after a later failed attempt", (t) => {
  const f = fixture(t);
  const partial = processClaudeInput(f.input, { run: extractionRun([successfulOutputs()[0], new Error("failed"), new Error("failed"), new Error("failed")]) });
  assert.equal(partial.attempt.publication.state, "partial");
  assert.deepEqual(partial.artifacts.map((item) => path.basename(item.path)), ["clue.md"]);
  const failed = processClaudeInput(f.input, { run: failedRun });
  assert.equal(failed.record_state, "known");
  assert.equal(failed.artifacts[0].verified, true);
});

test("publication acknowledges each replaced file and reports partial filesystem failure", (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.root, "session", "vector.md"), { recursive: true });
  const outputs = successfulOutputs();
  outputs[1] = { decisions: [{ label: "decision", description: "meaningful content" }] };
  const result = processClaudeInput(f.input, { run: extractionRun(outputs) });
  assert.equal(result.attempt.publication.state, "partial");
  assert.equal(result.attempt.publication.state, "partial");
  assert.ok(result.attempt.publication.errors["vector.md"]);
  assert.ok(result.artifacts.every((item) => item.verified));
  assert.ok(!result.artifacts.some((item) => path.basename(item.path) === "vector.md"));
});

test("total publication failure is not successful extraction publication", (t) => {
  const f = fixture(t);
  const result = processClaudeInput(f.input, { run: extractionRun(successfulOutputs()), publish: () => { throw Object.assign(new Error("read only"), { code: "EROFS" }); } });
  assert.equal(result.record_state, "known");
  assert.equal(result.attempt.extractors.clue.state, "succeeded");
  assert.equal(result.attempt.publication.state, "failed");
});

test("input read and parse failures persist before the semantic directory exists", (t) => {
  const f = fixture(t);
  fs.writeFileSync(f.transcript, "malformed JSONL\n");
  assert.equal(processClaudeInput(f.input).attempt.extractors.input.state, "input_failed");
  fs.unlinkSync(f.transcript);
  const missing = processClaudeInput(f.input);
  assert.equal(missing.record_state, "known");
  assert.equal(missing.attempt.extractors.input.evidence.code, "ENOENT");
});

test("PreCompact publishes its owned captured snapshot while the live transcript grows", (t) => {
  const f = fixture(t);
  const run = extractionRun(successfulOutputs());
  let first = true;
  const result = processClaudeInput(f.input, { run: (...args) => {
    if (first) {
      first = false;
      assert.equal(processClaudeInput(f.input, { run: failedRun }).attempt.state, "in_progress");
      fs.appendFileSync(f.transcript, JSON.stringify({ type: "user", message: { content: "LATER_TURN" } }) + "\n");
    }
    assert.doesNotMatch(args[2].input, /LATER_TURN/);
    return run(...args);
  } });
  assert.equal(result.attempt.state, "complete");
  assert.equal(result.attempt.publication.state, "complete");
  assert.equal(result.source_changed, true);
  assert.ok(result.artifacts.every((artifact) => artifact.verified && artifact.revision.size < result.source_revision.size));
});

test("reader preserves unknown legacy, unfinished, and late-attempt distinctions", (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.root, "session"), { recursive: true });
  const legacy = path.join(f.root, "session", "clue.md");
  fs.writeFileSync(legacy, "legacy semantic data");
  assert.equal(readOutcome(f.root, "session").record_state, "unknown");
  const info = { runtime: "claude", source_transcript: f.transcript, source_event: "PreCompact", revision: { mtime_ms: 1, size: 2 } };
  const first = beginAttempt(f.root, "session", info);
  assert.equal(readOutcome(f.root, "session").attempt.state, "in_progress");
  const next = beginAttempt(f.root, "session", { ...info, revision: { mtime_ms: 2, size: 2 } });
  assert.equal(finishAttempt(f.root, first, { state: "complete", extractors: {}, publication: { state: "complete", artifacts: captureArtifacts([legacy]) } }), false);
  assert.equal(beginAttempt(f.root, "session", info), null);
  assert.equal(readOutcome(f.root, "session").attempt.attempt_id, next.attempt_id);
  fs.writeFileSync(outcomePath(f.root, "session"), JSON.stringify({ ...next, schema_version: 99 }));
  assert.equal(readOutcome(f.root, "session").record_state, "unknown");
  assert.equal(fs.readFileSync(legacy, "utf8"), "legacy semantic data");
});

test("reader restricts acknowledged artifacts to the named session and checks hashes", (t) => {
  const f = fixture(t);
  const attempt = beginAttempt(f.root, "session", { runtime: "claude", revision: null });
  const outside = path.join(f.directory, "outside.md");
  fs.writeFileSync(outside, "private unrelated data");
  finishAttempt(f.root, attempt, { state: "complete", extractors: { clue: { state: "succeeded" } }, publication: { state: "complete", artifacts: captureArtifacts([outside]) } });
  const result = readOutcome(f.root, "session");
  assert.equal(result.attempt.publication.state, "complete");
  assert.equal(result.artifacts[0].verified, false);
  fs.writeFileSync(outcomePath(f.root, "session"), JSON.stringify({ ...attempt, extractors: { clue: null } }));
  assert.equal(readOutcome(f.root, "session").record_state, "unknown");
});

test("bounded operational evidence retains both ends with explicit omitted count", () => {
  const raw = "head" + "x".repeat(5000) + "tail";
  const evidence = boundedText(raw, 100);
  assert.equal(evidence.text.length, 100);
  assert.equal(evidence.omitted_chars, raw.length - 100);
  assert.match(evidence.text, /^head.*tail$/);
  assert.equal(evidence.split_at, 50);
});

test("real writer subprocess persists outcome consumed by the recall reader CLI", (t) => {
  const f = fixture(t);
  const stub = `#!${process.execPath}
require('node:fs').readFileSync(0);
process.stderr.write('diagnostic head ' + 'x'.repeat(5000) + ' account expired');
process.exit(3);
`;
  fs.writeFileSync(path.join(f.directory, "claude"), stub, { mode: 0o755 });
  const writer = spawnSync(process.execPath, [fileURLToPath(new URL("./hypomnesis-write.mjs", import.meta.url))], {
    input: JSON.stringify(f.input), encoding: "utf8", timeout: 15_000,
    env: { ...process.env, PATH: `${f.directory}${path.delimiter}${process.env.PATH}` },
  });
  assert.equal(writer.status, 0);
  const result = JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL("../skills/recollect/scripts/hypomnesis-outcome.mjs", import.meta.url)), f.root, "session"], { encoding: "utf8" }));
  assert.equal(result.record_state, "known");
  for (const name of ["clue", "vector", "narrative", "marker"]) {
    const evidence = result.attempt.extractors[name].evidence;
    assert.equal(evidence.status, 3);
    assert.match(evidence.stderr.text, /^diagnostic head .*account expired$/);
    assert.ok(evidence.stderr.omitted_chars > 0);
  }
});

test("repeated Codex publication retains current evidence without accumulating generation history", (t) => {
  const f = fixture(t);
  for (let index = 0; index < 70; index += 1) {
    const attempt = beginAttempt(f.root, "session", { runtime: "codex", revision: { mtime_ms: index + 1, size: 1 } });
    const record = path.join(f.root, "session", "generations", String(index), "record.json");
    fs.mkdirSync(path.dirname(record), { recursive: true });
    fs.writeFileSync(record, JSON.stringify({ index }));
    finishAttempt(f.root, attempt, { state: "complete", extractors: { codex: { state: "succeeded" } },
      publication: { state: "complete", artifacts: captureArtifacts([record]) } });
    const result = readOutcome(f.root, "session");
    assert.equal(result.attempt.publication.state, "complete");
    assert.equal(result.artifacts.length, 1);
    assert.equal(result.artifacts[0].path, record);
    assert.equal(result.artifacts[0].verified, true);
  }
});

test("complete then partial then failed refresh retains the newest acknowledged file", (t) => {
  const f = fixture(t);
  processClaudeInput(f.input, { run: extractionRun(successfulOutputs()) });
  fs.appendFileSync(f.transcript, "\n");
  const outputs = [{ ...successfulOutputs()[0], initial_request: "new partial clue" }, new Error("failed"), new Error("failed"), new Error("failed")];
  const partial = processClaudeInput(f.input, { run: extractionRun(outputs) });
  assert.equal(partial.attempt.publication.state, "partial");
  const clue = partial.artifacts.find((item) => path.basename(item.path) === "clue.md");
  fs.appendFileSync(f.transcript, "\n");
  const failed = processClaudeInput(f.input, { run: failedRun });
  const retained = failed.artifacts.find((item) => item.path === clue.path);
  assert.deepEqual(retained, clue);
  assert.equal(retained.verified, true);
});

test("topic-only and direction-only validated results remain semantic content", (t) => {
  const f = fixture(t);
  const outputs = [{ ...emptyOutputs[0], topics: ["remember topic"] }, emptyOutputs[1], { ...emptyOutputs[2], direction: "new direction" }, emptyOutputs[3]];
  const result = processClaudeInput(f.input, { run: extractionRun(outputs) });
  assert.equal(result.attempt.publication.state, "complete");
  assert.equal(result.attempt.extractors.clue.state, "succeeded");
  assert.equal(result.attempt.extractors.narrative.state, "succeeded");
});

test("dispatcher records startup failure even when a previous successful outcome exists", (t) => {
  const f = fixture(t);
  const projects = path.join(f.directory, "projects", "repo");
  fs.mkdirSync(projects, { recursive: true });
  const transcript = path.join(projects, "session.jsonl");
  fs.renameSync(f.transcript, transcript);
  const input = { ...f.input, transcript_path: transcript };
  const first = processClaudeInput(input, { run: extractionRun(successfulOutputs()) });
  assert.equal(first.attempt.publication.state, "complete");
  fs.writeFileSync(path.join(f.directory, "hypomnesis-write.mjs"), "process.stderr.write('startup failed'); process.exit(3);");
  const chunks = [];
  const previousWrite = process.stderr.write;
  try {
    process.stderr.write = (chunk) => { chunks.push(String(chunk)); return true; };
    dispatchHook(JSON.stringify(input), { env: { CLAUDE_CONFIG_DIR: f.directory }, scriptDir: f.directory });
  } finally { process.stderr.write = previousWrite; }
  const result = readOutcome(path.join(projects, "hypomnesis"), "session");
  assert.equal(result.record_state, "known");
  assert.equal(result.attempt.extractors.writer.evidence.status, 3);
  assert.match(chunks.join(""), /startup failed/);
  assert.notEqual(result.attempt.attempt_id, first.attempt.attempt_id);
});

test("successful silent subordinate hook emits no failure report", (t) => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.directory, "hypomnesis-subagent-hook.mjs"), "process.exit(0);");
  const chunks = [];
  const previousWrite = process.stderr.write;
  try {
    process.stderr.write = (chunk) => { chunks.push(String(chunk)); return true; };
    dispatchHook(JSON.stringify({ hook_event_name: "SubagentStop", transcript_path: path.join(f.directory, "projects", "repo", "session.jsonl") }),
      { env: { CLAUDE_CONFIG_DIR: f.directory }, scriptDir: f.directory });
  } finally { process.stderr.write = previousWrite; }
  assert.deepEqual(chunks, []);
});

test("capture size and cooldown skips remain distinct from validated empty", (t) => {
  const f = fixture(t);
  processClaudeInput(f.input, { run: extractionRun(successfulOutputs()) });
  const cooldown = processClaudeInput({ ...f.input, hook_event_name: "SessionEnd" }, { run: () => { throw new Error("cooldown must skip extraction"); } });
  assert.equal(cooldown.attempt.extractors.input.state, "skipped");
  assert.equal(cooldown.record_state, "known");
  assert.equal(cooldown.source_changed, false);
  assert.ok(cooldown.artifacts.every((artifact) => artifact.verified && artifact.revision.size === cooldown.source_revision.size && artifact.revision.mtime_ms === cooldown.source_revision.mtime_ms));
  assert.equal(Object.hasOwn(cooldown, "availability"), false);
  fs.writeFileSync(f.transcript, JSON.stringify({ type: "user", message: { content: "short request" } }));
  fs.utimesSync(f.transcript, new Date(), new Date(Date.now() + 1000));
  const short = processClaudeInput(f.input);
  assert.equal(short.attempt.extractors.input.state, "skipped");
  assert.equal(short.record_state, "known");
  assert.equal(Object.hasOwn(short, "availability"), false);
});

test("failed-plus-empty stages publish no empty files and do not suppress the next retry", (t) => {
  const f = fixture(t);
  const failed = processClaudeInput(f.input, { run: extractionRun([new Error("failed clue"), ...emptyOutputs.slice(1)]) });
  assert.equal(failed.attempt.extractors.clue.state, "invocation_failed");
  assert.equal(failed.attempt.extractors.vector.state, "empty");
  assert.equal(failed.attempt.extractors.narrative.state, "empty");
  assert.equal(failed.attempt.publication.state, "none");
  assert.equal(fs.existsSync(path.join(f.root, "session")), false);
  let calls = 0;
  const run = extractionRun(successfulOutputs());
  const retry = processClaudeInput({ ...f.input, hook_event_name: "SessionEnd" }, { run: (...args) => { calls += 1; return run(...args); } });
  assert.equal(calls, 4);
  assert.equal(retry.attempt.publication.state, "complete");
});

test("failure-plus-empty refresh preserves previously meaningful payloads", (t) => {
  const f = fixture(t);
  const initial = successfulOutputs();
  initial[1] = { decisions: [{ label: "settled", description: "keep this" }] };
  initial[2] = { origin: "original discussion", direction: "continue", outcome: "settled" };
  const first = processClaudeInput(f.input, { run: extractionRun(initial) });
  const failed = processClaudeInput(f.input, { run: extractionRun([new Error("failed clue"), ...emptyOutputs.slice(1)]) });
  assert.equal(failed.attempt.publication.state, "none");
  assert.deepEqual(failed.artifacts, first.artifacts);
  let calls = 0;
  const run = extractionRun(initial);
  processClaudeInput({ ...f.input, hook_event_name: "SessionEnd" }, { run: (...args) => { calls += 1; return run(...args); } });
  assert.equal(calls, 4, "a failed latest attempt must remain retryable despite earlier success");
});

test("partial independent content is published without arming the complete-capture cooldown", (t) => {
  const f = fixture(t);
  const outputs = [new Error("failed clue"), emptyOutputs[1], emptyOutputs[2], { ...emptyOutputs[3], actor: ["a named participant"] }];
  const partial = processClaudeInput(f.input, { run: extractionRun(outputs) });
  assert.equal(partial.attempt.publication.state, "partial");
  assert.deepEqual(partial.artifacts.map((item) => path.basename(item.path)), ["markers.md"]);
  let calls = 0;
  const run = extractionRun(successfulOutputs());
  processClaudeInput({ ...f.input, hook_event_name: "SessionEnd" }, { run: (...args) => { calls += 1; return run(...args); } });
  assert.equal(calls, 4);
});

test("lost attempt ownership suppresses publication even while the source is unchanged", (t) => {
  const f = fixture(t);
  let successor;
  const run = extractionRun(successfulOutputs());
  const result = processClaudeInput(f.input, { run: (...args) => {
    if (!successor) {
      const original = readOutcome(f.root, "session").attempt;
      successor = beginAttempt(f.root, "session", original);
    }
    return run(...args);
  } });
  assert.equal(result.attempt.attempt_id, successor.attempt_id);
  assert.equal(result.attempt.state, "in_progress");
  assert.equal(fs.existsSync(path.join(f.root, "session")), false);
});

test("a first recorded skip is known and retained freshness is independently source-scoped", (t) => {
  const f = fixture(t);
  fs.writeFileSync(f.transcript, JSON.stringify({ type: "user", message: { content: "short" } }));
  const skipped = processClaudeInput(f.input);
  assert.equal(skipped.record_state, "known");
  assert.equal(skipped.attempt.extractors.input.state, "skipped");
  assert.equal(skipped.source_changed, false);
  assert.deepEqual(skipped.artifacts, []);
  assert.equal(Object.hasOwn(skipped, "availability"), false);
});

test("batch reader preserves the exact supplied identity set in one process", (t) => {
  const f = fixture(t);
  processClaudeInput(f.input, { run: extractionRun(successfulOutputs()) });
  const sources = [{ runtime: "claude", root: f.root, session_id: "session" },
    ...Array.from({ length: 100 }, (_, i) => ({ runtime: "codex", root: f.root, session_id: `legacy-${i}` }))];
  const expected = readOutcomes(sources);
  const actual = JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL("../skills/recollect/scripts/hypomnesis-outcome.mjs", import.meta.url)), "--batch"],
    { input: JSON.stringify(sources), encoding: "utf8" }));
  assert.deepEqual(actual, expected);
  assert.equal(actual.length, sources.length);
  assert.equal(actual[0].record_state, "known");
  assert.ok(actual.slice(1).every((result) => result.record_state === "unknown"));
});

test("runtime-aware identity mapping preserves Claude long IDs and Codex legacy keys", (t) => {
  const f = fixture(t);
  const longId = "s".repeat(190);
  const result = processClaudeInput({ ...f.input, session_id: longId }, { run: extractionRun(successfulOutputs()) });
  assert.equal(sessionKey("claude", longId), longId);
  assert.equal(sessionKey("codex", longId), longId.slice(0, 160));
  assert.equal(sessionKey("codex", "a/b?c"), "a_b_c");
  assert.equal(sessionKey("codex", ""), "unknown");
  assert.ok(result.artifacts.every((artifact) => artifact.verified && artifact.path.includes(longId)));
  assert.equal(readOutcome(f.root, longId, "claude").record_state, "known");
});

test("legacy Codex key collisions never bind one raw session's outcome to another", (t) => {
  const f = fixture(t);
  for (const [left, right] of [["a/b", "a?b"], ["x".repeat(160) + "/left", "x".repeat(160) + "?right"]]) {
    assert.equal(sessionKey("codex", left), sessionKey("codex", right));
    beginAttempt(f.root, left, { runtime: "codex", revision: null });
    beginAttempt(f.root, right, { runtime: "codex", revision: null });
    assert.equal(readOutcome(f.root, left, "codex").record_state, "unknown");
    assert.equal(readOutcome(f.root, right, "codex").attempt.session_id, right);
  }
});
