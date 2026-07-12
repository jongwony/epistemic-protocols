# Proplasma — /preview (πρόπλασμα)

커밋 전에 방향 unknowns를 발산-폐기 인스턴스화로 노출 (πρόπλασμα: 대리석에 커밋하기 전에 빚는 예비 점토 모형)

> [English](./README.md)

## Proplasma란?

그리스어 πρόπλασμα(예비 모형)의 현대적 재해석 — **방향 커밋 직전, 후보들이 서술로는 판단이 안 서고 직접 봐야 알 것 같은 순간**을 위한 프로토콜입니다. 사용자가 확정한 발산 축 위에서 갈리는 값싼 placeholder probe 2–4개를 물질화하고, 축별 대비를 제시해, 실제로 본 미래 위에서 방향 판단을 구성하게 합니다 — 그리고 probe는 전부 폐기합니다.

### 핵심 문제

어떤 방향 선택지는 말로는 알아볼 수 없습니다(`DirectionUnrecognizable`): 게이트 선택지가 구조적으로 완벽해도 그 차등적 미래가 서술로 전달되지 않아, 사용자는 인식 대신 머릿속 시뮬레이션으로 떨어집니다. 관측 가능한 증상: 판단의 원칙 위임("northstar에 정합한 방향으로 진행"), 선택 대신 선택지 자체의 재구성, "직접 봐야 알 것 같다"는 결정 정지.

### 해법

**시뮬레이션이 아닌 대비(Contrast over Simulation)**: 스펙 게이트에서 발산 축과 placeholder 정책을 확정하고, 그 축 위에서 서로 다른 값을 커밋하는 probe들(텍스트 비네트, 또는 임시 격리된 실물 목업)을 생성한 뒤, probe-먼저 순서로 축별 대비 지도와 함께 제시해 인식 위에서 결정합니다. probe는 폐기 전제의 기구입니다: 명백히 합성물이고, 어떤 주장의 증거도 아니며, 수확 후 파기됩니다 — 방향 결정, 결정을 가른 대비 행, 새로 드러난 unknowns만 살아남습니다.

### 다른 프로토콜과의 차이

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Proplasma** | **Hybrid** | **`DirectionUnrecognizable → DirectionalContrast`** |
| Analogia | AI-guided | `MappingUncertain → ValidatedMapping` |
| Syneidesis | AI-guided | `GapUnnoticed → AuditedDecision` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

**삼분법**: 이해 부족 → `/grasp` (내가 이해했는지 검증); 경계 부족 → `/bound` (어디까지인지 확정); **미래 인식 불가 → `/preview` (어느 방향인지 보고 판단)**.

**라우팅 우선순위** (첫 매치가 이김): 익숙한 도메인으로의 구조 매핑이 미래를 운반 → `/ground`; 실증거 필요 → `/inquire`; 후보/프레임 자체가 부재 → `/frame` · `/elicit`; 후보 ≥ 2 ∧ 증거 불요 ∧ placeholder로 운반 가능 → **`/preview`**.

## 파탄 조건 3종

프로토콜의 합법성은 생존 사슬 — 스펙 게이트 → transform 생성 → relay 대비 → constitution 결정 → 폐기 검증 — 안에 있습니다. 하나라도 위반하면 무너집니다:

| 파탄 | 가드 |
|------|------|
| 스펙 게이트 없이/이후에 AI가 발산 축 선택 | 스펙 게이트가 모든 생성보다 먼저 발화 |
| 영구 프로젝트 파일 쓰기 | 임시 격리 + 생성 시점 cleanup 등록 |
| probe의 증거 취급 | 비증거 낙인이 수확과 세션 잔존물까지 관통 |

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install proplasma@epistemic-protocols
```

## 사용법

```
/preview [커밋 직전의 방향 결정]
```

Proplasma는 후보들이 실제로 갈리는 축을 도출하고, 축과 placeholder 정책을 사용자가 확정하게 한 뒤, 확정된 축 위에서 서로 다른 값을 커밋하는 probe 2–4개를 만들어 대비 지도보다 먼저 하나씩 제시합니다. 사용자는 probe가 노출한 방향을 선택하거나, probe들을 조합해 자기 방향을 종합하거나(잔여 재-팬 1회 내 재물질화 가능), 결정 전에 probe를 심문합니다. 수확이 폐기보다 먼저입니다: 방향, 결정을 가른 대비 행, 상속 unknowns(`/gap` · `/inquire`로 이관)만 남고 probe는 남지 않습니다.

## Author

Jongwon Choi (https://github.com/jongwony)
