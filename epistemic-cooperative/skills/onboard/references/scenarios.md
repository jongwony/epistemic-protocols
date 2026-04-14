# Preset Scenarios

Fallback scenarios for `/onboard` SCENARIO and QUIZ phases when session data is insufficient (Tier 2). Each protocol has a realistic situation, intervention description, trial prompt, and two quiz questions.

Design note: scenarios anchor on AI-collaboration moments (meta-primary) with familiar everyday-domain fallbacks. Protocol fits are unambiguous; ambiguous cases belong in quiz material.

## Hermeneia `/clarify`

**Situation**: You ask Claude "summarize this article" — Claude returns a dense technical brief when you wanted a casual 2-sentence version for a friend. "Summarize" meant three different things to you (short, core-only, beginner-level) and Claude picked the wrong one.

**Intervention**: `/clarify` decomposes "summarize" into concrete axes (length, audience, depth) and surfaces the gap between what you said and what you meant before Claude generates anything.

**Trial prompt**: "Let's practice: say 'Summarize this article' and I'll show how /clarify decomposes your intent"

**Quiz Q (situation)**: You ask Claude to "make this email better" and it adds formal salutations, restructures paragraphs, and lengthens each sentence — but you just wanted to shorten it for mobile readers.
- A) Telos `/goal` — B) Hermeneia `/clarify` — C) Syneidesis `/gap` — D) Prothesis `/frame`
- Answer: B

**Quiz Q (design)**: You want to ask Claude "clean up this text" but worry it might over-edit. How would you use a protocol to pin down what "clean up" means for you?
- Hint: The issue isn't missing information — your expression doesn't capture what you actually mean.

**Philosophy**: ἑρμηνεία (interpretation) — Aristotle's treatise on language and meaning. Core principle: **Expression ≠ Intent**. Your words are a lossy compression of your intent; `/clarify` decompresses them before execution begins. Workflow position: Planning cluster — intent must be clear before goals, context, or perspectives matter. Game feel: "I said X, but I meant Y" → decompose → align → proceed with shared understanding.

## Telos `/goal`

**Situation**: You open a session with "help me plan a weekend trip to Busan" — no budget, no duration, no must-see sights, no bar for "what makes this trip successful." Claude asks what you want, you say "just a nice time," and three iterations later the schedule misses everything you quietly cared about.

**Intervention**: `/goal` co-constructs a GoalContract by proposing concrete success criteria, scope boundaries, and trade-off priorities — transforming "a nice time" into "2 days / 2 nights, under 300k KRW, must include a beach and one local restaurant, no early mornings."

**Trial prompt**: "Let's practice: say 'Help me plan a weekend trip to Busan' and I'll show how /goal co-constructs success criteria"

**Quiz Q (situation)**: A friend says "help me start exercising." No target, no duration, no starting point defined. You're about to suggest a full program.
- A) Aitesis `/inquire` — B) Hermeneia `/clarify` — C) Telos `/goal` — D) Prothesis `/frame`
- Answer: C

**Quiz Q (design)**: You want Claude to "help me prepare for the interview" but haven't defined what "prepared" looks like. How would you establish success criteria before the work starts?
- Hint: The problem isn't expression — the end state itself is not yet defined.

**Philosophy**: τέλος (end, purpose) — Aristotle's final cause. Core principle: **Co-construction over Extraction**. The goal doesn't pre-exist in the user's head waiting to be extracted — it's built through dialogue. Workflow position: Planning cluster — once intent is clear, define what success looks like. Game feel: "I know I want something but can't define it" → AI proposes concrete criteria → user shapes → GoalContract emerges.

## Horismos `/bound`

**Situation**: You ask Claude to edit a long email draft. You're fine with typo fixes and smoother phrasing, but paragraph reorganization and tone changes feel like decisions you want to own. Right now there's no explicit boundary — Claude might change anything.

**Intervention**: `/bound` classifies each edit domain via gate interaction: "Typos — AI autonomous? Phrasing — AI proposes, you pick? Paragraph structure — you decide, AI waits?" The resulting BoundaryMap tells Claude what it may change silently, what to propose, and what to leave alone.

**Trial prompt**: "Let's practice: say 'Edit this email for me' and I'll show how /bound assigns ownership per edit type"

**Quiz Q (situation)**: You ask Claude to "tidy up my resume" — it rewrites your summary, swaps out job titles, and restructures bullet points. You only wanted typo fixes and better wording; the content decisions are yours.
- A) Hermeneia `/clarify` — B) Aitesis `/inquire` — C) Horismos `/bound` — D) Telos `/goal`
- Answer: C

**Quiz Q (design)**: You're about to delegate a multi-step task with some sensitive decisions. How would you make explicit which steps are AI's call vs yours?
- Hint: The problem isn't unclear intent or missing context — it's undefined ownership of decisions.

**Philosophy**: ὁρισμός (definition, boundary) — from horizein, "to bound." Core principle: **Definition over Assumption**. Without explicit boundary definition, AI either over-assumes autonomy (causing surprise) or under-assumes (causing friction). Workflow position: cross-cutting — the BoundaryMap tells all downstream protocols what the human controls vs. what AI controls. Game feel: "Who decides what here?" → domain-by-domain classification → BoundaryMap emerges → shared understanding of ownership.

## Anamnesis `/recollect`

**Situation**: You open a new session wanting to continue yesterday's conversation with Claude — something about a recommendation you liked, or a decision you made together — but you can't remember the exact topic or what was concluded. Re-explaining would lose the original framing.

**Intervention**: `/recollect` scans session recall indices for narrative candidates matching your vague cue, then presents 2-3 story-form candidates (what was asked → where the talk went → what was decided) for you to recognize — resolving ambiguous recall into concrete prior context before current work proceeds.

**Trial prompt**: "Let's practice: say 'Pick up where we left off yesterday' and I'll show how /recollect surfaces narrative candidates"

**Quiz Q (situation)**: You start with "what was that book Claude recommended last time?" — you remember the conversation happened but not the title, genre, or why it stood out.
- A) Hermeneia `/clarify` — B) Aitesis `/inquire` — C) Anamnesis `/recollect` — D) Katalepsis `/grasp`
- Answer: C

**Quiz Q (design)**: You reference "the direction we agreed on" from a past session but have no specific pointer. How would you surface the right prior context for recognition — rather than asking Claude to guess?
- Hint: The problem isn't missing external facts — it's that prior session context is vague and needs resolution into something recognizable. Cross-session state recovery lives here, not in `/inquire`.

**Philosophy**: ἀνάμνησις (recollection) — Plato's theory of knowledge as recollection of what the soul already knew. Core principle: **Recognition over Retrieval**. Vague cues become concrete when candidates are surfaced as narratives for user recognition, not retrieved by keyword. Workflow position: cross-cutting — resolves prior context before any cluster proceeds. Game feel: "Something we talked about before..." → narrative candidates surface → you recognize the right one → grounded continuation.

## Syneidesis `/gap`

**Situation**: Claude gives you a neat checklist for "things to bring on the Busan trip." The list looks complete — clothes, toiletries, charger. You're about to close the tab, but you haven't thought about: medication, local transit card top-up, reservation confirmations saved offline, or weather contingencies.

**Intervention**: `/gap` audits the decision point by surfacing procedural gaps (missed steps), consideration gaps (unexamined dimensions), assumption gaps (implicit beliefs), and alternative gaps (unexplored options) — before you commit to the plan.

**Trial prompt**: "Let's practice: say 'Here's my trip checklist, ready to go' and I'll show how /gap surfaces blind spots"

**Quiz Q (situation)**: You're about to accept a job offer. The salary is good, the role sounds interesting, you're ready to reply. Something feels off but you can't name it.
- A) Prosoche `/attend` — B) Syneidesis `/gap` — C) Epharmoge `/contextualize` — D) Aitesis `/inquire`
- Answer: B

**Quiz Q (design)**: You've picked option B out of three. Before committing, how would you check if you're overlooking something the decision logic didn't cover?
- Hint: The issue isn't execution risk — it's unnoticed blind spots at the decision point.

**Philosophy**: συνείδησις (shared knowing, conscience) — the Stoic inner witness. Core principle: **Surfacing over Deciding**. AI illuminates what you haven't considered; you judge whether it matters. Workflow position: Decision cluster — after perspectives are set, before committing. Game feel: "About to commit? Let me check your blind spots" → 4 gap types surface → you address or dismiss → decide with awareness.

## Prothesis `/frame`

**Situation**: You drafted a tough email to send — asking your manager for time off during a busy season. You think it reads fine, but you're not sure how it lands. "Fine to me" doesn't tell you how a tired manager or a peer in HR might read it.

**Intervention**: `/frame` recommends analytical perspectives (e.g., "manager under deadline pressure," "HR fairness lens," "peer comparing workloads") and can assemble a multi-perspective review so you see the email from each angle before hitting send.

**Trial prompt**: "Let's practice: say 'Review this email draft for me' and I'll show how /frame recommends audience perspectives"

**Quiz Q (situation)**: You're writing a group chat message announcing a decision. It seems clear to you, but the chat has coworkers, close friends, and your partner. Some will read it as casual, some as formal. You're unsure which lens to evaluate through.
- A) Telos `/goal` — B) Prothesis `/frame` — C) Syneidesis `/gap` — D) Aitesis `/inquire`
- Answer: B

**Quiz Q (design)**: You're about to publish a blog post but only checked it from your own reading angle. How would you structure the review to surface how different readers receive it?
- Hint: The problem isn't missing information — it's not knowing which analytical lens or audience perspective to apply.

**Philosophy**: πρόθεσις (a placing before, setting forth) — the act of laying out options for examination. Core principle: **Recognition over Recall**. You don't need to invent frameworks from scratch — you select from curated lenses. Workflow position: Analysis cluster — now choose how to look at the problem. Game feel: "Too many valid angles" → AI recommends lenses → you pick → structured multi-perspective analysis.

## Aitesis `/inquire`

**Situation**: You ask Claude "is the National Museum open next Friday afternoon?" — an externally verifiable fact you don't currently hold. Claude could guess from general knowledge, but the grounded answer requires checking current hours and holiday calendars.

**Intervention**: `/inquire` detects context insufficiency before giving an answer, prioritizes information-gain by which check would most change the response, and grounds the answer in observable external facts (public schedules, documented pages) rather than silent assumption. A null result ("I cannot verify without the official page") is a valid outcome — silent guessing is not.

**Trial prompt**: "Let's practice: say 'Is the National Museum open next Friday afternoon?' and I'll show how /inquire grounds the answer in observable facts"

**Quiz Q (situation)**: You ask Claude "can my MacBook Air run this 70B model locally?" — the answer depends on your exact spec and the model's published requirements. Claude starts recommending settings without confirming either.
- A) Hermeneia `/clarify` — B) Aitesis `/inquire` — C) Telos `/goal` — D) Prosoche `/attend`
- Answer: B

**Quiz Q (design)**: You want to ask "will flight KE123 be on time tomorrow?" — a verifiable external fact. How would you make sure Claude checks rather than guesses?
- Hint: Your intent is clear and goal is defined — but the answer needs externally observable facts, not general reasoning. For *recalling what you discussed in a prior session*, use `/recollect` instead.

**Philosophy**: αἴτησις (a requesting, inquiry) — the act of asking what is needed. Core principle: **Evidence over Inference over Detection**. AI infers what context is missing and gathers observable evidence rather than making silent assumptions; null results are valid. Workflow position: Planning cluster — ensure sufficient context before acting. Game feel: "About to answer? Wait — what don't I know, and how can I check it?" → AI surfaces ranked uncertainties + observable checks → grounded answer or explicit null result.

## Analogia `/ground`

**Situation**: A friend tells you their morning routine — 5am wake, cold shower, 10k run, no coffee. They swear by it. You're tempted to copy it, but you don't yet know whether your sleep schedule, fitness baseline, and commute map cleanly onto theirs or break the pattern.

**Intervention**: `/ground` validates the structural mapping between their routine and yours by decomposing the analogy (sleep → 5am, recovery → cold shower, cardio → 10k run, stimulant-free → no coffee), checking each correspondence against your actual baseline, and flagging which pieces transfer vs which fail.

**Trial prompt**: "Let's practice: say 'My friend's morning routine sounds amazing — can I adopt it?' and I'll show how /ground validates the mapping"

**Quiz Q (situation)**: A popular study method swears by "90-minute deep focus sessions with no breaks." Your schedule is interrupted, your attention span is different, and your subjects aren't the same kind. You're unsure if the method structurally fits you.
- A) Prothesis `/frame` — B) Katalepsis `/grasp` — C) Analogia `/ground` — D) Aitesis `/inquire`
- Answer: C

**Quiz Q (design)**: Someone says "just treat your side project like a startup." How would you check whether that mental model structurally applies to your specific setup?
- Hint: The advice may be right in general but structurally mismatched to your context.

**Philosophy**: ἀναλογία (proportion, analogy) — Gentner's Structure Mapping Theory (1983). Core principle: **Structural Correspondence over Abstract Assertion**. An analogy is only as good as its structural match to your domain. Workflow position: Analysis cluster — now validate that abstract advice maps to concrete reality. Game feel: "Sounds right in theory, but does it fit MY situation?" → decompose analogy → check each mapping → instantiate with real components.

## Prosoche `/attend`

**Situation**: You ask Claude "clean up my Downloads folder for me." The folder holds hundreds of files — obvious junk (duplicate zips, old installers), probably-junk (unclear PDF scans), and things you actually need (tax receipts, signed contracts). Deleting everything is dangerous; doing nothing misses the point.

**Intervention**: `/attend` classifies each action for risk (safe, elevated, gate-level), executes low-risk deletions autonomously (duplicate zips, cached installers), proposes elevated-risk items for you to approve or reject individually, and halts on gate-level items (anything that looks like a legal document). You end up with a cleaned folder — safely.

**Trial prompt**: "Let's practice: say 'Clean up my Downloads folder' and I'll show how /attend classifies actions by risk and executes safely"

**Quiz Q (situation)**: You ask Claude to "archive old emails and keep important ones." Some are clearly newsletters, some look like receipts, some might be from your landlord. You want help — but silent bulk archiving would be a disaster.
- A) Aitesis `/inquire` — B) Prosoche `/attend` — C) Syneidesis `/gap` — D) Telos `/goal`
- Answer: B

**Quiz Q (design)**: You want Claude to act on a plan with mixed-risk actions — some safe, some reversible, some dangerous. How would you get the safe steps executed fast without giving up control over the risky ones?
- Hint: The answer is not gating everything — it's letting the safe work flow while surfacing only the judgment moments.

**Philosophy**: προσοχή (attention, vigilance) — the Stoic practice of present-moment awareness during action. Core principle: **Attention over Automation**. Risk-classify → low-risk executes autonomously → elevated-risk surfaces for your judgment → safe execution without losing agency. Workflow position: Execution cluster — ready to act, execute with readiness- and risk-aware gating. Game feel: "Go ahead, but pause at anything that could bite" → tasks flow → gate appears exactly when it matters → you decide → execution resumes.

## Epharmoge `/contextualize`

**Situation**: You've been in a long Claude conversation about "low-sodium, low-carb eating" — dietary constraints you've repeatedly named. An hour in, you ask "what should I have for lunch?" and Claude cheerfully suggests ramen. A lunch suggestion in general, but mismatched against the accumulated context you'd built up in this very conversation.

**Intervention**: `/contextualize` detects application-context mismatch after the response — checks whether Claude's output actually fits the context you've been accumulating in this session (prior constraints, stated preferences, established framing), and surfaces the mismatch before you act on a misaligned recommendation.

**Trial prompt**: "Let's practice: after a long dietary conversation, tell Claude the lunch suggestion felt off, and I'll show how /contextualize checks accumulated-context fit"

**Quiz Q (situation)**: You've been discussing "beginner-level Python for a 10-year-old" with Claude for 20 minutes. You ask for a "small starter project." Claude returns a project using metaclasses and async generators — technically beginner-friendly in general, but completely detached from the accumulated context.
- A) Aitesis `/inquire` — B) Epharmoge `/contextualize` — C) Syneidesis `/gap` — D) Analogia `/ground`
- Answer: B

**Quiz Q (design)**: After a long conversation where you established many specific constraints, Claude answers a new question correctly-in-general but ignores the accumulated context. How would you systematically check for context fit?
- Hint: The output is not wrong on its own — it's mismatched against the context you both built up this session.

**Philosophy**: ἐφαρμογή (application, fitting) — Aristotle's practical application. Core principle: **Applicability over Correctness**. Correct output that doesn't fit the accumulated conversation context is not useful output. The user's awareness that context has been built up in this session is the trigger. Workflow position: Verification cluster — after work is done, check if it fits where it's going. Game feel: "Done! ...wait, this ignores everything we just discussed" → accumulated-context mismatch surfaces → adapt or dismiss.

## Katalepsis `/grasp`

**Situation**: You're about to meet a friend who's recommending a dense new book. You want to skim and "get it" before the conversation, but the book has 14 chapters and you have 30 minutes. Random sampling won't give you the core; you need the shape — problem / method / result / limits — fast.

**Intervention**: `/grasp` structures rapid comprehension by decomposing the target into categories (problem statement, approach, main findings, scope limitations), probing your grasp of each via Socratic questions, and identifying which category you can explain and which still feels fuzzy — so your 30 minutes maximize core understanding.

**Trial prompt**: "Let's practice: say 'Help me get the core of this book fast' and I'll show how /grasp decomposes by category and verifies comprehension"

**Quiz Q (situation)**: You skimmed a long article and nodded along. A colleague asks you to summarize the main argument in one sentence and you freeze — you realize skimming wasn't the same as grasping.
- A) Hermeneia `/clarify` — B) Prothesis `/frame` — C) Katalepsis `/grasp` — D) Syneidesis `/gap`
- Answer: C

**Quiz Q (design)**: After quickly consuming a complex explanation, how would you verify you actually grasped the core — rather than that you could nod along?
- Hint: The problem isn't that the content is wrong — it's that your comprehension hasn't caught up. Categorical decomposition ("what / how / why / limits") is the test.

**Philosophy**: κατάληψις (grasping firmly, comprehension) — the Stoic criterion of truth through firm cognitive grasp. Core principle: **Comprehension over Approval**. Nodding along is not grasping. Categorical decomposition converts passive reception into active comprehension. Workflow position: cross-cutting, structurally last — requires completed content; without something to grasp, there is nothing to verify. Game feel: "I think I got it... but do I really?" → category-by-category probe → confirmed grasp or identified gap.

## Composition Patterns

Real sessions rarely use a single protocol. Composition — invoking multiple protocols together — is often more valuable than any isolated call. Three patterns that appear most in practice:

### `/clarify * /goal` — Vague verb to contract

When you say "help me improve my morning routine" — the verb ("improve") is vague AND the end state is undefined. `/clarify` first decomposes "improve" into axes (energy, speed, focus, health), then `/goal` co-constructs the success criteria for the axis you care about.

**Shape**: vague intent → clarified axis → concrete success bar.

### `/recollect * /inquire` — Recalled context plus fresh facts

When you say "find me that café we talked about — and check if it's open today." `/recollect` resolves the vague recall ("that café") into the specific prior discussion, then `/inquire` grounds the freshness-required fact (today's hours) in verifiable sources.

**Shape**: empty intention → recognized prior context → grounded current fact.

### `/attend * /contextualize` — Risk-aware execution plus context-fit check

When you say "handle the email cleanup, and check it actually fits my inbox style after." `/attend` risk-classifies the cleanup actions (safe deletes vs judgment-needed archives) and executes safely, then `/contextualize` checks that the resulting state matches the accumulated context you've established (your actual email habits, not a generic clean inbox).

**Shape**: pre-execution risk gating → post-execution context-fit.
