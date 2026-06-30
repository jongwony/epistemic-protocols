# Apokrypsis (ἀπόκρυψις) — /redact

> [English](./README.md)

작업 맥락을 산출·핸드오프·증류하기 전에, 그 안의 secret 형태 값을 redaction합니다 — 각 secret의 값은 감추되, 그 값을 다시 얻을 수 있는 retrieval 포인터는 보존합니다. front-door redaction pass + emit-scan backstop 구조: 모든 secret 값을 placeholder로 가로채고, command-substitution retrieval 명령은 보존하며, load-bearing secret은 drop하지 않고 out-of-band로 라우팅합니다.

## 타입 시그니처

```
(SecretExposed, AI, REDACT, WorkingContext) → RedactedContext
```

## 무엇을 하는가

외부로 내보내려는 작업 맥락은 secret 형태 내용을 담고 있을 수 있습니다 — credential, token, API key, private key, password, 그리고 command-substitution secret 참조. secret의 **값(value)** 이야말로 절대 전파되어서는 안 되는 단 하나입니다 — 이식 가능한 산출물로도, 새 수신자에게도. Apokrypsis는 각 secret 값을 그 `(item, location)`에서 가로채 placeholder로 치환하여 값이 어떤 산출 채널에도 도달하지 못하게 하면서, *retrieval locus*는 보존하여 필요한 secret을 out-of-band로 다시 얻을 수 있게 합니다.

이 morphism은 front-door pass를 실행하고, load-bearing secret을 게이트에서 표면화한 뒤, 실제 산출물을 재검사합니다:

- **Scan + Classify** — 모든 secret을 `(item, location)` 단위로 감지하고(한 item이 둘 이상의 secret을 담을 수 있으며 각각 별도로 keying), 종류별로 분류합니다: Credential, Token, ApiKey, PrivateKey, Password, CommandSubstitutionRef, 또는 명명된 집합이 포괄하지 못하는 emergent 형태.
- **Redact (front door)** — 각 secret 값을 candidate에서(소스가 아니라) placeholder `[REDACTED:{kind}@{location}]`로 치환합니다. command-substitution 형태(`$(vault read …)`)의 경우 그 형태 자체가 retrieval locus이므로, grounded 포인터로 보존하고 별도로 inline된 해소 값만 redaction합니다.
- **Out-of-band 처분 게이트** — **load-bearing** secret(선언된 next task가 실제로 필요로 하는 것)은 — 값이 아니라 kind·location·placeholder로 — 표면화하여 사용자가 라우팅하게 합니다: **Route**(안정 retrieval 포인터로), **Supply**(사용 시점 out-of-band 공급), 또는 **Drop**. 필요한 secret은 결코 조용히 drop되지 않습니다.
- **Emit-scan backstop** — *실제* candidate 산출물에서 빠져나간 값이 있는지 재검사합니다(감지 누락, 또는 redaction 이후 하류로 복사된 값). 포착된 값은 같은 게이트로 라우팅되며, 결코 조용히 재-redaction하지 않습니다 — 결정론적 재-redaction은 front door가 이미 놓친 바로 그 secret을 다시 놓칠 것이기 때문입니다.

**핵심 원리**: Value Never Emitted — secret 값은 어떤 산출 채널에도 도달하지 않으며, secret은 오직 kind·location·placeholder로만 표면화되고 값으로는 결코 표면화되지 않습니다. 그리고 Conceal over Erase — 값은 감추되 retrieval locus는 보존하므로, load-bearing secret은 소실되지 않고 out-of-band로 라우팅됩니다.

## 언제 활성화되는가

- 사용자가 `/redact` 호출 (Layer 1, 항상 가용) — 보통 `/distill` 또는 이식 산출 직전에.
- AI가 외부로 내보내려는 맥락에서 secret 형태 내용을 감지 (Layer 2, 무음 감지).

**`/distill`과의 합성**: `/distill`(Diylisis)은 **secret-free 작업 맥락**을 전제합니다 — secret redaction은 distill morphism의 일부가 아닙니다. Apokrypsis는 그 전제를 충족시키는 상류 pass입니다: 그 `RedactedContext`가 곧 `/distill`이 소비하는 secret-free 맥락입니다. `/redact`를 먼저, 그 결과에 `/distill`을 실행하십시오.

**Substrate 경계**: secret/credential 정책은 substrate-인접 영역입니다. Apokrypsis는 각 secret을 표면화·분류하고 그 처분을 기록하는 — 인식적(epistemic) 작업을 수행하지만, 외부 substrate 의미론을 강제하지는 않습니다: 값을 vault에 쓰거나, secret store를 변경하거나, credential을 전송하지 않습니다. Route / Supply는 수신자가 out-of-band로 해야 할 일을 기록할 뿐이며, 강제는 핸드오프로 위임됩니다. 이것이 Apokrypsis가 graph-node 프로토콜이 아니라 specialized 플러그인으로 패키징되는 이유입니다 — 프로토콜들과의 합성은 의존성-그래프 edge가 아니라 prose secret-free-context 계약입니다.

## 처분 Coproduct

게이트에서 표면화된 load-bearing secret은 세 가지 명명된 처분 중 하나로 라우팅됩니다 — 값은 어느 경우든 redaction된 상태로 남고, 처분은 수신자가 그것을 다시 얻는 방법을 라우팅합니다.

| 처분 | 의미 |
|------|------|
| **Route** | secret을 수신자가 out-of-band로 해소하는 안정 retrieval 포인터로 운반합니다(vault 경로, secret-store key, 보존된 command-substitution 형태). |
| **Supply** | 안정 포인터가 없음 — 수신자가 사용 시점에 out-of-band로 값을 공급합니다(env 주입, prompt-time secret); 핸드오프는 필요한 것을 명명할 뿐 값은 결코 명명하지 않습니다. |
| **Drop** | next task가 이 secret을 필요로 하지 않음; 해제합니다(placeholder는 표식으로 남고 값은 사라짐). |

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install apokrypsis@epistemic-protocols
```

## 사용법

```
/redact [선택: next-task]   # 작업 맥락이 증류·핸드오프되기 전에 secret 값을 redaction
```

## 라이선스

MIT
