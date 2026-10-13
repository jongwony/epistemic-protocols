#!/usr/bin/env node
/**
 * PostToolUse probe — records, after each shell call in a cell, whether the
 * cell's working tree differs from its committed scaffold.
 *
 * A shell command that writes a file is a dependent action, but whether a
 * command writes is not readable from its text: `cat x` and `sed -i … x`
 * both name `x`. The tree itself is the authoritative state, so the cell's
 * settings register this script after every Bash call, and it appends one
 * line per call to the log named by its argument:
 *
 *   {"toolUseId": "...", "dirty": true|false}
 *
 * `dirty` is whether `git status --porcelain` in the session's cwd prints
 * anything. first-action.mjs reads the log and takes the first call after
 * which the tree is dirty as the write. Every failure is silent and prints
 * nothing: a probe that blocks a cell measures the probe.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { spawnSync } from "node:child_process";

const log = process.argv[2];
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => { raw += d; });
process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(raw || "{}");
    const cwd = typeof payload.cwd === "string" ? payload.cwd : process.cwd();
    const r = spawnSync("git", ["status", "--porcelain"], { cwd, encoding: "utf8" });
    if (r.status !== 0 || !log) return;
    fs.appendFileSync(log, JSON.stringify({ toolUseId: payload.tool_use_id ?? null, dirty: r.stdout.trim().length > 0 }) + "\n");
  } catch {
    // Silent: the probe never shapes the cell it observes.
  }
});
