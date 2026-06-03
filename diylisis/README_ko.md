# Diylisis (διύλισις) — /distill

> [English](./README.md)

세션-결박된 작업 맥락을, 사전 맥락이 전혀 없는(zero-memory) 새 에이전트가 그대로 실행할 수 있는 자기완결 이식 핸드오프로 증류합니다. 지표어(deixis)를 정규화하고, 자기완결성을 감사하고, 관련성과 출처를 판정한 뒤, prose 채널과 스키마 버전이 부여된 task-state 블록으로 산출합니다.

## 타입 시그니처

```
(ContextTethered, AI, DISTILL, WorkingContext) → PortableHandoff
```

## 무엇을 하는가

한 작업 세션의 context window는 불가피하게 세션-결박 잔여물을 누적합니다 — 미정의 jargon, 지표 약어, 저자 프로세스 서술, 도구 상태, 댕글링 task 식별자. 이것들은 저자에게는 완결돼 보입니다. 저자가 빠진 맥락을 암묵적으로 공유하기 때문입니다. 그러나 세션 접근 권한이 없는 새 수신자에게는 그 공유 지반이 전혀 없습니다. Diylisis는 작업 맥락을, 모든 핵심 참조가 저자 세션 없이도 해소되는 핸드오프로 증류합니다.

이 morphism은 F0~F7을 한 번 정방향으로 실행한 뒤, 단조 위생 척도(monotone hygiene measure)에 대해 고정점에 도달할 때까지 재감사합니다:

- **F0 — 핸드오프 계약**: 수신자, next task, 허용 소스, 범위, 검증, 정지 조건을 선언합니다. 관련성과 최소성의 전제입니다.
- **F1 — 지표 폐쇄(Deictic closure)**: 각 세션-로컬 토큰을 canonical 참조로 정규화합니다. grounding보다 선행하여 grounded 항목이 안정 참조를 가리키도록 합니다. `surface_token → canonical_ref → confidence → unresolved?`를 산출합니다.
- **F2 — Grounding 폐쇄**: 각 항목의 자기완결성을 inline / stable-pointer / routed-residual로 감사합니다. silent residual은 허용되지 않습니다.
- **F3a — 수신자-관련성**: 선언된 next task에 대해 각 항목을 판정합니다.
- **F3b — 변환-출처(Transformation-provenance)**: append-only `CorrectionDelta` 원장(ledger)에 대해 각 항목을 검증합니다. KEEP은 매칭되는 비-잠정(non-provisional) 교정이 있을 때만 부여됩니다. 원장 부재 시 Unknown이 되어 Gate로 라우팅됩니다 — KEEP은 추론되지 않습니다.
- **F3 — 처분(Disposition)**: KEEP(inline) | ROUTE(StableRef) | DROP.
- **F4 — 압축 폐쇄**: 최소-완전(minimal-complete) 집합만 유지합니다 — 계약-상대적 완전성이지, 미적 간결성이 아닙니다.
- **F5 — 이해 게이트**: lint 체크리스트 또는 fresh subagent로 zero-memory 수신자 기준에 대해 검증합니다. 저자 self-simulation은 배제됩니다.
- **F6 — 제한된 audit/lint 루프**: 약하게 감소하는 위생 척도에 따라 종료합니다. "완성된 느낌"이 아니라 척도로 종료합니다.
- **F7 — 채널 분리**: prose 채널(권위)과, 댕글링 task 식별자를 복원하는 스키마 버전 `TaskStateBlock`을 산출합니다.

**핵심 원리**: Portability over Author Familiarity — 저자의 친숙성이 더 이상 숨은 의존성이 아닐 때 핸드오프는 이식 가능합니다.

## 언제 활성화되는가

- 사용자가 `/distill` 호출 (Layer 1, 항상 가용)
- AI가 맥락 핸드오프 직전 세션-결박 잔여물을 감지 — 핸드오프 브리프, fresh-context 서브에이전트 디스패치, 재개 가능한 plan (Layer 2, 무음 감지)

## 처분 Coproduct

각 항목은 세 가지 명명된 처분 중 하나로 해소됩니다. 표면화된 residual과 unknown-provenance 항목은 Gate에서 제시되어, 기억이 아니라 재인(recognition)으로 판정됩니다.

| 처분 | 의미 |
|------|------|
| **KEEP(inline)** | 항목을 inline으로 유지. 매칭되는 비-잠정 `CorrectionDelta` 또는 사용자 Resolve 응답으로만 도달 가능. |
| **ROUTE(StableRef)** | 수신자가 해소하는 안정 참조(path, id, url, command)로 항목을 운반. |
| **DROP** | 항목이 선언된 next task에 기여하지 않음; 핸드오프에서 해제. |

Gate에서, 표면화된 residual 또는 unknown-provenance 항목은 `Resolve | Route | Drop | Defer`로 응답합니다.

## 출처 하드라인(The Provenance Hard Line)

F3b는 `CorrectionDelta` 원장을 읽기 전용으로 소비합니다. 항목은 매칭 레코드가 비-잠정 상태로 `export_policy = KEEP`을 가질 때만 corrected-in-session입니다. 원장이 부재하거나 매칭 레코드가 없으면 출처는 **Unknown**이며 — 항목은 KEEP으로 기본 처리되지 않고 Gate에서 사용자 판정으로 표면화됩니다. 이는 새 수신자가 저자의 미검증 신념을 확정 사실로 물려받는 것을 방지합니다. 원장 스키마와 read contract는 [`references/correction-delta-schema.md`](./skills/distill/references/correction-delta-schema.md)를 참조하세요.

## 결정적 위생 lint(Deterministic Hygiene Lint)

`skills/distill/scripts/hygiene-lint.mjs`는 F1 지표-폐쇄 scrub입니다: 표준 라이브러리만 쓰는 결정적 체커로, 지표 anchor("as above", "the earlier one"), bare task 식별자("Task #3", "#172"), 미정의 coined-or-metric 토큰("v4", "max-combine", "queryValue 40")을 감지하여 치환표와 residual 목록을 산출합니다.

```
node skills/distill/scripts/hygiene-lint.mjs <file>   # 파일 lint
node skills/distill/scripts/hygiene-lint.mjs --test    # 내장 단위 테스트 실행
```

## 알려진 한계

- **v1 원장 읽기 전용**: F3b는 `CorrectionDelta` 원장을 소비합니다. 세션 중 교정 델타를 기록하는 메커니즘은 별도의 후속 과제입니다.
- **Hygiene-lint 정밀도**: 결정적 감지기는 후보 토큰을 표시합니다. canonical 해소는 linter 추론이 아니라 Gate에서의 사람 판단입니다.
- **첫 wired 표면**: plan-level 핸드오프가 `/distill`의 첫 wired 표면입니다. 세션-중 pruning과 서브에이전트 핸드오프는 후속 표면으로 누적됩니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install diylisis@epistemic-protocols
```

## 사용법

```
/distill [선택: next-task 또는 수신자]   # 작업 맥락을 이식 핸드오프로 증류
```

## 라이선스

MIT
