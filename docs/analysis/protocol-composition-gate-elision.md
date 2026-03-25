# 프로토콜 합성과 게이트 엘리전: 6관점 조사 아카이브

> 이 문서는 프로토콜 합성(composition)에서의 게이트 엘리전(gate elision)에 대한 Prothesis Mode 2 조사 결과를 아카이브한다.
> 관련 원칙: Interaction Kind Factorization (design-philosophy.md), Semantic Autonomy (design-philosophy.md), ELIDABLE CHECKPOINTS (각 SKILL.md).

---

## 1. 배경: 프레이밍 전환

### 원래 프레이밍: 자율 프로토콜 활성화

초기 문제 제기는 "autonomous protocol activation" — AI가 사용자 개입 없이 프로토콜을 연쇄 실행하는 것이었다. 이 프레이밍은 두 가지 암묵적 가정을 내포했다:

1. 프로토콜 게이트가 **비용**(상호작용 오버헤드)이라는 가정
2. 게이트를 제거하면 **효율**이 향상된다는 가정

### Epharmoge 리프레이밍: 합성 + 게이트 엘리전

Epharmoge 적용 결과, 실제 사용자 의도는 "자율 활성화"가 아니라 다음이었다:

> 단일 명령 → 복수 프로토콜 실행 → 저위험 게이트 자동 통과 → 투명한 최종 요약

이것은 **프로토콜 합성(composition)**과 **선택적 게이트 엘리전(gate elision)**의 조합이다. `/review` 스킬이 이미 이 패턴의 선례를 제공한다 — 복수 분석 단계를 단일 호출로 합성하되, 사용자 판단이 필요한 지점은 보존한다.

핵심 전환: 게이트는 비용이 아니라 **인식론적 기능**이며, 엘리전의 대상은 "게이트 자체"가 아니라 "합성 맥락에서 기능이 보존되는 게이트"이다.

---

## 2. ELIDABLE CHECKPOINTS 게이트 인벤토리

10개 프로토콜에 걸쳐 총 26개 게이트가 존재한다. 각 게이트는 Qc/Qs 응답 공간과 regret 프로파일의 이축(dual-axis)으로 분류된다.

### 2.1 Qs 게이트: 7개 — 전부 always_gated

| 프로토콜 | 게이트 | 근거 |
|----------|--------|------|
| Syneidesis | Phase 1 Qs (gap surface) | 사용자 판단이 갭 조정을 결정 |
| Hermeneia | Phase 2 Qs (clarify) | 사용자가 의도를 명확화에 반영 |
| Telos | Phase 2 Qs (negotiate) | Accept/Modify/Reject/Extend — 사용자가 계약을 형성 |
| Aitesis | Phase 2 Qs (transparent) | 사용자가 불충분성 판단을 제공 |
| Analogia | Phase 2 Qs (validate) | 사용자가 구조적 매핑을 예시로 검증 |
| Katalepsis | Phase 3 Qs (verify) | 소크라테스적 검증 — 사용자 이해가 측정 대상 |
| Katalepsis | Phase 3 Qᵣs (reasoning) | 오해 추론 가설 |

Qs 게이트는 구성적(constitutive) 콘텐츠를 포함한다 — 사용자 응답이 새로운 내용을 결과에 반영하므로(pushout), AI가 대리 합성할 수 없다. **합성 맥락에서도 엘리전 불가.**

### 2.2 엘리전 가능 게이트: 3개

| 프로토콜 | 게이트 | 엘리전 조건 | 안전망 |
|----------|--------|-------------|--------|
| Prothesis | Phase 0 Qc (MB+mode) | `user_invoked ∧ explicit_arg(U)` | Phase 2 Sc always_gated; J_mb=modify on re-invoke |
| Hermeneia | Phase 1a Qc (E confirm) | `explicit_arg(E)` via `/clarify "text"` | Phase 1b Qc always_gated |
| Telos | Phase 0 Qc (confirm) | `explicit_arg` via `/goal "text"` | Phase 1 Qc always_gated |

공통 패턴: 진입/시드(entry/seed) 단계의 Qc이며, bounded regret + 하류 catch 게이트가 존재한다. 사용자가 명시적 인자를 제공했을 때 확인 게이트를 건너뛰어도, 다음 단계에서 교정 기회가 보장된다.

### 2.3 조건부 게이트: 2-3개

| 프로토콜 | 게이트 | 발동 조건 | regret |
|----------|--------|-----------|--------|
| Prosoche | Phase -1 Sub-A0 Qc (routing) | `D[] ≠ ∅`일 때만 발동 | bounded (Materialize + Phase 0 Classify 독립 점검) |
| Prosoche | Phase -1 confirm (cold start) | `¬Fired ∧ ¬C.prior`일 때만 발동 | bounded (Phase 0 Classify 독립 점검) |
| Hermeneia | Phase 0 Qc (confirm) | `ai_strong` 경로에서만 발동 | bounded (Phase 1a Qc always_gated) |

### 2.4 always_gated Qc 게이트: ~14개

나머지 Qc 게이트는 다양한 이유로 항상 게이트된다:

| 범주 | 게이트 수 | 대표 예시 | 근거 |
|------|-----------|-----------|------|
| unbounded-regret Qc | 4 | Prothesis Phase 4 (routing), PF (preserve), Prosoche Phase 2 (checkpoint), Telos Phase 4 (approve) | 루프 경로, 팀 생명주기, 실행 위험 판단, 계약 최종 승인 |
| 인식론적 선택 | 4 | Prothesis Phase 2 Sc (perspective), Telos Phase 1 (dimensions), Katalepsis Phase 1 (entry points), Phase 3 Qc (coverage) | 렌즈 선택, 차원 집합, 검증 범위 — 사용자 권위 |
| 경계 소유권 | 1 | Horismos Phase 2 Qc (classify) | UserSpec/AISpec/NeedsCalibration 분류 |
| 적합성 판단 | 1 | Epharmoge Phase 1 Qc (applicability) | Confirm/Dismiss/Adapt 판단 |
| 갭 형성 | 1 | Hermeneia Phase 1b Qc (gap confirm) | 갭 집합이 명확화 경로를 형성 |
| 맥락 충돌 | 3 | Prosoche Phase -1 conflict, TeamCoord, Augment | 이력 충돌, 팀 구조, 역할 확인 |

---

## 3. 게이트 엘리전 3축 모델

게이트 G가 합성(Composition) 맥락에서 엘리전 가능한지 판정하는 3축 조건:

```
elidable(G, Composition) ≡
  Qc(G)                                              -- 구성적이 아님
  ∧ bounded_regret(G) ∧ has_safety_net(G)             -- 복구 가능
  ∧ (system_state(G) ∨ answer(G) ⊆ output(prior)     -- AI에 인식론적 접근 있음
     ∨ BoundaryMap(domain(G)) = AISpec)               -- 사용자가 권한 위임
```

**축 1 — 응답 공간(Qc/Qs)**: Qs 게이트는 사용자 콘텐츠를 반영하므로 무조건 게이트. Qc 게이트만 엘리전 후보.

**축 2 — 후회 프로파일(regret)**: bounded regret이면서 하류에 안전망(catch 게이트)이 있어야 한다. unbounded-regret Qc는 하류 비가역성 때문에 엘리전 불가.

**축 3 — 인식론적 접근(epistemic access)**: AI가 게이트 응답에 필요한 정보를 이미 보유해야 한다. 세 가지 경로:
- `system_state(G)`: 시스템 상태에서 응답 도출 가능 (예: 코드베이스 탐색 결과)
- `answer(G) ⊆ output(prior)`: 선행 프로토콜 출력에 응답이 포함됨
- `BoundaryMap(domain(G)) = AISpec`: 사용자가 해당 도메인의 의사결정 권한을 AI에 위임

세 축 모두 충족되어야 엘리전 가능. 하나라도 위반되면 게이트는 사용자에게 제시된다.

---

## 4. BoundaryMap 게이트 조절 모델

Horismos의 BoundaryMap은 정적 산출물이 아니라 **게이트 동작의 동적 조절자**로 기능한다.

### 4.1 BoundaryMap 값에 따른 게이트 처분

| BoundaryMap 값 | 게이트 처분 | 근거 |
|----------------|-------------|------|
| **UserSpec** | always_gated | 사용자가 해당 도메인의 결정 권한 보유 선언 |
| **AISpec** | 엘리전 후보 | 사용자가 AI에 권한 위임 — 3축 나머지 충족 시 엘리전 |
| **NeedsCalibration** | always_gated | 소유권 불확실 — 보수적으로 게이트 |
| **Dismissed** | prune | 범위에서 완전 제거 — 게이트 자체가 불필요 |

**다중 도메인 규칙**: 게이트가 복수 도메인에 걸칠 때 max-authority-wins — 하나라도 UserSpec이면 전체 게이트가 always_gated.

### 4.2 행동적 스티그머지(behavioral stigmergy)

이 모델은 **스티그머지(stigmergy)**와 구조적으로 동형이다. Transactive Memory System(TMS) 검색 조정에서의 환경 아티팩트가 에이전트 상호작용 행동을 수정하는 패턴:

- BoundaryMap = 환경에 남겨진 아티팩트
- 후속 프로토콜 = 아티팩트를 읽고 행동을 수정하는 에이전트
- 게이트 처분 변경 = 간접 조정(indirect coordination)

직접적인 프로토콜 간 통신 없이, BoundaryMap이라는 공유 아티팩트를 통해 게이트 동작이 조정된다.

### 4.3 구현 위치: 프로토콜 내부 로직 (Option 3)

BoundaryMap 참조는 `graph.json`의 새로운 에지 타입이 아니라, 각 프로토콜의 **내부 게이트 로직**에서 구현된다. 근거:

- graph.json은 프로토콜 간 **구조적 관계**(precondition, advisory, suppression)를 인코딩
- BoundaryMap 참조는 **런타임 게이트 행동 변경** — 관계 토폴로지가 아님
- Session Text Composition 원칙에 부합 — BoundaryMap은 세션 텍스트로 자연스럽게 전달됨

---

## 5. 4가지 게이트 처분

합성 맥락에서 각 게이트는 4가지 처분 중 하나를 받는다.

### 5.1 present — 사용자 결정

대상: Qs 게이트, unbounded-regret Qc, UserSpec Qc, NeedsCalibration Qc.

사용자에게 게이트를 제시하고 응답을 대기한다. 합성 맥락에서도 이 게이트들은 건너뛸 수 없다 — 인식론적 기능이 합성으로 대체되지 않기 때문이다.

### 5.2 elide — 자동 통과 + 로그

대상: Qc + bounded regret + (AISpec 또는 선행 출력에서 응답 도출 가능).

AI가 게이트 응답을 자동 결정하되, 결정 내용과 근거를 **로그에 기록**한다. 로그는 최종 요약(materialized view)에 포함되어 투명성을 보장한다.

```
[elided] Prothesis Phase 0: mode=recommend, MB="{user input}" — explicit_arg 제공
[elided] Telos Phase 0: goal_seed="{inferred from clarify output}" — prior output entailment
```

### 5.3 batch — 통합 결정 표면

대상: 합성 내 Qs 게이트들.

Devil's Advocate 관점에서 도출된 통찰: 개별 Qs 게이트를 순차적으로 제시하는 대신, 합성 체인의 모든 Qs 게이트를 **수집하여 통합 결정 표면(consolidated decision surface)**으로 한 번에 제시한다.

이것은 엘리전이 아니라 **재배치(rearrangement)** — 게이트의 인식론적 기능은 보존하면서 상호작용 시점만 변경한다. 사용자는 개별 프로토콜의 Qs 게이트를 하나씩 통과하는 대신, 전체 결정 지점을 한 눈에 보고 판단한다.

### 5.4 prune — 범위 제거

대상: BoundaryMap에서 Dismissed된 도메인의 게이트.

Codex gpt-5.4 상담에서 도출된 통찰: Dismissed 도메인은 사용자가 "이 영역은 현재 범위 밖"이라고 선언한 것이므로, 해당 도메인에만 관련된 게이트는 합성 체인에서 **완전히 제거**한다. 엘리전(자동 통과)이 아니라 프루닝(실행 자체를 생략).

### 5.5 처분 결정 흐름

```
Gate G in Composition
  │
  ├─ Qs(G)?          → present (또는 batch, 합성 내)
  │
  ├─ domain(G) ∈ Dismissed?  → prune
  │
  ├─ unbounded_regret(G)?    → present
  │
  ├─ domain(G) ∈ UserSpec ∪ NeedsCalibration?  → present
  │
  ├─ Qc(G) ∧ bounded_regret(G) ∧ epistemic_access(G)?  → elide
  │
  └─ otherwise        → present (보수적 기본값)
```

---

## 6. 합성 스킬 아키텍처

```
FragmentedProtocolWork(T) → AuditedCompositeOutcome
invariant: No silent authority transfer
preserves: user authority on UserSpec ∪ NeedsCalibration ∪ {Qs, unbounded-regret Qc}
```

### 6.1 합성 흐름

**Phase -1: Pre-flight scan**
- Sub-A0 패턴 적용 — Prosoche의 상류 라우팅(upstream routing)과 동일한 구조
- 종속성 테스트(subordination test) 통과: 합성 스킬은 개별 프로토콜의 **상위가 아니라 조정자**

**Phase 0: Chain validation**
- graph.json precondition 에지로 체인 유효성 검증
- suppression 에지 확인: 동일 범위 내 억제 관계 위반 시 체인 거부
- 예: Syneidesis ⊣ Aitesis (동일 범위) — 둘 다 체인에 포함 불가

**Per-protocol phases: gate decision → run → accumulate**
- 각 프로토콜 진입 시 게이트 처분을 결정 (5.5의 흐름)
- present/batch 게이트에서 사용자 상호작용
- elide 게이트에서 자동 통과 + 로그
- 프로토콜 출력을 세션 맥락에 누적 — Session Text Composition 유지

**Phase N: Materialized view**
- 결정 로그를 수렴 증거(convergence evidence)로 구체화
- 엘리전된 게이트의 자동 결정 내역 포함
- present/batch 게이트의 사용자 결정 요약
- MORPHISM 인스턴스화 추적: 각 결핍 → 해소 매핑

### 6.2 오류 복구: 접미사 재생(suffix replay)

합성 체인 중 무효 게이트 발견 시, **첫 무효 게이트부터 재생(forward-only replay)**:

```
[P1:ok] → [P2:ok] → [P3:invalid_gate] → [P4] → [P5]
                      ↑ 여기서부터 재생
```

Saga compensation 패턴에서 차용하되, 보상 트랜잭션(backward)이 아니라 **순방향 재생(forward-only)**:
- P1, P2의 출력은 세션 맥락에 이미 존재 — 유효
- P3부터 게이트 처분을 재평가하고 프로토콜을 재실행
- 역방향 보상이 필요 없는 이유: 프로토콜 출력은 인식론적 산출물이며, 실행 부수효과가 아님

---

## 7. 핵심 설계 진실

### 7.1 게이트 엘리전은 R(p) 레이어 변경이다

Interaction Kind Factorization에서 G = R(p) ∘ A. 게이트 엘리전은 추상(A)을 변경하지 않는다 — 게이트의 의미론적 내용(무엇을 제시하고, 어떤 응답이 유효한지)은 동일하다. 변경되는 것은 실현(R(p)) — 사용자에게 제시하는 대신 AI가 자동 결정한다.

**Semantic Autonomy 보존**: 같은 프로토콜 정의가 합성 맥락과 단독 실행에서 동일한 인식론적 결과를 산출한다. 엘리전은 상호작용 경로를 변경하지만, 수렴 조건과 산출물 구조는 동일하다.

### 7.2 최대 엘리전 비율: ~58% (15/26)

| 처분 | 게이트 수 | 비율 |
|------|-----------|------|
| elide (자동 통과) | ~11 | ~42% |
| prune (범위 제거) | ~4 | ~15% |
| **엘리전/프루닝 소계** | **~15** | **~58%** |
| present/batch (사용자 상호작용) | ~11 | ~42% |

나머지 42%는 **구조적으로 필수** — Qs 게이트(구성적 콘텐츠), unbounded-regret Qc(비가역성), UserSpec 경계(사용자 권위). 이 게이트들은 합성이 아무리 정교해도 엘리전할 수 없다.

### 7.3 합성의 실질적 효과

합성이 제거하는 것은 **설정 상호작용(setup interaction)**이다:
- "이 주제로 분석할까요?" (진입 확인)
- "이 목표 시드가 맞나요?" (명시적 인자가 있을 때)
- "이전 프로토콜 결과를 사용할까요?" (세션 맥락에서 자명할 때)

합성이 보존하는 것은 **실질적 상호작용(substantive interaction)**이다:
- "이 갭을 어떻게 조정하시겠습니까?" (Qs: 사용자 판단)
- "이 계약을 승인하시겠습니까?" (unbounded-regret Qc: 최종 결정)
- "이 도메인은 누가 결정하나요?" (경계 소유권)

### 7.4 Prosoche의 선례 패턴

Prosoche의 `confirmation count ∝ 1/context_richness`는 합성 게이트 엘리전의 **검증된 패턴**이다:

- `C.tasks ≠ ∅ ∧ ¬C.prior` → 확인 0회 (이미 사용자 검증된 태스크)
- `C.prior` 존재 → 확인 0회 (상류 프로토콜이 의도 검증 완료)
- `¬Fired ∧ ¬C.prior` → 확인 1회 (맥락 없는 냉시작)

더 긴 프로토콜 체인(예: Telos → Aitesis → Prosoche)은 더 많은 누적 검증을 수반하므로, 확인 요구가 감소한다. 합성 스킬은 이 패턴을 체인 전체로 일반화한다.

---

## 8. 미해결 긴장

### 8.1 Catch-chain invariant

엘리전 가능 게이트의 안전망(catch 게이트)이 자신도 엘리전되면 안전망이 소실된다:

```
G elidable(bounded_regret, has_safety_net=G') ∧ G' elidable(...)  → 위반?
```

**불변량 제안**: `elidable(G) ⟹ ¬elidable(safety_net(G))` — 게이트 G가 엘리전 가능하려면 그 안전망 G'은 엘리전 불가여야 한다.

현재 인벤토리에서는 이 불변량이 자연스럽게 충족된다 (엘리전 가능 게이트의 안전망은 모두 always_gated). 그러나 향후 게이트 추가 시 명시적 검증이 필요하다.

### 8.2 Tier 2b 배치: Horismos vs Telos

합성 체인에서 Horismos와 Telos의 상대적 위치가 모호한 경우가 있다:
- graph.json: `Telos → Horismos` (precondition) — 목표 정의 후 경계 정의
- 그러나 BoundaryMap이 Telos의 차원 선택을 조절할 수 있는 경우(이미 경계가 알려진 도메인)에서는 역순이 효율적

이것은 precondition 에지가 **논리적 의존**이 아니라 **일반적 순서**를 인코딩할 때 발생하는 긴장이다. 현재로서는 graph.json의 precondition을 존중하되, 향후 "conditional precondition" 또는 Horismos가 이미 완료된 세션에서의 재활용 패턴을 관찰할 필요가 있다.

---

## 9. 조사 방법론

### 9.1 Prothesis Mode 2: 6관점

| 관점 | 초점 | 핵심 기여 |
|------|------|-----------|
| **Protocol Architecture** | 게이트 분류 체계와 엘리전 조건 | 3축 모델, 게이트 인벤토리 |
| **Distributed Systems** | 합성 오류 복구, 트랜잭션 패턴 | Saga compensation → suffix replay |
| **Autonomy Levels** | 사용자-AI 권한 경계 | BoundaryMap 게이트 조절, "No silent authority transfer" 불변량 |
| **Stigmergy** | 간접 조정 메커니즘 | BoundaryMap as behavioral stigmergy, TMS 검색 조정 유사성 |
| **Devil's Advocate** | 합성의 위험과 한계 | batch 처분 도출, catch-chain 불변량 발견 |
| **Deficit-Centric** | 결핍 기반 정당화 | 합성의 대상 결핍: FragmentedProtocolWork |

### 9.2 Codex gpt-5.4 상담

두 차례 xhigh reasoning effort로 상담:
- **1차**: prune 처분의 정당화 — Dismissed 도메인의 게이트를 엘리전(자동 통과)이 아니라 프루닝(실행 생략)으로 처리해야 하는 근거 확인
- **2차**: suffix replay의 순방향 전용(forward-only) 설계가 인식론적 산출물의 비부수효과 특성에 부합하는지 검증

### 9.3 Epharmoge 리프레이밍

조사 초기 "autonomous protocol activation" 프레이밍에 Epharmoge를 적용하여 `correct(framing) ∧ ¬warranted(framing, user_context)` — 프레이밍이 기술적으로 정확하나 사용자 맥락에서 부적합함을 감지. "composition with gate elision"으로 리프레이밍한 후 조사 방향이 수렴.

---

## 결론

프로토콜 합성에서의 게이트 엘리전은 **자율성의 확장이 아니라 실현 레이어(R(p))의 맥락 적응**이다. Semantic Autonomy가 보존되는 한, 동일한 프로토콜 정의가 단독 실행(모든 게이트 제시)과 합성 실행(일부 게이트 엘리전)에서 동일한 인식론적 결과를 산출한다. 최대 엘리전 비율 ~58%는 설정 상호작용의 제거를 의미하며, 나머지 42%의 실질적 상호작용은 구조적으로 보존된다. 핵심 불변량은 "No silent authority transfer" — 사용자가 UserSpec으로 선언한 도메인이나, 구성적 콘텐츠(Qs), 비가역적 결정(unbounded-regret Qc)에서는 어떤 합성 맥락에서도 사용자 상호작용이 생략되지 않는다.
