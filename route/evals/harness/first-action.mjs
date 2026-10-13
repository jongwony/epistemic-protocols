/**
 * The first dependent action of a cell, read off its stream-json trace.
 *
 * The trace a `claude -p --output-format stream-json --verbose` run prints
 * starts after the graded prompt, so everything in it is the agent's answer
 * to that prompt. The first dependent action is the first of:
 *
 *   - a tool call that changes something or hands work on — a file write
 *     (Edit, Write, MultiEdit, NotebookEdit) or a delegation or message to
 *     another agent (Agent, Task, SendMessage);
 *   - an assistant message carrying text and no tool call at all, which is a
 *     reply standing in for an action: a claim, a question, a proposal.
 *
 * Every other tool call before it — a Read, a search, a shell command, a
 * skill invocation — is recorded as an observation and never scored. Text
 * that shares a message with such a call is kept beside the action as what
 * the agent said before it, because a case's first action can be a claim
 * made in passing before a check runs.
 *
 * A shell command that writes a file is an observation here: whether a
 * command writes is a reading of its content, and this extractor reads only
 * tool names. A subagent's own events (non-null `parent_tool_use_id`) are
 * not the agent's actions and are skipped.
 *
 * Zero external dependencies: Node.js standard library only.
 */

const DEPENDENT_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit", "Agent", "Task", "SendMessage"]);

/** Parses JSONL text into events; unparseable lines are dropped. */
function parseStream(text) {
  return String(text ?? "").split("\n").filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

/**
 * The main agent's assistant messages, in order, each as its content blocks.
 * Events sharing a message id are one message: the stream may print a
 * message's blocks across several events.
 */
function assistantMessages(events, ignore = new Set()) {
  const order = [];
  const byId = new Map();
  events.forEach((e, i) => {
    if (e?.type !== "assistant" || e.parent_tool_use_id) return;
    const content = Array.isArray(e.message?.content) ? e.message.content : [];
    const id = e.message?.id ?? `event-${i}`;
    if (ignore.has(id)) return;
    if (!byId.has(id)) { byId.set(id, []); order.push(id); }
    byId.get(id).push(...content);
  });
  return order.map((id) => ({ id, blocks: byId.get(id) }));
}

/** What an observation records of a tool call: its name and where it pointed. */
function observation(block) {
  const input = block.input && typeof block.input === "object" ? block.input : {};
  const target = input.file_path ?? input.notebook_path ?? input.path ?? input.pattern ?? input.command ?? input.skill ?? input.url ?? null;
  return { tool: block.name, target: typeof target === "string" ? target : null };
}

/**
 * The first dependent action and what preceded it.
 *
 * Returns `{ action, before, observations, result, init }`:
 *   - `action` is `{ kind: "tool", tool, input }`, `{ kind: "text", text }`,
 *     or `{ kind: "none" }` when the turn ended with neither;
 *   - `before` is the assistant text said before the action, in order;
 *   - `observations` are the tool calls before it, never scored;
 *   - `result` and `init` are the stream's own result and init events, for
 *     the cost, turn count, stop reason and loaded plugins.
 *
 * `ignore` holds message ids that are not the agent's answer — the seeded
 * turns, should a host ever echo them into the stream.
 */
function firstAction(events, { ignore = new Set() } = {}) {
  const init = events.find((e) => e?.type === "system" && e.subtype === "init") ?? null;
  const result = [...events].reverse().find((e) => e?.type === "result") ?? null;
  const before = [];
  const observations = [];
  for (const { blocks } of assistantMessages(events, ignore)) {
    const tools = blocks.filter((b) => b?.type === "tool_use");
    const texts = blocks.filter((b) => b?.type === "text" && typeof b.text === "string" && b.text.trim());
    if (tools.length === 0 && texts.length > 0) {
      return { action: { kind: "text", text: texts.map((b) => b.text).join("\n\n") }, before, observations, result, init };
    }
    for (const b of blocks) {
      if (b?.type === "text" && typeof b.text === "string" && b.text.trim()) before.push(b.text);
      else if (b?.type === "tool_use") {
        if (DEPENDENT_TOOLS.has(b.name)) {
          return { action: { kind: "tool", tool: b.name, input: b.input ?? {} }, before, observations, result, init };
        }
        observations.push(observation(b));
      }
    }
  }
  return { action: { kind: "none" }, before, observations, result, init };
}

/** The action rendered as text for a reader — the judge, or a person. */
function describeAction(action) {
  if (!action || action.kind === "none") return "(no dependent action: the turn ended without a write, a delegation, or a text-only reply)";
  if (action.kind === "text") return `Reply to the person:\n${action.text}`;
  const input = action.input ?? {};
  const lines = [`Tool call: ${action.tool}`];
  for (const [k, v] of Object.entries(input)) {
    lines.push(`${k}:`);
    lines.push(typeof v === "string" ? v : JSON.stringify(v, null, 2));
  }
  return lines.join("\n");
}

export { DEPENDENT_TOOLS, describeAction, firstAction, parseStream };
