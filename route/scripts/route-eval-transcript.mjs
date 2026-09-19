/**
 * A fixture's conversation, written where `advise` will actually read it.
 *
 * `advise` takes either a conversation array or a transcript path, and the two
 * are not interchangeable for a measurement. Handing it the array short-circuits
 * `conversationFrom`: no budget derived from what the question and the prompt
 * leave, no endpoint ceiling, no newest-first fill, no `clean`. A run that skips
 * those measures a path the session channel never takes. So a fixture carries
 * turns and the harness materialises them as a transcript, and the shipped walk
 * runs over them exactly as it does over a session's own.
 *
 * The entry shape is the harness's: `type` carries the role, `message.content`
 * carries the blocks, and `isSidechain` marks a subagent's turn. Only `text`
 * blocks are written here — a fixture stating what a tool returned would be
 * stating something `textOf` drops by construction, so the fixture cannot carry
 * it and pretend it was offered.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROLES = new Set(["user", "assistant"]);

/** Short content hash — equality of the turns, not their contents. */
function digestTurns(turns) {
  const normalized = (Array.isArray(turns) ? turns : []).map((t) => ({
    role: t && t.role,
    text: t && t.text,
  }));
  return crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex").slice(0, 16);
}

/**
 * Whether a fixture's `conversation` is the shape this writes. A malformed
 * entry is a fixture defect and is reported as one rather than silently
 * dropped: a turn that vanishes here leaves a run reporting on a state it
 * never offered.
 */
function turnProblems(turns) {
  if (turns === undefined || turns === null) return [];
  if (!Array.isArray(turns)) return ["conversation is not an array"];
  const problems = [];
  turns.forEach((t, i) => {
    if (!t || typeof t !== "object") problems.push(`turn ${i} is not an object`);
    else if (!ROLES.has(t.role)) problems.push(`turn ${i} has role ${JSON.stringify(t.role)}`);
    else if (typeof t.text !== "string" || !t.text.trim()) problems.push(`turn ${i} has no text`);
  });
  return problems;
}

/** One transcript line per turn, in the harness's own entry shape. */
function transcriptLines(turns) {
  return (Array.isArray(turns) ? turns : [])
    .map((t) =>
      JSON.stringify({
        type: t.role,
        isSidechain: false,
        message: { role: t.role, content: [{ type: "text", text: t.text }] },
      }),
    )
    .join("\n");
}

/**
 * A directory the harness owns for this run, and a path per case inside it.
 * Returned together with `cleanup`, because a fixture run that leaves
 * transcripts behind leaves conversations on disk outside the repository.
 */
function transcriptWorkspace(prefix = "route-eval-") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return {
    dir,
    /** Writes `turns` for `id` and returns the path, or "" when there are none. */
    write(id, turns) {
      if (!Array.isArray(turns) || turns.length === 0) return "";
      const file = path.join(dir, `${id.replace(/[^A-Za-z0-9._-]/g, "_")}.jsonl`);
      fs.writeFileSync(file, transcriptLines(turns) + "\n");
      return file;
    },
    cleanup() {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {}
    },
  };
}

export { digestTurns, transcriptLines, transcriptWorkspace, turnProblems };
