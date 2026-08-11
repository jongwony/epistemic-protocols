import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  atomicWriteJson,
  buildCodexCommandArgs,
  chooseLatestJob,
  enqueueCodexJob,
  isCodexTranscript,
  parseCodexRollout,
  publishRecord,
  runWorker,
  spawnWorker,
} from "./hypomnesis-codex-write.mjs";
import { dispatchHook, isClaudeTranscript } from "./hypomnesis-dispatch.mjs";

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
    JSON.stringify({ timestamp: "2026-08-10T00:00:01Z", type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Still readable." }] } }),
  ];
  fs.writeFileSync(transcript, `${rows.join("\n")}\n`, "utf8");

  const parsed = parseCodexRollout(transcript);
  assert.equal(parsed.skipped_lines, 1);
  assert.deepEqual(parsed.user_messages.map((m) => m.text), ["Still readable."]);
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
