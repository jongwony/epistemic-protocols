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
| 1. Scan | Subagent (project-scanner) | Bash, Read, Glob | Project discovery + secondary sources |
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
| Session JSONL (pattern evidence) | Grep (context) + Read (offset/limit) | Context snippets: (user message, AI response) pairs near pattern evidence |

### Secondary: Configuration (Environment Context)

| Source | Method | Extracts |
|--------|--------|----------|
| `~/.claude/CLAUDE.md` | Read | Workflow style keywords (team, delegation, safety) |
| `~/.claude/rules/` | Glob | Rule file presence (which domains are rule-governed) |
| `~/.claude/settings.json` | Read (hooks only) | Hook usage patterns |
| MEMORY.md (if exists) | Read | Existing insights, recurring patterns |

### Tertiary: Usage Data Cache (Accelerator — Optional)

| Source | Method | Extracts |
|--------|--------|----------|
| `~/.claude/usage-data/facets/{session_id}.json` | Read | friction_counts, friction_detail, goal_categories, session_type, outcome, user_satisfaction_counts, brief_summary |
| `~/.claude/usage-data/session-meta/{session_id}.json` | Read | tool_counts, git_commits, git_pushes, languages, uses_task_agent, duration_minutes, first_prompt |

**Join key**: session_id from sessions-index.json matches filename in both directories.
**Availability**: Only exists if user has run `/insights`. Read-only consumption — never write to these caches.

## Phase Execution

### Phase 1: Scan (Project Discovery) — Subagent Delegated

**Call project-scanner subagent** to handle all project discovery. Phase 1 inherently requires 5+ Bash calls (directory listing, stat, file reads), always exceeding the delegation threshold. Pre-planned delegation avoids reactive interruption.

The subagent:
1. Lists project directories under `~/.claude/projects/`
2. Selects the 3 most recently modified projects (using `stat` for modification time)
3. Reconstructs actual project paths from encoded directory names (e.g., `-Users-choi-myproject` → `~/myproject`). Records project path ↔ session mapping for Phase 4 resume commands
4. Reads each project's `sessions-index.json`
5. Aggregates: total session count, average/max messageCount, last activity date
6. Scans secondary sources: `~/.claude/CLAUDE.md`, `~/.claude/rules/`, `~/.claude/settings.json`, MEMORY.md

Main agent receives structured output and proceeds to Phase 2.

**Edge cases**:
- If `~/.claude/projects/` does not exist or is empty: subagent reports absence, main agent skips to Phase 2 step 4 (secondary sources only), set Tier 3
- If `sessions-index.json` cannot be parsed (corrupted JSON): subagent skips that project, continues with remaining
- Project path reconstruction: directory names encode absolute paths with `/` and `.` replaced by `-`. Subagent uses heuristics (home directory prefix, known directory structure) to reconstruct readable `~/...` paths

If no `sessions-index.json` found in any project, skip to Phase 2 step 4 (secondary sources only) and set fallback tier to Tier 3.

### Phase 2: Extract (Pattern Extraction) — Dual-Path

1. From each project's `sessions-index.json`, select the 3 most recently modified sessions (by `modified` field). Maximum 9 sessions total.
2. **Facets availability check**: For each selected session ID, check if `~/.claude/usage-data/facets/{session_id}.json` exists (Glob). Determine path per project:
   - **Path A**: 2+ sessions in the project have facets files → facets-accelerated extraction
   - **Path B**: 0-1 sessions have facets → full subagent extraction (baseline)
3. **Path A** (facets-available, per project):
   a. Main agent reads facets JSON directly → aggregate friction_counts, collect non-empty friction_detail (max 3), aggregate goal_categories/session_type/outcome
   b. If session-meta exists: read → sum tool_counts, git_commits/git_pushes, languages (replaces behavioral pattern extraction)
   c. For top 2-3 friction keys with friction_detail: call session-analyzer in **targeted mode** (friction_pointers) for snippet extraction only
   d. Co-occurrence facts: derive situations from goal_categories + check firstPrompt for slash command history
   **Path B** (facets-absent, per project):
   a. **Call session-analyzer subagent** in **full mode** (one per project):
      - Subagent receives session JSONL file paths
      - Subagent extracts: tool frequencies, rework indicators (same file 3+ edits), slash command history, Bash keywords, AskUserQuestion presence, context snippets, situation co-occurrence facts, conversation quality signals
      - Subagent returns structured analysis (raw data only, no interpretation)
4. Main agent analyzes `firstPrompt` text from `sessions-index.json` for ambiguity/exploration keywords:
   - Vague starts: `improve`, `optimize`, `ideas for`, `something like`
   - Vague starts (Korean equivalents): expressions meaning "I want to~", "how do I~", "a bit more", "enhance"
   - Exploratory framing: `explore`, `investigate`, `look into` and Korean equivalents
5. Main agent uses secondary sources from Phase 1 project-scanner output:
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
3.5. Match friction patterns against the Tertiary Mapping Table (Path A projects only)
   - Aggregate friction_counts across sessions per project
   - Map Primary-type keys to protocols
   - Combine with Primary/Secondary match strengths (additive, Weak+friction=Strong)
4. Determine Fallback Tier:
   - **Tier 1**: 3+ strong patterns found — map precisely to observed patterns
   - **Tier 2**: 1-2 weak patterns found — map + supplementary recommendations
   - **Tier 3**: No patterns / new user — Starter Trio recommendation
5. Select final 3-5 protocol recommendations
6. **Session Diagnostics**: Merge situation co-occurrence facts from Phase 2 subagent output (tool-usage patterns) with main agent firstPrompt analysis (Telos, Katalepsis situations). Then determine protocol mapping and cross-reference with slash command history:
   - Situations where a protocol was applicable but not used → anti-pattern candidates
   - Conversation quality signals (user corrections, backtracking) from Phase 2 subagent Step 2.7 → conversation anti-patterns
   - Each anti-pattern: describe the situation, reference the snippet, suggest the protocol
7. **Coverage computation**: For each protocol, compute situation_used / situation_occurred ratio from Phase 2 situation indicators. Protocols with no detected situations = N/A (not included in coverage)

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
     - Epistemic Coverage: radar chart (inline SVG) showing situation coverage per protocol + progress bars per protocol with situation_used/situation_occurred ratio. N/A protocols (no situations detected) shown separately. Graceful degradation: if insufficient data (Tier 3), show placeholder with "Run more sessions for coverage data"
     - Session Diagnostics: anti-pattern cards — each with context snippet (user message + AI response pair) → protocol CTA describing expected behavior → `cd ~/project-path && claude --resume <session-id>`. Graceful degradation: if no anti-patterns detected, omit section entirely
     - Discovered Patterns: pattern cards with narrative structure — two narrative sources (use whichever available, prefer friction when both exist):
       - **Friction narrative** (Path A): friction_detail text → targeted snippet (user, AI pair) → protocol CTA → resume command
       - **Snippet narrative** (Path B): context snippet (user, AI pair) → protocol CTA → resume command
       Graceful degradation: if neither quality snippet nor friction_detail, show statistical evidence only
     - Recommended Protocols: each protocol with mapping rationale + cross-reference to relevant pattern/diagnostic snippet + `/command` CTA + install command (`claude plugin add epistemic-protocols/<name>`) if not installed
     - Quick Start: snippet-based concrete scenario for top recommendation — reference actual session context, show what protocol invocation would do, include `cd ~/project-path && claude --resume <id>` for immediate action + install command if needed
   - Style: clean card layout, protocol-specific color coding, dark theme, responsive design

   Refer to `references/html-template.md` for the HTML skeleton and CSS class reference.

3. Provide artifact file path to user

### Phase 5: Guide (Trial CTA + Install Helper)

1. **Check plugin installation**: verify whether recommended protocols are installed
   - Check plugin installation via file existence: Glob for `~/.claude/plugins/cache/epistemic-protocols/{plugin-name}/*/skills/*/SKILL.md`. If found, the protocol is installed.
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
| Vague first prompts ("improve", "optimize", "ideas for") | firstPrompt keyword match | **Telos** `/goal` | Starting without defined goals |
| Same file edited 3+ times | Edit path frequency; user disambiguates: same intent repeatedly → `/clarify`, different concerns → `/gap` | **Hermeneia** OR **Syneidesis** | Repeated edits without prior gap check or intent clarification |
| Exploration ratio 3:1+ across multiple sessions | (Read+Grep+Glob) / (Edit+Write) threshold | **Prothesis** `/frame` | Sustained exploration without analytical framework |
| Bash contains deploy/push/apply keywords | Bash input keyword match | **Prosoche** `/attend` | Executing without risk assessment |
| Verification keywords in firstPrompt (user-authored text only) | firstPrompt keyword match: "explain", "what did you do", "help me understand", "verify", "check" | **Katalepsis** `/grasp` | Need to verify comprehension of results |

### Secondary Mapping Table (Environment Patterns)

| Observable Pattern | Source | Protocol | Rationale |
|---|---|---|---|
| team/delegation keywords in CLAUDE.md | CLAUDE.md Read | **Epitrope** `/calibrate` | Delegation structure exists but scope undefined |
| Many hook configurations | settings.json hooks | **Prosoche** `/attend` (reinforcing) | User already values safety mechanisms |
| Communication-related rule files | Glob rules/ | **Hermeneia** `/clarify` (reinforcing) | Explicit communication rule management |

### Tertiary Mapping Table (Friction Patterns — from Facets)

Applied only when facets data is available (Path A). Complements Primary and Secondary — does not replace them.

| Friction Key | Protocol | Rationale | Signal Type |
|---|---|---|---|
| `wrong_approach` | **Telos** `/goal` | Wrong direction due to undefined goal | Primary |
| `wrong_approach` + rework situation | **Syneidesis** `/gap` | Approach gap undetected, accompanied by rework | Primary |
| `misunderstood_request` | **Hermeneia** `/clarify` | Intent-expression mismatch | Primary |
| `user_rejected_action` | **Epitrope** `/calibrate` | Ambiguous delegation scope — AI acted outside intent | Primary |
| `excessive_changes` | **Syneidesis** `/gap` | Scope boundary gap undetected | Primary |
| `context_loss` | **Aitesis** `/inquire` | Information loss due to insufficient context | Primary |
| `wrong_file_edited` | **Prosoche** `/attend` | Execution risk not assessed | Primary |
| `buggy_code`, `api_errors`/`api_error`, `tool_errors`/`tool_error`/`tool_failure`/`tool_limitation`, `external_blocker`/`external_dependency`, `merge_conflict`, `minor_correction`, `excessive_verification`/`excessive_tool_calls`, `unrelated_environment_issue`/`deployment_gap`, `agent_*` | — | Infrastructure/environment friction — not epistemic deficit | Environmental |

**Signal Type**: Primary = directly maps to protocol deficit. Environmental = reported only (no mapping).
**Interaction**: friction Primary signals are additive with existing Primary/Secondary signals. Same-protocol evidence escalates strength (Weak+friction=Strong).

Composition rules (protocol chaining based on pattern combinations) are deferred to a future version.

## Fallback Strategy

**Tier 1** (3+ strong patterns): Map precisely to observed patterns.

**Tier 2** (1-2 weak patterns): Map observed patterns + add supplementary "also useful in these situations" recommendations.

**Tier 3** (No patterns / new user): Recommend the **Starter Trio** — three universally applicable protocols:
- **Hermeneia** `/clarify` — When you want to convey intent more precisely
- **Telos** `/goal` — When what to build is still unclear
- **Syneidesis** `/gap` — When you want to check for blind spots before deciding

Selection rationale: covers the three most common entry points — intent clarification, goal construction, and decision auditing. Low entry barrier, independently usable.

## Also Available

These protocols are not pattern-matched in the current version but remain available for manual invocation:

- **Aitesis** `/inquire` — Detect context insufficiency before execution. Use when you suspect missing context that could affect outcomes.
- **Epharmoge** `/contextualize` — Detect application-context mismatch after execution. Use when correct output may not fit the actual deployment context.

Both protocols will be integrated into pattern-based detection in future versions as reliable detection heuristics are developed.

## HTML Artifact Guidelines

Refer to `references/html-template.md` for the full HTML skeleton, CSS classes, and detailed artifact guidelines.

## Rules

1. **Privacy**: Never transmit session data externally. All analysis runs locally.
2. **Raw data and co-occurrence facts in subagents**: session-analyzer subagents return raw counts, co-occurrence facts, and conversation quality signals — situation-to-protocol mapping and coverage status classification happen in the main agent only.
3. **Evidence-based recommendations**: Every protocol recommendation must cite at least one observable pattern with data. Tier 3 fallback explicitly states "insufficient data for personalized recommendation."
4. **No auto-install**: Guide installation but never install plugins automatically. CTA = user action.
5. **Idempotent**: Running `/onboard` multiple times produces updated results based on latest data. Previous artifacts are overwritten.
6. **Session file access**: Access session JSONL files via Grep pattern matching or targeted Read with offset/limit (for efficiency). Never Read entire JSONL files — they can be very large.
7. **Subagent delegation**: Phase 1 project scanning MUST be delegated to project-scanner subagent (single). Phase 2 session analysis: Path A (facets-available) delegates to session-analyzer in targeted mode; Path B (facets-absent) delegates in full mode. Maximum 3 parallel subagents across both paths.
8. **Facets as accelerator**: Facets data is a pure accelerator — its absence must not degrade output quality. Path B produces identical output to the pre-enhancement baseline.
