---
name: preferences
description: "Interactive protocol preference configuration for ~/.claude/CLAUDE.local.md."
---

# Preferences Skill

Configure epistemic protocol behavior through interactive dialogue. Generates a preferences section in `~/.claude/CLAUDE.local.md` that protocols read at runtime.

## When to Use

Invoke when:
- Customizing protocol behavior (intensity, sensitivity, convergence thresholds)
- Setting up initial preferences for the first time
- Adjusting preferences after experiencing protocols via `/onboard`

Skip when:
- Want to learn about protocols first (use `/onboard`)
- Want session analytics (use `/report`)
- Need one-time protocol override (state preference inline during invocation)

## Workflow Overview

```
DETECT → SELECT → CONFIGURE → GENERATE → VERIFY
```

| Phase | Owner | Tool | Purpose |
|-------|-------|------|---------|
| 0. Detect | Main | Read | Check existing preferences section |
| 1. Select | Main | Gate | Path selection (Quick/Full) + existing section handling |
| 2. Configure | Main | Gate | Parameter traversal |
| 3. Generate | Main | Read, Edit/Write | Create/update CLAUDE.local.md section |
| 4. Verify | Main | Read, Gate | Review result |

## Parameter Catalog

### Global Parameters (Quick Path)

Parameters applied across protocols. Ordered by impact — early exit still captures high-value settings.

| # | Parameter | Default | Options | Scope |
|---|-----------|---------|---------|-------|
| 1 | Intensity | auto | light / medium / heavy / auto | 9/10 (Prothesis excluded) |
| 2 | Post-Convergence Suggestions | on | on / off | 10/10 |
| 3 | AI-Guided Activation Sensitivity | default | conservative / default / aggressive | AI-guided protocols (7/10) |
| 4 | Session Immunity Scope | per-session | per-session / per-invocation | 6/10 |
| 5 | AI-Detection Trigger | confirm | auto / confirm / suggest-only / disable | Hermeneia, AI-guided (8/10) |
| 6 | Explanation Level | standard | accessible / standard / technical | 10/10 |
| 7 | Interaction Modality | text-stop | text-stop / ask-user-question | 10/10 |

**Parameter descriptions** (presented to user during configuration):

1. **Intensity**: Controls protocol thoroughness. `light` = fewer questions, faster convergence. `heavy` = deeper analysis, more questions. `auto` = protocol decides per context.
2. **Post-Convergence Suggestions**: Whether protocols suggest related protocols after completing. `off` suppresses the suggestion section.
3. **AI-Guided Activation Sensitivity**: How eagerly AI-guided protocols detect activation conditions. `conservative` = fewer false triggers. `aggressive` = catches more subtle cases.
4. **Session Immunity Scope**: After a protocol runs on a topic, how long it avoids re-triggering. `per-session` = immune for entire session. `per-invocation` = only immune for current invocation.
5. **AI-Detection Trigger**: How AI-detected triggers (vs explicit /slash invocation) are handled. `auto` = activates immediately without confirmation. `confirm` = asks before activating. `suggest-only` = mentions without activating. `disable` = only explicit invocation works.
6. **Explanation Level**: Controls abstraction level and language complexity of protocol questions and explanations. `accessible` = simple language, concrete examples, minimal jargon. `standard` = balanced explanation. `technical` = conceptual depth, domain terminology allowed.
7. **Interaction Modality** (`interaction_modality`): Controls how gate interactions (Qc/Qs) are realized. `text-stop` = structured numbered text output + Stop (turn yield), user responds freely. `ask-user-question` = AskUserQuestion tool call with structured options.

### Per-Protocol Parameters (Full Path)

Grouped by Epistemic Concern Cluster. Users select which clusters to configure; "Keep defaults" skips entire cluster.

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

1. Read `~/.claude/CLAUDE.local.md`
2. Search for `## Epistemic Protocol Preferences` section
3. Determine state:
   - **File absent**: proceed to Phase 1 (new file)
   - **File exists, section absent**: proceed to Phase 1 (append section)
   - **Section exists**: proceed to Phase 1 (update flow)

### Phase 1: Select

**If section exists** — present:
- Text: "Existing preferences found. How to proceed?"
- Options:
  - "Update — modify specific parameters"
  - "Replace — start fresh"
  - "Keep — exit without changes"

If "Keep" → terminate.
If "Update" → present for Quick/Full path selection (same as new-section flow), then Phase 2 with existing values as current defaults.
If "Replace" → Phase 2 with standard defaults.

**If section absent** — present:
- Text: "Configuration path?"
- Options:
  - "Quick — 7 global parameters"
  - "Full — global + per-protocol parameters (~32)"

### Phase 2: Configure

#### Quick Path (7 gate interactions)

For each global parameter (ordered 1-7), present:
- Text: "[Parameter name]: [description]"
- Options: list of valid values with `(default)` marker on the default value

#### Full Path (Quick + per-protocol)

1. Complete Quick Path (7 calls)
2. Present for cluster selection:
   - Text: "Which protocol groups to customize?"
   - Options:
     - "Planning — /clarify, /goal, /inquire"
     - "Analysis — /frame, /ground"
     - "Decision — /gap"
     - "Execution — /attend"
     - "Verification — /contextualize"
     - "Cross-cutting — /bound, /grasp"
     - "All groups"
     - "Done — keep defaults for unselected"

3. For each selected cluster, for each protocol in cluster, present:
   - Text: "[Protocol] /[command] parameters:\n[list all params with current values]"
   - Options:
     - "Keep all defaults"
     - One option per parameter name

   If user selects a parameter → present via gate interaction with that parameter's options → return to protocol parameter list for remaining params. Repeat until "Keep remaining defaults" or all adjusted.

**Budget**: Quick path completes within 9 calls (7 params + select + verify). Full path completes within 19 calls minimum, increasing with individual parameter modifications.

### Phase 3: Generate

Construct the preferences section and write to `~/.claude/CLAUDE.local.md`.

**Section structure**:

```markdown
## Epistemic Protocol Preferences

### Global
- Intensity: auto
- Post-Convergence Suggestions: on
- AI-Guided Activation Sensitivity: default
- Session Immunity Scope: per-session
- AI-Detection Trigger: confirm
- Interaction Modality: text-stop

### Per-Protocol
<!-- Only non-default values recorded below -->

#### Hermeneia /clarify
- Gap Queue Limit: 8

#### Prosoche /attend
- Risk Classification: conservative
- Auto-Delegate: none
```

**Generation rules**:
- Global section: always write all 7 parameters (even if all default)
- Per-Protocol section: only write parameters that differ from defaults
- If all per-protocol parameters are default: omit Per-Protocol section entirely
- Section boundary: `## Epistemic Protocol Preferences` through next `## ` heading or EOF

**File operations**:
- File absent → Write new file with section
- File exists, section absent → Append section at end (file content available from Phase 0)
- Section exists → Identify section boundaries from Phase 0 content (`## Epistemic Protocol Preferences` to next `## ` or EOF), Edit to replace section

### Phase 4: Verify

1. Read the written section from `~/.claude/CLAUDE.local.md`
2. Present the result as text output
3. Present via gate interaction:
   - Text: "Preferences saved. Review above."
   - Options:
     - "Looks good"
     - "Adjust — modify a parameter"
     - "Redo — start over"

If "Adjust" → return to Phase 2 (targeted parameter modification).
If "Redo" → return to Phase 1.

## Output Format

Target file: `~/.claude/CLAUDE.local.md`
Section heading: `## Epistemic Protocol Preferences`

The generated section is human-readable and machine-parseable. Protocols read this section at runtime to adjust behavior.

**Format conventions**:
- One parameter per line: `- Key: value`
- Protocol headers: `#### ProtocolName /command`
- Comments (`<!-- -->`) for metadata only
- No indentation beyond list item dash

## Rules

1. **Recognition over Recall**: All parameters presented via gate interaction with selectable options. Never ask users to type parameter values.
2. **Minimal noise**: Per-Protocol section records only non-default values. Default behavior requires zero configuration.
3. **Existing section handling**: Always offer Update/Replace/Keep when preferences already exist. Never silently overwrite.
4. **Gate interaction budget**: Quick path completes within 9 calls. Full path completes within 19 calls minimum.
5. **No protocol execution**: This skill configures preferences only. It does not call or simulate any protocol.
6. **File safety**: Read before write. Preserve all content outside the preferences section boundary.
7. **Reversibility**: All changes are to a local git-untracked file. User can delete the section or file to restore defaults.
