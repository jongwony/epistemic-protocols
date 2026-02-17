# AskUserQuestion to request_user_input Mapping

This document defines the Codex compatibility layer for protocols authored with
`AskUserQuestion` and task-tracking operations.

## Goal

Preserve protocol meaning while adapting to Codex runtime constraints:

- 2-3 mutually exclusive options per question
- short header per question
- structured multiple-choice over open-ended prompts
- task tracking compatible with `update_plan`

## Canonical Prompt Spec

All protocol questions are normalized into a Canonical Prompt Spec before tool calls.

### PromptIntent

- `confirm`
- `select_one`
- `select_many`
- `judge`
- `terminate`

### PromptStep

Required fields:

- `id`: stable step identifier
- `intent`: one `PromptIntent`
- `question`: user-facing question
- `options`: 2-3 options for Codex tool constraints
- `on_escape`: `terminate | return_previous | defer`

Optional fields:

- `max_choices`: defaults to `1` (use iterative loops for effective multi-select)
- `next`: transition table for deterministic flow

## Mapping Pipeline

1. Parse source `AskUserQuestion` stage from protocol.
2. Emit canonical `source_prompts` metadata (`source_options_count`, phase, mapping).
3. Expand into Codex-compatible `steps`.
4. Call `request_user_input` with one step at a time.

## Task Tool Mapping

For protocols that emit `TaskCreate` / `TaskUpdate`, use canonical `task_sync` metadata
and map to `update_plan` with constrained sync semantics.

### TaskSyncSpec

Optional top-level `task_sync` object:

- `source_tool`: must be `TaskCreate`
- `target_tool`: must be `update_plan`
- `create.emit`: must be `true`
- `create.default_status`: must be `pending`
- `transitions`: allowed `TaskUpdate` transition rules
- `single_in_progress`: enforce only one `in_progress` step in `update_plan`
- `fallback_mode`: must be `internal_state_only`

### Task Sync Rule (recommended default)

1. Always map `TaskCreate` to `update_plan` step creation (`pending`).
2. Map `TaskUpdate` only for high-signal transitions:
   - `pending → in_progress`
   - `in_progress → completed`
3. Do not mirror low-signal transitions (for example `pending → pending`).
4. If `update_plan` is unavailable, keep internal runtime state only.

## Overflow Rule (mandatory)

When source option count is `> 3`, decomposition is mandatory.

- `overflow_strategy`: `two_stage_routing`
- Stage 1: route by cluster/intent
- Stage 2: detail selection within the chosen cluster

Automatic option compression is not allowed because it can distort semantics.

## Multi-select Rule

If source asks for `multiSelect`, use iterative steps:

1. Select one candidate.
2. Ask whether to add another.
3. Repeat until user stops or escapes.

This keeps each Codex question within 2-3 options.

## Escape/Termination Rule

Every canonical step must define `on_escape`.
Default for pilot protocols is `terminate`.

## Pilot Scope

Pilot mappings are maintained in:

- `codex/examples/hermeneia.json`
- `codex/examples/syneidesis.json`
- `codex/examples/telos.json`
- `codex/examples/katalepsis.json`

Validation runs through:

- `node .claude/skills/verify/scripts/check-codex-compat.js .`
