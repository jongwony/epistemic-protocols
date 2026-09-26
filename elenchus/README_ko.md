# Elenchus (ἔλεγχος) — /sublate

> [English](./README.md)

사전 실행 sync 직전, 변증법적 안티테제로 working context를 검증합니다. 출처·신선도·반사실적 견고성에 대해 수집된 맥락을 테스트합니다.

## 타입 시그니처

```
(ContextSuspect, User, VET, WorkingContext) → VettedContext
```

## 기능

Elenchus는 working context를 외부 sync에 commit 하기 직전 — 미팅, PR 리뷰, 배포 결정, Slack 스레드 — 에 실행됩니다. 프로토콜은 세션 동안 누적된 맥락 중에서 age, 출처 취약성, downstream 집중, 출처 간 모순 때문에 sufficiency가 의심스러워진 source를 스캔하고, 검증 대상 claim마다 변증법적 안티테제를 posit한 뒤 — 보통은 source 하나에 하나이고, 한 source가 여러 claim의 권위로 읽히면 각각 하나씩 — 사용자가 claim마다 자기 말로 답하도록 합니다. 동작은 헤겔의 *Aufhebung*(보존 + 부정 + 지양)입니다: 정 → 반 → 합을 claim 단위로 적용합니다.

**네 가지 변증법적 패턴**:

- **Pattern A — Source provenance audit (출처 검증)**: 정 "X는 claim C에 대해 검증되어 있다" ↔ 반 "X의 검증 경로는 다른 claim을 권위화하거나 provisional / inferred / stale"
- **Pattern B — Counterfactual gap forecasting (반사실적 공백 예측)**: 정 "현재 조건에서 Y가 성립" ↔ 반 "조건 Z가 현재 조건 하나를 대체하면 P 지점에서 공백 B가 발생"
- **Pattern C — Cross-source consistency check (출처 간 일관성)**: 정 "X₁과 X₂는 같은 referent와 호환되는 claim-kind를 일관되게 가리킨다" ↔ 반 "X₁과 X₂는 Q 지점에서 diverge"
- **Pattern D — Inference fallacy audit (추론 오류 검증)**: 정 "결론 Y는 관찰된 근거로부터 타당하게 도출된다" ↔ 반 "Y의 타당성은 성립하지 않는 추론 archetype에 의존한다" — source 자체가 추론된 결론(origin `AIInference`, 또는 standing premise로 기능하는 결론)일 때 적용

**핵심 원칙**: Silent Trust 대신 Dialectical Vetting — 누적된 맥락은 침묵 속에서 decay됩니다. 루프는 후속 작업이 전체 시스템 refactoring을 강제하기 전에 누적된 context cost를 해소합니다.

## 활성화 시점

- 사용자가 `/sublate` 호출 (사용자 주도만 해당)

결핍 인식은 사용자 쪽에 있습니다 — Elenchus는 자동 활성화하지 않습니다. "이 맥락이 stale해 보인다"는 AI 자동 감지는 그 false-positive 비용이 절약 효과를 초과합니다. 사용자가 자신의 맥락이 외부화될 시점을 가장 잘 압니다.

## 답

반정립이 제기된 뒤, 사용자는 claim마다 자기 말로 답합니다. claim마다 제시되는 것은 그 답이 무엇에 대고 내려지는가 하는 재료입니다 — 지금의 claim, 그것을 의심스럽게 만드는 것, 증거, stake, 그리고 근거를 인용한 반정립 — 그래서 답이 기억에서 회상(Recall)되지 않고 인식(Recognition)됩니다. 사용자가 답하기 전에 답이 대신 쓰이는 일은 없습니다.

답은 자유 텍스트이고, 일부러 타입을 두지 않았습니다 — 답이 어떻게 나왔는지에 하류가 기댈 자격이 없고, 여기에 타입을 두는 것은 아무도 묻기 전에 프로토콜이 답을 써 두는 일입니다. 그 claim으로 무엇을 할지도 같은 말 안에 담깁니다 — 그 claim에 한해 source를 더 근거로 쓰지 않기, 조건이 맞으면 다시 보기(실행이 이어지는 동안만; 닫을 때 맞지 않은 조건은 열린 채로 보고), 다른 종류의 문제로 넘기기(Elenchus가 이름 둔 곳이면 명령 힌트와 함께, 아니면 힌트 없이). 라운드는 이런 행동을 claim마다 구체적으로 보이며 범주 제목으로 보이지 않고, 답 하나가 여러 claim을 덮을 수도, 일부만 덮을 수도 있습니다.

## Source 식별 기준

매 pass는 working context에서 살펴볼 source를 silently 선택합니다:

| 기준 | 조건 |
|------|------|
| High-leverage accumulation | 단일 source가 downstream 영향력을 누적 (working hypothesis: ≥ 3 의존) |
| Source age beyond horizon | `observed_at + horizon(origin)` < now |
| Provenance-chain length | belief이 N-step inference chain에 의존하며 직접 관찰·인용·측정이 아님 |
| Cross-source contradiction | 같은 referent를 가리키는 두 source가 diverge |
| Inference-character conclusion | source 자체가 추론된 결론(origin `AIInference`, 또는 standing premise로 기능하는 결론) |

어느 기준에도 해당하지 않는 source는 surface되지 않습니다 — 프로토콜은 도전할 만한 claim에만 주의를 집중합니다.

## 알려진 제한 사항

- **Working hypothesis 임계값**: `N`(high-leverage 임계)과 origin별 horizon 기본값은 residual 변수로, 누적 사용 evidence를 통해 정제됩니다 (inscription 시점에 고정되지 않음).
- **Pattern set closure**: 네 패턴(A·B·C·D)이 inscribed; Emergent는 미리 이름 붙지 않은 추가 패턴을 허용하되, 그 도전이 곁가지 검증이 아니라 source의 claim을 직접 마주해야 합니다.
- **claim이 움직일 때까지 도전 하나**: 각 claim — 한 claim의 권위로 읽힌 한 source — 은 claim이나 사용자가 건 조건이 움직일 때까지 받은 안티테제를 유지하고, 여러 claim의 권위로 읽힌 source는 여러 claim이 되어 각자 자기 안티테제를 받습니다. 실제 약점을 놓친 도전은 저절로 복구되지 않습니다; 사용자의 답이나 사용자가 건 조건이 그 claim을 다시 불러옵니다.

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
