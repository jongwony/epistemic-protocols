---
name: compose
description: "Protocol composition authoring assistant — build composition SKILL.md files from protocol Lego blocks. Validates chains against graph.json, analyzes gate dispositions via the 3-axis model, and generates pipeline templates. Use when the user asks to 'compose protocols', 'create composition skill', 'build protocol chain', 'combine protocols', or wants to author a composition workflow like /review."
---

# Compose: Protocol Composition Authoring

Build composition SKILL.md files from protocol chains. Validates graph constraints, catalogs gates, proposes dispositions, and generates a pipeline template following the `/review` structural pattern.

**This is an authoring tool, not a runtime executor.** The output is a SKILL.md file that the user can install and invoke independently.

## Pipeline Overview

```
SPECIFY → VALIDATE → CATALOG → DISPOSITION → GENERATE
  (gated)                        (gated)       (gated)
```

3 user gates across 5 phases. Phases 1-2 are autonomous (validation and collection).

## Phase 0: Specify (Chain Input)

Accept a protocol chain specification from the user.

**Input forms**:
- Inline argument: `/compose clarify → goal → bound → inquire`
- Conversational: user describes the desired chain
- Cluster shortcut: `/compose planning` (resolve via the built-in Cluster Shortcuts table below)

**Normalization**: Accept protocol names (Hermeneia), slash commands (/clarify), skill names (clarify), or short names. Case-insensitive. Arrow separators (`→`, `->`, `,`, spaces) all accepted. Resolve to canonical `(protocol_name, slash_command)` pairs using the registry below.

**Output path**: Ask the user where to write the generated SKILL.md. Default: `~/.claude/skills/{chain-name}/SKILL.md` for user-level skills, or suggest a project-level path if appropriate.

**Gate #1** (Qc, bounded regret — Phase 1 validates):

Present the interpreted chain with canonical protocol names, slash commands, and proposed output path. Options:
1. **Confirm** — proceed with this chain
2. **Modify** — adjust protocols, order, or output path

**Protocol registry**:

| Protocol | Slash | Skill token |
|----------|-------|-------------|
| Hermeneia | `/clarify` | `clarify` |
| Telos | `/goal` | `goal` |
| Horismos | `/bound` | `bound` |
| Aitesis | `/inquire` | `inquire` |
| Prothesis | `/frame` | `frame` |
| Analogia | `/ground` | `ground` |
| Periagoge | `/induce` | `induce` |
| Syneidesis | `/gap` | `gap` |
| Prosoche | `/attend` | `attend` |
| Epharmoge | `/contextualize` | `contextualize` |
| Anamnesis | `/recollect` | `recollect` |
| Katalepsis | `/grasp` | `grasp` |

## Phase 1: Validate (Graph Constraints)

Read `references/graph.json` (bundled with this skill). Check three constraints:

### 1.1 Precondition Order

For each precondition edge `(source, target)` in graph.json: if both source and target are in the chain, source must appear before target.

On violation: present the precondition edge with its `satisfies` description and suggest reordering. Return to Phase 0 with the corrected chain.

### 1.2 Suppression Conflict

For each suppression edge `(source, target)`: if both are in the chain, warn. Present the `satisfies` description explaining why co-activation is problematic.

Options:
- Remove one protocol from the chain
- Confirm with explicit scope differentiation (user declares the protocols address different scopes)

### 1.3 Missing Preconditions

For each protocol in the chain: check if any precondition source is missing. The wildcard `"source": "*"` (Katalepsis) is excluded from this check — it means "structurally last" not "requires all."

On missing precondition: suggest inserting the missing protocol at the correct position.

**Design note — chain-position × regret interaction**: The concern that unbounded-regret gates positioned late in a chain degrade user judgment quality is valid but not yet addressed. Phase 3 disposition operates per-gate without chain-position awareness. A future revision will introduce a decision load model that quantifies remaining gate cost (loop depth × regret weight) per disposition choice, replacing the removed position-ratio advisory with a structurally sound, Phase 2-integrated mechanism.

**On all validations passing**: proceed to Phase 2 with the validated chain.

## Phase 2: Catalog (Gate Inventory)

Read all protocol SKILL.md files in parallel (paths are deterministic after Phase 1 validation). For each protocol:

1. **Locate SKILL.md**: Read `{protocol}/skills/{skill}/SKILL.md`
2. **Extract ELIDABLE CHECKPOINTS**: Grep for `ELIDABLE CHECKPOINTS` section
3. **Parse each gate entry**: Extract Phase number, Kind (relay/gated), label, condition (always_gated/elidable/conditional), regret profile (bounded/unbounded), and safety net reference (if stated)

Build the gate inventory:

```
List<{
  protocol: String,
  phase: Number,
  kind: Qc | Qs,
  label: String,
  condition: always_gated | elidable | conditional,
  elidable_when: String?,       -- condition text for elidable/conditional gates
  regret: bounded | unbounded,
  safety_net: String?            -- downstream catch gate reference
}>
```

Present the inventory as an informational summary (no gate — Phase 3 is where the user reviews):

```
## Gate Inventory

{protocol}: {N} gates ({M} Qs, {K} Qc)
  - Phase {X} {Kind} ({label}): {condition}
  ...

Chain Total: {total} gates
```

## Phase 3: Disposition (3-Axis Analysis)

Apply the disposition decision flow to each gate in the inventory.

### Disposition Decision Flow

For each gate G in the composition context:

```
1. Qs(G)?                                              → PRESENT
2. domain(G) ∈ Dismissed?                               → PRUNE
3. unbounded_regret(G)?                                 → PRESENT
4. domain(G) ∈ UserSupplies ∪ AIPropose?                 → PRESENT
5. Qc(G) ∧ bounded_regret(G) ∧ epistemic_access(G)?    → ELIDE candidate
6. otherwise                                            → PRESENT (conservative default)
```

Steps 2 and 4 are **conditional** — apply only when Horismos is in the chain and BoundaryMap is available. When Horismos is absent, skip steps 2 and 4 (flow reduces to steps 1, 3, 5, 6). Generate BoundaryMap-dependent steps as conditional rules in the template, not fixed dispositions.

**Epistemic access** in composition context — any of:
- `system_state(G)`: answer derivable from codebase/environment (AI can self-resolve)
- `answer(G) ⊆ output(prior)`: prior protocol in the chain produces output that entails this gate's answer (e.g., ClarifiedIntent from Hermeneia entails Telos Phase 0 seed confirmation)
- `BoundaryMap(domain(G)) = AIAutonomous`: user delegated decision authority to AI via Horismos (only when Horismos is in the chain)

**RESOLVE-OR-PRESENT** (for Qs gates in AIAutonomous domains): The Qs gate itself is never elided — instead, the protocol's Phase 1 context collection scope expands for AIAutonomous domains. If Phase 1 resolves the uncertainty (entropy → 0) — i.e., the gate is classified as Extension — the Qs gate is never reached. If entropy remains > 0, the Qs gate fires as PRESENT. Encode this as a conditional pipeline context rule when applicable.

### Catch-Chain Invariant

For every gate marked ELIDE, verify:

```
elidable(G) ⟹ ¬elidable(safety_net(G))
```

If violated: promote the safety net gate to PRESENT. This prevents cascading elision from removing all user checkpoints.

### Presentation

Present per-protocol sub-tables:

```
### {Protocol} /{command}

| Phase | Gate | Kind | Standalone | Composed | Rationale |
|-------|------|------|-----------|----------|-----------|
| ...   | ...  | ...  | ...       | ...      | ...       |

Summary: {N} gates → {M} user interactions ({K} elided, {J} pruned)
```

After all protocol tables, present aggregate:

```
### Chain Summary

Total: {total} gates → {interactions} user interactions
Elided: {elided} | Pruned: {pruned} | Presented: {presented}
Interaction reduction: ~{percent}%
```

### Cost Profile

After Chain Summary, present cost visibility sub-section:

**Gate density**: `{total_gates} / {protocol_count}` = `{density}` gates/protocol
**Always-gated ratio**: `{always_gated_count} / {presented_gates}`

**System 2 load** — ASCII timeline per protocol:

```
{Protocol1}  {Protocol2}  ...  {ProtocolN}
  ■ Qs         ■ Qc            ■ Qs
  ■ Qc         · (elided)      ■ Qc
```

Legend: ■ = presented, · = elided, × = pruned

**Conditional entropy**: `Σ log₂(|options_i|)` bits over presented gates — quantifies total user decision load. Higher entropy across gates indicates higher Constitution density; lower entropy indicates Extension dominance.

**O_support visibility** — each elided gate's justification:

| Elided Gate | Supporting Output | Basis |
|-------------|-------------------|-------|

The `Basis` column connects to the 3-axis elidability model used in this skill — Axis 2 (`O_support`) is the primary justification source.

**Gate #2** (Qc, bounded regret — Phase 4 allows regeneration):

Options:
1. **Accept all** — proceed to template generation
2. **Modify** — specify gates to change (promote elide→present or demote present→elide with rationale)

## Phase 4: Generate (Template Output)

Generate the composition SKILL.md file following the `/review` structural pattern.

### Template Structure

**1. YAML Frontmatter**

```yaml
---
name: {user-defined name}
description: "{chain description — what this composition does}"
skills:
  - {protocol1}:{skill1}
  - {protocol2}:{skill2}
  - ...
---
```

The `skills:` field declares sub-protocol dependencies using the `{plugin}:{skill}` namespace.

**2. Title and Purpose**

Brief paragraph: what deficit pattern this composition addresses, why these protocols are composed, and what the combined output is.

**3. Pipeline Overview**

ASCII phase diagram showing the chain with gate annotations:

```
{Protocol1} → {Protocol2} → ... → {ProtocolN} → Summary
  ({M} gates)   ({K} gates)         ({J} gates)
```

**4. Per-Protocol Sections**

For each protocol in the chain, a section containing:
- The gate walk-through table from Phase 3 (Composed column only)
- **Pipeline context rules** — behavioral modifications to sub-protocol gates when called from this composition. Format:

```
**Pipeline context rules** (when /{command} is called from this pipeline):
- **{gate label}**: {ELIDE|PRESENT|PRUNE} — {rationale}
- ...
```

**5. Materialized View**

Template for the final output structure. Includes:
- Per-protocol output summary (what each protocol contributed)
- Decision log: for each elided gate, what was auto-decided and why
- Transformation trace: deficit-to-resolution mapping per protocol

**6. Error Recovery**

Suffix replay rules:
- On mid-chain discovery of upstream error: identify the first invalid gate
- Replay forward from that gate (not backward compensation)
- Same-reason replay capped at 2 attempts
- Present replay proposal to user with options: replay, proceed accepting mismatch, terminate preserving artifacts

**7. Rules**

Standard rules section:
1. No silent authority transfer — all Qs gates and unbounded-regret Qc gates require user response
2. Catch-chain invariant — never elide both a gate and its safety net
3. BoundaryMap integration — conditional dispositions when Horismos is in the chain
4. Session Text Composition — inter-protocol data flows as natural language
5. Coexistence — composition does not absorb protocols; each remains independently invocable

### Gate #3 (Qs, unbounded regret — template is the final artifact)

Present the generated template for review. Options:
1. **Accept** — write to the specified output path
2. **Modify** — iterate on specific sections (user points to what needs change)
3. **Regenerate** — return to Phase 3 with modified dispositions

On Accept: write the template using the Write tool. Present the output path and suggest running `/verify` if the template is placed in a plugin directory.

## Cluster Shortcuts

Predefined chain patterns based on the built-in concern clusters:

| Shortcut | Chain | Rationale |
|----------|-------|-----------|
| `planning` | clarify → goal → bound → inquire | Planning cluster + boundary definition |
| `analysis` | frame → ground | Analysis cluster |
| `decision` | gap → attend | Decision + execution |

Shortcuts are convenience aliases — the user can always specify a custom chain. Shortcuts resolve to their chain at Phase 0 and proceed through normal validation.

## When to Use

- Creating a new composition workflow that chains 2+ epistemic protocols
- Formalizing an ad-hoc protocol chain that has proven useful across sessions
- Generating pipeline context rules for gate elision in multi-protocol workflows

## When NOT to Use

- For general skill creation → use `/skill-creator`
- For running an existing composition → invoke the composition skill directly
- For single-protocol usage → invoke the protocol directly
- For understanding protocols → use `/catalog` or `/onboard`

## Rules

1. **Authoring, not execution**: /compose generates SKILL.md files; it does not execute protocol chains at runtime
2. **Graph authority**: `references/graph.json` is the authoritative source for chain validation — do not override precondition or suppression edges without user explicit confirmation
3. **Conservative default**: When disposition is ambiguous, default to PRESENT (ask user) over ELIDE (auto-pass)
4. **Catch-chain is structural**: Catch-chain invariant violations block template generation — not advisory, not overridable
5. **Inline decision flow**: The disposition decision flow (3-axis model) must be included in the generated template so the runtime agent can apply it without cross-referencing analysis documents
6. **BoundaryMap conditionality**: BoundaryMap-dependent dispositions are generated as conditional rules only when Horismos is in the chain; omit otherwise
7. **No duplicate gates**: The generated template references protocols by `skills:` frontmatter and pipeline context rules — it does not duplicate the protocol's own gate definitions
8. **Template completeness**: Every generated template must include: frontmatter with skills list, pipeline context rules, materialized view template, error recovery section, and rules section
