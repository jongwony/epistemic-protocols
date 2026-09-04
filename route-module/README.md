# Route Module — Route's hooks module

Route's trigger and catalog, realized as a Claude Code hooks module instead of as shell hooks. Watches the session and calls `/route`; never matches context itself.

> [한국어](./README_ko.md)

## What it is

[Route](../route) splits its work in two: **the hooks decide when, the skill decides what.** Route's own `hooks/hooks.json` carries the *when* as two command hooks, which every host that runs plugin hooks can execute. This plugin carries the same *when* as one TypeScript module, `hooks/route.ts`, loaded through a `modules` entry in its `hooks/hooks.json` and run on the engine interface (`$`) rather than as a process per event.

| Piece | In Route (command hooks) | Here (hooks module) |
|-------|--------------------------|---------------------|
| Catalog | `SessionStart`, once per context epoch, keyed on `source` | `session.start` runs `scripts/catalog.mjs` on the host, which finds Route's install and runs Route's own `scripts/route-protocols.mjs`; `prompt.context` carries the table as one block of the first message's context, which the engine re-reads after compaction and `/clear` |
| Directive | `UserPromptSubmit`, every prompt | `prompt.submit`, every prompt, as context the model reads beside the prompt and the user never sees |
| Opener | on `startup` and `clear` | while the session has had fewer than a few user turns, read from the real turn count |
| One-turn skip | — | `skill.prompt` on a catalog protocol sets a flag in the plugin store; the next `prompt.submit` consumes it and sends no directive. A prompt that itself invokes a catalog protocol gets none either |

The wording of the directive and the opener is the same as Route's, and a test pins it. What the table says has one source, Route's derivation script; this plugin only finds and runs it. The match stays in `/route`.

Why a separate plugin: a `hooks.json` that names a `modules` entry is not a file every host reads. Codex parses plugin `hooks/hooks.json` with a strict schema (`codex-rs/config/src/hook_config.rs`, `HooksFile` under `deny_unknown_fields`, fields `description` and `hooks` only) and, on an unknown key, drops the whole file with a warning — the command hooks in it included. Kept in Route, one `modules` line would have turned Route off on Codex. So Route's `hooks.json` stays host-neutral, and this plugin has no Codex manifest and is not listed for Codex.

## Enabling

Claude Code loads hooks modules only behind a flag, in the environment or in `settings.json`'s `env`:

```
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1
```

Install:

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install route-module@epistemic-protocols
```

The manifest declares Route as a dependency, so installing this plugin installs and enables Route from the same marketplace.

**No double injection.** While this plugin is enabled from Route's marketplace and the flag is on, Route's two command hooks yield — exit 0, nothing written — and this module carries both pieces. The flag alone does not make them yield: without this plugin there would be nothing else to carry them, so they keep running.

## Status: early access, not a documented contract

The hooks-module API is absent from the official hooks reference, the plugins reference, the settings reference and the 2.1.260 changelog. Its only contract is the declaration file the running build writes with `/plugin-types` (`claude-code.d.ts`), whose header says it may change between releases without notice. This module is typed against that file.

What that means in practice: **if the API changes, this module fails to load, the engine notes it in the debug log, and nothing else replaces it** — with the flag on and this plugin enabled, Route's command hooks are yielding, so Route goes silent until the plugin is disabled or the module is regenerated against the new types. Disabling the plugin restores the command hooks at once.

The trust claim is checkable rather than asserted: `claude plugin validate route-module/` lists what the module hooks and calls — `$.process.run` (node, this plugin's own script), `$.session`, `$.store`. No network, no model, no file access.

## Developing

```
claude --plugin-dir route-module --plugin-dir route --debug
```

The debug log names the module when it loads, each event as it settles, and anything the engine refused. `/plugin-types` writes the build's declarations to `.claude/types`; regenerate rather than edit. Loaded from disk this way, the plugin is not in the install record, so `scripts/catalog.mjs` falls back to the sibling `../route` checkout to find the derivation script, and the derivation itself finds no installed protocols from that checkout's marketplace — the table is empty in a `--plugin-dir` session and full from an install. For the same reason Route's command hooks do not yield in that session — the plugin is not enabled from Route's marketplace — so a disk-loaded session sees the directive twice; that is the development loop's shape, not an install's.

## Author

Jongwon Choi (https://github.com/jongwony)
