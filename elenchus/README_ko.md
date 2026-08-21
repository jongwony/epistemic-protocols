# Elenchus (ἔλεγχος) — /sublate

> [English](./README.md)

사전 실행 sync 직전, 변증법적 안티테제로 working context를 검증합니다. 출처·신선도·반사실적 견고성에 대해 수집된 맥락을 테스트합니다.

## 타입 시그니처

```
(ContextSuspect, User, VET, WorkingContext) → VettedContext
```

## 기능

Elenchus는 working context를 외부 sync에 commit 하기 직전 — 미팅, PR 리뷰, 배포 결정, Slack 스레드 — 에 실행됩니다. 프로토콜은 세션 동안 누적된 맥락 중에서 age, 출처 취약성, downstream 집중, 출처 간 모순 때문에 sufficiency가 의심스러워진 source를 스캔하고, 각 suspect source에 대해 변증법적 안티테제를 posit한 뒤 사용자가 source별 disposition을 판단하도록 합니다. 동작은 헤겔의 *Aufhebung*(보존 + 부정 + 지양)입니다: 정 → 반 → 합을 source 단위로 적용합니다.

**네 가지 변증법적 패턴**:

- **Pattern A — Source provenance audit (출처 검증)**: 정 "X는 claim C에 대해 검증되어 있다" ↔ 반 "X의 검증 경로는 다른 claim을 권위화하거나 provisional / inferred / stale"
- **Pattern B — Counterfactual gap forecasting (반사실적 공백 예측)**: 정 "현재 조건에서 Y가 성립" ↔ 반 "조건 Z가 현재 조건 하나를 대체하면 P 지점에서 공백 B가 발생"
- **Pattern C — Cross-source consistency check (출처 간 일관성)**: 정 "X₁과 X₂는 같은 referent와 호환되는 claim-kind를 일관되게 가리킨다" ↔ 반 "X₁과 X₂는 Q 지점에서 diverge"
- **Pattern D — Inference fallacy audit (추론 오류 검증)**: 정 "결론 Y는 관찰된 근거로부터 타당하게 도출된다" ↔ 반 "Y의 타당성은 성립하지 않는 추론 archetype에 의존한다" — source 자체가 추론된 결론(origin `AIInference`, 또는 standing premise로 기능하는 결론)일 때 적용

**핵심 원칙**: Silent Trust 대신 Dialectical Vetting — 누적된 맥락은 침묵 속에서 decay됩니다. 루프는 후속 작업이 전체 시스템 refactoring을 강제하기 전에 누적된 context cost를 해소합니다.

## 활성화 시점

- 사용자가 `/sublate` 호출 (사용자 주도만 해당)

결핍 인식은 사용자 쪽에 있습니다 — Elenchus는 자동 활성화하지 않습니다. "이 맥락이 stale해 보인다"는 AI 자동 감지는 그 false-positive 비용이 절약 효과를 초과합니다. 사용자가 자신의 맥락이 외부화될 시점을 가장 잘 압니다.

## Disposition Coproduct

각 suspect source는 claim 단위로 판단됩니다: 반정립이 제기된 뒤 사용자가 그 claim을 어떻게 보는지 자기 말로 말하고, 실행이 이어서 할 일이 있으면 지시 하나를 덧붙일 수 있습니다. claim마다 제시되는 것은 그 판단이 무엇에 대고 내려지는가 하는 재료입니다 — 묶인 claim, 그것을 의심스럽게 만드는 것, 증거, stake, 그리고 근거를 인용한 반정립 — 그래서 판단이 기억에서 회상(Recall)되지 않고 인식(Recognition)됩니다. 사용자가 답하기 전에 답이 대신 쓰이는 일은 없습니다.

판단(verdict) 자체는 자유 텍스트이고, 일부러 타입을 두지 않았습니다 — 판단이 어떻게 나왔는지에 하류가 기댈 자격이 없고, 여기에 타입을 두는 것은 아무도 묻기 전에 프로토콜이 답을 써 두는 일입니다. 타입이 있는 것은 선택적인 **지시** 쪽이며, 그것도 이 프로토콜의 후속 단계가 각각을 실제로 읽기 때문입니다:

| 지시 | 실행이 그것으로 하는 일 |
|------|------------------------|
| *(없음)* | source를 지금 있는 그대로 두고 진행합니다. 여기서 아무 말도 안 하는 것은 빈칸이 아니라 하나의 답입니다. |
| **Withdraw** | source를 downstream 사용에서 내리고, 당신이 준 판단 그대로 실행 이력에 보존합니다. |
| **Revisit(condition)** | 조건을 당신이 이름 붙이고, 그 조건이 충족되면 루프가 이 주장으로 돌아옵니다. |
| **HandOff(deficit)** | 그 질문을 다른 결손으로 넘기고, 수렴 시 명령 힌트와 함께 보고합니다. |

## Source 식별 기준

Phase 0는 working context에서 audit 후보 source를 silently 선택합니다:

| 기준 | 조건 |
|------|------|
| High-leverage accumulation | 단일 source가 downstream 영향력을 누적 (working hypothesis: ≥ 3 의존) |
| Source age beyond horizon | `observed_at + horizon(origin)` < now |
| Provenance-chain length | belief이 N-step inference chain에 의존하며 직접 관찰·인용·측정이 아님 |
| Cross-source contradiction | 같은 referent를 가리키는 두 source가 diverge |
| Inference-character conclusion | source 자체가 추론된 결론(origin `AIInference`, 또는 standing premise로 기능하는 결론) |

어느 기준에도 해당하지 않는 source는 surface되지 않습니다 — 프로토콜은 warranted audit candidate에만 주의를 집중합니다.

## 알려진 제한 사항

- **Working hypothesis 임계값**: `N`(high-leverage 임계)과 origin별 horizon 기본값은 residual 변수로, 누적 사용 evidence를 통해 정제됩니다 (inscription 시점에 고정되지 않음).
- **Pattern set closure**: 네 패턴(A·B·C·D)이 inscribed; Emergent는 네 패턴과 직교하는 변증법적 작용이 사용 evidence로 surface될 때 추가 패턴을 허용합니다.
- **Source 당 single-pass**: 한 source는 한 loop iteration에서 하나의 안티테제를 받습니다. False-negative 안티테제 구성(실제 도전을 surface 못 함)은 intra-iteration 복구 없이 전파됩니다; LOOP의 Revisit re-trigger가 cross-iteration 보정을 제공합니다.

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
