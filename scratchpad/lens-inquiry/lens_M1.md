# M1 — 형식 타입 이론 렌즈: `/apportion` + `/conduct` 재타이핑 검증

**성격**: M7이 구성한 결손 후보 A·B·C를 형식 타입 이론의 세 시험(dispatch-structure test, volatility criterion,
openness criterion)과 상호폐쇄(semantic closure) 시험으로 독립 재검증. M7의 결론을 물려받지 않고 타입 수준에서
재확인/반박한다.

---

## 1. 고유 기여

이 렌즈만이 할 수 있는 것: 제안된 병합이 "복잡해 보인다"는 인상이 아니라 **정확히 어느 타입 술어가 어느 불변식과
충돌하는지**를 줄 단위로 짚을 수 있다 — `topology_free`(`merismos/skills/apportion/SKILL.md:120`)와
`hard_invariants_hold`(`:136`)가 왜 상호배타적으로 병합을 막는지, `Gen(routing)`(`hyphegesis/skills/conduct/SKILL.md:72`)
이 왜 이미 동기가 요구하는 것을 흡수했는지를 산문이 아니라 타입 위반으로 보인다. 또한 선례(`/elicit`)의 성공 기제를
분해해, 그 기제가 왜 이 사례로 전이되지 않는지 — 결손의 **이름**이 아니라 결손의 **값 공간(carrier)**이 통약 불가능
하다는 것 — 를 타입 수준에서 증명한다.

---

## 2. 프레임워크 분석

### 2.1 세 시험 적용 (하위질문 1)

**dispatch-structure test** (`.claude/rules/type-category-convention.md:26`: "If PHASE TRANSITIONS handle each
case differently, use coproduct. If the protocol processes uniformly regardless of input category, use natural
language definition.")

| 후보 | 적용 | 판정 |
|---|---|---|
| A `HandoffUncompiled` | 단일 처리 경로("인계 가능한 형태로 컴파일")뿐 — 분기 없음 | **자연어 입력 타입으로 정합** (우형). 그러나 이는 A가 *옳다*는 뜻이 아니라, A가 다루는 범위 안에서는 우형이라는 뜻일 뿐 — M7의 좁음 판정(대체 실패)과 별개 축 |
| B `PreRunUnderdetermined` | "무엇으로 잘리는지"와 "조각이 어떻게 관계하는지"를 하나의 생성자 쌍으로 표현하면 각 생성자는 `/apportion`의 Pack/fit/qualify 루프(`apportion:23,27-33`)와 `/conduct`의 DraftTopology 루프(`conduct:24-31`)라는 **서로 판이한 처리 경로**로 간다 | **coproduct 자격은 형식적으로 통과** — 그러나 이 통과 자체가 반증이다: 진짜 재타이핑이라면 옛 구분에 대해 이 시험이 실패해야(균일 처리로 붕괴해야) 하는데(§2.4의 `/elicit` 대조 참조), B는 옛 구분을 그대로 두 생성자로 보존한다. 즉 **"하나의 파일에 든 두 프로토콜"**이지 재타이핑이 아니다 |
| C `ContinuityUnprovisioned` | "에포크 경계에서 살아남을 것을 마련한다"는 단일 균일 조작 — 발원이 apportion 유형이든 conduct 유형이든 처리가 갈라지지 않음 | **자연어 입력 타입으로 정합** (우형), M7의 구성 가능 판정과 부합 |

**volatility criterion** (`.claude/rules/type-category-convention.md:28`: TYPES는 경직 층, 결정적 논리만)

- A: "인계 가능성"은 이미 `/conduct`의 `PI ∈ LivePlan ⊎ Navigation ⊎ NoPlan`(`conduct:135`)과 `NavigationBlock`/
  `GroundingInstruction`(`conduct:131-134`)이 담는 **기존 경직 층에 거주 가능한 판단**이다 — 새 카테고리가 아니라
  기존 카테고리를 채우는 사례(instance)일 뿐이므로, 애초에 TYPES 질문이 아니다.
- B: "상호의존"이라는 성질 자체는 체크 가능하지만, 그것이 무엇을 무너뜨리는지가 문제다 — 아래 §2.3에서 다룬다.
- C: "무엇이 살아남아야 하는가"(권위 상태·미결 의무·다음 행동·복구 절차)는 `/conduct`의 기존 경직 층
  (`HandoffAnnotation`, `NavigationBlock`)과 형태가 같은 종류의 판단이라, 새 프로토콜의 TYPES를 처음부터 짓기보다
  **기존 TYPES 항목의 확장**으로 거주할 개연성이 높다(§2.6에서 재론).

**openness criterion** (`.claude/rules/type-category-convention.md:30`: 경계가 run-independent 의무에 근거하는가,
제거해도 그 의무가 살아남는가)

- A: `/conduct`의 `PI`/`N` 타입이 이미 "구조는 고정, 점유값은 런타임 바인딩"이라는 건전한 닫힌 답 타입 패턴을
  만족한다(`conduct:130`: IncomingPlan은 "Recognition material"로만 읽힘). A가 새 프로토콜을 요구한다면 이미
  건전한 폐쇄를 재저작하는 것 — **과대 특정(over-specification)**이다.
- B: **결정적으로 실패**. `topology_free(req) ≡ req contains no UnitRef, Move, MoveRegion, or order-position
  reference`(`apportion:120`)의 근거는 `/apportion`의 morphism 자체가 명시하는 run-independent 의무다 — 코돔
  `ConditionBearingUnitPlan`은 "pre-conduct"이며(`apportion:8,12`), 불변식 "Apportion over Order"
  (`apportion:75,376`)가 이를 선언한다. 이 술어를 제거해도 — 즉 B의 제안 자체가 없었어도 — "아직 결정되지 않은
  미래 토폴로지에 걸쳐 단위 계획이 이식 가능해야 한다"는 의무는 그대로 남는다(제거 생존 시험 통과 → 근거 있는
  폐쇄). B는 이 폐쇄를 열어야 성립하는데, 그 폐쇄가 지키는 의무는 B의 존재와 무관하게 서 있다 — B는 **자신이
  반증해야 할 술어를 반증하지 못한 채 전제로 삼는 순환**이다(M7의 관측과 독립적으로 도달한 동일 결론).
- C: 권위 상태·미결 의무 등의 "occupant"는 런타임 바인딩으로 열어 두고, carrier 형태(`ContinuityRecord` 류)만
  닫는 패턴이 가능 — `/conduct`의 `NavigationBlock`이 이미 이 패턴이다. **건전한 닫힌 캐리어**로 정합 가능.

### 2.2 상호폐쇄 시험 — 후보 B의 여덟 블록 스케치 (하위질문 2)

B를 고른 이유: 사용자 발화("작업 분할·실행자 할당·흐름 지휘를 한 번에 구성")가 실제로 요구하는 형태이자, M7이
"위장한 합집합"으로 지목한 후보라 상호폐쇄 실패 지점을 정밀하게 보일 수 있다.

- **FLOW**: cut(단위 분할)과 topology(순서/독립/화해/종료/라우팅)를 공동 해로 찾는 **공재귀 루프**가 필요하다 —
  `apportion`의 Pack/fit/qualify(`apportion:23`)와 `conduct`의 DraftTopology(`conduct:24`)를 번갈아 호출하며
  서로의 산출물이 안정될 때까지 반복. **이런 FLOW 템플릿은 두 소스 어디에도 없다** — apportion의 루프는
  `residual`의 단조 감소로 유계(`apportion:216`, `LOOP` 블록), conduct의 루프는 5개 축의 유한 Gen 집합으로 유계
  (`conduct:207`). 공재귀 고정점의 유계성 논증은 어느 쪽에서도 상속되지 않는 **새로 발명해야 할 정지 논증**이다.
- **LOOP**: 토폴로지가 재컷을 강제할 때(cut이 바뀌면) 이미 파생된 단위 조건(`K`/`R`/`S`, apportion:114,104,107)을
  어떻게 하는가? apportion의 Rule 25(`Back-edge state preservation`, `:590`)는 **apportion 자신의 Phase 2 →
  Phase 1 Reopen**만 다룬다 — 외부(토폴로지 쪽)에서 강제된 재컷은 다루지 않는다. conduct의
  `InvalidateTopologyProducts`(`:276`)는 **자기 자신의 조건 배치 역전**만 다룬다 — apportion 쪽 `K`/`R`/`S`를
  무효화하는 절차는 없다. → **정확히 여기서 미정의**: "토폴로지发 재컷이 이미 파생된 완료 조건을 무효화할 때"에
  대한 타입도, 가드도, 상태갱신도, 종료경로도, 결과등식도 없다.
- **TYPES**: `Unit`(`apportion:94`, `obligations: Set(Obligation)` 보유)과 `Move`(`conduct:59`,
  `{step, unit_ref: Option(UnitRef)}` — 단지 참조일 뿐)를 하나로 잡으려면 새 결합 타입(`UnitMove`류)이 필요하다.
  이 타입은 어느 쪽 SKILL.md도 선언하지 않고, openness criterion의 "제거해도 살아남는 의무"가 없다 — 이 제안이
  없으면 존재할 이유가 없는 타입이다(근거 없는 신설 = openness criterion 실패, `.claude/rules/type-category-
  convention.md:30`의 "그 의무가 이 제안이 제거된 뒤에도 살아남아야 한다"는 요구 위반).
- **MORPHISM**: 아래 §2.5에서 별도로 다룸 — initiator·domain·codomain 모두 합성 실패.
- **PHASE TRANSITIONS**: 공재귀 단계마다 가드·상태갱신·종료경로가 필요한데, FLOW/LOOP가 이미 미정의이므로 이
  블록도 완성될 수 없다.
- **CONVERGENCE**: apportion의 `apportioned(G)`는 `coverage_complete(U, O_G) ∧ span_fit(U)`를 **U가 고정된
  시점**에서 요구한다(`apportion:270`). conduct의 `conducted(WP)`는 `topology_drafted_whole`을 **CT가 고정된
  시점**에서 요구한다(`conduct:222`). B가 자기 정의대로 cut과 topology가 "독립하게 정할 수 없다"면, 조건 도출
  시점의 `U`가 이후 재컷으로 다시 바뀔 수 있다는 뜻이고, 그러면 두 술어를 단순 논리곱(AND)으로 합치는 것은
  **불건전**하다 — `U`가 안정된 **공동 고정점**(mutual fixed point)이 존재함을 요구하는 새 종결술어가 필요한데,
  "안정"의 정의 자체가 §LOOP에서 미정의로 남은 것과 같은 구멍이다.
- **TOOL GROUNDING**: cut↔topology 일관성 검사 단계에 대한 `(sense)`/`(constitution)` 분류가 없다 — Rule 17/12의
  option-set relay test(양쪽 모두 존재, `apportion:584`, `conduct:471`)를 이 새 검사에 어떻게 적용할지 전례가
  없다.
- **MODE STATE**: apportion의 Λ(16개 이상 필드, `apportion:336-348`)와 conduct의 Λ(18개 이상 필드,
  `conduct:295`)를 합집합으로 두는 것 자체는 기계적이지만, **연결 필드**(어느 토폴로지 변경이 어느 apportion측
  상태를 리셋하는지)의 쓰기/읽기 규율이 필요하다. 그런데 이 규율이 바로 B의 자기서술("상호의존적이라 독립하게
  정할 수 없다")이 저작 시점에 결정 불가능하다고 선언하는 바로 그것이다 — volatility criterion
  (`.claude/rules/type-category-convention.md:28`: "TYPES는 결정적 논리만 담는다")을 정면으로 위반한다.

**결론**: 상호폐쇄는 **FLOW·LOOP·TYPES·CONVERGENCE·MODE STATE 다섯 블록 모두**에서 미완성 지점을 남긴다. 이는
"세부 설계가 아직 안 됐다"는 정도가 아니라, B의 정의 자체("상호의존, 독립 결정 불가")가 요구하는 정지·상태전이
규율을 volatility criterion이 금지하는 종류의 규율이라는 **구조적** 불합.

### 2.3 `topology_free`의 운명 (하위질문 3)

- **(i) 유지**: 병합된 프로토콜이 여전히 `topology_free`를 계획-조건에 강제하면, `MoveRegion`(`conduct:65`)이나
  `UnitRef`(`apportion:118`)를 계획-조건이 참조할 수 없다는 뜻 — 즉 병합된 파일 **내부에서도** 조건-도출 쪽과
  토폴로지 쪽이 서로 스며들 수 없다. 이는 B의 존재 근거("상호의존이라 하나로 묶어야 한다")와 **정면 모순**이다:
  묶을 필요가 있다고 주장하면서 묶은 뒤에도 서로 접근을 막는 벽을 유지한다면,애초에 왜 묶었는지 답이 없다.
- **(ii) 폐기**: `PlanCondition.dischargeable_when`이 토폴로지를 참조할 수 있게 되면, apportion의 핵심 불변식
  "Apportion over Order"(`apportion:75,376`)와 Rule 2("Apportion, do not order", `:569`)가 무너진다. 더 구체적
  으로 `plan_terminal(|U|)`(`apportion:148`)의 건전성은 **U가 조건 바인딩 시점에 고정**되어 있다는 전제 위에
  서 있다 — `BindPlanRequirements`가 매 `check` 직전에 재정규화하는 이유가 바로 이 전제를 지키기 위해서다
  (`apportion:191,323`). 이 전제를 깨면서 그 자리를 메울 장치 없이 폐기하면, apportion이 Rule 25로 막아온
  "재구성 드리프트"가 조용히 재도입된다.
- **(iii) 약화**: 토폴로지 협상 전/후로 두 단계 계획-조건(`PreTopologyCondition` / `PostTopologyCondition`)을
  따로 두면 건전성은 지킬 수 있지만, 이것은 **타입 수준에서 apportion-then-conduct의 2단계 구조를 그대로
  재현**한 것 — 경계가 파일 경계에서 타입 경계로 옮겨갈 뿐이다(M7 S2의 "내부 위상 장벽" 관측을 타입 층위에서
  독립 확인).

**타입 술어로 집행된다는 사실이 하는 일**: `topology_free`가 산문이 아니라 `hard_invariants_hold`
(`apportion:136`)를 통해 Confirm 게이트를 막는 **경직 검사**이기 때문에(`apportion:47,196`: `¬hard_invariants_
hold(Λ)` → 재제시), 이 술어의 운명은 문구 조정 문제가 아니라 openness criterion이 이미 답한 "제거해도 의무가
살아남는가"의 문제다(§2.1 참조 — 살아남는다). 그러므로 (ii)는 실질적 능력 손실(미래 토폴로지에 대한 계획 이식성)
없이는 취할 수 없고, 그 손실을 막으려면 (iii)로 후퇴하게 되어 있다.

### 2.4 선례(`/elicit`)의 타입 구조 대조 (하위질문 4)

`euporia/skills/elicit/SKILL.md`의 TYPES를 직접 읽은 결과:

- `D[] = List(DimensionProjection)` — **"cycle-emergent; no fixed taxonomy"**(`:50`). `DimensionProjection =
  { axis_inferred: String, coordinates: List(Coordinate), confidence: Float }`(`:51`) — `axis_inferred`는
  **문자열**이지 `{Intent, Goal}` 같은 닫힌 열거형이 아니다.
- `Axis = String — emergent label; examples: "intent", "goal", "form", "scope", "framework"`(`:70`) — 옛
  두 결손이 열거되는 게 아니라 **임의 개수의 사례**로 예시될 뿐이다.
- MORPHISM은 `detect→access→observe→reverse_trace→filter_confidence→resurface→surface→integrate→resolve`
  (`:27-37`)라는 **단일**, 무분기 사슬이다 — "intent축이면 X, goal축이면 Y" 같은 분기가 어디에도 없다. 옛 두
  사례에 대해 dispatch-structure test가 **실패**(균일 처리로 붕괴)한다는 뜻이고, 이는 B가 §2.1에서 시험을
  형식적으로 통과(=분기가 살아남음)한 것과 **정반대** 결과다.
- 결손 `AbstractAporia`의 게이트 술어: `aporia(I) ≡ ∃ requirement(r,I): axis_undetermined(r) ∧
  substrate_implicit(r)` — `r`은 자유 변수로, 옛 `IntentAmbiguous`와 `GoalUndefined`는 이 술어의 **두 사례**일
  뿐 별도로 이름 붙지 않는다. 이것은 **닫힌 2항 coproduct(합집합)가 아니라 하나의 열린 파라미터화 술어**다.
- 코돔 `ResolvedEndpoint { intent_resolved: I', residual }`(`:63`) 역시 `IntentResolved ⊎ GoalDefined`가 아니라
  단일 균일 레코드.

**재현 가능성 판정**: `/elicit`이 성립한 이유는 `Coordinate = { name, default, question, basis }`
(`elicit:52`)라는 **범용 캐리어**가 "의도가 뭔가"든 "목표가 뭔가"든 같은 레코드 형태로 담아낼 수 있었기 때문이다
— 즉 값 공간(carrier)이 통약 가능했다. `apportion`의 답 타입(`SpanFit ∈ {Fits, Overflows, Indeterminate}`,
`apportion:95`, 의무-파생 기반 단위 판단)과 `conduct`의 답 타입(`Gen(order) ∈ {sequential_chain, parallel_fan,
dependency_dag}`, `conduct:68`, 이미 식별된 이동들의 그래프-모양 판단)은 **같은 레코드로 담을 수 없다** — 하나는
의무 커버리지/지평-적합 판단이고 다른 하나는 그래프 위상 판단이다. `Coordinate`에 대응할 범용 캐리어가 존재하지
않으므로, **`/elicit`의 재타이핑 패턴은 `GoalPlanUncompiled` + `MethodUnderdetermined`에는 타입 수준에서
재현되지 않는다.** (M7의 후보 B 반박을 더 날카로운 근거로 독립 확인)

### 2.5 두 형태소의 합성 가능성 (하위질문 5)

- **(i) initiator**: apportion은 `User`(`apportion:71` `requires: user_initiated(G)`; Mode Activation
  "Layer 2: Not applicable — user-initiated, no AI-guided activation heuristics. The deficit exists only once
  an autonomous execution intention is in scope", `apportion:419-420`). conduct는 `Hybrid`(Mode Activation
  "Layer 2 (AI-guided)... requires user confirmation at the Phase 0 guard gate (Hybrid initiator)",
  `conduct:338`). **어느 쪽으로 합쳐도 정보 손실**: `Hybrid`로 합치면 apportion이 지금 명시적으로 배제한
  "AI가 자율 실행 의도를 감지해 제안하는" 경로가 새로 열린다 — Rule 1("User-initiated, AI-apportioned",
  `apportion:568`)이 자율 실행을 명시적 사용자 선언에 묶은 근거(고위험 실행은 감지가 아니라 선언을 요구)가
  아무 논증 없이 사라진다. `User`로 합치면 conduct의 Layer 2(AI-guided 활성화)가 깨진다.
- **(ii) 곱 도메인**: `AutonomousGoal × ExecutionHorizon`(`apportion:81,88` — 의무 집합을 가진 목표 × "하나의
  자율 실행이 들어갈 예산")과 `WorkProspect × MoveGround`(`conduct:57-58` — 아직 미결정 방법의 작업 ×
  "세션이 제공하는 후보 이동의 인벤토리")를 하나로 잡으려면, `ExecutionHorizon`(맥락에서 읽는 예산 신호)과
  `MoveGround`(세션 맥락 + 각 프로토콜의 결손/해결 선언 + 분석/위임 인벤토리)가 서로의 특수 사례이거나 파생
  관계여야 하는데, 어느 SKILL.md도 그런 관계를 선언하지 않는다. 결과는 **4항 연접(concatenation)**
  `AutonomousGoal × ExecutionHorizon × WorkProspect × MoveGround`이지 재타이핑이 아니다 — 정보는 보존되지만
  (§2.4의 요구인) "재타이핑"이 아니라 그냥 필드 나열이다.
- **(iii) 코돔**: `ConditionBearingUnitPlan`(`apportion:155` — topology-free임을 스스로 불변식으로 가짐)과
  `ConductedMethod`(`conduct:126` — 존재 이유 자체가 topology/order/routing을 담는 것)을 동시에 담는 코돔은
  **오늘 이미 `/apportion → /conduct` 합성 엣지**(`apportion:361-364` Rule 9, `conduct:477` Rule 20)를 통해
  두 프로토콜을 순차 실행하면 정확히 얻어지는 값이다. 즉 "병합 코돔"은 새 타입이 아니라 **기존 두 타입의
  데카르트 곱**이며, 이는 지금 이미 두 번 호출로 도달 가능하다.

**정보 손실 판정**: (i)는 정보 손실(둘 중 하나의 활성화 규율이 깨짐), (ii)·(iii)은 정보 손실은 없지만 **재타이핑
이 전혀 아니다** — 단순 연접과 기존 합성의 재포장이다. 세 항목 모두 §2.2·§2.3의 결론(두 프로토콜의 기계가
융합되지 않고 병렬 나열되거나 중복된다)을 서로 다른 각도에서 재확인한다.

### 2.6 `handoff_to_span`/`span`의 함의 (하위질문 6)

`MethodBrief.span = invocation → the next planned /compact or /clear`(`conduct:63`)와 `Gen(routing)`의
`handoff_to_span`(`conduct:72`: "the move/region output crosses the span wall to a future span that does not
share this session's context")은 **이미 완전히 폐쇄된 타입**이다 — `HandoffAnnotation.SpanExternalization`
(`conduct:107-108`)이라는 전용 캐리어, `Phase 3 AnnotateHandoff`(TOOL GROUNDING, `:279`)라는 생산자, 그리고
CONVERGENCE의 자체 결합절(`conduct:243-244`: `∀r ∈ dom(CT[routing]): (... = handoff_to_span ∨ ... crosses_span)
→ span_externalization(r, CT, substrate_handoff) ∈ substrate_handoff.annotations`)까지 FLOW→TYPES→PHASE
TRANSITIONS→CONVERGENCE→TOOL GROUNDING→MODE STATE 여섯 블록 모두를 관통해 배선되어 있다.

**동기에 대한 함의**: 동기의 사실 전제(실행자 집합이 이제 세션 수명을 넘는 피어 세션/Stint를 포함한다)는 참이지만,
그 추론(⇒ 새 프로토콜의 재타이핑이 필요하다)은 타입 수준에서 따라오지 않는다 — 이 기질 변화는 **이미 한 번**
`/conduct`의 `routing` 축에서 `Gen(routing)`이 `handoff_to_span`을 새 구성원으로 얻는 방식으로 흡수되었다. 이는
정확히 type-category-convention의 "닫힌 coproduct 안의 빈틈은 값 타입을 넓혀 고친다"는 결과
(`.claude/rules/type-category-convention.md:37`)의 실례다 — 새 프로토콜이 아니라 **기존 열거형의 확장**으로
처리된 선례가 이미 있다.

**후보 C를 여섯 번째 축 vs 별도 프로토콜로 세우는 것, 타입 관점 비교**:

- `handoff_to_span`이 담는 것은 **경로 결정**(출력이 어디로 가는지, 목적지가 기질 소유 레코드가 될 것이라는
  것)뿐이다. conduct 자신의 morphism은 명시적으로 "design THEN hand off... 실행은 기질이 한다"(`:8`)이고
  "Design-time only"(Rule 3, `:462`: "Hyphegesis... has no runtime monitoring surface")다 — `Λ`(MODE STATE,
  `:295`)의 모든 필드는 **설계 구간에만** 존재하고, 코돔 `ConductedMethod`의 필드(`topology, move_assignment,
  checkpoints, substrate_handoff, trace_contract, condition_placements, plan_pointer`) 어디에도 **실행 중
  진화하는** 권위 상태 필드가 없다.
- C가 요구하는 것 중 "경계를 건널 때 스냅샷으로 찍어야 할 것"(정적 부분)은 `SpanExternalization`의 페이로드를
  넓히는 것으로 충분하다 — 새 축도 새 프로토콜도 필요 없다. 다섯 축(order/independence/reconciliation/
  termination/routing, `conduct:66`)은 모두 "한 세션 내에서 이동들이 서로 어떻게 관계하는가"를 기술하는데,
  연속성 마련은 이동들 사이의 관계가 아니라 **경계를 건너는 행위 자체의 속성**이라 `routing`이 정확한 자리다
  — 여섯 번째 축을 신설하면 그 축이 물어야 할 `Gen(continuity)` 열거형이 다른 다섯 축과 달리 "이 MoveRegion이
  내부적으로 어떻게 처리되는가"가 아니라 "이 경계에서 무엇이 실려 나가는가"를 묻게 되어, 다섯 축의 균일한 의미론
  (각 축이 한 MoveRegion의 내부 처리를 결정)을 깨뜨린다.
- C가 요구하는 것 중 "경계에 도달하기 전 진행 중에 갱신되어야 할 것"(동적 부분, M7의 S4가 지목한 "하나의
  진화하는 약속/권위 상태 궤적")이 실재한다면, 이는 conduct의 Rule 3(Design-time only) 자체를 위반하지 않고는
  `Gen(routing)` 확장으로도, 여섯 번째 축으로도 담을 수 없다 — **compile-then-handoff가 아니라 monitor라는
  다른 morphism 모양**이 필요하다. 그런 프로토콜이 정당하다면 그것은 apportion·conduct **어느 쪽도 대체하지
  않는 제3의, 직교하는 프로토콜**이지, 원 질문("두 프로토콜을 대체할 새 프로토콜")의 답이 될 수 없다.

---

## 3. 지평 한계

이 렌즈가 보지 못하거나 과소평가하는 것:

- **동기의 경험적 타당성**: 피어 세션(Stint)이 실제로 얼마나 자주 실행자 집합에 들어오는지, 그것이 조직에
  중요한 변화인지는 이 렌즈가 판단할 수 없다 — 형식 타입 이론은 "이미 제시된 술어가 무엇을 타입-요구하는가"만
  다루지, 그 술어를 낳은 조직적/경험적 주장의 무게는 다루지 못한다. (이런 종류의 증거는 세션 로그 통계나 사용
  빈도 측정에서 나오며, 그런 증거는 이 렌즈의 어휘 밖에 있다.)
- **사용자 인터랙션 부담**: 프로토콜 두 개를 따로 호출하는 것과 하나로 합쳐 호출하는 것 사이의 인지 부하
  차이는 순수히 상호작용-분해(interaction-factorization) 렌즈의 영역이다 — 형식 타입 이론은 "타입이 합성
  가능한가"만 답하지 "합성 불가능한 타입을 억지로 하나의 인터페이스 뒤에 감췄을 때 사용자가 느끼는 단순함"은
  측정하지 못한다.
- **측정 증거의 신뢰성**: M7이 인용한 "92% 단독 사용" 실측은 세션 로그 분석의 산물이지 타입 논증이 아니다 —
  이 렌즈는 그 수치가 옳은지 재검증할 능력이 없고, 그저 그 수치가 참이라고 가정한 채 타입 함의만 짚는다.
- **"우아한 통일"이 항상 옳은 공학적 선택인가**: 이 렌즈는 상호폐쇄 실패를 무조건 나쁜 신호로 읽지만, 약간의
  중복(예: `Gen(routing)`의 페이로드가 다소 커지는 것)이 사용자 경험상 더 나은 절충일 수 있는 경우를 판정할
  어휘가 없다 — "레코드 필드가 너무 많아 사람이 읽기 어렵다"는 가독성 문제는 타입 이론의 질문이 아니다.
- **역사적 근거의 한계**: 선례(`/elicit`)가 clarify+telos를 정말 그렇게 병합했는지는 원장(ledger) 관례상
  `euporia/skills/elicit/SKILL.md`에 남아 있지 않다(예상대로 — Ledger Separate 원칙, `AGENTS.md`). 이 렌즈는
  현재 SKILL.md의 타입 구조만으로 대조했을 뿐, 그 병합이 실제로 어떤 논의를 거쳐 이 형태에 도달했는지의 서사는
  검증하지 못했다.

---

## 4. 판정

**이 렌즈에서: 신설하지 말아야 한다.**

근거를 요약하면:

1. **구성된 세 후보 중 무엇도 대체용 재타이핑을 낳지 못한다.** A는 dispatch-structure test는 통과하지만 범위가
   좁아 대체 실패(M7과 독립 확인), B는 상호폐쇄가 FLOW·LOOP·TYPES·CONVERGENCE·MODE STATE 다섯 블록에서 미완성
   지점을 남기며(§2.2), C는 우형이지만 추가지 대체가 아니다(M7과 독립 확인, §2.6에서 더 정밀화).
2. **B — 사용자가 실제로 제안한 형태에 가장 가까운 후보 — 는 `topology_free`를 두고 자기모순에 빠진다**(§2.3):
   유지하면 병합 근거(상호의존)와 모순되고, 폐기하면 apportion의 핵심 불변식이 무너지며, 약화하면 apportion→
   conduct의 2단계 구조를 타입 층위에서 재현할 뿐이다.
3. **선례(`/elicit`)의 성공 기제는 전이되지 않는다.** 그 성공은 `Coordinate`라는 통약 가능한 범용 캐리어 덕분
   이었는데(§2.4), apportion의 답 타입(의무/적합/이음매 판단)과 conduct의 답 타입(그래프 위상 판단)은 그런
   공통 캐리어가 없다 — 이름의 병합이 아니라 값 공간의 병합이 실패한다.
4. **형태소 합성은 세 항목 모두에서 실패한다**(§2.5): initiator는 정보 손실 없이 합칠 수 없고, 도메인은 재타이핑
   이 아니라 연접이며, 코돔은 이미 존재하는 `/apportion → /conduct` 합성으로 오늘도 도달 가능한 값이다.
5. **동기가 지목한 유일한 구체적 기질 변화(Stint/span 경계)는 이미 `/conduct`의 `routing` 축에
   `handoff_to_span`으로 타입 흡수되어 있다**(§2.6) — 남는 잔여(경계를 건너는 동안의 실행-중 상태 추적)가
   실재한다면, 그것은 compile-then-handoff가 아니라 monitor 모양의 **제3의 직교 프로토콜**이 필요하다는
   뜻이지, 두 프로토콜을 대체할 근거가 아니다.

이 다섯 근거는 서로 다른 각도(coproduct 자격, 상호폐쇄, 선례 대조, 형태소 합성, 기질-흡수 상태)에서 같은
결론으로 수렴한다 — 이는 우연이 아니라, 애초에 `/apportion`과 `/conduct`의 값 공간이 구조적으로 통약 불가능
하다는 하나의 사실이 다섯 시험 모두에서 다른 얼굴로 나타난 것이다.
