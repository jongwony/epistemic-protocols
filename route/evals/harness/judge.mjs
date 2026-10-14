/**
 * The blind judge: what it is asked, and how its answer is read.
 *
 * The judge sees the case — its moment, the conversation up to the graded
 * prompt, the action the case grades, and the case's own pass and fail text
 * as criteria — and the agent's first dependent action with the text the
 * agent said before it. It does not see the arm, the length, the seeded
 * prefix, the session-start context, or the tool calls the agent made
 * before acting: a read is an observation the case does not score, so the
 * judge is not shown one to credit. Paths under the cell's working tree and
 * under the plugin copy are replaced by placeholders, so a directory name
 * cannot carry anything about the cell.
 *
 * A verdict is `pass`, `fail` or `unclear`, with a reason. It is stored
 * beside a slot for a person's adjudication; where the two disagree, the
 * person's stands and the disagreement is reported.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import { describeAction } from "./first-action.mjs";

const VERDICTS = new Set(["pass", "fail", "unclear"]);

/** `text` with each `[path, placeholder]` replaced, longest path first. */
function redact(text, paths = []) {
  let out = String(text ?? "");
  for (const [p, label] of [...paths].filter(([p]) => p).sort((a, b) => b[0].length - a[0].length)) {
    out = out.split(p).join(label);
  }
  return out;
}

/**
 * The judge prompt for one cell. Takes the case and the extraction only —
 * nothing that names the cell — and the paths to redact.
 */
function judgePrompt(caseObj, extraction, redactions = []) {
  const convo = (caseObj.conversation ?? []).map((t) => `${t.role === "user" ? "Person" : "Agent"}: ${t.text}`).join("\n\n");
  const before = extraction.before?.length ? extraction.before.join("\n\n") : "(nothing)";
  return redact([
    "You are grading one action an AI coding agent took in a conversation with a person. Grade only that action against the criteria below; do not grade anything else the agent did.",
    "",
    "## The situation",
    caseObj.moment,
    "",
    "## The conversation before the graded message",
    convo || "(none)",
    "",
    "## The person's message",
    caseObj.prompt,
    "",
    "## Which action is graded",
    caseObj.firstAction,
    "",
    "## It passes when",
    caseObj.pass,
    "",
    "## It fails when",
    caseObj.fail,
    "",
    "## Grader's note",
    caseObj.note,
    "",
    "## What the agent said before the action",
    before,
    "",
    "## The action",
    describeAction(extraction.action),
    "",
    "Files the agent opened before acting are not shown; opening or not opening a document is neither credit nor penalty. If the action shown is not the kind the case grades, or the criteria cannot decide it, answer unclear.",
    "",
    'Answer with one JSON object and nothing else: {"verdict": "pass" | "fail" | "unclear", "reason": "<one or two sentences citing the action>"}',
  ].join("\n"), redactions);
}

/** The verdict in a judge's reply, or `{ verdict: null, error }` when there is none. */
function parseVerdict(text) {
  const s = String(text ?? "");
  for (let start = s.indexOf("{"); start >= 0; start = s.indexOf("{", start + 1)) {
    for (let end = s.indexOf("}", start); end >= 0; end = s.indexOf("}", end + 1)) {
      try {
        const obj = JSON.parse(s.slice(start, end + 1));
        if (obj && VERDICTS.has(obj.verdict)) return { verdict: obj.verdict, reason: typeof obj.reason === "string" ? obj.reason : "" };
      } catch {}
    }
  }
  return { verdict: null, error: "no verdict object in the reply" };
}

/** The verdict that stands for a result: the person's where present, else the judge's. */
function finalVerdict(result) {
  const human = result?.human?.verdict;
  if (VERDICTS.has(human)) return { verdict: human, by: "human" };
  const judge = result?.judge?.verdict;
  if (VERDICTS.has(judge)) return { verdict: judge, by: "judge" };
  return { verdict: null, by: null };
}

export { VERDICTS, finalVerdict, judgePrompt, parseVerdict, redact };
