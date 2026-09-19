#!/usr/bin/env node
/**
 * UserPromptSubmit hook — an advisory line naming protocols the prompt may
 * fit, from a constrained-output evaluator. Disabled unless
 * config/evaluator.json says otherwise.
 *
 * What this is, and what it is not. A constrained-output evaluator reads
 * state the caller assembles and answers over an answer space the caller
 * declares — here, one choice across the installed protocols plus `none`.
 * It returns a typed answer and a probability for every option; it writes
 * no prose and explains nothing. So the line it produces names protocols
 * and stops. It is not a Route nudge: `↗ /command — reason` is Route's own
 * output, produced by invoking Route, and Rule #1 says a line written
 * without that invocation is not one. This line is input the reader may
 * consider before Route produces any outcome of its own, and its wording
 * says so — labelled, modal, and asking to be checked.
 *
 * It reinforces and never replaces. It rides its own hook entry beside
 * route-prompt.mjs rather than inside it, so a timeout here cannot take the
 * static directive down with it; and the directive goes out whatever this
 * says, including when it says nothing. That matters more than it looks:
 * `none` is an answer about the prompt this hook was handed, not a finding
 * that the session holds no deficit — the accumulated context that Route
 * actually matches against is not in this hook's reach, and neither is a
 * deficit that surfaces later in the turn.
 *
 * The cards are built from each protocol's own declared material — its
 * deficit, the resolution it yields, and its frontmatter description. No
 * field here says how one protocol differs from another. Authored
 * cross-protocol discrimination would be exactly the hand-kept routing
 * table SKILL.md's Rule #2 refuses, and README.md extends that refusal to
 * this surface where it says the directive names no protocol. Whether the
 * declared text separates the candidates on its own is a question for
 * measurement (route-evaluator-eval.mjs), not one to pre-empt by writing
 * the differences in.
 *
 * The answer is read from `probabilities`, never by thresholding
 * `confidence`. Confidence measures how concentrated the distribution is,
 * so a low value means the mass is spread — several options fit — which is
 * Route's own several-fit outcome, not its silence. Gating on it would
 * delete the case the advisory is most useful for. A live call during this
 * work returned inquire 0.43 / sublate 0.42 at confidence 0.29 on a real
 * prompt where both did fit.
 *
 * Every shortfall — disabled, no config, no key, timeout, non-200,
 * malformed body, no candidates, `none` on top — yields "" and writes
 * nothing. Nothing here throws. Zero external dependencies: Node.js
 * standard library only.
 */

import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { deriveProtocols, isMain, parsePayload, pluginRoot, readJson } from "./route-protocols.mjs";

const LABEL = "[route advisory — not a /route outcome]";
const NONE = "none";

// The option that lets the evaluator decline. Without one, an answer space
// of protocols alone forces a pick from a list that may fit nothing, which
// is the failure the vendor's own guidance names for a closed option set.
const NONE_CRITERION =
  "This prompt supports none of the listed protocols. Say nothing about the rest of the session.";

function configFile() {
  return path.join(pluginRoot(), "config", "evaluator.json");
}

/** The binding, or null when absent, unreadable, or off. */
function loadConfig(file = configFile()) {
  const raw = readJson(file);
  if (!raw || raw.enabled !== true) return null;
  const endpoint = typeof raw.endpoint === "string" ? raw.endpoint : "";
  const apiKeyEnv = typeof raw.apiKeyEnv === "string" ? raw.apiKeyEnv : "";
  if (!endpoint.startsWith("https://") || !apiKeyEnv) return null;
  return {
    endpoint,
    apiKeyEnv,
    model: typeof raw.model === "string" && raw.model ? raw.model : "jev-latest",
    timeoutMs: Number.isFinite(raw.timeoutMs) && raw.timeoutMs > 0 ? raw.timeoutMs : 2000,
    displayCutoff: Number.isFinite(raw.displayCutoff) ? raw.displayCutoff : 0.25,
    maxNames: Number.isInteger(raw.maxNames) && raw.maxNames > 0 ? raw.maxNames : 3,
  };
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

function buildRequest(config, prompt, criteria) {
  return JSON.stringify({
    model: config.model,
    state: { current_prompt: prompt },
    questions: {
      deficit: {
        type: "choice",
        instructions:
          "Which of these protocols, if any, does this prompt show the deficit for? Each option states the deficit it resolves and the resolution it yields, in that protocol's own words.",
        criteria,
      },
    },
  });
}

/** POST once. Resolves to the parsed body, or null on any shortfall. */
function ask(config, key, body) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (value) => {
      if (!settled) {
        settled = true;
        resolve(value);
      }
    };
    let req;
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
          if (res.statusCode !== 200) {
            res.resume();
            done(null);
            return;
          }
          let text = "";
          res.setEncoding("utf8");
          res.on("data", (c) => {
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
function namesFrom(answer, config) {
  const probabilities = answer && answer.probabilities;
  if (!probabilities || typeof probabilities !== "object") return [];
  const ranked = Object.entries(probabilities)
    .filter(([, v]) => Number.isFinite(v))
    .sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return [];
  if (ranked[0][0] === NONE) return [];
  return ranked
    .filter(([name, v]) => name !== NONE && v >= config.displayCutoff)
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
  const config = options.config ?? loadConfig();
  if (!config) return empty("disabled");
  const key = (options.env ?? process.env)[config.apiKeyEnv];
  if (!key) return empty("no-key");
  const protocols = options.protocols ?? deriveProtocols();
  const criteria = buildCriteria(protocols);
  if (!criteria) return empty("no-candidates");
  const send = options.ask ?? ask;
  // The shipped transport resolves to null rather than throwing, but this
  // function's contract is that nothing reaches the hook as a rejection —
  // an unhandled one there would be a hook that fails loudly on a turn it
  // was supposed to be able to say nothing about.
  let body;
  try {
    body = await send(config, key, buildRequest(config, prompt, criteria));
  } catch {
    return empty("no-answer");
  }
  if (!body) return empty("no-answer");
  const answer = body.answers && body.answers.deficit;
  if (!answer || typeof answer !== "object") return empty("no-answer");
  const names = namesFrom(answer, config);
  return {
    advisory: renderAdvisory(names),
    reason: names.length === 0 ? "none" : "advised",
    // The configured model may be an alias; the response says what answered.
    // A fixture graded against one version and replayed under another is
    // measuring two things, and only this field shows it.
    model: typeof body.model === "string" ? body.model : null,
    probabilities: answer.probabilities ?? null,
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
  LABEL,
  NONE,
  advise,
  buildCriteria,
  buildRequest,
  loadConfig,
  namesFrom,
  render,
  renderAdvisory,
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
  advise(prompt)
    .then((result) => {
      process.stdout.write(render(result.advisory, eventName) + "\n");
      process.exit(0);
    })
    .catch(() => {
      process.stdout.write(render("", eventName) + "\n");
      process.exit(0);
    });
}
