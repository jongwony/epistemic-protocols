---
name: preferences
description: "Initialize epistemic protocol preferences with defaults. Modify via /memory."
---

# Preferences Skill

Initialize epistemic protocol preferences with defaults for the current project. Individual parameter modifications are done via `/memory` built-in command or natural language requests.

## When to Use

Invoke when:
- Setting up initial preferences for a new project
- Resetting all preferences to defaults

Skip when:
- Want to modify individual preferences (use `/memory` or natural language)
- Want to learn about protocols first (use `/onboard`)

## Workflow Overview

```
DETECT → INITIALIZE → WRITE
```

| Phase | Owner | Tool | Purpose |
|-------|-------|------|---------|
| 0. Detect | Main | Read | Check existing preferences memory file |
| 1. Initialize | Main | Gate | Present defaults + confirm initialization |
| 2. Write | Main | Write | Create/reset memory file |

## Parameter Catalog

### Global Parameters

Parameters applied across protocols. Ordered by impact.

| # | Parameter | Default | Options | Scope |
|---|-----------|---------|---------|-------|
| 1 | Interaction Modality | text-stop | text-stop / ask-user-question | 10/10 |
| 2 | Intensity | auto | light / medium / heavy / auto | 9/10 (Prothesis excluded) |
| 3 | Post-Convergence Suggestions | on | on / off | 10/10 |
| 4 | AI-Guided Activation Sensitivity | default | conservative / default / aggressive | AI-guided protocols (7/10) |
| 5 | Session Immunity Scope | per-session | per-session / per-invocation | 6/10 |
| 6 | AI-Detection Trigger | confirm | auto / confirm / suggest-only / disable | Hermeneia, AI-guided (8/10) |
| 7 | Explanation Level | standard | accessible / standard / technical | 10/10 |

**Parameter descriptions**:

1. **Interaction Modality** (`interaction_modality`): Controls how gate interactions (Qc/Qs) are realized. `text-stop` = structured numbered text output + Stop (turn yield), user responds freely. `ask-user-question` = AskUserQuestion tool call with structured options.
2. **Intensity**: Controls protocol thoroughness. `light` = fewer questions, faster convergence. `heavy` = deeper analysis, more questions. `auto` = protocol decides per context.
3. **Post-Convergence Suggestions**: Whether protocols suggest related protocols after completing. `off` suppresses the suggestion section.
4. **AI-Guided Activation Sensitivity**: How eagerly AI-guided protocols detect activation conditions. `conservative` = fewer false triggers. `aggressive` = catches more subtle cases.
5. **Session Immunity Scope**: After a protocol runs on a topic, how long it avoids re-triggering. `per-session` = immune for entire session. `per-invocation` = only immune for current invocation.
6. **AI-Detection Trigger**: How AI-detected triggers (vs explicit /slash invocation) are handled. `auto` = activates immediately without confirmation. `confirm` = asks before activating. `suggest-only` = mentions without activating. `disable` = only explicit invocation works.
7. **Explanation Level**: Controls abstraction level and language complexity of protocol questions and explanations. `accessible` = simple language, concrete examples, minimal jargon. `standard` = balanced explanation. `technical` = conceptual depth, domain terminology allowed.

### Per-Protocol Parameters

Grouped by Epistemic Concern Cluster. Configure via `/memory` — only non-default values need to be added.

#### Planning

**Hermeneia /clarify**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Gap Queue Limit | 6 | 4 / 6 / 8 | Max items extracted per clarification cycle |
| Paraphrase Verification | on | on / off | Verify paraphrase with user before proceeding |
| Convergence Speed | normal | quick / normal / thorough | Convergence declaration sensitivity |

**Telos /goal**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Contract Detail | balanced | sparse / balanced / detailed | GoalContract granularity |
| Proposal Count | 2 | 1 / 2 / 3 | Number of initial goal proposals |

**Aitesis /inquire**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Max Questions | 5 | 3 / 5 / 7 | Questions per inquiry cycle |
| Prioritization | information-gain | information-gain / breadth-first | Question ordering strategy |
| Scope | task-only | task-only / session-wide | Inference scope |

#### Analysis

**Prothesis /frame**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Default Mode | recommend | recommend / team | Mode 1 (recommend lenses) or Mode 2 (assemble team) |
| Max Perspectives | 3 | 2 / 3 / 4 / 5 | Perspective count in Mode 2 |
| Team Size | 3 | 2 / 3 / 4 | Agent team size in Mode 2 |
| Lens Selection | curated | curated / exploratory | Framework recommendation approach |

**Analogia /ground**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Mapping Depth | structural | surface / structural / deep | Correspondence analysis depth |
| Counterexample Threshold | standard | lenient / standard / strict | Validation rigor |

#### Decision

**Syneidesis /gap**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Gap Categories | all | all / procedural+consideration / consideration-only | Gap types to surface |
| Confidence Threshold | medium | low / medium / high | Minimum confidence for surfacing |
| Audit Depth | standard | quick / standard / thorough | Gap audit exhaustiveness |

#### Execution

**Prosoche /attend**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Risk Classification | default | conservative / default / aggressive | Gate trigger sensitivity |
| Auto-Delegate | low-only | none / low-only / low+medium | Risk levels to auto-delegate |
| Gate Sensitivity | default | strict / default / lenient | Gate-level action detection |
| Team Mode | auto | auto / manual | Team creation approach |
| Tracking | standard | minimal / standard / verbose | Execution tracking output |

#### Verification

**Epharmoge /contextualize**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Mismatch Sensitivity | default | conservative / default / aggressive | Context mismatch detection |
| Check Depth | standard | shallow / standard / deep | Verification thoroughness |
| Suggestion Format | brief | brief / detailed | Suggestion output verbosity |

#### Cross-cutting

**Horismos /bound**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Calibration Depth | standard | quick / standard / thorough | BoundaryMap detail level |
| Domain Granularity | coarse | coarse / fine | Domain classification resolution |
| Recalibration Prompt | auto | auto / ask | Recalibration behavior on scope change |

**Katalepsis /grasp**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| Verification Depth | standard | quick / standard / thorough | Comprehension check intensity |
| Question Count | 3 | 2 / 3 / 5 | Verification questions per cycle |
| Examples | recommended | optional / recommended / required | Concrete example requirement |
| Summary Format | compact | compact / narrative | Verification summary style |

## Phase Execution

### Phase 0: Detect

1. Check if project memory file `preferences_epistemic.md` exists in the project's memory directory
2. If exists: read current values → Phase 1 (reset flow)
3. If absent: Phase 1 (init flow)

### Phase 1: Initialize

Present the Global Parameters default catalog as text output.

**If absent**: Ask whether to initialize with defaults.
**If exists**: Show current values alongside defaults + ask whether to reset to defaults.

Present via gate interaction:
- "Yes — initialize with defaults"
- "No — cancel"

If "No" → terminate.

### Phase 2: Write

Write memory file `preferences_epistemic.md` with default values to the project's memory directory. Update MEMORY.md index if entry absent.

**Memory file format**:

```markdown
---
name: epistemic-protocol-preferences
description: "Per-project epistemic protocol settings — Interaction Modality, Intensity, Sensitivity, etc."
type: user
---

## Global
- Interaction Modality: text-stop
- Intensity: auto
- Post-Convergence Suggestions: on
- AI-Guided Activation Sensitivity: default
- Session Immunity Scope: per-session
- AI-Detection Trigger: confirm
- Explanation Level: standard
```

Present completion message directing user to `/memory` for individual parameter modifications.

**Per-Protocol section**: Only added when user modifies individual parameters via `/memory`. Not included in default initialization.

## Rules

1. **One-shot initialization**: `/preferences` presents defaults and asks for confirmation. No multi-turn parameter traversal.
2. **Modification via /memory**: Individual parameter changes are done through `/memory` built-in command or natural language requests to Claude.
3. **Per-project scope**: Preferences are stored as project memory, scoped to the current project only.
4. **Per-Protocol section**: Only written when non-default values exist. Added via `/memory`, not during initialization.
5. **Recognition over Recall**: Global parameter catalog with all options is presented for reference during initialization.
6. **No protocol execution**: This skill configures preferences only. It does not call or simulate any protocol.
7. **Reversibility**: Delete the memory file to restore defaults.
8. **Parameter order**: Interaction Modality is #1 — it determines how all subsequent gate interactions are realized.
