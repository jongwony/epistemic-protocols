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
import { STDERR_DETAIL_CHARS } from "./hypomnesis-write.mjs";

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

// The writer emits one diagnostic line per failed extraction, and in the
// spawn-failure class every extraction fails the same way at once — so the unit
// this must not split is the line, not the stream. A character window over the
// whole stream drops whole failures at its seam and leaves a fragment of the
// last; a line window keeps each failure's identity and bounds the rest.
const REPORT_MAX_LINES = 12;
// One writer line at its full budget: the `[hypomnesis-write] <name> extraction
// failed: ` prefix, the spawn message, the ` | child stderr: ` label, and the
// detail. Derived from the writer's own budget rather than chosen beside it, so
// raising one cannot silently outgrow the other.
const REPORT_MAX_LINE_CHARS = STDERR_DETAIL_CHARS + 300;

// Bounded by lines, each bounded in turn, with what was dropped stated rather
// than left to look like the whole.
function formatReport(stderr) {
  const lines = String(stderr ?? "").trim().split("\n").filter((l) => l.trim() !== "");
  const kept = lines.slice(-REPORT_MAX_LINES);
  const dropped = lines.length - kept.length;
  const body = kept
    .map((l) => (l.length <= REPORT_MAX_LINE_CHARS ? l : `${l.slice(0, REPORT_MAX_LINE_CHARS)}…`))
    .join("\n");
  return dropped > 0 ? `[${dropped} earlier lines dropped]\n${body}` : body;
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
    const reported = formatReport(result.stderr);
    if (result.status !== 0) {
      process.stderr.write(`hypomnesis-dispatch: ${name} exited ${result.status}: ${reported}\n`);
      return;
    }
    // Exit status alone reports nothing here: both Claude-side writers catch
    // their own operational failures, write the diagnostic to stderr, and exit
    // zero regardless. Forwarding a non-empty stderr is what makes an
    // extraction, validation, or write failure visible at all.
    if (reported) process.stderr.write(`hypomnesis-dispatch: ${name} reported: ${reported}\n`);
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

export {
  dispatchHook,
  isClaudeTranscript,
  formatReport,
  REPORT_MAX_LINES,
  REPORT_MAX_LINE_CHARS,
};

let isMain = true;
try {
  isMain = !!process.argv[1]
    && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
} catch { isMain = true; }

if (isMain) {
  try { dispatchHook(fs.readFileSync(0, "utf8")); } catch {}
  process.exit(0);
}
