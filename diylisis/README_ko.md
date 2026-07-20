# Diylisis (διύλισις) — /distill

> [English](./README.md)

이미 존재하는 substrate 소유 레코드 — Task 설명, 커밋 메시지, 위임 프롬프트, 영속 문서 — 가 선언된 수신자 역할에 대해 이식 가능한지 인증하고, 제자리에서 수리 가능한 것은 수리하고, 불가능한 것은 표면화합니다. Diylisis는 레코드를 가리킬 뿐, 새 문서를 작성하지 않습니다.

## 타입 시그니처

```
(ContextTethered, AI, DISTILL, StableRef) → Certificate
```

## 무엇을 하는가

substrate 소유 레코드는 불가피하게 세션-결박 잔여물을 누적합니다 — 미정의 jargon, 지표 약어, 저자 프로세스 서술, 도구 상태, 댕글링 task 식별자. 이것들은 저자에게는 완결돼 보입니다. 저자가 빠진 맥락을 암묵적으로 공유하기 때문입니다. 그러나 세션 접근 권한이 없는 새 수신자에게는 그 공유 지반이 전혀 없습니다. Diylisis는 레코드의 이식성을 제자리에서 인증합니다: 각 지표어 토큰을 canonical 참조로 정규화하고, 각 항목의 자기완결성을 감사하고, 각 판정을 선언된 수신자 역할과 변환-출처에 대해 채점하며, 해소되지 않은 잔여물은 침묵 없이 표면화합니다.

이 morphism은 F0~F7을 한 번 정방향으로 실행한 뒤, 위생 척도(hygiene measure)가 고정점에 도달할 때까지 재감사합니다. 이 척도는 단조가 아닙니다 — repair pass가 새로 authored한 prose가 척도를 정착 전에 다시 끌어올릴 수 있으므로, 종료는 pass별 감소가 아니라 고정점의 구조(disposition은 영구적이며, Gate는 Resolve로 바닥을 침)로부터 논증됩니다:

- **F0 — 인증 계약**: 인증 대상 `target`(기존 레코드), 수신자의 **boundary**(열린, 사용자-선언 Role — 프로토콜 소유 열거형 없음), 선택적 **activity**, 허용 소스, 범위, 검증, 정지 조건을 선언합니다. 관련성과 최소성의 전제입니다.
- **F1 — 지표 폐쇄 + 결정 바인딩**: `target` 내 각 세션-로컬 토큰을 canonical 참조로 정규화합니다. 각 결정-형태 항목을, 그 근거가 사는 영속 레코드(이 프로젝트: git 기록 — 커밋 메시지, 이슈/PR 본문)를 가리키는 `DecisionRecord{claim, ledger_ref}`에 바인딩합니다.
- **F2 — Grounding 폐쇄**: 각 항목의 자기완결성을 inline / stable-pointer / routed-residual로 감사합니다. stable-pointer의 locator는 저자 세션 없이 해소되어야 하고, 수신자가 소비 시점에 자기 도구로 재확인할 때도 역참조·재검증 가능해야 합니다.
- **F3a — 수신자-관련성**: 선언된 activity와 boundary에 대해 각 항목을 판정합니다.
- **F3b — 변환-출처(Transformation-provenance)**: 2분할 verdict — **ObservedKeep**(support-integrity로 값과 결합된 durable·직접 관측 가능 출처 — 원장 없이, Gate 없이 직접 KEEP) 또는 **Unknown**(관측 기반 없음 → Gate).
- **F3 — 처분(Disposition)**: KEEP(inline) | ROUTE(StableRef) | DROP. 확정된 DROP은 절제(excision) 델타와 결합됩니다: 해당 항목의 판별 내용이 `target`에서 제자리 제거되어(주장 보존), 새 수신자는 kept·routed 내용만 물려받습니다 — 제거된 내용과 그 사유는 세션 측에 보존됩니다.
- **F4 — 판정 형성**: 인증서의 `RouteJudgment` 목록을 구성합니다 — kept 또는 routed 항목마다 판정(`Value(inline_evidence)` 또는 `Reference(stable_ref)`)과 근거(`basis`)를 짝짓습니다.
- **F5 — 이해 게이트(상시)**: refute 자세의 `zero-memory-refuter` subagent로 zero-memory 수신자 기준에 대해 검증하며, 매 인증 패스마다 dispatch됩니다 — 선택적 계층이 아닙니다. 각 판정의 근거와 수신 절차의 충분성을 공격합니다. 저자 self-simulation은 배제됩니다.
- **F6 — 제한된 audit/lint 루프**: 위생 척도의 고정점(부재 근거, 해소 불가 route 포인터, 무원장 결정을 포함 — 디스패치 없는 기계적 레그)과 Pass comprehension verdict에서 종료합니다 — pass별 감소나 "완성된 느낌"으로 종료하지 않습니다.
- **F7 — 인증**: **Certificate**를 조립합니다 — 판정 목록, outcome(수리가 필요 없었으면 `AlreadyPortable`, 그렇지 않으면 `Repaired(deltas)`), 그리고 필수 **수신 절차**(역할 선언, 수신측이 실행하는 역참조 단계, 수신측이 재확인하는 주장-수리 발견의 전제 목록)입니다. `target`은 이미 모든 수리 델타를 담고 있습니다 — 해소 추가와 drop-절제가 각각을 분류한 패스에서 제자리 적용되었고, 어느 것도 단언된 주장을 바꾸지 않습니다 — 그래서 F7은 더 이상 편집하지 않습니다: 최종 Pass verdict가 검토한 바로 그 상태를 인증합니다.

**핵심 원리**: Portability over Author Familiarity — 저자의 친숙성이 더 이상 숨은 의존성이 아닐 때 레코드는 이식 가능하며, 아무것도 수리할 필요가 없었을 때도 Certificate는 모든 판정의 근거를 명시합니다.

## 언제 활성화되는가

- 사용자가 `/distill`을 호출하여 대상 레코드와 수신자 역할을 지목 (Layer 1, 항상 가용)
- AI가 수신 경계를 넘으려는 레코드에서 세션-결박 잔여물을 감지 — fresh subagent에게 전달될 Task, 외부 공유될 문서, 디스패치될 위임 프롬프트 (Layer 2, 무음 감지)

`/distill`은 **secret-free 레코드**를 전제합니다 — secret(credential, token, key) 제거는 전용 redaction 에이전트가 상류에서 처리하는 별개 관심사이며, distill morphism의 일부가 아닙니다.

## 처분 Coproduct

각 항목은 세 가지 명명된 처분 중 하나로 해소됩니다. 표면화된 residual과 unknown-provenance 항목은 Gate에서 제시되어, 기억이 아니라 재인(recognition)으로 판정됩니다.

| 처분 | 의미 |
|------|------|
| **KEEP(inline)** | 항목을 inline으로 유지. ObservedKeep(support-integrity를 갖춘 durable 관측 출처, 직접 KEEP) 또는 사용자 Resolve 응답으로 도달 가능. |
| **ROUTE(StableRef)** | 수신자가 해소하는 안정 참조(path, id, url, command)로 항목을 운반. |
| **DROP** | 항목이 선언된 activity에 기여하지 않음; 인증에서 해제. |

Gate에서, 표면화된 residual 또는 unknown-provenance 항목은 `Resolve | Route | Drop | Defer`로 응답합니다.

## 출처 하드라인(The Provenance Hard Line)

F3b는 항목의 *외관*으로 KEEP을 추론하지 않습니다. KEEP은 정확히 두 경로로만 도달합니다: **ObservedKeep** — durable·직접 관측 가능 출처(파일 읽기, 명령 출력, PR/이슈 URL, durable stable-ref)로 support-integrity를 통해 값과 결합됨 — Gate 없이 직접 KEEP — 또는 Gate에서의 사용자 **Resolve**. 관측 기반이 없는 항목은 **Unknown** — KEEP으로 기본 처리되지 않고 Gate에서 사용자 판정으로 표면화됩니다. ObservedKeep은 저자의 미검증 신념이 아니라 수신자가 재관측 가능한 외부 기반에 대한 relay이므로, (단순 currency가 아닌) support-integrity가 기준이며 불확실/이견 기반은 보수적으로 Unknown입니다. **correction이 필요한 주장** — 관측 출처에서 벗어난 주장 — 은 ObservedKeep이 될 수 없으며, Gate에서 사용자 Resolve로 표면화됩니다. 결정-형태 내용은 이 KEEP 시험을 통과하는 대신, 그 근거가 사는 영속 레코드(이 저장소: git)를 가리키는 `DecisionRecord`를 운반합니다.

## 보증 등급(Assurance Tiers)

라벨은 **레코드-상대적**입니다: Diylisis가 산출하는 문서가 아니라, Diylisis가 지목한 인증 대상 `target`에 붙습니다(Diylisis는 자신만의 새 산출물을 만들지 않습니다).

| 등급 | 라벨 | 실행 내용 |
|------|------|-----------|
| Draft | **비인증 초안(Uncertified draft)** | `target`에 대해 Diylisis 패스가 실행된 적 없음 — 평문 Markdown, F5 게이트·leak/durable-pointer 감사 없음. `target`은 Certificate 주장을 하지 않습니다. |
| Certified | **인증된 `/distill`** | 상시 F5 이해-게이트 Pass 1회(realization은 verdict에 기록) + leak / durable-pointer 감사 1회, 고정점 도달. `target`은 Certificate를 가집니다: F5 게이트가 verdict에 기록된 realization(refuter subagent / generic subagent / lint fallback — 라벨은 정확히 그 realization의 엄밀성만 주장) 아래에서 Pass에 도달했고, 모든 판정 근거가 근거지어졌으며, 감사가 통과했습니다. |

F5 dispatch가 무조건적이므로 — 모든 인증 패스가 플랫폼이 제공하는 가장 강한 realization 아래에서 전체 게이트를 실행하며, 더 가벼운 선택적 계층이 없음 — 부분-엄밀성 중간 등급은 없습니다: `target`은 F7을 거친 적이 없거나(Draft) 완료된 패스의 Certificate를 가집니다(Certified). 라벨은 `target`을 그 발행된 activation edge와 함께 인증합니다; Diylisis 밖에서의 후속 편집이나 대체된 edge로 디스패치된 인증은 검증된 수신 조건을 깨뜨립니다.

## 알려진 한계

- **수신 절차 재검증은 수신측 소유**: 산출된 역참조 단계는 수신자가 자기 도구로 실행하는 것입니다; Diylisis 자신은 수신자가 실제로 재실행했는지 확인하지 않습니다.
- **첫 wired 표면**: plan-level 인증이 `/distill`의 첫 wired 표면입니다. 세션-중 pruning과 서브에이전트 핸드오프는 후속 표면으로 누적됩니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install diylisis@epistemic-protocols
```

## 사용법

```
/distill [대상 레코드] [수신자 역할]   # 기존 레코드의 이식성을 선언된 수신자에 대해 인증
```

## 라이선스

MIT
