# M5 — 근거 접근 연속성(Ground-Access Continuity) 렌즈

**질문**: `/apportion`(Merismos, `GoalPlanUncompiled`)과 `/conduct`(Hyphegesis, `MethodUnderdetermined`)를
합집합 병합이 아니라 재타이핑으로 대체할 새 프로토콜을 신설해야 하는가.
**렌즈**: 추론자가 컨텍스트 불연속을 넘어 자기 판단의 근거에 닿을 수 있는가.
**역할**: Investigator. **기준 커밋**: `444d776b`.

## 렌즈 경계 (먼저 인용)

`AGENTS.md:22` "Harness boundary": "this project unfolds the epistemic layer only. Harness concerns —
tool schema limits, permission models, execution channels, state mutation — fall outside what these
instruction surfaces govern: no rule is authored here for them, and no claim is made here about where
they are settled instead... A protocol names its delegation point — where execution hands off — and
stops there, naming the capability the handoff requires rather than a tool that could supply it."

`AGENTS.md:21` "Session-handoff routing": "work crossing a session boundary is handed over as a
pointer into the canonical record, never as a re-authored copy of it... the moment the author selects
the items, the corruption a pointer avoids re-enters at small scale."

이 두 절이 이 렌즈의 전체 분석 프레임이다: 아래 어디서든 "실행자가 어떻게 세션을 유지하는가/소켓이
살아있는가/재시도가 어떻게 구현되는가"에 닿으면 그 지점에서 멈추고 명시적으로 표시한다.

---

## 1. 고유 기여

이 렌즈만 드러내는 것: 두 프로토콜은 이미 **동일한 포인터 기제**(`NavigationBlock` /
`HandoffLocator` / dereference-instruction / grounding-instruction / stop-on-실패)를 프로토콜 사이
이음매(`/apportion → /conduct`)와 프로토콜 내부 이음매(`/conduct`의 `handoff_to_span`) 양쪽에
재사용하고 있으며, 그 기제는 애초에 "누가 반대편에 있는가"에 무관하게 설계돼 있다
(`locator(C) ... substrate-neutral by construction`, `merismos/skills/apportion/SKILL.md:160`).
따라서 원 질문의 동기인 "실행자가 이제 피어 세션(Stint)까지 포함한다"는 사실은, 근거 접근이라는
축에서는 **이미 흡수된 일반성의 한 사례를 추가하는 것**이지 새 타입을 요구하는 사건이 아니다. 이
렌즈가 유일하게 보는 것은, 두 프로토콜이 "무엇이 경계를 넘어 살아남는가"에 대해 서로 **다른 종류의
전략**(구운 증거 vs 지연된 질문 형태)을 이미 정확히 분업하고 있다는 점이며, 이는 다른 렌즈(형식
타입, 계보, 인지 부하, 해석학)가 보는 좌표와는 독립인 근거다.

---

## 2. 프레임워크 분석

### 2.1 (Q1) 근거 접근의 현재 설계 — 포인터가 보장하는 것과 보장하지 않는 것

`/apportion`이 만드는 것: 하나의 캐리어 레코드에 계획을 파킹하고(`park_carrier(plan) → C`,
`apportion:69` 인근 FLOW), 그 위에 고정 형태 내비게이션 블록을 얹는다:

> `N = NavigationBlock { purpose_frame: String, canonical_locator: HandoffLocator,
> dereference_instruction: DereferenceInstruction, snapshot_anchor: Option(String),
> grounding_instruction: GroundingInstruction }` (`apportion:161`)

Rule 9(`apportion:576`, No-reentry across the `/conduct` seam): "What crosses into `/conduct` is a
navigation block over the plan record this protocol parked — a pointer, so the plan's contents stay
in that record rather than being copied across the seam." `/conduct` 쪽 Rule 20(`conduct:477`)이
정확히 대칭으로 확인한다: "this protocol never re-declares the producer's fields, never re-derives
what a condition means, and never copies the plan onto its own artifact — the navigation block
travels instead."

**포인터가 보장하는 것**: (a) 단일 진실원 — 사본이 원본과 몰래 어긋날 길이 원천 차단된다
(`AGENTS.md:21`의 근거: "the moment the author selects the items, the corruption a pointer avoids
re-enters at small scale" — 저자가 무엇을 담을지 고르는 순간 이미 왜곡이 시작되므로, 사본이 아니라
포인터를 넘긴다). (b) `.claude/principles/architectural-principles.md:85`가 이를 일반 원리로
서술한다: "The partition is **re-derivability by the consumer**: context reconstructable from shared
substrate ... is passed by reference ... context the consumer cannot reconstruct ... is copied so it
survives the handoff intact." 계획 레코드 자체는 소비자가 재구성할 수 없는 내용(사용자의 실제 결정)
이므로 그 레코드는 남아있고, 그것을 "찾아가는 법"만 넘어간다.

**포인터가 보장하지 않는 것**: 소비 시점에 그 역참조가 **성공한다는 것 자체**는 보장하지 않는다.
locator가 stale해지거나, 세션 절반이 사라지거나, 근거 전제(load-bearing premise)가 더 이상
지지되지 않을 수 있다 — 이것이 바로 다음 절의 주제다.

### 2.2 (Q2) 근거 불도달 시 정지가 보호하는 것

두 프로토콜 모두 역참조 실패 시 **정지**한다:

- `apportion:19`, `apportion:169`, `apportion:201`: `locator in scope ∧ (¬dereferenceable ∨
  support-integrity failure) → relay(handoff unreadable ...) → deactivate`
- `apportion:579` (Rule 12, "Stateless compile, but never blind"): "a locator that is present but
  will not dereference — unreachable, missing its session half, resolving to no such unit, or a
  load-bearing premise the grounding pass cannot support — stops the protocol instead of falling
  through to the uncompiled path"
- `conduct:18`, `conduct:162`, `conduct:253` (Phase 0 `DereferencePlan`): "An unreachable source, an
  absent session half, or an unsupported load-bearing premise surfaces handoff unreadable and
  deactivates"

`apportion:119`가 이 정지의 **인식론적 이유**를 정확히 명시한다: `PlanStateRequirement`는
"cites the evidence the requirement rests on and is never empty ... whether that evidence still
tracks what it asserts is the **receiving side's support-integrity judgment**, not something this
protocol certifies at compile time."

이것은 `premise/recognition-and-authority.md` §"Context and Utterance as First-Class Ground"이 정확히
금지하는 것의 역상이다: "A criterion whose right answer varies with the accumulated context and what
the user has actually said stays open to runtime resolution; it is not closed in advance... Closing
such a coordinate ... the answer was already written before anyone was asked." 컴파일 시점의
`/apportion`은 "이 증거가 지금도 그 명제를 지지하는가"라는, 본질적으로 **미래의 컨텍스트에 대한
질문**을 답할 수 없다 — 그 질문의 답은 답을 필요로 하는 바로 그 시점의 살아있는 컨텍스트에서만
난다. 정지는 이 열린 자리를 **닫힌 답으로 위장하지 못하게 막는 안전장치**다. 만약 실패 시 조용히
통과했다면, 컴파일 시점 AI의 (이미 접근 불가능해진 컨텍스트에 대한) 낡은 지원-무결성 판단이 살아있는
판단을 대신하게 된다 — 이는 그 축이 금지하는 정확히 그 사례("an ungrounded authorial default ...
an answer embedded in the type")다.

**후보 A·C에 대한 함의**: 후보 A(`HandoffUncompiled`)가 "인계를 견디는 형태로 더 많이 컴파일해
넣자"는 방향이라면, 이는 위 설계가 의도적으로 거부하는 것과 정면으로 부딪힌다 — 지원-무결성 판단을
수신측의 살아있는 재-도출로 미루는 것이 설계의 핵심이지, 발신측이 더 많이 구워 넣어 재-도출을
불필요하게 만드는 것이 아니다. 후보 A가 "포인터 자체·grounding_instruction이 빠져 있다"는 좁은
의미라면, 그것은 이미 `NavigationBlock`의 필드로 존재한다(`apportion:161`). 후보 C
(`ContinuityUnprovisioned`)에 대해서는: "정지하고 이유를 말한다"는 것 자체가 **이 인식론 층이 줄 수
있는 전부인 복구 절차**다 — 그 이상(재접속, 재시도, 자격 재획득)은 하네스다(§5에서 다시 다룸).

### 2.3 (Q3) 결손을 가르는가 — `GoalPlanUncompiled` vs `MethodUnderdetermined`

각 프로토콜이 넘기는 것의 **내용 종류**가 다르다:

- `/apportion`은 `ConditionBearingUnitPlan`을 넘긴다 — 단위별 완료/불변 조건을 **이미 도출된
  술어**로 굽는다. `plan_condition(d)`의 `basis`는 예컨대 `{Evidence { source: "the DefineNow
  answer at the whole-goal acceptance gate", content: d }}`(`apportion:146`)처럼, **판단의 결과인
  내용 자체를 구워 넣는다**. 여기서 컨텍스트 경계를 넘을 때 위험한 것은 "이미 내려진 판단의 근거가
  아직도 유효한가"라는 **명제적 staleness**다.
- `/conduct`는 `ConductedMethod`를 넘긴다 — 위상(order/independence/reconciliation/termination/
  routing) 자체는 이미 확정되지만, 그 위에 얹히는 `CheckpointBrief`는 **구조만 굽고 내용은 굽지
  않는다**: `Slot(T) = a typed placeholder compiled at design time and filled with T by the
  substrate at execution`(`conduct:79` 인근), Rule 16(`conduct:473`): "The brief is a contract of
  structure, not content — references and slots, never copies." 여기서 위험한 것은 "아직 내려지지
  않은 판단을 내릴 수 있는 자격(살아있는 컨텍스트)이 그 시점까지 남아있는가"라는, 명제 staleness와
  **다른 종류**의 문제다 — synthesis output shape 같은 결정은 설계 시점에 아직 답이 없고
  (`checkpoint_set`/`deferred_decisions`, `conduct:100`), 체크포인트가 발화하는 시점의 살아있는
  사용자가 답해야 한다.

`.claude/principles/architectural-principles.md:85`의 "reference vs copy" 분할("re-derivability by
the consumer")을 두 협약에 각각 적용하면: `/apportion`의 조건 근거는 "소비자가 재도출할 수 없는
것"이라 **내용째** 구워 넣힌다(copy). `/conduct`의 체크포인트 슬롯은 "재도출은 되지만 아직 그 재도출을
할 근거(컨텍스트)가 없는 것"이라 **질문의 형태만** 구워 넣힌다(reference to a future derivation).

**판정**: 근거 접근 연속성 축에서 두 결손은 **같은 종류의 근거 상실을 겪지 않는다** —
`GoalPlanUncompiled`는 "구운 답이 상할 위험"을, `MethodUnderdetermined`는 "아직 구워지지 않은
질문이 물어질 자격을 잃을 위험"을 각각 관리한다. 이것이 왜 통합에 저항하는지: euporia의 선례(clarify
+ telos)는 두 결손이 **하나의 조작**(역귀납)으로 덮이는 하나의 기질을 공유했기 때문에 성립했다. 여기
두 프로토콜은 "굽기"(bake content in)와 "미루기"(defer content, ship structure)라는 **서로 다른
조작**을 이미 자기 내용 종류에 맞춰 올바르게 분업하고 있다 — 하나의 새 프로토콜이 이 둘을 한 타입
안에서 재현하려면 결국 그 분업을 그 파일 **내부의 경계**로 되살려야 한다. 이것은 M7의 S2("합병하면
`Apportion over Order` 불변식이 하나의 파일 안 내부 위상 장벽으로 되살아나야 한다")가 위상 축에서
관찰한 것과 **같은 모양의 실패가 근거 접근 축에서도 독립적으로 재현됨**을 뜻한다 — 이는 M7의 결론에
대한 이 렌즈만의 독립 확증이다.

### 2.4 (Q4) span이 이미 타입에 있다는 사실 — 흡수된 것과 흡수되지 않은 것

`/conduct`는 컨텍스트 경계를 이미 타입에 들고 있다:
`MethodBrief = { work_intent, expected_handoff, span }`, `span = invocation → the next planned
/compact or /clear`(`conduct:63`). `Gen(routing)`은 `handoff_to_span`을 1급 값으로 갖는다
(`conduct:72`): "the move/region output crosses the span wall to a future span that does not share
this session's context."

**이미 흡수된 것**:
1. span 벽이 **존재한다는 사실 자체**가 타입에 있다(`MethodBrief.span`).
2. **어느 리전의 산출물이 벽을 건너는가**라는 설계 시점 판단이 여느 축 값과 동일하게 draft-first로
   다뤄진다(`Gen(routing)`, `conduct:72`).
3. **건너가는 형태**가 새로 발명되지 않고 `/apportion`이 이미 쓰는 것과 **동일한 고정 형태**를
   재사용한다 — Rule 19(`conduct:476`): "the future span receives a navigation block over that
   record ... its purpose and frame, the record's canonical locator, a dereference instruction, a
   snapshot anchor ..., and a grounding instruction ... never a re-authored copy." 즉 프로토콜
   사이 이음매(`/apportion → /conduct`)와 span 벽을 넘는 이음매(`/conduct`의 출력 → 미래 span)가
   **같은 타입 가족**을 쓴다.
4. 외부화 의무의 **선언**까지가 `/conduct`의 몫이라는 경계도 타입에 있다(`conduct:420`):
   "It carries an externalization obligation that `/conduct` does not discharge itself: it declares
   that obligation in the handoff annotation ... The executing substrate externalizes the output."

**흡수되지 않은 것 — 그리고 그것이 우연이 아니라는 증거**: `conduct:493`(Guard,
"cross-span-absorption")이 명시적으로 이것을 프로토콜의 **범위 밖으로 못 박는다**: "the `handoff_to_span`
routing value pulls author-side portability machinery (deictic closure, self-containment audit, a
comprehension gate) or **the far-side compile-back** into `/conduct`, making it conduct a different
span's cognition. Guard: ... Auditing the record on the author's side is out of scope in the same way
the compile-back is; **both belong to the receiving span**." 즉 미흡수 잔여는 "넘어감에서 무엇이
살아남는가" 일반이 아니라, 구체적으로 **far-side compile-back**(수신 span이 그 레코드로부터 인지를
재개하는 방법)이며, 이것은 사실 발견된 누락이 아니라 **설계가 의도적으로 거절한 자리**다. M7의 산출
#4("흡수되지 않은 잔여는 '넘어감에서 무엇이 살아남는가'뿐이다")를 이 렌즈는 확증하되 한 단계
정밀화한다: 그 잔여는 우연한 미완성이 아니라, 이 protocol이 스코프 크립을 막기 위해 **정면으로 선언한
경계**다. 새 프로토콜이 이 자리를 메우려 한다면, 그것이 정확히 이 가드가 이름 지어 금지하는
"author-side portability machinery"가 될 위험을 스스로 검사해야 한다.

### 2.5 (Q5) Harness boundary 시험 — 후보 C의 네 항목

| 후보 C 항목 | 판정 | 근거 |
|---|---|---|
| **권위 상태**(무엇이 이미 결정됐는가) | 인식론적, **이미 마련됨** | `apportion:130`의 `PlanEnvelopeEntry`가 `accepted_residuals`/`reserved`/`oos`/`unbounded_approved`를 필드로 갖고, Rule 16(`apportion:583`)이 "the reservations and the waiver flag stay separate fields so the plan alone answers which of the two closed the acceptance question"이라 명시. `/conduct` 쪽은 `TraceContract`(`conduct:123`)가 대칭 역할 |
| **미결 의무**(무엇이 아직 열려 있는가) | 인식론적, **이미 마련됨** | `apportion`의 `ReservedJudgmentResolution`(누구 판단이 정할지 근거와 함께 기록, Rule 6 `apportion:573`), `conduct`의 `HandoffAnnotation{OwedReapportionment, SpanExternalization}`(`conduct:107`)이 동일 역할을 대칭적으로 수행 |
| **다음 행동** | **가장 방어 가능한 잔여 — 그러나 파생 가능성이 있어 확정적이지 않음** | `premise/session-and-handoff.md` §Resumption Cues: "name the intended next action explicitly and do not skip it — it is the piece task-resumption research most directly supports as load-bearing, and **the one most often left out**." 두 프로토콜의 TYPES 어디에도 "next_action"이라는 1급 필드가 명시적으로 존재하지 않는다(`GroundingInstruction`은 "어떻게 역참조하는가"를, `CheckpointBrief`는 "무엇을 물을 것인가"를 구울 뿐, "다음에 뭘 하려던 참이었는가"는 굽지 않는다). 다만 이것이 `move_assignment`/`checkpoints`의 순서에서 파생 가능한지는 열려 있다 |
| **복구 절차** | **분리됨: 인식론적 절반은 이미 동일하게 마련; 하네스 절반은 이 렌즈의 범위 밖** | 인식론적 절반("멈추고 이유를 말한다")은 §2.2의 Rule 12 / Phase 0가 양쪽에 동형으로 이미 제공. 하네스 절반(실제 재접속, 재시도, 소켓/자격 복구)은 `AGENTS.md:22` "execution channels, state mutation... no rule is authored here for them" — **이 지점에서 이 렌즈는 멈춘다** |

추가로, 하네스 경계와 별개로 이 프로젝트 자신의 `premise/session-and-handoff.md`가 이미 후보 C를
**내적으로 이질적인 네 항목의 묶음**으로 드러낸다: "권위 상태"와 "미결 의무"는 그 문서의 세 가지
재개 단서 중 **하나**("the state relevant to that goal")로 합쳐지고, "다음 행동"은 그 문서가 명시적
으로 **별개**라고 못박은 세 번째 단서("**separate from, and not subsumed by**, restating either the
goal or the state alone")이며, "복구 절차"는 그 문서의 재개-단서 목록에 아예 속하지 않고 별도 절
(§Protecting an In-Progress Task, §Recovering an Open Commitment)의 **과정 서술**이다. 즉 하네스
필터를 적용하기 전부터도, 후보 C는 이 프로젝트의 인식론 전제 자신의 어휘로 볼 때 이미 단일한 축이
아니다.

### 2.6 (Q6) horizon fit(SpanFit) 전략과 "마련" 전략 — 양립인가 경합인가

`/apportion`의 `SpanFit ∈ {Fits, Overflows, Indeterminate}`(`apportion:88` 인근 TYPES)는 각 단위가
**하나의** 실행 지평에 맞을 것을 요구한다(Rule 4, `apportion:571`). 이것은 "경계 안에서" 불연속이
일어나지 않게 하는 **예방 전략**이다.

이 규율의 소재지는 **단위 내부**다 — 단위와 단위 사이, 또는 계획-컴파일과 실행 사이의 경계는 이
규율이 다루는 자리가 아니다. 그리고 바로 그 다른 자리에서 `/apportion` 자신이 이미 candidate C가
요구하는 "마련" 전략을 수행한다: 계획을 하나의 캐리어 레코드에 파킹하고(`park_carrier`) 내비게이션
블록을 발행하는 것(`record_handoff`, `apportion:69`)이 정확히 "넘어감을 마련한다"는 행위다. 즉
`/apportion`은 **오늘 이미** 두 전략을 **서로 다른 소재지**(단위 내부 vs 단위 사이/계획-실행
사이)에서 나란히 들고 있다.

이는 M7의 판정("아니다 — 정반대다. horizon fit은 넘어감을 마련하는 게 아니라 불필요하게 만든다",
`M7 §후보 C 분리시험`)에 대한 **이 렌즈의 구체적 정정**이다: horizon fit은 넘어감을 **단위 내부에서**
불필요하게 만들 뿐이며, `/apportion`의 목적 자체가 "하나의 목표가 하나의 지평에 맞지 않을 때 여러
단위로 자른다"는 것이므로(정의: "Merismos apportions ... when the goal is stated but its plan is
uncompiled" — 애초에 다중 단위로 자르는 이유가 단일 지평 초과), **단위 사이**의 경계는 애초부터
전제돼 있고 그 경계는 내비게이션 블록으로 마련된다. 따라서 두 전략은 경합하지 않을 뿐 아니라, **이미
하나의 프로토콜이 두 전략을 동시에 들 수 있음을 실증하는 사례**가 현재 코드베이스에 존재한다. 이는
새 프로토콜이 "예방"과 "마련"을 화해시키기 위해 필요하다는 논거를 약화시킨다 — 화해는 이미 일어나 있다.

---

## 3. 지평 한계

**이 렌즈가 Harness boundary로 인해 말할 수 없는 것** (명시적 목록 — 이 자체가 이 렌즈의 산출물):

1. 피어 세션(Stint)이 실제로 **어떻게 살아 있는 프로세스로 유지되는가** — 스케줄링, 소켓, 프로세스
   수명. `premise/peer-sessions.md`류 규칙이 다루는 "라이브니스 체크", "레지스트리 파일" 같은 것은
   전부 실행 채널이며 `AGENTS.md:22`가 "no rule is authored here for them"이라 선언한 영역이다.
2. 역참조가 **실제로 성공하는지**의 인프라적 조건 — 레코드를 담는 저장소(파일/DB/세션 레지스트리)가
   실제로 접근 가능한가, 자격 증명이 유효한가. 이것은 상태 변이/권한 모델이며 하네스다.
3. `relay(handoff unreadable)` 발화 **이후에** 무엇을 하는가의 기계학 — 재시도, 재접속, 에스컬레이션
   구현. 인식론 층의 답은 "멈추고 이유를 말한다"에서 끝난다; 그 다음은 하네스다.
4. 새 실행자가 피어 세션이라는 사실이 만들어내는 **권한 등가성**(permission-class parity) 같은
   질문 — 이것은 명백히 실행 채널/권한 모델이다.
5. locator가 가리키는 레코드의 **동일성 증거**가 프로세스 재시작·기기 재부팅을 넘어 무엇으로
   성립하는가 — 이것은 저장소 구현 세부이며 하네스다.

**이 렌즈가 과소평가하거나 아예 보지 못하는 것** (하네스 경계와 무관한, 이 렌즈 자체의 사각지대):

- 이름/어휘의 정밀도(`WorkPlanUnderdetermined` 같은 통합 명이 무엇을 잃는가)는 이 렌즈의 축이
  아니다 — 계보 렌즈(M2)의 몫.
- 게이트 산술(9–10+k vs 5–6+j+k)이나 92% 단독 사용 같은 사용 패턴 데이터는 이 렌즈가 스스로 재는
  것이 아니라 M7이 인용한 실측을 참조로만 썼다 — 인지 부하 렌즈(M3)의 몫.
- 형식 타입의 상호 배제성/coproduct 완결성 시험은 이 렌즈가 판정할 도구를 갖지 않는다 — 형식 타입
  렌즈(M1)의 몫.
- "선례(euporia)의 해석학적 순환이 이번에도 같은 모양으로 완결되는가"라는 순환 구조 자체의 타당성은
  이 렌즈가 다루지 않는다 — 해석학 렌즈(M4)의 몫.
- 사용자가 실제로 Stint 경계를 넘는 시나리오를 얼마나 자주 만드는지(경험적 빈도)는 이 렌즈의 분석
  대상이 아니다.

---

## 4. 판정

**이 렌즈만으로는: 신설하지 말아야 한다.**

근거를 요약하면: (1) 포인터 기제(`NavigationBlock`/`HandoffLocator`/dereference-instruction/
grounding-instruction/실패시-정지)는 이미 실행자가 무엇이든(같은 세션의 미래 자아, 새 세션, 이제는
피어 Stint) 무관하게 작동하도록 **기질-중립으로 설계돼 있다**(`apportion:160` "substrate-neutral by
construction"). 원 질문의 동기인 "실행자가 피어 세션을 포함하게 됐다"는 사실은 이 축에서 새 사례를
추가할 뿐, 기존 타입이 감당 못 하는 새로운 요구를 만들지 않는다. (2) 두 프로토콜이 경계를 넘어
관리하는 근거는 **서로 다른 종류**(구운 명제의 staleness vs 아직 답 없는 질문의 askability)이며, 각각
자기 내용 종류에 맞는 서로 다른 전략(copy-in vs structure-only)으로 **이미 올바르게 분업**돼 있다 —
하나의 새 타입으로 재타이핑하면 이 분업을 파일 내부 경계로 되살려야 한다(§2.3, M7의 S2와 동형).
(3) span 벽은 이미 `/conduct`의 타입 안에 있고, 흡수되지 않은 잔여(far-side compile-back)는 **우연한
누락이 아니라 그 프로토콜 자신의 가드가 명시적으로 거절한 자리**다(§2.4) — 새 프로토콜이 그 자리를
메우면 그 가드가 이름 지은 반패턴을 스스로 범할 위험을 진다. (4) Harness boundary를 적용하고 나면
후보 C에 남는 것은 "다음 행동"이라는 하나의, 그나마 파생 가능성이 열려 있는 필드뿐이며, 이는 새
프로토콜이 아니라 기존 내비게이션-블록류 타입에 대한 **작은 필드 추가**로 해결되는 규모다(§2.5).
(5) "예방"(SpanFit)과 "마련"(navigation block) 전략은 경합하지 않으며, `/apportion` 하나가 이미 두
자리에서 둘 다 들고 있다는 사실이 화해가 이미 일어났음을 보여준다(§2.6).

이 판정은 **이 렌즈의 축에 한정된다.** 다른 렌즈(형식 타입의 상호 배제, 계보적 이름 압력, 인지
부하의 게이트 산술, 해석학적 순환의 완결성)가 이 축과 무관한 근거로 다른 결론에 이를 수 있으며, 이
심문의 종합은 그 렌즈들과 조율돼야 한다. 이 렌즈가 확실히 배제하는 것은 하나뿐이다: **"실행자가 이제
피어 세션을 포함한다"는 기질 변화 자체는, 근거 접근 연속성이라는 축에서, 새 프로토콜을 정당화하는
근거가 되지 못한다** — 그 변화를 흡수하도록 이미 설계된 기제가 코드베이스에 존재하고, 그 기제가
정확히 커버하지 않는 유일한 자리는 이 프로젝트가 스스로 하네스라고 선언한 자리이기 때문이다.
