# Hooks — layered dispatcher structure

PostToolUse hooks for the epistemic-protocols project's `/steer` Stage 2 trials.

## Layers

```
Platform layer       (claude_dispatcher.mjs, codex_dispatcher.mjs)
       ↓ payload normalize
Trial/Guidance layer (_guidances/<skill-name>.mjs)
       ↓ register
Index layer          (.claude/steer-trials.md)
```

The three layers are orthogonal:
- New platform → add a dispatcher in this folder
- New trial guidance → add or extend `_guidances/<skill-name>.mjs` + update steer-trials.md
- New skill target → add a new `_guidances/*.mjs` file

## Platform → Dispatcher

| Platform | Dispatcher | Wiring location | Notes |
|----------|------------|-----------------|-------|
| Claude Code | `claude_dispatcher.mjs` | `.claude/settings.json` (PostToolUse + matcher: "Bash") | Default for this repo |
| Codex CLI v0.124.0+ | `codex_dispatcher.mjs` | `~/.codex/hooks.json` or `[hooks]` in `config.toml` | Requires `[features] codex_hooks = true` in `config.toml` |
| Gemini CLI | (deferred) | — | Event names (`AfterTool`), matchers (`run_shell_command`), and response shape (`llmContent` / `returnDisplay`) diverge enough that a thin dispatcher is insufficient — guidance interface itself would need refactor |

## Wiring snippets

### Claude Code (`.claude/settings.json`)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/claude_dispatcher.mjs",
            "statusMessage": "Evaluating gh-comments option-set entropy"
          }
        ]
      }
    ]
  }
}
```

### Codex CLI (`~/.codex/hooks.json` or `[hooks]` in `config.toml`)

```toml
# config.toml
[features]
codex_hooks = true

[[hooks.PostToolUse]]
matcher = "Bash"
command = "node /absolute/path/to/.claude/hooks/codex_dispatcher.mjs"
```

Replace `/absolute/path/to/` with the project root for your local clone.

## Guidance interface

Each `_guidances/<skill-name>.mjs` exports:

```js
export const skill = '<skill-name>';

export const guidances = [
  {
    name: 'short-identifier',
    matchesCommand: (cmd) => /* boolean — what command pattern to fire on */,
    applies: (parsed)   => /* boolean — what condition triggers this guidance */,
    message: '...',     // Plain-text guidance string injected via additionalContext
  },
];
```

Dispatchers iterate `[...ghAddressComments, ...futureSkillGuidances]` against the normalized `{cmd, parsed}` and emit a single combined `additionalContext` when one or more entries match.

## Active trials

See [`.claude/steer-trials.md`](../steer-trials.md) for trial provenance, falsification conditions, and re-evaluation schedules.
