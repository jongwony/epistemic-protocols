# Aitesis Extension: Empirical Enrichment Path

## Problem

Aitesis Phase 1 (Context Collection) is scoped to read-only investigation. When a definitive answer is not found in existing files, the uncertainty proceeds to Phase 2 where AskUserQuestion presents it to the user.

However, some uncertainties are **empirically enrichable** — the AI can gather evidence by testing the environment before asking the user. Moreover, "sufficient context" is not merely "sufficient facts": context insufficiency spans multiple dimensions — missing facts, incoherent facts, and facts not relevant to goals. Example from session `1856762b`:

```
Uncertainty: "Does Claude Code process `skills:` frontmatter in SKILL.md?"
Current resolution: AskUserQuestion → user answers "지원됨"
Better approach (enriched): Create test skill with `skills:` field → invoke → observe
  → probe evidence + AskUserQuestion("skills: frontmatter가 지원됩니다. 활용하시겠습니까?")
```

Asking the user without empirical context is:
1. Improvable (probe evidence improves question quality — context-free questions vs. evidence-backed questions)
2. Potentially unreliable (user might not know either)
3. A Defensive Fallback instance (defaulting to asking when enrichment is possible)

The protocol's identity extends beyond factual resolution: **context sufficiency sensor + factual resolver + epistemic router**. It senses multi-dimensional insufficiency, self-resolves factual dimensions, and routes non-factual dimensions to downstream protocols.

## Structural Analogy

This is isomorphic to the review skill's Mechanical Fix problem (session `1856762b`):

| Layer | Problem | Root Cause |
|-------|---------|------------|
| Review skill | Asks user before applying mechanical fixes | Entropy ≈ 0, but no rationale for autonomous execution |
| Aitesis protocol | Asks user before verifiable uncertainties | Verifiability ≈ 1, but no empirical enrichment path |

Both cases: the system asks where it should act. The resolution pattern is the same — **classify first, then route to the appropriate resolution/enrichment path**.

## Design: Phase 1 Extension

### Current Phase 1 Flow

```
Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ)
      ↑ Read/Grep only
```

For each uncertainty:
- Definitive answer found → `Uᵣ` (context-resolved)
- Partial/no evidence → `Uᵢ'` (enriched, retained for Phase 2)

### Extended Phase 1 Flow

```
Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) → classify(Uᵢ', dimension) →
  ├─ Factual/ReadOnly     → Ctx+(Uᵢ') → Uᵣ'      (resolved, Phase 2 스킵)
  ├─ Factual/Probe        → EmpiricalProbe(Uᵢ') → Uₑ       (enriched, Phase 2 evidence)
  ├─ Factual/UserDep      → Uᵢ''                    (Phase 2 직행)
  ├─ Coherence            → Uₙ → classify summary with routing target
  └─ Relevance            → Uₙ → classify summary with routing target
```

New output sets: `Uᵣ'` (read-only verified, resolved). `Uₑ` (probe-enriched, with evidence). `Uₑ` (with evidence) + `Uᵢ''` proceed to Phase 2. Non-factual dimensions are detected and shown with routing target in classify summary.

### Phase structure preservation

No new phases. The extension lives inside Phase 1 as a sub-step after context collection. The phase transition table changes minimally:

```
-- Current:
Phase 1: Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ)                             -- context collection [Tool]

-- Extended:
Phase 1: Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) → classify(Uᵢ', dimension) → (Uᵣ', Uₑ, Uᵢ'', Uₙ) -- context collection + classify + empirical enrichment [Tool]
```

## New Types

```
── TYPES (additions, revised) ──
-- Layer 1 (epistemic)
Dimension    ∈ {Factual, Coherence, Relevance} ∪ Emergent(Dimension)
               -- open set; external human communication excluded
Observability ∈ {StaticObservation, DynamicObservation, BeliefVerification}
               -- exists(fact, env) sub-modes

-- Layer 2 (tool implementation)
Verifiability ∈ {ReadOnlyVerifiable, ProbeEnrichable, UserDependent}
               -- tool-level routing (Layer 2, Factual dimension only)

-- classify: fibration (Σ-type over Dimension)
classify   = Uᵢ' → Σ(d: Dimension). Fiber(d)
             where Fiber(Factual)       = Verifiability
                   Fiber(Coherence)     = Unit    -- detect only
                   Fiber(Relevance)     = Unit    -- detect only
                   Fiber(Emergent(_))   = Unit    -- detect only (default; refinable per discovered dimension)
             -- Layer 2 exists only over Factual fiber (fibration, not functor)
             -- Coherence/Relevance → detect + show routing target in classify summary

ProbeSpec  = { setup: Action, execute: Action, observe: Predicate, cleanup: Action }
EmpiricalProbe = (Uᵢ', ProbeSpec) → Uₑ           -- empirical enrichment (distinct from Horismos Probe)
Uᵣ'        = Read-only verified uncertainties    -- resolved (no Phase 2)
Uₑ         = Probe-enriched uncertainties        -- evidence attached, proceeds to Phase 2
Uᵢ''       = Remaining user-dependent uncertainties  -- Fiber(Factual) = UserDependent; Phase 2 question
Uₙ         = Non-factual detected uncertainties     -- Fiber(d) = Unit; shown in classify summary with routing target
Action     = Tool call sequence (Write, Bash)
```

## Classification Criteria

### Layer 1 (Epistemic — stable)

```
-- Factual dimension
factual(U) ≡ ∃ fact(F) : missing(F, context) ∧ required(F, execution)

-- Coherence dimension
coherence(U) ≡ ∃ facts(F₁, F₂) : collected(F₁) ∧ collected(F₂) ∧ ¬consistent(F₁, F₂)

-- Relevance dimension
relevance(U) ≡ ∃ fact(F) : collected(F) ∧ ¬relevant(F, goal(X))
```

### Layer 2 (Tool — Factual dimension only)

```
read_only_verifiable(U) ≡
  factual(U) ∧ ∃ fact(F) :
    exists(F, env) ∧                   -- Layer 1: 사실이 환경에 존재
    observable(F, current_tools)        -- Layer 2: 현재 도구로 관찰 가능

probe_enrichable(U) ≡
  factual(U) ∧ ∃ fact(F) :
    ¬exists(F, env) ∧ creatable(F) ∧   -- Layer 1: 생성이 필요한 사실
    reversible(creation(F)) ∧           -- Layer 2: 안전 제약
    bounded(creation(F), time < 30s)
```

### Observability Sub-modes

| Sub-mode | 설명 | exists 상태 | 도구 예시 |
|----------|------|------------|----------|
| StaticObservation | 파일/설정에 존재 | exists, static | Read, Grep |
| DynamicObservation | 런타임 행동에 존재 | exists, dynamic | Bash (execution) |
| BeliefVerification | 알고 있다고 생각하나 재검증 필요 | exists, uncertain | Read, Grep, WebSearch |

### Classification Table

| Criterion | Read-Only Verifiable | Probe-Enrichable | User-Dependent |
|-----------|---------------------|-------------------|----------------|
| Answer source | Existing files, codebase state | Environment state, runtime behavior | Human knowledge, preferences, business context |
| Tools required | Read, Grep | Write, Bash (+ Read for observe) | N/A (AskUserQuestion) |
| Examples | Spec에 필드 정의 여부, 설정 파일 존재 여부 | Feature 동작 여부, API 호환성, PoC 레벨 검증 | Requirements, priorities, conventions not documented, domain decisions |
| Resolution | Resolved (Phase 2 스킵) | Enriched (evidence → Phase 2) | Phase 2 직행 |
| Distinction | 이미 존재하는 정보 확인 | 설치/생성이 필요한 PoC | 사용자 판단 필요 |
| Dimension | Factual only | Factual only | Factual / Coherence / Relevance |

## Probe Design Constraints

1. **Minimal**: Create the smallest possible test artifact
2. **Reversible**: All probe artifacts must be cleaned up after observation
3. **Sandboxed**: Probes must not modify existing project files. Use temp directories or isolated test files
4. **Transparent**: Log probe setup, execution, observation, and cleanup for user auditability
5. **Bounded**: 30-second timeout. Timeout → fall back to user inquiry
6. **Risk-aware**: If probe requires elevated-risk actions (network calls, system modifications), classify as user-dependent instead. Delegate risk assessment to Prosoche if available

### Probe Lifecycle

```
1. Setup    → Create test artifact (Write to temp location)
2. Execute  → Run test (Bash)
3. Observe  → Check result (Read/Grep)
4. Cleanup  → Remove test artifact (Bash: rm)
5. Record   → Log (probe_spec, result, evidence) in Λ.probe_history
```

## TOOL GROUNDING Changes

```
-- Current:
Phase 1 Ctx   (collect)  → Read, Grep (context collection); WebSearch (conditional)

-- Extended:
Phase 1 Ctx     (collect)   → Read, Grep (context collection); WebSearch (conditional)
Phase 1 Classify (assess)   → Internal analysis (multi-dimension assessment)
                               + Read, Grep (coherence: multi-file relation analysis)
Phase 1 Probe   (enrich)    → Write, Bash, Read (empirical enrichment, Factual only)
Phase 2 Q       (transparent) → AskUserQuestion (mandatory: classify result + uncertainty surfacing)
```

## MODE STATE Changes

```
-- Current:
Λ = { phase, X, uncertainties, context_resolved, user_responded, remaining, dismissed, history, active, cause_tag }

-- Extended:
Λ = { phase, X, uncertainties,
      classify_results: Map(Uncertainty, Σ(d: Dimension). Fiber(d)),  -- 분류 결과 (fibration)
      context_resolved, read_only_resolved, probe_enriched,
      non_factual_detected,                                          -- Uₙ: Fiber(d) = Unit, classify summary routing
      user_responded, remaining, dismissed,
      history, probe_history, active, cause_tag }

-- Updated invariant:
uncertainties = context_resolved ∪ read_only_resolved ∪ probe_enriched ∪ non_factual_detected ∪ user_responded ∪ remaining ∪ dismissed (pairwise disjoint)

-- Partition semantics:
-- read_only_resolved ⊆ terminal (Phase 2 스킵, context_resolved와 동일 역할)
-- probe_enriched ⊆ Phase 2 input (evidence 포함, resolved가 아닌 enriched)
```

## FLOW Update

```
-- Current:
Aitesis(X) → Scan(X) → Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) → Q(Uᵢ', priority) → A → X' → (loop until informed)

-- Extended:
Aitesis(X) → Scan(X, dimensions) → Uᵢ → Ctx(Uᵢ) → (Uᵢ', Uᵣ) →
  classify(Uᵢ', dimension) → (Uᵣ', Uₑ, Uᵢ'', Uₙ) →
  Q(classify_result + Uₑ + Uᵢ'', priority) → A → X' → (loop until informed)
  -- Phase 2 AskUserQuestion에 classify 결과 통합 (Always show = Phase 2 형식 확장)
  -- show()는 별도 단계가 아닌 Phase 2 내부 형식

-- Uₙ (non-factual): shown in classify summary with routing target
-- Uᵢ'' (factual/user-dependent): Phase 2 question candidates
```

## MORPHISM Update

```
-- Current:
ExecutionPlan
  → scan(plan, context)                -- infer context insufficiency
  → collect(uncertainties, codebase)   -- enrich via evidence collection
  → surface(uncertainty, as_inquiry)   -- present highest-gain uncertainty
  → integrate(answer, plan)            -- update execution plan
  → InformedExecution

-- Extended:
ExecutionPlan
  → scan(plan, context, dimensions)      -- infer context insufficiency (multi-dimension)
  → collect(uncertainties, codebase)     -- enrich via evidence collection
  → classify(enrichable, dimension)      -- epistemic classification (core act)
  → enrich(factual_enrichable, environment) -- empirical probe (factual only)
  → surface(classify_result + enriched + remaining, as_inquiry)
  → integrate(answer, plan)
  → InformedExecution
```

## Rules Changes

Rule 3 (Context collection first) extended:

```
-- Current:
3. Context collection first: Before asking the user, collect contextual evidence
   through Read/Grep codebase exploration to enrich question quality (Phase 1)

-- Extended:
3. Context collection first, epistemic classification second: Before asking the user,
   (a) collect contextual evidence through Read/Grep,
   (b) classify uncertainties by dimension (Factual/Coherence/Relevance) and verifiability,
   (c) show classification transparently in Phase 2,
   (d) for Factual/ReadOnly: resolve directly,
   (e) for Factual/Probe: run empirical probes to attach evidence,
   (f) for Coherence/Relevance: detect and show routing target in classify summary.
```

Rule 13 extended:

```
13. Evidence before inquiry: When an uncertainty is probe-enrichable
    (deterministic, reversible, bounded probe exists), enrich the question with
    empirical evidence; for read-only verifiable facts, resolve directly.
    User inquiry is for judgment — not for facts the AI can discover.
    Classification is the protocol's core epistemic act, not a routing sub-step.
```

New rule:

```
14. Always show: classify results are always presented transparently in Phase 2.
    User can override classification without explicit approval step.
    "보이는 기본, 묻는 예외."
```

## Phase 2 Classification Transparency

Phase 2 AskUserQuestion에 classify 결과를 항상 포함:

```
"다음 컨텍스트 부족을 감지했습니다:
  U1: Factual/ReadOnly (근거: spec 파일에 필드 정의 존재)
  U2: Factual/Probe (근거: 런타임 동작 확인 필요, Write/Bash)
  U3: Coherence (근거: API v2 설정과 deployment target 간 불일치)
       → /ground 제안

  수정할 분류가 있습니까?

  [기존 Phase 2 질문 계속...]"
```

원칙: **"보이는 기본, 묻는 예외"** — 분류를 항상 보여주되, 승인은 불필요. 사용자는 이의 제기 시에만 대화한다.

## UX Safeguards Addition

```
| Probe transparency          | Log probe lifecycle in Λ.probe_history            | User can audit what was tested |
| Probe cleanup               | All test artifacts removed after observation        | No residual files |
| Probe timeout               | 30s limit → fall back to user inquiry              | Prevents hanging |
| Probe risk gate             | Elevated-risk probes → reclassify as user-dependent | Safety preserved |
| Classify transparency       | Always show classify results in Phase 2             | User sees AI's reasoning |
| Dimension-specific presentation | Dimension + Verifiability in surfacing format    | User understands resolution path |
```

## Scope Restriction Update

Current Phase 1 says: "Scope restriction: Read-only investigation only. No test execution or file modifications."

This changes to:

```
Scope restriction:
- Context collection: Read-only investigation (Read, Grep, WebSearch). — core preserved
- Read-only verification: Extended context lookup for verifiable facts (Read, Grep). — resolves directly
- Empirical enrichment (sub-step): Minimal, reversible test execution (Write to temp, Bash, Read, cleanup).
  Probe artifacts must be created in temp locations and cleaned up after observation.
  Probes must not modify existing project files.
  Probe results are evidence for Phase 2, not resolution — enrichment, not replacement.
```

## Example: `skills:` Frontmatter — 2-Track Resolution

Applying the extended flow to the session `1856762b` scenario:

```
Phase 0: Scan detects two uncertainties:
  U1: "Does the spec define `skills:` frontmatter?"
  U2: "Does `skills:` frontmatter actually load dependent skills at runtime?"

Phase 1 (Ctx): Grep SKILL.md files, docs for `skills:` → partial evidence.

Phase 1 (classify, always show):
  "다음 컨텍스트 부족을 감지했습니다:
    U1: Factual/ReadOnly — 'skills: frontmatter가 spec에 정의되어 있는가?'
        (근거: SKILL.md spec 파일에서 확인 가능)
    U2: Factual/Probe — 'skills: frontmatter가 실제 런타임에 동작하는가?'
        (근거: Write/Bash로 테스트 필요)

    수정할 분류가 있습니까?"
  → 사용자: 없음 (또는 U1을 Probe로 수정)

Track 1 — ReadOnly (U1, 사용자 수정 없을 시):
  Grep spec/docs → skills: 필드 정의 확인
  Result: Resolved → Λ.read_only_resolved (Phase 2 스킵)

Track 2 — Probe (U2):
  Setup:    Write /tmp/test-skills-frontmatter/SKILL.md with skills: dependency
  Execute:  Invoke skill, check if dependent skill's context appears
  Observe:  Grep output for dependent skill content
  Cleanup:  rm -rf /tmp/test-skills-frontmatter/
  Result:   Evidence recorded → Λ.probe_enriched (Phase 2로 전달)

Phase 2: Uₑ = {U2 with evidence "skills: frontmatter 동작 확인됨"}
         → AskUserQuestion("skills: frontmatter가 지원됩니다. 활용하시겠습니까?")
         → Evidence-backed question (not context-free question)
```

## Impact on Protocol Ecosystem

### Co-change Requirements

| Change | File |
|--------|------|
| SKILL.md formal block + Phase 1 prose | `aitesis/skills/inquire/SKILL.md` |
| Core Principle update | Same file (add empirical verification rationale) |
| Rules update (Rule 3, new Rule 13, 14) | Same file |
| UX Safeguards update | Same file |
| Plugin version bump | `aitesis/.claude-plugin/plugin.json` |
| CLAUDE.md Aitesis description | `CLAUDE.md` (if Phase 1 scope description changes) |
| Static checks | Verify TOOL GROUNDING includes Write/Bash for Phase 1 Probe |
| Static checks (partition) | `static-checks.js` partition-invariant: `probe_enriched`, `classify_results` |

### No Impact On

- Phase 2 (AskUserQuestion) — receives enriched uncertainties with probe evidence attached (format extended with classify results)
- Phase 3 (Plan Update) — unchanged
- Other protocols — no interface changes
- graph.json — no new edges or nodes (routing shown in classify summary)
- Initiator taxonomy — still AI-guided

### Core Principle Preservation

"Inference over Detection" remains valid. The extension adds: **"Evidence before Inquiry"** as a sub-principle — when context can be empirically enriched, gather evidence before asking. This is consistent with the existing principle's spirit: the AI proactively improves question quality through evidence collection, and resolves read-only verifiable facts directly rather than asking.

## Protocol Identity

Aitesis = context sufficiency sensor + factual resolver + epistemic router

- **Sensor**: 다차원 컨텍스트 충분성 감지 (Factual + Coherence + Relevance)
- **Resolver**: Factual dimension의 self-resolution (ReadOnly/Probe)
- **Router**: Non-factual dimension의 downstream protocol 제안 (classify summary routing)

이 정체성이 Explore subagent, 모델 향상과 직교하는 인식론적 영역:
- 도구가 강력해져도 "이 컨텍스트가 실행에 충분한가?"라는 다차원 판단은 인간-AI 공동 작업
- classify() 행위 자체가 프로토콜의 고유 가치 — "관찰/생성 경계를 함께 발견하는 대화"

외부화 원리 (Externalization):
- 관찰 가능(exists) → 내부 해결 (AI-spec, Read/Grep/Probe)
- 생성 필요(¬exists ∧ creatable) → 외부화 — 사용자에게 명시적 컨텍스트 요청
- 외부화 ≠ 사람간 의사소통: 자동 컨텍스트 수집 불가한 영역을 사용자가 명시적으로 제공할 때 동작
- 외부 사람과의 소통이 필요한 영역은 프로토콜 범위 밖 (Syneidesis #12)

구조적 성격 — Fibration (Functor가 아님):
- 2-layer model은 Grothendieck fibration: p: E → B where B = Dimension
- Fiber(Factual) = {ReadOnlyVerifiable, ProbeEnrichable, UserDependent} — 풍부
- Fiber(Coherence) = Fiber(Relevance) = Unit — 퇴화 (detect only)
- Layer 2의 존재 자체가 Layer 1의 Factual dimension에 의존하는 구조
- classify 시그니처: Σ-type = Σ(d: Dimension). Fiber(d) (product type이 아님)

직교성 (규범적 설계 공약):
- Layer 2의 도구 선택이 인식론적 분류와 독립이라는 설계 공약 (경험적 예측이 아님)
- 직교성은 각 fiber 내부에서 성립 — global 직교가 아닌 fiber-local 직교
- Layer 2는 모델 발전으로 해결되는 영역; Layer 1은 지속적 인식론적 판단

## Design Decisions (For User Review)

| # | Decision | Options | Recommendation |
|---|----------|---------|----------------|
| D1 | Phase structure | A) Extend Phase 1 with sub-step / B) Add Phase 1.5 | A — minimal structural change, preserves phase numbering |
| D2 | Probe risk boundary | A) All probes autonomous / B) Risk-gate elevated probes to user inquiry / C) Delegate to Prosoche | B — simple, C adds protocol coupling |
| D3 | Probe cleanup failure | A) Warn user / B) Retry once / C) Log and continue | A — transparency over silent recovery |
| D4 | Sub-principle naming | A) "Evidence before Inquiry" / B) "Verification over Inquiry" / C) Fold into existing principle | A — enrichment 패러다임과 정합, B는 대체(resolution) 함의 |
| D5 | `Uₑ` partition membership | A) Merge into `context_resolved` / B) Separate `probe_enriched` set (Phase 2 input) | B — enriched는 resolved가 아님, Phase 2로 evidence 전달 |
| D6 | classify 분류 수 | A) 3분류 (ReadOnlyVerifiable / ProbeEnrichable / UserDependent) / B) 2분류 유지 (SelfVerifiable / UserDependent) | A — read-only resolved vs probe-enriched의 의미론 차이가 분기 기준 정당화 |
| D7 | Context 범위 | A) 사실 부족만 / B) 사실 부족 + 정합성 부족 + 목표 연결 부족 | B — ContextInsufficient = Factual ∪ Coherence ∪ Relevance (확장) |
| D8 | classify 투명성 | A) Always show — 승인 불필요 / B) 승인 필요 / C) 숨김 | A — 이의 제기 시만 대화 (Horismos D2) |
| D9 | Dimension 집합 | A) 열린 집합 (3개 기본 + Emergent) / B) 닫힌 집합 (3개 고정) | A — 외부 사람 소통 제외, Emergent 허용 (Syneidesis #12) |
