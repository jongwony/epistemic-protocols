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

- **F0 — 핸드오프 계약**: 수신자, next task, 허용 소스, 범위, 검증, 정지 조건, **핸드오프 내구성(handoff durability)**(`OneShot` | `ExternalVersioned` | `DurableRepo`)을 선언합니다. 관련성과 최소성의 전제이며, 내구성이 교정 원장을 조건화합니다.
- **F1 — 지표 폐쇄(Deictic closure)**: 각 세션-로컬 토큰을 canonical 참조로 정규화합니다. grounding보다 선행하여 grounded 항목이 안정 참조를 가리키도록 합니다. `surface_token → canonical_ref → confidence → unresolved?`를 산출합니다. 먼저 **secret-redaction 스윕**이 실행됩니다 — secret 형태의 내용(credential, token, key, `$(...)` command-substitution 참조)을 disposition 전에 placeholder로 가로채므로(실제 보호막), secret이 평범한 KEPT 항목으로 흘러가지 않고 그 값이 새 수신자에게 도달하지 않습니다. 그럼에도 secret 값이 emit 후보에 도달하면(F1 누락, 또는 redact된 값이 다운스트림으로 복사된 경우) **F6 emit-scan**이 backstop합니다 — `redacted-load-bearing` residual을 추가해 Gate로 라우팅하므로, emit 속 secret 값은 Gate가 그 값을 제거할 때까지 수렴을 차단합니다(별도 secret measure leg가 아니라 residual ledger가 운반하며, DROP된 내용에 대한 leak lint는 별개의 backstop). command-substitution 형태는 검색 명령은 보존하고(해소된 값만 redact) 새 수신자가 out-of-band로 재취득하며, load-bearing secret은 Gate로 표면화되어 secret store로 ROUTE되거나 out-of-band로 공급됩니다.
- **F2 — Grounding 폐쇄**: 각 항목의 자기완결성을 inline / stable-pointer / routed-residual로 감사합니다. silent residual은 허용되지 않습니다.
- **F3a — 수신자-관련성**: 선언된 next task에 대해 각 항목을 판정합니다.
- **F3b — 변환-출처(Transformation-provenance)**: 3분할 verdict — **CorrectedKeep**(매칭되는 비-잠정 미만료 `KEEP` `CorrectionDelta`, DurableRepo 전용), **ObservedKeep**(교정 기록이 없고, support-integrity로 값과 결합된 durable·직접 관측 가능 출처 — 원장 없이, Gate 없이 직접 KEEP), **Unknown**(관측 기반도 delta도 없음 → Gate). 평범한 출처-기반 상태는 ObservedKeep이므로 원장 부재가 더 이상 모든 항목을 Gate로 보내지 않습니다. KEEP은 외관으로 추론되지 않으며, correction이 필요한 주장은 여전히 원장 또는 Gate Resolve가 필요합니다.
- **F3 — 처분(Disposition)**: KEEP(inline) | ROUTE(StableRef) | DROP.
- **F4 — 압축 폐쇄**: 최소-완전(minimal-complete) 집합만 유지합니다 — 계약-상대적 완전성이지, 미적 간결성이 아닙니다.
- **F5 — 이해 게이트**: refute 자세의 `zero-memory-refuter` subagent(fresh context, 세션 용어 watchlist, 근거 인용 verdict; 플랫폼 사다리: named agent → generic fresh subagent → lint 체크리스트, lint 단계는 fresh-context 격리가 없는 약화된 실현)로 zero-memory 수신자 기준에 대해 검증합니다. 저자 self-simulation은 배제됩니다. **prose-only 삭제 테스트**를 포함합니다: TaskStateBlock, correction ledger, 네이티브 task-state, 모든 agent-specific affordance를 무시했을 때, next task가 prose 채널 + allowed sources만으로 여전히 실행 가능해야 하며 — 그렇지 않으면 게이트가 Fail합니다.
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
| **KEEP(inline)** | 항목을 inline으로 유지. CorrectedKeep(매칭되는 비-잠정 `CorrectionDelta`, DurableRepo), ObservedKeep(support-integrity를 갖춘 durable 관측 출처, 직접 KEEP), 또는 사용자 Resolve 응답으로 도달 가능. |
| **ROUTE(StableRef)** | 수신자가 해소하는 안정 참조(path, id, url, command)로 항목을 운반. |
| **DROP** | 항목이 선언된 next task에 기여하지 않음; 핸드오프에서 해제. |

Gate에서, 표면화된 residual 또는 unknown-provenance 항목은 `Resolve | Route | Drop | Defer`로 응답합니다.

## 출처 하드라인(The Provenance Hard Line)

F3b는 항목의 *외관*으로 KEEP을 추론하지 않습니다. KEEP은 정확히 세 경로로만 도달합니다: **CorrectedKeep** — 매칭 `CorrectionDelta`가 비-잠정 상태로 `export_policy = KEEP`을 가지고 `validity_horizon`이 만료되지 않음(DurableRepo 전용; 원장의 권위로, 교정·이견·노후·user-구성 주장에 한정); **ObservedKeep** — 교정 기록이 없고, support-integrity로 값과 결합된 durable·직접 관측 가능 출처(파일 읽기, 명령 출력, PR/이슈 URL, durable stable-ref)로 원장·Gate 없이 직접 KEEP; 또는 Gate에서의 사용자 **Resolve**. 관측 기반도 delta도 없는 항목은 **Unknown** — KEEP으로 기본 처리되지 않고 Gate에서 사용자 판정으로 표면화됩니다. ObservedKeep은 저자의 미검증 신념이 아니라 수신자가 재관측 가능한 외부 기반에 대한 relay이므로, (단순 currency가 아닌) support-integrity가 기준이며 불확실/이견 기반은 보수적으로 Unknown입니다. **correction이 필요한 주장은 여전히 원장이 필요하다는** 하드라인은 유지됩니다: 관측 출처에서 벗어난 주장은 ObservedKeep이 될 수 없습니다. 원장 스키마와 read contract는 [`references/correction-delta-schema.md`](./skills/distill/references/correction-delta-schema.md)를 참조하세요.

교정 원장은 **핸드오프 내구성에 조건적**입니다: `DurableRepo`(durable·재증류 in-repo 핸드오프 — CorrectedKeep이 도달 가능한 유일 모드)에서만 유지됩니다. `OneShot`(일시적, 일회용)은 원장을 두지 않고, `ExternalVersioned`(Notion, Linear 등 외부 버전 저장소)는 외부 시스템의 네이티브 히스토리에 위임하며 그 버전 핸들을 provenance 포인터로 기록합니다. 이는 ObservedKeep과 짝을 이뤄, 일상적 일시·외부 대상 핸드오프의 흔한 gate storm을 무너뜨립니다.

## 보증 등급(Assurance Tiers)

산출물의 라벨은 실제 적용된 엄밀성만큼만 정직하게 반영합니다 — 낮은 등급이 높은 등급의 주장을 빌리지 않습니다:

| 등급 | 라벨 | 실행 내용 |
|------|------|-----------|
| (a) | **Quick handoff draft** | 평문 Markdown만 — F5 게이트·감사·원장 없음. PortableHandoff 주장을 **하지 않음**. |
| (b) | **Certified light /distill** | F5 1회 통과(prose-only 삭제 테스트 포함) + leak / durable-pointer 감사 1회 + secret-redaction 스윕; 실제 correction이 없으면 원장 없음. |
| (c) | **Heavy /distill** | 전체 refuter + watchlist + residual Gate + `CorrectionDelta` 원장 + leak lint + 수렴 증거 + re-distillation(DurableRepo 경로). |

**정직 라벨 규칙**: 형식적 `converge` 전이는 Pass verdict로 고정점에 도달한 어떤 등급에서도 발생합니다 — tier (b) 포함, 즉 certified-light 핸드오프도 형식적으로 수렴하여 정당한 `PortableHandoff`를 산출합니다. 다만 보증 **라벨** "converged /distill"은 더 좁아서, 전체 보증 추적을 거친 tier-(c)의 Pass-verdict 고정점에만 허용됩니다. refuter를 건너뛴 산출물(tier (a))은 **draft / degraded handoff**이며 — `PortableHandoff`도 "converged /distill"도 아닙니다. tier (b)가 PortableHandoff 주장의 하한입니다.

## 알려진 한계

- **원장 쓰기는 re-distillation으로 한정**: F3b는 `CorrectionDelta` 원장을 읽기 전용으로 소비하고, F7 re-distillation emit이 원장에 append합니다(Rule 19). 세션 중 교정 델타를 기록하는 메커니즘은 별도의 후속 과제입니다.
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
