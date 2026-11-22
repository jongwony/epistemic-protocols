# /recollect — Anamnesis (ἀνάμνησις)

<a name="anamnesis--recollect-ἀνάμνησις"></a>

> [English](./README.md)

<a name="anamnesis란"></a>
## 정의

Anamnesis는 상기나 회상을 뜻하는 그리스어에서 왔습니다. 지난 작업이 남긴 대화와 산출물 변경 이력, 결정 기록을 모호한 단서와 대조해 원본 기록에서 단서가 닿는 구간을 열고, 그 내용을 출처와 함께 이야기로 들려주어 찾던 과거 맥락을 직접 알아보게 하는 프로토콜입니다.

<a name="핵심-문제"></a>
<a name="사용-시점"></a>
## 문제

예전 대화나 여러 세션에 걸친 작업 중에서 무언가 논의하거나 결정했던 기억은 나는데, 정확히 어디서 다루었는지나 무엇이라 불렀는지 짚을 수 없을 때가 있습니다. 단서가 모호하다 보니("그때 얘기했던 그거…", 대략적인 시점, 단편적인 기억) 키워드 검색을 해도 결과가 너무 많이 나오거나 아예 나오지 않습니다. 다음 작업을 이어 가기 위해 예전 대화나 작업 흐름, 주제, 이미 정해 두었던 개념을 다시 찾아야 할 때 `/recollect`를 씁니다.

## 결과

원본 기록의 구절들로 엮은 이야기가 남으며, 후보마다 어느 도구와 저장 위치에서 왔는지 표시되고 발췌한 구절마다 원본을 다시 열 수 있는 참조가 붙습니다. 해당 구절을 직접 다시 열어 찾던 과거가 맞는지 결정할 수 있고, 과거에 실제로 있었던 논의라는 사실과 그 내용이 지금도 그대로 유효한지는 구분해서 파악할 수 있습니다. 만약 끝내 일치하는 기록을 찾지 못하면 AI가 어디까지 찾아보았는지 확인할 수 있습니다.

<a name="설치"></a>
## 설치

Claude Code:

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install anamnesis@epistemic-protocols
```

Codex:

```
codex plugin marketplace add https://github.com/jongwony/epistemic-protocols.git
codex plugin add anamnesis@epistemic-protocols
```

Then review and trust the plugin's hooks — installing a plugin does not trust
them, and Codex skips a plugin-bundled hook until its current definition is
trusted, so capture stays off until this step is done:

```
/hooks
```

Codex records trust against the hook definition's hash, so this recurs whenever
the plugin's hooks change. Codex prints a startup warning when hooks are waiting
for review.

<a name="사용법"></a>
<a name="해결책"></a>
## 사용법

```
/recollect [모호한 단서 — 키워드, 단편, 또는 설명]
```

`/recollect`와 함께 기억나는 단서(시점, 사람, 파일 경로, 이슈·커밋 번호, 만들어 쓴 용어, 대략적인 상황)를 입력하면, AI가 사용할 수 있는 Claude Code와 Codex 기록에서 지난 대화와 변경 이력, 결정 기록을 찾아봅니다. 단순한 키워드 검색 결과나 색인 요약을 돌려주는 대신, 유력한 후보의 원본 기록에서 단서가 닿는 구간을 직접 열어 누가 무슨 말을 했는지 기록의 표현 그대로 출처 및 다시 열어 볼 수 있는 참조와 함께 들려줍니다. 이야기를 보고 찾던 과거가 맞는지 확인하거나, 떠오른 단서를 덧붙여 다시 검색할 수 있습니다.

<details>
<summary>프로토콜 흐름과 단서 추적 방식</summary>

**출처로 근거 지어진 인지(Source-grounded recognition)**: 색인의 요약은 기억을 깨우는 단서일 뿐 증거가 아니며, 증거는 열린 원본 기록이고 식별은 사용자의 몫입니다. Claude Code와 Codex 기록이 모두 있으면 현재 설정 디렉터리 뿌리부터 함께 검색하고, 단서가 가리키면 이전 설정 뿌리까지 찾아봅니다.

<a name="프로토콜-흐름"></a>
### 프로토콜 흐름

```
Activation → 사용자의 호출, 또는 빈 지향 감지 (silent)
Pass       → 단서·단위·축을 읽음; 비용에 값하는 것을 검색; 1순위 후보의 기록을 단서가 닿는 구간에서 엶
Round      → 기록의 말로 된 이야기를 발췌마다 출처·resume 핸들과 함께 보여 줌; 제시할 것이 없고 단서에 아직 더해진 것이 없으면 열린 질문 하나
Close      → 사용자가 식별 → RecalledContext; 사용자가 단서를 더한 뒤 보일 것이 남지 않음 → 찾은 범위 안 미해결
Otherwise  → 더해진 단서·교정·찾을 곳 추가·보인 것에 대한 질문이나 말·형식 지시 → 다음 pass — 같은 턴이 다른 과거를 가리켜도 그렇고, 그 과거는 라운드가 이름해 사용자가 이어 가게 둠; 다른 일 → 세션이 제 말로 답하거나, 이름 없이 다른 과거를 가리키면 새 회상; 아무것도 식별하지 않고 끝내는 말 → 턴이 무엇을 더 말하든 찾은 범위와 함께 답하고(그 턴이 다른 과거를 가리키거나 새 회상을 부르면 이 회상을 선 그대로 두는 응답 안에서, 아니면 세션이 제 말로), 그 뒤로는 회상을 다시 여는 말만 닿음; 어느 쪽이든 회상은 그대로; 맨 것이든 제 말을 단 것이든 `/recollect`, 또는 이전 회상을 잇는 말 → 앞선 맥락에서 읽어 가리키는 회상(붙들린 것이든 미해결로 닫힌 것이든)을 잇거나 새 회상으로 열고(새 회상이면 이 회상은 선 그대로), 첫 응답이 어떻게 읽었는지 말함; 보인 것을 식별하기도 한 호출은 먼저 식별로 닫음
```

<a name="단서의-축"></a>
### 단서의 축

단서는 과거에 닿을 축을 알려 주며 정해진 목록은 없습니다. 시간, 사람이나 시스템, 산출물이나 경로, 식별자(이슈, PR, 커밋, 세션 ID), 만든 말, 드문 사건 등 사용자의 말에 담긴 축을 따라갑니다. 식별자는 가리키는 대상의 종류가 단서와 맞을 때만 후보의 기준이 되며, 저장소 이름 없는 번호는 주변 기록에서 저장소가 확인되기 전까지 특정 저장소를 가리키지 않습니다.

### 건너뛰어도 되는 경우

- 이미 세션 ID, 파일 경로, 결정을 알고 있을 때 (직접 조회가 더 빠릅니다)
- 과거 맥락 자체가 없는 새로운 주제일 때 (Aitesis `/inquire` 사용)
- 눈앞의 사례들에서 지금 뜻하는 바에 맞게 새 개념을 형성하거나 다시 다듬어야 할 때 (Periagoge `/induce` 사용)
- 기억을 찾는 것이 아니라 새로 생성하는 요청일 때

</details>

<details>
<summary>다른 프로토콜과의 비교</summary>

<a name="다른-프로토콜과의-차이"></a>
| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |

- **Anamnesis vs Aitesis**: Aitesis는 사용자가 알지 못하는 사실을 찾습니다(`ContextInsufficient` — "정보가 필요하다"). Anamnesis는 사용자가 있었던 줄은 어렴풋이 아는 맥락을 확인합니다(`RecallAmbiguous` — "이거 어디서 다뤘던 것 같은데").
- **Anamnesis vs Periagoge**: 과거 세션들에서 이미 정착된 개념은 Anamnesis가 한 세션 위의 단위로 찾아 주고, 눈앞의 사례에서 지금 뜻에 맞게 새로 빚거나 다시 짚는 개념은 Periagoge(`/induce`)가 다룹니다.

</details>

<details>
<summary>Codex 캡처 라이프사이클과 결과 확인</summary>

<a name="codex-캡처-라이프사이클"></a>
### Codex 캡처 라이프사이클

공유 플러그인 훅은 Codex의 Stop, PreCompact, SessionEnd 이벤트를 `$CODEX_HOME/hypomnesis` 아래 fire-and-forget queue에 기록합니다. 분리된 worker는 transcript revision별로 이벤트를 합치고 `gpt-6-luna`를 `xhigh`로 실행해 compact record 하나를 추출한 다음, immutable generation을 쓰고 session pointer를 원자적으로 전환합니다. 중첩 추출은 ephemeral이며 hooks를 비활성화합니다. `agents/openai.yaml`은 skill discovery metadata만 제공하고, 훅 등록은 `hooks/hooks.json`에 남습니다.

<a name="캡처-결과와-읽기-가능성"></a>
### 캡처 결과와 읽기 가능성

캡처는 최신 시도의 결과를 의미 인덱스와 별도로 기록합니다. `/recollect`는 검색한 세션의 결과를 읽어, 검증된 빈 추출·실패하거나 미완료인 시도·부분 발행·이전 발행물의 보존을 해당 출처에 맞춰 설명합니다. 결과 기록이 없거나 읽을 수 없으면 상태 미상으로 남으며, 기존 인덱스는 계속 회상에 참여합니다.

```text
세션 원기록 → 추출 → 검증된 의미 산출물 → 회상 후보
                └→ 캡처 결과 ─────────→ 검색 범위의 한계 설명
세션 원기록 ──────────────────────────→ 인지의 근거
```

캡처 결과는 각 런타임의 Hypomnesis 저장소 아래 `.outcomes/`에 있으며 의미 검색에서 제외됩니다. [공유 결과 리더](skills/recollect/scripts/hypomnesis-outcome.mjs)가 기록된 발행물을 검증하고, [런타임 읽기 계약](skills/recollect/references/capture-outcome.md)이 그 사용법을 정합니다. 캡처 결과는 실행과 발행, 그리고 추출기마다의 상태와 — 기록된 경우 — 원본 중 받지 못한 양을 설명합니다. 어느 것도 의미 인덱스의 완전성을 보장하지 않습니다. 결과는 런타임·저장소 뿌리·세션 정체성이 모두 맞을 때만 기록에 연관합니다.

저장소 루트에서 생산과 읽기를 함께 검증합니다:

```bash
node --test anamnesis/scripts/hypomnesis-write.test.mjs anamnesis/scripts/hypomnesis-codex-write.test.mjs
```

</details>

<a name="저자"></a>
## 저자

Jongwon Choi (https://github.com/jongwony)
