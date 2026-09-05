#!/usr/bin/env node
/**
 * PreToolUse / PostToolUse hook — deliver a premise entry at the tool call
 * that is its moment.
 *
 * The session-start index (route-session.mjs) names each premise document
 * and the moment that calls for it, and leaves recognizing the moment to
 * the reader. For a moment that is a tool call the host can do the
 * recognizing: the call carries its tool name and input, and this hook
 * fires around it. So an entry whose moment is observable — a file about
 * to change, a question about to be put, work about to be handed off, a
 * delegate reporting back, an action that cannot be undone — goes out
 * here, once, at that call. Which calls are which moments is defined
 * beside the index (route-premise.mjs, MOMENTS); this hook supplies the
 * call, read off the payload.
 *
 * What a call is about to change is read off its input. A file tool (Edit,
 * Write, MultiEdit, NotebookEdit) names its path outright. A shell command
 * is read for a path together with a marker of writing — a redirect, an
 * in-place editor, a copy or move, a heredoc, a write call — since a
 * command that only reads a file is not a change to it. Codex's
 * apply_patch carries the patch in `command`, and a path named there is
 * being changed. The shell reading is a heuristic and states so: it errs
 * toward one short line where a read looked like a write, and the
 * instruction-file pointer a project keeps stays the route for a write it
 * does not see.
 *
 * Output is the shape both hosts accept for adding context around a call
 * without deciding permission: hookSpecificOutput.additionalContext. On no
 * match nothing is written, and every failure path is silent — a hook that
 * blocks a call is worse than one that delivers a line less. Zero external
 * dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderToolPremise } from "./route-premise.mjs";
import { isMain, parsePayload } from "./route-protocols.mjs";

// Tools that name the file they change.
const FILE_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);

// Tools whose `command` is text a changed path may appear in.
const TEXT_TOOLS = new Set(["Bash", "apply_patch"]);

// A path-like token ending in .md, as it appears in shell text or a patch.
const MD_TOKEN = /[\w./~@+-]*\.md\b/g;

// Signs that a shell command writes rather than reads: a redirect (other
// than to /dev/null), tee, an in-place flag, copy or move, a heredoc, or a
// write call in an inline script.
const WRITE_MARKER = /(^|[^<>])>(?!\s*\/dev\/null)|\btee\b|\s-i\b|\bmv\b|\bcp\b|<<-?\s*['"]?\w+|\bopen\(|\.write(_text)?\(|\bwriteFileSync\b/;

const EVENTS = new Set(["PreToolUse", "PostToolUse"]);

/** The paths a tool call is about to change, or none. */
function changedPaths(payload) {
  const tool = payload.tool_name;
  const input = payload.tool_input && typeof payload.tool_input === "object" ? payload.tool_input : {};
  if (FILE_TOOLS.has(tool)) {
    const file = input.file_path ?? input.notebook_path;
    return typeof file === "string" && file ? [file] : [];
  }
  if (TEXT_TOOLS.has(tool)) {
    const text = typeof input.command === "string" ? input.command : "";
    if (!text) return [];
    if (tool === "Bash" && !WRITE_MARKER.test(text)) return [];
    return [...new Set(text.match(MD_TOKEN) ?? [])];
  }
  return [];
}

/** The call as the moment predicates read it, or null off a hook event. */
function describeCall(payload) {
  const event = typeof payload.hook_event_name === "string" ? payload.hook_event_name : "PreToolUse";
  if (!EVENTS.has(event)) return null;
  const tool = typeof payload.tool_name === "string" ? payload.tool_name : "";
  if (!tool) return null;
  const input = payload.tool_input && typeof payload.tool_input === "object" ? payload.tool_input : {};
  return { event, tool, input, files: changedPaths(payload) };
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

export { FILE_TOOLS, TEXT_TOOLS, WRITE_MARKER, changedPaths, describeCall, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  const out = render(raw);
  if (out) process.stdout.write(out + "\n");
  process.exit(0);
}
