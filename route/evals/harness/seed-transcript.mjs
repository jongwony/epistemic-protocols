/**
 * The seeded session a premise cell resumes — and the one place this harness
 * touches the host's transcript format.
 *
 * COUPLING. Everything below writes or reads Claude Code's on-disk session
 * transcript: where it lives (`<config>/projects/<slug of cwd>/<id>.jsonl`),
 * how a user and an assistant turn are shaped, how a SessionStart hook's
 * additional context is stored (an `attachment` entry of type
 * `hook_additional_context` after a `hook_success` entry), and how entries
 * chain by `parentUuid`. None of that is a published interface. It is what a
 * startup transcript of CLI 2.1.296 was observed to carry, and what a
 * `claude -p --resume <id>` on that version was observed to read back as real
 * conversation. That observation is a contract this module holds on the
 * host's behalf, and the seed-check cell (`premise-harness.mjs seed-check`)
 * is the channel that re-runs it: it asks the resumed model for tokens only
 * the seeded head and the seeded turns carry, and audits the transcript the
 * resume left for a second session-start injection. Run it after any CLI
 * update and before reading a measurement; a cell run on a host that fails
 * it measures a conversation other than the one it seeded.
 *
 * Nothing outside this file builds, parses, or names these entry shapes.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/** The CLI version the entry shapes below were observed on. */
const OBSERVED_VERSION = "2.1.296";

/** The directory name the host keeps a working directory's sessions under. */
function projectSlug(cwd) {
  return String(cwd).replace(/[^A-Za-z0-9]/g, "-");
}

/** Where the host looks for session `sessionId` started in `cwd`. */
function transcriptPath(configDir, cwd, sessionId) {
  return path.join(configDir, "projects", projectSlug(cwd), `${sessionId}.jsonl`);
}

/** A stable UUID-shaped id from a seed string. */
function seededUuid(seed) {
  const h = crypto.createHash("sha256").update(seed).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/**
 * The entries of a seeded session, in order.
 *
 * `head` is the session-start context, one string per hook output, placed
 * where a startup session carries it: before the first turn. `hookCommand`
 * is what the stored hook record names as the command that produced it.
 * `turns` are `{ role, text }`, alternating as the conversation had them.
 * Timestamps run one minute apart, ending a minute before `now`, so the
 * seeded conversation reads as having happened just before the prompt.
 */
function buildSeed({ cwd, sessionId, head = [], hookCommand = "", turns = [], model, version = OBSERVED_VERSION, now = Date.now() }) {
  const common = { userType: "external", entrypoint: "cli", cwd, sessionId, version };
  const contexts = head.filter((c) => typeof c === "string" && c.trim());
  const steps = (contexts.length ? 2 : 0) + turns.length;
  let clock = now - (steps + 1) * 60_000;
  const tick = () => new Date((clock += 60_000)).toISOString();
  const entries = [];
  let parent = null;
  const push = (entry) => {
    const uuid = seededUuid(`${sessionId}:${entries.length}`);
    entries.push({ parentUuid: parent, isSidechain: false, ...entry, uuid, timestamp: tick(), ...common });
    parent = uuid;
  };

  if (contexts.length) {
    const stdout = contexts.map((c) => JSON.stringify({
      suppressOutput: true,
      hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: c },
    })).join("\n");
    push({
      type: "attachment",
      attachment: {
        type: "hook_success", hookName: "SessionStart:startup",
        toolUseID: seededUuid(`${sessionId}:hook`), hookEvent: "SessionStart",
        content: "", stdout: `${stdout}\n`, stderr: "", exitCode: 0, command: hookCommand, durationMs: 1,
      },
    });
    push({
      type: "attachment",
      attachment: {
        type: "hook_additional_context", content: contexts,
        hookName: "SessionStart", toolUseID: "SessionStart", hookEvent: "SessionStart",
      },
      rendered: [{ content: `<system-reminder>\nSessionStart hook additional context: ${contexts.join("\n")}\n</system-reminder>` }],
      renderedRole: "system",
    });
  }

  turns.forEach((t, i) => {
    if (t.role === "user") {
      push({ type: "user", message: { role: "user", content: t.text } });
    } else if (t.role === "assistant") {
      push({
        type: "assistant",
        message: {
          id: `msg_seed_${crypto.createHash("sha256").update(`${sessionId}:${i}`).digest("hex").slice(0, 24)}`,
          type: "message", role: "assistant", model,
          content: [{ type: "text", text: t.text }],
          stop_reason: "end_turn", stop_sequence: null,
          usage: { input_tokens: 1, output_tokens: 1 },
        },
      });
    } else {
      throw new Error(`turn ${i}: role ${JSON.stringify(t.role)} is neither user nor assistant`);
    }
  });
  return entries;
}

/** Writes `entries` where the host will look for them; returns the path. */
function writeSeed(configDir, cwd, sessionId, entries) {
  const file = transcriptPath(configDir, cwd, sessionId);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, entries.map((e) => JSON.stringify(e)).join("\n") + "\n");
  return file;
}

/** The entries of a transcript on disk; unparseable lines are dropped. */
function readTranscript(file) {
  let text = "";
  try { text = fs.readFileSync(file, "utf8"); } catch { return []; }
  return text.split("\n").filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

/** The assistant message ids a seed carries, so a reader can tell them from new ones. */
function seededMessageIds(entries) {
  return new Set(entries.filter((e) => e.type === "assistant" && e.message?.id).map((e) => e.message.id));
}

/** The hook contexts an entry list carries, each as `{ event, content }`. */
function hookContexts(entries) {
  return entries
    .filter((e) => e.type === "attachment" && e.attachment?.type === "hook_additional_context")
    .map((e) => ({
      event: e.attachment.hookEvent,
      content: Array.isArray(e.attachment.content) ? e.attachment.content.join("\n") : String(e.attachment.content ?? ""),
    }));
}

/**
 * What the resume added after the seeded entries, read off the transcript it
 * left: how many session-start contexts it injected (zero is the condition a
 * cell depends on), the per-prompt hook contexts it carried, and which
 * attachment types the host added on its own — the cloud session's remote
 * context among them, recorded as a host fact rather than removed.
 */
function auditResume(after, seeded) {
  const seededIds = new Set(seeded.map((e) => e.uuid));
  const added = after.filter((e) => !seededIds.has(e.uuid));
  const contexts = hookContexts(added);
  return {
    seededIntact: seeded.every((e) => after.some((a) => a.uuid === e.uuid)),
    sessionStartInjected: contexts.filter((c) => c.event === "SessionStart").length,
    promptContexts: contexts.filter((c) => c.event === "UserPromptSubmit").map((c) => c.content),
    hostAttachments: [...new Set(added
      .filter((e) => e.type === "attachment" && e.attachment?.type && e.attachment.type !== "hook_additional_context" && e.attachment.type !== "hook_success")
      .map((e) => e.attachment.type))].sort(),
  };
}

export {
  OBSERVED_VERSION,
  auditResume,
  buildSeed,
  hookContexts,
  projectSlug,
  readTranscript,
  seededMessageIds,
  transcriptPath,
  writeSeed,
};
