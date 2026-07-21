# Diairesis — /delimit (διαίρεσις)

방법이 지휘되기 전에 큰 작업 덩어리를 적정 크기의 실행 단위로 절단 (διαίρεσις: 나눔, 갈라내기)

> [English](./README.md)

## Diairesis란?

그리스어 διαίρεσις(나눔)에 기반한 프로토콜로, 절단의 granularity가 미정인 상태에서 **큰 작업 덩어리를 어디서 실행 단위로 자를지 결정**하여 WorkUnitMap(외부 작업분해구조를 소유하지 않고 참조하는 절단들의 집합)을 생성합니다.

### 핵심 문제

작업은 알지만 *어디서 단위로 자를지*가 미정입니다(`GranularityUnderdetermined`). Linear 프로젝트 / 마일스톤 집합 / 이슈 트리가 여러 실행 span에 걸쳐 있고, 이를 각각 한 span에 맞는 조각으로 어떻게 자를지 불분명한 상태죠. 잘못 자르면 — 한 span에 실행하기엔 너무 큰 단위, 자기 span을 가질 만큼 크지 않은 단위, 자연스러운 seam을 가로질러 쪼개진 단위 — 후속 지휘와 실행이 그 나쁜 분할을 물려받습니다.

### 해결책

**순서보다 절단(Delimit over Order)**: Diairesis는 외부 WBS를 읽기 전용으로 읽고, 자연스러운 joint를 스캔하며, 모든 단위가 한 span에 맞고, 절단이 작업의 joint에 떨어지며, 단위들이 전체 덩어리를 덮어 어떤 작업도 orphan으로 남지 않는 cut-set을 탐색합니다. 각 후보 절단을 사용자가 확정하도록 제시하고 WorkUnitMap을 방출합니다. **절단을 표시하되 순서를 정하지 않습니다** — 단위의 순서는 `/conduct`의 일입니다. 두 프로토콜은 하나의 seam을 사이에 둔 쌍대입니다: **자르고, 지휘한다**.

### 다른 프로토콜과의 차이

| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| Diylisis | AI-guided | `ContextTethered → Certificate` |
| **Diairesis** | **Hybrid** | **`GranularityUnderdetermined → WorkUnitMap`** |
| Hyphegesis | Hybrid | `MethodUnderdetermined → ConductedMethod` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

Diairesis는 하나의 새 연산 — 분할/packing 판단 — 을 담고 나머지는 합성합니다: WBS 범위가 자르기엔 너무 얇을 때 `/inquire`, 절단이 떨어질 수 있는 joint 후보를 위한 `/bound`, 단위별 span-fit 술어를 위한 `/distill`, 그리고 하류로 `/conduct`에 공급합니다. `/induce`(Periagoge)는 내부 move-family 라벨 "Diairesis"(플라톤의 *나눔* 이동)를 갖는데, 공유된 그리스 어근은 cosmetic합니다 — 그것은 한 프로토콜 안의 응답-family 라벨이고, 이것은 작업 덩어리를 분할하는 최상위 프로토콜입니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install diairesis@epistemic-protocols
```

## 사용법

큰 작업 덩어리가 지휘되기 전에 `/delimit`를 호출합니다:

```
/delimit 이 Linear 프로젝트를 실행 크기 단위로 잘라줘
```

Diairesis는 외부 WBS를 읽기 전용으로 바인딩하고, 자연스러운 joint(마일스톤 경계, 의존성 seam, 산출물 가장자리)를 스캔하며, packing 탐색을 실행합니다 — 단위들이 각각 한 span에 맞는 cut-set을 제안합니다. 가장 레버리지가 큰 미절단 region의 제안된 절단을 한 번에 하나씩, 그 span-fit 판정(Fits / Overflows / Underfills / Unportable — fit은 용량과 `/distill`의 이식성-인증 표준의 연접)과 현재 cut-set과 함께 제시해 사용자가 확정하게 합니다: 절단 수용, 다른 joint로 이동, overflow하는 단위 분할, underfill하는 단위 병합 — 또는 외재화된 레코드가 수신 span에 대해 이식 인증되지 못할 Unportable 단위의 경계 이동. 분할이 완료되었다고 신호하면, 남은 region들을 자연스러운 joint에서 자르고, 세 packing 불변식 — 각 단위가 한 span에 맞음, 모든 절단이 joint 위, coverage 완전(작업 orphan 없음) — 을 단언한 뒤 WorkUnitMap을 방출하며, 이는 `/conduct`의 work prospect로 흐릅니다.

## 세 Packing 불변식

| 불변식 | 의미 |
|--------|------|
| span_fit | 각 단위가 한 실행 span(horizon × context lifecycle)에 맞고, 외재화된 레코드가 수신 span에 대해 이식 인증 가능(`/distill` 표준) |
| natural_joint | 모든 절단이 자연스러운 joint에 떨어짐, seam 한가운데가 아님 |
| coverage_complete | 단위들이 전체 덩어리를 덮고 어떤 작업도 단위 밖에 남지 않음 — 완전 커버리지, orphan 없음 (HARD 수렴 게이트) |

WorkUnit은 WBS 위의 **execution-cut 뷰**입니다: 이슈 id를 참조하고 마일스톤과 이슈 granularity 사이를 부유하되, WBS의 상태를 복사하거나 소유하지 않습니다. 외부 WBS가 단일 진실 공급원으로 남습니다 — WorkUnitMap은 스냅샷이 아니라 참조를 실으므로, 하류의 WBS 변경이 stale 없이 보입니다.
