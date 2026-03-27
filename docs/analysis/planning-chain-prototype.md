# Planning Chain Composition Skill 프로토타입

> 이 문서는 Hermeneia → Telos → Horismos → Aitesis 체인을 단일 `/planning-chain` 스킬로
> 조합할 때의 게이트 배치(gate disposition), 상호작용 절감, 아키텍처를 분석한다.
> 실제 SKILL.md가 아닌 **설계 분석 문서**이다.
>
> **Note (2026-03)**: 이 문서는 Post-Convergence Suggestions가 존재하던 시점에 작성됨.
> Post-Convergence는 이후 제거되고 Output Style nudge로 대체됨 (PR #197).
> 문서 내 Post-Convergence 참조는 당시 아키텍처를 반영한 역사적 기록임.

---

## 배경: 왜 Planning Chain인가

`coexistence-over-mirroring.md`에서 관찰한 안정적 마이크로 조합 패턴 중 "방향 설정"(`clarify → goal`)은 이미 가장 빈번한 2-프로토콜 조합이다. 그러나 실제 계획 수립에서는 목표 정의 후 경계 설정(`/bound`)과 맥락 확인(`/inquire`)까지 이어지는 4-프로토콜 체인이 자연스럽게 발생한다.

graph.json의 precondition 관계가 이를 뒷받침한다:

```
hermeneia →(precondition)→ telos →(precondition)→ horismos →(advisory)→ aitesis
```

이 체인에서 매번 독립 프로토콜을 수동 호출하면:
1. Post-Convergence Suggestion을 읽고 다음 프로토콜을 호출하는 반복 비용
2. 프로토콜 간 이미 해결된 정보를 재확인하는 중복 게이트
3. 전체 계획 과정의 진행 상황을 추적하기 어려운 가시성 부재

Planning Chain은 이 비용을 줄이되, **No silent authority transfer** 불변량을 유지한다.

---

## Morphism

```
PlanningUnclarified(T)
  → scan(T, {IntentMisarticulated, GoalIndeterminate, BoundaryUndefined, ContextInsufficient})
  → Hermeneia.resolve ∘ Telos.resolve ∘ Horismos.resolve ∘ Aitesis.resolve
  → PlannedExecution(T')
invariant: No silent authority transfer — 모든 Qs 게이트는 사용자 응답을 수신하며,
           Qc 게이트의 elision은 catch-chain이 보장될 때만 허용
```

**타입 시그니처**:

```
PlanningUnclarified = (T, Set(Deficit))
PlannedExecution    = (ClarifiedIntent, GoalContract, BoundaryMap, InformedExecution)
Deficit             ∈ {IntentMisarticulated, GoalIndeterminate, BoundaryUndefined, ContextInsufficient}
```

---

## Phase -1: Pre-flight Deficit Scan

체인 실행 전, 4개 결핍 각각의 존재 여부를 사전 점검한다.

```
scan(T) → ∀ d ∈ {IntentMisarticulated, GoalIndeterminate, BoundaryUndefined, ContextInsufficient}:
  present(d) ? → include(d, chain)
  absent(d)  ? → skip(d)
```

**판정 기준**:

| 결핍 | 부재 조건 (skip) |
|------|-----------------|
| IntentMisarticulated | 명시적 인자(`/planning-chain "text"`)이고, 표현이 단일 해석만 허용 |
| GoalIndeterminate | Outcome + 1개 이상 dimension이 이미 명시됨 |
| BoundaryUndefined | 단일 도메인 태스크이며 소유권이 자명함 |
| ContextInsufficient | 실행 계획에 미해결 요구사항이 없음 |

Pre-flight 결과를 사용자에게 표시하고 진행 확인:

```
Planning Chain — 결핍 스캔 결과:
- IntentMisarticulated: ✓ 감지 (표현에 2+ 유효 해석)
- GoalIndeterminate:    ✓ 감지 (Outcome 미명시)
- BoundaryUndefined:    — 미감지 (단일 도메인, skip 예정)
- ContextInsufficient:  ✓ 감지 (환경 의존성 1건)

Options:
1. 현재 스캔 결과로 진행 — skip 대상 제외하고 체인 시작
2. 스캔 결과 수정 — 포함/제외 항목 변경
```

이 게이트는 **Qc, bounded regret** — 체인 내 첫 프로토콜의 Phase 0이 catch로 기능.

---

## Gate Disposition 규칙

각 게이트에 다음 분류를 적용한다:

| 조건 | 배치 | 근거 |
|------|------|------|
| Qs 게이트 | **BATCH** | 사용자가 새로운 내용을 구성해야 함 (unbounded regret) |
| Qc + unbounded regret | **PRESENT** | 사용자가 inline 판단해야 함 |
| Qc + bounded + BoundaryMap.UserSpec | **PRESENT** | 사용자가 결정 권한을 보유한 도메인 |
| Qc + bounded + BoundaryMap.AISpec | **ELIDE** | AI 자율 판단 가능 + 로그 기록 |
| Qc + bounded + answer ⊆ output(prior) | **ELIDE** | 이전 프로토콜 산출물에서 답이 이미 도출 가능 (entailment) |
| BoundaryMap.Dismissed 도메인 | **PRUNE** | 사용자가 이미 범위에서 제외 |

**Catch-chain 불변량**: 게이트 G가 하류 catch G'의 존재로 elidable이면, G와 G'를 **동시에 elide하지 않는다**. 최소 하나는 PRESENT로 유지.

---

## Gate-by-Gate Walk-Through

### Hermeneia 게이트

| Phase | 게이트 | 종류 | 독립 실행 시 | 체인 내 배치 | 근거 |
|-------|--------|------|-------------|-------------|------|
| 0 | Qc(confirm) | conditional: ai_strong only | 조건부 표시 | **ELIDE** | 사용자가 `/planning-chain` 호출 = 명시적 의도 표현. Hermeneia의 E는 호출 인자 또는 선행 메시지 |
| 1a | Qc(E confirm) | elidable when explicit_arg | 조건부 표시 | **ELIDE** | composition이 E를 제공. bind(E) = explicit_arg 경로 |
| 1b | Qc(gap confirm) | always_gated | PRESENT | **PRESENT** | Phase 0/1a의 catch. gap 집합이 명확화 경로를 결정하는 인식론적 선택. **Catch-chain 불변량**: Phase 0, 1a를 elide했으므로 1b는 반드시 PRESENT |
| 2 | Qs(clarify) | always_gated, Qs | PRESENT | **BATCH** | 사용자가 명확화 내용을 구성. unbounded regret |

**Hermeneia 요약**: 4개 게이트 → **2개 사용자 상호작용** (1b PRESENT + 2 BATCH)

### Telos 게이트

| Phase | 게이트 | 종류 | 독립 실행 시 | 체인 내 배치 | 근거 |
|-------|--------|------|-------------|-------------|------|
| 0 | Qc(confirm) | elidable when explicit_arg | 조건부 표시 | **ELIDE** | Hermeneia의 ClarifiedIntent가 Telos의 입력. `answer ⊆ output(prior)` — entailment |
| 1 | Qc(dimensions) | always_gated | PRESENT | **PRESENT** | Phase 0의 catch. dimension 선택은 인식론적 선택. **Catch-chain 불변량**: Phase 0을 elide했으므로 반드시 PRESENT |
| 2 | Qs(negotiate) | always_gated, Qs | PRESENT | **BATCH** | 사용자가 GoalContract를 형성. unbounded regret |
| 4 | Qc(approve) | always_gated, unbounded regret | PRESENT | **PRESENT** | GoalContract 승인은 구속력 있는 결정. Qc이지만 unbounded regret (하류 전체 경로 결정) |

**Telos 요약**: 4개 게이트 → **3개 사용자 상호작용** (1 PRESENT + 2 BATCH + 4 PRESENT)

### Horismos 게이트

| Phase | 게이트 | 종류 | 독립 실행 시 | 체인 내 배치 | 근거 |
|-------|--------|------|-------------|-------------|------|
| 0 | (silent) | 내부 분석 | 표시 없음 | (silent) | 변경 없음 — 내부 probe |
| 1 | (context collection) | 내부 | 표시 없음 | (내부) | 변경 없음 — 자동 해결 가능 도메인 처리 |
| 2 | Qc(classify) | always_gated | PRESENT | **PRESENT** | 경계 소유권 분류. Qc 형식이지만 constitutive 성격 — UserSpec/AISpec 선택은 단순 분류가 아닌 권한 할당. 도메인별 1회씩 |

**Horismos 요약**: 도메인 수(N)개 게이트 → **N개 사용자 상호작용** (각 PRESENT)

**BoundaryMap 하류 영향**: Horismos 수렴 후 BoundaryMap이 Aitesis 게이트 배치를 변조:
- AISpec 도메인의 불확실성 → Aitesis에서 ELIDE 가능 (AI 자율 판단)
- UserSpec 도메인의 불확실성 → Aitesis에서 반드시 PRESENT
- Dismissed 도메인 → Aitesis에서 PRUNE (범위에서 제거)

### Aitesis 게이트

| Phase | 게이트 | 종류 | 독립 실행 시 | 체인 내 배치 | 근거 |
|-------|--------|------|-------------|-------------|------|
| 0 | (silent) | 내부 분석 | 표시 없음 | (silent) | 변경 없음 — 내부 scan |
| 1 | (context collection + classify) | 내부 | 표시 없음 | (내부) | 변경 없음. BoundaryMap이 scan 범위를 좁힘 |
| 2 | Qs(uncertainty surfacing) | always_gated, Qs | PRESENT | **RESOLVE-OR-PRESENT** | BoundaryMap이 Phase 1 해결 범위를 변조: |
| | | | | AISpec 도메인 → Phase 1에서 context-resolved(entropy→0)이면 **Uᵣ(미도달)**, 미해소(entropy>0)이면 **PRESENT** | Qs 원칙 보존: 게이트 자체를 엘리전하지 않고 상위 단계에서 해소. 투명성: Materialized View에 자동 해결 기록 |
| | | | | UserSpec 도메인 → **PRESENT** | 사용자 판단 필요 |
| | | | | Dismissed 도메인 → **PRUNE** | 범위 제외 |
| | | | | NeedsCalibration → **PRESENT** | 미확정 경계 — Qs 원칙에 따라 사용자 판단 |

**Aitesis 요약**: 불확실성 수(M)개 → Phase 1 해소 수에 따라 **0~M개 사용자 상호작용**. AISpec 도메인은 Phase 1 자율 해결 범위 확대(probe latitude), Qs 게이트 엘리전 아님

---

## 상호작용 흐름도

```
사용자: /planning-chain "대규모 API 리팩토링"

┌─ Phase -1: Pre-flight Scan ──────────────────────────────────────┐
│ scan(T) → 4개 결핍 감지 여부 표시                                   │
│ [Qc] 스캔 결과 확인 → ① 사용자 응답                                │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌─ Hermeneia ──────────────────────────────────────────────────────┐
│ Phase 0: ELIDE (composition이 E 제공)                             │
│ Phase 1a: ELIDE (explicit_arg)                                   │
│ Phase 1b: detect(Eᵥ) → full taxonomy assessment                  │
│ [Qc] gap 확인 → ② 사용자 응답                                    │
│ Phase 2: Qs(clarify)                                             │
│ [Qs] 명확화 → ③ 사용자 응답                                       │
│ Phase 3: integrate → ClarifiedIntent                             │
│ (Post-Convergence: skip — 다음 프로토콜이 체인에 포함)              │
└──────────────────────────────────────────────────────────────────┘
                              ↓ ClarifiedIntent
┌─ Telos ──────────────────────────────────────────────────────────┐
│ Phase 0: ELIDE (ClarifiedIntent = G; entailment)                 │
│ Phase 1: detect(Gᵥ) → full taxonomy assessment                   │
│ [Qc] dimension 확인 → ④ 사용자 응답                               │
│ Phase 2: propose(Dₛ) → Qs(negotiate)                             │
│ [Qs] 협상 → ⑤ 사용자 응답  (dimension별 loop)                     │
│ Phase 4: GoalContract review                                     │
│ [Qc] 승인 → ⑥ 사용자 응답                                        │
│ (Post-Convergence: skip)                                         │
└──────────────────────────────────────────────────────────────────┘
                              ↓ GoalContract
┌─ Horismos ───────────────────────────────────────────────────────┐
│ Phase 0: probe(T) → Bᵢ (silent)                                  │
│ Phase 1: Ctx(Bᵢ) → context collection (auto-resolve 가능)         │
│ Phase 2: (도메인별)                                                │
│ [Qc] 경계 분류 → ⑦⑧... 사용자 응답 (도메인 수만큼)                  │
│ Phase 3: integrate → BoundaryMap                                  │
│ (Post-Convergence: skip)                                         │
└──────────────────────────────────────────────────────────────────┘
                              ↓ BoundaryMap
┌─ Aitesis ────────────────────────────────────────────────────────┐
│ Phase 0: scan(X) → Uᵢ (silent, BoundaryMap이 범위 좁힘)           │
│ Phase 1: Ctx + classify (AISpec → auto, UserSpec → surface)       │
│ Phase 2: (BoundaryMap 변조)                                       │
│ [Qs] UserSpec 불확실성만 표면화 → ⑨⑩... 사용자 응답                 │
│ Phase 3: integrate → InformedExecution                            │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌─ Materialized View ──────────────────────────────────────────────┐
│ Transformation trace:                                            │
│ - IntentMisarticulated(E) → ClarifiedIntent(Î')                  │
│ - GoalIndeterminate(G)    → GoalContract(C')                     │
│ - BoundaryUndefined(T)   → BoundaryMap(B)                        │
│ - ContextInsufficient(X)  → InformedExecution(X')                │
│                                                                  │
│ 의사결정 로그:                                                     │
│ - ELIDE: [게이트, 근거, 참조한 prior output]                       │
│ - PRESENT: [게이트, 사용자 응답 요약]                               │
│ - PRUNE: [도메인, Dismissed 근거]                                  │
│ - BATCH: [Qs 게이트, 사용자 제공 내용]                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Batching 전략: 두 가지 선택지

Qs 게이트(BATCH 배치)를 언제 사용자에게 제시할지에 대한 두 전략.

### 전략 A: 자연 중단점 배치 (Natural Breakpoint)

각 프로토콜의 Qs 게이트를 해당 프로토콜 내에서 즉시 제시. BATCH 표시는 "같은 프로토콜 내 Qs가 여러 개일 때 묶는다"는 의미로 해석.

```
Hermeneia Phase 2(Qs) → 즉시 제시
Telos Phase 2(Qs)     → 즉시 제시 (dimension별 loop)
Aitesis Phase 2(Qs)   → 즉시 제시 (uncertainty별 loop)
```

**장점**: 각 프로토콜의 맥락 안에서 질문을 받으므로 인지 부하가 분산됨.
**단점**: Qs 게이트 수만큼 turn이 발생. 독립 실행 대비 절감 효과가 게이트 elision에 국한.

### 전략 B: 체인 말미 일괄 배치 (End-of-Chain Batch)

모든 Qs 게이트를 체인 말미에 일괄 제시. 중간에는 Qc(PRESENT) 게이트만 표시.

```
Hermeneia 1b(Qc) → 제시
Telos 1(Qc) → 제시
Telos 4(Qc) → 제시
Horismos 2(Qc) → 제시 (도메인별)
──── 여기까지 Qc만 ────
일괄 Qs: Hermeneia 2 + Telos 2 + Aitesis 2 → 한꺼번에 제시
```

**장점**: 사용자가 전체 Qc를 거친 후 한 번에 구성적 응답을 제공. turn 수 최소화.
**단점**: Telos의 GoalContract가 Qs 응답 없이는 불완전 → Horismos의 입력이 불충분. **인과 의존성 위반**.

### 결론: 전략 A (자연 중단점)

전략 B는 프로토콜 간 인과 의존성을 위반한다. Telos Phase 2(Qs)의 사용자 응답이 GoalContract를 형성하고, 그 GoalContract가 Horismos의 입력이다. Qs를 지연시키면 하류 프로토콜이 불완전한 산출물로 작동한다.

따라서 **전략 A를 채택**하되, 동일 프로토콜 내 loop에서 발생하는 복수 Qs는 프로토콜의 기존 loop 메커니즘을 따른다.

---

## BoundaryMap 통합: 체인 내 하류 변조

Horismos가 체인 3번째에 위치하여 BoundaryMap을 산출하면, 체인 4번째인 Aitesis의 게이트 배치가 실시간으로 변조된다.

```
BoundaryMap 산출
    ↓
Aitesis Phase 0 scan: BoundaryMap.AISpec 도메인 → scan 범위에서 제외하지 않되,
                       해당 도메인의 불확실성은 AI가 자율 해결 가능으로 분류
    ↓
Aitesis Phase 1 classify:
  - AISpec 도메인 불확실성 → ReadOnlyVerifiable 또는 ProbeEnrichable로 재분류 시도
  - 재분류 성공 (entropy → 0): Uᵣ (context-resolved) — Phase 2 미도달. Materialized View에 기록
  - 재분류 실패 (entropy > 0): Phase 2 Qs 발화 — PRESENT (Qs 원칙 보존)
    ↓
Aitesis Phase 2 (Qs — RESOLVE-OR-PRESENT):
  - AISpec + Phase 1 해소 (entropy → 0): Uᵣ — Phase 2 미도달 + Materialized View 기록
  - AISpec + Phase 1 미해소 (entropy > 0): PRESENT (Qs 게이트 발화, 사용자 판단)
  - UserSpec 불확실성: PRESENT (사용자 판단)
  - Dismissed: PRUNE
  - NeedsCalibration: PRESENT (미확정 경계, Qs 원칙)
```

핵심: BoundaryMap은 Aitesis Phase 1의 **자율 해결 범위(probe latitude)를 변조**하되, Phase 2 Qs 게이트를 엘리전하지 않는다. AISpec 도메인에서 Phase 1이 불확실성을 해소하면(entropy → 0) Phase 2에 도달하지 않고, 해소하지 못하면(entropy > 0) Qs 원칙에 따라 사용자에게 제시한다. 이는 **실행 후 투명 보고** vs **실행 전 상태 투명 전달**의 entropy 기반 판정이다.

---

## 오류 복구: Suffix Replay

Aitesis가 GoalContract와 모순되는 맥락 부족을 발견하는 경우:

```
Aitesis Phase 2에서 발견:
  "GoalContract.outcome이 전제하는 API 버전이 실제 환경과 불일치"
    ↓
판정: GoalContract의 Outcome dimension이 잘못된 전제에 기반
    ↓
Suffix Replay 제안:
  "맥락 확인 결과 GoalContract의 [Outcome] dimension이 재정의 필요합니다.
   Telos Phase 1부터 재개할까요?"

Options:
1. Telos로 복귀 — Outcome dimension 재정의 후 체인 재개
2. 현재 상태로 진행 — 불일치를 수용하고 실행
3. 체인 종료 — 현재까지의 산출물만 보존
```

**Suffix Replay 범위**: Telos 이후 모든 프로토콜을 재실행 (Telos → Horismos → Aitesis). 이전 Hermeneia 산출물(ClarifiedIntent)은 보존.

**Replay 제한**: 같은 근거로 2회 이상 Suffix Replay가 발생하면, 체인을 중단하고 사용자에게 직접 판단을 요청한다 (무한 루프 방지).

---

## 상호작용 절감 분석

### 독립 실행 시 최소 상호작용 수

| 프로토콜 | 게이트 수 | Post-Conv. | 합계 |
|----------|----------|------------|------|
| Hermeneia | 4 (Phase 0 조건부, 1a 조건부, 1b, 2) | 읽기 + 다음 호출 | 2~4 + 1 |
| Telos | 4 (Phase 0, 1, 2×loop, 4) | 읽기 + 다음 호출 | 3~4 + 1 |
| Horismos | N (Phase 2 × 도메인 수) | 읽기 + 다음 호출 | N + 1 |
| Aitesis | M (Phase 2 × 불확실성 수) | — | M |

**독립 실행 합계**: (2~4) + 1 + (3~4) + 1 + N + 1 + M = **8+N+M ~ 12+N+M** turns

(Post-Convergence 읽기 + 다음 프로토콜 호출 = 프로토콜당 약 1 추가 turn)

### Planning Chain 실행 시 상호작용 수

| 단계 | 게이트 | 배치 | turns |
|------|--------|------|-------|
| Pre-flight | Qc(scan 확인) | PRESENT | 1 |
| Hermeneia 1b | Qc(gap confirm) | PRESENT | 1 |
| Hermeneia 2 | Qs(clarify) | PRESENT (전략 A) | 1 |
| Telos 1 | Qc(dimensions) | PRESENT | 1 |
| Telos 2 | Qs(negotiate) | PRESENT (dimension별) | ~D turns (D=선택 dimension 수) |
| Telos 4 | Qc(approve) | PRESENT | 1 |
| Horismos 2 | Qc(classify) | PRESENT (도메인별) | N' turns (N'≤N, context-resolved 제외) |
| Aitesis 2 | Qs(surfacing) | 조건부 | M' turns (M'≤M, ELIDE/PRUNE 제외) |
| Materialized view | (표시만) | — | 0 |

**Planning Chain 합계**: 1 + 2 + (1+D+1) + N' + M' = **5+D+N'+M'** turns

### 절감 효과

| 항목 | 절감 원인 |
|------|----------|
| Phase 0 elision (Hermeneia, Telos) | 2 turns | entailment — prior output이 확인을 대체 |
| Phase 1a elision (Hermeneia) | 0~1 turns | explicit_arg 경로 활성화 |
| Post-Convergence skip | 3 turns | 체인이 다음 프로토콜을 자동 연결 |
| Aitesis AISpec ELIDE | 0~M turns | BoundaryMap 변조로 AI 자율 해결 |

**전형적 시나리오** (D=3, N=2(1 context-resolved), M=3(1 AISpec, 1 Dismissed)):

- 독립 실행: ~3 + 1 + ~5 + 1 + 2 + 1 + 3 = **~16 turns**
- Planning Chain: 1 + 2 + 5 + 1 + 1 = **~10 turns**
- **절감: ~37%** (6 turns)

최대 절감은 BoundaryMap이 많은 AISpec 도메인을 생성하여 Aitesis 게이트를 대량 ELIDE할 때 발생.

---

## 트레이드오프

### 이점

1. **게이트 elision**: entailment와 catch-chain으로 중복 확인 제거 (Phase 0, 1a)
2. **Post-Convergence skip**: 프로토콜 간 수동 전환 비용 제거
3. **BoundaryMap 변조**: Horismos 산출물이 Aitesis 게이트를 실시간 조정 — 독립 실행에서는 advisory 관계만 존재
4. **전체 진행 가시성**: Materialized view가 4개 프로토콜의 결정을 단일 뷰로 통합
5. **Suffix Replay**: 하류 모순 발견 시 자동 복구 경로 제공

### 비용

1. **맥락 크기**: 4개 프로토콜의 상태를 동시에 유지 → 긴 세션에서 컨텍스트 윈도우 압박
2. **유연성 감소**: 체인 중간에 다른 프로토콜을 삽입하려면 체인을 중단해야 함 (예: Horismos 후 `/frame`이 필요한 경우)
3. **복잡도**: Gate disposition 규칙 + catch-chain 불변량 + BoundaryMap 변조의 조합이 SKILL.md의 복잡도를 높임
4. **부분 활용 불가**: 4-프로토콜 전체가 아닌 2-프로토콜만 필요한 경우 (예: `clarify → goal`만), 별도 체인이거나 독립 호출이 더 적합
5. **Pre-flight 오판**: scan이 결핍을 잘못 판정하면 필요한 프로토콜을 skip하거나 불필요한 프로토콜을 실행

### 미해결 설계 질문

1. **Pre-flight scan의 Qc vs 자동**: scan 결과를 사용자에게 보여주는 것(현재 설계)과 자동으로 진행하는 것 — Pre-flight 자체가 gate인지, 아니면 내부 분석인지
2. **부분 체인 지원**: `/planning-chain --skip hermeneia`처럼 체인 일부를 건너뛰는 인터페이스가 필요한지, 아니면 독립 호출로 충분한지
3. **Suffix Replay 범위**: 현재는 Telos부터 재개하는 것만 정의. Hermeneia까지 거슬러 올라가야 하는 경우의 판정 기준
4. **N+M 확장**: Horismos 도메인과 Aitesis 불확실성이 각각 5개 이상일 때, 체인 실행이 독립 실행보다 오히려 피로도가 높아질 가능성. 도메인/불확실성 캡의 체인 수준 정책이 필요한지

---

## Coexistence 원칙과의 관계

Planning Chain은 4개 프로토콜을 **합성(compose)** 하지만 **흡수(absorb)** 하지 않는다. 각 프로토콜은 독립적으로 호출 가능한 상태를 유지하며, Planning Chain은 그 위에 놓이는 convenience layer이다.

```
/clarify    — 독립 호출 가능 (변경 없음)
/goal       — 독립 호출 가능 (변경 없음)
/bound      — 독립 호출 가능 (변경 없음)
/inquire    — 독립 호출 가능 (변경 없음)
/planning-chain — clarify ∘ goal ∘ bound ∘ inquire (새로운 스킬)
```

이는 Unix의 셸 스크립트가 개별 명령어를 조합하되 개별 명령어의 독립성을 해치지 않는 것과 동형이다. Planning Chain SKILL.md는 각 프로토콜의 SKILL.md를 **참조**할 뿐 **복제**하지 않는다.

---

## 부록: Catch-Chain 불변량 검증표

| Elide 대상 | Catch 게이트 | Catch 배치 | 불변량 충족 |
|------------|-------------|-----------|------------|
| Hermeneia Phase 0 (Qc) | Hermeneia Phase 1b (Qc) | PRESENT | ✓ |
| Hermeneia Phase 1a (Qc) | Hermeneia Phase 1b (Qc) | PRESENT | ✓ |
| Telos Phase 0 (Qc) | Telos Phase 1 (Qc) | PRESENT | ✓ |

모든 ELIDE에 대해 하류 catch가 PRESENT로 유지됨을 확인.
