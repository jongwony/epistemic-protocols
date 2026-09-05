#!/usr/bin/env node
/**
 * PreToolUse / PostToolUse hook — deliver a premise entry at the tool call
 * the matcher decides is its moment.
 *
 * The session-start index (route-session.mjs) names each premise document
 * and the moment that calls for it, and leaves recognizing the moment to
 * the reader. For a moment the host's matcher can decide — a named file
 * tool about to touch a path of a given shape, a named agent tool about to
 * run or just returned — the host does the recognizing: the call carries
 * its tool name and path, and this hook fires around it. So such an entry
 * goes out here, once, at that call. Which calls are which moments is
 * defined beside the index (route-premise.mjs, MOMENTS); this hook supplies
 * the call, read off the payload.
 *
 * The paths a call names are read without interpreting the call. A file
 * tool (Edit, Write, MultiEdit, NotebookEdit) names its path in its input.
 * Codex's apply_patch carries the patch in `command`, and the patch names
 * each file it touches on a header line of its own. A shell command is
 * not read: whether a command writes a file is a reading of its content,
 * and that reading is the reader's, not this hook's — the session index
 * and the project's own instruction-file pointer stay the route for it.
 *
 * Output is the shape both hosts accept for adding context around a call
 * without deciding permission: hookSpecificOutput.additionalContext. On no
 * match nothing is written, and every failure path is silent — a hook that
 * blocks a call is worse than one that delivers a line less. Zero
 * external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderToolPremise } from "./route-premise.mjs";
import { isMain, parsePayload } from "./route-protocols.mjs";

// Tools that name the file they change in their input.
const FILE_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);

// The header lines by which an apply_patch names a file it touches.
const PATCH_FILE = /^\*\*\* (?:Add|Update|Delete) File: (.+?)\s*$|^\*\*\* Move to: (.+?)\s*$/gm;

const EVENTS = new Set(["PreToolUse", "PostToolUse"]);

/** The paths a tool call names as the files it changes, or none. */
function changedPaths(payload) {
  const tool = payload.tool_name;
  const input = payload.tool_input && typeof payload.tool_input === "object" ? payload.tool_input : {};
  if (FILE_TOOLS.has(tool)) {
    const file = input.file_path ?? input.notebook_path;
    return typeof file === "string" && file ? [file] : [];
  }
  if (tool === "apply_patch") {
    const text = typeof input.command === "string" ? input.command : "";
    return [...new Set([...text.matchAll(PATCH_FILE)].map((m) => m[1] ?? m[2]))];
  }
  return [];
}

/** The call as the moment predicates read it, or null off a hook event. */
function describeCall(payload) {
  const event = typeof payload.hook_event_name === "string" ? payload.hook_event_name : "PreToolUse";
  if (!EVENTS.has(event)) return null;
  const tool = typeof payload.tool_name === "string" ? payload.tool_name : "";
  if (!tool) return null;
  return { event, tool, files: changedPaths(payload) };
}

function render(raw, env) {
  const payload = parsePayload(raw);
  const call = describeCall(payload);
  if (!call) return "";
  let context = "";
  try {
    context = renderToolPremise(premiseRoot(env), call);
  } catch {
    // Fail open: an unresolved index costs a line, never the call.
  }
  if (!context) return "";
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: call.event,
      additionalContext: context,
    },
  });
}

export { FILE_TOOLS, changedPaths, describeCall, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  const out = render(raw);
  if (out) process.stdout.write(out + "\n");
  process.exit(0);
}
