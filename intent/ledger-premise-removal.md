# Intent: 원장 프리미스를 걷고 `intent/` 규약을 세운다

Author: choi. Status: draft.

## Problem

세션 경계를 넘겨야 하는 것이 두 종류인데 이 저장소는 한 곳으로 보내고 있었다.

`premise/instruction-authoring.md` §Ledger/State Separation 이 "rationale, provenance,
trade-offs, and rejected alternatives 를 write time 에 프로젝트의 정본 원장으로 보내라"고
규정하고, 이 저장소의 인스턴스인 `AGENTS.md` §Settled Directions **Ledger binding** 이 그
원장을 커밋 메시지 이력으로 고정했다. 그 결과 **진행 중인 변경이 무엇을 향해 가고 있는가**
까지 then-record 로 취급되어 커밋으로 갔다.

커밋 메시지는 pull 이다 — 누가 `git log` 를 칠 때만 읽힌다. 브랜치를 이어받는 fresh context
세션은 칠 이유를 모른다. 이 저장소에서 그 실패가 두 번 관측됐다: **PR #942 와 PR #945 의
세션이 각각 선행 세션 기록을 읽지 못했다고 자기 산출물에 적었다.**

결정이 선 세션은 `9526aa31-e3d4-4e88-aed4-c541b0b0e931` 이다. 그 세션에서 사용자가
"답답해서 periagoge 시도도 한적있으나 완주하지 못했는데, 그 결과가 이 ledger 관련 premise
제거 방향인거 같습니다"라고 적었다. 그 `/periagoge` 런은 보존된 기록에서 찾지 못했다 —
`~/.claude/projects/` 의 epistemic-protocols 프로젝트 디렉터리 34개 전부의 최상위 `.jsonl`
을 `periagoge`, `periagoge:induce`, `AbstractionInProcess`, `CrystallizedAbstraction`,
`AlignmentSuspended` 로 긁고, 전체 트리의 세션 제목 색인을 "sdlc", "grounding", "blog",
"periagoge" 로 쓸었다. 그 범위 안에는 없다. 지목된 후보 셋
(`stint::premise-ablation::binding-failure`, "ai-native sdlc grounding", "blog content
grounding analysis") 은 각각 다른 주제이거나 제목 자체가 존재하지 않는다. 부재 주장은 이
탐색 범위까지만 닿는다.

## Proposed outcome

프리미스 층에서 원장 라우팅 규정이 사라지고, 진행 중 변경의 방향이 **브랜치의 작업 트리에
있는 파일**로 옮겨간다. 브랜치를 여는 세션은 `AGENTS.md` 가 자동 로드되는 것만으로 그 파일이
있다는 것을 알게 되고, 누가 건네주지 않아도 읽는다. then-record 는 커밋 메시지에 그대로
남는다 — 그쪽은 실패하지 않았다.

## Affected

- `premise/instruction-authoring.md` — §Ledger/State Separation 절 전체 제거. §Subtraction at
  Revision Time 의 "in the ledger" 문장은 프로브 복구 가능성이라는 일반 의무만 남기고 채널
  이름을 뺀다.
- `AGENTS.md` §Settled Directions — **Ledger binding** 을 then-record 전용으로 좁히고,
  **Intent binding** 한 줄을 새로 세운다. §Editing Conventions 의 `/place` 호스트 바인딩에
  `intent/` 를 더한다.
- `.claude/rules/instruction-surface-revision.md` — 절 이름 인용 제거, 감사 산출물 문단이
  프리미스가 아니라 `AGENTS.md` 위에 서게 다시 쓰고, 방향은 `intent/` 로 가는 문단을 더한다.
- `.claude/rules/protocol-repair.md`, `.claude/principles/AGENTS.md` — 원장 바인딩 인용 문구
  정리.
- `.claude/skills/verify/references/co-change.md` — 절 이름 목록에서 제거, `intent/` 규약
  변경 행 추가.
- `.claude/skills/verify/scripts/language-purity.js` — `intent/` 화이트리스트 항목.
- 새로 생기는 것: `intent/README.md` (규약), `intent/ledger-premise-removal.md` (이 파일).

**닿지 않는 것**: PR #946 과 브랜치 `feat/route-mapping-smoke`. route 평가 작업의 intent
파일은 이 규약이 선 뒤에 따로 앉는다. `/place` 프로토콜의 Ledger 목적지도 이번에는 건드리지
않는다 (Open questions 참조).

## Constraints

- **절 전체를 걷는다.** 원장 라우팅 문장만 남기는 안, 프로젝트 인스턴스만 고치는 안이 함께
  올라갔고 사용자가 절 전체를 골랐다. 그 방향은 다시 열지 않는다.

- **항상 로드되는 면에는 포인터 한 줄.** 규약 본문은 `intent/README.md` 가 진다.
  플레이북이 항상-로드 면을 한 페이지로 묶는 것과 같은 이유이고, `AGENTS.md`
  §Progressive Disclosure 가 이미 같은 말을 한다.

- **포인터는 서술이 아니라 지시다.** "다음 세션이 알아서 읽겠지"가 이 저장소에서 이미 두 번
  실패했으므로 (#942·#945), Intent binding 은 *브랜치에서 무엇을 바꾸기 전에 `intent/` 를
  읽으라*고 명령한다. 파일이 세션에 첨부되기를 기다리지 않는다.

- **then-record 는 옮기지 않는다.** 커밋 메시지 원장은 실패한 채널이 아니다. 실패한 것은
  진행 중 방향을 그 채널로 보낸 라우팅이다. Ledger binding 은 좁아지되 살아 있다.

- **패키지된 `SKILL.md` 는 건드리지 않는다.** 따라서 `plugin.json` 버전 범프가 없고, 이
  변경은 기여자 표면과 프리미스 층에만 닿는다.

## Open questions

- **`/place` 의 Ledger 목적지.** `epistemic-cooperative/skills/place/SKILL.md:54` 가 제거되는
  절이 열거하던 넷(rationale, provenance, trade-off, rejected alternative)을 그대로 담고
  있다. 목적지가 다섯이라는 것이 README 표 넷과 `references/routing-traces.md` 에 걸려 있어
  스킬 재설계에 해당하고, 결정 시점에 사용자가 본 파급 목록에는 없었다. 이번 PR 은
  `AGENTS.md` 의 호스트 바인딩만 고쳐 인용이 뜨지 않게 하고, 목적지 자체는 그대로 둔다.
  `intent/` 가 여섯 번째 목적지가 되어야 하는지는 사용자의 결정이다.

- **소멸 시점.** "머지와 함께 소멸"의 실현이 둘이다. PR 의 마지막 커밋에서 지우면 리뷰어가
  intent 를 diff 에서 못 보고, 머지 후에 지우면 main 에 잠깐 남는다. 이 PR 은 리뷰 가능하도록
  파일을 **남긴 채** 올라간다 — 이 변경이 고른 쪽이고, 규약으로 고정한 것은 아니다.

- **`premise/instruction-authoring.md` 의 선언 범위.** 여는 문장이 "instructions and durable
  records" 를 governs 한다고 말하는데, durable record 를 독립된 대상으로 다루던 유일한 절이
  이번에 나갔다. 좁힐지는 `route/scripts/route-premise.mjs` 의 색인 문자열과 세션 시작 훅
  텍스트까지 움직이는 일이라 이번에 하지 않았다. 남은 절들이 durable record 에도 걸린다는
  읽기로 그대로 두었다. 좁히기로 하면 `ONBOARDING.md:49` 의 같은 어구도 함께 움직인다.
