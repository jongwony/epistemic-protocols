# M2 — 계보 렌즈, 재브리핑: 표면 통합(union) 프레임

원 질문 갱신: `/apportion`(Merismos)과 `/conduct`(Hyphegesis)의 **명령 표면만** 하나로 합치고, 두 타입
시그니처는 그대로 살려 progressive disclosure로 하나의 드래프트에 dispatch. 새 결손 타입 주장 없음.

---

## 0. 새 단서 — "merge-core-protocols" 세션 (우선 추적 결과)

**찾았다.** 클라우드 세션 `session_012TPjTcMCN4LKGLUG9PzLxu`, 브랜치 `claude/merge-core-protocols-sw3Tm`,
PR **#404, #406, #407** (전부 MERGED). 검색 경로: `gh pr list --state all --limit 100` 전수 스캔 →
브랜치명 `claude/merge-core-protocols-sw3Tm` 매치 → `git log --all --oneline --grep` 및 `git log -1
--format=%B <sha>`로 5개 커밋 본문 확인(`60459385`, `a399394b`, `a911ffe6`, `4bf87945`, 그리고 세
머지 커밋 `fea7011c`/`7001bda6`/`c83852d6`).

**결말은 병합이 아니라 정반대 — "격리 심화"였다.**

- `60459385` (PR #404, "Unix 철학 격리 1차"): "Unix 철학 정렬 — **코어 프로토콜은 서로를 신경쓰지
  않고** 자연어 세션 컨텍스트 아래 자연 합성. 타-프로토콜 카탈로그는 어텐션 가정에서 출발한 보조
  스캐폴딩이었으며, **디스커버리 책임은 epistemic-cooperative 허브(`/catalog`, `/onboard`, `/probe`,
  `/compose`)로 이전**." — 12개 코어 SKILL.md에서 `## Distinction from Other Protocols` 표 전체 삭제
  (-284줄).
- `a399394b` (PR #406, "Unix 철학 격리 2차"): "graph.json은 검증 보조로만 잔존하고 **SKILL.md는 타
  프로토콜에 무지한 자기 충족 계약 표면이 됨**." — Advisory relationships 단락, Protocol precedence
  단락을 12개 코어 SKILL.md에서 전부 삭제. Elenchus의 `Routed(downstream_protocol: ProtocolId)`도
  구체 프로토콜 이름을 지우고 `-- handed off to a different protocol`로 추상화.
- `a911ffe6` (PR #407, "격리 방향 3차"): 1·2차가 지운 디스커버리·합성 가이드를 **허브가 흡수**.
- `4bf87945` (PR #407 리뷰 반영): **가장 직접적인 증거.** #406 리뷰에서 나온 인라인 코멘트가 "Euporia
  재진입 invariant를 Euporia Rules로 재배치"하라 했는데, 후속 커밋이 그 재배치 자체를 되돌렸다 —
  "2차 PR 리뷰의 인라인 #1(Euporia 재진입 invariant 재배치 요청)은 **cross-protocol coordination**이었던
  원문을 **프로토콜 내부 규칙**으로 잘못 재분류한 결과로 판단; 재배치하지 않고 **graph-level
  coordination 책임은 epistemic-cooperative 합성 패턴 큐레이션이 흡수**."

즉: 이 저장소가 "여러 프로토콜에 걸친 조정 로직을 프로토콜 하나의 SKILL.md 안에 넣을 것인가"라는
정확히 지금 질문과 같은 형태의 선택지를 이미 한 번 실제로 마주쳤고, 답은 **아니다 — 그건 허브
레이어의 몫**이었다. 이 사실을 (a)/(b)/(c) 분류에서 가장 무겁게 다룬다.

**한계**: 이 세션이 애초에 "명령 표면을 합치자"는 안을 내부에서 논의하다 기각했는지, 아니면 처음부터
"산문 중복 제거"를 뜻했는지는 커밋 본문만으로는 확정 불가 — 세션 내부 심의(트랜스크립트)는 이
저장소 원장이 아니고 나는 그것에 접근할 수 없다. 확정할 수 있는 것은 **착지한 커밋들이 다다른
방향**뿐이다: 세 PR 어느 것도 두 프로토콜의 명령 표면·타입을 합치지 않았고, 오히려 상호 참조를
줄이는 쪽으로 세 번 연속 움직였다.

---

## 1. (a) 유효 — 새 기준에서도 그대로 서는 것

1. **`/delimit`→`/apportion`의 표면 사건은 "명령이 사라짐"이지 "명령이 겸직함"이 아니다.**
   `71af5769`: "Diairesis(`/delimit`)를 저장소에서 제거" — `git rm -r`로 디렉터리 자체 삭제. `/apportion`은
   그 뒤에도 단일 타입만 유지한다 — 실측: `merismos/skills/apportion/SKILL.md` frontmatter,
   `Type: (GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) →
   ConditionBearingUnitPlan.` `/delimit`이 준 것은 메커니즘(`coverage_complete`, `span_fit` 불변식)뿐,
   `GranularityUnderdetermined`라는 결손이나 그 결손으로의 dispatch 분기는 `/apportion`에 없다. **이
   저장소는 "하나의 살아있는 명령이 두 개의 살아있는 타입 시그니처로 dispatch"하는 사례를 지금까지
   한 번도 만든 적이 없다** — `/probe`(아래 §3)조차 자기 타입 하나(`DeficitUnrecognized`)로 실행하고
   대상 프로토콜의 몫은 실행하지 않는다.
2. **`GoalPlanUncompiled` 와 `MethodUnderdetermined` 의 상호 비함의는 사실로서 유지된다.** M7의 S1(목격자
   쌍 W1/W2)과 `243ff8f0`의 독립 논증이 이 사실 자체를 세웠다. 프레임이 재타입에서 표면 통합으로
   바뀌어도 **이 사실이 바뀌는 건 아니다** — 다만 그 사실의 함의가 바뀐다(§2 참조: "그러니 병합하지
   마라"에서 "그러니 표면이 상류에서 분류를 해야 한다"로).
3. **`M7`이 확인한 세 번째 실측 패턴도 유지**: apportion-only·conduct-only·양쪽 사용이 모두 실재하고
   단독 사용이 다수(M7 인용, 계보 렌즈는 재계측하지 않음). 이는 병합 여부와 무관하게 사실이며, 표면
   통합이 "무엇을 커버해야 하는가"의 기준선이 된다.

## 2. (b) 불도달 — 재타이핑 기준에만 걸려 있어 이제 닿지 않는 것

1. **`243ff8f0`의 "단일 목적 원칙" 반론은 표면 통합에 직접 닿지 않는다.** 그 반론의 대상은 "두 결손을
   **한 타입**에 겸하게 하는 것"(`GranularityUnderdetermined`를 `ExecutionBlind`/`GoalPlanUncompiled`에
   합류)이었다. 지금 제안은 타입을 겸하게 하지 않는다 — **명령 표면만** 겸하게 한다. 타입 정체성이
   보존되므로 "커버리지를 지는 새 연산"이라는 반론의 전제 자체가 성립하지 않는다.
2. **`71af5769`/`3f131e9d`의 "이름-결손-방향 정합" 은퇴 시험은 결손 이름 시험이지 명령 이름 시험이
   아니다.** 두 타입이 살아있는 채로 남으므로 어느 쪽 결손도 이름-내용 어긋남을 새로 겪지 않는다.
   이 시험은 (하위질문 3에서 별도로) **명령 이름**에 적용할 때만 다시 의미를 갖는다 — §4 참조.
3. **1차 판정의 핵심 논거("이 저장소 유일의 입증된 재타이핑 전례가 병합을 기각했다")는 목표물을
   잃었다.** 그 전례가 기각한 것은 "두 결손을 하나로" 였지, "두 명령을 하나의 진입점으로"가 아니다.
4. **후보 C(`ContinuityUnprovisioned`)/`/distill` 은퇴 논증은 이번 질문과 무관하다.** 그건 셋째 결손(에포크
   간 연속성) 신설 여부에 대한 답이었지, apportion/conduct 표면 통합과는 별개 축이다. 무효화된 게
   아니라 **이 질문의 범위 밖**이다.

## 3. (c) 신규 — 표면 통합 프레임에서만 새로 생기는 것

### 3.1 위 §0의 "merge-core-protocols" 세션 (가장 무거움)

이 저장소가 실제로 마주친 유일한 "cross-protocol coordination을 어디에 둘 것인가" 결정(`4bf87945`)은
**개별 프로토콜의 SKILL.md 안이 아니라 허브 레이어**로 답이 났다. 지금 제안(하나의 표면이 두 계약을
progressive disclosure로 채움)은 정확히 그 cross-protocol coordination 로직(어느 쪽 타입을 채울지
판단하는 것)을 **명령 표면 자체 — 즉 개별 프로토콜급 아티팩트 — 에 넣자는 안**이다. 이 저장소의
가장 최근 직접 판례는 그 배치를 명시적으로 거부했다.

### 3.2 `/probe`가 이미 이 자리를 차지하고 있다 — 그러나 다른 모양으로

`epistemic-cooperative/skills/probe/SKILL.md:9`: `Type: (DeficitUnrecognized, AI, RECOGNIZE,
UserSituation) → ProtocolRoute`. `/probe`는 "사용자가 어느 결손·프로토콜이 맞는지 불확실할 때 다중
가설을 제시하고 사용자 인정으로 라우팅"하는, **독자적 결손 타입을 가진 별개 프로토콜**이다. 산출은
`ProtocolRoute`(라우팅 결정)이지 대상 프로토콜의 실행 결과가 아니다 — `/probe`는 목표 프로토콜의
morphism을 대신 실행하지 않는다. 이것이 이 저장소가 "여러 후보 중 하나로 표면을 이끈다"는 문제에
이미 준 답의 **모양**이다. 지금 제안은 이 모양(별개 라우터 + 라우팅만)이 아니라 **더 무거운 모양**을
요청한다 — 라우팅 이후 대상 프로토콜의 실행(드래프트 채우기)까지 한 표면 안에서 수행. 이런 "라우팅+실행
합체" 모양의 전례는 찾지 못했다(검색 범위: `git log --all --oneline --grep`로 "dispatch"/"single
command"/"combine"/"unify"/"통합" 등을 merismos/hyphegesis 경로 및 전역에 적용 — 히트 없음).

### 3.3 apportion↔conduct는 "둘 중 하나" 관계가 아니라 이미 세 갈래 사용 패턴이다

두 프로토콜은 이미 advisory 양방향 이음매로 연결돼 있다(`merismos:578` Rule 9: "Both directions of the
`/conduct` edge are advisory, never preconditions"). 그리고 Rule 9는 **우회 조건**까지 명시한다: "A single
unit, or a unit set whose order, independence, reconciliation, termination and routing are all trivial,
**bypasses `/conduct`**." 즉 실제 사용 모양은 이미 **셋**이다 — (i) apportion 단독(단순 계획, conduct
불필요), (ii) apportion→conduct 파이프(다중 유닛, 위상 비trivial), (iii) conduct 단독(자율 목표 없이
세션 내 이동 배치만 — M7의 W2, `MethodUnderdetermined ∧ ¬GoalPlanUncompiled`). M7 실측이 보고한 92%
단독 사용(재계측 안 함, M7 경유)이 바로 이 셋 중 (i)+(iii)의 우세를 가리킨다. 표면 통합은 이 세 갈래를
진입 시점에 판별해야 하는데, 그 판별 자체가 `/probe`가 이미 수행하는 인정(recognition) 행위와
동형이다 — 표면을 합치면 그 판별 로직을 어딘가(병합된 SKILL.md 내부, 즉 §3.1이 거부한 자리)에 다시
넣어야 한다.

### 3.4 어휘 정합 시험을 명령 이름에 적용

`71af5769`/`243ff8f0`가 결손 이름에 쓴 시험("이름의 어휘 가치가 실제 조작과 정합해야 한다")을 명령
이름에 옮기면: `/apportion`(μερισμός, 나눔·몫의 배분)과 `/conduct`(ὑφήγησις, 앞서 이끄는 안내)는
**서로 다른 두 동사**다. 하나의 이름 아래 두려면 그 이름이 "자르기"와 "이끌기"를 동시에 지칭해야
한다. `243ff8f0`가 옛 이름 "주의 배분"을 기각한 논리를 그대로 적용하면 — 그런 이름은 "사후 은유이지
조작의 어휘 가치가 아니다"가 된다. 두 갈래 중 하나:
- **더 추상적인 이름을 새로 짓는다** → 그 이름이 지칭하는 세 번째 조작이 있어야 하는데, 그건 "새
  결손을 주장하지 않는다"는 이번 프레임의 전제와 정면으로 충돌한다(재타이핑 질문이 다시 열림).
- **둘 중 하나의 이름을 대표로 쓴다**(예: `/apportion`이 진입점, 내부에서 `/conduct`로 dispatch) →
  그 이름은 conduct가 처리하는 절반의 사용 사례(§3.3의 (iii), 단독 conduct)에는 어휘적으로 거짓이
  된다 — apportion이 전혀 관여하지 않는 세션에도 "apportion"이라는 이름의 명령을 쳐야 한다.

이 시험은 표면 통합에 **이름을 통과시킬 방법이 없다**는 것을 보여주는 것이 아니라, 통과시키려면 이
저장소가 지금까지 "결손이 없으면 이름도 없다"는 원칙으로 피해온 상황(어휘가 조작을 가리키지 않는
이름)을 정면으로 만든다는 것을 보여준다.

## 4. 팀장 질문 1–4 직접 답

1. **표면 통합이 제기된 적 있는가**: `git log --all --oneline --grep`으로 "merge", "combine", "unify",
   "통합", "single command", "명령을 합" 등을 전역 및 merismos/hyphegesis 경로 한정으로 검색 — 두
   명령을 **한 진입점**으로 합치자는 안이 명시적으로 논의됐다는 커밋은 찾지 못했다. 다만 **가장
   근접한 사건**은 있다: `claude/merge-core-protocols-sw3Tm` 브랜치/세션(§0) — 제목·브랜치명은 "병합"을
   가리켰으나 착지한 세 PR 전부가 **격리 심화**로 귀결됐고, 그 과정에서 "cross-protocol 조정 로직을
   프로토콜 하나의 SKILL.md에 넣을 것인가"라는 인접 질문이 명시적으로 나왔다가 기각됐다(`4bf87945`).
   **범위**: 로컬 git 커밋 메시지 전문(`--all`) + `gh pr list --state all --limit 100` 전수 스캔. GitHub
   이슈 본문 전문 검색은 하지 않았다(제목 검색만).
2. **`/delimit`→`/apportion` 표면 사건 자체**: "명령이 사라짐"이다. `/delimit`은 삭제됐고(`git rm
   -r`), `/apportion`은 겸직하지 않는다 — 그 결손·이름·활성화 트리거 어느 것도 얻지 않았다. 얻은 건
   내부 불변식(coverage_complete, span_fit) 두 개뿐이고 그마저 `/apportion` 자신의 단일 타입 안에서
   전면 재작성됐다(§1.1). "명령이 겸직함"의 전례는 없다.
3. **어휘 정합 시험을 명령 이름에 적용하면**: §3.4. 요약 — 통과 가능한 이름이 없다. 새 추상 이름은
   재타이핑 질문을 재개하고, 둘 중 하나의 이름을 쓰면 절반의 실사용 갈래(§3.3)에 대해 어휘적으로
   거짓이 된다.
4. **"merge-core-protocols" 세션 추적**: §0에 전문. 브랜치 `claude/merge-core-protocols-sw3Tm`, PR
   #404/#406/#407(전부 MERGED), 세션 `session_012TPjTcMCN4LKGLUG9PzLxu`. 결말은 병합이 아니라 격리
   심화, 그리고 "cross-protocol coordination은 개별 프로토콜의 SKILL.md가 아니라 허브가 진다"는
   명시적 재확인(`4bf87945`) — 이것이 지금 질문에 가장 직접적인 계보 증거다.

## 5. 요약 판정

**(a)/(b)/(c) 요약**: (a) 델리밋 흡수가 "명령 소멸"이었다는 사실과 두 타입의 상호 비함의라는 사실은
유지되지만 함의가 바뀐다. (b) 1차 판정의 핵심 논거(재타입 기각 전례, 단일목적 원칙, 후보 C)는 전부
표면 통합이라는 다른 대상에는 닿지 않는다. (c) 새로 발견한 것 — 특히 §0의 세션 — 이 압도적으로
무겁다: 이 저장소가 "cross-protocol 조정 로직을 어디에 둘 것인가"라는, 지금 질문과 구조적으로 같은
질문을 실제로 마주쳤고, 개별 프로토콜 SKILL.md 안이 아니라 허브 레이어라는 답을 냈다.

**한 문장 판정**: 계보 렌즈에서 — **표면 통합도 신설하지 말아야 한다**; 재타이핑 기준으로 걸었던 반론은
대부분 불도달이 됐지만, 그 자리를 **더 강한 새 반론**(§0의 직접 판례 + `/probe`의 기존 모양 + 이름이
통과할 자리가 없다는 것)이 채웠다.
