#!/usr/bin/env node
/**
 * Public Anamnesis script entrypoint.
 *
 * Marketplace hooks call this proxy; implementation scripts stay behind
 * subcommands so hook wiring does not expose every internal helper directly.
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

function usage() {
  process.stderr.write(`Usage:
  anamnesis.mjs hook write
  anamnesis.mjs hook subagent
  anamnesis.mjs scan [codex-recall-scan args...]
`);
}

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parseJson(raw) {
  try {
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function detectRuntime(payload) {
  const transcriptPath = String(payload.transcript_path ?? "");
  if (transcriptPath.includes("/.codex/")) return "codex";
  if (transcriptPath.includes("/.claude/")) return "claude";
  if (payload.event || payload.hook_event_name) {
    if (payload.model || payload.permission_mode || payload.turn_id) return "codex";
  }
  return "claude";
}

function runNodeScript(relativeScript, args = [], input = "") {
  const result = spawnSync(process.execPath, [path.join(SCRIPT_DIR, relativeScript), ...args], {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.status ?? 0);
}

function hookWrite() {
  const raw = readStdin();
  const payload = parseJson(raw);
  const runtime = detectRuntime(payload);

  if (runtime === "codex") {
    // Codex recall currently reads authoritative rollout JSONL plus
    // session_index/history/hooks.log directly. No writer is required on hook
    // lifecycle events, and hook execution must remain fast and fail-open.
    process.exit(0);
  }

  runNodeScript("hypomnesis-write.mjs", [], raw);
}

function hookSubagent() {
  const raw = readStdin();
  const payload = parseJson(raw);
  const runtime = detectRuntime(payload);
  if (runtime === "codex") process.exit(0);
  runNodeScript("hypomnesis-subagent-hook.mjs", [], raw);
}

function scan(args) {
  const [runtimeMaybe, ...rest] = args;
  if (runtimeMaybe === "codex") {
    runNodeScript("codex-recall-scan.mjs", rest, "");
  }
  if (runtimeMaybe === "all" || runtimeMaybe === "auto") {
    runNodeScript("codex-recall-scan.mjs", rest, "");
  }
  runNodeScript("codex-recall-scan.mjs", args, "");
}

const [domain, command, ...rest] = process.argv.slice(2);

if (domain === "hook" && command === "write") hookWrite();
else if (domain === "hook" && command === "subagent") hookSubagent();
else if (domain === "scan") scan([command, ...rest].filter(Boolean));
else {
  usage();
  process.exit(2);
}
