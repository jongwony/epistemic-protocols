# Route — /route

쌓인 세션 컨텍스트가 드러내는 결핍에 맞는 코어 epistemic 프로토콜로 라우팅하고, 그 프로토콜을 호출합니다.

> [English](./README.md)

## Route란?

각 epistemic 프로토콜 자신의 description은 그 프로토콜이 해소하는 상호작용 결핍을 명명합니다. 그것과 실제 호출 사이에 두 가지가 놓여 있고, 그중 하나만이 계기입니다. 다른 하나는 목록입니다 — 호스트의 loaded-skills 리스팅은 각 스킬의 description을 함께 실을 수도 있고, 커맨드 식별자만 실을 수도 있습니다. 식별자만 실릴 때 루프 위의 에이전트는 어떤 프로토콜이 무슨 결핍을 해소하는지에 대한 진술을 하나도 들고 있지 않습니다. 그러면 *컨텍스트가 로드된 어떤 프로토콜이 해소하는 결핍을 보여주는가* 라는 형태의 판별은 프롬프트 시점에 컨텍스트에 없는 목록에 대조하라는 요구가 되고, 결코 발동하지 않습니다.

이 공백은 드문 예외가 아니고, 하필 Route가 필요한 자리에서 가장 심합니다. 호스트가 리스팅을 크기 예산 아래 배급할 때 남기는 description은 최근 사용으로 정당화되는 것들이고, 떨어져 나가는 것은 사용자가 부르지 않아 온 스킬의 것 — 바로 Route가 닿으려는 집합입니다. 배급은 그렇게 Route의 목적과 반대 방향으로 작동하고, 조용히 그리고 부분적으로 그렇게 하므로, 채워져 보이는 리스팅이 정작 들어맞는 프로토콜 자리에서만 비어 있을 수 있습니다.

Route가 둘 다를 나눠 공급합니다: **언제는 훅이 정하고, 무엇은 스킬이 정합니다.** `UserPromptSubmit` 훅이 매 프롬프트 옆에 짧은 지시문을 놓고, 그 판별은 목록 없이 이뤄집니다 — 상호작용 자체가 모자란다는 징후(양쪽 누구도 정의하지 않은 채 쓰이는 용어, 아직 분할되지 않은 공간 위에 놓인 옵션 셋, 방금 이름 붙인 어긋남, 다시 밟고 있는 같은 자리)로, 모두 방금 지나간 턴에서 바로 읽히는 것들입니다. `/route` 스킬은 호출되고 나면 로드된 프로토콜 식별자를 후보 집합으로 삼고, 각 후보의 결핍을 그 프로토콜 자신의 description에서 해소합니다 — 리스팅이 이미 그것을 실어 왔다면 아무것도 더 읽지 않습니다 — 그리고 정확히 하나의 프로토콜 결핍이 컨텍스트가 보여주는 것일 때 그 프로토콜을 호출합니다. description을 해소할 수 없는 후보는 이름이 무엇을 뜻할지 추측해 매칭되는 대신 후보에서 빠집니다. 호출된 프로토콜 자신의 Phase 0 감지와 첫 게이트가 사용자 판단의 자리로 남고, Route는 자기 게이트를 추가하지 않습니다.

| 결과 | 조건 |
|------|------|
| 프로토콜 호출 | 로드된 프로토콜 하나가 지배적으로 맞을 때 |
| 프로토콜별 넛지 한 줄 (`↗ /command — reason`) | 여럿이 맞거나, 하나뿐인 매치가 약할 때 |
| 침묵 | 아무것도 맞지 않을 때 — 가장 흔한 경우 |

## 훅이 주입하는 것

`hooks/hooks.json`은 `UserPromptSubmit` command 훅 하나, `scripts/route-prompt.mjs`를 등록합니다. 매 프롬프트마다 발동 조건(지시문 본문은 그 스크립트에 있습니다)을 `hookSpecificOutput.additionalContext`로 씁니다 — Claude Code와 Codex가 이 이벤트에 공통으로 받는 훅 wire 형태 — 그리고 0으로 종료합니다. stdin의 훅 payload는 읽지만 필수가 아닙니다; 비어 있거나 잘못된 payload여도 지시문은 나옵니다. 파일을 쓰지 않고, 네트워크를 건드리지 않으며, 세션 내용이 프로세스 밖으로 나가지 않습니다.

Codex는 같은 `hooks/hooks.json`을 읽고, `UserPromptSubmit` 이벤트와 같은 `additionalContext` 출력 필드를 지원합니다. Codex는 플러그인 동봉 훅을 현재 정의가 신뢰될 때까지 건너뜁니다 (설치 참조).

## 설치

Claude Code:

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install route@epistemic-protocols
```

Codex:

```
codex plugin marketplace add https://github.com/jongwony/epistemic-protocols.git
codex plugin add route@epistemic-protocols
```

그 다음 플러그인의 훅을 검토하고 신뢰하세요 — 플러그인 설치가 훅을 신뢰하는 것은 아니며, Codex는 플러그인 동봉 훅을 현재 정의가 신뢰될 때까지 건너뛰므로, 이 단계 전까지 매 프롬프트 지시문은 꺼져 있습니다:

```
/hooks
```

Codex는 훅 정의의 해시에 대해 신뢰를 기록하므로, 플러그인의 훅이 바뀔 때마다 이 단계가 반복됩니다.

## 사용법

훅이 일을 하므로 입력할 것은 없습니다. 현재 컨텍스트에 대해 같은 패스를 수동으로 돌리려면:

```
/route
```

## 저자

Jongwon Choi (https://github.com/jongwony)
