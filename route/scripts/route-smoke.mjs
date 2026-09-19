#!/usr/bin/env node
/**
 * Smoke: does each deficit in the domain reach its own resolution in the
 * codomain, through the channel as it ships?
 *
 * This is not the fixture eval (route-evaluator-eval.mjs) and does not replace
 * it. The eval asks whether the advisory *helps* — a question that needs paired
 * arms and adjudicated labels, and its labels ship unadjudicated. This asks
 * only whether the arrow is wired: that every protocol in the domain is
 * reachable as an answer, that the answer space is closed over that domain, and
 * that the state the channel claims to send is the state the request carries.
 *
 * Why that is the weaker claim, and therefore the one worth running on its own:
 * "this context shows deficit X" is true by construction when the context is
 * the protocol's own declaration of the situation it resolves. No adjudicator
 * stands behind it, so nothing here is held back waiting for one. "the correct
 * routing for this context is X" is the other claim, and it belongs to the
 * fixtures.
 *
 *   node route/scripts/route-smoke.mjs                 # the offline arm alone
 *   TYPESAFE_API_KEY=… node route/scripts/route-smoke.mjs --live
 *
 * A live run reads the key from the variable config/evaluator.json names — the
 * same one that arms the session channel, since this project counts holding
 * that key as consent for both. Assign it inline for the one command: an
 * `export` arms every session launched from that shell, which is a different
 * decision and the user's to make.
 *
 * What a live reach is evidence of, and what it is not: the context each probe
 * sends is built from the protocol's own declared material, so a reach says the
 * name can be produced and the path from context to answer runs end to end. It
 * says nothing about whether the declared text separates that protocol from its
 * neighbours on prose a person would actually type. That question is the
 * fixtures', and this file does not answer it.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import {
  advise,
  budgetFor,
  buildCriteria,
  buildRequest,
  conversationFrom,
  loadConfig,
  namesFrom,
} from "./route-evaluator.mjs";
import { deriveProtocols, isMain, pluginRoot, selectProtocol } from "./route-protocols.mjs";

// A neutral utterance. The deficit lives in the accumulated context, never in
// the prompt, so a probe that reaches proves the conversation was sent — the
// one thing a prompt-only run could not have shown.
const PROBE_PROMPT = "What should we do here?";

/**
 * The domain: every protocol this checkout declares, by the same predicate the
 * hook applies to installed plugins. Read from the tree rather than from the
 * host's install records, because the records are one host's layout and a
 * checkout that cannot be read there still has a domain to check.
 */
function domainFrom(root = path.dirname(pluginRoot())) {
  const found = [];
  let entries;
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const entry of entries.filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const dir = path.join(root, entry.name);
    if (!fs.existsSync(path.join(dir, ".claude-plugin", "plugin.json"))) continue;
    if (dir === pluginRoot()) continue;
    const protocol = selectProtocol(dir);
    // The plugin directory is the protocol's identity in the canonical
    // registry; the command is what the answer space is keyed by. Both are
    // carried so the domain can be checked against the registry by identity
    // rather than by how many members it happens to have.
    if (protocol) found.push({ ...protocol, plugin: entry.name });
  }
  return found;
}

/**
 * The domain against the canonical registry, by identity. A discovered set is
 * not a domain until something says it is the whole one, and the registry is
 * where that is stated — so a protocol added to the suite and missed by the
 * discovery predicate shows up here rather than as a smaller number nobody
 * notices.
 *
 * Returns null when the registry is not reachable, which it is not from an
 * installed plugin: a claim that cannot be checked from here is left unmade
 * rather than assumed to hold.
 */
function againstCanonical(domain, root = path.dirname(pluginRoot())) {
  const file = path.join(root, "scripts", "load-protocols.js");
  if (!fs.existsSync(file)) return null;
  let canonical;
  try {
    canonical = createRequire(import.meta.url)(file).CANONICAL_PROTOCOL_SET;
  } catch {
    return null;
  }
  if (!Array.isArray(canonical) || canonical.length === 0) return null;
  const found = new Set(domain.map((p) => p.plugin));
  return {
    absent: canonical.filter((name) => !found.has(name)),
    extra: [...found].filter((name) => !canonical.includes(name)).sort(),
  };
}

/**
 * The domain the host would actually offer, for comparison. Reported rather
 * than asserted: a host whose plugin layout the derivation does not read yields
 * an empty table and an empty answer space, and both fail silent by design, so
 * the only way anyone learns of it is a line like this one.
 */
function installedDomain() {
  try {
    return deriveProtocols();
  } catch {
    return [];
  }
}

function ok(check, detail) {
  return { check, ok: true, detail };
}

function bad(check, detail) {
  return { check, ok: false, detail };
}

/**
 * The offline arm: everything about the arrow that does not need the endpoint.
 * Each check names the failure it would catch, because a check whose failure
 * nobody can read is a check nobody acts on.
 */
function wiring(domain, config) {
  const checks = [];

  if (domain.length === 0) {
    return [bad("the domain is non-empty", "no protocol declares a deficit in this checkout")];
  }

  const criteria = buildCriteria(domain);
  if (!criteria) return [bad("the domain reaches the answer space", "buildCriteria yielded nothing")];

  // Identity against the canonical registry, never cardinality: a set of the
  // right size with the wrong members passes a count and fails this.
  const canonical = againstCanonical(domain);
  if (canonical) {
    const off = [
      canonical.absent.length ? `absent: ${canonical.absent.join(", ")}` : "",
      canonical.extra.length ? `not in the registry: ${canonical.extra.join(", ")}` : "",
    ].filter(Boolean);
    checks.push(off.length === 0
      ? ok("the domain is the canonical protocol set", "every registered protocol was discovered, and nothing else")
      : bad("the domain is the canonical protocol set", off.join(" · ")));
  }

  // Totality: every element of the domain is an option the endpoint can answer
  // with. A protocol missing here cannot be reached however well it fits.
  const missing = domain.filter((p) => !(p.command in criteria)).map((p) => p.command);
  checks.push(missing.length === 0
    ? ok("every protocol in the domain is an option", `${domain.length} options beside none`)
    : bad("every protocol in the domain is an option", `absent: ${missing.join(", ")}`));

  // The codomain is declared, not inferred. A protocol whose SKILL.md carries
  // no `Type: (...) → Resolution` clause has a deficit with nowhere named to
  // land, and the option it produces says so by carrying the deficit alone.
  const codomainless = domain.filter((p) => !p.resolution).map((p) => p.command);
  checks.push(codomainless.length === 0
    ? ok("every deficit names its resolution", "each option declares deficit → resolution")
    : bad("every deficit names its resolution", `deficit alone: ${codomainless.join(", ")}`));

  // Closure: the names that reach a reader come from our answer space and
  // nowhere else. Without this the peer picks the text that lands in context.
  const foreign = namesFrom(
    { probabilities: { ...Object.fromEntries(domain.map((p) => [p.command, 0.01])), "not-a-protocol\nsecond line": 0.99 } },
    config,
    Object.keys(criteria),
  );
  checks.push(foreign.some((n) => n.includes("\n") || !(n in criteria))
    ? bad("the answer space is closed", `emitted ${JSON.stringify(foreign)}`)
    : ok("the answer space is closed", "a key outside the declared options is not a name"));

  // The state the channel claims to send is the state the request carries.
  // This is the defect the fixtures ran on: the walk was never crossed, so
  // every recorded answer was an answer about a prompt alone.
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "route-smoke-"));
  try {
    const file = path.join(scratch, "t.jsonl");
    fs.writeFileSync(file, [
      JSON.stringify({ type: "user", message: { content: "the earliest turn" } }),
      JSON.stringify({ type: "assistant", message: { content: "a reply to it" } }),
      JSON.stringify({ type: "user", message: { content: "the latest turn" }, isSidechain: false }),
      JSON.stringify({ type: "user", message: { content: "a subagent turn" }, isSidechain: true }),
    ].join("\n") + "\n");

    const budget = budgetFor(config, criteria, PROBE_PROMPT);
    checks.push(budget > 0
      ? ok("the budget leaves room for a conversation", `${budget} tokens under the ceiling`)
      : bad("the budget leaves room for a conversation", "the question and the prompt consume the ceiling"));

    // The domain is paid for: a larger answer space leaves less room, so a
    // protocol added later cannot silently eat the margin unnoticed.
    const oneOption = budgetFor(config, { [domain[0].command]: criteria[domain[0].command] }, PROBE_PROMPT);
    checks.push(budget < oneOption
      ? ok("the budget is derived from the domain", `${budget} with the domain against ${oneOption} with one option`)
      : bad("the budget is derived from the domain", "the answer space costs the budget nothing"));

    const walked = conversationFrom(file, budget);
    const carriedLatest = walked.length > 0 && walked[walked.length - 1].text === "the latest turn";
    const droppedSidechain = walked.every((t) => t.text !== "a subagent turn");
    checks.push(carriedLatest && droppedSidechain
      ? ok("the walk keeps the recent turns and drops the subagent's", `${walked.length} turns kept`)
      : bad("the walk keeps the recent turns and drops the subagent's", JSON.stringify(walked)));

    const request = JSON.parse(buildRequest(config, PROBE_PROMPT, criteria, walked));
    const sent = request.state && request.state.conversation;
    checks.push(Array.isArray(sent) && sent.length === walked.length
      ? ok("the conversation reaches the request", `${sent.length} turns in state.conversation`)
      : bad("the conversation reaches the request", "the request carried the prompt alone"));

    // A turn larger than the whole budget is carried by its tail rather than
    // dropped: the turn nearest the deficit is the one that says the most, and
    // dropping it leaves the state empty exactly when it matters.
    const tail = conversationFrom(file, 25);
    checks.push(tail.length === 1 && tail[0].text.length > 0
      ? ok("a turn past the budget is carried by its tail", `${tail[0].text.length} characters kept`)
      : bad("a turn past the budget is carried by its tail", JSON.stringify(tail)));
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }

  return checks;
}

/**
 * One probe's context: the protocol's own declaration of the situation it
 * resolves, put into the accumulated context, under a prompt that carries no
 * deficit of its own.
 */
function probeConversation(protocol) {
  const transition = protocol.resolution
    ? `${protocol.deficit} → ${protocol.resolution}`
    : String(protocol.deficit);
  const text = protocol.description
    ? `${protocol.description}\n\nThat is where this session is: ${transition}.`
    : `That is where this session is: ${transition}.`;
  return [{ role: "user", text }];
}

/**
 * The live arm: one probe per element of the domain, through `advise` exactly
 * as the hook calls it — a transcript path, not a turn list, so the derived
 * budget and the newest-first walk are crossed rather than stepped around.
 *
 * Reported per element. No rate is computed: a rate over probes built from each
 * protocol's own words would read as an accuracy, and it is not one.
 */
async function probe(domain, { config, env, adviseFn = advise } = {}) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "route-smoke-live-"));
  const results = [];
  try {
    for (const protocol of domain) {
      const file = path.join(scratch, `${protocol.command}.jsonl`);
      fs.writeFileSync(
        file,
        probeConversation(protocol)
          .map((t) => JSON.stringify({ type: t.role, message: { content: t.text } }))
          .join("\n") + "\n",
      );
      const answer = await adviseFn(PROBE_PROMPT, {
        config,
        env,
        protocols: domain,
        transcriptPath: file,
      });
      const names = answer.advisory
        ? answer.advisory.match(/\/[a-z][a-z0-9-]*/g)?.map((n) => n.slice(1)) ?? []
        : [];
      results.push({
        command: protocol.command,
        deficit: protocol.deficit,
        resolution: protocol.resolution,
        reached: names.includes(protocol.command),
        names,
        reason: answer.reason,
        turns: answer.turns ?? 0,
        model: answer.model ?? null,
      });
    }
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
  return results;
}

async function run({ live = false, env = process.env, domain = domainFrom(), config: override } = {}) {
  // An explicit null is a caller saying there is no binding on disk, which
  // `??` would read as no override and send back to disk.
  const config = override === undefined ? loadConfig() : override;
  const out = {
    domain: domain.map((p) => ({ command: p.command, plugin: p.plugin, deficit: p.deficit, resolution: p.resolution })),
    installed: installedDomain().map((p) => p.command).sort(),
    wiring: config ? wiring(domain, config) : [bad("a binding is on disk", "config/evaluator.json names no https endpoint")],
    live: null,
  };
  if (!live) return out;
  if (!config) return { ...out, liveError: "a live run needs config/evaluator.json to name an https endpoint" };
  if (!env[config.apiKeyEnv]) return { ...out, liveError: `a live run needs a key in ${config.apiKeyEnv}` };
  if (domain.length === 0) return { ...out, liveError: "no protocol declares a deficit in this checkout" };
  out.live = await probe(domain, { config, env });
  return out;
}

function report(out) {
  const lines = [];
  lines.push("domain — every protocol declaring a deficit in this checkout:");
  lines.push(`    ${out.domain.map((p) => p.command).join(", ")}`);

  // Reported, never asserted: an empty installed set is a host whose layout the
  // derivation does not read, and both the session table and the answer space
  // are empty there without saying so.
  lines.push("");
  if (out.installed.length === 0) {
    lines.push("installed set on this host: empty — the derivation read no install record here,");
    lines.push("    so the session-start table and the advisory's answer space are both empty.");
    lines.push("    The checkout above is what the checks below ran against.");
  } else {
    lines.push(`installed set on this host: ${out.installed.join(", ")}`);
    const missing = out.domain.map((p) => p.command).filter((c) => !out.installed.includes(c));
    if (missing.length) lines.push(`    declared in the checkout but not offered here: ${missing.join(", ")}`);
  }

  lines.push("");
  lines.push("wiring — the arrow, without the endpoint:");
  for (const c of out.wiring) {
    lines.push(`    ${c.ok ? "reaches" : "BROKEN "}  ${c.check}`);
    lines.push(`              ${c.detail}`);
  }

  lines.push("");
  if (out.liveError) {
    lines.push(`live arm: not run — ${out.liveError}`);
  } else if (!out.live) {
    lines.push("live arm: not run — pass --live to send each probe to the endpoint.");
  } else {
    const reached = out.live.filter((r) => r.reached).map((r) => r.command);
    const missed = out.live.filter((r) => !r.reached);
    lines.push("live arm — one probe per deficit, the context built from that protocol's own declaration:");
    lines.push(`    reached its own resolution: ${reached.length ? reached.join(", ") : "none"}`);
    for (const r of missed) {
      lines.push(`    did not reach  ${r.command} (${r.deficit}${r.resolution ? ` → ${r.resolution}` : ""})`);
      lines.push(`              got [${r.names.join(", ")}] · ${r.reason} · ${r.turns} turns sent`);
    }
    const models = [...new Set(out.live.map((r) => r.model).filter(Boolean))];
    if (models.length) lines.push(`    answers from: ${models.join(", ")}`);
    lines.push("");
    lines.push("    A reach is the arrow being wired end to end, not evidence that the declared");
    lines.push("    text separates this protocol from its neighbours on prose a person would type.");
    lines.push("    That question is route/evals/'s, and its labels ship unadjudicated.");
  }

  return lines.join("\n");
}

export { PROBE_PROMPT, againstCanonical, domainFrom, probe, probeConversation, report, run, wiring };

if (isMain(import.meta.url)) {
  run({ live: process.argv.includes("--live") })
    .then((out) => {
      process.stdout.write(report(out) + "\n");
      const broken = out.wiring.some((c) => !c.ok);
      process.exit(broken ? 1 : 0);
    })
    .catch((e) => {
      process.stdout.write(`error: ${e && e.message}\n`);
      process.exit(1);
    });
}
