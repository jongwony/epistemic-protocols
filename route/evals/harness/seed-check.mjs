/**
 * The seed-check cell: the channel that re-runs the transcript-format
 * contract `seed-transcript.mjs` holds (see the coupling note there).
 *
 * A cell is only worth reading if three things held when it ran:
 *
 *   1. the seeded session-start context at the head was read as context;
 *   2. the seeded turns were read as conversation, at both ends;
 *   3. resuming injected no second session-start context.
 *
 * The check seeds a conversation whose head carries one token and whose
 * first and last turns carry two others, asks for all three without tools,
 * and audits the transcript the resume left. The variants mirror the cell
 * shapes a run seeds: a short conversation, the long prefix, and a head with
 * no turns (the shape of a case with no prior conversation).
 *
 * Building the cell and judging its outcome are both offline; only running
 * it spends.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import crypto from "node:crypto";

const VARIANTS = ["short", "long", "head-only"];

/** Three tokens no conversation would produce by chance. */
function seedTokens(salt = "") {
  const t = (k) => `${k}-${crypto.createHash("sha256").update(`${salt}:${k}`).digest("hex").slice(0, 8)}`;
  return { head: t("HEAD"), first: t("FIRST"), last: t("LAST") };
}

/** The head line a seed-check cell adds beside the arm's own context. */
function headLine(tokens) {
  return `Session check token: ${tokens.head}.`;
}

/** The seeded turns for a variant; `prefix` is the long prefix's turns. */
function seedTurns(variant, tokens, prefix = []) {
  if (variant === "head-only") return [];
  const first = [
    { role: "user", text: `Code word for this session: ${tokens.first}. Keep it in mind; I'll ask for it later.` },
    { role: "assistant", text: `Noted — the code word is ${tokens.first}.` },
  ];
  const last = [
    { role: "user", text: "Give me a reply code I can quote back to you later." },
    { role: "assistant", text: `Your reply code is ${tokens.last}.` },
  ];
  return [...first, ...(variant === "long" ? prefix : []), ...last];
}

/** The prompt a seed-check cell sends on resume. */
const PROMPT = [
  "Answer from this conversation and its context alone; do not use any tools.",
  "Reply with exactly three lines and nothing else:",
  "HEAD=<the session check token from the session-start context, or NONE>",
  "FIRST=<the code word I gave in my first message of this conversation, or NONE>",
  "LAST=<the reply code you gave me in your most recent reply before this message, or NONE>",
].join("\n");

/** `KEY=value` lines out of a reply. */
function readAnswer(text) {
  const out = {};
  for (const m of String(text ?? "").matchAll(/^[\s*`>-]*(HEAD|FIRST|LAST)\s*[=:]\s*[`*]*([A-Za-z0-9-]+)/gm)) out[m[1]] = m[2];
  return out;
}

/**
 * The verdict on a seed-check cell, offline.
 *
 * `reply` is the final result text, `audit` is `auditResume`'s reading of
 * the transcript the resume left, `expectDirective` a string the per-prompt
 * route directive starts with (its presence shows the route copy loaded).
 */
function seedCheckVerdict({ variant, tokens, reply, audit, expectDirective = "[route]" }) {
  const answer = readAnswer(reply);
  const want = {
    HEAD: tokens.head,
    FIRST: variant === "head-only" ? "NONE" : tokens.first,
    LAST: variant === "head-only" ? "NONE" : tokens.last,
  };
  const checks = [
    { name: "head context read", ok: answer.HEAD === want.HEAD, got: answer.HEAD ?? null, want: want.HEAD },
    { name: "first seeded turn read", ok: answer.FIRST === want.FIRST, got: answer.FIRST ?? null, want: want.FIRST },
    { name: "last seeded turn read", ok: answer.LAST === want.LAST, got: answer.LAST ?? null, want: want.LAST },
    { name: "seeded entries intact after resume", ok: !!audit?.seededIntact },
    { name: "no session-start context injected at resume", ok: audit?.sessionStartInjected === 0, got: audit?.sessionStartInjected ?? null },
    { name: "per-prompt route directive delivered", ok: (audit?.promptContexts ?? []).some((c) => c.startsWith(expectDirective)) },
  ];
  return { pass: checks.every((c) => c.ok), checks, hostAttachments: audit?.hostAttachments ?? [] };
}

export { PROMPT, VARIANTS, headLine, readAnswer, seedCheckVerdict, seedTokens, seedTurns };
