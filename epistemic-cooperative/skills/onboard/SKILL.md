---
name: onboard
description: "Quick protocol recommendation from recent sessions, or quest-based learning through scenario, trial, and quiz."
---

# Onboard Skill

Start with a quick recommendation based on recent sessions, then optionally continue to guided learning — so users experience value first, learn second.

Invoke directly with `/onboard` when the user wants onboarding or protocol discovery.

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
Quick Proof:    ENTRY → QUICKSCAN → PICK-1 → EVIDENCE → TRIAL → INSIGHT → NEXT
Targeted:       ENTRY → QUICKSCAN → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
Targeted + std: ENTRY → SCENARIO → TRIAL → QUIZ → GUIDE
```

| Phase | Owner | Tool | Purpose |
|-------|-------|------|---------|
| 0. Entry | Main | Gate | Path selection: quick/targeted |
| 1. Quick Scan | Main | Glob, Read | User Context Profile extraction |
| 2a. Pick-1 | Main | — | Quick path: select 1 recommendation |
| 2b. Evidence | Main | — | Quick path: show 1 evidence card |
| 2. Map | Main | — | Targeted path: Profile → Protocol matching |
| 3. Scenario | Main | Gate | Targeted path: context-personalized intervention point |
| 4. Trial | Main | Gate | Real protocol execution (quick: mini trial, targeted: full trial) |
| 4→Q. Insight | Main | — | Quick path: post-trial insight card |
| 4→Q. Next | Main | Gate | Quick path: simplified navigation |
| 4→5 LOOP | Main | Gate | Targeted path: post-trial navigation |
| 5. Quiz | Main | Gate | Targeted path: Socratic protocol recognition quiz |
| 6. Guide | Main | Gate | Targeted path: summary + /report CTA |

## Data Sources

Compact mapping for inline use. For full Primary/Secondary/Tertiary tables with detection methods and rationale, refer to `/report` SKILL.md.

| Protocol | Cluster | When to Use | Key Patterns |
|----------|---------|-------------|-------------|
| Aitesis `/inquire` | Planning | AI is about to answer without enough observable context | External fact queries, verifiable grounding (for prior-session recall → use `/recollect`) |
| Euporia `/elicit` | Planning | Intent articulated but axis-undetermined; decision coordinates implicit in codebase / rules / past sessions | Multi-axis intent without single axis-specific protocol fit; substrate-implicit coordinates surface through cycle-emergent dimensions |
| Prothesis `/frame` | Analysis | Unsure which analytical perspective to use | Exploration ratio 3:1+ (Read+Grep+Glob vs Edit+Write) |
| Analogia `/ground` | Analysis | Checking if abstract advice fits your situation | Abstract pattern application without domain validation |
| Periagoge `/induce` | Analysis | Concrete cases accumulating into an unnamed essence — crystallize the emerging abstraction | 3+ instances with essence intuition but no located abstraction; `/ground` misfit where colimit is forced into substitution |
| Syneidesis `/gap` | Decision | Right before committing, checking for blind spots | Same file 3+ edits (different concerns), `excessive_changes` friction |
| Prosoche `/attend` | Execution | Risk-classified execution — safe actions flow, risky ones gate | Mixed-risk plans (bulk safe work + judgment moments), upstream deficit signals, `wrong_file_edited` friction |
| Epharmoge `/contextualize` | Verification | Output is correct but doesn't fit the accumulated conversation context | Mismatch against session-built constraints (user-aware context accumulation) |
| Horismos `/bound` | Cross-cutting | Deciding what to delegate to AI | Boundary probe, domain classification, BoundaryMap |
| Anamnesis `/recollect` | Cross-cutting | Resolving vague recall of prior sessions or discussions | Cross-session state recovery via narrative recognition (Recognition over Retrieval) |
| Katalepsis `/grasp` | Cross-cutting | Rapid core comprehension via categorical decomposition | Category-based grasp (problem/method/result/limits) for new knowledge, reviews, or AI-completed work |

## Phase Execution

### Phase 0: Entry (Path Selection)

Do NOT present the full protocol catalog upfront. Start with a concise welcome and path selection.

**Gate #1**:
- Text: Path selection prompt
- Options:
  - Quick recommendation (Recommended)
  - Learn a specific protocol
  - Browse all protocols

**If Quick recommendation**: set `path = quick`, proceed to Phase 1.

**If Browse all**: Present the protocol catalog (check installation status via Glob `~/.claude/plugins/cache/epistemic-protocols/*/`, then render the 11 protocols from Data Sources as a numbered list grouped by Cluster with name + "When to Use" + installation badge). After catalog, present:
- Text: Post-catalog path selection
- Options:
  - Quick recommendation
  - Learn a specific protocol (type name in Other)

Then proceed based on selection.

**If Targeted + Other contains protocol name**: proceed directly to session source question.

**If Targeted + no protocol specified**:

Present a condensed catalog as text output: render the Data Sources table grouped by Cluster, each protocol as `/command — When to Use description`.

Then **Gate #2**:
- Text: Protocol selection (type name or number in Other)
- Options:
  - Pre-execution (Planning) — /bound, /inquire, /elicit
  - Analysis/Decision — /frame, /ground, /induce, /gap
  - Execution/Verification/Understanding — /attend, /contextualize, /recollect, /grasp

**Gate #3** (Targeted only, session source):
- Text: Session source selection
- Options:
  - Personalize with my recent sessions
  - Use standard examples (no session needed)

State after Phase 0:
- `path`: quick | targeted
- `target_protocol`: (targeted only) selected protocol name
- `session_source`: (targeted only) scan | standard — Quick path always runs Quick Scan

**Skip rule**: If targeted + standard → skip Phases 1-2, jump to Phase 3 with preset scenarios from `references/scenarios.md`.

### Phase 1: Quick Scan (User Context Profile) — Inline

Build a User Context Profile from recent session metadata. Runs inline with Glob + Read (no subagent delegation). Both Quick and Targeted paths share this phase.

**Step 1: Collect session metadata**

Glob `~/.claude/projects/*/sessions-index.json` (exclude directories containing `-worktrees-`). Read the 2-3 most recently modified indexes. For each, parse `entries` and extract the 5 most recent entries' `firstPrompt` and `summary` fields.

**Step 2: Infer User Context Profile**

From collected metadata, infer:
- **Work domains**: What areas the user works in (e.g., API development, infrastructure, data pipeline)
- **Conversation patterns**: Request clarity level, incremental vs. batch requests, question types (how/why/what)
- **Task types**: Ratio of feature development, debugging, refactoring, documentation

If no `sessions-index.json` files found: Quick path proceeds to Pick-1 with fallback (`/elicit`); Targeted path falls back to Onboarding Pool (`/elicit`, `/gap`, `/frame`).

**Output for Phase 2**: User Context Profile (work domains, conversation patterns, task types). Quick Scan infers user context for protocol matching and scenario personalization — behavioral pattern extraction and session diagnostics belong in `/report`.

### Phase 2a: Pick-1 (Quick Path — Single Recommendation)

**Quick path only.** Select exactly 1 protocol recommendation from the auto-recommend pool.

**Onboarding Pool**: `/elicit` (Euporia), `/gap` (Syneidesis), `/frame` (Prothesis). These three are chosen because users can quickly experience their value. Protocols like `/grasp` are user-initiated by nature and should not be proactively suggested in the first encounter.

**Recommendation rules** (applied to Quick Scan Profile):

| Protocol | Signal patterns | Priority |
|----------|----------------|----------|
| `/elicit` | Vague first prompts ("improve", "optimize", "ideas for", "make it better", "help me plan"); intent articulated but axis-undetermined; substrate-implicit decision coordinates | Highest (also fallback) |
| `/gap` | Multiple revisions on same topic in summary; finalization language ("wrap up", "ready", "finalize", "ship", "merge") | Medium |
| `/frame` | Exploration/comparison language ("approach", "options", "tradeoffs", "compare", "architecture", "which way") | Medium |

**Decision logic**:
1. Score each protocol by signal match count from `firstPrompt` and `summary` fields
2. Select the single strongest match
3. Tie-break: `/elicit` > `/gap` > `/frame`
4. **Fallback**: If no signals detected (no sessions, sparse metadata), recommend `/elicit`

**Output**: Present recommendation as a single sentence. Do NOT present multiple recommendations or a ranked list.

Format: Present as a single sentence stating which protocol is most likely to help right now.

### Phase 2b: Evidence (Quick Path — Evidence Card)

**Quick path only.** Present exactly 1 evidence card explaining why this recommendation was made.

**Evidence generation** (per protocol, referencing Data Sources table):
- Line 1: Cite the specific signal pattern from Quick Scan Profile that matched this protocol's "Key Patterns" column in Data Sources
- Line 2: State the expected benefit, derived from the protocol's "When to Use" column in Data Sources

Fallback (no session data): State that no patterns were detected, then cite the protocol's core value proposition from Data Sources "When to Use."

**Rules**:
- Evidence is maximum 2 lines. Never expand into a report-style analysis.
- Do not show confidence scores or numbers.
- Do not quote session content verbatim.

After presenting evidence, present:
- Text: Trial invitation
- Options:
  - Try it now
  - Learn more about this recommendation
  - See a different recommendation
  - Go to full learning path

Branch: Try it now → Phase 4 (quick trial), Learn more about this recommendation → show Data Sources row for the recommended protocol then re-ask, See a different recommendation → pick next from pool and re-present from Phase 2a, Go to full learning path → set `path = targeted` and go to Phase 0 targeted flow.

### Phase 2: Map (Targeted Path — Protocol Matching)

**Targeted path only.** Apply User Context Profile to match protocols to the user's context.

1. Match Profile against the compact mapping table (Data Sources section). Select 2-3 protocols most relevant to the user's work domains and conversation patterns, defaulting to Onboarding Pool (`/elicit`, `/gap`, `/frame`).
2. **Targeted sub-path**: Filter to target protocol, use Profile for scenario personalization. Note related protocols from the compact mapping table.
3. **Fallback**: If Profile quality is insufficient (no sessions, sparse metadata) → use **Onboarding Pool** (`/elicit`, `/gap`, `/frame`). Proceed immediately without blocking the onboarding flow.

For detailed mapping logic (Primary/Secondary/Tertiary tables, session diagnostics, anti-pattern detection), refer to `/report` SKILL.md.

### Phase 3: Scenario (Targeted Path — Intervention Point)

**Targeted path only.** Present a concrete scenario showing where the protocol would have helped.

**Scenario construction** (2-tier fallback):
- **Tier 1** (User Context Profile available): Generate a hypothetical scenario grounded in the user's work context (domains, task types, conversation patterns from Quick Scan). Personalize standard scenarios from `references/scenarios.md` using Profile data.
- **Tier 2** (no data / Onboarding Pool fallback): Use preset scenarios directly from `references/scenarios.md`.

Present scenarios for each of the top 2-3 protocols sequentially.

**Scenario format**:

```
Scenario: /X (Protocol Name)

[Situation]: [Concrete situation grounded in user's work context — or preset from scenarios.md]

[Intervention]: If you had called /X at this point:
- [what the protocol would have done — step 1]
- [step 2]
Expected outcome: [e.g., reduced rework, clearer direction]
```

**Clarity rule**: Scenarios must present **clear-cut** protocol fits where the mapping is unambiguous. If a situation could plausibly map to multiple protocols (e.g., "exploration" could be `/elicit` or `/frame`), do NOT use it as a scenario — reserve it for Phase 5 quiz material instead. The scenario phase builds confidence through recognition; the quiz phase builds discrimination through ambiguity.

**Anti-pattern**: Scenarios must be self-contained (situation + intervention) with unambiguous protocol fit. Ambiguous patterns belong in Phase 5 quiz.

Present each scenario as regular text output (Tier 1/2 format above). Then present for navigation only:

**Gate** (per scenario):
- Text: Scenario navigation
- Options:
  - Try it — practice this protocol
  - Show another example
  - Skip to quiz

### Phase 4: Trial (Protocol Execution)

Guide the user through a real, abbreviated protocol experience.

#### Quick Path Trial

**Mini practice prompt**: Present a single realistic request (one sentence) that naturally triggers the selected protocol's deficit. When User Context Profile is available, adapt the domain to match the user's work context. Source from `references/scenarios.md` Trial prompt field, or generate from Data Sources context. Follow with gate interaction:
- Text: Trial scenario confirmation (user can also define their own)
- Options:
  - Start with this scenario — call /X
  - Start with my own scenario (type in Other)

**Execution**: The user invokes the actual protocol (e.g., type `/elicit`). The protocol runs in the same session with the mini prompt as context. Trial ends when the invoked protocol reaches its natural termination (convergence or user Esc). After protocol termination, proceed to **Quick Post-Trial** below.

**Quick Post-Trial Insight** (2 lines max):

Generate from the protocol just experienced:
- Line 1: Name the epistemic operation performed (source: protocol's deficit → resolution type, or `references/scenarios.md` Philosophy field)
- Line 2: Connect to a concrete workflow benefit

**Epistemic Ink Tip** (1 line, after Post-Trial Insight): "Tip: Run `/config` to enable Epistemic Ink — an Output Style that enhances protocol interactions with structured formatting."

**Quick Post-Trial Navigation**:

Present via gate interaction:
- Text: Post-trial navigation
- Options:
  - That's enough for today
  - Try a different protocol
  - Continue to full onboarding

Branch: That's enough for today → end session with brief closing (include text mention: For deeper analysis, try `/report`.), Try a different protocol → check pool exhaustion: if unrecommended protocols remain in Onboarding Pool, pick next and restart from Phase 2a; if pool exhausted (all 3 recommended in session), present You've experienced all core recommendations and offer Targeted transition, Continue to full onboarding → set `path = targeted` and go to Phase 2 MAP with Quick Scan results.

#### Targeted Path Trial

"Try it" selection from Phase 3 already signals intent — enter trial directly without additional confirmation.

**Mini practice prompts** (scoped for 2-3 exchanges): Use the **Trial prompt** field from `references/scenarios.md` for the target protocol. Present the trial guidance as regular text output.

**Execution**: Prompt the user to invoke the actual protocol (e.g., type `/inquire`). The protocol runs in the same session with the mini prompt as context. Trial ends when the invoked protocol reaches its natural termination (convergence or user Esc). After protocol termination, present Post-Trial Insight and LOOP.

Offer trial for the top-recommended protocol first. If user completes it, optionally offer trial for the second recommendation.

**Post-Trial Insight** (presented after trial completion):

After each trial, present a brief insight card sourced from the **Philosophy** field in `references/scenarios.md`. Structure:

```
Protocol Insight: /X (Greek name)

[Core principle — one sentence]
[Workflow position — where this protocol sits and why]
[Game feel — the experiential pattern you just went through]
```

**Post-Trial LOOP**:

After the Post-Trial Insight, present:
- Text: Post-trial navigation
- Options:
  - Quiz — test my understanding
  - Another scenario — see more examples
  - Try a different protocol
  - Guide — see my learning summary

Branch: Quiz → Phase 5, Another scenario → Phase 3, Different protocol → Phase 3 with next MAP protocol or Phase 0 with cached MAP, Guide → Phase 6.

### Phase 5: Quiz (Socratic Verification)

Test protocol recognition through situation-based questions. Question format differs by path.

**Question sourcing** (in priority order):
1. **Ambiguous scenarios from Phase 3 filtering** — situations that were too ambiguous for scenarios are ideal quiz material (e.g., "exploration" that could be `/elicit` or `/frame`)
2. Protocols from TRIAL + MAP results (personalized)
3. Profile-personalized variants of preset scenarios (if User Context Profile available)
4. Preset scenarios from `references/scenarios.md`

#### Targeted Path

**Type 1 — Binary recognition** (2-3 questions):

Present via gate interaction for each:
- Text: Present a situation (2-3 sentences), ask "Is this a `/X` situation?"
- Options: "Yes" / "No"
- Mix: 1-2 true positives + 1 true negative (situation that fits a neighbor protocol)
- On "No" answer for a true negative: briefly introduce the correct protocol as a natural distinction point

**Type 2 — Reverse recognition** (1 question):

Present via gate interaction:
- Text: Present 3 short scenarios numbered 1-3, ask "Which of these are `/X` situations?"
- Options: "1 and 2" / "2 and 3" / "1 and 3" / "All three"

**Type 3 — Design thinking** (1 question):

Present via gate interaction:
- Text: Present a situation, ask "How would you formulate your request to AI to avoid this problem?"
- Options: "Show me a hint" / "Show me a model answer"
- The user's primary input channel is Other (free text). Evaluate based on whether the response demonstrates protocol awareness.

#### Multi-Protocol Path

**Type 1 — Situation recognition** (3-4 questions):

Present via gate interaction for each:
- Text: Present a situation (2-3 sentences), ask "Which protocol fits?"
- Options: 4 protocol choices (correct answer + 3 plausible distractors)

**Type 2 — Design thinking** (1 question):

Same format as Targeted Path Type 3.

#### Feedback (both paths)

Immediate feedback after each question:
- **Correct**: Reinforce with the core principle + why the distinction matters. "Correct — `/gap` surfaces blind spots at *decision points* (what you haven't considered), while `/attend` checks *execution readiness* (Phase -1 upstream scan) and gates *execution risks* (what could go wrong when you act). `/gap` audits before action (decision quality), `/attend` ensures readiness + gates during action (execution safety)."
- **Incorrect** (reasoning inquiry → targeted correction):
  1. **Reasoning inquiry**: Present via gate interaction 2-3 reasoning hypotheses inferred from the user's wrong answer (context-specific, not templates). Do not reveal the correct answer. "Other" always available.
  2. **Targeted correction**: Using the user's stated reasoning, explain the distinction through the design axis that separates the confused pair. Directly address the reasoning — e.g., "You mentioned timing — that's the right axis. The key difference is *direction*: `/inquire` catches missing context *before* execution (User→AI), while `/contextualize` checks context fit *after* (AI→User)."
  3. **Resume**: Proceed to next question.

  **Reasoning inquiry cap**: Apply reasoning inquiry for the first 2 incorrect answers per quiz session. Subsequent incorrect answers receive direct targeted correction (step 2 only) without the reasoning inquiry step.

**Distinction depth**: Quiz feedback should go beyond "A, not B" to explain the *design dimension* that separates confused pairs. Reference the distractor pairs from Quiz Design section. The goal is that even wrong answers teach — the user leaves understanding *why* two protocols that sound similar serve different purposes.

### Phase 6: Guide (Summary + Next Steps)

Summarize the learning experience, connect it to the broader epistemic workflow, and provide actionable next steps.

1. **Learning summary**:
   - Protocols experienced (trial) and tested (quiz)
   - Quiz accuracy + key distinctions learned
   - Personalized strength: "You naturally recognize [pattern] — `/X` formalizes this"

2. **Epistemic Map** (connect the dots):

   Present the Epistemic Concern Clusters from `references/workflow.md`. Highlight protocols the user experienced with emphasis (e.g., bold or `★`).

3. **Report CTA**: "Run `/report` for a comprehensive analysis with evidence-backed recommendations and an HTML profile."

4. **Next protocol suggestion**: Based on quiz results and MAP data, suggest the next protocol to explore — preferring related protocols in the same cluster.

5. **Advanced Usage** (bonus tips after main guide):

   Present 3-5 tips from `references/advanced-usage.md` (protocol chaining, multi-protocol sessions, invocation techniques, etc.), prioritizing tips related to protocols from TRIAL and QUIZ. If they quizzed on `/gap` vs `/attend`, show the three-step chain: context → decision audit → risk-aware execution (inquire → gap → attend).

6. **Continue exploring** (when MAP results contain unexplored protocols):

   Present via gate interaction:
   - Text: "Want to experience another protocol?"
   - Options: "Yes — show me another" / "Done — I have enough"

   If "Yes" → return to Phase 3, using the next recommended protocol from MAP results.

## Quiz Design

**Difficulty progression**: Start with high-contrast pairs (e.g., `/elicit` vs `/attend`), progress to subtle distinctions (e.g., `/elicit` vs `/inquire`, `/gap` vs `/attend`).

**Distractor selection**: Choose protocols that share surface similarity with the correct answer:
- `/elicit` ↔ `/gap`: both surface "something wrong" but different targets — `/elicit` reverse-traces decision coordinates from substrate before action (Planning: axis-undetermined intent), `/gap` audits blind spots at a decision point (Decision: "Am I overlooking something?")
- `/elicit` ↔ `/inquire`: both about "unclear starting point" but different layers — Aitesis asks the user for facts (information layer), Euporia surfaces coordinate values from substrate (coordinate-explication layer)
- `/gap` ↔ `/attend`: both about risk awareness but `/gap` audits decision quality before committing, `/attend` checks execution readiness (Phase -1 upstream scan) and gates execution-time risks
- `/inquire` ↔ `/contextualize`: both about "context" but different timing (pre vs. post execution)
- `/frame` ↔ `/ground`: both about structuring how to think about a problem, but different operations (lens selection vs. mapping validation)
- `/bound` ↔ `/inquire`: both pre-execution and AI-directed, but different targets (ownership boundaries vs. missing context)

**Path-specific question counts**:
- **Targeted**: 2-3 binary + 1 reverse + 1 design = 4-5 questions
- **Multi-protocol**: 3-4 situation + 1 design = 4-5 questions

## Gate Interaction Budget

Quick path targets 3-4 calls. Targeted path targets 6-12 calls.

| Phase | Calls (Quick) | Calls (Targeted) | Purpose |
|-------|---------------|-------------------|---------|
| 0. Entry | 1-2 | 2-3 | Path + protocol + session source |
| 2b. Evidence | 1 | — | Trial confirmation |
| 3. Scenario | — | 1-2 | Navigation after scenario text |
| 4. Trial | 1 | 0 | Quick: situation choice. Targeted: direct entry |
| 4→Q. Next | 1 | — | Quick: post-trial navigation |
| 4→5 LOOP | — | 1 | Targeted: post-trial navigation |
| 5. Quiz | — | 4-7 | MC/design or binary/reverse/design + reasoning inquiry |
| 6. Guide | — | 0-1 | Optional continue exploring |

## Rules

1. **Value before learning**: Quick path proves value in under 3 minutes. Learning (scenarios, quizzes) is available but not the default entry.
2. **One at a time**: Quick path shows 1 recommendation, 1 evidence card, 1 trial. Never present multiple recommendations or ranked lists.
3. **Onboarding Pool**: `/elicit`, `/gap`, `/frame` are the unified recommendation set for both Quick path auto-recommend and Targeted path fallback. User-initiated protocols (`/grasp`, `/attend`) and specialized protocols (`/contextualize`) are excluded. When pool is exhausted in Quick path, transition to Targeted path.
4. **Experience over analysis**: This skill teaches through doing. Analytical output (HTML reports, pattern evidence tables) belongs in `/report`.
5. **Privacy**: Never transmit session data externally. All analysis runs locally.
6. **No subagent delegation**: Both Quick and Targeted paths use inline Quick Scan. Deep pattern extraction belongs in `/report`.
7. **Trial authenticity**: Trial phase must execute the actual protocol, not simulate it. The user invokes the real slash command.
8. **Immediate feedback**: Quiz answers get instant feedback. For incorrect answers, reasoning inquiry precedes correction (per Feedback section). Never batch quiz results.
9. **No auto-install**: Guide installation but never install plugins automatically.
10. **Session index access**: Access `sessions-index.json` via Glob + Read. Parse `entries` for `firstPrompt` and `summary` fields only. Never Read entire session JSONL files.
11. **Preset as safety net**: `references/scenarios.md` ensures every user gets a complete experience regardless of session history availability.
12. **Single session**: The entire onboarding completes in one session. No cross-session state required.

## Acknowledgments

- [@zzsza](https://github.com/zzsza) — Quiz-based participatory UX design contribution
