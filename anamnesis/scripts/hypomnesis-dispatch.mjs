#!/usr/bin/env node
/** Route the shared plugin hook file to its Claude or Codex realization. */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  enqueueCodexJob,
  isCodexTranscript,
  spawnWorker,
} from "./hypomnesis-codex-write.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

function isClaudeTranscript(transcriptPath, env = process.env) {
  if (typeof transcriptPath !== "string") return false;
  const configDir = env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
  const projectsDir = path.resolve(configDir, "projects");
  const resolved = path.resolve(transcriptPath);
  const relative = path.relative(projectsDir, resolved);
  return relative !== ""
    && relative !== ".."
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
    && resolved.endsWith(".jsonl");
}

function runClaudeScript(name, raw, { scriptDir = SCRIPT_DIR } = {}) {
  return spawnSync(process.execPath, [path.join(scriptDir, name)], {
    input: raw,
    encoding: "utf8",
    stdio: ["pipe", "ignore", "pipe"],
  });
}

// A spawned writer's extraction/schema failures must leave a signal
// somewhere; this is that signal. Hook-side work stays short and must not
// fail the hook, so this never throws and never changes the caller's result.
function reportChildFailure(name, result) {
  try {
    if (!result) return;
    if (result.error) {
      process.stderr.write(`hypomnesis-dispatch: ${name} failed to spawn: ${result.error.message}\n`);
      return;
    }
    if (result.status !== 0) {
      const tail = String(result.stderr ?? "").slice(-500);
      process.stderr.write(`hypomnesis-dispatch: ${name} exited ${result.status}: ${tail}\n`);
    }
  } catch {}
}

function dispatchHook(raw, options = {}) {
  let input;
  try { input = JSON.parse(String(raw).trim()); }
  catch { return { runtime: "unknown", handled: false }; }
  const transcriptPath = input?.transcript_path;

  if (isCodexTranscript(transcriptPath)) {
    const queued = enqueueCodexJob(input, options);
    if (!queued) return { runtime: "codex", handled: false };
    if (!options.noSpawn) spawnWorker(queued.root, queued.sessionId, options);
    return { runtime: "codex", handled: true, queued };
  }

  if (!isClaudeTranscript(transcriptPath, options.env)) return { runtime: "unknown", handled: false };
  if (input.hook_event_name === "SessionEnd" || input.hook_event_name === "PreCompact") {
    if (!options.noSpawn) reportChildFailure("hypomnesis-write.mjs", runClaudeScript("hypomnesis-write.mjs", raw, options));
    return { runtime: "claude", handled: true };
  }
  if (input.hook_event_name === "SubagentStop") {
    if (!options.noSpawn) reportChildFailure("hypomnesis-subagent-hook.mjs", runClaudeScript("hypomnesis-subagent-hook.mjs", raw, options));
    return { runtime: "claude", handled: true };
  }
  return { runtime: "claude", handled: false };
}

export { dispatchHook, isClaudeTranscript };

let isMain = true;
try {
  isMain = !!process.argv[1]
    && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
} catch { isMain = true; }

if (isMain) {
  try { dispatchHook(fs.readFileSync(0, "utf8")); } catch {}
  process.exit(0);
}
