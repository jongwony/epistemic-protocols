# M7 — `/elicit` 역추적: 새 프로토콜의 결손 후보

**성격**: 판정이 아니라 **구성 시도**. 구성 실패도 결과이며, 실패는 M1(형식 타입)의 답이 된다.
**수행자**: 실행 세션(Stint) 직접. 격리 서브에이전트가 아님 — `/elicit` 은 쌓인 컨텍스트와 기질에서
역추적하므로 격리하면 재료가 없어진다.
**기준 커밋**: `444d776b`

---

## Phase 0 — aporia 판정

`aporia(I) = true`. 근거:
- **axis_undetermined**: 발화 "재타이핑으로 대체할 새 프로토콜"은 어느 축이 결정 차원인지 고정하지
  않는다 — 결손 타입인가, 이름인가, 루프의 모양인가, 라우팅(명령 하나)인가.
- **substrate_implicit**: 저장소·규칙·선행 트레이스가 그 좌표들의 값을 이미 암묵적으로 들고 있다
  (아래 Phase 1 증거).

---

## Phase 1 — 기질 스캔 (채널별 인용)

### Codebase

| # | 증거 | 출처 |
|---|---|---|
| C1 | `/apportion` 은 자기 범위에서 **순서·독립·화해·종료·라우팅을 명시적으로 배제**한다 — "Pre-conduct: unit boundaries and conditions only" | `merismos/skills/apportion/SKILL.md:4` (frontmatter description) |
| C2 | 그 배제는 문장이 아니라 **타입 술어로 집행**된다: `topology_free(req) ≡ req contains no UnitRef, Move, MoveRegion, or order-position reference` | `merismos/skills/apportion/SKILL.md:120` |
| C3 | Rule 7 이 그것을 강제: "Plan conditions stay plan-level … a topology-free property … never a named unit or order-position — that axis is outside this protocol's own scope" | `merismos/skills/apportion/SKILL.md:574` |
| C4 | `/conduct` 는 **이미 draft-first** 다: "designs the conduct topology draft-first — filling every axis·region with a reasoned value shown beside the alternatives it displaces … then opening a value gate only where the user points" | `hyphegesis/skills/conduct/SKILL.md:12` |
| C5 | draft-first 가 무엇을 만족해야 하는지까지 이미 불변식으로 인쇄돼 있다 (`topology_drafted_whole`) | `hyphegesis/skills/conduct/SKILL.md:142` |
| C6 | **`/conduct` 는 컨텍스트 경계를 이미 타입에 들고 있다**: `MethodBrief = { work_intent, expected_handoff, span }`, `span = invocation → the next planned /compact or /clear` | `hyphegesis/skills/conduct/SKILL.md:63` |
| C7 | **라우팅 축에 span 을 넘는 값이 이미 있다**: `handoff_to_span: the move/region output crosses the span wall to a future span that does not share this session's context` | `hyphegesis/skills/conduct/SKILL.md:72` |
| C8 | `/apportion` 의 판별 근거는 **크기**(`ExecutionHorizon`, `SpanFit ∈ {Fits, Overflows, Indeterminate}`), `/conduct` 의 판별 근거는 **오염 통제**(`independence ∈ {isolated, shared}`) — 서로 독립인 두 근거 | `apportion:88,95` · `conduct:69` |
| C9 | 두 프로토콜 사이 이음매는 **양방향 자문(advisory), 전제조건 아님**; 넘어가는 것은 계획 레코드의 포인터(navigation block)이지 내용의 복사가 아니다 | `merismos/skills/apportion/SKILL.md:578` (Rule 9) |

### Rules

| # | 증거 | 출처 |
|---|---|---|
| R1 | TYPES 는 계약의 **경직 층**이고 경직 층은 결정적 논리만 담는다 — 취약·휴리스틱 단계는 지시 층으로 (volatility criterion) | `.claude/rules/type-category-convention.md` |
| R2 | 닫힌 coproduct 의 각 생성자는 PHASE TRANSITIONS 에서 **서로 다른 처리 경로**를 가져야 한다 (dispatch-structure test) | 같음 |
| R3 | 열림 기준: 값 공간의 경계를 **런run 과 독립하게** 결정하는 의무가 있어야 authored closure 가 정당 (openness criterion) | 같음 |
| R4 | 조사 writeup·근거 리뷰는 상태 표면(`docs/`)이 아니라 심의 표면(이슈/PR 본문)으로 | `AGENTS.md` §Design Placement |

### Session / 선행 트레이스

| # | 증거 | 출처 |
|---|---|---|
| S1 | 두 결손은 **겹치지만 어느 쪽도 다른 쪽을 포함하지 않는다**. `GoalPlanUncompiled ∧ ¬MethodUnderdetermined` 와 `MethodUnderdetermined ∧ ¬GoalPlanUncompiled` 둘 다 실제로 서식 | `codex_answer_deficit_containment.md` §1 |
| S2 | 합병하면 `Apportion over Order` 불변식이 **하나의 파일 안 내부 위상 장벽으로 되살아나야** 한다 — 같은 경계가 안쪽으로 옮겨질 뿐 | 같음 §5 |
| S3 | 합친 이름은 `/plan` 류 일반 명사 + 선언지 결손(`WorkPlanUnderdetermined`)이 되어 `/delimit` 을 은퇴시킨 어휘 정밀도를 잃는다 | 같음 §4 |
| S4 | 장수 워커 판별 속성: "정확한 완료가 **하나의 진화하는 약속과 권위 상태 궤적**이 둘 이상의 컨텍스트 에포크를 넘어 살아남기를 요구하는가" — 지속시간은 경고 신호일 뿐 | `goal_research_stint_conducting.md` §1 |
| S5 | 독립성/오염 회피는 컨텍스트 격리를 정당화하지만 **그것만으로 장수 워커를 정당화하지 않는다** | 같음 |

### Measurement (실측, 재계측 금지)

- 세션 30,380 전수: both **6** · conduct-only **43** · apportion-only **25** → 74 중 **68(92%) 단독**
- 게이트 산술: 경합 단위 5개에 **9–10 + k**, apportion draft-first 이후 **5–6 + j + k**
- 차수 `O(단위 수)` → `O(1 + 다툰 자리)`

### Utterance (발화 자체의 의미 모호)

- 인용: "**대체할** 새 프로토콜을 신설해야 하는가" — `대체`가 (a) 두 프로토콜의 은퇴를 포함하는지,
  (b) 명령 표면 하나로의 통합만을 뜻하는지 발화가 고정하지 않는다.
- 인용: "**작업 분할·실행자 할당·흐름 지휘를 한 번에 구성한다**" — 여기 `실행자 할당`은 현재 어느
  프로토콜의 범위도 아니다. `/apportion` 의 `CapabilityRequirement` 는 "descriptive only,
  executor-neutral"(`apportion:98`)이고, `/conduct` 의 `routing` 은 산출물이 어디로 가는지를
  정하지 실행자를 바인딩하지 않는다. **세 번째 것이 발화에 섞여 있다.**

---

## Phase 1 — ReverseTrace: 결손 구성 시도 세 개

선례(euporia)의 재타이핑이 성립한 조건을 먼저 명시한다: clarify(`IntentAmbiguous`) + telos
(`GoalUndefined`) → euporia(`AbstractAporia`) 는 **두 결손이 하나의 기질을 공유**했고 그 기질 위에서
**하나의 조작**(역귀납)이 둘 다를 덮었기 때문에 성립했다. 새 타입은 합집합이 아니라 *공유 기질 +
공유 조작* 이었다. 아래 세 시도는 각각 그 형태를 재현하려는 것이다.

---

### 후보 A — `HandoffUncompiled` (인계 미컴파일)

> **결손**: 일이 이 심의를 공유하지 않을 실행자에게 넘어가려 하는데, 그 실행자가 필요로 하는 것
> (무엇으로 잘렸는지, 무엇이 done 인지, 무엇이 무엇보다 먼저인지)이 **인계를 견디는 형태로**
> 아직 컴파일되지 않았다.
>
> **공유 기질**: 인계 시점까지 쌓인 컨텍스트 + 사용자 발화.
> **공유 조작**: 그것을 컨텍스트를 공유하지 않는 수신자가 행위할 수 있는 형태로 컴파일.

**비선언지 시험**: 통과(잠정). 결손이 "사용자가 아직 계획을 말하지 않았다"가 아니라 "전이가
불가능하다"이므로 사용자가 답을 말해도 해소되지 않는다.

**분리 시험 — S1 의 두 증인에 대어본다**:

| 증인 | 후보 A 가 덮는가 |
|---|---|
| W1 `GoalPlanUncompiled ∧ ¬MethodUnderdetermined` — 자율 목표, 미컴파일 계획, 지휘는 자명(단일 단위) | **덮는다.** 단위와 done 조건은 여전히 인계를 견뎌야 한다 |
| W2 `MethodUnderdetermined ∧ ¬GoalPlanUncompiled` — 명확한 작업 전망, 여러 인지 이동의 배치가 비자명, 자율 의도 없음 | **덮지 못한다.** `/conduct` 는 **이 세션 안에서 수행되는** 이동들의 순서·화해에도 발화한다. 인계가 없어도 `MethodUnderdetermined` 는 성립한다 |

**판정(구성)**: 후보 A 는 `MethodUnderdetermined` **보다 좁다**. 이것으로 타입 잡은 프로토콜은
`/conduct` 를 **대체하지 못하고**, 지금 `/conduct` 가 서비스하는 세션-내 이동 위상 사례를 미커버로
남긴다. → **대체 재타이핑으로서 실패.**

---

### 후보 B — `PreRunUnderdetermined` (실행 전 미결정)

> **결손**: 자율 실행이 시작되기 전에, 무엇으로 잘리는지와 그 조각들이 어떻게 관계하는지가 둘 다
> 열려 있고, **어느 한쪽을 다른 쪽과 독립하게 정할 수 없다.**

**비선언지 시험**: 통과. "상호 의존적으로 미결정"은 선언으로 해소되지 않는다.

**분리 시험**: **실패.** 이것은 두 결손의 합집합에 "상호 의존" 수식을 붙인 것이다. 그리고 결정적으로
— C2·C3 가 보여주는 대로 `/apportion` 은 상호 의존을 **부정하는 것**을 자기 규율로 삼는다
(`topology_free`, Rule 7). 후보 B 로 타입을 잡으면 그 불변식은 사라지는 게 아니라 **한 파일 안의
내부 위상 장벽으로 되살아나야 한다**(S2). 재타이핑이 아니라 중첩(nesting)이다.

**추가 관측 — 이 후보의 자기모순**: 후보 B 가 참이려면 `topology_free` 가 틀렸어야 한다. 그런데
`topology_free` 는 산문이 아니라 **타입 술어로 집행**되고 있다(C2). 후보 B 를 세우는 일은 곧 그
술어를 반증하는 일이며, 이 심문에 제출된 어떤 증거도 그 반증을 하지 않았다.

---

### 후보 C — `ContinuityUnprovisioned` (연속성 미비)

> **결손**: 일이 컨텍스트 에포크를 넘어갈 것인데, 매 넘어감에서 살아남아야 하는 것 — 권위 상태,
> 미결 의무, 다음 행동, 복구 절차 — 이 아직 마련되지 않았다.
> **방향**: 넘어감을 마련한다(provision the crossing).

이것이 **기질 변화가 실제로 가리키는 결손**이다. S4 의 판별 속성을 그대로 타입화한 것이다.

**비선언지 시험**: 통과. 사용자가 "이건 오래 걸려"라고 말해도 무엇이 살아남아야 하는지는 결정되지
않는다 — S4 가 명시하듯 지속시간은 경고 신호일 뿐이다.

**분리 시험 — 기존 둘 안에 있는가**:

| 기존 | 후보 C 를 포함하는가 |
|---|---|
| `/apportion` | **아니다 — 정반대다.** horizon fit 은 단위가 **하나의** 실행 지평에 맞을 것을 요구한다(C8). 그 규율은 넘어감을 *마련*하는 게 아니라 *불필요하게* 만든다 |
| `/conduct` | **부분적으로 그렇다.** C6 의 `span` 과 C7 의 `handoff_to_span` 이 이미 span 벽을 타입에 들고 있다. 다만 `/conduct` 의 형태소는 "design THEN hand off, substrate executes"이고 실행 중 상태를 들지 않으므로, **넘어감에서 무엇이 살아남는지는 마련하지 않는다** |

**판정(구성)**: 후보 C 는 **구성 가능하고 비선언지이며 기존 둘 어느 쪽에도 온전히 포함되지 않는다.**
그러나 — **이것은 대체가 아니라 추가다.** 후보 C 로 프로토콜을 세워도 `GoalPlanUncompiled` 와
`MethodUnderdetermined` 는 그대로 남는다. 원 질문이 물은 "두 프로토콜을 대체할" 자리에 후보 C 는
서지 못한다.

---

## M7 산출 요약 (M1·M2·M5 브리프에 전달되는 것)

1. **대체 재타이핑을 지지하는 결손을 구성하지 못했다.** 시도 셋 중 A 는 `/conduct` 보다 좁아 대체
   실패, B 는 합집합의 위장이며 자기가 부정해야 할 타입 술어(`topology_free`, `apportion:120`)를
   반증하지 못한다.
2. **기질 변화가 가리킨 결손은 실재하지만 다른 것이다.** 후보 C `ContinuityUnprovisioned` 는
   비선언지이고 기존 둘에 포함되지 않으나 **추가지 대체가 아니다.**
3. **제안의 판별 특징으로 제시된 draft-first 는 이미 `/conduct` 에 있다**(C4·C5). 새 프로토콜의
   정체성을 담지할 수 없다. 실측이 가리키는 개입은 `/apportion` 을 draft-first 로 바꾸는 것이다.
4. **기질 변화(Stint)도 이미 부분 흡수돼 있다**: `MethodBrief.span`(C6), `handoff_to_span`(C7).
   흡수되지 않은 잔여는 "넘어감에서 무엇이 살아남는가"뿐이다.
5. **발화에 제3의 것이 섞여 있다**: `실행자 할당`은 현재 어느 프로토콜의 범위도 아니다
   (`apportion:98` 은 executor-neutral, `/conduct` 의 routing 은 산출물 목적지이지 실행자
   바인딩이 아님). 이것이 진짜 미커버 자리일 수 있다.

---

## Phase 2 좌표 — 라이브 사용자가 답했을 것 (게이트를 대신 답하지 않고 체크포인트로 올림)

이 세션에는 사용자가 없다. `/elicit` Phase 2 는 Constitution 게이트이므로 **대신 답하지 않고**
종합 체크포인트로 넘긴다.

| 좌표 | 질문 | 기질 근거 | 차등 함의 |
|---|---|---|---|
| **대체의 뜻** | "대체"가 두 프로토콜의 은퇴를 포함하는가, 명령 표면 하나로의 통합만인가 | 발화가 고정하지 않음 | 은퇴 포함 → M1 의 상호폐쇄 시험이 결정적. 표면 통합만 → 타입 질문이 아니라 라우팅 질문이 되고 심문 전체의 축이 바뀜 |
| **후보 C 의 거처** | `ContinuityUnprovisioned` 가 실재한다면 새 프로토콜인가, `/conduct` 의 여섯 번째 축인가 | C6·C7 이 이미 span 을 들고 있음 | 새 프로토콜 → 프로토콜 수가 늘고 92% 단독 사용 패턴에 넷째 항이 추가됨. 축 추가 → `/conduct` 의 Gen 집합이 커지고 draft 표면이 넓어짐 |
| **실행자 할당의 소속** | 발화의 `실행자 할당`을 어디에 두는가 | `apportion:98` executor-neutral · `conduct:72` routing 은 목적지 | 계획에 두면 `/apportion` 의 executor-neutral 규율을 깬다. 런타임에 두면 S4 의 "capability-named plan + late binding" 과 정합하고 어느 프로토콜도 바꿀 필요가 없다 |
| **draft-first 의 지위** | 이미 `/conduct` 에 있는 것을 새 프로토콜의 특징으로 볼 수 있는가 | C4·C5 | 볼 수 없다면 제안의 판별 특징이 사라지고 남는 동기는 게이트 수뿐 → codex 의 최소 수리(apportion draft-first)로 귀결 |

**남는 Λ.deferred (기질이 근거를 못 댄 투영)**: 없음. 위 넷은 전부 구체 인용을 갖는다.
