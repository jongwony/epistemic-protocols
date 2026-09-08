#!/usr/bin/env node
/**
 * Stop hook — a second pass over an option set the turn just presented.
 *
 * The genuine-choice test — whether a set of options presented to the user
 * genuinely diverges, or collapses to one answer the analysis already
 * settled with the others standing as foils — binds while the set is being
 * written. A hook cannot reach that moment: it fires around tool calls and
 * turn boundaries, and the writing happens between them. What a hook can
 * reach is the turn boundary after the set went out, and this one uses it
 * for a second pass: when the message that just ended presented an option
 * set, the hook holds the stop and hands the test back to the model, which
 * reads its own set once more and adds what changed — the collapse to a
 * relay, or one line saying why the set stays open.
 *
 * This is a retrospective channel by design. The set the user reads is the
 * one already sent; what the second pass adds is appended beneath it. The
 * pre-construction moment stays where it was: on the session index and in
 * the reader's own reasoning. The hook does not judge whether the options
 * diverge — that reading is the reader's, and a hook that did it would
 * move the judgment out of the reasoning it belongs to (route-premise.mjs
 * says why). It judges only what it can read off the message's shape: that
 * a numbered set of options was presented at all.
 *
 * The shape is read off `last_assistant_message`, which the host places
 * in the Stop payload. Two shapes count: a numbered list whose items lead
 * with a bold label — the form a choice takes in markdown — and a divider
 * block that opens with `·` and a rule of `─` and carries numbered items
 * between that opening and its closing rule, the form the epistemic output
 * style renders a checkpoint in. A numbered list of plain steps or findings
 * is not one, and is left alone — including one that follows a closed
 * block of another kind, such as a convergence readout — while a list
 * whose items lead with bold is read as a choice wherever it stands,
 * findings or not: the shape is what is read, never what the items mean.
 * Lines inside a fenced code block do not count, so a message that quotes
 * the shape of a gate is not presenting one. The fence is read the same
 * way, off its own lines — an opener of backticks or tildes and the
 * matching closer — and not off markdown structure: a fence the lines do
 * not show is read as text.
 *
 * The reason also carries the one exemption the test itself declares: a
 * set built to verify understanding — one correct answer by design, the
 * others there to be told apart from it — is not a choice the test reads,
 * and the second pass leaves it as it stands.
 *
 * One pass, never a loop: the host sets `stop_hook_active` on a stop that
 * follows a hook-held continuation, and the hook lets every such stop
 * through. A payload without `last_assistant_message` — a host that does
 * not carry it — passes through as well. Every failure path is silent:
 * a hook that holds a stop it should not is worse than one that lets a
 * set go unreviewed. Output is the shape both hosts accept for holding a
 * stop: `decision: "block"` with a `reason` the model continues from.
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { isMain, parsePayload } from "./route-protocols.mjs";

// A numbered item whose label leads with bold — `1. **Option** — …`.
const BOLD_ITEM = /^\s*\d+[.)]\s+\*\*/;

// Any numbered item.
const ITEM = /^\s*\d+[.)]\s+\S/;

// The opening rule of a checkpoint block in the epistemic output style:
// `· label ───…`.
const DIVIDER = /^·\s.*─{3,}\s*$/;

// The rule that closes such a block: a line of `─` alone.
const RULE = /^─{3,}\s*$/;

// A fenced code block's opening line: three or more backticks or tildes,
// optionally followed by an info string. Indentation is not bounded, since
// a fence inside a list item sits deeper than the three spaces CommonMark
// allows at the top level and this hook does not track containers. A
// backtick fence's info string carries no backtick — a line such as
// ```code``` is an inline span, not an opener.
const FENCE_OPEN = /^\s*(`{3,}|~{3,})(.*)$/;

// A candidate closing line: the fence alone. It closes only a block opened
// with the same character and no longer a run, as CommonMark has it.
const FENCE_CLOSE = /^\s*(`{3,}|~{3,})\s*$/;

/** The fence `line` opens, or "" when it opens none. */
function fenceOpened(line) {
  const m = FENCE_OPEN.exec(line);
  if (!m) return "";
  if (m[1][0] === "`" && m[2].includes("`")) return "";
  return m[1];
}

// What the model continues from. It carries the test itself, its one
// exemption, and the two ways the pass ends, so no document has to be
// fetched at a turn boundary; it names the user's answer as still theirs,
// since a held stop is the model's turn and not a response at the
// checkpoint.
const REASON = [
  "An option set was just presented. Before this turn ends, read it once more:",
  "if the analysis already settles one option — the others standing as foils — say so, relay that conclusion with what settles it, and leave the set behind;",
  "if the options diverge on a value or knowledge only the user holds, say so in one line and leave the set open.",
  "A set built to verify understanding — one correct answer by design, the others there to be told apart from it — is not this test's subject: leave it as it stands.",
  "Add only what changed — do not re-present the set, and do not answer the question for the user; the answer is still theirs.",
  "If what was presented is a list of steps or findings rather than a choice, say so in a few words and stop.",
].join(" ");

/**
 * True when `text` presents a numbered option set, read off its shape alone.
 * Bold-led items count anywhere outside a fence; plain items count only
 * inside the divider block that opens above them, up to its closing rule.
 */
function presentsOptionSet(text) {
  if (typeof text !== "string" || !text) return false;
  let bold = 0;
  let blockItems = 0;
  let inBlock = false;
  let fence = "";
  for (const line of text.split("\n")) {
    if (fence) {
      const close = FENCE_CLOSE.exec(line);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) fence = "";
      continue;
    }
    const open = fenceOpened(line);
    if (open) { fence = open; continue; }
    if (DIVIDER.test(line)) { inBlock = true; blockItems = 0; continue; }
    if (inBlock && RULE.test(line)) { inBlock = false; continue; }
    if (!ITEM.test(line)) continue;
    if (BOLD_ITEM.test(line)) bold += 1;
    if (inBlock && (blockItems += 1) >= 2) return true;
  }
  return bold >= 2;
}

/** The payload's `last_assistant_message`, or "" where the host carries none. */
function lastMessage(payload) {
  const m = payload.last_assistant_message;
  return typeof m === "string" ? m : "";
}

/** The hook's output for `raw`, or "" when the stop passes through. */
function render(raw) {
  const payload = parsePayload(raw);
  if (payload.stop_hook_active === true) return "";
  if (!presentsOptionSet(lastMessage(payload))) return "";
  return JSON.stringify({ decision: "block", reason: REASON });
}

export { REASON, presentsOptionSet, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  let out = "";
  try { out = render(raw); } catch {}
  if (out) process.stdout.write(out + "\n");
  process.exit(0);
}
