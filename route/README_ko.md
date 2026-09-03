# Route — /route (실험적)

쌓인 세션 컨텍스트가 드러내는 결핍에 맞는 코어 epistemic 프로토콜로 라우팅하고, 그 프로토콜을 호출합니다.

> [English](./README.md)

**상태: 실험적.** 이 플러그인은 opt-in입니다 — 기본 설치 세트에 포함되지 않으며, 계약이 바뀌거나 폐기될 수 있습니다. `/probe`의 대체 후보입니다: 컨텍스트만으로 라우팅하는 방식이 실제 사용에서 유지되면, `/probe`가 이 스킬로 대체됩니다.

## Route란?

루프 위의 에이전트는 이미 로드된 모든 epistemic 프로토콜의 description을 들고 있고, 각 description은 그 프로토콜이 해소하는 상호작용 결핍을 명명합니다. 빠져 있는 것은 계기입니다 — 수동적인 description은 에이전트가 멈춰서 컨텍스트가 그 결핍 중 하나로 흘러갔는지 확인하게 만들지 못합니다.

Route가 그 계기를 공급합니다. `UserPromptSubmit` 훅이 매 프롬프트 옆에 짧은 지시문을 놓습니다 — *쌓인 컨텍스트가 로드된 프로토콜 하나가 해소하는 상호작용 결핍을 보이면 `/route`를 호출하라; 아니면 침묵하라; 프로토콜이 이미 활성 상태면 건너뛰라.* 그러면 `/route` 스킬이 로드된 description을 컨텍스트에 대조하고, 정확히 하나의 프로토콜 결핍이 컨텍스트가 보여주는 것일 때 그 프로토콜을 호출합니다. 호출된 프로토콜 자신의 Phase 0 감지와 첫 게이트가 사용자 판단의 자리로 남고, Route는 자기 게이트를 추가하지 않습니다.

| 결과 | 조건 |
|------|------|
| 프로토콜 호출 | 로드된 프로토콜 하나가 지배적으로 맞을 때 |
| 프로토콜별 넛지 한 줄 (`↗ /command — reason`) | 여럿이 맞거나, 하나뿐인 매치가 약할 때 |
| 침묵 | 아무것도 맞지 않을 때 — 가장 흔한 경우 |

### 다른 라우팅 표면과의 차이

| 표면 | 발동 시점 | 하는 일 |
|------|-----------|---------|
| `/catalog` 세션 시작 routing map | 세션 시작 | 정적 결핍 → 프로토콜 지시문을 한 번 주입 |
| `/probe` | 사용자 호출, 또는 결핍 모호성 감지 시 AI 제안 | 가설 둘 이상 제시; 사용자 인식이 라우팅을 구성 |
| `/route` | 훅으로 매 프롬프트, 또는 `/route` | 지배적 프로토콜 하나를 호출, 여럿이면 넛지, 없으면 침묵 |

## 훅이 주입하는 것

`hooks/hooks.json`은 `UserPromptSubmit` command 훅 하나, `scripts/route-prompt.mjs`를 등록합니다. 매 프롬프트마다 위 지시문을 `hookSpecificOutput.additionalContext`로 씁니다 — Claude Code와 Codex가 이 이벤트에 공통으로 받는 훅 wire 형태 — 그리고 0으로 종료합니다. stdin의 훅 payload는 읽지만 필수가 아닙니다; 비어 있거나 잘못된 payload여도 지시문은 나옵니다. 파일을 쓰지 않고, 네트워크를 건드리지 않으며, 세션 내용이 프로세스 밖으로 나가지 않습니다.

### Codex

Codex는 같은 `hooks/hooks.json`을 읽고, `UserPromptSubmit` 이벤트와 같은 `additionalContext` 출력 필드를 지원합니다. 잔여: 이 첫 cut에서는 Codex 소스에 대조해 확인했고, 실제 Codex 세션에서 실행해 보지는 않았습니다. Codex는 또한 플러그인 동봉 훅을 현재 정의가 신뢰될 때까지 건너뜁니다 (설치 참조).

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
