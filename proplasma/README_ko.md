# Proplasma — /preview (πρόπλασμα)

결정 전에 방향 unknowns를 발산-폐기 인스턴스화로 노출 (πρόπλασμα: 대리석에 커밋하기 전에 빚는 예비 점토 모형)

> [English](./README.md)

## Proplasma란?

그리스어 πρόπλασμα(예비 모형)의 현대적 재해석 — **방향 결정 직전, 후보들이 서술로는 판단이 안 서고 직접 봐야 알 것 같은 순간**을 위한 프로토콜입니다. AI가 근거와 함께 초안으로 중계한 발산 축 위에서 갈리는 값싼 placeholder probe들을 물질화하고, 축별 대비를 제시해, 실제로 본 미래 위에서 방향 판단을 구성하게 합니다 — 그리고 probe는 전부 폐기합니다.

### 핵심 문제

어떤 방향 선택지는 말로는 알아볼 수 없습니다(`DirectionUnrecognizable`): 게이트 선택지가 구조적으로 완벽해도 그 차등적 미래가 서술로 전달되지 않아, 사용자는 인식 대신 머릿속 시뮬레이션으로 떨어집니다. 관측 가능한 증상: 판단의 원칙 위임("northstar에 정합한 방향으로 진행"), 선택 대신 선택지 자체의 재구성, "직접 봐야 알 것 같다"는 결정 정지.

### 해법

**시뮬레이션이 아닌 대비(Contrast over Simulation)**: 발산 축과 placeholder 정책을 초안으로 세워 무엇이든 생성하기 전에 근거와 함께 중계하고, 그 축 위에서 서로 다른 값을 커밋하는 probe들(텍스트 비네트, 또는 임시 격리된 실물 목업)을 생성해 probe-먼저 순서로 축별 대비 지도와 함께 제시합니다. 사용자는 인식 위에서 방향을 정하거나, 아직 어떤 probe도 보여 주지 않은 것(고친 스펙, 조합, 빠진 후보)을 보여 달라고 하고, 그러면 AI 가 바뀐 점과 함께 스펙 전체를 다시 중계한 뒤 그만큼 펼칩니다. AI 가 대비가 부족하다고 보거나 축만으로 이미 미래가 보인다고 읽으면 근거와 함께 말하고 제안할 뿐이고, 닫는 것은 사용자입니다. probe는 폐기 전제의 기구입니다: 명백히 합성물이고, 어떤 주장의 증거도 아니며, 수확 후 각 probe의 처분이 선언된 채 폐기됩니다(파기 실패는 정리 핸드오프와 함께 선언되며, 결코 침묵하지 않습니다) — 방향 결정, 결정을 가른 대비 행, 새로 드러난 unknowns만 살아남습니다.

### 다른 프로토콜과의 차이

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Proplasma** | **Hybrid** | **`DirectionUnrecognizable → DirectionalContrast`** |
| Analogia | AI-guided | `MappingUncertain → MappingAssessment` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

**삼분법**: 이해 부족 → `/grasp` (내가 이해했는지 검증); 경계 부족 → `/bound` (어디까지인지 확정); **미래 인식 불가 → `/preview` (어느 방향인지 보고 판단)**.

**라우팅 우선순위** (첫 매치가 이김): 이미 있는 대상 설명에 대한 매핑이 의도된 추론을 허가하는지 불확실 → `/ground`; 실증거 필요 → `/inquire`; 후보장이 얇음(1개 이하) → `/ideate`, 좌표가 외재화 substrate에 암묵 → `/elicit`; 후보 ≥ 2 ∧ 증거 불요 ∧ placeholder로 운반 가능 → **`/preview`**.

## 파탄 조건 3종

프로토콜의 합법성은 생존 사슬 — 스펙 중계 → transform 생성 → relay 대비 → constitution 결정 → 폐기 검증 — 안에 있습니다. 하나라도 위반하면 무너집니다:

| 파탄 | 가드 |
|------|------|
| 근거와 함께 중계되기 전에 probe 값을 커밋한 발산 축 | 스펙 중계가 모든 생성보다 먼저 나가고, 초안의 어떤 요소든 방향 게이트에서 되돌릴 수 있음 |
| 영구 프로젝트 파일 쓰기 | 임시 격리 + 생성 시점 cleanup 등록 |
| probe의 증거 취급 | 비증거 낙인이 수확과 세션 잔존물까지 관통 |

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install proplasma@epistemic-protocols
```

## 사용법

```
/preview [지금 확정하려는 방향 결정]
```

Proplasma는 후보들이 실제로 갈리는 축을 도출하고, 축과 placeholder 정책을 근거와 함께 중계한 뒤, 그 축 위에서 서로 다른 값을 커밋하는 probe들을 만들어 대비 지도보다 먼저 하나씩 제시합니다. 사용자는 probe가 노출한 방향을 선택하거나, probe들의 조합으로 정하거나 먼저 보여 달라고 하거나, 초안 스펙의 어느 부분이든 되돌려 보내거나, 후보를 이름 대어 probe로 만들게 하거나, 결정 전에 probe를 심문합니다. AI 가 "이 미래는 만들어 본 적 없다"고 말한 뒤라면 probe가 없던 방향도 정할 수 있습니다. 수확이 폐기보다 먼저입니다: 방향, 결정을 가른 대비 행, 상속 unknowns(`/inquire`로 이관)만 남고 probe는 남지 않습니다.

## Author

Jongwon Choi (https://github.com/jongwony)
