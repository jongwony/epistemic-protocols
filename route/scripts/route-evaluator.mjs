#!/usr/bin/env node
/**
 * UserPromptSubmit hook — an advisory line naming protocols the session may
 * fit, from a constrained-output evaluator. Silent unless a key is present in
 * the environment variable config/evaluator.json names: the config says where
 * to send and the key says whether to send, so an install with no key never
 * reaches the network.
 *
 * A constrained-output evaluator reads state the caller assembles and answers
 * over an answer space the caller declares — here, one choice across the
 * installed protocols plus `none`. It returns a typed answer and a probability
 * for every option; it writes no prose and explains nothing. So the line it
 * produces names protocols and stops, and the skill's own Rules are where
 * what separates it from a Route outcome is stated.
 *
 * It reinforces and never replaces. It rides its own hook entry beside
 * route-prompt.mjs rather than inside it, so a failure here does not stop the
 * static directive from being emitted; and the directive goes out whatever
 * this says, including when it says nothing. That still holds with the
 * conversation in state: `none` is an answer about what this hook assembled
 * and offered, not a finding that the session holds no deficit. What the walk
 * dropped, what the budget cut, a deficit that surfaces later in the turn, and
 * a protocol the harness loaded that disk does not show — none of those are in
 * the answer, and the directive is what covers them.
 *
 * The options are built from each protocol's own declared material — its
 * deficit, the resolution it yields, its frontmatter description — and no
 * field says how one protocol differs from another. Whether the declared text
 * separates the candidates on its own is a question for measurement
 * (route-evaluator-eval.mjs).
 *
 * Why the answer is read from the full distribution rather than a confidence
 * threshold, and what a live call returned while that was decided: git log.
 *
 * Which shortfalls yield "" and write nothing is in route-evaluator.test.mjs,
 * which is what re-runs them. Zero external dependencies: Node.js standard
 * library only.
 */

import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { deriveProtocols, isMain, parsePayload, pluginRoot, readJson } from "./route-protocols.mjs";
import { DIRECTIVE } from "./route-prompt.mjs";

const LABEL = "[route advisory — not a /route outcome]";
const NONE = "none";

// Reserved for the fixture harness (route-evaluator-eval.mjs), which reads it
// instead of the session channel's variable. It lives here because this is the
// side that has to refuse it: a binding naming it would route the harness's
// key back into the session channel and undo the separation.
const EVAL_KEY_ENV = "ROUTE_EVAL_API_KEY";
// Both response readers below accumulate into memory before parsing, so they
// need a ceiling that does not depend on the peer behaving.
const MAX_BYTES = 64 * 1024;

// The one shortfall the caller can answer: the state was too large. Every
// other shortfall is null and ends the turn silently.
const OVER_LIMIT = Symbol("over-limit");

// Measured by bisection against the endpoint: it accepted 32,521 single-token
// syllables beside a minimal question and rejected 32,522, over 285 tokens of
// fixed request scaffolding. So the limit is on everything the request carries,
// not on the conversation alone, which is why the budget below is derived from
// it rather than written down.
const CEILING = 32768;

// What a `{role, text}` entry costs before its text: measured at exactly 18 by
// differencing 50 two-character turns against 10. Charged at 20. This is easy
// to miss and expensive to miss: an earlier version charged 4, so a session of
// a few hundred turns walked past the ceiling while the estimate still read
// under it.
const TURN_OVERHEAD = 20;

const INSTRUCTIONS =
  "Which of these protocols, if any, does this session now show the deficit for? `current_prompt` is the turn being asked about; `conversation` is what the session accumulated before it, the user's turns and the replies to them. Each option states the deficit it resolves and the resolution it yields, in that protocol's own words.";

// The share of the room left unasked for.
//
// The measured residual is far smaller than this: after the word-run rule, the
// worst underestimate across every sample tried — prose in four scripts, code,
// JSON, hex digests, base64, UUIDs, file paths — is three percent. A margin
// fitted to that number would be fitted to the wrong thing. Every time a new
// kind of content was measured in this work, it underestimated: Korean first,
// then the per-turn structure, then code points above the BMP, then base64.
// The risk lives in the content nobody has measured yet, and the measured
// residual says nothing about its size.
//
// What decides the size is the cost of being wrong. Overshooting is not a
// failure — the retry catches it — but the retry halves the conversation, so a
// near miss costs half the context rather than a few hundred milliseconds.
// Against that, a quarter of the room is cheap: it leaves about 23k tokens,
// past what a long working session has been observed to carry.
const MARGIN = 0.75;

/**
 * How much conversation there is room for, once the question and the prompt
 * are paid for and the margin is held back.
 *
 * Derived rather than configured, because the question grows: each protocol
 * adds about ninety tokens of options, so a constant written today is a margin
 * that a later protocol silently eats. `stateTokenBudget` stays as a ceiling an
 * adopter can lower, never one that can raise this past what the endpoint takes.
 */
function budgetFor(config, criteria, prompt) {
  const question = estimateTokens(INSTRUCTIONS) + estimateTokens(JSON.stringify(criteria));
  const room = Math.floor((CEILING - question - estimateTokens(prompt)) * MARGIN);
  return Math.max(0, Math.min(config.stateTokenBudget, room));
}

// The option that lets the evaluator decline. Without one, an answer space
// of protocols alone forces a pick from a list that may fit nothing, which
// is the failure the vendor's own guidance names for a closed option set.
// Worded for the session, because the session is what is now in `state`. The
// first version of this line was written when only the prompt was sent, and it
// ended "Say nothing about the rest of the session" — which, once the
// conversation went into state, instructed the evaluator to disregard the very
// thing the question asks it to read. Measured on one deficit case and one
// control: correcting the contradiction moved `none` on the deficit case from
// 0.48 to 0.24 while raising it on the control from 0.93 to 0.99. Both
// directions improved, which is what removing a contradiction looks like —
// unlike tuning, which trades one against the other.
const NONE_CRITERION =
  "The session is proceeding on settled ground: what to do next, and what would settle it, are already determined. No listed protocol's deficit is present.";

function configFile() {
  return path.join(pluginRoot(), "config", "evaluator.json");
}

/**
 * Where to send and how much, or null when the file is absent, unreadable, or
 * names no https endpoint and key variable. It does not decide whether to
 * send: the key named here does, and `advise` reads it.
 */
function loadConfig(file = configFile()) {
  const raw = readJson(file);
  if (!raw) return null;
  const endpoint = typeof raw.endpoint === "string" ? raw.endpoint : "";
  const apiKeyEnv = typeof raw.apiKeyEnv === "string" ? raw.apiKeyEnv : "";
  if (!endpoint.startsWith("https://") || !apiKeyEnv) return null;
  if (apiKeyEnv === EVAL_KEY_ENV) return null;
  return {
    endpoint,
    apiKeyEnv,
    model: typeof raw.model === "string" && raw.model ? raw.model : "jev-latest",
    timeoutMs: Number.isFinite(raw.timeoutMs) && raw.timeoutMs > 0 ? raw.timeoutMs : 2000,
    deadlineMs: Number.isFinite(raw.deadlineMs) && raw.deadlineMs > 0 ? raw.deadlineMs : 3000,
    // A cutoff outside [0,1] is not a cutoff: below it nothing is filtered,
    // above it nothing passes, and either way the field stops meaning what its
    // name says.
    displayCutoff:
      Number.isFinite(raw.displayCutoff) && raw.displayCutoff >= 0 && raw.displayCutoff <= 1
        ? raw.displayCutoff
        : 0.25,
    maxNames: Number.isInteger(raw.maxNames) && raw.maxNames > 0 ? raw.maxNames : 3,
    // A cap an adopter can lower, not the budget itself — that is derived per
    // run from what the question and the prompt leave. Absent, the cap is the
    // ceiling, so the derived value governs alone.
    stateTokenBudget:
      Number.isInteger(raw.stateTokenBudget) && raw.stateTokenBudget > 0
        ? raw.stateTokenBudget
        : CEILING,
  };
}

// Character classes as code-point ranges: above the BMP first, where the
// tokenizer has no entry and falls back to UTF-8 bytes; then Hangul (jamo,
// compatibility jamo, syllables); then the kana and Han blocks; then Latin
// letters and whitespace. Anything else — punctuation, symbols, fullwidth
// forms — is its own class, since punctuation-dense text tokenizes far denser
// than prose.
function classOf(cp) {
  if (cp > 0xffff) return 4;
  if ((cp >= 0x1100 && cp <= 0x11ff) || (cp >= 0x3130 && cp <= 0x318f) ||
      (cp >= 0xac00 && cp <= 0xd7af)) return 0;
  if ((cp >= 0x3040 && cp <= 0x30ff) || (cp >= 0x3400 && cp <= 0x4dbf) ||
      (cp >= 0x4e00 && cp <= 0x9fff) || (cp >= 0xf900 && cp <= 0xfaff)) return 1;
  if ((cp >= 0x41 && cp <= 0x5a) || (cp >= 0x61 && cp <= 0x7a) ||
      cp === 0x20 || cp === 0x09 || cp === 0x0a || cp === 0x0d) return 2;
  return 3;
}

// Fitted against the endpoint: text was sent and `usage.input_tokens` read back
// over Korean, English, Japanese, Chinese, mixed, code, JSON and
// Korean-with-markdown prose. Order matches classOf; the last is the byte
// fallback above the BMP, measured at 3.03 per code point for CJK extension B
// and 2.03 for an emoji.
const RATES = [1.0, 1.14, 0.22, 1.0, 3.1];

// A run of letters and digits is charged as a word only when it reads like
// one. Latin letters cost about a fifth of a token each inside real words,
// because the vocabulary carries the words whole — but a hex digest, a base64
// blob or an identifier is letters by character class and nothing like a word
// to the tokenizer, and costs near a full token per character. Measured on
// runs this rule catches: hex 0.69 predicted against actual before it, base64
// 0.63, a UUID run 0.80. The discriminators are a digit inside the run, which
// no ordinary word carries, and a length no ordinary word reaches.
const WORDLIKE_MAX = 14;
const ALNUM = /[A-Za-z0-9]/;
const DIGIT = /[0-9]/;

/**
 * What a string is likely to cost, without a tokenizer.
 *
 * No static estimate is safe on its own, which is why the transport retries a
 * rejection rather than trusting this one. Measuring by character class shows
 * why: ordinary Korean prose costs about 0.66 tokens per character, but a run
 * of rare syllables costs 2.14 — out of vocabulary, so the tokenizer falls
 * back to bytes. A coefficient covering that tail would throw away two thirds
 * of the budget on every ordinary session, and counting bytes does no better,
 * since the same run costs 1.4 bytes per token against 5.1 for English prose.
 * So this is fitted to ordinary text, the word-run rule above covers the
 * non-word alphanumerics that ordinary text does carry, and the retry carries
 * what is left.
 *
 * It is fitted to prose in each script rather than to a document mixing them.
 * An earlier pass calibrated the CJK rate on this repository's Korean README —
 * a file carrying markdown, code spans and English identifiers, all Latin-rate
 * text inflating the average — and undercounted Korean sentences by about
 * half. A budget set under the endpoint's ceiling then produced a request over
 * it, and every prompt of a Korean session answered `400 max_tokens_exceeded`,
 * silently, because a shortfall here is "".
 */
function estimateTokens(text) {
  if (typeof text !== "string") return 0;
  let total = 0;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ALNUM.test(ch)) {
      let j = i;
      let digits = false;
      while (j < text.length && ALNUM.test(text[j])) {
        if (DIGIT.test(text[j])) digits = true;
        j += 1;
      }
      const run = j - i;
      total += run * (digits || run > WORDLIKE_MAX ? RATES[3] : RATES[2]);
      i = j;
      continue;
    }
    const cp = text.codePointAt(i);
    total += RATES[classOf(cp)];
    i += cp > 0xffff ? 2 : 1;  // a surrogate pair is one code point
  }
  return Math.ceil(total);
}

/**
 * The text of one transcript entry — and the whole of what "tool calls
 * excluded" means here. A content array carries `text`, `tool_use`,
 * `tool_result`, `thinking` and whatever a later version adds; keeping only
 * `text` drops every one of the others by construction rather than by a list
 * this file would have to maintain against the harness.
 */
function textOf(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((b) => b && b.type === "text")
    .map((b) => (typeof b.text === "string" ? b.text : ""))
    .filter(Boolean)
    .join("\n");
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Anchored to the line start, because that is where an injected line sits and
// a mention does not. Unanchored, this ate legitimate prose: a turn that
// discusses the advisory — a review of it, this repository's own README —
// carries the label mid-line, and everything after it to the newline was
// being cut out of the conversation as though it were an injection.
const OWN_ADVISORY = new RegExp(`^[ \t]*${escapeRe(LABEL)}[^\n]*`, "gm");

/**
 * Strip what the harness wrapped around a turn, and what this plugin itself
 * put there. The second half matters more than it looks: the per-prompt
 * directive and this channel's own advisory arrive appended to user turns, so
 * without this the state would carry one copy per turn of text this plugin
 * wrote — the channel reading itself back, and paying for it.
 */
function clean(text) {
  let t = text.split(DIRECTIVE).join("");
  t = t.replace(OWN_ADVISORY, "");
  return t
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/<local-command-[^>]*>[\s\S]*?<\/local-command-[^>]*>/g, "")
    .replace(/<command-[^>]*>[\s\S]*?<\/command-[^>]*>/g, "")
    .trim();
}

/**
 * The conversation as state: the user's turns and the assistant's replies, in
 * order, newest-first up to the budget and then restored to chronological
 * order — because what a deficit is read from is the recent stretch, and the
 * oldest turn is the one to lose when the budget binds.
 *
 * A subagent's turns are dropped: they are a different conversation, carried
 * out under a brief rather than with the user, and the deficit Route matches
 * is in the one the user is in. Returns [] on any shortfall, so a transcript
 * that cannot be read leaves the prompt-only state this shipped with.
 */
function conversationFrom(transcriptPath, budgetTokens, options = {}) {
  if (typeof transcriptPath !== "string" || !transcriptPath) return [];
  let raw;
  try {
    raw = (options.readFile ?? fs.readFileSync)(transcriptPath, "utf8");
  } catch {
    return [];
  }
  if (typeof raw !== "string") return [];
  const turns = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (!entry || typeof entry !== "object") continue;
    if (entry.isSidechain === true) continue;
    const role = entry.type;
    if (role !== "user" && role !== "assistant") continue;
    const text = clean(textOf(entry.message ? entry.message.content : ""));
    if (!text) continue;
    turns.push({ role, text });
  }
  const kept = [];
  let spent = 0;
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    const cost = estimateTokens(turns[i].text) + TURN_OVERHEAD;
    if (spent + cost > budgetTokens) {
      // A single turn larger than the whole budget would otherwise leave the
      // state empty — the one turn nearest the deficit dropped for being the
      // one that says the most. Carry its tail instead, on the same
      // newest-first rule the walk runs on, and only when nothing is kept yet.
      if (kept.length === 0) {
        const room = Math.max(0, budgetTokens - TURN_OVERHEAD);
        const text = turns[i].text;
        const ratio = estimateTokens(text) / text.length;
        const chars = ratio > 0 ? Math.floor(room / ratio) : 0;
        if (chars > 0) kept.push({ role: turns[i].role, text: text.slice(-chars) });
      }
      break;
    }
    spent += cost;
    kept.push(turns[i]);
  }
  return kept.reverse();
}

/**
 * One option per protocol, its value assembled from that protocol's own
 * declared text and nothing else. The deficit → resolution pair names the
 * transition; the description is what the protocol itself publishes about
 * the situation it is for.
 */
function buildCriteria(protocols) {
  const criteria = {};
  for (const p of protocols) {
    if (!p || typeof p.command !== "string" || !p.command) continue;
    const transition = p.resolution ? `${p.deficit} → ${p.resolution}` : String(p.deficit);
    criteria[p.command] = p.description
      ? { declares: transition, description: p.description }
      : { declares: transition };
  }
  if (Object.keys(criteria).length === 0) return null;
  criteria[NONE] = NONE_CRITERION;
  return criteria;
}

function buildRequest(config, prompt, criteria, conversation) {
  const state = { current_prompt: prompt };
  if (Array.isArray(conversation) && conversation.length > 0) state.conversation = conversation;
  return JSON.stringify({
    model: config.model,
    state,
    questions: {
      deficit: {
        type: "choice",
        instructions: INSTRUCTIONS,
        criteria,
      },
    },
  });
}

/**
 * POST once. Resolves to the parsed body, `OVER_LIMIT` when the endpoint
 * rejects the state as too large, or null on any other shortfall.
 *
 * The rejection is told apart from the rest because it is the one shortfall
 * the caller can do something about: no static estimate is safe against
 * out-of-vocabulary text, so the estimate is fitted to ordinary prose and this
 * signal carries the tail. Measured round trip for a rejection followed by a
 * halved retry: about 700 ms, against the 30 s this event allows a hook.
 */
function ask(config, key, body) {
  return new Promise((resolve) => {
    let settled = false;
    let timer = null;
    let req;
    const done = (value) => {
      if (!settled) {
        settled = true;
        if (timer) clearTimeout(timer);
        try { req?.destroy(); } catch {}
        resolve(value);
      }
    };
    // `timeout` above is a socket inactivity timer, so it alone lets a peer
    // that dribbles a byte inside every window hold the request open for as
    // long as it likes. This is the wall-clock cap that actually ends it.
    timer = setTimeout(() => done(null), config.deadlineMs);
    if (typeof timer.unref === "function") timer.unref();
    try {
      req = https.request(
        config.endpoint,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${key}`,
            "content-length": Buffer.byteLength(body),
          },
          timeout: config.timeoutMs,
        },
        (res) => {
          if (res.statusCode === 400) {
            let detail = "";
            res.setEncoding("utf8");
            res.on("data", (c) => {
              if (detail.length + c.length > MAX_BYTES) {
                done(null);
                return;
              }
              detail += c;
            });
            res.on("end", () => done(detail.includes("max_tokens_exceeded") ? OVER_LIMIT : null));
            res.on("error", () => done(null));
            return;
          }
          if (res.statusCode !== 200) {
            res.resume();
            done(null);
            return;
          }
          let text = "";
          res.setEncoding("utf8");
          res.on("data", (c) => {
            if (text.length + c.length > MAX_BYTES) {
              done(null);
              return;
            }
            text += c;
          });
          res.on("end", () => {
            try {
              const parsed = JSON.parse(text);
              done(parsed && typeof parsed === "object" ? parsed : null);
            } catch {
              done(null);
            }
          });
          res.on("error", () => done(null));
        },
      );
    } catch {
      done(null);
      return;
    }
    req.on("error", () => done(null));
    req.on("timeout", () => {
      done(null);
      req.destroy();
    });
    try {
      req.end(body);
    } catch {
      done(null);
    }
  });
}

/**
 * The names to show: the winner, plus any other protocol carrying a real
 * share of the probability. `none` on top ends it — and `none` anywhere
 * else is not a name to show. Order is by probability, descending, so the
 * strongest reads first.
 */
function namesFrom(answer, config, optionNames = null) {
  const probabilities = answer && answer.probabilities;
  if (!probabilities || typeof probabilities !== "object" || Array.isArray(probabilities)) return [];
  // The answer space is ours, so a key outside it is not an answer to the
  // question we asked. Without this the peer chooses the text: the names go
  // into additionalContext verbatim, and a key carrying a newline leaves the
  // advisory line and reads as a second instruction. An array's indices are
  // finite-valued entries too, and a value outside [0,1] did not come from a
  // distribution.
  const allowed = optionNames ? new Set(optionNames) : null;
  const ranked = Object.entries(probabilities)
    .filter(([name, v]) =>
      Number.isFinite(v) && v >= 0 && v <= 1 && (allowed ? allowed.has(name) : /^[a-z][a-z0-9-]*$/.test(name)))
    .sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return [];
  // `none` decides by mass, not by rank. A sort leaves ties in whatever order
  // the response happened to serialize its keys in, so reading rank alone lets
  // the server's key order pick between "nothing fits" and a named protocol —
  // and a tie is exactly what a real session produces once the conversation is
  // in state. Requiring a name to carry strictly more mass than `none` breaks
  // the tie the one way that is safe to be wrong in: silence.
  const none = Number.isFinite(probabilities[NONE]) ? probabilities[NONE] : 0;
  return ranked
    .filter(([name, v]) => name !== NONE && v > none && v >= config.displayCutoff)
    .slice(0, config.maxNames)
    .map(([name]) => name);
}

/**
 * Modal, and asking to be checked. "may fit" rather than "fits", because a
 * calibrated answer is a property of many answers and says nothing certain
 * about this one; and the check is named because the hook reads installed
 * plugins from disk while Route's candidates come from what the harness
 * actually loaded — a name here can be a protocol the reader cannot invoke.
 */
function renderAdvisory(names) {
  if (!names || names.length === 0) return "";
  const list = names.map((n) => `/${n}`).join(", ");
  return `${LABEL} This prompt may fit ${list}. Verify each is loaded and fits the full context before invoking /route; ignore any that does not. This is not a routing decision and nothing has been invoked.`;
}

/**
 * The advisory for a prompt, or "" — and the trace the measurement harness
 * reads: which model actually answered (the configured name may be an alias
 * that moves), the full distribution, and why an empty result was empty.
 */
async function advise(prompt, options = {}) {
  const empty = (reason) => ({ advisory: "", reason, model: null, probabilities: null });
  if (typeof prompt !== "string" || !prompt.trim()) return empty("no-prompt");
  // An explicit null is a caller saying there is no binding, which is not the
  // same as not passing one; `??` would read them alike and fall through to
  // disk in both cases.
  const config = options.config === undefined ? loadConfig() : options.config;
  if (!config) return empty("no-binding");
  const key = (options.env ?? process.env)[config.apiKeyEnv];
  if (!key) return empty("no-key");
  const protocols = options.protocols ?? deriveProtocols();
  const criteria = buildCriteria(protocols);
  if (!criteria) return empty("no-candidates");
  const conversation = options.conversation
    ?? conversationFrom(options.transcriptPath, budgetFor(config, criteria, prompt));
  const send = options.ask ?? ask;
  // The shipped transport resolves rather than throwing, but this function's
  // contract is that nothing reaches the hook as a rejection — an unhandled
  // one there would be a hook that fails loudly on a turn it was supposed to
  // be able to say nothing about.
  const attempt = async (turns) => {
    try {
      return await send(config, key, buildRequest(config, prompt, criteria, turns));
    } catch {
      return null;
    }
  };
  let offered = conversation;
  let body = await attempt(offered);
  if (body === OVER_LIMIT) {
    // The estimate is fitted to ordinary prose, so out-of-vocabulary text can
    // cost several times what it predicted. Halving the conversation is the
    // one correction available without a tokenizer, and it is taken once: a
    // second rejection means the state is not the conversation's fault.
    offered = conversation.slice(Math.ceil(conversation.length / 2));
    body = offered.length > 0 ? await attempt(offered) : await attempt([]);
    if (body === OVER_LIMIT) return empty("over-limit");
  }
  if (!body) return empty("no-answer");
  const answer = body.answers && body.answers.deficit;
  if (!answer || typeof answer !== "object") return empty("no-answer");
  const names = namesFrom(answer, config, Object.keys(criteria));
  return {
    advisory: renderAdvisory(names),
    reason: names.length === 0 ? "none" : "advised",
    // The configured model may be an alias; the response says what answered.
    // A fixture graded against one version and replayed under another is
    // measuring two things, and only this field shows it.
    model: typeof body.model === "string" ? body.model : null,
    probabilities: answer.probabilities ?? null,
    turns: offered.length,
  };
}

function render(advisory, eventName = "UserPromptSubmit") {
  if (!advisory) return JSON.stringify({ suppressOutput: true });
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: { hookEventName: eventName, additionalContext: advisory },
  });
}

export {
  CEILING,
  EVAL_KEY_ENV,
  INSTRUCTIONS,
  LABEL,
  MARGIN,
  NONE,
  OVER_LIMIT,
  TURN_OVERHEAD,
  advise,
  budgetFor,
  buildCriteria,
  buildRequest,
  clean,
  conversationFrom,
  estimateTokens,
  loadConfig,
  namesFrom,
  render,
  renderAdvisory,
  textOf,
};

if (isMain(import.meta.url)) {
  let raw = "";
  try {
    raw = fs.readFileSync(0, "utf8");
  } catch {}
  const payload = parsePayload(raw);
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "UserPromptSubmit";
  const prompt = typeof payload.prompt === "string" ? payload.prompt : "";
  const transcriptPath =
    typeof payload.transcript_path === "string" ? payload.transcript_path : "";
  advise(prompt, { transcriptPath })
    .then((result) => {
      process.stdout.write(render(result.advisory, eventName) + "\n");
      process.exit(0);
    })
    .catch(() => {
      process.stdout.write(render("", eventName) + "\n");
      process.exit(0);
    });
}
