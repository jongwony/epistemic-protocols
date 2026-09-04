/**
 * Route's function-hooks module — the trigger and the catalog, realized on
 * the engine interface instead of on command hooks. Loaded only where the
 * host runs hooks modules (Claude Code with CLAUDE_CODE_ENABLE_FUNCTION_HOOKS
 * set); the command hooks in hooks.json yield when it is, and remain the
 * path everywhere else.
 *
 * The division is unchanged: the hooks decide when, the /route skill decides
 * what. Nothing here matches context against a protocol.
 *
 * Catalog — `session.start` derives the installed-protocol table by running
 * scripts/route-protocols.mjs on the host (the module's own file access stops
 * at the working directory; the install record sits under the config
 * directory, which that script already knows how to read). `prompt.context`
 * then carries the table as one block of the first user message's context:
 * the engine re-reads that context after compaction and /clear, which is
 * exactly when the table needs to re-enter, so no epoch bookkeeping is kept.
 *
 * Trigger — `prompt.submit` attaches the four-line directive beside each
 * prompt as context the model reads and the user never sees, and while the
 * session is thin (few user turns so far) the opener that points at
 * request-held deficits. The opener keys on the real turn count rather than
 * on why an epoch began.
 *
 * State — one flag in the plugin store, keyed by session: set when the
 * engine expands a catalog protocol's prompt (`skill.prompt`), consumed by
 * the next `prompt.submit`, which then skips the directive for that one
 * turn. A prompt that itself invokes a catalog protocol skips it too. That
 * is the whole of it: convergence is not detected here, and the directive's
 * own "skip while active" clause stays the model's to judge.
 *
 * The engine interface is the module's only door. What this file touches:
 * $.plugin, $.process.run (node, this plugin's own script), $.session,
 * $.store. No $.http, no $.model, no $.fs — `claude plugin validate` lists
 * the calls, so the claim is checkable rather than asserted.
 */

import type { Register } from "claude-code";

// The firing conditions, verbatim from scripts/route-prompt.mjs.
const DIRECTIVE = [
  "[route] When the accumulated context shows an interaction deficit that a loaded core epistemic protocol resolves, invoke /route.",
  "Skip while an epistemic protocol is active: invoked this session and not yet converged or deactivated.",
  "A converged protocol's prose still in context does not make it active.",
  "Otherwise stay silent.",
].join("\n");

// The thin-context opener, verbatim from scripts/route-session.mjs.
const THIN_OPENER = [
  "[route] Context is thin at this point in the session.",
  "The deficit to check first sits in the request itself — intent or context only the user can supply, which accumulated context cannot yet show. When a request is not fully explicit, invoke /route before object-level work.",
].join("\n");

// User turns (this one included) during which the opener still goes out.
const THIN_TURNS = 3;

// Block name the table renders under in the first message's context.
const CONTEXT_BLOCK = "route";

type Protocol = { command: string; deficit: string };

function parseTable(text: string): Protocol[] {
  const rows: Protocol[] = [];
  for (const line of text.split("\n")) {
    const m = /^\/([A-Za-z0-9_-]+)[ \t]+(\w+)$/.exec(line.trim());
    if (m) rows.push({ command: m[1], deficit: m[2] });
  }
  return rows;
}

// A skill name as `skill.prompt` carries it, against a catalog command:
// bare, or namespaced by its plugin (`plugin:command`).
function namesProtocol(skill: string, protocols: readonly Protocol[]): boolean {
  return protocols.some((p) => skill === p.command || skill.endsWith(`:${p.command}`));
}

// A prompt that is itself an invocation of a catalog protocol.
function invokesProtocol(text: string, protocols: readonly Protocol[]): boolean {
  const m = /^\s*\/([A-Za-z0-9_:-]+)/.exec(text);
  return !!m && namesProtocol(m[1], protocols);
}

export const register: Register = (on) => {
  let table = "";
  let protocols: Protocol[] = [];

  on("session.start", async ($, e, next) => {
    try {
      const { exitCode, stdout } = await $.process.run(
        ["node", `${$.plugin.root}/scripts/route-protocols.mjs`],
        { timeoutMs: 10_000 },
      );
      table = exitCode === 0 ? stdout.trim() : "";
    } catch {
      table = "";
    }
    protocols = parseTable(table);
    return next(e);
  });

  on("prompt.context", async ($, e, next) => {
    const r = await next(e);
    if (!table) return r;
    return { blocks: [...r.blocks, { name: CONTEXT_BLOCK, text: table }] };
  });

  on("skill.prompt", async ($, e, next) => {
    if (namesProtocol(e.skill, protocols)) {
      try {
        await $.store.set(`invoked:${await $.session.id()}`, true);
      } catch {
        // The flag is a one-turn courtesy; losing it costs one directive.
      }
    }
    return next(e);
  });

  on("prompt.submit", async ($, e, next) => {
    const r = await next(e);
    if (r.drop !== undefined) return r;

    let skip = invokesProtocol(e.text, protocols);
    try {
      const key = `invoked:${await $.session.id()}`;
      if ((await $.store.get(key)) === true) {
        skip = true;
        await $.store.delete(key);
      }
    } catch {
      // Unreadable store: fall back to the directive, as every turn does.
    }
    if (skip) return r;

    let turns = Number.POSITIVE_INFINITY;
    try {
      turns = await $.session.turnCount();
    } catch {
      // Unknown turn count reads as not thin: one opener less, never one more.
    }
    const parts = turns < THIN_TURNS ? [THIN_OPENER, DIRECTIVE] : [DIRECTIVE];
    return { ...r, context: [...(r.context ?? []), ...parts] };
  });
};
