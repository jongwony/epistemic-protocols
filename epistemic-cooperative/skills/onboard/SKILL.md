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
ENTRY → SCAN → EXTRACT → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
```

| Phase | Owner | Tool | Purpose |
|-------|-------|------|---------|
| 0. Entry | Main | AskUserQuestion | Path selection: general/targeted |
| 1. Scan | Subagent (project-scanner) | Bash, Read, Glob | Project discovery (shared with /report) |
| 2. Extract | Subagent (session-analyzer) | Grep, Read | Pattern extraction (shared with /report) |
| 3. Map | Main | — | Pattern → Protocol matching (compact inline) |
| 4. Scenario | Main | AskUserQuestion | Session snippet + intervention point |
| 5. Trial | Main | AskUserQuestion | Real protocol execution via mini prompt |
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

Call AskUserQuestion to determine the onboarding path.

**AskUserQuestion #1**:
- Text: Present three paths with brief descriptions
- Options:
  - "General — scan my sessions and recommend protocols to learn"
  - "Targeted — I want to learn a specific protocol"
  - "Browse — show me what's available first"

**If "Browse"**: List all 10 protocols with one-line descriptions (the table from Data Sources above). Then re-ask #1 with General/Targeted only.

**If "Targeted" → AskUserQuestion #2**:
- Text: List 10 protocols numbered, then ask about session source
- Options:
  - "Scan my recent sessions for examples"
  - "Use a specific session (I'll provide the path)"
  - "Use standard examples (no session needed)"

State after Phase 0:
- `path`: general | targeted
- `target_protocol`: (targeted only) selected protocol name
- `session_source`: scan | specific | standard

**Skip rule**: If targeted + standard → skip Phases 1-3, jump to Phase 4 with preset scenarios from `references/scenarios.md`.

### Phase 1: Scan (Project Discovery) — Subagent Delegated

Identical to `/report` Phase 1. Call project-scanner subagent with the same steps (project discovery, session index aggregation, secondary source scan). See `/report` SKILL.md for full subagent specification.

**Edge case**: If no projects or session indices found, set fallback tier to Tier 3.

### Phase 2: Extract (Pattern Extraction) — Dual-Path Subagent Delegated

Identical to `/report` Phase 2. Use the same dual-path extraction (Path A: facets-accelerated, Path B: full subagent). See `/report` SKILL.md for full subagent specification.

### Phase 3: Map (Protocol Matching) — Simplified

Apply the compact mapping table (Data Sources section) to match patterns to protocols.

1. Match behavioral patterns from Phase 2 against the compact mapping table
2. Classify: **Strong** (3+ sessions) / **Weak** (1-2 sessions) / **None**
3. Add environmental and friction pattern matches
4. Determine Fallback Tier:
   - **Tier 1**: 3+ strong patterns → precise matching
   - **Tier 2**: 1-2 weak patterns → matched + supplementary
   - **Tier 3**: No patterns / new user → **Starter Trio**: Hermeneia `/clarify`, Telos `/goal`, Syneidesis `/gap`
5. **General path**: Select top 2-3 protocols for scenario and trial
6. **Targeted path**: Filter to target protocol, note related protocols

For detailed mapping logic (Primary/Secondary/Tertiary tables, session diagnostics, anti-pattern detection), refer to `/report` SKILL.md.

### Phase 4: Scenario (Intervention Point)

Present a concrete scenario showing where the protocol would have helped.

**Scenario construction** (3-tier fallback):
- **Tier 1** (session snippet available): Use actual session data from MAP results. **Must include session context summary** — what the session was about, what the user was trying to do — so the scenario is self-contained. Then show the pattern evidence and intervention point.
- **Tier 2** (no session match, but codebase available): Generate a hypothetical scenario grounded in the user's actual project context (languages, frameworks, file structure from Phase 1).
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

**Anti-pattern**: Do not reference session IDs or list pattern counts without context. If the user has to wonder "what session was that?", engagement drops. Scenarios must be **self-contained**: session summary first, then pattern, then intervention.

**Session summary source**: `summary` field or `firstPrompt` text from `sessions-index.json`. If neither is available, infer session character from primary tool/file patterns extracted in Phase 2.

**AskUserQuestion #3** (per scenario):
- Text: Present the scenario (with session context) and intervention point
- Options:
  - "Try it — let me practice this protocol"
  - "Show another example"
  - "Skip to quiz"

### Phase 5: Trial (Protocol Execution)

Guide the user through a real, abbreviated protocol experience.

**AskUserQuestion #4**:
- Text: Present a mini practice prompt tailored to the protocol
- Options:
  - "Start trial"
  - "Skip trial"

**Mini practice prompts** (scoped for 2-3 exchanges):
- `/clarify`: "Let's practice: tell me 'Fix the auth flow' and I'll show how /clarify decomposes it"
- `/goal`: "Let's practice: say 'Improve the dashboard' and I'll show how /goal co-constructs success criteria"
- `/gap`: "Let's practice: say 'I'm ready to merge this PR' and I'll show how /gap surfaces blind spots"
- `/frame`: "Let's practice: say 'Should we use microservices?' and I'll show how /frame recommends analytical lenses"
- `/inquire`: "Let's practice: say 'Deploy the staging environment' and I'll show how /inquire catches missing context"
- `/calibrate`: "Let's practice: say 'Handle this refactoring however you think is best' and I'll show how /calibrate sets delegation boundaries"
- `/ground`: "Let's practice: say 'Apply the strangler fig pattern to our codebase' and I'll show how /ground validates the mapping"
- `/attend`: "Let's practice: say 'Run the migration script' and I'll show how /attend classifies execution risks"
- `/contextualize`: "Let's practice: say 'I just deployed the new component' and I'll show how /contextualize checks environment fit"
- `/grasp`: "Let's practice: I'll describe a complex refactoring, and /grasp will verify your understanding"

**Execution**: When user starts trial, prompt them to invoke the actual protocol (e.g., type `/clarify`). The protocol runs in the same session with the mini prompt as context. After 2-3 exchanges or protocol completion, present: "Trial complete. Type 'continue onboarding' to resume."

For general path, offer trial for the top-recommended protocol first. If user completes it, optionally offer trial for the second recommendation.

**Post-Trial Insight** (presented after trial completion, before resuming onboard flow):

After each trial, present a brief insight card sourced from the **Philosophy** field in `references/scenarios.md`. Structure:

```
Protocol Insight: /X (Greek name)

[Core principle — one sentence]
[Workflow position — where this protocol sits and why]
[Game feel — the experiential pattern you just went through]
```

Example for `/contextualize`:
```
Protocol Insight: /contextualize (ἐφαρμογή — application, fitting)

Core: Applicability over Correctness — correct code that doesn't fit your context is not useful code.
Position: Post-execution — after work is done, check if it fits where it's going.
Game feel: "Done! ...wait, does this actually fit here?" → mismatch detection → evidence → adapt or dismiss.
```

This bridges the gap between "I used it" and "I understand why it's designed this way." The insight arrives at the moment of peak receptivity — immediately after hands-on experience.

### Phase 6: Quiz (Socratic Verification)

Test protocol recognition through situation-based questions.

**Question sourcing** (in priority order):
1. Protocols from TRIAL + MAP results (personalized)
2. Codebase-derived scenarios (if session data available)
3. Preset scenarios from `references/scenarios.md`

**Question type 1 — Situation recognition** (3-5 questions):

Call AskUserQuestion for each:
- Text: Present a situation (2-3 sentences), ask "Which protocol fits?"
- Options: 4 protocol choices (correct answer + 3 plausible distractors)

**Question type 2 — Design thinking** (1-2 questions):

Call AskUserQuestion:
- Text: Present a situation, ask "How would you formulate your request to AI to avoid this problem?"
- Options:
  - "Show me a hint"
  - "I'll type my answer"
  - "Skip this question"

**Feedback** (immediate, after each question):
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

   Present a simplified workflow showing where the experienced protocols sit:

   ```
   [Intent] → [Goal] → [Delegation] → [Context] → [Perspective] → [Mapping] → [Decision] → [Execution] → [Application] → [Comprehension]
      ↑          ↑          ↑              ↑            ↑              ↑            ↑             ↑              ↑               ↑
   /clarify    /goal    /calibrate     /inquire      /frame        /ground        /gap        /attend     /contextualize     /grasp
   ```

   Highlight the protocols the user experienced with emphasis (e.g., bold or `★`), and briefly explain the flow:
   - "You tried `/clarify` (Intent) — this is the starting point. Before goals, context, or perspectives matter, intent must be clear."
   - "You quizzed on `/gap` (Decision) and `/attend` (Execution) — these are neighbors that sound similar but audit different things."

   This gives the user a mental map: "I'm not learning random tools — each protocol has a specific place in a coherent workflow."

3. **Report CTA**: "Run `/report` for a comprehensive analysis with evidence-backed recommendations and an HTML profile."

4. **Installation check**: Verify whether tried/recommended protocols are installed.
   - Check: Glob `~/.claude/plugins/cache/epistemic-protocols/{plugin-name}/*/skills/*/SKILL.md`
   - Installed → "Try `/X` in your next real session"
   - Not installed → `claude plugin install epistemic-protocols/{plugin-name}`
   - If 2+ not installed → also mention `bash scripts/install.sh`

5. **Next protocol suggestion**: Based on quiz results and MAP data, suggest the next protocol to explore — preferring adjacent protocols in the workflow. "You experienced `/clarify` (Intent). The natural next step is `/goal` (Goal) — defining what success looks like. Run `/onboard` again and choose it when ready."

## Quiz Design

**Difficulty progression**: Start with high-contrast pairs (e.g., `/goal` vs `/attend`), progress to subtle distinctions (e.g., `/clarify` vs `/goal`, `/gap` vs `/attend`).

**Distractor selection**: Choose protocols that share surface similarity with the correct answer:
- `/clarify` ↔ `/goal`: both about "unclear starting point" but different deficits (expression vs. existence)
- `/gap` ↔ `/attend`: both about "checking before action" but different targets (decision gaps vs. execution risks)
- `/inquire` ↔ `/contextualize`: both about "context" but different timing (pre vs. post execution)
- `/frame` ↔ `/ground`: both about structuring how to think about a problem, but different operations (lens selection vs. mapping validation)

**Question count**: 3-5 total. General path: mix from multiple protocols. Targeted path: focus on target + most-confused neighbor.

## AskUserQuestion Budget

Target 6-10 calls per session:

| Phase | Calls | Purpose |
|-------|-------|---------|
| 0. Entry | 1-2 | Path + target selection |
| 4. Scenario | 1 per protocol (2-3 max) | Scenario confirmation |
| 5. Trial | 1 | Trial start/skip |
| 6. Quiz | 3-5 | Quiz questions |
| 7. Guide | 0-1 | Optional next step |

## Rules

1. **Experience over analysis**: This skill teaches through doing. Analytical output (HTML reports, pattern evidence tables) belongs in `/report`.
2. **Privacy**: Never transmit session data externally. All analysis runs locally.
3. **Subagent delegation**: Phase 1 delegates to project-scanner (single). Phase 2: Path A delegates session-analyzer in targeted mode, Path B in full mode. Maximum 3 parallel subagents.
4. **Trial authenticity**: Trial phase must execute the actual protocol, not simulate it. The user invokes the real slash command.
5. **Immediate feedback**: Quiz answers get instant feedback with distinction explanations. Never batch quiz results.
6. **No auto-install**: Guide installation but never install plugins automatically.
7. **Session file access**: Access session JSONL via Grep or targeted Read with offset/limit. Never Read entire JSONL files.
8. **Preset as safety net**: `references/scenarios.md` ensures every user gets a complete experience regardless of session history availability.
9. **Single session**: The entire onboarding completes in one session. No cross-session state required.
