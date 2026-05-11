# Elenchus (ἔλεγχος) — /sublate

> [English](./README.md)

사전 실행 sync 직전, 변증법적 안티테제로 working context를 검증합니다. 출처·신선도·반사실적 견고성에 대해 수집된 맥락을 테스트합니다.

## 타입 시그니처

```
(ContextSuspect, User, VET, WorkingContext) → VettedContext
```

## 기능

Elenchus는 working context를 외부 sync에 commit 하기 직전 — 미팅, PR 리뷰, 배포 결정, Slack 스레드 — 에 실행됩니다. 프로토콜은 세션 동안 누적된 맥락 중에서 age, 출처 취약성, downstream 집중, 출처 간 모순 때문에 sufficiency가 의심스러워진 source를 스캔하고, 각 suspect source에 대해 변증법적 안티테제를 posit한 뒤 사용자가 source별 disposition을 판단하도록 합니다. 동작은 헤겔의 *Aufhebung*(보존 + 부정 + 지양)입니다: 정 → 반 → 합을 source 단위로 적용합니다.

**세 가지 변증법적 패턴**:

- **Pattern A — Source provenance audit (출처 검증)**: 정 "X는 검증되어 있다" ↔ 반 "X의 검증 경로는 provisional / inferred / stale"
- **Pattern B — Counterfactual gap forecasting (반사실적 공백 예측)**: 정 "현재 조건에서 Y가 성립" ↔ 반 "조건 Z가 현재 조건 하나를 대체하면 P 지점에서 공백 B가 발생"
- **Pattern C — Cross-source consistency check (출처 간 일관성)**: 정 "X₁과 X₂는 같은 referent를 일관되게 가리킨다" ↔ 반 "X₁과 X₂는 Q 지점에서 diverge"

**핵심 원칙**: Silent Trust 대신 Dialectical Vetting — 누적된 맥락은 침묵 속에서 decay됩니다. 루프는 후속 작업이 전체 시스템 refactoring을 강제하기 전에 누적된 context cost를 해소합니다.

## 활성화 시점

- 사용자가 `/sublate` 호출 (사용자 주도만 해당)

결핍 인식은 사용자 쪽에 있습니다 — Elenchus는 자동 활성화하지 않습니다. "이 맥락이 stale해 보인다"는 AI 자동 감지는 그 false-positive 비용이 절약 효과를 초과합니다. 사용자가 자신의 맥락이 외부화될 시점을 가장 잘 압니다.

## Disposition Coproduct

각 suspect source는 7개 명명된 disposition + Emergent 중 하나로 해소됩니다. 전체 coproduct가 source 단위로 제시되어 각 판단을 기억에서 회상(Recall)하지 않고 인식(Recognition)할 수 있게 합니다.

| Disposition | 의미 |
|-------------|------|
| **Confirmed** | 안티테제 검토 결과 원 주장이 살아남음. Downstream 사용은 그대로 진행. |
| **Revised(refinement)** | 안티테제가 구체적 갱신을 surface; 주장을 refined form으로 재작성. Downstream은 refined form 기준 진행. |
| **Discarded(reason)** | 안티테제가 주장을 무너뜨림; source를 working context에서 철회. Downstream은 해당 source 없이 재유도. |
| **Deferred(re_trigger_condition)** | Disposition 보류; 조건 충족 시 루프 복귀. Downstream은 commit 없이 진행. |
| **Conditional(measurement)** | 외부 측정 대기 중; downstream은 provisional 태그. |
| **Bounded(external_reference)** | 권위 있는 답은 세션 밖; downstream은 외부 reference를 인용. |
| **Routed(downstream_protocol)** | 해당 도전은 다른 프로토콜 영역 — `/gap`, `/attend`, `/epharmoge`, `/bound`로 이양. |

## Source 식별 기준

Phase 0는 working context에서 audit 후보 source를 silently 선택합니다:

| 기준 | 조건 |
|------|------|
| High-leverage accumulation | 단일 source가 downstream 영향력을 누적 (working hypothesis: ≥ 3 의존) |
| Source age beyond horizon | `observed_at + horizon(origin)` < now |
| Provenance-chain length | belief이 N-step inference chain에 의존하며 직접 관찰·인용·측정이 아님 |
| Cross-source contradiction | 같은 referent를 가리키는 두 source가 diverge |

어느 기준에도 해당하지 않는 source는 surface되지 않습니다 — 프로토콜은 warranted audit candidate에만 주의를 집중합니다.

## 알려진 제한 사항

- **Working hypothesis 임계값**: `N`(high-leverage 임계)과 origin별 horizon 기본값은 residual 변수로, 누적 사용 evidence를 통해 정제됩니다 (inscription 시점에 고정되지 않음).
- **Pattern set closure**: 세 패턴(A·B·C)이 inscribed; Emergent는 세 패턴과 직교하는 변증법적 작용이 사용 evidence로 surface될 때 네 번째 패턴을 허용합니다.
- **Source 당 single-pass**: 한 source는 한 loop iteration에서 하나의 안티테제를 받습니다. False-negative 안티테제 구성(실제 도전을 surface 못 함)은 intra-iteration 복구 없이 전파됩니다; LOOP의 Deferred re-trigger가 cross-iteration 보정을 제공합니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install elenchus@epistemic-protocols
```

## 사용법

```
/sublate [선택적 포커스]    # 사전 실행 sync 직전 working context 검증
```

## 라이선스

MIT
