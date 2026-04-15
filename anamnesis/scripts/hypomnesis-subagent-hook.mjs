/**
 * SubagentStop hook — substitute channel capture for /btw and /recap.
 *
 * Filter: agent_type === "" (non-empty types are typed subagents, not substitute channel).
 * Output: ~/.claude/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl (append-only).
 * Non-goals: cooldown gate, LLM extraction, INDEX integration — raw relay only.
 */

import fs from "node:fs";
import path from "node:path";

try { process.on("SIGHUP", () => {}); } catch {}

function logErr(msg) {
  try { process.stderr.write(`[hypomnesis-subagent-hook] ${msg}\n`); } catch {}
}

function readHookInput() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    logErr(`stdin parse failed: ${e.message}`);
    return null;
  }
}

function main() {
  const payload = readHookInput();
  if (!payload) return;

  const { session_id, transcript_path, agent_id, agent_type, agent_transcript_path, last_assistant_message } = payload;

  if (agent_type !== "") {
    logErr(`skipping non-empty agent_type="${agent_type}"`);
    return;
  }
  if (!last_assistant_message) {
    logErr(`empty last_assistant_message; skipping`);
    return;
  }
  if (!transcript_path || !agent_id || !session_id) {
    logErr(`missing required field(s); skipping`);
    return;
  }

  const slugDir = path.dirname(transcript_path);
  if (slugDir === "." || slugDir === "/") {
    logErr(`unexpected slugDir="${slugDir}" from transcript_path="${transcript_path}"; skipping`);
    return;
  }

  const target = path.join(slugDir, "hypomnesis", "subagent", `${agent_id}.jsonl`);
  fs.mkdirSync(path.dirname(target), { recursive: true });

  const entry = {
    timestamp: new Date().toISOString(),
    session_id,
    agent_id,
    agent_transcript_path: agent_transcript_path ?? null,
    last_assistant_message,
  };
  fs.appendFileSync(target, JSON.stringify(entry) + "\n");
}

try {
  main();
} catch (e) {
  logErr(`unhandled: ${e.message}`);
}
process.exit(0);
