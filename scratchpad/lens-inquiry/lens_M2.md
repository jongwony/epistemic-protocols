# M2 — 계보(genealogy) 렌즈: `/apportion`+`/conduct` 재타이핑 신설 심문

## 1. 고유 기여

이 렌즈만 드러내는 것 셋:

1. **이 저장소에는 "재타이핑/은퇴 기준"이 하나가 아니라 최소 두 개 있고, 서로 다른 조건을 요구한다.** `/delimit` 은퇴(`71af5769`)와 `/attend`→Merismos 재타입(`243ff8f0`)은 **같은** "이름-결손-방향 정합" 기준을 썼지만, `/distill` 은퇴(`3f131e9d`)는 **다른**, "저작 측이 수신 측 전용 관측 속성을 검증할 수 없다"는 구조적 불가능성 기준을 썼다.
2. **원 질문이 선례로 든 "clarify+telos → euporia"는 이 저장소 자신의 재타이핑 절차 중 근거 서술이 가장 얇은 사례다.** 반면 원 질문이 언급하지 않은 `243ff8f0`(`/attend`→Merismos)이 실제로는 이 저장소에서 유일하게 "두 결손이 서로를 함의하지 않는다"를 목격자 쌍으로 **입증한** 재타이핑 커밋이며, 그 입증은 **병합을 기각하는 방향**으로 쓰였다.
3. **원 질문이 동기로 든 "기질(외부 세계) 변화 → 새 프로토콜"과 정확히 같은 모양의 시도가 이미 한 번 있었고, 은퇴됐다.** `/distill`(Diylisis)은 "인계가 컨텍스트 에포크를 넘을 때 살아남아야 할 것을 마련한다"는 후보 C와 거의 동일한 자리를 차지하고 있었고, `3f131e9d`에서 구조적 불가능성 사유로 은퇴되어 그 기능이 **프로토콜이 아닌** `AGENTS.md`의 포인터-우선 라우팅 관례와 `/conduct`의 `handoff_to_span`(설계시점 선언만, 실행시 외부화는 서브스트레이트 몫)으로 재분배됐다. 후보 C를 새 프로토콜로 세우는 것은 이 재분배 결정을 뒤집는 일이다.

## 2. 프레임워크 분석

### 하위질문 1 — 은퇴 기준의 실제 형태

**`71af5769` (`/delimit` 은퇴)**: 이름-결손-방향 정합 기준을 명시적으로 세움.

> "사용자가 세운 설계 기준이 근거다 — 프로토콜의 **이름의 어휘 가치·결핍 타입·방향이 정합해야 하고, 어긋나면 패치가 아니라 재타입 또는 은퇴**." (`71af5769` 커밋 메시지)

적용: διαίρεσις(종류를 나누는 플라톤적 분할)라는 이름은 추상을 가리키는데, 실제 결핍은 `GranularityUnderdetermined`, 피연산자는 외부 WBS, 조작은 span-fit 패킹 탐색 — "이름은 추상을 가리키고 내용은 작업 덩어리를 가리킨다"는 어긋남. 재타입 두 안(`ExternalWBS→WorkBodyRef` 일반화, `/bound` 흡수, 개명 후 존치)이 모두 기각되고 나서야 은퇴로 판정 — 독립 자문 인용: "no coherent identity remains to preserve." 즉 이 기준은 **은퇴를 자동으로 지시하지 않는다** — 재타입 대안을 먼저 소진한 뒤에만 은퇴가 성립한다.

**`3f131e9d` (`/distill` 은퇴)**: 다른 기준 — 구조적 불가능성.

> "저작 세션은 자기 안에서, 수신 세션만이 관측할 수 있는 속성을 검증할 수 없다." (#673 결정 7, `3f131e9d` 인용)
> 독립 자문 바닥줄: "Diylisis should not survive as a 543-line author-side certification protocol; land the impossible-claim contraction as a bounded safety patch, then replace it with a pointer-first reception rule and a narrow access/copy exception."

여기엔 "이름의 어휘 가치" 언급이 전혀 없다. 대신 `Currency is not Support-Integrity`(자기 기술과 집행 결속이 끊긴 실패 부류)라는 별도의 실패 형식과, `Epistemic Cost Topology`("쓰이지 않는 프로토콜의 비용이 없는 프로토콜의 비용을 초과한다") 및 `Direction over Accumulated Workload`라는 경제성 논증이 근거로 인용된다.

**결론**: 두 은퇴는 **다른 기준**을 썼다. 다만 `71af5769`의 기준은 `243ff8f0`에서 **재타입 정당화**에도 자기적용됐다("사용자가 세운 설계 기준 ... 을 이 프로토콜 자신에게 적용한 결과다") — 이름-결손-방향 정합 기준은 은퇴 전용이 아니라 은퇴/재타입 분기 전체를 구속하는 상위 기준이고, `/distill`만 이 기준 계열 바깥의 별도 사유로 은퇴됐다.

### 하위질문 2 — 재타이핑 성립 조건

**`243ff8f0` (`/attend`→Merismos, 가장 상세히 근거를 남긴 재타입)**:

> "이 결손을 메우는 것은 '빠진 도출 경로 하나를 더하는' 일이 아니라 커버리지를 지는 새 연산을 얹는 일이며, `GranularityUnderdetermined` 와 `ExecutionBlind` 는 서로를 함의하지 않으므로(단위는 명확한데 술어가 없는 경우, 다단위 계획인데 자율 루프가 없는 경우가 각각 한쪽만 성립) 두 결손을 한 프로토콜에 겸하게 하면 단일 목적 원칙이 깨진다. 따라서 확장이 아니라 전면 재타입을 택했다."

이 인용은 세 요소를 갖는다: (a) 새 조작이 **자기 몫의 불변식·커버리지를 지는 별개 연산**이라는 판정, (b) **목격자 쌍으로 입증된 상호 비함의**(M7의 S1과 정확히 같은 형식), (c) 옛 이름("주의 배분")이 "사후 은유이지 조작의 어휘 가치가 아니다"로 기각 — 이름-어휘 시험의 재적용.

**`29249c57` (euporia 인쇄)**: 커밋 본문 자체는 결과(`AbstractAporia gate predicate: axis_undetermined(I) ∧ substrate_implicit(I)`, "Categorical dual to Periagoge")만 인쇄하고, `IntentAmbiguous`/`GoalUndefined`가 서로 함의하지 않는다는 목격자 쌍 논증은 **커밋 메시지에 없다**. 그 논증의 소재는 "Issue #341 dialectical trajectory (5-attempt /induce session) crystallized in #343"로만 지목된다. 이 저장소의 원장 원칙(`AGENTS.md` §Settled Directions "Ledger binding": "무엇이 결정됐는지... 이슈나 PR 본문에만 남아 있으면 적힌 것이 아니다")을 그대로 적용하면, **euporia 재타이핑의 독립-근거 논증 자체는 원장에 적히지 않았다**.

**`6dd9b0e1`**: 재타이핑의 결과를 즉시 하드삭제하지 않고 "Stage 2 evidence-collection modality"로 스테이징(`invocable` 유지, 그래프·중앙 열거에서만 제거, "충분한 사용 evidence 누적 후 별도 PR에서 archive 예정")한 절차 커밋. `e3274265`는 그 88 커밋 뒤에 하드삭제를 집행("`hard erase uniform, replacement deprecated 참조 삽입 없음`")한 커밋 — 검증: `git merge-base --is-ancestor 6dd9b0e1 e3274265` 성공, `git log --oneline 6dd9b0e1..e3274265` 88줄.

**`470cbec1`**: PR #697 머지 커밋 — "`/attend`를 Merismos(`/apportion`) 목표 분배 컴파일러로 재타입 + `/delimit` 은퇴"를 **한 PR에 묶었다**. 즉 재타입과 은퇴가 인과적으로 얽힐 때는 별도 PR이 아니라 원자적 커밋 묶음으로 처리된 전례.

**공통 형태(있는 것)**: (i) 재타입은 **자기소진적 대안 기각**(다른 안을 먼저 시도·기각한 뒤에만 성립) 뒤에 오고, (ii) 강하게 근거를 남긴 사례(`243ff8f0`)는 목격자 쌍으로 비함의를 입증하지만, (iii) 즉시 하드삭제하지 않고 **단계적 폐기**(invocable 유지 → 증거 누적 → 별도 PR 삭제)를 거치는 것이 euporia 계열의 절차이고, 반면 `/delimit`·`/distill`은 스테이징 없이 원자적 즉시 삭제였다(`71af5769`: "deprecated 스테이징 없이 레지스트리 표면과 원자적으로 삭제"). 어느 절차를 택할지는 **대체물의 신뢰도**에 달려 있는 것으로 읽힌다 — euporia는 신설 프로토콜이라 사용 증거가 필요했고, delimit/distill은 대체 경로(Merismos 흡수, AGENTS.md 라우팅)가 이미 확립돼 있어 즉시 삭제됐다.

### 하위질문 3 — 선례의 비대칭

**다른 종류의 사건이다.** 근거:

- `/delimit`→`/apportion`은 **결손 합집합이 아니다**. `71af5769`이 명시: "분할 기능은 선행 커밋에서 **Merismos 가 받는다**." 그 "선행 커밋"이 `243ff8f0`이고, 거기서 Merismos의 새 타입(`GoalPlanUncompiled`)은 옛 `/attend`(`ExecutionBlind`)에 대한 **독자적** 재타입이며, `243ff8f0` 자신이 `GranularityUnderdetermined`(delimit의 결손)를 **병합 후보로 검토하고 명시적으로 기각**했다(하위질문 2 인용 참조). `/delimit`이 준 것은 결손 타입이 아니라 **불변식 메커니즘**(`coverage_complete`, `span_fit` — "선행 커밋에서 Merismos 가 받았다 — `coverage_complete` 는 하드 불변식으로, `span_fit` 은 하드 불변식 + 명시적 override 경로로 이관")뿐이다. 즉 표면상 "명령 두 개 → 하나"이지만 내부 사건은 "재타입 하나(attend→Merismos) + 은퇴 하나(delimit) + 메커니즘 이식"이지 **결손 병합이 아니다.**
- clarify+telos→euporia는 (하위질문 2에서 확인했듯) **결손 병합으로 서술은 되지만 원장에서 목격자 증명이 빠진** 사례다.

**판정**: `/apportion`+`/conduct` 교체 제안이 어느 쪽에 가까운지 물으면 — M7의 S1이 이미 `243ff8f0`과 **동일한 형식의** 목격자 쌍(`GoalPlanUncompiled ∧ ¬MethodUnderdetermined`인 W1, `MethodUnderdetermined ∧ ¬GoalPlanUncompiled`인 W2)을 독립적으로 재현했다. `243ff8f0`은 바로 이 형식의 증거가 나오면 **병합을 기각**하고 재타입을 각자 유지하는 쪽으로 갔다. 계보상 가장 가까운 전례는 "병합 성립"(euporia, 근거 얇음)이 아니라 "병합 기각, 별개 유지"(attend/delimit, 근거 두터움) 쪽이다.

### 하위질문 4 — "독립 근거" 시험

전례에서 독립 근거가 목격자 쌍으로 실제 입증된 사례는 `243ff8f0` 하나뿐이고, 그 입증은 **병합에 반대하는 방향**으로 쓰였다. euporia의 `AbstractAporia`가 `IntentAmbiguous`나 `GoalUndefined` 어느 쪽의 확장도 아니라는 주장은 원장 수준에서 미입증이다(하위질문 2).

M7의 세 후보에 같은 시험 적용 — 계보 렌즈가 추가하는 것:

- **후보 A `HandoffUncompiled`**: M7이 이미 W2로 기각(`/conduct`보다 좁음). 계보가 더하는 것: 이 자리 — "이 심의를 공유하지 않을 실행자를 위한 인계 컴파일" — 는 정확히 `/distill`(Diylisis)이 저작측 인계 인증 프로토콜로서 차지했던 자리이고, `3f131e9d`가 은퇴시킨 이유(#673 결정 7)를 그대로 물려받는다. 새로 세우면 이미 닫힌 구조적 반론을 재론해야 한다.
- **후보 B `PreRunUnderdetermined`**: M7이 이미 기각(`topology_free`, `apportion:120` 실측 확인: `topology_free(req) ≡ req contains no UnitRef, Move, MoveRegion, or order-position reference` — 인용 정확). 계보가 더하는 것: 이 기각 패턴은 `71af5769`의 "일반화 후 존치" 기각("work"가 이름 아래 남아 어긋남이 살아남는다)과 형식이 같다 — **이미 하드 불변식으로 집행 중인 것을 병합 근거로 삼으려면 그 불변식 자체를 반증해야 하는데, 반증이 없다.**
- **후보 C `ContinuityUnprovisioned`**: M7은 "추가지 대체가 아니다"로 판정했다. 계보 렌즈는 더 강하게 말할 근거가 있다 — 이 결핍은 **이미 한 번 프로토콜로 세워졌다가 은퇴됐다.** `/distill`은 "인계가 컨텍스트 에포크를 넘을 때 무엇이 살아남아야 하는가"를 다뤘고, `3f131e9d`에서 구조적 불가능성으로 은퇴된 뒤 기능이 두 곳으로 재분배됐다:
  1. `AGENTS.md` §Settled Directions "Session-handoff routing": "work crossing a session boundary is handed over as a pointer into the canonical record, never as a re-authored copy of it."
  2. `hyphegesis/skills/conduct/SKILL.md`의 `handoff_to_span` — 현재 텍스트 확인(`hyphegesis/skills/conduct/SKILL.md:493`): "`cross-span-absorption`: the `handoff_to_span` routing value pulls author-side portability machinery ... into `/conduct`... Guard: `handoff_to_span` is routing-and-externalization only ... `/conduct`'s cognition stays single-span; only its output bridges." 그리고 Rule 19(`:476`): "A `handoff_to_span` region names no next protocol."

  즉 `/conduct`는 **의도적으로** 저작측 지속성 검증을 흡수하지 않도록 가드돼 있다 — 이것은 `AGENTS.md` §"Harness boundary"("실행 채널, 상태 변이 ... 이 instruction surfaces 가 다스리는 것 밖")의 직접 적용이다. 후보 C를 새 프로토콜로 세우는 것은 이 두 표면 결정(distill 은퇴 + conduct 가드)을 **동시에 뒤집는** 일이며, 원 질문이 든 "기질이 바뀌었다"만으로는 `#673 결정 7`(저작 세션은 수신 세션 전용 관측 속성을 검증할 수 없다)이 피어 세션/Stint에는 왜 적용되지 않는지를 논증하지 못한다.

### 하위질문 5 — 기질 변화가 선례에서 근거로 쓰인 적이 있는가

**검색 범위**: `git log --all --format=%B`에 대해 `기질.*바뀌`/`substrate.*chang`/`environment.*chang`/`외부 세계`(0건), 및 `장수 워커`/`long-lived worker`/`Stint`/`peer session`/`피어 세션`(0건 — 프로토콜 신설·재타입 근거로 쓰인 사례는 없고, `Stint Charter` 언급 2곳은 실행 규율 커밋이지 신설 근거 커밋이 아님) — 커밋 메시지 전문 대상.

추가로 `MethodBrief.span`/`handoff_to_span`의 도입 커밋(`7d139969`)을 직접 확인했다: 그 근거는 "killed span/focus governor의 surviving fold-in"과 "`/distill`에 composition(흡수 아님)으로 위임"이라는 **절차적** 이유였지, "실행자가 이제 피어 세션을 포함하므로"류의 기질 변화 논증이 아니었다.

**명시**: 이 저장소의 커밋 메시지 이력(원장) 안에서, "외부 세계/기질이 바뀌었다"가 프로토콜 신설 또는 재타이핑의 근거로 쓰인 사례는 **찾지 못했다.** 이 부재 주장은 로컬 git 커밋 메시지 전문 검색 범위에 한정된다 — GitHub 이슈·PR 본문은 검색하지 않았고(도구 미사용, `gh` 미호출), 이 저장소의 원장 원칙상 그런 텍스트는 애초에 원장으로 인정되지 않는다(다만 "존재했으나 원장에 안 적혔다"는 가능성 자체는 배제할 수 없다 — §3 지평 한계 참조).

### 하위질문 6 — 취소된 합병 선례

넷을 확보했다:

1. `243ff8f0`: "**conduct에 substrate 결정 승격(M2)**: conduct는 이미 Phase 3에서 라이브 인벤토리를 읽어 각 region의 실현 가능 substrate를 *제안*한다. 승격을 막는 것은 conduct Rules 6·10의 분담(conduct=기능 요구사항 / 런타임=구체 결속)과 `Epistemic Completeness Boundary`. **기각.**"
2. `243ff8f0`: "**`conduct → attend` 엣지 뒤집기**: M2 기각으로 데이터흐름이 한 방향으로 결정되지 않으므로, 뒤집는 대신 가드 붙은 양방향으로 남겼다." (기각)
3. `243ff8f0`: `GranularityUnderdetermined`(delimit)를 새 Merismos 타입에 겸하게 하는 안 — 목격자 쌍 비함의 논증으로 **기각**(하위질문 2 인용).
4. `71af5769`: 세 안 모두 기각 — "**`ExternalWBS` → `WorkBodyRef` 일반화 후 존치**: ... 어긋남 자체는 그대로 살아남는다. **기각.**" / "**`/bound` 의 새 boundary kind 로 흡수**: `WorkUnitMap` 은 payload 인데 BoundaryMap 은 균일한 settlement-disposition **신호**다. payload 를 신호 자리에 밀어 넣는 것이라 **기각.**" / "**추상 경계 분할 프로토콜로 개명 후 존치**: ... 인정된 결핍 중복이라 **기각.**"
5. `3f131e9d`: 독립 자문이 "저작측 인증 프로토콜로 존속"을 명시적으로 반대하고 대신 패치+관례(AGENTS.md 라우팅)로의 통합을 권고 — 이것도 일종의 "프로토콜로 유지" 안이 기각되고 비-프로토콜 표면으로 흡수된 선례다.

## 3. 지평 한계

- **원장에 없는 심의는 이 렌즈에 안 잡힌다.** euporia 재타이핑의 실제 비함의 논증이 어딘가에서 이뤄졌을 수 있지만(#341/#343 이슈), 이 저장소 자신의 원장 원칙("이슈나 PR 본문에만 남아 있으면 적힌 것이 아니다")을 적용하면 그 논증은 계보 렌즈가 볼 수 있는 자료가 아니다 — 그 논증이 **존재하지 않았다**는 뜻이 아니라, **원장 자격으로 존재하지 않는다**는 뜻이다. 이 구분을 흐리면 안 된다.
- **아직 일어나지 않은 일은 전례가 없다.** 피어 세션(Stint)이 실행자에 포함되는 것이 정말로 `/conduct`의 `span`/`handoff_to_span`이 이미 흡수한 것과 질적으로 다른지는 순전히 forward-looking 설계 판단이고, 계보는 "가장 가까운 과거 결정이 무엇을 겨눴는가"만 보여줄 뿐 "그 결정이 새 기질에서도 옳은가"는 판정하지 못한다.
- **사용 마찰·리워크 신호 중 커밋으로 승격되지 않은 것은 안 보인다.** M7이 인용한 "30,380 세션 실측"류 수치는 세션 아티팩트에서 나온 것이지 커밋 메시지에 있는 것이 아니다 — 계보 렌즈가 직접 확인한 것이 아니라 M7을 경유한 것임을 명시한다(재계측하지 않았다).
- **부재 주장의 범위 재확인**: 하위질문 5의 "기질 변화가 근거로 쓰인 적 없다"는 로컬 git 커밋 메시지 전문 검색에 한정된다. GitHub PR/이슈 본문, 삭제된 브랜치의 미머지 커밋(예: `feat/diylisis-reception-block`, head `9ffdd7fd` — `3f131e9d`가 "유지한다"고 명시한 브랜치)은 검색하지 않았다.
- **왜 지금 이 제안이 나왔는지, 즉 발화의 진짜 동기는 계보로 검증 불가.** 계보는 과거 결정의 근거 형태만 재구성하며, 원 질문자가 "기질이 바뀌었다"고 말한 것이 사실인지 자체는 이 렌즈의 소관이 아니다(다른 렌즈나 실측이 볼 것).

## 4. 판정

**신설하지 말아야 한다** — 적어도 "`/apportion`+`/conduct`를 합집합이 아니라 재타이핑으로 대체"라는 제안된 형태로는.

근거를 계보 순으로 요약:

1. 이 저장소가 유일하게 목격자 쌍으로 **입증한** 재타이핑 전례(`243ff8f0`)는 지금 M7이 재현한 것과 **같은 형식의 비함의 증거**가 나오자 병합을 기각하고 두 프로토콜을 독립으로 유지하는 쪽으로 갔다. 원 질문이 근거로 든 euporia 전례는 이 저장소 자신의 원장 기준으로 비함의가 미입증인 더 약한 사례다. 두 전례 중 더 두텁게 근거를 남긴 쪽이 지금과 같은 상황에서 이미 "기각"으로 답했다.
2. 원 질문의 동기("기질이 바뀌었다 — 실행자가 피어 세션을 포함")와 정확히 같은 자리를 겨눴던 전례(`/distill`)는 존재했고, **은퇴됐다** — 구조적 불가능성 사유로, 그리고 그 사유가 피어 세션/Stint에는 왜 다른지에 대한 논증이 이 세션에 제출된 증거 안에는 없다. 그 기능은 이미 프로토콜이 아닌 두 표면(AGENTS.md 포인터 라우팅, `/conduct`의 가드된 `handoff_to_span`)으로 재분배돼 있고, `/conduct` 자신이 그 흡수를 명시적으로 거부하는 가드(`cross-span-absorption`)를 갖고 있다.
3. 이 저장소의 취소된 합병 선례 다섯 건 모두 "인접해 보이는 결손을 겸하게 하면 단일 목적 원칙이나 payload/신호 구분이 깨진다"는 같은 형태의 반론으로 기각됐다. 후보 B는 이미 하드 집행 중인 `topology_free` 불변식을 반증해야 성립하는데 그 반증이 없고, 후보 A는 이미 닫힌 구조적 반론(#673 결정 7)의 영역을 재론한다.

남는 여지: M7이 짚은 "실행자 할당"(제3의 것)과 후보 C의 잔여(에포크를 넘는 연속성)는 이 렌즈로도 **실재하는 것으로 보이지만**, 이 저장소의 전례가 가리키는 다음 수는 "교체 신설"이 아니라 **덧대기**다 — 기존 축 확장(예: `/conduct`의 여섯 번째 축) 또는 `AGENTS.md`류 비-프로토콜 표면으로의 흡수. 어느 쪽이 맞는지는 계보 렌즈의 지평 밖(전방 설계 판단)이므로 다른 렌즈에 넘긴다.
