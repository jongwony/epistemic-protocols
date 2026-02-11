# Write Workflow Reference

Detailed phase descriptions and content transformation rules for the write skill.

## Phase Details

### Phases 1-3: Prothesis Protocol

**Purpose**: Multi-perspective epistemic analysis before content generation.

**Delegation**: These phases follow the Prothesis protocol (/mission) exactly.

```
Phase 0: G(U) → C              -- Context acquisition
Phase 1: C → {P₁...Pₙ}(C) → Pₛ -- Perspectives derived FROM context
Phase 2: Pₛ → ∥I(Pₛ) → R       -- Parallel inquiry with Horizon Limits
Phase 3: R → Syn(R) → L        -- Synthesis: convergence, divergence, assessment
```

**Key Protocol Elements**:
- Perspectives derived from context (not predefined domain mappings)
- Parallel inquiry includes explicit Horizon Limits per perspective
- Synthesis produces Lens L = { convergence, divergence, assessment }

**Subagent Prompt Template** (from Prothesis):
```
You are a **[Perspective] Expert**.

Analyze from this epistemic standpoint:

**Question**: {original question verbatim}

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals
2. **Framework Analysis**: Domain-specific concepts, terminology
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct answer from this viewpoint
```

**Boundary**: Synthesis complete → Lens L available.

**Reference**: `prothesis/skills/mission/SKILL.md`

---

### Phase 4: Format Decision

**Purpose**: Determine output artifact type before synthesis work.

**Options**:

| Format | Characteristics |
|--------|----------------|
| Blog Post | Conversational, hook-driven, 1500-3000 words |
| Essay | Formal, thesis-driven, structured arguments |
| Newsletter | Personal, timely, call-to-action |
| Thread | Bite-sized, sequential, self-contained points |

**Language Options**: Korean (default), English, source-match

**Tool**: `AskUserQuestion`

**Boundary**: Format and language selected.

---

### Phase 5: Draft Generation

**Purpose**: Create initial content artifact.

**File Location**: `~/.claude/.write/YYYY-MM-DD-{topic-slug}.md`

**Required Sections**:
1. **Hook** — Problem/tension that motivates reading
2. **Context** — Minimal, just enough for understanding
3. **Core Framework** — The novel contribution
   - Definition
   - Components (≤5 for cognitive manageability)
   - Relationships
4. **Application** — How to use it
5. **Implications** — What changes if adopted

**Tool**: `Write`

**Boundary**: Draft file created.

---

### Phase 6: Iterative Refinement

**Purpose**: Improve content based on user feedback.

**Feedback Types**:

| Type | Action |
|------|--------|
| Incremental | `Read` → `Edit` (targeted changes) |
| Structural | Generate option versions (A, B, C) as separate files |

**Version Naming**: `{base}-option-a.md`, `{base}-option-b.md`

**Loop Control**:
- Continue while feedback is incremental
- Exit to Phase 6b (Structural Decision) when major restructure needed
- Exit to Phase 7 when user signals satisfaction

**Tools**: `Read`, `Edit`, optionally `Write` for new versions

---

### Phase 6b: Structural Decision

**Purpose**: Handle major restructures through divergent options.

**Trigger**: User requests concept removal, reorganization, or significant scope change.

**Process**:
1. Generate 2-3 option versions as separate files
2. Present comparison summary
3. `AskUserQuestion` for selection
4. Continue with selected version

**Pattern**: Options as files, not descriptions — enables tangible comparison.

---

### Phase 7: Gap Detection

**Purpose**: Surface overlooked issues before finalization.

**Invocation**: `/gap` or manual gap scanning

**Gap Types**:
- **Procedural**: Missing steps in workflow
- **Consideration**: Unweighed factors
- **Duplicate**: Redundant content
- **Alternative**: Unexplored options

**Resolution**:
- User addresses or dismisses each gap
- Apply accepted changes via `Edit`

**Boundary**: No critical gaps remain.

---

### Phase 8: Finalization

**Purpose**: Polish and clean up.

**Actions**:
- Final language/style edits
- Remove intermediate version files (optional, ask user)
- Confirm final file location

**Boundary**: User approves final draft.

---

## Content Transformation Rules

### Selection Criteria

A session becomes write-worthy when it exhibits:

| Criterion | Indicator |
|-----------|-----------|
| Novel Framework | New mental model or conceptual structure |
| Problem-Solution Arc | Clear challenge with resolution path |
| Generalizable Insight | Specific case yields transferable principle |
| Conceptual Tension | Productive contradiction worth exploring |
| Actionable Output | Concrete methodology or next steps |

**Anti-criteria** (filter out):
- Pure implementation details without conceptual insight
- Routine debugging without novel pattern recognition
- Session fragments without coherent arc

### Transformation Logic

**Abstraction Lift**: Specific incident → General pattern
- "EKS pod failure" → "symptom-cause gap in distributed systems"

**Narrative Condensation**: Chronological exploration → Logical structure
- Session order ≠ Blog order

**Insight Extraction**: Multi-turn dialogue → Distilled principles
- 10 exchanges about cognitive load → "3-concept limit per section"

### What Gets Filtered

| Element | Reason |
|---------|--------|
| Tool invocations | Implementation noise |
| Trial-and-error steps | Obscures insight clarity |
| Internal coordination | Process, not content |
| Redundant restatements | Cognitive load |
| Context-specific details | Non-transferable |

---

## Quality Metrics

### Concept Density Limits

| Metric | Limit | Rationale |
|--------|-------|-----------|
| New concepts per section | ≤3 | Working memory constraint |
| Framework components | ≤5 | Chunking limit |
| Abstraction layers | ≤2 per explanation | Comprehension depth |
| External references | 1-2 per major point | Authority without overload |

### Structure Requirements

- Section ≤500 words before subheading break
- Each section has clear single purpose
- Progressive disclosure (summary → detail)

### Language/Style

**Korean output**:
- Terminology: English term → Korean explanation
- Sentence structure: Topic → elaboration → implication
- Tone: Analytical but accessible

---

## External References

### Function Matrix

| Reference Type | Function |
|---------------|----------|
| Authority citation | Legitimize novel claim |
| Conceptual anchor | Connect to known framework |
| Contrast point | Define by differentiation |
| Evidence | Support empirical claim |

### Cross-Linking Rules

1. Reference only when adding understanding, not credentialism
2. Point to deeper exploration, not required reading
3. Ensure alignment with post's thesis
4. Distinguish "inspired by" vs "extends" vs "contradicts"

---

## Reusable Patterns

### Prothesis Protocol Pattern
```
Context → Derive perspectives → User selects → Parallel inquiry (with Horizon Limits) → Synthesis
```
Reference: `/mission` — canonical implementation of multi-perspective epistemic analysis

### Incremental Refinement Loop
```
While (feedback is incremental):
    Read current → Edit targeted → Report change
Until (structural change requested)
```

### Gap Surfacing Pattern
```
Near-final state → Invoke gap detector → Surface as questions → User decides
```
