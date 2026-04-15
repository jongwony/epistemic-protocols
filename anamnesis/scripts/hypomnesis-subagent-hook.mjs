/**
 * SubagentStop hook — substitute channel capture for all substitute channel invocations.
 *
 * Filter: agent_type === "" (non-empty types are typed subagents, not substitute channel).
 * Output: ~/.claude/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl
 *         (append-only; {slug} = dirname(transcript_path)).
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

  if (agent_type === undefined) {
    logErr(`agent_type field absent from payload; skipping`);
    return;
  }
  if (agent_type !== "") {
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
  if (!path.isAbsolute(slugDir)) {
    logErr(`slugDir is not absolute: "${slugDir}" (transcript_path="${transcript_path}"); skipping`);
    return;
  }

  const safeAgentId = path.basename(agent_id);
  if (safeAgentId !== agent_id || safeAgentId === "" || safeAgentId === ".") {
    logErr(`agent_id failed sanitization: "${agent_id}"; skipping`);
    return;
  }

  const target = path.join(slugDir, "hypomnesis", "subagent", `${safeAgentId}.jsonl`);

  const entry = {
    timestamp: new Date().toISOString(),
    session_id,
    agent_id,
    agent_transcript_path: agent_transcript_path ?? null,
    last_assistant_message,
  };

  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.appendFileSync(target, JSON.stringify(entry) + "\n");
  } catch (e) {
    logErr(`write failed target="${target}": ${e.message}`);
    return;
  }
}

try {
  main();
} catch (e) {
  logErr(`unhandled: ${e.message}`);
}
process.exit(0);
