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

### Phase 2: Extract (Pattern Extraction) — Subagent Delegated

1. From each project's `sessions-index.json`, select the 3 most recently modified sessions (by `modified` field). Maximum 9 sessions total.
2. **Call session-analyzer subagent** (one per project, up to 3 in parallel):
   - Each subagent receives its project's session JSONL file paths
   - Subagent extracts: tool frequencies, rework indicators (same file 3+ edits), slash command history, Bash keywords, AskUserQuestion presence, context snippets (user message + AI response pairs near pattern evidence), situation indicators (protocol-relevant situations detected vs. protocol actually used)
   - Subagent returns structured analysis (raw data only, no interpretation)
3. Main agent analyzes `firstPrompt` text from `sessions-index.json` for ambiguity/exploration keywords:
   - Vague starts: `improve`, `optimize`, `ideas for`, `something like`
   - Vague starts (Korean equivalents): expressions meaning "I want to~", "how do I~", "a bit more", "enhance"
   - Exploratory framing: `explore`, `investigate`, `look into` and Korean equivalents
4. Main agent uses secondary sources from Phase 1 project-scanner output:
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
4. Determine Fallback Tier:
   - **Tier 1**: 3+ strong patterns found — map precisely to observed patterns
   - **Tier 2**: 1-2 weak patterns found — map + supplementary recommendations
   - **Tier 3**: No patterns / new user — Starter Trio recommendation
5. Select final 3-5 protocol recommendations
6. **Session Diagnostics**: Cross-reference situation indicators from Phase 2 with slash command history:
   - Situations where a protocol was applicable but not used → anti-pattern candidates
   - Conversation quality signals (user corrections, backtracking) → conversation anti-patterns
   - Each anti-pattern: describe the situation, reference the snippet, suggest the protocol
7. **Coverage computation**: For each protocol, compute situation_occurred / situation_used ratio from Phase 2 situation indicators. Protocols with no detected situations = N/A (not included in coverage)

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
     - Epistemic Coverage: radar chart (inline SVG) showing situation coverage per protocol + progress bars per protocol with situation_occurred/situation_used ratio. N/A protocols (no situations detected) shown separately. Graceful degradation: if insufficient data (Tier 3), show placeholder with "Run more sessions for coverage data"
     - Session Diagnostics: anti-pattern cards — each with context snippet (user message + AI response pair) → protocol CTA describing expected behavior → `cd ~/project-path && claude --resume <session-id>`. Graceful degradation: if no anti-patterns detected, omit section entirely
     - Discovered Patterns: pattern cards with narrative structure — context snippet → protocol CTA → `cd ~/project-path && claude --resume <session-id>`. Graceful degradation: if no quality snippet, show statistical evidence only
     - Recommended Protocols: each protocol with mapping rationale + cross-reference to relevant pattern/diagnostic snippet + `/command` CTA + install command (`claude plugin add epistemic-protocols/<name>`) if not installed
     - Quick Start: snippet-based concrete scenario for top recommendation — reference actual session context, show what protocol invocation would do, include `cd ~/project-path && claude --resume <id>` for immediate action + install command if needed
   - Style: clean card layout, protocol-specific color coding, dark theme, responsive design

   ```html
   <!-- Minimal structure reference -->
   <html lang="en">
   <head><meta charset="utf-8"><title>Epistemic Profile</title>
   <style>
     body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; background: #0f172a; color: #e2e8f0; }
     .card { border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #1e293b; }
     .pattern-card { border-left: 4px solid #6366f1; }
     .recommendation-card { border-left: 4px solid #22c55e; }
     .diagnostic-card { border-left: 4px solid #f59e0b; }
     .snippet { background: #0f172a; border-radius: 4px; padding: 1rem; margin: 0.75rem 0; font-size: 0.9rem; }
     .snippet .user-msg { color: #93c5fd; margin-bottom: 0.5rem; }
     .snippet .ai-msg { color: #86efac; margin-bottom: 0.5rem; }
     .snippet .session-ref { color: #9ca3af; font-size: 0.8rem; }
     .protocol-cta { background: #1a2e1a; border-radius: 4px; padding: 1rem; margin: 0.75rem 0; }
     .resume-cmd { font-family: monospace; background: #020617; color: #e2e8f0; padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; margin-top: 0.5rem; }
     .install-cmd { font-family: monospace; background: #020617; color: #a5b4fc; padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; margin-top: 0.5rem; }
     .cta { display: inline-block; background: #6366f1; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; font-family: monospace; }
     .stats { display: flex; gap: 2rem; margin: 1rem 0; }
     .stat { text-align: center; }
     .stat-value { font-size: 2rem; font-weight: bold; color: #818cf8; }
     .coverage-section { margin: 2rem 0; }
     .coverage-radar { text-align: center; margin: 1.5rem 0; }
     .coverage-bars { margin: 1rem 0; }
     .coverage-bar { display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0; }
     .coverage-bar-label { width: 100px; text-align: right; font-size: 0.9rem; }
     .coverage-bar-track { flex: 1; height: 8px; background: #334155; border-radius: 4px; }
     .coverage-bar-fill { height: 100%; border-radius: 4px; }
     .coverage-bar-value { width: 60px; font-size: 0.85rem; color: #9ca3af; }
   </style>
   </head>
   <body>
     <h1>Your Epistemic Profile</h1>
     <div class="stats"><!-- analysis statistics --></div>
     <h2>Epistemic Coverage</h2>
     <div class="coverage-section">
       <!-- .coverage-radar: inline SVG radar chart
         - One axis per protocol with detected situations
         - Filled area = usage ratio (situations used / situations occurred)
         - Protocols with no situations = excluded from radar, listed as N/A
         Graceful degradation: Tier 3 → "Run more sessions for coverage data"
       -->
       <!-- .coverage-bars: progress bar per protocol
         - Label: protocol name (/command)
         - Bar fill: situation_used / situation_occurred ratio
         - Value: "N/M situations" or "N/A"
       -->
     </div>
     <h2>Session Diagnostics</h2>
     <!-- .diagnostic-card per anti-pattern:
       1. Description: what happened and why it matters
       2. .snippet: (user message, AI response) pair from session
       3. .protocol-cta: "Using /command here would: ..."
       4. .resume-cmd: cd ~/project-path && claude --resume <session-id>
       Graceful degradation: if no anti-patterns detected, omit section entirely
     -->
     <h2>Discovered Patterns</h2>
     <!-- .pattern-card per pattern: narrative structure
       1. .snippet: (user message, AI response) pair from session
       2. .protocol-cta: "In this situation, calling /command would: ..."
       3. .resume-cmd: cd ~/project-path && claude --resume <session-id>
       Graceful degradation: if no quality snippet, show statistical evidence only
     -->
     <h2>Recommended Protocols</h2>
     <!-- .recommendation-card per protocol:
       - Mapping rationale + usage scenario
       - Cross-reference to relevant pattern/diagnostic snippet
       - /command .cta badge
       - .install-cmd: claude plugin add epistemic-protocols/<name> (if not installed)
     -->
     <h2>Quick Start</h2>
     <!-- Top recommendation with snippet-based scenario:
       - Reference actual session context
       - Show what protocol invocation would do
       - Include cd ~/project-path && claude --resume for immediate action
       - Include install command if protocol not installed
     -->
     <footer>Generated by /onboard · {timestamp}</footer>
   </body>
   </html>
   ```

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

These protocols are not pattern-matched in v0.1.0 but remain available for manual invocation:

- **Aitesis** `/inquire` — Detect context insufficiency before execution. Use when you suspect missing context that could affect outcomes.
- **Epharmoge** `/contextualize` — Detect application-context mismatch after execution. Use when correct output may not fit the actual deployment context.

Both protocols will be integrated into pattern-based detection in future versions as reliable detection heuristics are developed.

## HTML Artifact Guidelines

The HTML artifact should:
- Be self-contained (inline CSS, inline SVG for radar chart, no external dependencies)
- Use a dark theme card-based layout with clear visual hierarchy
- Assign distinct colors per protocol for quick scanning (diagnostic=amber, pattern=indigo, recommendation=green)
- Include clickable `/command` CTAs (displayed as styled badges)
- **Epistemic Coverage**: radar chart (inline SVG) + progress bars showing situation coverage per protocol. Tier 3 fallback: "Run more sessions for coverage data"
- **Session Diagnostics**: anti-pattern cards with context snippets + protocol CTA. Omit section if no anti-patterns detected
- Show context snippets in pattern cards: (user message, AI response) pair → protocol CTA → resume command
- Graceful degradation: if no quality snippet available, show statistical evidence (e.g., "5 sessions, 12 Edit calls on same file")
- Cross-reference pattern/diagnostic snippets in recommendation cards where available
- Use snippet-based concrete scenario in Quick Start section
- Full session IDs as copyable `cd ~/project-path && claude --resume <id>` commands (project path from Phase 1 scan)
- Include `claude plugin add epistemic-protocols/<name>` install commands for uninstalled protocols
- Be responsive for different viewport sizes
- Include a timestamp and "generated by /onboard" footer

Refer to the HTML skeleton in Phase 4 for the baseline structure. Adapt card content and styling to match the analysis results.

## Rules

1. **Privacy**: Never transmit session data externally. All analysis runs locally.
2. **Raw data only in subagents**: session-analyzer subagents return raw counts and paths — interpretation happens in the main agent only.
3. **Evidence-based recommendations**: Every protocol recommendation must cite at least one observable pattern with data. Tier 3 fallback explicitly states "insufficient data for personalized recommendation."
4. **No auto-install**: Guide installation but never install plugins automatically. CTA = user action.
5. **Idempotent**: Running `/onboard` multiple times produces updated results based on latest data. Previous artifacts are overwritten.
6. **Session file access**: Access session JSONL files via Grep pattern matching or targeted Read with offset/limit (for efficiency). Never Read entire JSONL files — they can be very large.
7. **Subagent delegation**: Phase 1 project scanning MUST be delegated to project-scanner subagent (single). Phase 2 session analysis MUST be delegated to session-analyzer subagents (one per project, up to 3 parallel). Main agent handles phases 3, 4, 5.
