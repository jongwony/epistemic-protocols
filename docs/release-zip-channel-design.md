# Release Zip Channel — agents/ Exclusion (issue #530)

> Decision for #530: `scripts/package.js:60` `EXCLUDE_DIRS = new Set(['agents',
> 'commands', 'evals'])` drops `agents/` from the per-skill zip — PR #528's codex review
> measured `distill.zip` at 2 files, the `zero-memory-refuter` agent absent. The issue
> asks: (1) what is the zip channel *for*, and (2) given that, should `agents/` gain an
> inclusion rule or stay excluded + documented?

## The measured channel map (verified at HEAD)

Three packaging/install channels; only one drops `agents/`:

| Channel | Mechanism | `agents/` | Source |
|---|---|---|---|
| `install.sh` (primary) | git marketplace install (`claude plugin marketplace add` → `plugin install`) | **included** | issue #530 measured |
| codex marketplace | marketplace install, `agents/` envelope confirmed | **included** | 2026-06-11 behavior test (runtime-dependency-ledger) |
| **skill zip** (`package.js`) | per-skill `.zip`; `EXCLUDE_DIRS` strips `agents/`, `commands/`, `evals/` | **excluded** | `package.js:60`, `:393` |

So the question is narrowly about the zip channel — the other two ship `agents/` normally.

## The exclusion is channel-correct, not an accident to fix

The zip channel is the **claude.ai skill-upload** path: a per-skill `.zip` uploaded to an
environment that registers *skills*, not *plugins*. That environment has **no plugin-agent
spawn surface** — it cannot dispatch a packaged `agents/zero-memory-refuter.md` even if the
file rode along. And the protocols already account for this: every agent-using SKILL.md
carries a **platform-laddered fallback** for exactly this environment. `/distill` F5 is the
worked case — its realization ladder is `zero-memory-refuter` subagent → generic fresh
subagent → lint fallback, and the SKILL.md states *"this section is the self-contained
source for that prompt"*. The refuter's contract lives in the SKILL.md, not (only) in the
agent file.

So in the zip channel:
- shipping `agents/` would bundle an agent the target environment **cannot dispatch** (dead
  weight, and an implied capability the env lacks),
- the SKILL.md's generic-subagent / lint fallback is the **designed** path there,
- the agent file is **redundant** with the SKILL.md's self-contained prompt source.

Excluding `agents/` is therefore the *correct* behavior for what the channel targets — not a
regression for PR #528 to patch.

## Recommendation — keep excluded + document the channel contract

**Keep `agents/` excluded; make the channel contract explicit** so a future reader does not
mistake the exclusion for a bug:

1. A comment at `EXCLUDE_DIRS` naming *why* (skill-upload channel, no plugin-agent surface,
   SKILL.md fallback is the designed path).
2. Generalize the `runtime-dependency-ledger.md` channel-difference note (PR #528 recorded
   the diylisis row) into a channel-level statement: the zip channel ships SKILL.md-only;
   agent-dependent rigor degrades to the SKILL.md fallback ladder by design.

### Why not an inclusion rule

Adding `agents/` to the zip would ship an undispatchable file, imply a plugin-agent surface
the skill-upload env lacks, and duplicate the SKILL.md's self-contained prompt source. It
buys nothing for the channel's actual consumer. An inclusion rule is warranted *only if* the
zip channel is ever repurposed for a plugin-agent-capable target — at which point the rule
should be conditional on the target, not blanket.

## Open fork for the human

1. **Channel disposition**: (a) keep `agents/` excluded + document the contract
   (recommended) / (b) add an `agents/` inclusion rule.
2. **If (a)**: document scope — comment-only, or comment + generalized ledger note
   (recommended).

## Spec-edit sketch (recommended: a + ledger note)

1. **`scripts/package.js`** near `EXCLUDE_DIRS` (L60): one comment — *agents/ excluded: the
   zip channel is skill-unit upload (claude.ai) to a no-plugin-agent environment; each
   SKILL.md carries its own platform-laddered fallback (e.g. /distill F5 refuter → generic
   subagent → lint), so the agent file is redundant and undispatchable there.*
2. **`docs/runtime-dependency-ledger.md`**: promote the diylisis channel-difference row to a
   channel-level note — zip = SKILL.md-only, agent-rigor degrades to the documented fallback
   ladder by design (cite the F5 ladder as the worked instance).
3. No packager logic change, no plugin version bump (comment + ledger doc only). Run
   `node .claude/skills/verify/scripts/static-checks.js .` — FAIL 0 (no SKILL.md / plugin.json
   touched).

> **Note on classification**: this is close to a relay finding — the measured channel
> semantics make "keep excluded" the dominant option — but #530 framed it as an open
> decision, so the fork is surfaced; the evidence is what settles it, not a balanced
> trade-off. Reopen only if the zip channel's target environment changes.
