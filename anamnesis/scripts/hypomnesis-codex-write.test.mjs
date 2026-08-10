import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
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
  assert.deepEqual(parsed.protocols_used, ["recollect"]);
  assert.equal(parsed.last_turn_at, "2026-08-10T00:00:05Z");
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

  enqueueCodexJob({ ...common, hook_event_name: "SessionEnd" }, { root });
  runWorker(root, "session-a", { extract: () => { throw new Error("same revision must be reused"); } });
  assert.equal(extracts, 1);
  assert.equal(fs.readdirSync(path.join(root, "session-a", "generations")).length, 1);
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
