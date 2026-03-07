---
name: onboard
description: "Quest-based protocol learning through scenario experience, trial execution, and Socratic quiz."
---

# Onboard Skill

Guide users through epistemic protocol learning via hands-on experience — session-derived scenarios, real protocol trials, and Socratic quizzes — so users understand "when to use what" through doing, not reading.

## When to Use

Invoke this skill when:
- A new user wants to discover which epistemic protocols fit their workflow
- A user wants to experience protocols through guided practice
- Re-onboarding after new protocols are added or workflow changes

Skip when:
- User wants analytical report with evidence and HTML artifact (use `/report`)
- User already knows which protocol to use (direct invocation)
- Quick single-protocol question (answer directly)

## Workflow Overview

```
General:         ENTRY → QUICKSCAN → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
Targeted + scan: ENTRY → SCAN → EXTRACT → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
Targeted + std:  ENTRY → SCENARIO → TRIAL → QUIZ → GUIDE
```

| Phase | Owner | Tool | Purpose |
|-------|-------|------|---------|
| 0. Entry | Main | AskUserQuestion | Path selection: general/targeted |
| 1-2. Quick Scan | Main | Grep, Read | Lightweight pattern detection (General) |
| 1. Scan | Subagent (project-scanner) | Bash, Read, Glob | Project discovery (Targeted + scan) |
| 2. Extract | Subagent (session-analyzer) | Grep, Read | Pattern extraction (Targeted + scan) |
| 3. Map | Main | — | Pattern → Protocol matching (compact inline) |
| 4. Scenario | Main | AskUserQuestion | Session snippet + intervention point |
| 5. Trial | Main | — | Direct entry from "Try it", real protocol execution |
| 5→6 LOOP | Main | AskUserQuestion | Post-trial navigation |
| 6. Quiz | Main | AskUserQuestion | Socratic protocol recognition quiz |
| 7. Guide | Main | AskUserQuestion | Summary + /report CTA |

## Data Sources

Compact mapping for inline use. For full Primary/Secondary/Tertiary tables with detection methods and rationale, refer to `/report` SKILL.md.

| Protocol | Key Patterns |
|----------|-------------|
| Telos `/goal` | Vague first prompts ("improve", "optimize", "ideas for"), `wrong_approach` friction |
| Hermeneia `/clarify` | Same file 3+ edits (same intent), `misunderstood_request` friction |
| Syneidesis `/gap` | Same file 3+ edits (different concerns), `excessive_changes` friction |
| Prothesis `/frame` | Exploration ratio 3:1+ (Read+Grep+Glob vs Edit+Write) |
| Prosoche `/attend` | Bash deploy/push/apply keywords, `wrong_file_edited` friction |
| Katalepsis `/grasp` | Verification keywords in firstPrompt ("explain", "what did you do") |
| Epitrope `/calibrate` | team/delegation keywords in CLAUDE.md, `user_rejected_action` friction |
| Aitesis `/inquire` | `context_loss` friction |
| Analogia `/ground` | Abstract pattern application without domain validation |
| Epharmoge `/contextualize` | Post-execution environment mismatch |

## Phase Execution

### Phase 0: Entry (Path Selection)

Present the protocol catalog as text output FIRST (always), then ask path selection.

**Protocol Catalog** (always rendered as text before asking):

Present the 10 protocols from the Data Sources table as a numbered list with name + one-line description.

**AskUserQuestion #1**:
- Text: "Which path?"
- Options:
  - "General — scan my sessions and recommend"
  - "Targeted — learn a specific protocol (type name in Other)"

**If Targeted + Other contains protocol name**: proceed directly to session source question.

**If Targeted + no protocol specified → AskUserQuestion #2**:
- Text: "Which protocol? (refer to catalog above, type name or number in Other)"
- Options:
  - "Pre-execution — /clarify, /goal, /calibrate, /inquire"
  - "Analysis — /frame, /ground, /gap"
  - "Execution — /attend, /contextualize, /grasp"

**AskUserQuestion #3** (Targeted only, session source):
- Text: "Where should examples come from?"
- Options:
  - "Scan my recent sessions"
  - "Use a specific session (I'll provide the path)"
  - "Use standard examples (no session needed)"

State after Phase 0:
- `path`: general | targeted
- `target_protocol`: (targeted only) selected protocol name
- `session_source`: (targeted only) scan | specific | standard — General path implies inline quick scan

**Skip rule**: If targeted + standard → skip Phases 1-3, jump to Phase 4 with preset scenarios from `references/scenarios.md`.

### Phase 1-2: Quick Scan (General path) — Inline

Lightweight user context collection for the General path. Runs inline with Grep + Read (no subagent delegation). Steps 1 and 2 are independent — run in parallel when possible.

**Step 1: Protocol usage history**

Grep `~/.claude/history.jsonl` for protocol slash commands matching `"display":"/{command}"` pattern (`/frame`, `/gap`, `/clarify`, `/goal`, `/inquire`, `/calibrate`, `/ground`, `/attend`, `/contextualize`, `/grasp`). Count occurrences per command to identify explored vs. unexplored protocols.

If `history.jsonl` does not exist, produce empty usage counts.

**Step 2: User context profile**

Glob `~/.claude/projects/*/sessions-index.json` (exclude directories containing `-worktrees-`). Read the 2-3 most recently modified indexes. For each, parse `entries` and extract the 5 most recent entries' `firstPrompt` and `summary` fields.

Extract user context for scenario personalization:
- Work domains (e.g., API development, infrastructure, data pipeline)
- Typical task types (feature development, debugging, refactoring)
- Project characteristics inferred from session summaries

If no `sessions-index.json` files found, set fallback tier to Tier 3.

**Output for Phase 3**: Protocol usage history (explored/unexplored) + user context profile (work domains, task types). Quick Scan does not detect protocol-matching patterns — that is `/report`'s role. Instead, it provides personalization context so scenarios and quizzes resonate with the user's actual work.

### Phase 1: Scan (Project Discovery) — Subagent Delegated (Targeted + scan only)

Identical to `/report` Phase 1. Call project-scanner subagent with the same steps (project discovery, session index aggregation, secondary source scan). See `/report` SKILL.md for full subagent specification.

**Edge case**: If no projects or session indices found, set fallback tier to Tier 3.

### Phase 2: Extract (Pattern Extraction) — Subagent Delegated (Targeted + scan only)

Identical to `/report` Phase 2. Use the same dual-path extraction (Path A: facets-accelerated, Path B: full subagent). See `/report` SKILL.md for full subagent specification.

### Phase 3: Map (Protocol Matching) — Simplified

Apply the compact mapping table (Data Sources section) to match patterns to protocols.

1. **Targeted + scan**: Match behavioral patterns from Phase 2 against the compact mapping table.
   **General**: Skip pattern matching — protocol selection uses usage history (step 5).
2. Classify (Targeted + scan only): **Strong** (3+ sessions) / **Weak** (1-2 sessions) / **None**
3. Add environmental and friction pattern matches (Targeted + scan only)
4. Determine Fallback Tier:
   - **Tier 1**: 3+ strong patterns → precise matching (Targeted + scan only)
   - **Tier 2**: 1-2 weak patterns → matched + supplementary (Targeted + scan only)
   - **Tier 3**: No patterns / new user → **Starter Trio**: Hermeneia `/clarify`, Telos `/goal`, Syneidesis `/gap`
5. **General path**: Select 2-3 protocols prioritizing unexplored (from Quick Scan usage history), defaulting to Starter Trio. User context profile carries forward to Phase 4 for scenario personalization.
6. **Targeted path**: Filter to target protocol, note related protocols

For detailed mapping logic (Primary/Secondary/Tertiary tables, session diagnostics, anti-pattern detection), refer to `/report` SKILL.md.

### Phase 4: Scenario (Intervention Point)

Present a concrete scenario showing where the protocol would have helped.

**Scenario construction** (3-tier fallback):
- **Tier 1** (session snippet available): Use actual session data from MAP results. **Must include session context summary** — what the session was about, what the user was trying to do — so the scenario is self-contained. Then show the pattern evidence and intervention point.
- **Tier 2** (no session match, but context available): Generate a hypothetical scenario grounded in the user's work context. General path: user context profile (work domains, task types from Quick Scan) personalizes standard scenarios; full project discovery requires Targeted + scan path.
- **Tier 3** (no data): Use preset scenarios from `references/scenarios.md`.

For general path, present scenarios for each of the top 2-3 protocols sequentially.

**Tier 1 scenario format** (session-based):

```
Scenario: /X (Protocol Name)

[Session summary]: In this session you worked on [what user was doing] in [project name].

[Pattern evidence]: [Concrete observation — e.g., same file edited N times, M direction changes]

[Intervention]: If you had called /X early in this session:
- [what the protocol would have done — step 1]
- [step 2]
Expected outcome: [e.g., N corrections reduced to 0-2]
```

**Clarity rule**: Scenarios must present **clear-cut** protocol fits where the mapping is unambiguous. If a session pattern could plausibly map to multiple protocols (e.g., "exploration" could be `/goal` or `/frame`), do NOT use it as a scenario — reserve it for Phase 6 quiz material instead. The scenario phase builds confidence through recognition; the quiz phase builds discrimination through ambiguity.

**Anti-pattern**: Scenarios must be self-contained (session summary + pattern + intervention) with unambiguous protocol fit. Ambiguous patterns belong in Phase 6 quiz.

**Session summary source**: `summary` field or `firstPrompt` text from `sessions-index.json`. Targeted + scan fallback: if neither is available, infer session character from primary tool/file patterns extracted in Phase 2.

Present each scenario as regular text output (Tier 1/2/3 format above). Then call AskUserQuestion for navigation only:

**AskUserQuestion** (per scenario):
- Text: "What would you like to do?"
- Options:
  - "Try it — let me practice this protocol"
  - "Show another example"
  - "Skip to quiz"

### Phase 5: Trial (Protocol Execution)

Guide the user through a real, abbreviated protocol experience. "Try it" selection from Phase 4 already signals intent — enter trial directly without additional confirmation.

**Mini practice prompts** (scoped for 2-3 exchanges): Use the **Trial prompt** field from `references/scenarios.md` for the target protocol. Present the trial guidance as regular text output.

**Execution**: Prompt the user to invoke the actual protocol (e.g., type `/clarify`). The protocol runs in the same session with the mini prompt as context. Trial ends when the invoked protocol reaches its natural termination (convergence or user Esc). After protocol termination, present Post-Trial Insight and LOOP.

For general path, offer trial for the top-recommended protocol first. If user completes it, optionally offer trial for the second recommendation.

**Post-Trial Insight** (presented after trial completion):

After each trial, present a brief insight card sourced from the **Philosophy** field in `references/scenarios.md`. Structure:

```
Protocol Insight: /X (Greek name)

[Core principle — one sentence]
[Workflow position — where this protocol sits and why]
[Game feel — the experiential pattern you just went through]
```

**Post-Trial LOOP**:

After the Post-Trial Insight, call AskUserQuestion:
- Text: "Trial complete! Where to next?"
- Options:
  - "Quiz — test my understanding"
  - "Another scenario — see more examples"
  - "Try a different protocol"
  - "Guide — see my learning summary"

Branch: Quiz → Phase 6, Another scenario → Phase 4, Different protocol → Phase 4 with next MAP protocol (General) or Phase 0 with cached MAP (Targeted), Guide → Phase 7.

### Phase 6: Quiz (Socratic Verification)

Test protocol recognition through situation-based questions. Question format differs by path.

**Question sourcing** (in priority order):
1. **Ambiguous scenarios from Phase 4 filtering** — session patterns that were too ambiguous for scenarios are ideal quiz material (e.g., "exploration" that could be `/goal` or `/frame`)
2. Protocols from TRIAL + MAP results (personalized)
3. Codebase-derived scenarios (if session data available)
4. Preset scenarios from `references/scenarios.md`

#### Targeted Path

**Type 1 — Binary recognition** (2-3 questions):

Call AskUserQuestion for each:
- Text: Present a situation (2-3 sentences), ask "Is this a `/X` situation?"
- Options: "Yes" / "No"
- Mix: 1-2 true positives + 1 true negative (situation that fits a neighbor protocol)
- On "No" answer for a true negative: briefly introduce the correct protocol as a natural distinction point

**Type 2 — Reverse recognition** (1 question):

Call AskUserQuestion:
- Text: Present 3 short scenarios numbered 1-3, ask "Which of these are `/X` situations?"
- Options: "1 and 2" / "2 and 3" / "1 and 3" / "All three"

**Type 3 — Design thinking** (1 question):

Call AskUserQuestion:
- Text: Present a situation, ask "How would you formulate your request to AI to avoid this problem?"
- Options: "Show me a hint" / "Show me a model answer"
- The user's primary input channel is Other (free text). Evaluate based on whether the response demonstrates protocol awareness.

#### General Path

**Type 1 — Situation recognition** (3-4 questions):

Call AskUserQuestion for each:
- Text: Present a situation (2-3 sentences), ask "Which protocol fits?"
- Options: 4 protocol choices (correct answer + 3 plausible distractors)

**Type 2 — Design thinking** (1 question):

Same format as Targeted Path Type 3.

#### Feedback (both paths)

Immediate feedback after each question:
- **Correct**: Reinforce with the core principle + why the distinction matters. "Correct — `/gap` surfaces blind spots at *decision points* (what you haven't considered), while `/attend` classifies *execution risks* (what could go wrong when you act). Both happen before action, but they audit different things: decision quality vs. execution safety."
- **Incorrect**: Explain the distinction through the design axis that separates them. "The key difference is *timing and direction*: `/inquire` catches missing context *before* execution (User→AI: 'what do you need to know?'), while `/contextualize` checks context fit *after* execution (AI→User: 'does this actually fit here?'). Same axis — context fitness — but opposite timing."

**Distinction depth**: Quiz feedback should go beyond "A, not B" to explain the *design dimension* that separates confused pairs. Reference the distractor pairs from Quiz Design section. The goal is that even wrong answers teach — the user leaves understanding *why* two protocols that sound similar serve different purposes.

### Phase 7: Guide (Summary + Next Steps)

Summarize the learning experience, connect it to the broader epistemic workflow, and provide actionable next steps.

1. **Learning summary**:
   - Protocols experienced (trial) and tested (quiz)
   - Quiz accuracy + key distinctions learned
   - Personalized strength: "You naturally recognize [pattern] — `/X` formalizes this"

2. **Epistemic Map** (connect the dots):

   Present the Epistemic Workflow diagram from `references/workflow.md`. Highlight protocols the user experienced with emphasis (e.g., bold or `★`).

3. **Report CTA**: "Run `/report` for a comprehensive analysis with evidence-backed recommendations and an HTML profile."

4. **Installation check**: Verify whether tried/recommended protocols are installed.
   - Check: Glob `~/.claude/plugins/cache/epistemic-protocols/{plugin-name}/*/skills/*/SKILL.md`
   - Installed → "Try `/X` in your next real session"
   - Not installed → `claude plugin install epistemic-protocols/{plugin-name}`
   - If 2+ not installed → also mention `bash scripts/install.sh`

5. **Next protocol suggestion**: Based on quiz results and MAP data, suggest the next protocol to explore — preferring adjacent protocols in the workflow.

6. **Advanced Usage** (bonus tips after main guide):

   Present 3-5 tips from `references/advanced-usage.md` (protocol chaining, multi-protocol sessions, invocation techniques, etc.), prioritizing tips related to protocols from TRIAL and QUIZ. If the user tried `/frame`, highlight the Frame → Calibrate chain. If they quizzed on `/gap` vs `/attend`, show the three-step pre-execution chain (inquire → gap → attend).

7. **Continue exploring** (when MAP results contain unexplored protocols):

   Call AskUserQuestion:
   - Text: "Want to experience another protocol?"
   - Options: "Yes — show me another" / "Done — I have enough"

   If "Yes" → return to Phase 4, using the next recommended protocol from MAP results.

## Quiz Design

**Difficulty progression**: Start with high-contrast pairs (e.g., `/goal` vs `/attend`), progress to subtle distinctions (e.g., `/clarify` vs `/goal`, `/gap` vs `/attend`).

**Distractor selection**: Choose protocols that share surface similarity with the correct answer:
- `/clarify` ↔ `/goal`: both about "unclear starting point" but different deficits (expression vs. existence)
- `/gap` ↔ `/attend`: both about "checking before action" but different targets (decision gaps vs. execution risks)
- `/inquire` ↔ `/contextualize`: both about "context" but different timing (pre vs. post execution)
- `/frame` ↔ `/ground`: both about structuring how to think about a problem, but different operations (lens selection vs. mapping validation)

**Path-specific question counts**:
- **Targeted**: 2-3 binary + 1 reverse + 1 design = 4-5 questions
- **General**: 3-4 situation + 1 design = 4-5 questions

## AskUserQuestion Budget

Target 6-10 calls per session:

| Phase | Calls (General) | Calls (Targeted) | Purpose |
|-------|-----------------|-------------------|---------|
| 0. Entry | 1 | 2-3 | Path + protocol + session source |
| 4. Scenario | 1-3 | 1-2 | Navigation after scenario text |
| 5. Trial | 0 | 0 | Direct entry from "Try it" |
| 5→6 LOOP | 1 | 1 | Post-trial navigation |
| 6. Quiz | 4-5 | 4-5 | MC/design or binary/reverse/design |
| 7. Guide | 0-1 | 0-1 | Optional continue exploring |

## Rules

1. **Experience over analysis**: This skill teaches through doing. Analytical output (HTML reports, pattern evidence tables) belongs in `/report`.
2. **Privacy**: Never transmit session data externally. All analysis runs locally.
3. **Subagent delegation**: General path uses inline Quick Scan (no subagents). Targeted + scan path: Phase 1 delegates to project-scanner, Phase 2 delegates session-analyzer. Maximum 3 parallel subagents.
4. **Trial authenticity**: Trial phase must execute the actual protocol, not simulate it. The user invokes the real slash command.
5. **Immediate feedback**: Quiz answers get instant feedback with distinction explanations. Never batch quiz results.
6. **No auto-install**: Guide installation but never install plugins automatically.
7. **Session file access**: Access session JSONL via Grep or targeted Read with offset/limit. Never Read entire JSONL files.
8. **Preset as safety net**: `references/scenarios.md` ensures every user gets a complete experience regardless of session history availability.
9. **Single session**: The entire onboarding completes in one session. No cross-session state required.
