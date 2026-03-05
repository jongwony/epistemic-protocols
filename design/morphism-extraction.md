# MORPHISM Extraction: Design Decision History

## Decision

**Where to store type transition metadata for protocols?**

### Options Considered

| Option | Location | Granularity | Co-change |
|--------|----------|-------------|-----------|
| A | `graph.json` `types` field | Graph-level | graph.json만 수정 |
| B | SKILL.md `── MORPHISM ──` section | Protocol-level | SKILL.md + plugin.json |

### Timeline

1. **graph.json v3.0.0** — `types` field 추가. 각 node에 `source`, `target`, `morphism` 메타데이터를 graph-level에서 관리하려는 시도.
2. **3-perspective cross-validation** — Syneidesis pilot로 Type Theory, Category Theory, Operational Semantics 관점에서 검증.
3. **graph.json v2.0.0 revert** — `types` field 제거. MORPHISM을 각 SKILL.md 내 Definition code block에 배치하는 것으로 결정.

### Decision: Option B (SKILL.md 내 MORPHISM 섹션)

## 3-Perspective Cross-Validation Results

### 1. Type Theory Perspective

**질문**: MORPHISM은 어디에 속하는가?

MORPHISM은 타입 수준의 변환을 기술한다: `SourceObject → TargetObject`. 이 변환은 FLOW의 각 단계가 어떤 타입을 생산하는지를 명시한다. TYPES 섹션이 개별 타입을 정의하고, FLOW가 연산 순서를 정의하므로, MORPHISM은 이 둘 사이의 bridge — **FLOW의 타입 수준 요약**이다.

**핵심 발견 — Deficit Elision**: Layer 0 (Type line)은 `GapUnnoticed`를 입력 타입으로 선언하지만, FLOW/MORPHISM은 `Decision`에서 시작한다. deficit은 **입력 타입이 아닌 전제조건 타입**이다.

> "The deficit qualifies *when* the protocol fires, not *what* it transforms. This is analogous to a typeclass constraint in Haskell: `GapUnnoticed D => D -> AuditedDecision`."

이 발견으로 `requires` + `deficit` 분리가 확립됨.

**결론**: MORPHISM은 FLOW와 TYPES 사이에 위치해야 한다. graph.json에 분리하면 타입 정의와의 인접성이 깨진다.

### 2. Category Theory Perspective

**질문**: FLOW와 MORPHISM의 관계는 무엇인가?

두 개의 구별되는 범주: C_op (operational, FLOW — 객체는 데이터 타입)과 C_epist (epistemic, MORPHISM — 객체는 인식 상태). 이 둘은 **forgetful functor**로 연결된다.

> "There exists a forgetful functor `U: C_op -> C_epist` that maps `{D} |-> Decision`, `{Σ'} |-> AuditedDecision`, forgets intermediate computational objects `{G, Gₛ, Q, J}`, forgets tool annotations."

```
F: FLOW → MORPHISM
F(phase_with_tool) = transformation_verb    -- tool annotation 제거
F(type_checkpoint) = type_checkpoint        -- 타입은 보존
```

이 관계에서 핵심 성질:
- **1:1 mapping**: MORPHISM의 모든 요소는 FLOW에 대응물이 있어야 함
- **No additional structure**: MORPHISM에만 있고 FLOW에 없는 타입은 위반
- **Derivability**: MORPHISM은 FLOW에서 기계적으로 도출 가능

**`preserves` 교정**: 원래 `preserves: original context and user intent of Decision`이었으나, intent는 타입 D의 구성요소가 아님. `preserves: D`로 교정.

> "`preserves: intent` is categorically inconsistent — intent is NOT a component of type D. You cannot preserve what is not part of the object's structure."

**결론**: MORPHISM은 FLOW에서 도출되므로, FLOW와 물리적으로 인접해야 한다. 별도 파일(graph.json)에 두면 functor 관계의 검증이 어렵다.

### 3. Operational Semantics Perspective

**질문**: MORPHISM은 런타임에 어떤 역할을 하는가?

FLOW는 operational semantics — 각 Phase가 어떤 tool을 호출하고 어떤 상태 전이를 수행하는지 기술한다. MORPHISM은 이 operational detail을 strip한 **denotational summary** — "무엇이 변환되는가"만 남긴다.

PHASE TRANSITIONS가 FLOW의 구현이고, MORPHISM이 FLOW의 추상화이므로:

```
MORPHISM (denotational) ← FLOW (specification) → PHASE TRANSITIONS (operational)
```

FLOW를 중심으로 추상화(MORPHISM)와 구현(PHASE TRANSITIONS)이 양방향으로 펼쳐지는 구조.

**결론**: MORPHISM은 FLOW의 denotational counterpart이므로, FLOW 직후에 위치해야 한다. graph.json에 분리하면 specification과 denotation의 일관성 유지가 어렵다.

## Unanimous Convergence Points

Cross-validation에서 세 관점이 만장일치로 수렴한 결정들:

| # | 결정 | 근거 |
|---|------|------|
| 1 | graph.json `types` 제거 | Type: redundant/unvalidated. Category: Layer 혼재. Ops: sync burden |
| 2 | `preserves: D` (typed entity) | Category: intent ∉ D. Ops: D is never modified |
| 3 | `requires` + `deficit` 분리 | Type: deficit=precondition, not input. Ops: 두 게이트는 sequential |
| 4 | graph.json edge reclassification | precondition=preorder, advisory=digraph, suppression=constraint, transition=functor |
| 5 | `aborts:` clause 보류 | 문서 개선이지 정확성 문제가 아님 |

### Architecture Decision Reversal

```
Blueprint 제안     → Pilot 시도       → Cross-validation 결과
graph.json = types → types 추가 (v3)  → types 제거 (v2) ← SKILL.md가 single source
별도 Layer 0       → graph.json 확장  → 불필요 ← 기존 메커니즘 충분
preserves: intent  → as-is            → preserves: D ← formal structure만
```

## Why Not graph.json?

graph.json은 **프로토콜 간** 관계(edges)를 관리한다: precondition, advisory, suppression, transition. 이는 inter-protocol topology이다.

MORPHISM은 **프로토콜 내** 구조이다: 단일 프로토콜의 FLOW에서 도출된 타입 변환. 이는 intra-protocol anatomy이다.

graph.json에 `types`를 두면:
1. **Granularity mismatch**: Inter-protocol graph에 intra-protocol metadata가 혼재
2. **Co-change debt**: SKILL.md의 FLOW 변경 시 graph.json도 동기화 필요 (cross-file co-change)
3. **Derivability violation**: MORPHISM이 FLOW에서 도출되는데, 도출 source와 result가 다른 파일에 위치
4. **Verification complexity**: FLOW↔MORPHISM 정합성 검증이 cross-file grep 필요

## MORPHISM Anatomy

```
── MORPHISM ──
SourceObject
  → verb(args)                     -- English comment
  → verb(args)                     -- English comment
  → TargetObject
requires: [Phase 0 gate]             -- runtime gate
deficit:  [epistemic deficit]         -- activation precondition
preserves: [read-only entity]        -- typed entity not modified
invariant: [Core Principle]           -- behavioral constraint
```

### Placement

FLOW와 TYPES 사이, Definition code block 내부.

### Derivation Rule

1. Source/Target → Type line에서 추출
2. Morphism chain → FLOW에서 tool annotation 제거 + Phase prose의 동사와 정합
3. requires → Phase 0 gate predicate
4. deficit → Type line 첫 번째 요소
5. preserves → TYPES 분석으로 불변 엔티티 식별
6. invariant → Core Principle 섹션

### Special Cases

| Protocol | Special handling |
|----------|-----------------|
| Prothesis | Sequential intermediate type `LensEstablished`. Mode 1/2 분기는 LOOP으로 이동 |
| Epitrope | 3-entry convergence at `DecomposedDomains`. Entry selection을 단일 step으로 추상화 |
| Prosoche | Intermediate type `ClassifiedActions`. p=Low pass-through, p=Elevated full evaluation |
| Aitesis | X mutated → preserves task intent, not X itself |
| Epharmoge | Dual source `(R, X)` → preserves X (context as fixed reference) |

## Relationship to graph.json

graph.json은 `edge_types`로 inter-protocol 관계의 categorical semantics를 기술한다 (v2.1.0). MORPHISM은 intra-protocol type transition을 기술한다. 두 메커니즘은 서로 다른 수준에서 프로토콜 구조를 formalize한다:

- **graph.json**: Protocol-as-node. 프로토콜 간 위상 (topology)
- **MORPHISM**: Protocol-as-morphism. 프로토콜 내 변환 (transformation)
