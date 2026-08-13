# Hyphegesis — /conduct (ὑφήγησις)

객체수준 인지가 시작되기 전에 세션의 인식 작업을 어떻게 수행할지 지휘 (ὑφήγησις: 앞서 이끌기)

> [English](./README.md)

## Hyphegesis란?

그리스어 ὑφήγησις(바로 앞서 나가 이끌기)에 기반한 프로토콜로, 방법이 미정인 상태에서 **세션의 인식 작업을 어떻게 수행할지 지휘**하여 ConductedMethod(지휘 토폴로지 계획 + 세션 내 체크포인트)를 생성합니다.

### 핵심 문제

목표는 분명하지만 *작업을 어떻게 수행할지*가 미정입니다(`MethodUnderdetermined`). 어떤 인지 이동을, 어떤 순서로, 어떤 독립성으로 실행하고, 그 결과를 어떻게 화해시키며, 언제 멈추고, 각 출력을 어디로 보낼지가 정해지지 않은 상태죠. 지휘된 방법 없이 다중 이동 작업을 시작하면 표류합니다 — 잘못된 순서, 종합 전 관점 오염, 종료 기준 부재.

### 해결책

**기질 위의 지휘(Conduction over Substrate)**: 둘 이상의 이동이 비자명한 지휘를 요구할 때, Hyphegesis는 식별한 이동들 위에서 지휘 토폴로지를 **먼저 초안으로 채웁니다** — 방법 전체를 한 번에, 각 값을 그것이 밀어낸 대안들과 나란히, 영향/레버리지 순으로 — 사용자가 지목한 자리에서만 게이트를 열고, 방법 계획을 핸드오프합니다. 미루는 것은 판단 근거가 아직 존재하지 않는 결정 하나뿐이고, 그것만 세션 내 체크포인트로 갑니다. 이동을 실행하지 않으며, 실현 불가능한 기질에 결코 묶지 않습니다. 단일 이동 작업은 지휘하지 않고 그 한 프로토콜로 relay합니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Hyphegesis** | **Hybrid** | **`MethodUnderdetermined → ConductedMethod`** |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

Prothesis는 한 탐구를 위한 *어떤 관점*을 프레이밍하고, Hyphegesis는 세션 전체 이동들이 *어떻게* 관계 맺는지를 지휘합니다. 두 프로토콜은 토폴로지 대수를 공유하며 — Hyphegesis가 식별한 이동들 위에서 인스턴스화하는 그 배열 functor가 Prothesis가 공급하는 관점도 배열합니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hyphegesis@epistemic-protocols
```

## 사용법

다중 이동 작업의 시작 시점(또는 중간부터) `/conduct`를 호출합니다:

```
/conduct 이 서비스를 프레임워크 v2에서 v3으로 마이그레이션
```

Hyphegesis는 작업 브리프를 확인하고, 지휘가 필요한지 점검하며(단일 이동 작업은 relay로 빠짐), 후보 이동들을 식별합니다 — 크거나 누적 그래프에 걸친 집합은 **세션 목표에 대해 salience-ranked로** 제시해, 이동 집합 확정이 사용자가 더 이상 머릿속에 두지 못하는 그래프로부터의 recall이 아니라 누적된 형태의 recognition이 되도록 합니다 — 그 뒤 아무것도 묻기 전에 지휘 토폴로지 **전체를 초안으로 냅니다** — 제안된 덩어리 가르기와, 그 위의 모든 축(순서, 독립성, 화해, 종료, routing)이 근거를 단 값·나머지 값들의 이름·계획이 갈리는 지점의 차등 함의를 함께 실어 — 가장 결정-관련성 높은 것부터 배치해서. 사용자는 초안 그대로 가거나 틀린 자리를 지목하고, 지목된 자리만 자기 게이트를 엽니다. 한 축씩 묻는 방식은 나머지 방법이 아직 존재하지 않는 상태에서 그 축에 답하게 했고, 전체 초안이 그것을 없앱니다. 각 값을 대안과 나란히 보이는 것이 사용자를 승인하는 자리가 아니라 구성하는 자리에 남게 합니다. 기질 실현가능성을 핸드오프 주석으로 표면화하고, 세션 내 체크포인트와 함께 방법 계획을 핸드오프합니다. 결과가 종합(synthesis)으로 화해되고 그 출력이 융합 형태를 재유도할 수 없는 소비자(사용자, 또는 `handoff_to_span`을 통한 미래 span)로 가는 영역에는 **종합 체크포인트**가 등록되고, 컴파일된 Recognition brief가 함께 실립니다 — 이동별 산출물, 수렴, 발산, 비공개-맥락 gap 슬롯, 융합/출력-형태 후보를 기질이 융합 시점에 제시해, 사용자가 융합 선택을 떠올리는(recall) 대신 인식(recognize)하게 합니다.

## 다섯 지휘 축

| 축 | 질문 | 값 |
|----|------|-----|
| order | 이동들이 어떤 순서로 실행되는가? | single_move, sequential_chain, parallel_fan, dependency_dag |
| independence | 화해 전에 이동들이 서로를 보는가? | isolated, shared |
| reconciliation | 분리 산출된 결과를 어떻게 통합하는가? | aggregate, dialectic, adversarial_refute, synthesis |
| termination | 이동은 언제 멈추는가? | single_pass, bounded_rounds, until_dry_ceiling, until_goal_met |
| routing | 각 출력은 어디로 가는가? | return_to_user, chain_to_next, handoff_to_protocol, deepen_on_finding, handoff_to_span |

`order`가 `dependency_dag`일 때 independence/reconciliation/routing/termination은 move-region별로 해소됩니다(저작 권역은 `shared`, 검증 권역은 `isolated`처럼).

`handoff_to_span`은 이동의 출력을 **span 벽 너머** 맥락을 공유하지 않는 미래 span(`/compact`, `/clear`, 또는 새 세션 이후)으로 라우팅하고, 핸드오프 seam에서 외재화 의무를 선언합니다: 실행 기판이 그 출력을 기판 소유 레코드로 쓰고, 미래 span은 그 레코드를 가리키게 됩니다. `/conduct`의 cognition은 단일 span을 유지하고 출력만 다리를 건너며, 반대편의 compile-back은 `/conduct`의 범위 밖에 둡니다.
