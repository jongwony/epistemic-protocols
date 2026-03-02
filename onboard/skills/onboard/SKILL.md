---
name: onboard
description: "Analyze Claude Code usage patterns and recommend epistemic protocols for onboarding."
---

# Onboard Skill

Analyze a user's Claude Code usage patterns — session logs, configuration, and workflow habits — to recommend epistemic protocols tailored to their actual work.

## When to Use

Invoke this skill when:
- A new user wants to discover which epistemic protocols fit their workflow
- Exploring protocol adoption based on real usage data
- Re-evaluating protocol fit after workflow changes

Skip when:
- User already knows which protocol to use (direct invocation)
- No session history exists and user prefers manual exploration
- Quick single-protocol question (answer directly)

## Workflow Overview

```
SCAN → EXTRACT → MAP → PRESENT → GUIDE
```

| Phase | Owner | Tool | Decision Point |
|-------|-------|------|----------------|
| 1. Scan | Main | Bash, Read | Project selection |
| 2. Extract | Subagent (session-analyzer) | Grep, Read | Pattern extraction from JSONL |
| 3. Map | Main | — | Pattern → Protocol matching |
| 4. Present | Main | AskUserQuestion, Write | User confirmation + HTML artifact |
| 5. Guide | Main | AskUserQuestion | Protocol trial CTA |

## Data Sources

### Primary: Session Logs (Behavioral Patterns)

| Source | Method | Extracts |
|--------|--------|----------|
| `sessions-index.json` (recent 3 projects) | Read | firstPrompt (start patterns), summary (result patterns), messageCount (conversation length) |
| Session JSONL (up to 3 per project) | Grep `"tool_use"` | Tool usage frequency distribution (Edit/Read/Bash/AskUserQuestion ratios) |
| Session JSONL | Grep `command-name` | Slash command history (existing protocol usage) |
| Session JSONL | Grep `"Bash"` + keywords | Execution patterns (deploy, push, test, install frequency) |

### Secondary: Configuration (Environment Context)

| Source | Method | Extracts |
|--------|--------|----------|
| `~/.claude/CLAUDE.md` | Read | Workflow style keywords (team, delegation, safety) |
| `~/.claude/rules/` | Glob | Rule file presence (which domains are rule-governed) |
| `~/.claude/settings.json` | Read (hooks only) | Hook usage patterns |
| MEMORY.md (if exists) | Read | Existing insights, recurring patterns |

## Phase Execution

### Phase 1: Scan (Project Discovery)

1. List project directories under `~/.claude/projects/`
2. Select the 3 most recently modified projects (use `stat` for modification time)
3. Read each project's `sessions-index.json`
4. Aggregate: total session count, average/max messageCount, last activity date

If no `sessions-index.json` found in any project, skip to Phase 2 step 4 (secondary sources only) and set fallback tier to Tier 3.

### Phase 2: Extract (Pattern Extraction) — Subagent Delegated

1. From each project's `sessions-index.json`, select the 3 most recently modified sessions (by `modified` field). Maximum 9 sessions total.
2. **Call session-analyzer subagent** (one per project, up to 3 in parallel):
   - Each subagent receives its project's session JSONL file paths
   - Subagent extracts: tool frequencies, rework indicators (same file 3+ edits), slash command history, Bash keywords, AskUserQuestion presence
   - Subagent returns structured analysis (raw data only, no interpretation)
3. Main agent analyzes `firstPrompt` text from `sessions-index.json` for ambiguity/exploration keywords:
   - Vague starts: `improve`, `optimize`, `ideas for`, `something like`
   - Vague starts (Korean equivalents): expressions meaning "I want to~", "how do I~", "a bit more", "enhance"
   - Exploratory framing: `explore`, `investigate`, `look into` and Korean equivalents
4. Main agent scans secondary sources:
   - `~/.claude/CLAUDE.md`: keywords indicating team work, delegation preferences, safety focus
   - `~/.claude/rules/`: which domains have explicit rules (communication, boundaries, etc.)
   - `~/.claude/settings.json`: hook configurations (safety consciousness indicator)
   - MEMORY.md: existing patterns and insights

### Phase 3: Map (Protocol Matching)

Apply the mapping tables below to match observed patterns to protocols.

1. Match each behavioral pattern against the Primary Mapping Table
2. Classify match strength:
   - **Strong**: Pattern observed in 3+ sessions
   - **Weak**: Pattern observed in 1-2 sessions
   - **None**: Pattern not observed
3. Match environmental patterns against the Secondary Mapping Table
4. Apply Composition Rules for multi-pattern combinations
5. Determine Fallback Tier:
   - **Tier 1**: 3+ strong patterns found — map precisely with composition
   - **Tier 2**: 1-2 weak patterns found — map + supplementary recommendations
   - **Tier 3**: No patterns / new user — Starter Trio recommendation
6. Select final 3-5 protocol recommendations

### Phase 4: Present (Results & Artifact)

1. Call AskUserQuestion to present analysis summary:
   - Number of sessions analyzed
   - Key patterns discovered (with evidence counts)
   - Proposed protocol recommendations
   - Ask user to confirm before generating artifact

2. On confirmation, generate HTML artifact via Write tool:
   - Save to `~/.claude/.onboard/epistemic-profile.html`
   - Structure:
     - Header: "Your Epistemic Profile" + analysis statistics
     - Pattern Cards: discovered patterns with evidence data
     - Recommendation Cards: each protocol with mapping rationale + usage scenario + `/command` CTA
     - Composition Suggestions: protocol chain recommendations (if applicable)
     - Quick Start: "try now" guide for top recommendation
   - Style: clean card layout, protocol-specific color coding, responsive design

3. Provide artifact file path to user

### Phase 5: Guide (Trial CTA + Install Helper)

1. **Check plugin installation**: verify whether recommended protocols are installed
   - Check if the protocol's slash command is available in the current session
   - If installed: provide direct CTA (e.g., "Try `/clarify` right now in your current session")
   - If not installed: guide marketplace installation:
     - `claude plugin add epistemic-protocols/{plugin-name}` or marketplace URL
     - Brief installation steps

2. Present a **concrete usage scenario** for the top recommendation:
   - Based on the user's actual work context (derived from session analysis)
   - Example: "You edited the same file 5 times in recent sessions — using `/clarify` to articulate intent first can reduce rework cycles"

3. Close with: "Refer to the HTML profile for remaining recommendations. You can re-run `/onboard` anytime for updated analysis."

## Pattern to Protocol Mapping

### Primary Mapping Table (Behavioral Patterns)

| Observable Pattern | Detection Method | Protocol | Rationale |
|---|---|---|---|
| Vague first prompts ("improve", "optimize", "ideas for") | firstPrompt text analysis | **Telos** `/goal` | Starting without defined goals |
| Rework loops: same file edited 3+ times in similar direction | Edit path frequency + temporal pattern | **Hermeneia** `/clarify` | Intent miscommunication causing repeated fixes |
| Same file edited 3+ times | Edit path aggregation | **Syneidesis** `/gap` | No gap check before committing to changes |
| Read/Grep ratio >> Edit/Write ratio | Tool frequency ratios | **Prothesis** `/frame` | Exploring without analytical framework |
| Bash contains deploy/push/apply keywords | Bash input keyword search | **Prosoche** `/attend` | Executing without risk assessment |
| AskUserQuestion never used (across sessions) | AskUserQuestion count = 0 | **Aitesis** `/inquire` | Proceeding without context verification |
| Post-completion verification requests | summary contains verification keywords | **Katalepsis** `/grasp` | Need to verify comprehension of results |
| Similar tasks repeated across projects | firstPrompt similarity across projects | **Epharmoge** `/contextualize` | Applying without context verification |

### Secondary Mapping Table (Environment Patterns)

| Observable Pattern | Source | Protocol | Rationale |
|---|---|---|---|
| team/delegation keywords in CLAUDE.md | CLAUDE.md Read | **Epitrope** `/calibrate` | Delegation structure exists but scope undefined |
| Many hook configurations | settings.json hooks | **Prosoche** `/attend` (reinforcing) | User already values safety mechanisms |
| Communication-related rule files | Glob rules/ | **Hermeneia** `/clarify` (reinforcing) | Explicit communication rule management |

### Composition Rules

Natural protocol chains derived from pattern combinations:

| Pattern Combination | Recommended Chain | Rationale |
|---|---|---|
| Vague starts + rework loops | **Hermeneia → Telos** | Clarify intent then define goals |
| Exploration-heavy + repeated edits | **Prothesis → Syneidesis** | Set framework then check gaps |
| External dependencies + direct execution | **Aitesis → Prosoche** | Verify context then assess risks |
| Team setup + execution tasks | **Epitrope → Prosoche** | Calibrate delegation then evaluate execution risks |

## Fallback Strategy

**Tier 1** (3+ strong patterns): Map precisely to observed patterns. Apply composition rules.

**Tier 2** (1-2 weak patterns): Map observed patterns + add supplementary "also useful in these situations" recommendations.

**Tier 3** (No patterns / new user): Recommend the **Starter Trio** — three universally applicable protocols:
- **Hermeneia** `/clarify` — When you want to convey intent more precisely
- **Telos** `/goal` — When what to build is still unclear
- **Syneidesis** `/gap` — When you want to check for blind spots before deciding

Selection rationale: first three in precedence order (intent → goal → decision), low entry barrier, independently usable.

## HTML Artifact Guidelines

The HTML artifact should:
- Be self-contained (inline CSS, no external dependencies)
- Use a clean card-based layout with clear visual hierarchy
- Assign distinct colors per protocol for quick scanning
- Include clickable `/command` CTAs (displayed as styled badges)
- Show evidence counts alongside each pattern (e.g., "5 sessions, 12 Edit calls on same file")
- Be responsive for different viewport sizes
- Include a timestamp and "generated by /onboard" footer

## Rules

1. **Privacy**: Never transmit session data externally. All analysis runs locally.
2. **Raw data only in subagents**: session-analyzer subagents return raw counts and paths — interpretation happens in the main agent only.
3. **Evidence-based recommendations**: Every protocol recommendation must cite at least one observable pattern with data. Tier 3 fallback explicitly states "insufficient data for personalized recommendation."
4. **No auto-install**: Guide installation but never install plugins automatically. CTA = user action.
5. **Idempotent**: Running `/onboard` multiple times produces updated results based on latest data. Previous artifacts are overwritten.
6. **Session file access**: Read session JSONL files via Grep pattern matching only (for efficiency). Never Read entire JSONL files — they can be very large.
7. **Subagent delegation**: Phase 2 session analysis MUST be delegated to session-analyzer subagents (one per project, up to 3 parallel). Main agent handles phases 1, 3, 4, 5.
