import { spawn } from "node:child_process";
import { takeSessionLock } from "../skills/recollect/scripts/session-lock.mjs";
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  atomicWriteJson,
  buildCodexCommandArgs,
  callCodexExtractor,
  chooseLatestJob,
  enqueueCodexJob,
  isCodexTranscript,
  parseCodexRollout,
  processJob,
  publishRecord,
  runWorker,
  spawnWorker,
} from "./hypomnesis-codex-write.mjs";
import { dispatchHook, isClaudeTranscript } from "./hypomnesis-dispatch.mjs";

import { readOutcome } from "../skills/recollect/scripts/hypomnesis-outcome.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "hypomnesis-codex-test-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const transcript = path.join(base, "custom-codex", "sessions", "2026", "08", "10", "rollout-fixture.jsonl");
  fs.mkdirSync(path.dirname(transcript), { recursive: true });
  const rows = [
    { timestamp: "2026-08-10T00:00:00Z", type: "session_meta", payload: { id: "session-a", cwd: "/repo", timestamp: "2026-08-10T00:00:00Z" } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "# AGENTS.md instructions for /repo\nsynthetic" }] } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "<recommended_plugins>\nHere is a list of plugins that are available but not installed." }] } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "# AGENTS.md instructions\n\n<INSTRUCTIONS>\n# Use..." }] } },
    { timestamp: "2026-08-10T00:00:02Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Find the earlier internet problem. $recollect" }] } },
    { timestamp: "2026-08-10T00:00:03Z", type: "response_item", payload: { type: "message", role: "assistant", phase: "commentary", content: [{ type: "output_text", text: "I will inspect the records first." }] } },
    { timestamp: "2026-08-10T00:00:04Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Label every source too." }] } },
    { timestamp: "2026-08-10T00:00:05Z", type: "response_item", payload: { type: "message", role: "assistant", phase: "final", content: [{ type: "output_text", text: "Claude and Codex sources are separated." }] } },
  ];
  fs.writeFileSync(transcript, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  return { base, transcript, root: path.join(base, "store") };
}

function extraction(topic = "Internet problem recall") {
  return {
    topic,
    topics: [topic],
    keywords: ["internet", "source"],
    initial_request: "Find the earlier internet problem.",
    key_utterances: ["Label every source too."],
    cross_refs: [],
    decisions: [{ label: "source", description: "Keep source provenance.", alternatives_rejected: "" }],
    narrative: { origin: "Prior-session search", direction: "Compare two runtimes", outcome: "Label sources" },
    markers: { coinage: [], actor: ["Claude", "Codex"], temporal: [], emotional: [], cognitive: ["decision"], singularity: [] },
  };
}

test("recognizes rollout paths under a custom CODEX_HOME layout", (t) => {
  const { transcript } = fixture(t);
  assert.equal(isCodexTranscript(transcript), true);
  assert.equal(isCodexTranscript("/tmp/.claude/projects/x/session.jsonl"), false);
  assert.equal(isClaudeTranscript("/tmp/custom-claude/projects/x/session.jsonl", { CLAUDE_CONFIG_DIR: "/tmp/custom-claude" }), true);
});

test("parses real messages in chronological order and filters injected context", (t) => {
  const { transcript } = fixture(t);
  const parsed = parseCodexRollout(transcript);
  assert.equal(parsed.session_id, "session-a");
  assert.equal(parsed.cwd, "/repo");
  assert.deepEqual(parsed.messages.map(({ role, text }) => [role, text]), [
    ["user", "Find the earlier internet problem. $recollect"],
    ["assistant", "I will inspect the records first."],
    ["user", "Label every source too."],
    ["assistant", "Claude and Codex sources are separated."],
  ]);
  // Three injected envelopes must be filtered: the " for /repo" AGENTS.md
  // variant, the bare AGENTS.md variant (no " for "), and <recommended_plugins>.
  assert.equal(parsed.user_messages.length, 2);
  assert.deepEqual(parsed.protocols_used, ["recollect"]);
  assert.equal(parsed.last_turn_at, "2026-08-10T00:00:05Z");
});

// Single most important test in this brief: a `codex-tui` interactive session
// at CLI 0.147.0 emits ZERO event_msg/user_message entries while still
// carrying every genuine human turn in response_item. The event_msg channel
// must stay a cross-check only — using it as the message source would
// silently discard every interactive session's capture.
test("interactive sessions with no event_msg/user_message channel still yield every genuine user turn", (t) => {
  const { transcript } = fixture(t);
  const parsed = parseCodexRollout(transcript);
  assert.equal(parsed.user_messages.length, 2);
  assert.deepEqual(parsed.user_messages.map((m) => m.text), [
    "Find the earlier internet problem. $recollect",
    "Label every source too.",
  ]);
  assert.equal(parsed.unverified_user_turns, 0);
  assert.equal(parsed.skipped_lines, 0);
});

test("unverified_user_turns counts response_item user turns absent from the event_msg cross-check channel", (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "hypomnesis-codex-eventmsg-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const transcript = path.join(base, "codex", "sessions", "2026", "08", "10", "rollout-eventmsg.jsonl");
  fs.mkdirSync(path.dirname(transcript), { recursive: true });
  const rows = [
    { timestamp: "2026-08-10T00:00:00Z", type: "session_meta", payload: { id: "session-b", cwd: "/repo", timestamp: "2026-08-10T00:00:00Z" } },
    { timestamp: "2026-08-10T00:00:01Z", type: "event_msg", payload: { type: "user_message", message: "First real turn." } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "First real turn." }] } },
    { timestamp: "2026-08-10T00:00:02Z", type: "response_item", payload: { type: "message", role: "assistant", phase: "final", content: [{ type: "output_text", text: "Acknowledged." }] } },
    { timestamp: "2026-08-10T00:00:03Z", type: "event_msg", payload: { type: "user_message", message: "Second real turn." } },
    { timestamp: "2026-08-10T00:00:03Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Second real turn." }] } },
    // Unmatched: a response_item user turn with no corresponding event_msg entry.
    { timestamp: "2026-08-10T00:00:04Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Unverified extra turn." }] } },
  ];
  fs.writeFileSync(transcript, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");

  const parsed = parseCodexRollout(transcript);
  assert.equal(parsed.user_messages.length, 3);
  assert.equal(parsed.unverified_user_turns, 1);
});

test("detectProtocols requires the sigil to follow a delimiter, so path segments are not read as invocations", (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "hypomnesis-codex-protocols-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const transcript = path.join(base, "codex", "sessions", "2026", "08", "10", "rollout-protocols.jsonl");
  fs.mkdirSync(path.dirname(transcript), { recursive: true });
  const text = [
    "$euporia:elicit at line start",
    "please run /induce now",
    "see `/induce` for details",
    "reference heuresis/skills/ideate/SKILL.md",
    "cwd=/Users/choi/Downloads holds the files",
  ].join("\n");
  const rows = [
    { timestamp: "2026-08-10T00:00:00Z", type: "session_meta", payload: { id: "session-e", cwd: "/repo", timestamp: "2026-08-10T00:00:00Z" } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text }] } },
  ];
  fs.writeFileSync(transcript, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");

  const parsed = parseCodexRollout(transcript);
  // Genuine invocations at line start, after a space, and inside backticks
  // are all detected; the two path fragments contribute nothing.
  assert.deepEqual(parsed.protocols_used, ["elicit", "induce"]);
});

test("a malformed transcript line is skipped and counted, not fatal to the parse", (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "hypomnesis-codex-malformed-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const transcript = path.join(base, "codex", "sessions", "2026", "08", "10", "rollout-malformed.jsonl");
  fs.mkdirSync(path.dirname(transcript), { recursive: true });
  const rows = [
    JSON.stringify({ timestamp: "2026-08-10T00:00:00Z", type: "session_meta", payload: { id: "session-c", cwd: "/repo", timestamp: "2026-08-10T00:00:00Z" } }),
    "{not valid json",
    JSON.stringify({ timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Still verified." }] } }),
  ];
  fs.writeFileSync(transcript, `${rows.join("\n")}\n`, "utf8");

  const parsed = parseCodexRollout(transcript);
  assert.equal(parsed.skipped_lines, 1);
  assert.deepEqual(parsed.user_messages.map((m) => m.text), ["Still verified."]);
});

test("nested extraction is ephemeral, hooks-off, Luna xhigh, and schema-bound", () => {
  const args = buildCodexCommandArgs({ cwd: "/repo", outputPath: "/tmp/out.json", prompt: "prompt" });
  assert.ok(args.includes("--ephemeral"));
  assert.deepEqual(args.slice(args.indexOf("--disable"), args.indexOf("--disable") + 2), ["--disable", "hooks"]);
  assert.ok(args.includes("--ignore-user-config"));
  assert.deepEqual(args.slice(args.indexOf("--model"), args.indexOf("--model") + 2), ["--model", "gpt-5.6-luna"]);
  assert.ok(args.includes('model_reasoning_effort="xhigh"'));
  assert.ok(args.includes("--output-schema"));
});

test("a replacement that sorts below the job it replaces survives that job's cleanup", (t) => {
  const { base, root } = fixture(t);
  const transcript = path.join(base, "custom-codex", "sessions", "2026", "08", "10", "rollout-shrink.jsonl");
  const rows = (size) => [
    { timestamp: "2026-08-10T00:00:00Z", type: "session_meta", payload: { id: "session-shrink", cwd: "/repo", timestamp: "2026-08-10T00:00:00Z" } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "y".repeat(size) }] } },
  ];
  fs.writeFileSync(transcript, `${rows(4000).map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  const before = fs.statSync(transcript);
  enqueueCodexJob({ hook_event_name: "SessionEnd", session_id: "session-shrink", transcript_path: transcript, cwd: "/repo" }, { root });
  // Same mtime, smaller size: the replacement sorts BELOW the job it replaces,
  // which is the ordering cleanup would otherwise sweep it under.
  fs.writeFileSync(transcript, `${rows(100).map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  fs.utimesSync(transcript, before.atime, before.mtime);

  assert.equal(runWorker(root, "session-shrink", { extract: () => extraction() }), true);
  assert.ok(
    fs.existsSync(path.join(root, "catalog", "session-shrink.json")),
    "a transcript that shrank must still produce a capture, not lose its replacement to cleanup",
  );
});

// The test above starts with nothing published, so it exercises only the arm
// where the replacement can land. This one starts with a higher revision
// already published — the arm where the pointer must decline and say so.
test("a replacement below an already-published current is declined rather than passing as a no-op", (t) => {
  const { base, root } = fixture(t);
  const seeded = { runtime: "codex", cwd: "/repo", started_at: "", last_turn_at: "", topic: "kept", topics: [], keywords: [], initial_request: "", key_utterances: [], cross_refs: [], decisions: [], narrative: {}, markers: {}, protocols_used: [] };
  assert.equal(publishRecord(root, { session_id: "session-decline", revision: { mtime_ms: 9_999_999_999_999, size: 999_999 } }, seeded), true);

  const transcript = path.join(base, "custom-codex", "sessions", "2026", "08", "10", "rollout-decline.jsonl");
  const rows = [
    { timestamp: "2026-08-10T00:00:00Z", type: "session_meta", payload: { id: "session-decline", cwd: "/repo", timestamp: "2026-08-10T00:00:00Z" } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "a later, thinner source" }] } },
  ];
  fs.writeFileSync(transcript, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  const queued = enqueueCodexJob({ hook_event_name: "SessionEnd", session_id: "session-decline", transcript_path: transcript, cwd: "/repo" }, { root });

  const result = processJob(root, queued.job, { extract: () => extraction("thinner") });
  assert.equal(result.published, false);
  assert.equal(result.declined, true, "a declined pointer move must be distinguishable from an unchanged one");
  const catalogued = JSON.parse(fs.readFileSync(path.join(root, "catalog", "session-decline.json"), "utf8"));
  assert.equal(catalogued.topic, "kept", "the fuller earlier capture survives a later, thinner source");
});

test("a session too long for bounded extraction records what was omitted", (t) => {
  const { base, root } = fixture(t);
  const transcript = path.join(base, "custom-codex", "sessions", "2026", "08", "10", "rollout-long.jsonl");
  const rows = [
    { timestamp: "2026-08-10T00:00:00Z", type: "session_meta", payload: { id: "session-long", cwd: "/repo", timestamp: "2026-08-10T00:00:00Z" } },
    { timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "x".repeat(90_000) }] } },
  ];
  fs.writeFileSync(transcript, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  const queued = enqueueCodexJob({ hook_event_name: "SessionEnd", session_id: "session-long", transcript_path: transcript, cwd: "/repo" }, { root });
  const result = processJob(root, queued.job, { extract: () => extraction() });
  // The prompt marks its own cut for the extractor; the record is what a later
  // recall reads, so the amount has to reach it too.
  assert.ok(result.record.source_scan.omitted_chars > 0, "a truncated session must not publish as a whole one");
  assert.equal(result.record.source_scan.skipped_lines, 0);
  const catalogued = JSON.parse(fs.readFileSync(path.join(root, "catalog", "session-long.json"), "utf8"));
  assert.equal(catalogued.source_scan.omitted_chars, result.record.source_scan.omitted_chars);
});

test("extraction runs from an isolated work directory, never the captured session's cwd", (t) => {
  const { root } = fixture(t);
  fs.mkdirSync(root, { recursive: true });
  const session = { cwd: "/repo", messages: [{ role: "user", text: "hello" }] };
  let seenCd = null;
  const run = (_bin, args) => {
    seenCd = args[args.indexOf("--cd") + 1];
    fs.writeFileSync(args[args.indexOf("--output-last-message") + 1], JSON.stringify({ topic: "t" }), "utf8");
    return { status: 0 };
  };
  assert.deepEqual(callCodexExtractor(session, { root, run }), { topic: "t" });
  // An AGENTS.md at the working directory reaches the extractor as authoritative
  // instruction, so the captured session's own cwd must never be the one used.
  assert.notEqual(seenCd, session.cwd);
  assert.ok(seenCd.startsWith(path.join(root, ".work-")), `expected an isolated work dir, got ${seenCd}`);
  assert.equal(fs.existsSync(seenCd), false, "the work directory is removed after extraction");
});

test("queue coalescing prefers event rank at the same transcript revision", (t) => {
  const { transcript, root } = fixture(t);
  const common = { session_id: "session-a", transcript_path: transcript, cwd: "/repo" };
  enqueueCodexJob({ ...common, hook_event_name: "Stop" }, { root });
  enqueueCodexJob({ ...common, hook_event_name: "SessionEnd" }, { root });
  const queue = path.join(root, ".queue", "session-a");
  const jobs = fs.readdirSync(queue).map((name) => JSON.parse(fs.readFileSync(path.join(queue, name), "utf8")));
  assert.equal(chooseLatestJob(jobs).hook_event_name, "SessionEnd");
});

test("worker publishes immutable generation, atomic pointer, and compact catalog", (t) => {
  const { transcript, root } = fixture(t);
  const common = { session_id: "session-a", transcript_path: transcript, cwd: "/repo" };
  enqueueCodexJob({ ...common, hook_event_name: "Stop" }, { root });
  let extracts = 0;
  assert.equal(runWorker(root, "session-a", { extract: () => { extracts += 1; return extraction(); } }), true);

  const current = JSON.parse(fs.readFileSync(path.join(root, "session-a", "current.json"), "utf8"));
  const recordPath = path.join(root, "session-a", current.generation);
  const record = JSON.parse(fs.readFileSync(recordPath, "utf8"));
  const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog", "session-a.json"), "utf8"));
  assert.equal(record.runtime, "codex");
  assert.equal(record.topic, "Internet problem recall");
  assert.equal(catalog.record_path, recordPath);
  assert.deepEqual(catalog.evidence_modes, record.evidence_modes);
  assert.equal(catalog.evidence_modes.initial_request, "attested");

  enqueueCodexJob({ ...common, hook_event_name: "SessionEnd" }, { root });
  runWorker(root, "session-a", { extract: () => { throw new Error("same revision must be reused"); } });
  assert.equal(extracts, 1);
  assert.equal(fs.readdirSync(path.join(root, "session-a", "generations")).length, 1);
});

test("a job that fails once is retried and published on the next attempt", (t) => {
  const { transcript, root } = fixture(t);
  enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, cwd: "/repo", hook_event_name: "Stop" }, { root });
  let attempts = 0;
  const result = runWorker(root, "session-a", {
    extract: () => {
      attempts += 1;
      if (attempts === 1) throw new Error("transient extractor failure");
      return extraction();
    },
  });
  assert.equal(result, true);
  assert.equal(attempts, 2);
  const current = JSON.parse(fs.readFileSync(path.join(root, "session-a", "current.json"), "utf8"));
  assert.equal(current.session_id, "session-a");
  assert.equal(fs.existsSync(path.join(root, "failures", "session-a")), false);
});

test("a job that fails twice is quarantined into failures/ and the worker terminates", (t) => {
  const { transcript, root } = fixture(t);
  enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, cwd: "/repo", hook_event_name: "Stop" }, { root });
  let attempts = 0;
  const result = runWorker(root, "session-a", {
    extract: () => {
      attempts += 1;
      throw new Error("persistent extractor failure");
    },
  });
  assert.equal(result, true);
  assert.equal(attempts, 2);
  assert.equal(fs.readdirSync(path.join(root, "failures", "session-a")).length, 1);
  assert.equal(fs.readdirSync(path.join(root, ".queue", "session-a")).length, 0);
});

test("the worker's lock release only removes a lock this process still owns", (t) => {
  const { transcript, root } = fixture(t);
  enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, cwd: "/repo", hook_event_name: "Stop" }, { root });
  const lockDir = path.join(root, ".locks", "session-a");
  runWorker(root, "session-a", {
    extract: () => {
      // Simulate a successor worker stealing this run's stale-looking lock
      // mid-processing by rewriting owner.json to a foreign pid.
      atomicWriteJson(path.join(lockDir, "owner.json"), { pid: 999999999, acquired_at: new Date().toISOString() });
      return extraction();
    },
  });
  assert.equal(fs.existsSync(lockDir), true);
  const owner = JSON.parse(fs.readFileSync(path.join(lockDir, "owner.json"), "utf8"));
  assert.equal(owner.pid, 999999999);
});

test("an older generation cannot regress current", (t) => {
  const { root } = fixture(t);
  const newer = { session_id: "session-a", revision: { mtime_ms: 20, size: 20 } };
  const older = { session_id: "session-a", revision: { mtime_ms: 10, size: 10 } };
  const base = { runtime: "codex", cwd: "/repo", started_at: "", last_turn_at: "", topics: [], keywords: [], initial_request: "", narrative: {}, protocols_used: [] };
  assert.equal(publishRecord(root, newer, { ...base, topic: "new" }), true);
  assert.equal(publishRecord(root, older, { ...base, topic: "old" }), false);
  const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog", "session-a.json"), "utf8"));
  assert.equal(catalog.topic, "new");
});

test("publishRecord writes the compact catalog entry before advancing current.json", (t) => {
  const { root } = fixture(t);
  fs.mkdirSync(root, { recursive: true });
  // Block the catalog write (the first write in the new order) by occupying
  // its parent path with a file instead of a directory.
  fs.writeFileSync(path.join(root, "catalog"), "blocker");

  const job = { session_id: "session-a", revision: { mtime_ms: 1, size: 1 } };
  const record = { runtime: "codex", cwd: "/repo", started_at: "", last_turn_at: "", topics: [], keywords: [], initial_request: "", narrative: {}, protocols_used: [], topic: "x" };
  assert.throws(() => publishRecord(root, job, record));
  // The pointer that certifies the read surface must not have advanced when
  // the catalog write it depends on never landed.
  assert.equal(fs.existsSync(path.join(root, "session-a", "current.json")), false);
});

test("shared dispatcher routes Codex without spawning and leaves Claude Stop alone", (t) => {
  const { transcript, root } = fixture(t);
  const codex = dispatchHook(JSON.stringify({
    hook_event_name: "Stop",
    session_id: "session-a",
    transcript_path: transcript,
    cwd: "/repo",
  }), { root, noSpawn: true });
  assert.equal(codex.runtime, "codex");
  assert.equal(codex.handled, true);

  const claude = dispatchHook(JSON.stringify({
    hook_event_name: "Stop",
    session_id: "claude-a",
    transcript_path: "/tmp/custom-claude/projects/repo/claude-a.jsonl",
  }), { noSpawn: true, env: { CLAUDE_CONFIG_DIR: "/tmp/custom-claude" } });
  assert.deepEqual(claude, { runtime: "claude", handled: false });
});

test("a failing spawned Claude script produces a stderr diagnostic without changing dispatchHook's result", (t) => {
  const scriptDir = fs.mkdtempSync(path.join(os.tmpdir(), "hypomnesis-dispatch-fail-"));
  t.after(() => fs.rmSync(scriptDir, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(scriptDir, "hypomnesis-write.mjs"),
    'process.stderr.write("boom: extraction failed\\n"); process.exitCode = 1;\n',
    "utf8",
  );

  const chunks = [];
  const originalWrite = process.stderr.write;
  process.stderr.write = (chunk) => { chunks.push(String(chunk)); return true; };
  let result;
  try {
    result = dispatchHook(JSON.stringify({
      hook_event_name: "SessionEnd",
      session_id: "claude-fail",
      transcript_path: "/tmp/custom-claude/projects/repo/claude-fail.jsonl",
    }), { env: { CLAUDE_CONFIG_DIR: "/tmp/custom-claude" }, scriptDir });
  } finally {
    process.stderr.write = originalWrite;
  }

  // The normal handled result is unchanged; the child's failure is only
  // observable via the diagnostic line, not via a thrown error or an
  // altered dispatchHook result.
  assert.deepEqual(result, { runtime: "claude", handled: true });
  assert.ok(chunks.some((chunk) => chunk.includes("hypomnesis-write.mjs") && chunk.includes("boom: extraction failed")));
});

test("shared hook registration sends lifecycle events through the dispatcher", () => {
  const hooks = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, "..", "hooks", "hooks.json"), "utf8")).hooks;
  for (const event of ["Stop", "PreCompact", "SessionEnd", "SubagentStop"]) {
    const command = hooks[event][0].hooks[0];
    assert.match(command.command, /hypomnesis-dispatch\.mjs/);
    assert.equal(command.async, true);
  }
});

test("worker launch returns before detached work completes", async (t) => {
  const { base, root } = fixture(t);
  const marker = path.join(base, "worker-finished");
  const worker = path.join(base, "detached-worker.cjs");
  fs.writeFileSync(worker, `setTimeout(() => require("node:fs").writeFileSync(${JSON.stringify(marker)}, "done"), 200);\n`, "utf8");
  const started = Date.now();
  const pid = spawnWorker(root, "session-a", { scriptPath: worker });
  assert.ok(pid > 0);
  assert.ok(Date.now() - started < 150);

  const deadline = Date.now() + 2_000;
  while (!fs.existsSync(marker) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(fs.readFileSync(marker, "utf8"), "done");
});

test("Codex outcome distinguishes legacy, unfinished, failure, retry, and retained success", (t) => {
  const { root, transcript } = fixture(t);
  assert.equal(readOutcome(root, "session-a", "codex").record_state, "unknown");
  const input = { session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" };
  enqueueCodexJob(input, { root });
  runWorker(root, "session-a", { extract: () => {
    assert.equal(readOutcome(root, "session-a", "codex").attempt.state, "in_progress");
    return extraction();
  } });
  const success = readOutcome(root, "session-a", "codex");
  assert.equal(success.attempt.publication.state, "complete");
  assert.equal(success.attempt.publication.artifacts.length, 3);
  fs.appendFileSync(transcript, "\n");
  enqueueCodexJob(input, { root });
  runWorker(root, "session-a", { extract: () => { throw Object.assign(new Error("process failed"), { stage: "invocation_failed", stderr: "raw stderr", status: 7 }); } });
  const failed = readOutcome(root, "session-a", "codex");
  assert.ok(failed.artifacts.some((artifact) => artifact.verified));
  assert.deepEqual(failed.attempt.last_publication, success.attempt.last_publication);
  assert.equal(failed.attempt.extractors.codex.state, "invocation_failed");
  assert.deepEqual(failed.attempt.retry, { failures: 2, disposition: "quarantined" });
  assert.equal(failed.attempt.extractors.codex.evidence.stderr.text, "raw stderr");
  assert.equal(fs.readdirSync(path.join(root, "failures", "session-a")).length, 1);
  enqueueCodexJob(input, { root });
  runWorker(root, "session-a", { extract: () => extraction("recovered") });
  assert.equal(readOutcome(root, "session-a", "codex").attempt.publication.state, "complete");
});

test("Codex extraction rejects schema-invalid successful output before publication", (t) => {
  const { root, transcript } = fixture(t);
  const { job } = enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" }, { root });
  for (const value of [{}, { ...extraction(), topics: [42] }, { ...extraction(), extra: true }, { ...extraction(), decisions: [{ label: "only" }] }]) {
    assert.throws(() => processJob(root, job, { extract: () => value }));
    const outcome = readOutcome(root, "session-a", "codex");
    assert.equal(outcome.attempt.publication.state, "none");
    assert.equal(outcome.attempt.extractors.codex.state, "validation_failed");
    assert.equal(fs.existsSync(path.join(root, "session-a", "current.json")), false);
  }
});

test("Codex validated semantic emptiness differs from extraction failure", (t) => {
  const { root, transcript } = fixture(t);
  const { job } = enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" }, { root });
  const empty = { topic: "", topics: [], keywords: [], initial_request: "", key_utterances: [], cross_refs: [], decisions: [], narrative: { origin: "", direction: "", outcome: "" }, markers: { coinage: [], actor: [], temporal: [], emotional: [], cognitive: [], singularity: [] } };
  processJob(root, job, { extract: () => empty });
  assert.equal(readOutcome(root, "session-a", "codex").attempt.extractors.codex.state, "empty");
});

for (const blocked of ["catalog", "pointer"]) {
  test(`Codex ${blocked} publication failure records partial artifacts and retries reuse generation`, (t) => {
    const { root, transcript } = fixture(t);
    const { job } = enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" }, { root });
    const blocker = blocked === "catalog" ? path.join(root, "catalog") : path.join(root, "session-a", "current.json");
    fs.mkdirSync(path.dirname(blocker), { recursive: true });
    if (blocked === "catalog") fs.writeFileSync(blocker, "blocked");
    else fs.mkdirSync(blocker);
    assert.throws(() => processJob(root, job, { extract: () => extraction() }));
    const partial = readOutcome(root, "session-a", "codex");
    assert.equal(partial.attempt.publication.state, "partial");
    assert.equal(partial.attempt.extractors.codex.state, "succeeded");
    assert.equal(partial.attempt.publication.state, "partial");
    fs.rmSync(blocker, { recursive: true, force: true });
    const result = processJob(root, job, { extract: () => { throw new Error("must reuse"); } });
    assert.equal(result.reused, true);
    assert.equal(readOutcome(root, "session-a", "codex").attempt.publication.state, "complete");
  });
}

test("Codex missing transcript records input failure and stale attempts cannot replace success", (t) => {
  const { root, transcript } = fixture(t);
  const input = { session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" };
  const { job } = enqueueCodexJob(input, { root });
  processJob(root, job, { extract: () => extraction() });
  const outcome = readOutcome(root, "session-a", "codex").attempt;
  assert.throws(() => processJob(root, { ...job, revision: { mtime_ms: job.revision.mtime_ms - 1, size: 0 }, transcript_path: `${transcript}.missing` }));
  assert.notEqual(readOutcome(root, "session-a", "codex").attempt.attempt_id, outcome.attempt_id);
  assert.deepEqual(readOutcome(root, "session-a", "codex").attempt.last_publication, outcome.last_publication);
  fs.unlinkSync(transcript);
  assert.throws(() => processJob(root, job));
  assert.equal(readOutcome(root, "session-a", "codex").attempt.extractors.input.state, "input_failed");
});

test("Codex records raw invocation and output-validation evidence without parsing messages", (t) => {
  const { root, transcript } = fixture(t);
  const { job } = enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" }, { root });
  const extract = (session) => callCodexExtractor(session, { root, run: () => ({ status: 9, signal: null, stderr: "first\nraw failure\nlast" }) });
  assert.throws(() => processJob(root, job, { extract }));
  let outcome = readOutcome(root, "session-a", "codex");
  assert.equal(outcome.attempt.extractors.codex.evidence.status, 9);
  assert.equal(outcome.attempt.extractors.codex.evidence.stderr.text, "first\nraw failure\nlast");
  const malformed = (session) => callCodexExtractor(session, { root, run: (_bin, args) => {
    fs.writeFileSync(args[args.indexOf("--output-last-message") + 1], "{broken");
    return { status: 0, stderr: "validation context" };
  } });
  assert.throws(() => processJob(root, job, { extract: malformed }));
  outcome = readOutcome(root, "session-a", "codex");
  assert.equal(outcome.attempt.extractors.codex.state, "validation_failed");
  assert.equal(outcome.attempt.extractors.codex.evidence.stderr.text, "validation context");
});

test("Codex source shrinking during extraction is reprocessed without publishing superseded output", (t) => {
  const { root, transcript } = fixture(t);
  enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" }, { root });
  let calls = 0;
  runWorker(root, "session-a", { extract: () => {
    calls += 1;
    if (calls === 1) {
      const stat = fs.statSync(transcript);
      const rows = fs.readFileSync(transcript, "utf8").trim().split("\n");
      fs.writeFileSync(transcript, `${rows.slice(0, -2).join("\n")}\n`);
      fs.utimesSync(transcript, stat.atime, stat.mtime);
    }
    return extraction(calls === 1 ? "superseded" : "replacement");
  } });
  assert.equal(calls, 2);
  assert.equal(readOutcome(root, "session-a", "codex").attempt.publication.state, "complete");
  const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog", "session-a.json"), "utf8"));
  assert.equal(catalog.topic, "replacement");
});

test("malformed Codex source is not a validated empty session", (t) => {
  const { transcript, root } = fixture(t);
  fs.writeFileSync(transcript, "malformed JSONL\n");
  const queued = enqueueCodexJob({ session_id: "session-a", transcript_path: transcript, hook_event_name: "Stop" }, { root });
  processJob(root, queued.job, { extract: () => { throw new Error("must not extract without user messages"); } });
  const result = readOutcome(root, "session-a", "codex");
  assert.equal(result.attempt.publication.state, "none");
  assert.equal(result.attempt.extractors.input.state, "input_failed");
});

for (const owner of [null, '{malformed', JSON.stringify({ pid: 0 }), JSON.stringify({ pid: -1 })]) {
  test(`shared lock bounds recovery for invalid owner ${owner}`, (t) => {
    const { root } = fixture(t);
    const directory = path.join(root, '.locks', 'session-a');
    fs.mkdirSync(directory, { recursive: true });
    if (owner !== null) fs.writeFileSync(path.join(directory, 'owner.json'), owner);
    assert.equal(takeSessionLock(root, 'session-a'), null);
    fs.utimesSync(directory, new Date(0), new Date(0));
    const release = takeSessionLock(root, 'session-a');
    assert.equal(typeof release, 'function');
    assert.equal(release.owned(), true);
    release();
    assert.equal(fs.existsSync(directory), false);
  });
}

test('shared lock keeps live owners past the unowned bound and immediately recovers dead owners', (t) => {
  const { root } = fixture(t);
  const directory = path.join(root, '.locks', 'session-a');
  fs.mkdirSync(directory, { recursive: true });
  const ownerPath = path.join(directory, 'owner.json');
  fs.writeFileSync(ownerPath, JSON.stringify({ pid: process.pid }));
  const pastUnownedBound = new Date(Date.now() - 2 * 30 * 60 * 1000);
  fs.utimesSync(directory, pastUnownedBound, pastUnownedBound);
  assert.equal(takeSessionLock(root, 'session-a'), null);
  fs.writeFileSync(ownerPath, JSON.stringify({ pid: 2147483647 }));
  const release = takeSessionLock(root, 'session-a');
  assert.equal(typeof release, 'function');
  release();
});

test('shared lock owner write failure cleans its own newly-created directory', (t) => {
  const { root } = fixture(t);
  const original = fs.writeFileSync;
  const mock = t.mock.method(fs, 'writeFileSync', (...args) => {
    if (String(args[0]).endsWith('/owner.json')) throw Object.assign(new Error('full'), { code: 'ENOSPC' });
    return original(...args);
  });
  assert.throws(() => takeSessionLock(root, 'session-a'), { code: 'ENOSPC' });
  assert.equal(fs.existsSync(path.join(root, '.locks', 'session-a')), false);
  mock.mock.restore();
  takeSessionLock(root, 'session-a')();
});

test('shared lock release preserves a same-PID successor with a different token', (t) => {
  const { root } = fixture(t);
  const release = takeSessionLock(root, 'session-a');
  const directory = path.join(root, '.locks', 'session-a');
  fs.rmSync(directory, { recursive: true });
  const successor = takeSessionLock(root, 'session-a');
  assert.equal(release.owned(), false);
  release();
  assert.equal(successor.owned(), true);
  successor();
});

test('shared stale takeover restores a successor replaced between identity check and rename', (t) => {
  const { root } = fixture(t);
  const directory = path.join(root, '.locks', 'session-a');
  fs.mkdirSync(directory, { recursive: true });
  fs.utimesSync(directory, new Date(0), new Date(0));
  const original = fs.renameSync;
  let successorOwner;
  let replaced = false;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (from === directory && !replaced) {
      replaced = true;
      fs.rmSync(directory, { recursive: true });
      fs.mkdirSync(directory);
      successorOwner = JSON.stringify({ pid: process.pid, token: 'successor' });
      fs.writeFileSync(path.join(directory, 'owner.json'), successorOwner);
    }
    return original(from, to);
  });
  assert.equal(takeSessionLock(root, 'session-a'), null);
  mock.mock.restore();
  assert.equal(fs.readFileSync(path.join(directory, 'owner.json'), 'utf8'), successorOwner);
});

test('shared stale lock contenders preserve mutual exclusion and recover after backoff', async (t) => {
  const { base, root } = fixture(t);
  const directory = path.join(root, '.locks', 'session-a');
  fs.mkdirSync(directory, { recursive: true });
  fs.utimesSync(directory, new Date(0), new Date(0));
  const releasePath = path.join(base, 'release');
  const criticalPath = path.join(base, 'critical');
  const moduleUrl = new URL('../skills/recollect/scripts/session-lock.mjs', import.meta.url).href;
  const code = `import fs from 'node:fs'; import {takeSessionLock} from ${JSON.stringify(moduleUrl)};
    const release = takeSessionLock(${JSON.stringify(root)}, 'session-a');
    if (release) {
      if (!release.owned()) throw new Error('acquisition lost ownership');
      fs.writeFileSync(${JSON.stringify(criticalPath)}, String(process.pid), {flag:'wx'});
      console.log('owned');
      const timer = setInterval(() => {
        if (fs.existsSync(${JSON.stringify(releasePath)})) {
          if (!release.owned()) throw new Error('live owner replaced during contention');
          fs.unlinkSync(${JSON.stringify(criticalPath)});
          release(); clearInterval(timer);
        }
      }, 10);
      setTimeout(() => { release(); process.exit(2); }, 5000).unref();
    } else console.log('busy');`;
  const children = Array.from({ length: 4 }, () => spawn(process.execPath, ['--input-type=module', '-e', code], { stdio: ['ignore', 'pipe', 'pipe'] }));
  t.after(() => children.forEach((child) => child.kill()));
  const completions = children.map((child) => new Promise((resolve) => child.on('exit', resolve)));
  const states = await Promise.all(children.map((child) => new Promise((resolve, reject) => {
    child.stdout.once('data', (chunk) => resolve(chunk.toString().trim()));
    child.on('error', reject);
    child.on('exit', (code) => { if (code) reject(new Error(`child exited ${code}`)); });
  })));
  assert.ok(states.every((state) => state === 'owned' || state === 'busy'));
  assert.ok(states.filter((state) => state === 'owned').length <= 1);
  fs.writeFileSync(releasePath, 'release');
  assert.deepEqual(await Promise.all(completions), [0, 0, 0, 0]);
  assert.equal(fs.existsSync(criticalPath), false);
  const recovered = takeSessionLock(root, 'session-a');
  assert.ok(recovered, 'settled contention must permit a subsequent acquisition');
  try {
    assert.equal(recovered.owned(), true);
    assert.equal(takeSessionLock(root, 'session-a'), null, 'a recovered live owner must exclude another claimant');
  } finally { recovered(); }
  assert.equal(fs.existsSync(directory), false);
});

test('Codex writer and outcome reader use one normalized session key', (t) => {
  const { root, transcript } = fixture(t);
  const sessionId = `session/${'a'.repeat(180)}`;
  enqueueCodexJob({ session_id: sessionId, transcript_path: transcript, hook_event_name: 'Stop' }, { root });
  assert.equal(runWorker(root, sessionId, { extract: () => extraction() }), true);
  const result = readOutcome(root, sessionId, 'codex');
  assert.equal(result.record_state, 'known');
  assert.equal(result.attempt.publication.state, 'complete');
  assert.equal(result.artifacts.length, 3);
  assert.ok(result.artifacts.every((artifact) => artifact.verified));
});

test('shared lock failed owner write preserves a replacement directory', (t) => {
  const { root } = fixture(t);
  const directory = path.join(root, '.locks', 'session-a');
  const original = fs.writeFileSync;
  const successorOwner = JSON.stringify({ pid: process.pid, token: 'replacement' });
  const mock = t.mock.method(fs, 'writeFileSync', (...args) => {
    if (String(args[0]) === path.join(directory, 'owner.json')) {
      fs.rmSync(directory, { recursive: true });
      fs.mkdirSync(directory);
      original(path.join(directory, 'owner.json'), successorOwner);
      throw Object.assign(new Error('full'), { code: 'ENOSPC' });
    }
    return original(...args);
  });
  assert.throws(() => takeSessionLock(root, 'session-a'), { code: 'ENOSPC' });
  mock.mock.restore();
  assert.equal(fs.readFileSync(path.join(directory, 'owner.json'), 'utf8'), successorOwner);
});

test('shared lock release rechecks the detached identity before deletion', (t) => {
  const { root } = fixture(t);
  const release = takeSessionLock(root, 'session-a');
  const directory = path.join(root, '.locks', 'session-a');
  const original = fs.renameSync;
  const successorOwner = JSON.stringify({ pid: process.pid, token: 'replacement' });
  let replaced = false;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (from === directory && !replaced) {
      replaced = true;
      fs.rmSync(directory, { recursive: true });
      fs.mkdirSync(directory);
      fs.writeFileSync(path.join(directory, 'owner.json'), successorOwner);
    }
    return original(from, to);
  });
  release();
  mock.mock.restore();
  assert.equal(fs.readFileSync(path.join(directory, 'owner.json'), 'utf8'), successorOwner);
});

test('missing Codex enqueue source records input failure and releases shared lock', (t) => {
  const { root, transcript } = fixture(t);
  fs.unlinkSync(transcript);
  assert.equal(enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root }), null);
  const result = readOutcome(root, 'session-a', 'codex');
  assert.equal(result.record_state, 'known');
  assert.equal(result.attempt.extractors.codex.state, 'input_failed');
  assert.equal(result.attempt.publication.state, 'none');
  assert.equal(fs.existsSync(path.join(root, '.locks', 'session-a')), false);
});

test('source deleted during Codex extraction records observed input failure without model blame', (t) => {
  const { root, transcript } = fixture(t);
  enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root });
  runWorker(root, 'session-a', { extract: () => { fs.unlinkSync(transcript); return extraction(); } });
  const result = readOutcome(root, 'session-a', 'codex');
  assert.equal(result.attempt.extractors.input.state, 'input_failed');
  assert.equal(result.attempt.publication.state, 'none');
  assert.equal(result.attempt.retry.disposition, 'quarantined');
  assert.equal(fs.existsSync(path.join(root, 'session-a', 'current.json')), false);
  assert.equal(fs.existsSync(path.join(root, '.locks', 'session-a')), false);
});

test('Codex internal extraction exception stays unclassified execution evidence', (t) => {
  const { root, transcript } = fixture(t);
  const { job } = enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root });
  assert.throws(() => processJob(root, job, { extract: () => { throw new ReferenceError('missing helper'); } }));
  const result = readOutcome(root, 'session-a', 'codex');
  assert.equal(result.attempt.execution.state, 'failed');
  assert.match(result.attempt.execution.evidence.message.text, /missing helper/);
  assert.equal(result.attempt.extractors.codex, undefined);
});

test('Codex failure before attempt creation cannot annotate a previous publication', (t) => {
  const { root, transcript } = fixture(t);
  const input = { session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' };
  const { job } = enqueueCodexJob(input, { root });
  processJob(root, job, { extract: () => extraction() });
  const previous = readOutcome(root, 'session-a', 'codex').attempt;
  const original = fs.renameSync;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (String(to).includes('/.outcomes/')) throw Object.assign(new Error('outcome unavailable'), { code: 'EACCES' });
    return original(from, to);
  });
  runWorker(root, 'session-a', { extract: () => extraction() });
  mock.mock.restore();
  assert.deepEqual(readOutcome(root, 'session-a', 'codex').attempt, previous);
});

test('Codex generation reuse retains original capture receipt limitations', (t) => {
  const { root, transcript } = fixture(t);
  fs.appendFileSync(transcript, '{malformed\n');
  const { job } = enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root });
  processJob(root, job, { extract: () => extraction() });
  const previous = readOutcome(root, 'session-a', 'codex');
  const receiptId = previous.artifacts.find((artifact) => artifact.path.endsWith('/record.json')).receipt_id;
  assert.ok(receiptId);
  assert.equal(previous.attempt.receipts[receiptId].extractors.input.state, 'input_failed');
  processJob(root, job, { extract: () => { throw new Error('must reuse'); } });
  const reused = readOutcome(root, 'session-a', 'codex');
  assert.notEqual(reused.attempt.attempt_id, previous.attempt.attempt_id);
  assert.equal(reused.attempt.extractors.codex.state, 'skipped');
  assert.ok(reused.artifacts.every((artifact) => artifact.receipt_id === receiptId));
  assert.deepEqual(reused.attempt.receipts[receiptId], previous.attempt.receipts[receiptId]);
});

test('missing Codex enqueue does not release another active owner', (t) => {
  const { root, transcript } = fixture(t);
  fs.unlinkSync(transcript);
  const release = takeSessionLock(root, 'session-a');
  try {
    assert.equal(enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root }), null);
    assert.equal(release.owned(), true);
    assert.equal(readOutcome(root, 'session-a', 'codex').record_state, 'unknown');
  } finally { release(); }
});

test('Codex outcome persistence failure does not relabel acknowledged physical publication', (t) => {
  const { root, transcript } = fixture(t);
  const input = { session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' };
  const first = enqueueCodexJob(input, { root });
  processJob(root, first.job, { extract: () => extraction('prior') });
  const prior = readOutcome(root, 'session-a', 'codex').attempt;
  fs.appendFileSync(transcript, '\n');
  const next = enqueueCodexJob(input, { root });
  const original = fs.renameSync;
  const failure = Object.assign(new Error('outcome storage full'), { code: 'ENOSPC' });
  let rejected = 0;
  let savedBeforeFailure;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (String(to).includes('/.outcomes/')) {
      const pending = JSON.parse(fs.readFileSync(from, 'utf8'));
      if (pending.state === 'complete') {
        rejected += 1;
        savedBeforeFailure = fs.readFileSync(to, 'utf8');
        throw failure;
      }
    }
    return original(from, to);
  });
  assert.throws(() => processJob(root, next.job, { extract: () => extraction('new physical record') }), (error) => {
    assert.equal(error, failure);
    assert.equal(error.operation, 'outcome_persistence');
    return true;
  });
  mock.mock.restore();
  assert.equal(rejected, 1, 'the failed persistence operation must not trigger a second partial publication record');
  const after = readOutcome(root, 'session-a', 'codex');
  assert.equal(after.attempt.state, 'in_progress');
  assert.deepEqual(after.attempt.last_publication, prior.last_publication);
  const outcomeFile = path.join(root, '.outcomes', 'session-a.json');
  assert.equal(fs.readFileSync(outcomeFile, 'utf8'), savedBeforeFailure);
  const current = JSON.parse(fs.readFileSync(path.join(root, 'session-a', 'current.json'), 'utf8'));
  const record = JSON.parse(fs.readFileSync(path.join(root, 'session-a', current.generation), 'utf8'));
  assert.equal(record.topic, 'new physical record');
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'catalog', 'session-a.json'), 'utf8')).topic, record.topic);
});

test('Codex retry annotation persistence failure preserves the original processing failure', (t) => {
  const { root, transcript } = fixture(t);
  enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root });
  const original = fs.renameSync;
  let rejected = 0;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (String(to).includes('/.outcomes/')) {
      const pending = JSON.parse(fs.readFileSync(from, 'utf8'));
      if (pending.retry) {
        rejected += 1;
        throw Object.assign(new Error('annotation disk failure'), { code: 'EIO' });
      }
    }
    return original(from, to);
  });
  assert.equal(runWorker(root, 'session-a', { extract: () => { throw new ReferenceError('original processing defect'); } }), true);
  mock.mock.restore();
  assert.equal(rejected, 2);
  const result = readOutcome(root, 'session-a', 'codex');
  assert.match(result.attempt.execution.evidence.message.text, /original processing defect/);
  const log = fs.readFileSync(path.join(root, 'logs', 'session-a.log'), 'utf8');
  assert.match(log, /annotation disk failure/);
  assert.match(log, /original processing defect/);
  assert.equal(fs.readdirSync(path.join(root, 'failures', 'session-a')).length, 1);
});

test('Codex error-record persistence failure carries the original execution cause', (t) => {
  const { root, transcript } = fixture(t);
  const { job } = enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root });
  const original = fs.renameSync;
  const storageFailure = Object.assign(new Error('cannot store failure'), { code: 'EIO' });
  const executionFailure = new ReferenceError('execution failed before publication');
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (String(to).includes('/.outcomes/') && JSON.parse(fs.readFileSync(from, 'utf8')).state === 'complete') throw storageFailure;
    return original(from, to);
  });
  assert.throws(() => processJob(root, job, { extract: () => { throw executionFailure; } }), (error) => {
    assert.equal(error, storageFailure);
    assert.equal(error.operation, 'outcome_persistence');
    assert.equal(error.cause, executionFailure);
    return true;
  });
  mock.mock.restore();
  assert.equal(readOutcome(root, 'session-a', 'codex').attempt.state, 'in_progress');
});

test('a second reaper of one stale lock cannot displace the first reaper, so one claimant holds', (t) => {
  const { root } = fixture(t);
  const directory = path.join(root, '.locks', 'session-a');
  fs.mkdirSync(directory, { recursive: true });
  fs.utimesSync(directory, new Date(0), new Date(0));
  const original = fs.renameSync;
  let rival;
  let inside = false;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (from === directory && !inside && rival === undefined) {
      inside = true;
      try { rival = takeSessionLock(root, 'session-a', { reapWaitMs: 0 }); } finally { inside = false; }
    }
    if (String(from).includes('.reap.') && to === directory && !inside) {
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(path.join(directory, 'owner.json'), JSON.stringify({ pid: process.pid, token: 'third' }));
    }
    return original(from, to);
  });
  const first = takeSessionLock(root, 'session-a');
  mock.mock.restore();
  const claimants = [first, rival].filter((release) => typeof release === 'function' && release.owned());
  const displaced = [first, rival].filter((release) => typeof release === 'function' && !release.owned());
  assert.deepEqual(displaced, [], 'no acquirer may hold a release whose lock was moved away');
  assert.ok(claimants.length <= 1);
  claimants.forEach((release) => release());
});

test('a live pid holds its lock only within the age ceiling, and EPERM is not proof of life', (t) => {
  const { root } = fixture(t);
  const directory = path.join(root, '.locks', 'session-a');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'owner.json'), JSON.stringify({ pid: process.pid }));
  assert.equal(takeSessionLock(root, 'session-a', { staleAfterMs: 60_000 }), null);
  fs.utimesSync(directory, new Date(0), new Date(0));
  const recycled = takeSessionLock(root, 'session-a', { staleAfterMs: 60_000 });
  assert.equal(typeof recycled, 'function');
  recycled();
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'owner.json'), JSON.stringify({ pid: 424242 }));
  const kill = t.mock.method(process, 'kill', () => { throw Object.assign(new Error('perm'), { code: 'EPERM' }); });
  assert.equal(takeSessionLock(root, 'session-a', { staleAfterMs: 60_000 }), null);
  fs.utimesSync(directory, new Date(0), new Date(0));
  const foreign = takeSessionLock(root, 'session-a', { staleAfterMs: 60_000 });
  kill.mock.restore();
  assert.equal(typeof foreign, 'function');
  foreign();
});

test('Codex generation reuse without its originating receipt leaves production unknown', (t) => {
  const { root, transcript } = fixture(t);
  const { job } = enqueueCodexJob({ session_id: 'session-a', transcript_path: transcript, hook_event_name: 'Stop' }, { root });
  processJob(root, job, { extract: () => extraction() });
  fs.rmSync(path.join(root, '.outcomes'), { recursive: true, force: true });
  processJob(root, job, { extract: () => { throw new Error('must reuse'); } });
  const reused = readOutcome(root, 'session-a', 'codex');
  assert.equal(reused.attempt.extractors.codex.state, 'skipped');
  const generation = reused.artifacts.find((artifact) => artifact.path.endsWith('/record.json'));
  assert.ok(generation);
  assert.equal(generation.receipt_id, undefined, 'no receipt may be attributed to bytes this attempt did not produce');
});
