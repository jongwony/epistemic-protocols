# Philosopher Database

Reference for `/sophia` — maps 6 behavioral dimensions to philosophical traditions.

Read this file during Phase 2 (matching) to identify the best-fit philosopher for a user's dimension profile.

## Matching Algorithm

For each philosopher, compute a weighted similarity score against the user's 6-dimension profile:

```
similarity(user, philosopher) = Σ(weight_d × (1 - |user_d - philosopher_d| / 100)) / Σ(weight_d)
```

Where `weight_d` is the philosopher's defining dimension weight (1.0 for defining, 0.5 for secondary, 0.25 for others). Dividing by the total weight normalizes the score to the [0, 1] range. Report the top 1-2 matches with reasoning.

**Convention**: "Defining" means the dimension that most characterizes the philosopher,
regardless of whether the score is high or low. Wittgenstein is defined by D4=25 (extremely
contextual) just as Kant is defined by D4=95 (extremely systematic). The similarity formula
handles this correctly: a user with D4=30 scores high similarity with Wittgenstein on D4.

**Threshold logic**:
- similarity >= 0.65: strong match (present as primary)
- 0.55-0.64: moderate match (present primary + suggest composite as alternative)
- < 0.55: no clear match (present composite archetype as primary)

## Philosopher Profiles

### Epistemology — How We Know

#### Socrates (469-399 BCE)
- **Tradition**: Dialectic, elenchus (cross-examination)
- **Core method**: Knowledge through questioning; exposing false beliefs
- **Dimension profile**: D1=45 D2=90 D3=85 D4=30 D5=75 D6=15
- **Defining**: D2 (Verification — relentless questioning of assumed knowledge)
- **Secondary**: D3 (Dialogical — knowledge emerges through dialogue)
- **Distinguishing signal**: High correction frequency + high dialogue depth
- **Protocol affinity**: `/gap` (Syneidesis — surfacing what's unexamined)

#### Descartes (1596-1650)
- **Tradition**: Rationalism, methodological doubt
- **Core method**: Systematic doubt → clear and distinct ideas → certainty
- **Dimension profile**: D1=20 D2=95 D3=25 D4=90 D5=40 D6=10
- **Defining**: D2 (Verification — radical doubt as method)
- **Secondary**: D4 (Systematic — method as foundation of knowledge)
- **Distinguishing signal**: High verification + high rule density + low dialogue
- **Protocol affinity**: `/bound` (Horismos — defining what is certain vs uncertain)

#### Kant (1724-1804)
- **Tradition**: Critical philosophy, transcendental idealism
- **Core method**: Establishing conditions of possibility; categorical frameworks
- **Dimension profile**: D1=30 D2=80 D3=35 D4=95 D5=50 D6=15
- **Defining**: D4 (Systematic — architectonic system of categories)
- **Secondary**: D2 (Verification — critical examination of reason's limits)
- **Distinguishing signal**: Highest rule density + systematic boundary definition
- **Protocol affinity**: `/bound` (Horismos — boundary definition is Kantian critique)

#### Popper (1902-1994)
- **Tradition**: Critical rationalism, falsificationism
- **Core method**: Bold conjectures + rigorous refutation attempts
- **Dimension profile**: D1=85 D2=75 D3=50 D4=65 D5=90 D6=30
- **Defining**: D5 (Attention — focus on unknown, problem-finding)
- **Secondary**: D1 (Abductive — conjecture-first approach)
- **Distinguishing signal**: High exploration + high hypothesis generation + verification for refutation not confirmation
- **Protocol affinity**: `/inquire` (Aitesis — probing for what's missing)

#### Kuhn (1922-1996)
- **Tradition**: Historical philosophy of science
- **Core method**: Normal science (consolidation) punctuated by paradigm shifts
- **Dimension profile**: D1=50 D2=55 D3=45 D4=70 D5=50 D6=40
- **Defining**: D5 (Attention — theorizes both normal science consolidation AND paradigm shift exploration)
- **Secondary**: D4 (Systematic — works within established paradigms during normal science)
- **Distinguishing signal**: Balanced KK/UU ratio reflecting dual nature — consolidation phases punctuated by exploratory paradigm shifts
- **Protocol affinity**: `/contextualize` (Epharmoge — working within context)

### Pragmatism — Knowledge Through Action

#### Peirce (1839-1914)
- **Tradition**: Pragmaticism, semiotics, logic of discovery
- **Core method**: Abduction (inference to best explanation) as primary reasoning
- **Dimension profile**: D1=95 D2=65 D3=55 D4=70 D5=85 D6=25
- **Defining**: D1 (Abductive — invented the concept of abduction)
- **Secondary**: D5 (Attention — inquiry driven by genuine doubt)
- **Distinguishing signal**: Highest inquiry/exploration ratio + systematic but hypothesis-driven
- **Protocol affinity**: `/frame` (Prothesis — perspective selection for inquiry)

#### Dewey (1859-1952)
- **Tradition**: Pragmatism, experimentalism
- **Core method**: Learning through reflective experience; inquiry as problem-solving
- **Dimension profile**: D1=70 D2=50 D3=60 D4=45 D5=60 D6=50
- **Defining**: D1 (Inquiry mode — but more experimental than Peirce)
- **Secondary**: D6 (Delegation — collaborative inquiry, social intelligence)
- **Distinguishing signal**: Moderate across all dimensions + practical orientation
- **Protocol affinity**: `/goal` (Telos — goal co-construction through experience)

### Language & Communication — How We Express

#### Grice (1913-1988)
- **Tradition**: Philosophy of language, conversational pragmatics
- **Core method**: Cooperative Principle — maxims of quantity, quality, relation, manner
- **Dimension profile**: D1=40 D2=70 D3=60 D4=80 D5=45 D6=55
- **Defining**: D4 (Rule-oriented — maxims as conversational governance)
- **Secondary**: D6 (Delegation — cooperative principle assumes partnership)
- **Distinguishing signal**: Expects precise, relevant, grounded responses + correctional when maxims violated
- **Protocol affinity**: `/clarify` (Hermeneia — when expression fails cooperative principle)

#### Wittgenstein (1889-1951)
- **Tradition**: Ordinary language philosophy (later period)
- **Core method**: Language games; meaning as use; family resemblance
- **Dimension profile**: D1=60 D2=55 D3=70 D4=25 D5=65 D6=20
- **Defining**: D4 (Contextual — anti-systematic, meaning depends on use)
- **Secondary**: D3 (Dialogical — philosophy as therapeutic dialogue)
- **Distinguishing signal**: Low rule density + high context sensitivity + adapts approach to situation
- **Protocol affinity**: `/clarify` (Hermeneia — language game mismatches)

### Hermeneutics — How We Understand

#### Gadamer (1900-2002)
- **Tradition**: Philosophical hermeneutics
- **Core method**: Dialogue as fusion of horizons; understanding through conversation
- **Dimension profile**: D1=55 D2=75 D3=95 D4=40 D5=60 D6=65
- **Defining**: D3 (Dialogical — understanding IS dialogue)
- **Secondary**: D6 (Extended Mind — understanding is inherently collaborative)
- **Distinguishing signal**: Highest dialogue depth + co-constructive interaction + iterative refinement
- **Protocol affinity**: `/clarify` (Hermeneia — named after Gadamer's core concept)

### Extended Cognition — How We Think Together

#### Clark (1957-)
- **Tradition**: Extended Mind thesis, embodied cognition
- **Core method**: Cognitive tools as genuine parts of the thinking system
- **Dimension profile**: D1=65 D2=50 D3=55 D4=55 D5=55 D6=95
- **Defining**: D6 (Extended Mind — literally his thesis)
- **Secondary**: D1 (Inquiry — explores boundaries of cognition)
- **Distinguishing signal**: Highest delegation ratio + treats AI as cognitive extension + Task orchestration
- **Protocol affinity**: `/attend` (Prosoche — situated awareness of extended system)

#### Aristotle (384-322 BCE)
- **Tradition**: Virtue epistemology, practical wisdom
- **Core method**: Phronesis — practical wisdom balancing theory and context
- **Dimension profile**: D1=50 D2=70 D3=65 D4=80 D5=50 D6=40
- **Defining**: D4 (Systematic — encyclopedic categorization across all domains of knowledge)
- **Secondary**: D2 (Verification — empirical observation as foundation for systematic classification)
- **Distinguishing signal**: Balanced profile + strong in multiple dimensions without extreme in any
- **Protocol affinity**: `/ground` (Analogia — named after his concept of proportional reasoning)

## Dimension Quick Reference

| Dim | Low label | High label | Measurement basis |
|-----|-----------|------------|-------------------|
| D1 | Deductive | Abductive | exploration_ratio, hypothesis patterns |
| D2 | Trust | Doubt | rejection_rate, verification_depth |
| D3 | Directive | Dialogical | response_time, refinement_cycles |
| D4 | Contextual | Systematic | rule_count, hook_count, constraint_density |
| D5 | Known (KK) | Unknown (UU) | exploration_sessions, protocol_diversity |
| D6 | Self-reliant | Extended Mind | task_delegation, multi-clauding, agent_usage |

## Composite Archetypes

When a user doesn't match a single philosopher well (similarity < 0.65 for all), use composite archetypes:

| Archetype | Dimension pattern | Description |
|-----------|-------------------|-------------|
| The Balanced Practitioner | All dimensions 40-60 | Aristotelian phronesis — adapts approach to context |
| The Systematic Explorer | D4 high + D5 high | Kant meets Popper — rigorous framework for discovery |
| The Collaborative Doubter | D2 high + D6 high | Socrates meets Clark — questions through partnership |
| The Pragmatic Dialogist | D1 moderate + D3 high + D6 high | Dewey meets Gadamer — learns through conversation |
