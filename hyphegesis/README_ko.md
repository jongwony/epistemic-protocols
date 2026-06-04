# Hyphegesis — /conduct (ὑφήγησις)

객체수준 인지가 시작되기 전에 세션의 인식 작업을 어떻게 수행할지 지휘 (ὑφήγησις: 앞서 이끌기)

> [English](./README.md)

## Hyphegesis란?

그리스어 ὑφήγησις(바로 앞서 나가 이끌기)에 기반한 프로토콜로, 방법이 미정인 상태에서 **세션의 인식 작업을 어떻게 수행할지 지휘**하여 ConductedMethod(지휘 토폴로지 계획 + 세션 내 체크포인트)를 생성합니다.

### 핵심 문제

목표는 분명하지만 *작업을 어떻게 수행할지*가 미정입니다(`MethodUnderdetermined`). 어떤 인지 이동을, 어떤 순서로, 어떤 독립성으로 실행하고, 그 결과를 어떻게 화해시키며, 언제 멈추고, 각 출력을 어디로 보낼지가 정해지지 않은 상태죠. 지휘된 방법 없이 다중 이동 작업을 시작하면 표류합니다 — 잘못된 순서, 종합 전 관점 오염, 종료 기준 부재.

### 해결책

**기질 위의 지휘(Conduction over Substrate)**: 둘 이상의 이동이 비자명한 지휘를 요구할 때, Hyphegesis는 프로토콜 그래프 위에서 지휘 토폴로지를 설계합니다 — 영향/레버리지 우선으로, 안정 축은 잠그고 가변 축은 세션 내 체크포인트로 미루며 — 그리고 방법 계획을 핸드오프합니다. 이동을 실행하지 않으며, 실현 불가능한 기질에 결코 묶지 않습니다. 단일 이동 작업은 지휘하지 않고 그 한 프로토콜로 relay합니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Hyphegesis** | **Hybrid** | **`MethodUnderdetermined → ConductedMethod`** |
| Diylisis | AI-guided | `ContextTethered → PortableHandoff` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

Prothesis는 한 탐구를 위한 *어떤 관점*을 프레이밍하고, Hyphegesis는 세션 전체 이동들이 *어떻게* 관계 맺는지를 지휘합니다. 두 프로토콜은 토폴로지 대수를 공유하며 — Prothesis는 관점 위에서, Hyphegesis는 프로토콜 그래프 위에서 인스턴스화합니다.

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

Hyphegesis는 작업 브리프를 확인하고, 지휘가 필요한지 점검하며(단일 이동 작업은 relay로 빠짐), 후보 이동들을 식별한 뒤, 지휘 토폴로지를 한 번에 한 축씩 설계합니다 — 순서, 독립성, 화해, 종료, routing — 가장 결정-관련성 높은 축부터. 기질 실현가능성을 핸드오프 주석으로 표면화하고, 세션 내 체크포인트와 함께 방법 계획을 핸드오프합니다.

## 다섯 지휘 축

| 축 | 질문 | 값 |
|----|------|-----|
| order | 이동들이 어떤 순서로 실행되는가? | single_move, sequential_chain, parallel_fan, dependency_dag |
| independence | 화해 전에 이동들이 서로를 보는가? | isolated, shared |
| reconciliation | 분리 산출된 결과를 어떻게 통합하는가? | aggregate, dialectic, adversarial_refute, synthesis |
| termination | 이동은 언제 멈추는가? | single_pass, bounded_rounds, until_dry_ceiling, until_goal_met |
| routing | 각 출력은 어디로 가는가? | return_to_user, chain_to_next, handoff_to_protocol, deepen_on_finding |

`order`가 `dependency_dag`일 때 independence/reconciliation/routing은 move-region별로 해소됩니다(저작 권역은 `shared`, 검증 권역은 `isolated`처럼).
