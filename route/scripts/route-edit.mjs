#!/usr/bin/env node
/**
 * PreToolUse hook — deliver an edit-channel premise entry at the moment a
 * tool call is about to change the surface the entry names.
 *
 * The session-start index (route-session.mjs) names each premise document
 * and the moment that calls for it, and leaves recognizing the moment to
 * the reader. For a moment that is a file operation the host can do the
 * recognizing: the tool call carries the path, and this hook fires before
 * the call runs. So an entry whose moment is a change to an instruction
 * surface goes out here, once, as the change is made — not at session
 * start, many turns before, where it was found not to be followed.
 *
 * What counts as changing a surface is read off the call. A file tool
 * (Edit, Write, MultiEdit) names its path outright. A shell command is
 * read for a path that names a surface together with a marker of writing —
 * a redirect, an in-place editor, a copy or move, a heredoc, a write call —
 * since a command that only reads a surface is not the moment. Codex's
 * apply_patch carries the patch in `command`, and a surface named there is
 * being changed. The shell reading is a heuristic and states so: it errs
 * toward one short line where a read looked like a write, and the
 * instruction-file pointer stays the route for a write it does not see.
 *
 * Output is the PreToolUse shape both hosts accept for adding context
 * without deciding permission: hookSpecificOutput.additionalContext. On no
 * match nothing is written, and every failure path is silent — a hook that
 * blocks an edit is worse than one that delivers a line less. Zero
 * external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderEditPremise } from "./route-premise.mjs";
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

function render(raw, env) {
  const payload = parsePayload(raw);
  const files = changedPaths(payload);
  if (files.length === 0) return "";
  let context = "";
  try {
    context = renderEditPremise(premiseRoot(env), files);
  } catch {
    // Fail open: an unresolved index costs a line, never the edit.
  }
  if (!context) return "";
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "PreToolUse";
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: context,
    },
  });
}

export { FILE_TOOLS, TEXT_TOOLS, WRITE_MARKER, changedPaths, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  const out = render(raw);
  if (out) process.stdout.write(out + "\n");
  process.exit(0);
}
