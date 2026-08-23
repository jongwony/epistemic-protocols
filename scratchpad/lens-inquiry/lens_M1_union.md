# M1 재브리핑 — 표면 통합 기준에서 형식 타입 재분류

**기준 변경**: 원 제안은 재타이핑(새 결손 타입 하나, 옛 둘 은퇴)이 아니라 **표면 통합**이다 — `/apportion`과
`/conduct`의 명령 표면을 하나로 합치되, 두 타입 시그니처(`(GoalPlanUncompiled, User, APPORTION, ...) →
ConditionBearingUnitPlan`, `(MethodUnderdetermined, Hybrid, CONDUCT, ...) → ConductedMethod`)는 그대로
살아 있고, 하나의 표면이 그 둘로 dispatch 한다. "하나의 파일에 든 두 프로토콜"은 이제 실격 사유가 아니라 목표다.

1차 결론(`lens_M1.md`)을 방어하지 않고, 새 기준에서 각 논거를 (a) 유효 / (b) 불도달 / (c) 신규로 재분류한다.

---

## (a) 유효 — 새 기준에서도 그대로 서는 논거

**A1. `topology_free`는 구조로 유지되어야 하며, 그 근거는 그대로다.** `topology_free(req) ≡ req contains no
UnitRef, Move, MoveRegion, or order-position reference`(`apportion:120`)가 지키는 의무 — 코돔
`ConditionBearingUnitPlan`이 "pre-conduct"라는 morphism 선언(`apportion:8,12,75,376`) — 은 표면 통합 여부와
무관하게 그대로 서 있다. 1차 분석(§2.3(i))에서 "유지하면 B의 상호의존 전제와 모순"이라 했던 판정의 **모순
부분만 사라졌고**(B의 상호의존 전제 자체가 이제 없으므로), 유지해야 한다는 결론은 오히려 더 단단해졌다 — 아래
(c)에서 그 이유를 정밀화한다.

**A2. 병합 코돔은 오늘 이미 존재하는 합성 엣지로 도달 가능하다는 관측은 이제 비판이 아니라 설계 목표의 정확한
서술이 되었다.** 1차 §2.5(iii)에서 "`ConditionBearingUnitPlan × ConductedMethod`는 이미 `/apportion →
/conduct` 합성 엣지(`apportion:361-364` Rule 9, `conduct:477` Rule 20)로 도달 가능하다"고 한 것은, 재타이핑
기준에서는 "그러니 새 프로토콜이 무의미하다"는 실격 사유였다. 표면 통합 기준에서는 이것이 **정확히 무엇을 지어야
하는가에 대한 답**이 된다: 새 여덟 블록 프로토콜이 아니라, 이미 선언된 그 합성 엣지를 자동으로 타는 디스패치
계층. (c)에서 이를 "Reading 1"로 정식화한다.

**A3. `handoff_to_span`/`span` 관련 발견은 그대로 유효하며, 이번 재브리핑과 직교한다.** 동기가 지목한 구체적
기질 변화(Stint/span 경계)는 `/conduct`의 `routing` 축에 `handoff_to_span`으로 이미 완전히 타입 흡수되어 있다
(`conduct:63,72,107-108,243-244,279`, FLOW→CONVERGENCE 여섯 블록 관통). 이는 apportion+conduct를 **어떻게**
합치는가(재타이핑이냐 표면통합이냐)와 무관한, 별도 축의 발견이라 재브리핑의 영향을 받지 않는다.

---

## (b) 불도달 — 재타이핑 기준에만 걸려 있어 이제 닿지 않는 논거

**B1. §2.2 전체(후보 B 여덟 블록 상호폐쇄 스케치)가 통째로 불도달이다.** 그 스케치가 요구했던 FLOW의 cut↔topology
공재귀 루프, LOOP의 "위상발 재컷이 apportion측 K/R/S를 무효화하는 절차 미정의", CONVERGENCE의 공동고정점
종결술어, MODE STATE의 volatility 위반 — 이 전부는 B의 자기서술("무엇으로 잘리는지와 조각의 관계가 **둘 다 열려
있고 독립하게 정할 수 없다**")에서만 발생했다. 새 제안은 이 상호의존을 전혀 주장하지 않는다 — 두 타입 시그니처가
그대로 살아 있다는 것 자체가 apportion의 `U`가 conduct의 `CT`와 무관하게 먼저 완결된다는 뜻이다.

  **팀장의 구체적 후속 질문에 대한 직답**("위상발 재컷이 이미 파생된 apportion 측 조건을 무효화하는 절차가
  미정의로 남는가"): **이미 오늘, 재브리핑과 무관하게, 답이 나 있다.** conduct의 `InvalidateTopologyProducts`
  back-edge는 "여러 건전한 배치 후보가 서로 다른 미래를 가질 때"(`conduct:44,138`) 발동하지만, 이것이 지우는
  것은 **conduct 자신의** 산출물(`residuals, topology-derived degradations, move_assignment, checkpoints,
  condition_placements`, `conduct:209,276`)뿐이다. apportion측 `K/R/S/U`는 건드리지 않는다 — Rule 20이 이를
  명시적으로 선언한다: "Placing a condition is not revalidating it — what `/apportion` compiled it against is
  not re-checked here"(`conduct:477`). 즉 기존 이음매는 애초에 "재컷이 apportion측을 무효화하는" 경로를 만들지
  않는다 — apportion의 계획은 conduct가 배치를 재고할 때 이미 **불변의 완결물**로 다뤄지기 때문이다. 이 절차
  미정의는 B의(이제 철회된) 상호의존 전제가 만들어낸 유령 문제였다.

**B2. §2.4 전체(선례 `/elicit` 타입 구조 대조)가 통째로 불도달이다.** 그 절은 "옛 두 결손을 하나의 열린
파라미터화 술어로 재타이핑한 `/elicit`의 패턴이 여기 재현되는가"를 물었다. 새 제안은 재타이핑을 주장하지
않으므로, 재현 여부를 묻는 이 질문 자체가 적용 대상을 잃는다. (`Coordinate`의 통약가능성 논증은 정확했지만,
지금은 답할 필요가 없는 질문에 대한 정확한 답이다.)

**B3. §2.5(i)의 initiator "충돌"은 충돌이 아니라 애초에 성립하지 않는 문제였다.** 1차 분석은 "합치면 `User`와
`Hybrid` 중 하나를 선택해야 하고 어느 쪽이든 정보 손실"이라 했다 — 이는 **하나의 형태소로 병합**할 때만 강제되는
선택이다. 두 시그니처가 따로 살아 있으면 표면의 Phase 0는 단지 두 게이트 술어를 각각 평가하면 된다: apportion의
`goal_plan_uncompiled(G)`(`apportion:398`)와 conduct의 활성화 조건(`conduct:257` guard) — 각 분기는 자기 자신의
활성화 규율을 그대로 가져간다. `User` 대 `Hybrid` 사이에서 **하나를 골라야 한다는 전제 자체가 재타이핑에서만
발생**했다.

**B4. §2.5(ii)의 "도메인 4항 연접은 재타이핑이 아니다"는 이제 비판력을 잃는다.** 표면 통합은 애초에 도메인을
하나의 곱 타입으로 합칠 필요가 없다 — `AutonomousGoal × ExecutionHorizon`과 `WorkProspect × MoveGround`는
각자의 바인딩 규칙(conduct의 `WP-BINDING`, `conduct:147-167`)으로 각자 읽히면 된다. "연접이지 재타이핑이 아니다"
라는 비판은 재타이핑을 기대했을 때만 비판이 된다.

---

## (c) 신규 — 표면 통합에서만 새로 생기는 반론 또는 지지

**C1. 디스패치 자체는 세 시험을 깨끗이 통과하며, 이는 1차 §2.1의 B 판정을 정확히 뒤집는다.**
(팀장 질문 3에 대한 답)

세 시험을 "결손 타입"이 아니라 "표면의 라우팅 술어"에 적용하는 것이 애초에 온당한가부터: `.claude/rules/type-
category-convention.md:6-9`는 이 규칙이 "TYPES 블록을 만들거나 바꿀 때" 발동한다고 스스로 범위를 긋는다 —
명령 표면 자체는 TYPES 항목이 아니라 FLOW/라우팅 계층이므로, 세 시험이 "표면"에 직접 적용되지는 않는다. 그러나
표면의 Phase 0가 어느 분기로 갈지 기록해야 한다면(트레이스·MODE STATE 목적으로), 그 라우팅 판정 자체가 TYPES
후보(`SurfaceRoute ∈ {ApportionOnly, ConductOnly, Both}`)가 될 수 있고, 이 후보에는 세 시험이 적용된다:

- **dispatch-structure test**: `ApportionOnly`/`ConductOnly`/`Both` 각각은 PHASE TRANSITIONS에서 정말
  다른 경로(각자의 완전한 여덟 블록 기계)로 간다 → **coproduct로 타입 잡는 것이 정확히 옳다.** 1차 §2.1에서
  B에 대해 "이 통과 자체가 반증"이라 했던 것은, B가 이 통과된 coproduct를 **하나의 새 결손 이름 아래 숨기려**
  했기 때문이었다 — 여기서는 숨기지 않고 정직하게 라우팅으로 제시하므로 같은 통과가 이번엔 **정당한 결과**다.
- **volatility criterion**: `SurfaceRoute`를 결정하는 것은 새로 발명한 휴리스틱이 아니라, apportion 자신의
  `goal_plan_uncompiled(G)`(`apportion:166`)와 conduct 자신의 warrant 판정(`conduct:170` guard)이라는 **이미
  존재하는 두 경직 술어의 논리곱/논리합**이다 — 결정적. TYPES 진입 자격 있음.
  - **openness criterion**: 두 개의 불리언 술어의 조합은 정확히 4가지(00/01/10/11)로 유한·완전하며, 이 경계는
  두 술어가 각자 이미 닫혀 있다는 run-independent 사실에서 그대로 파생된다 — 근거 있는 폐쇄, `Emergent` 불필요.

**결론**: 라우팅 계층 자체는 형식적으로 아무 문제가 없다 — 오히려 교과서적으로 깨끗하다. **문제는 라우팅이
아니라, 라우팅 이후 "하나의 드래프트"가 정확히 무엇을 의미하는가**다.

**C2. "하나의 드래프트, progressive disclosure"에는 두 가지 서로 다른 읽기가 있고, 형식 층은 그중 하나만
허용한다.** (팀장 질문 2에 대한 답 — "이 패스의 핵심")

- **읽기 1 (순차-단일표면)**: 표면이 트리아지 후 apportion 분기를 **완전히 끝까지**(Phase 0-3, `park_carrier`
  + `record_handoff`로 durable한 `N` 방출까지) 실행하고, 그 결과를 conduct의 `PI = LivePlan(plan, nav)`
  (`conduct:17-18,36`)로 자동 공급해 conduct 분기를 시작한다. "Progressive disclosure"는 사용자가 명령을
  다시 타이핑하지 않고 하나의 연속된 흐름으로 게이트를 경험한다는 뜻일 뿐, 드래프트 자체가 유닛-슬롯과 위상-
  슬롯을 뒤섞어 보여준다는 뜻이 아니다. 이 읽기에서 `topology_free`는 **순수 구조로 완전히 보존**된다 — conduct
  의 `DraftTopology`는 `IncomingPlan`을 "이미 완결된 것"으로만 읽기 때문이다(`conduct:130`: "Opaque here...
  never re-derived or recompiled"). **이 읽기는 오늘의 `/apportion → /conduct` 연쇄 호출(Rule 9/23 apportion,
  Rule 19/20 conduct)과 형식적으로 구별되지 않는다** — 차이는 사용자가 명령을 한 번 타이핑하느냐 두 번
  타이핑하느냐, 그리고 전이가 사용자의 수동 재호출 없이 자동으로 일어나느냐뿐이다. 게이트 발화 횟수(Qu/Qc/Qt +
  Sc/DraftGate/AxisGate/Qc)는 동일하게 유지된다 — Rule 23(apportion)/Rule 19(conduct)이 "이 프로토콜과 다음
  프로토콜의 모든 Constitution 게이트는 변경 없이 발화한다"고 이미 명시하므로.

- **읽기 2 (진짜 인터리브)**: 유닛-슬롯과 위상-슬롯이 **처음부터 함께** 하나의 화면에 드러나고, 사용자가
  순서에 무관하게 아무 슬롯이나 열 수 있다 — conduct 자신의 draft-first 패턴(`conduct:12`,
  `topology_drafted_whole`, `:142`)을 유닛 쪽으로도 확장한 형태. 이 읽기에서 `topology_free`는 팀장이 정확히
  예견한 대로 **타입 술어에서 절차 규율("유닛 잠금 후에만 위상 슬롯 개방")로 격하**된다. 이 격하 자체는
  원칙적으로 불법이 아니다 — 구조적 보장이 TYPES에서 PHASE TRANSITIONS로 옮겨갈 뿐이라면(강제력이 그대로라면)
  volatility criterion을 반드시 위반하는 것은 아니다. **그러나 이 읽기는 독립적인 이유로 무너진다**: 이미
  존재하는 **owed re-apportionment 메커니즘**이 apportion의 durable한 방출을 전제로 짜여 있기 때문이다 — 아래
  C3.

**C3. (팀장 질문 1에 대한 결정적 답) owed re-apportionment 경로는 읽기 1에서는 그대로 작동하고, 읽기 2에서는
붕괴한다 — 이것이 두 읽기 사이의 승부를 가른다.**

`conduct`가 유닛을 철회할 때 만드는 `HandoffAnnotation.OwedReapportionment(u)`(`conduct:107,109`)는, 그
철회를 나중에(**심지어 다른 세션에서**) 해결할 수 있도록 `Λ.plan_pointer`를 함께 실어 보낸다: "present
{owed_reapportionment(u)...} together with Λ.plan_pointer whole when it is Some, so the owed resolver can
re-reach the canonical plan record in the session that owns it even when it takes the obligation up in a
later one"(`conduct:264`). 이 메커니즘은 **apportion이 자신의 계획을 하나의 독립적이고 dereference 가능한
durable 레코드로 이미 방출해 두었다**는 것을 전제로만 작동한다(`apportion:158-164` `HandoffLocator`/`C`/`N`,
`:330-331` `park_carrier`+`record_handoff`).

- **읽기 1**에서는 apportion이 완결·방출을 마친 뒤에만 conduct가 시작하므로, `Λ.plan_pointer`가 가리킬 durable
  레코드가 항상 존재한다 — **owed re-apportionment 경로는 그대로, 완전히 작동한다.**
- **읽기 2**에서는 유닛과 위상이 하나의 Λ 안에서 함께 진행 중이므로, apportion측 계획이 독립 레코드로 방출된
  적이 없을 수 있다(park_carrier가 "standalone `ConditionBearingUnitPlan`"의 방출 시점에만 도는데, 읽기 2는
  그런 시점을 아예 만들지 않을 수 있다) — 이 경우 conduct가 유닛을 철회하려 할 때 **가리킬 곳이 없다.** 이는
  candidate C(`ContinuityUnprovisioned`)가 지키려던 것과 정확히 같은 종류의 손실을 반대 방향에서 재도입하는
  것이다 — 세션 중간에 durable한 발판이 없으면, 나중에(혹은 다른 세션에서) 그 지점으로 돌아올 수 없다.

**따라서 팀장의 핵심 질문("지금의 연쇄 호출과 형식적으로 구별됩니까")에 대한 답은: 아니오, 구별되지 않는다 —
단, 조건부로.** owed re-apportionment 메커니즘을 무너뜨리지 않으려면, 표면이 무엇이든 **apportion의 Phase 3
방출(durable park_carrier + navigation block)이 conduct 분기 시작 전에 완전히 끝나 있어야 한다.** 이 제약을
지키는 순간 읽기 2는 사실상 읽기 1로 붕괴한다(위상 슬롯이 열리기 전에 유닛 쪽이 이미 durable하게 완결돼 있다는
점에서). 즉 **형식 층에서 "하나의 드래프트"가 의미할 수 있는 유일하게 건전한 형태는, 오늘의 두 프로토콜을
사용자가 한 번의 명령으로 자동으로 연쇄시키는 디스패치 계층이다** — 새로운 여덟 블록도, 새로운 상호폐쇄 문제도
필요 없지만, 동시에 유닛-슬롯과 위상-슬롯을 진짜로 뒤섞어 보여주는 것도 형식적으로 지지되지 않는다.

**C4. 이것이 무엇을 의미하는가 — "표면 통합"의 실질**: 사용자가 얻는 것은 명령어 하나 덜 타이핑하는 것과 자동
전이(오늘은 Rule 23/19의 "declared chain"을 사용자가 명시하거나 알아야 하는데, 이제 자동)이지, 게이트 수의
감소나 인지 부담의 실질적 경감이 아니다 — 게이트 발화 횟수는 Rule 23/19의 "모든 Constitution 게이트는 변경
없이 발화한다" 조항 때문에 동일하게 유지된다.

---

## 직접 답 요약 (팀장의 세 번호 질문)

1. **owed re-apportionment 경로**: 읽기 1(순차)에서는 그대로 작동한다 — apportion·conduct 어느 쪽 상태도
   서로를 침범하지 않으며, 이는 오늘도 이미 그렇다(`conduct:44,138,477`). 읽기 2(진짜 인터리브)에서는 durable
   중간 방출이 없어 무너진다(C3).
2. **`topology_free`가 구조에서 규율로 격하되는가**: 격하는 원칙적으로 가능하지만(읽기 2), owed
   re-apportionment 의존성 때문에 실제로는 채택 불가 — 살아남는 유일한 형태는 구조 그대로 유지(읽기 1). 그리고
   읽기 1은 형식적으로 오늘의 연쇄 호출과 구별되지 않는다.
3. **세 시험을 표면에 재적용**: 결손이 아니라 라우팅 술어(`SurfaceRoute`)에 적용하면 셋 다 깨끗이 통과한다
   (C1) — 이는 라우팅 계층 자체가 건전하다는 뜻이지, "하나의 드래프트"라는 사용자 경험 층위의 주장까지
   정당화하지는 않는다.

---

## 한 문장 판정

표면 통합은 형식 타입 층위에서 막히지 않지만, 올바르게 지어진 유일한 형태(읽기 1)는 새 여덟 블록 프로토콜이
아니라 **오늘 이미 선언된 `/apportion → /conduct` 합성 엣지(Rule 9/23, Rule 19/20)를 하나의 명령으로 자동화하는
라우팅 계층**이며, 이와 다른 형태(읽기 2, 진짜 인터리브)는 기존 owed re-apportionment 메커니즘을 깨뜨리므로
형식 층에서 지지되지 않는다.
