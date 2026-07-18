# Preset Scenarios

Fallback scenarios for `/onboard` SCENARIO and QUIZ phases when session data is insufficient (Tier 2). Each protocol has a realistic situation, intervention description, trial prompt, and two quiz questions.

Design note: scenarios anchor on AI-collaboration moments (meta-primary) with familiar everyday-domain fallbacks. Protocol fits are unambiguous; ambiguous cases belong in quiz material.

## Horismos `/bound`

**Situation**: You ask Claude to edit a long email draft. You're fine with typo fixes and smoother phrasing, but paragraph reorganization and tone changes feel like decisions you want to own. Right now there's no explicit boundary — Claude might change anything.

**Intervention**: `/bound` first dispatches what KIND of boundary each edit domain leaves unsettled — direction/priority (what tone to aim for), scope (which paragraphs are in bounds), type/concept (what counts as a "typo fix"), ownership (who decides), or an emergent kind it names on the spot — then settles each via a uniform disposition gate: "Typos — AI autonomous? Phrasing — AI proposes, you pick? Paragraph structure — you decide, AI waits?" Ownership is one kind among the seeds — the degenerate "who decides" case where the boundary value is the disposition itself. The resulting BoundaryMap tells Claude what it may change silently, what to propose, and what to leave alone.

**Trial prompt**: "Let's practice: say 'Edit this email for me' and I'll show how /bound dispatches each edit domain's boundary kind and settles its disposition"

**Quiz Q (situation)**: You ask Claude to "tidy up my resume" — it rewrites your summary, swaps out job titles, and restructures bullet points. You only wanted typo fixes and better wording; the content decisions are yours.
- A) Aitesis `/inquire` — B) Horismos `/bound` — C) Syneidesis `/gap` — D) Prosoche `/attend`
- Answer: B

**Quiz Q (design)**: You're about to delegate a multi-step task with some sensitive decisions. How would you make explicit which steps are AI's call vs yours?
- Hint: The problem isn't unclear intent or missing context — it's unsettled boundaries: first name each decision's boundary kind (direction/priority, scope, type/concept, ownership, or an emergent kind), then settle how each is decided.

**Philosophy**: ὁρισμός (definition, boundary) — from horizein, "to bound." Core principle: **Definition over Assumption**. Without explicit boundary definition, AI either over-assumes autonomy (causing surprise) or under-assumes (causing friction). Workflow position: cross-cutting — the BoundaryMap tells all downstream protocols which boundaries are settled and how each gets decided. Game feel: "What's unsettled here — and what kind of boundary is it?" → kind dispatch (direction/priority, scope, type/concept, ownership, or a named emergent kind) → disposition per domain → BoundaryMap emerges → shared understanding of the boundaries.

## Anamnesis `/recollect`

**Situation**: You open a new session wanting to continue yesterday's conversation with Claude — something about a recommendation you liked, or a decision you made together — but you can't remember the exact topic or what was concluded. Re-explaining would lose the original framing.

**Intervention**: `/recollect` scans your session transcripts plus their recall indices — the transcript record is authoritative, so recall does not rest on the indices alone — for narrative candidates matching your vague cue, then presents the highest-priority story-form candidate per cycle (what was asked → where the talk went → what was decided) for you to recognize — a high-confidence single match is emitted directly, no gate — resolving ambiguous recall into concrete prior context before current work proceeds.

**Trial prompt**: "Let's practice: say 'Pick up where we left off yesterday' and I'll show how /recollect surfaces narrative candidates"

**Quiz Q (situation)**: You start with "what was that book Claude recommended last time?" — you remember the conversation happened but not the title, genre, or why it stood out.
- A) Prothesis `/frame` — B) Aitesis `/inquire` — C) Anamnesis `/recollect` — D) Katalepsis `/grasp`
- Answer: C

**Quiz Q (design)**: You reference "the direction we agreed on" from a past session but have no specific pointer. How would you surface the right prior context for recognition — rather than asking Claude to guess?
- Hint: The problem isn't missing external facts — it's that prior session context is vague and needs resolution into something recognizable. Cross-session state recovery lives here, not in `/inquire`.

**Philosophy**: ἀνάμνησις (recollection) — Plato's theory of knowledge as recollection of what the soul already knew. Core principle: **Recognition over Retrieval**. Vague cues become concrete when candidates are surfaced as narratives for user recognition, not retrieved by keyword. Workflow position: cross-cutting — best invoked at session start. Advisory enrichment from `/recollect` is most effective before downstream protocols' phases have progressed; once a downstream protocol's gate has been answered, its results are already shaped without that enrichment. Session-start recall is the practical ordering mechanism. Game feel: "Something we talked about before..." → narrative candidates surface → you recognize the right one → grounded continuation.

## Anagoge `/ascend`

**Situation**: You remember a whole *line* of work — a thread you kept returning to across many sessions, a topic you figured out in scattered pieces, or a concept you and Claude eventually named — but no single session is the answer. Recalling one session returns a fragment; the unit you actually mean stands above any one of them.

**Intervention**: `/ascend` detects that the right resolution unit is supra-session, classifies which higher unit you mean (a connected-session chain, a topic cluster, or an already-sedimented concept node), reconstructs the deposit graph at read-time — discovering related deposits across sessions by shared anchors, keywords, and metadata — and presents the higher unit as a narrative — a chain as origin → development → arrival, a cluster as fragments + where the deposits attest the topic last stood, a concept node as the node + which deposits forged it — for you to recognize. It infers the connections at read-time and writes nothing.

**Trial prompt**: "Let's practice: say 'Where did that whole refactor thread we kept coming back to end up?' and I'll show how /ascend elevates scattered sessions into the connected line."

**Quiz Q (situation)**: You ask "where did everything we worked out about the caching strategy land?" — you remember it was spread across several sessions, not decided in one.
- A) Anamnesis `/recollect` — B) Anagoge `/ascend` — C) Aitesis `/inquire` — D) Periagoge `/induce`
- Answer: B

**Quiz Q (design)**: You reference "that whole line of work on the auth migration" but it spanned a dozen sessions with no single locus. How would you surface the connected unit — rather than one session or a freshly-formed summary?
- Hint: The problem isn't single-session recall (that's `/recollect`) or forming a new abstraction from instances (that's `/induce`) — it's that the right unit is the supra-session whole the deposits already imply, reconstructed at read-time from the anchors, keywords, and metadata the deposits already carry.

**Philosophy**: ἀναγωγή (a leading-up) — the deliberate sibling of ἀνάμνησις: ana-mnesis recalls one prior context; ana-goge leads that recall *up* to the connected unit above it. Core principle: **Recognition over Aggregation**. The higher unit is recognized by reconstructing the connections at read-time from the anchors and keywords the deposits already carry, never fused or synthesized anew. Workflow position: cross-cutting — invoked when single-session recall keeps returning a fragment while you mean the larger unit. Game feel: "the whole thing we kept circling back to..." → the connected line/cluster/concept assembles from read-time inference → you recognize the unit → grounded continuation.

## Syneidesis `/gap`

**Situation**: Claude gives you a neat checklist for "things to bring on the Busan trip." The list looks complete — clothes, toiletries, charger. You're about to close the tab, but you haven't thought about: medication, local transit card top-up, reservation confirmations saved offline, or weather contingencies.

**Intervention**: `/gap` audits the decision point by surfacing procedural gaps (missed steps), consideration gaps (unexamined dimensions), assumption gaps (implicit beliefs), and alternative gaps (unexplored options) — before you commit to the plan.

**Trial prompt**: "Let's practice: say 'Here's my trip checklist, ready to go' and I'll show how /gap surfaces blind spots"

**Quiz Q (situation)**: You're about to accept a job offer. The salary is good, the role sounds interesting, you're ready to reply. Something feels off but you can't name it.
- A) Prosoche `/attend` — B) Syneidesis `/gap` — C) Epharmoge `/contextualize` — D) Periagoge `/induce`
- Answer: B

**Quiz Q (design)**: You've picked option B out of three. Before committing, how would you check if you're overlooking something the decision logic didn't cover?
- Hint: The issue isn't execution risk — it's unnoticed blind spots at the decision point.

**Philosophy**: συνείδησις (shared knowing, conscience) — the Stoic inner witness. Core principle: **Surfacing over Deciding**. AI illuminates what you haven't considered; you judge whether it matters. Workflow position: Decision cluster — after perspectives are set, before committing. Game feel: "About to commit? Let me check your blind spots" → 4 gap types surface → you address or dismiss → decide with awareness.

## Prothesis `/frame`

**Situation**: You drafted a tough email to send — asking your manager for time off during a busy season. You think it reads fine, but you're not sure how it lands. "Fine to me" doesn't tell you how a tired manager or a peer in HR might read it.

**Intervention**: `/frame` recommends analytical perspectives (e.g., "manager under deadline pressure," "HR fairness lens," "peer comparing workloads") and hands off the lenses for the session (via `/conduct`) to execute and synthesize, so you see the email from each angle before hitting send.

**Trial prompt**: "Let's practice: say 'Review this email draft for me' and I'll show how /frame recommends audience perspectives"

**Quiz Q (situation)**: You're writing a group chat message announcing a decision. It seems clear to you, but the chat has coworkers, close friends, and your partner. Some will read it as casual, some as formal. You're unsure which lens to evaluate through.
- A) Horismos `/bound` — B) Prothesis `/frame` — C) Syneidesis `/gap` — D) Aitesis `/inquire`
- Answer: B

**Quiz Q (design)**: You're about to publish a blog post but only checked it from your own reading angle. How would you structure the review to surface how different readers receive it?
- Hint: The problem isn't missing information — it's not knowing which analytical lens or audience perspective to apply.

**Philosophy**: πρόθεσις (a placing before, setting forth) — the act of laying out options for examination. Core principle: **Recognition over Recall**. You don't need to invent frameworks from scratch — you select from curated lenses. Workflow position: Analysis cluster — now choose how to look at the problem. Game feel: "Too many valid angles" → AI recommends lenses → you pick → structured multi-perspective analysis.

## Aitesis `/inquire`

**Situation**: You ask Claude "is the National Museum open next Friday afternoon?" — an externally verifiable fact you don't currently hold. Claude could guess from general knowledge, but the grounded answer requires checking current hours and holiday calendars.

**Intervention**: `/inquire` detects context insufficiency before giving an answer, prioritizes information-gain by which check would most change the response, and grounds the answer in observable external facts (public schedules, documented pages) rather than silent assumption. A null result ("I cannot verify without the official page") is a valid outcome — silent guessing is not.

**Trial prompt**: "Let's practice: say 'Is the National Museum open next Friday afternoon?' and I'll show how /inquire grounds the answer in observable facts"

**Quiz Q (situation)**: You ask Claude "can my MacBook Air run this 70B model locally?" — the answer depends on your exact spec and the model's published requirements. Claude starts recommending settings without confirming either.
- A) Prothesis `/frame` — B) Aitesis `/inquire` — C) Horismos `/bound` — D) Prosoche `/attend`
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

## Periagoge `/induce`

**Situation**: Over a week you've noticed three separate incidents that bother you — a teammate ghosted a thread after you replied quickly, a meeting where you answered first and others went silent, a review comment where your detailed response shut down the discussion. You sense these have something in common but can't name it yet. "Too fast" isn't quite it. "Over-responding" is close but not right. The abstraction hasn't located itself.

**Intervention**: `/induce` proposes a candidate abstraction with a grounding example drawn from your own domain — e.g., "reply-latency as participation cost" with an example from your own thread — then offers Socratic moves to shape it. Widen upward (is this really about pacing in async communication?), narrow (specifically on replies that close rather than open?), fuse with an adjacent idea (this relates to turn-taking norms), or reorient entirely. You turn the candidate until it clicks.

**Trial prompt**: "Let's practice: describe 3-4 cases you're noticing a pattern across, and I'll show how /induce proposes a candidate abstraction you can shape"

**Quiz Q (situation)**: You keep running into the same feeling across unrelated tasks — a bug fix that bloated into a refactor, a meeting that drifted into planning, a PR review that turned into a redesign. You sense a pattern but don't have the word for it yet.
- A) Analogia `/ground` — B) Periagoge `/induce` — C) Syneidesis `/gap` — D) Aitesis `/inquire`
- Answer: B

**Quiz Q (design)**: You have three examples of a phenomenon but no name for it. How would you get a candidate abstraction proposed — one you can test, widen, narrow, or discard — rather than staring at the cases until something clicks?
- Hint: The answer is not hoping the word arrives unbidden — it's dialectical shaping with the candidate in hand.

**Philosophy**: περιαγωγή (turning-around) — Plato *Republic* VII.518d, the soul's turning toward the intelligible; the dialectical collection and division moves of *Phaedrus* 265d–266a. Core principle: **Dialectical Triangulation over Unilateral Proposal**. Abstraction formation from concrete instances requires shaping by the user — AI proposes, user widens/narrows/fuses/reorients. Workflow position: Analysis cluster — dual of `/ground`. Where `/ground` validates a given structure against a target (substitution), `/induce` forms a new structure from instances (colimit). Game feel: "These cases share something — what is it?" → candidate arrives with a grounding example → widen, narrow, or reorient → the name locates itself.

## Euporia `/elicit`

**Situation**: You open a session with "I want to make this CLI more usable" — but "usable" could mean reduced friction, smarter defaults, clearer errors, faster startup, or accessibility. The intent is articulated, but which axis matters most for *your* codebase and your team's prior work is implicit in your repo, your rules files, and past PR conversations — not in the utterance itself.

**Intervention**: `/elicit` reverse-traces from the intent through your externalized substrate (codebase, rules, past sessions, environment). Each cycle surfaces a few dimension projections with substrate-cited basis, and your answers explicate which coordinates were already implicit in your externalized cognition. The axis emerges per cycle rather than committing upfront.

**Trial prompt**: "Let's practice: say 'I want to make X more usable / accessible / robust' and I'll show how /elicit reverse-traces dimension projections from your codebase and rules"

**Quiz Q (situation)**: You say "let's tighten the build pipeline" — but "tighten" could mean faster runs, fewer flaky retries, smaller artifacts, or stricter quality gates. Each is a different axis with values implicit in your CI configs and past green/red history.
- A) Prothesis `/frame` — B) Aitesis `/inquire` — C) Euporia `/elicit` — D) Periagoge `/induce`
- Answer: C

**Quiz Q (design)**: Your intent is articulated but the axis it commits to depends on coordinates implicit in your externalized cognition (codebase, rules, past sessions). How would you surface those coordinates without forcing a single axis upfront?
- Hint: Reverse-trace from intent through substrate; let the axis emerge per cycle.

**Philosophy**: εὐπορία (way through, resourcefulness) — the resolving passage that emerges from aporia (no way through). Plato's later dialectic threads aporia and euporia as paired moments of inquiry. Core principle: **Reverse Induction over Axis-Fixed Extraction**. Directional dual to `/induce` — where `/induce` ascends from instances to abstraction (bottom-up colimit), `/elicit` descends from intent through substrate to coordinates (top-down reverse induction). Workflow position: Planning cluster — alongside `/inquire`, but for axis-emergent intents that no axis-specific protocol covers. Game feel: "I know I want X, but the axis is fuzzy" → substrate trace surfaces dimension projections → cycle-emergent answers → endpoint resolves.

## Proplasma `/preview`

**Situation**: You're at a direction gate — three ways to lay out the dashboard's first screen, or two shapes for the new API — and the options are well described, but you can't tell from the descriptions which future you'd actually want. You catch yourself saying "go with whatever fits the northstar" or "I'd have to see it."

**Intervention**: `/preview` derives the axes on which the candidates genuinely diverge and has you settle them (plus the placeholder policy) at a spec gate before anything is generated — and sometimes the axes alone make the futures recognizable, in which case the protocol stands down without building anything. Otherwise it builds 2–4 cheap, overtly fake probes — text vignettes or temp-isolated mockups — each committing different values on the settled axes, and shows them one at a time before the per-axis contrast map. You select a probe-exposed direction or synthesize your own from the probes; questioning a probe first stays open as a free response. Harvest precedes discard: the direction, the deciding contrast rows, and the newly exposed unknowns survive; file probes are destroyed with each disposition declared — a failed destruction is declared with a cleanup handoff, never silent — and nothing probe-derived ever counts as evidence.

**Trial prompt**: "Let's practice: name a direction decision you keep deferring because the options read fine but you can't picture them — I'll show how /preview contrasts discard-committed probes before you commit"

**Quiz Q (situation)**: You're choosing between three onboarding flows. Each is clearly described, yet you keep stalling and finally say "honestly I'd have to see them side by side."
- A) Prothesis `/frame` — B) Euporia `/elicit` — C) Proplasma `/preview` — D) Syneidesis `/gap`
- Answer: C

**Quiz Q (design)**: The candidate directions are known and no real evidence is needed — the futures just don't come through in words. How do you make them recognizable without committing to any direction or leaving artifacts behind?
- Hint: Settle the divergence axes first, then contrast cheap placeholder probes that are discarded after harvest — the probes show futures; they never become evidence.

**Philosophy**: πρόπλασμα (preliminary model) — the clay model a sculptor shapes before committing to marble: cheap, discardable, and made precisely to be seen. Core principle: **Contrast over Simulation**. Workflow position: Planning cluster — alongside `/inquire` (facts) and `/elicit` (intent coordinates), completing the unknowns-elicitation line with direction futures. Game feel: "I'd have to see it" → settle the axes → probes materialize the futures → you recognize, decide, and the clay goes back in the bin.

## Heuresis `/ideate`

**Situation**: You've got a topic to write about — or maybe just a couple of scattered fragments jotted down — and what you need isn't a decision between two known options, and it isn't analytical lenses on a question you've already fixed. You just need more raw material. Right now you have one idea, or none, and you keep circling back to the same one or two instead of getting anywhere new.

**Intervention**: `/ideate` reads your invocation alone and infers whether you're starting from a bare topic or from idea fragments already in hand — no entry questions asked. Starting from a bare topic opens an abstract frame map first — angles to open, no concrete idea shown yet — so you pick a direction of divergence before any example can anchor your own thinking; starting from fragments expands straight out from what you already wrote. Each round generates candidates in parallel across the open frames with no elimination, ranking, or scoring — every candidate carries a tag for whether you or the AI produced it, so you can see where fixation crept in and who owns what. You stop whenever you want — there's no round quota — and what comes back declares plainly which frames never got opened.

**Trial prompt**: "Let's practice: name a topic where your options feel thin or you keep circling the same one or two ideas — I'll show how /ideate opens a frame map and generates across it"

**Quiz Q (situation)**: You have one idea for your team's offsite theme and you keep refining it — better name, better schedule, nicer venue — but you haven't actually generated a genuinely different second idea to compare it against.
- A) Prothesis `/frame` — B) Proplasma `/preview` — C) Heuresis `/ideate` — D) Syneidesis `/gap`
- Answer: C

**Quiz Q (design)**: You want a wide field of genuinely different ideas without your own first instinct anchoring everything that follows. How do you get divergence without narrowing too soon?
- Hint: The problem isn't choosing between existing options (that's `/preview`) or picking an analytical lens on a fixed question (that's `/frame`) — it's that the candidate field itself is too thin. Open an abstract frame map before any concrete idea appears, and don't eliminate or rank anything a round produces.

**Philosophy**: εὕρεσις (finding, discovery) — the older, broader sense of turning up something not yet in view, prior to its later narrowing into a term of rhetorical technique. Core principle: **Divergence over Selection**. A candidate is raw material, not a selection-ready alternative — heuresis never discards, scores, or ranks what a round produces; that judgment belongs downstream, entirely out of its scope. Workflow position: Planning cluster, immediately upstream of `/preview` — heuresis widens a thin or converged field into a diverse one; `/preview` picks up only once two or more candidates already exist and need their futures contrasted. Game feel: "I've only got one idea, and it's getting stale" → frame map opens → candidates generate in parallel, untouched by ranking → you stop when the field is wide enough → a diverse set, ready for whatever comes next.

## Prosoche `/attend`

**Situation**: You ask Claude to "work through my 200-photo album and build the yearbook layout" — an unattended run that will churn for an hour while you're away. You worry it might quietly declare victory halfway through, or wander into folders it was never meant to touch.

**Intervention**: `/attend` reads the boundaries the job implies — which folders are fair game, what counts as done, how long it may run — and compiles each into a checkable condition (every album photo appears in the layout; nothing outside the album folder changed; at most N passes). You confirm the set, and it becomes the finish-line contract the autonomous run is held to. Anything that would need split-second blocking (like deleting originals) is named as out of its hands and left to your tool's permission prompts.

**Trial prompt**: "Let's practice: describe a task you'd hand to an unattended run and I'll show how /attend compiles its boundaries into verifiable conditions"

**Quiz Q (situation)**: You're about to let Claude run unattended overnight migrating hundreds of files, and you want certainty that "done" really means done — and that it stayed inside the folders you named.
- A) Aitesis `/inquire` — B) Prosoche `/attend` — C) Syneidesis `/gap` — D) Horismos `/bound`
- Answer: B

**Quiz Q (design)**: You want an autonomous run held to your boundaries without watching it work. How do you get protection that doesn't depend on supervision?
- Hint: The answer is not watching harder — it's making each boundary checkable at the moment the run stops.

**Philosophy**: προσοχή (attention, vigilance) — the Stoic practice of self-aware engagement, inscribed before autonomy begins. Core principle: **Attention over Automation**. Infer the boundaries → keep what is checkable at stop time → compile into verifiable conditions → confirm → hand off. Workflow position: Execution cluster — the compile step before an autonomous run. Game feel: "Here's the finish line and the fences — now go" → the run proceeds unattended → the stop-time check tells the truth → you trust the result.

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

## Elenchus `/sublate`

**Situation**: You've been collecting context for two hours — a teammate's verbal claim about API behavior, a doc you read at the start, a Slack thread quote, an inferred constraint built across three hops. Now you're about to share the plan in a meeting. One of those sources has aged, another's verification path is provisional, and two of them quietly point at the same referent in conflicting directions — but you don't know which.

**Intervention**: `/sublate` vets the working context before it externalizes. It selects audit-candidate sources (high-leverage, age beyond horizon, long inference chain, cross-source contradiction, or an inference-character conclusion — a source that is itself an inferred conclusion) and posits a dialectical antithesis per source — provenance challenge ("X's verification path is provisional"), counterfactual gap ("under condition Z, Y fails at point P"), cross-source divergence ("X₁ and X₂ collide at Q"), or inference-fallacy audit ("Y's soundness rests on a reasoning archetype that fails here"). You judge each source as Confirmed, Revised, Discarded, Deferred, Conditional, Bounded, or Routed before the sync.

**Trial prompt**: "Let's practice: tell me you're about to share an accumulated plan in 15 minutes and want to vet the context first, and I'll show how /sublate dialectically tests each source."

**Quiz Q (situation)**: You've spent the afternoon building a context about a teammate's preferences from three different conversations and one inferred guess. You're about to make a decision based on the synthesis. Something feels off but you can't name which source decayed.
- A) Aitesis `/inquire` — B) Epharmoge `/contextualize` — C) Elenchus `/sublate` — D) Syneidesis `/gap`
- Answer: C

**Quiz Q (design)**: After hours of context accumulation, before an external sync, how would you stress-test which sources still hold and which have decayed — without re-collecting everything from scratch?
- Hint: The output isn't yet produced — the *input* (working context) is what carries silent decay. Antithesis per source is the test, not gap detection across the decision.

**Philosophy**: ἔλεγχος (cross-examination, refutation) — the Socratic mode of testing a claim by deliberately positing its counter-claim and seeing what survives the exchange. The lexical verb `/sublate` carries the Hegelian *Aufhebung* — preserve + negate + lift up. Core principle: **Dialectical Vetting over Silent Trust**. Working context decays silently as time passes, downstream concentration warps incidental claims into load-bearing premises, and cross-source contradictions hide behind topical proximity. Workflow position: Verification cluster — alongside `/contextualize`, but pre-execution rather than post (Elenchus tests inputs before action; Epharmoge tests outputs after). Game feel: "We've built so much context — is any of it still standing?" → per-source antithesis → disposition judgment → vetted context.

## Katalepsis `/grasp`

**Situation**: AI just produced a dense plan, document, or code change. You need to get oriented before you approve, explain, or modify it, but the first menu of artifact categories would slow you down because you do not yet know which part maps to your concern.

**Intervention**: `/grasp` structures rapid comprehension by first offering intent-scented entry points such as what changed, why it matters, what needs approval, or what could break. After you pick the closest path, it grounds that path in the artifact and probes your grasp through Socratic questions.

**Trial prompt**: "Let's practice: say 'Help me understand what I need to approve in this AI-generated plan' and I'll show how /grasp routes through an intent entry point before verifying comprehension"

**Quiz Q (situation)**: You skimmed a long article and nodded along. A colleague asks you to summarize the main argument in one sentence and you freeze — you realize skimming wasn't the same as grasping.
- A) Periagoge `/induce` — B) Prothesis `/frame` — C) Katalepsis `/grasp` — D) Syneidesis `/gap`
- Answer: C

**Quiz Q (design)**: After quickly consuming a complex explanation, how would you verify you actually grasped the core — rather than that you could nod along?
- Hint: The problem isn't that the content is wrong — it's that your comprehension hasn't caught up. Start from the user's intended use of the result, then probe the artifact-grounded understanding.

**Philosophy**: κατάληψις (grasping firmly, comprehension) — the Stoic criterion of truth through firm cognitive grasp. Core principle: **Comprehension over Approval**. Nodding along is not grasping. Intent-scented entry points convert passive reception into active comprehension by letting the user recognize the path closest to their concern before artifact details appear. Workflow position: cross-cutting, structurally last — requires completed content; without something to grasp, there is nothing to verify. Game feel: "I think I got it... but do I really?" → choose the nearest intent path → artifact-grounded probe → confirmed grasp or identified gap.

## Diylisis `/distill`

**Situation**: You wrote a handoff brief so a fresh session can resume your work tomorrow. It reads complete to you, but it leans on things only this session knows — a coined label like "v4", a "do it as above" anchor, a "Task #3" with no restoration data. A new session with no memory of today would stall on every one of those.

**Intervention**: `/distill` declares a handoff contract (who resumes, what the next task is, what sources they may read), normalizes each session-local token to a stable reference, audits each item for whether it travels on its own, judges relevance and provenance, and surfaces whatever cannot be resolved. It emits a plain-language handoff plus a structured task-state block that rehydrates the dangling task ids — so a fresh agent executes from it without asking you to fill the gaps.

**Trial prompt**: "Let's practice: say 'Turn my session notes into a handoff a fresh agent can run from' and I'll show how /distill normalizes the session-only references and surfaces what cannot be resolved"

**Quiz Q (situation)**: You paste yesterday's working notes into a brand-new chat and ask it to continue. It immediately asks what "the earlier approach" means and which file "that config" was — the notes assumed context only the old session had.
- A) Anamnesis `/recollect` — B) Diylisis `/distill` — C) Aitesis `/inquire` — D) Epharmoge `/contextualize`
- Answer: B

**Quiz Q (design)**: You're about to hand a plan to a fresh-context subagent that shares none of your session. How would you make the plan self-contained so the subagent executes it without needing your session?
- Hint: The problem isn't vague recall of a past session (that's `/recollect`) or missing external facts (that's `/inquire`) — it's that your current context is tethered to references only this session can resolve, and a fresh recipient needs them distilled out.

**Philosophy**: διύλισις (refining, distillation) — separating what transfers from what is session-bound residue. Core principle: **Portability over Author Familiarity**. A handoff reads complete to its author because the author silently shares the missing context; a fresh recipient has none of it. Workflow position: cross-cutting — invoked when a working context is about to transfer to a session with no shared ground. Game feel: "this is obvious to me — but would a stranger get it?" → normalize the session-only references → surface what cannot be resolved → portable handoff a zero-memory agent can run.

## Hyphegesis `/conduct`

**Situation**: You're about to start a big piece of work — a framework migration, a multi-stage investigation — and the goal is clear, but *how to run it* is not. Several moves are involved: gather context, frame perspectives, verify adversarially, synthesize. In what order? Which in isolation? How do their results reconcile? When do you stop? Started without deciding, the work drifts — wrong order, perspectives contaminated before synthesis, no stopping criterion.

**Intervention**: `/conduct` checks the work is genuinely multi-move and non-trivial (single-move work relays straight to the one protocol that resolves it), identifies the candidate moves, then designs a conduct topology across five axes — order, independence, reconciliation, termination, routing — starting from the most decision-relevant axis. It locks the stable choices, defers the volatile ones to in-session checkpoints, surfaces which substrate can realize each part, and hands off a method plan you (or the substrate) execute.

**Trial prompt**: "Let's practice: say 'I'm about to migrate this service across two framework versions — conduct how I should run the whole thing' and I'll show how /conduct designs the move topology before any object-level work starts"

**Quiz Q (situation)**: You have a clear goal but five interdependent steps, and you keep second-guessing the order and whether to run them in isolation or let them see each other. You haven't started because the *method*, not the goal, is unsettled.
- A) Prothesis `/frame` — B) Horismos `/bound` — C) Hyphegesis `/conduct` — D) Aitesis `/inquire`
- Answer: C

**Quiz Q (design)**: You face a multi-move task where the order, independence, and stopping criterion all genuinely divide the plan. How would you settle the method before starting, without locking choices that depend on what you'll only learn mid-way?
- Hint: The problem isn't which perspectives to use for one inquiry (that's `/frame`) or who owns what (that's `/bound`) — it's how the whole session's moves relate. Settle the most-constrained axis first, lock what's stable, and defer the volatile choices to an in-session checkpoint.

**Philosophy**: ὑφήγησις (leading from just ahead, guiding) — conducting the method of the work, not doing the work. Core principle: **Conduction over Substrate**. How a session's moves are ordered, isolated, reconciled, and stopped is substrate-invariant — it survives deleting every runtime noun — so the conduct form is designed independently and only then matched to a substrate, declaring degradation rather than binding one it cannot realize. Workflow position: cross-cutting, Hybrid initiator — conducts the session's whole move set before object-level cognition. Game feel: "I know what I want, but how do I run this?" → confirm it's multi-move → design the topology impact-first → hand off a method plan with checkpoints.

## Diairesis `/delimit`

**Situation**: You have a large body of work — a Linear project, a milestone set, a sprawling issue tree — that clearly won't fit one execution span. Before you can conduct *how* to run it, you have to decide *where to cut it* into units. Cut into pieces that are too big and a single span can't finish one; too small and you fan out spans that barely do anything; across a dependency seam and two units fight over the same work. The goal is known; the granularity of the cut is not.

**Intervention**: `/delimit` reads the external work-breakdown structure read-only (it never copies or owns it — the WBS stays the single source of truth), scans it for natural joints — milestone boundaries, dependency seams, deliverable edges — and searches for the cut-set whose every unit fits one span. It surfaces the highest-leverage uncut region's proposed cut one at a time, with a fit verdict (Fits / Overflows / Underfills), and you settle it: accept the cut, move it to a different joint, split a unit that overflows, or merge one that underfills. When you say the partition is complete, it cuts the rest at their natural joints, checks the three invariants — each unit fits one span, every cut on a joint, and complete coverage with no orphaned work — and emits a WorkUnitMap that flows straight into `/conduct`.

**Trial prompt**: "Let's practice: say 'I've got a Linear project that's way too big for one session — delimit it into execution-sized units' and I'll show how /delimit finds the natural joints and proposes the cut-set before any conducting starts"

**Quiz Q (situation)**: You have a clear goal and a big issue tree, but you can't tell where one executable chunk should end and the next begin — some candidate units look too big for a single run, others too thin to bother. You haven't started because the *cut*, not the goal or the order, is unsettled.
- A) Hyphegesis `/conduct` — B) Horismos `/bound` — C) Diairesis `/delimit` — D) Aitesis `/inquire`
- Answer: C

**Quiz Q (design)**: You face a multi-span body of work and need to partition it into units before conducting. How do you decide where the cuts fall so each unit fits one span and no work is orphaned, without ordering the units yet?
- Hint: The problem isn't who decides what (that's `/bound`) or how the units run in sequence (that's `/conduct`, the dual) — it's where to cut. Find the natural joints, fit each candidate unit against one span, and let the user settle each cut; ordering comes after.

**Philosophy**: διαίρεσις (division, a cutting-apart) — marking where the work divides, not sequencing the pieces. Core principle: **Delimit over Order**. The cut into units is settled before the units are ordered; sequencing them is `/conduct`'s work, so the two are duals across one seam — cut, then conduct. The external WBS is referenced, never owned (**Reference over Ownership**), so the WorkUnitMap sees downstream changes instead of going stale. Workflow position: cross-cutting, Hybrid initiator — partitions a work body before its method is conducted. Game feel: "this is too big for one go — where do I cut it?" → find the joints → settle each cut → emit a WorkUnitMap for `/conduct`.

## Composition Patterns

Real sessions rarely use a single protocol. Composition — invoking multiple protocols together — is often more valuable than any isolated call. Three patterns that appear most in practice:

### `/recollect * /inquire` — Recalled context plus fresh facts

When you say "find me that café we talked about — and check if it's open today." `/recollect` resolves the vague recall ("that café") into the specific prior discussion, then `/inquire` grounds the freshness-required fact (today's hours) in verifiable sources.

**Shape**: empty intention → recognized prior context → grounded current fact.

### `/attend * /contextualize` — Guardrail-compiled execution plus context-fit check

When you say "run the inbox cleanup while I'm out, and check it actually fits my inbox style after." `/attend` compiles the cleanup's boundaries into verifiable conditions for the autonomous run (what counts as done, what must remain untouched), then `/contextualize` checks that the resulting state matches the accumulated context you've established (your actual email habits, not a generic clean inbox).

**Shape**: pre-execution guardrail compilation → post-execution context-fit.

### `/sublate * (downstream)` — Pre-execution vetting plus deficit-matched handoff

When you say "stress-test the context I've gathered before the meeting share — and reroute anything that turns out to be a different kind of problem." `/sublate` tests each source via dialectical antithesis (provenance / counterfactual / cross-source); sources whose surfaced concern belongs to a different protocol family get **Routed** rather than refined in place. Typical handoffs: a gap surfaced in the user's decision → `/gap`, an execution boundary needing compiled guardrails → `/attend`, post-execution applicability → `/contextualize`, undefined ownership → `/bound`. Pre-execution counterpart to `/contextualize` (which vets after the fact). When a single source maps to multiple handoff targets, surface them in execution-order priority — pre-execution handoffs (`/bound`, `/gap`, `/attend`) precede post-execution ones (`/contextualize`).

**Shape**: per-source antithesis → disposition → handoff routing where the deficit belongs to another protocol family.
