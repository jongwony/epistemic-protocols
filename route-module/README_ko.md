# Route Module — Route의 훅 모듈

Route의 트리거와 카탈로그를 셸 훅 대신 Claude Code 훅 모듈로 실현한 것. 세션을 지켜보다 `/route`를 부르며, 스스로 컨텍스트를 매칭하지는 않습니다.

> [English](./README.md)

## 무엇인가

[Route](../route)는 일을 둘로 나눕니다. **훅은 언제를 정하고, 스킬은 무엇을 정한다.** Route 자신의 `hooks/hooks.json`은 *언제*를 명령 훅 둘로 싣고, 플러그인 훅을 돌리는 호스트라면 어디서든 실행됩니다. 이 플러그인은 같은 *언제*를 TypeScript 모듈 하나 `hooks/route.ts`로 싣습니다. `hooks/hooks.json`의 `modules` 항목으로 로드되어, 이벤트마다 프로세스를 띄우는 대신 엔진 인터페이스(`$`) 위에서 돌아갑니다.

| 조각 | Route에서 (명령 훅) | 여기서 (훅 모듈) |
|------|---------------------|------------------|
| 카탈로그 | `SessionStart`, 컨텍스트 에포크마다 한 번, `source`로 판정 | `session.start`가 호스트에서 `scripts/catalog.mjs`를 실행하고, 그것이 Route의 설치 위치를 찾아 Route 자신의 `scripts/route-protocols.mjs`를 돌림. `prompt.context`가 테이블을 첫 메시지 컨텍스트의 블록 하나로 실어 나르고, 엔진은 컴팩션과 `/clear` 뒤에 이를 다시 읽음 |
| 지시문 | `UserPromptSubmit`, 매 프롬프트 | `prompt.submit`, 매 프롬프트, 모델은 읽고 사용자는 보지 않는 컨텍스트로 |
| 여는 문장 | `startup`과 `clear`에서 | 세션의 사용자 턴이 아직 몇 개 안 될 동안, 실제 턴 수를 읽어서 |
| 한 턴 건너뛰기 | — | 카탈로그 프로토콜에 `skill.prompt`가 발화하면 플러그인 스토어에 플래그를 두고, 다음 `prompt.submit`이 그것을 소비하며 지시문을 보내지 않음. 프롬프트 자체가 카탈로그 프로토콜을 호출하는 경우에도 보내지 않음 |

지시문과 여는 문장의 문구는 Route의 것과 같고, 테스트가 이를 고정합니다. 테이블의 내용은 Route의 파생 스크립트 하나가 원천이며, 이 플러그인은 그것을 찾아 돌릴 뿐입니다. 매칭은 `/route`에 남습니다.

왜 별도 플러그인인가: `modules` 항목을 가진 `hooks.json`은 모든 호스트가 읽는 파일이 아닙니다. Codex는 플러그인 `hooks/hooks.json`을 엄격한 스키마로 파싱하고(`codex-rs/config/src/hook_config.rs`의 `HooksFile`, `deny_unknown_fields`, 필드는 `description`과 `hooks`뿐), 모르는 키가 있으면 경고를 남기며 파일 전체를 버립니다 — 그 안의 명령 훅까지. Route 안에 두었다면 `modules` 한 줄이 Codex에서 Route를 꺼 버렸을 것입니다. 그래서 Route의 `hooks.json`은 호스트 중립으로 남고, 이 플러그인은 Codex 매니페스트가 없으며 Codex에 등록되지 않습니다.

## 켜기

Claude Code는 플래그 뒤에서만 훅 모듈을 로드합니다. 환경이나 `settings.json`의 `env`에:

```
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1
```

설치:

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install route-module@epistemic-protocols
```

매니페스트가 Route를 의존으로 선언하므로, 이 플러그인을 설치하면 같은 마켓플레이스의 Route가 함께 설치·활성화됩니다.

**이중 주입 없음.** 이 플러그인이 Route의 마켓플레이스에서 활성화되어 있고 플래그가 켜져 있는 동안, Route의 명령 훅 둘은 물러나고(exit 0, 아무것도 쓰지 않음) 이 모듈이 두 조각을 나릅니다. 플래그만으로는 물러나지 않습니다. 이 플러그인이 없으면 대신 나를 것이 없으므로 명령 훅은 계속 돕니다.

## 상태: 얼리 액세스, 문서화된 계약 아님

훅 모듈 API는 공식 hooks 레퍼런스, plugins 레퍼런스, settings 레퍼런스, 2.1.260 체인지로그 어디에도 없습니다. 유일한 계약은 실행 중인 빌드가 `/plugin-types`로 써내는 선언 파일(`claude-code.d.ts`)이고, 그 머리에는 릴리스 사이에 예고 없이 바뀔 수 있다고 적혀 있습니다. 이 모듈은 그 파일에 맞춰 타입이 붙어 있습니다.

실제로 뜻하는 것: **API가 바뀌면 이 모듈은 로드에 실패하고, 엔진은 디버그 로그에 그 사실을 남기며, 다른 무엇도 이를 대신하지 않습니다.** 플래그가 켜져 있고 이 플러그인이 활성화된 상태에서는 Route의 명령 훅이 물러나 있으므로, 플러그인을 끄거나 새 타입에 맞춰 모듈을 다시 만들 때까지 Route는 침묵합니다. 플러그인을 끄면 명령 훅이 즉시 돌아옵니다.

신뢰 속성은 주장이 아니라 확인 가능한 것입니다. `claude plugin validate route-module/`이 모듈이 거는 이벤트와 호출하는 것을 나열합니다 — `$.process.run`(node, 이 플러그인 자신의 스크립트), `$.session`, `$.store`. 네트워크도, 모델도, 파일 접근도 없습니다.

## 개발

```
claude --plugin-dir route-module --plugin-dir route --debug
```

디버그 로그에 모듈이 로드된 시점, 이벤트마다 정착한 시점, 엔진이 거부한 것이 남습니다. `/plugin-types`가 빌드의 선언을 `.claude/types`에 써냅니다. 고치지 말고 다시 생성하십시오. 이렇게 디스크에서 로드하면 플러그인이 설치 기록에 없으므로 `scripts/catalog.mjs`는 옆의 `../route` 체크아웃에서 파생 스크립트를 찾고, 그 파생은 그 체크아웃의 마켓플레이스에서 설치된 프로토콜을 찾지 못합니다 — `--plugin-dir` 세션에서는 테이블이 비고, 설치에서는 찹니다. 같은 이유로 그 세션에서는 Route의 명령 훅이 물러나지 않습니다 — 플러그인이 Route의 마켓플레이스에서 활성화된 것이 아니므로 — 그래서 디스크에서 로드한 세션은 지시문을 두 번 봅니다. 개발 루프의 모양이지 설치의 모양이 아닙니다.

## 저자

Jongwon Choi (https://github.com/jongwony)
