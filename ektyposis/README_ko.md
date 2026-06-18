# Ektyposis (ἐκτύπωσις) — /realize

> [English](./README.md)

이식 가능한 인식적 본질(portable epistemic essence)을 특정 대상 기질(substrate)의 고유 산출물(native artifact) 형태로 실현(realize)합니다. 기질의 산출물 형태와 primitive 인벤토리를 grounding하고, 본질의 각 구조 요소를 그 형태로 projection(구조 보존 — 템플릿 치환이 아님)하며, 가용하지 않은 기질 primitive 각각을 silent approximation이 아니라 명시적 degradation으로 기록합니다.

## 타입 시그니처

```
(ProjectionUnformed, AI, REALIZE, PortableEssence × TargetReference) → RealizedArtifact
```

## 무엇을 하는가

이식 가능한 인식적 본질 — 어떤 역량의 기질-무관 기능적 역할(functional role)이자 `/distill`이 산출하는 종류의 객체 — 은 자신의 포인터를 dereference하고 같은 primitive를 공유하는 수신자에게는 그대로 건넬 수 있습니다. 그러나 어떤 기질은 dereference하지 못하거나(canonical source를 읽지 못함), 본질의 단계가 의존하는 primitive를 결여합니다(codebase read 없음, shell 없음, file write 없음, subagent 없음, 구조화된 state 없음). 그런 기질에는 본질을 그대로 건넬 수 없습니다 — 기질 고유의 산출물 형태로 **실현(realize)** 해야 합니다.

이 morphism은 F0~F4를 한 번 정방향으로 실행하며, Adjust 시 제한된 재-projection을 수행합니다:

- **F0 — Bind**: unformed projection을 감지하고, relay-to-distill 체크를 수행한 뒤, 이식 가능한 본질(그 기능적 역할)과 대상 기질 참조를 바인딩합니다.
- **F1 — Ground + 스키마 도출**: 기질의 고유 산출물 형태와 primitive별 가용성(`Available` / `Unavailable(why)`)을 획득한 뒤, 산출물이 요구하는 구조를 도출합니다.
- **F2 — 구조 보존 projection**: 각 본질 요소(morphism step, gate, answer constructor, convergence 조건, tool-grounding op, invariant)를 기질 산출물의 대응 요소로 렌더링합니다 — 구조적 관계를 보존하며, 일반 템플릿을 치환하지 않습니다.
- **F3 — 검증 + degradation 선언**: 가용하지 않은 primitive 접촉 각각을 **FAIL**(프로토콜 정체성 또는 convergence 조건을 건드림)과 **DEGRADE**(증거 풍부도 또는 state-tracking만 감소)로 분류하고, 모든 간극을 degradation ledger에 기록합니다. 이 ledger는 이 기질에서 Outcome Equivalence가 국소적으로 깨지는 지점의 명시적 기록입니다.
- **F4 — Emit**: 구조 보존 trace와 degradation ledger를 동반한 terminal 기질-고유 산출물을 산출합니다.

**핵심 원리**: Structure-Preserving Projection over Template Substitution, 그리고 Declared Degradation over Silent Approximation — 실현된 산출물은 본질의 역할을 재현하며, 모든 간극은 기록됩니다.

보존되는 본질은 **기능적·구조적이며 플라톤적이지 않습니다**: 실현들을 가로질러 carry되는 것은 역할(role functionalism / multiple realizability — Putnam 1967; Fodor 1974)이며, 이는 프로젝트가 Semantic Autonomy와 Outcome Equivalence에서 취하는 입장과 동일합니다.

## 언제 활성화되는가

Ektyposis는 **Hybrid** initiator입니다: 사용자 신호와 AI 감지 양쪽이 시작할 수 있으며, AI-감지 트리거는 활성화 전 한 줄 확인을 표면화합니다.

- 사용자가 `/realize` 호출 (Layer 1, 항상 가용)
- AI가 unformed projection을 감지 — 이식 가능한 본질이 비-읽기(non-reading) 또는 capability-degraded 기질로 옮겨지기 직전 (Layer 2, 무음 감지 + 확인)

## 경계 (distill ↔ realize)

`/distill`은 자신의 포인터를 dereference할 수 있고 capability-compatible한 수신자를 위한 reference-tolerant 이식 본질(**hub**)을 산출합니다. `/realize`는 그 하나의 본질을, source를 읽지 못하거나 이식 형태의 primitive를 결여한 기질로 projection하는 per-substrate **spoke**입니다.

판별 축: `can_consume_portable_handoff_directly(target) ≡ source-dereferencing(target) ∧ capability-compatible(target, essence)`. 성립하면 `/realize`는 skip하고 `/distill`로 relay합니다(레포를 읽을 수 있는 Claude 세션은 `/distill`을 씁니다). 성립하지 않으면 — Dia 브라우저 같은 비-dereferencing 또는 capability-degraded 기질 — `/realize`가 활성화되어 projection합니다.

합성은 단방향입니다: `/distill → /realize`. realize 산출물은 **terminal** 기질 산출물로, 결코 재-distill되거나 재-realize되지 않습니다 — 갱신이 필요하면 canonical source에서 재유도합니다(`realize` codomain ∩ `distill` domain = ∅). `/distill`과의 관계는 suppression이 아니라 **advisory**(상보적 결핍)입니다.

## Degradation Ledger

실현은 구조가 보존되고 모든 간극이 선언될 때 faithful합니다. 본질이 필요로 하지만 기질이 결여한 primitive 각각에 대해, ledger는 primitive, 가용하지 않은 이유, 선언된 degradation, severity를 기록합니다:

| Severity | 의미 | 효과 |
|----------|------|------|
| **FAIL** | 가용하지 않은 primitive가 프로토콜 정체성 또는 convergence 조건을 건드림 | 실현은 `Failed`; Redirect로 편향(또는 사용자가 구성한 known limitation) |
| **DEGRADE** | 가용하지 않은 primitive가 증거 풍부도 또는 state-tracking만 감소시킴 | 기록됨; 산출물은 선언된 간극과 함께 emit 가능 |

가용하지 않은 primitive의 silent approximation은 금지됩니다 — ledger는 이 기질에서 Outcome Equivalence가 국소적으로 깨지는 정확한 지점의 명시적 기록입니다.

## 기질 서브타입

`RealizedArtifact`가 핵심 resolution 타입입니다. 기질별 서브타입(핵심 타입 아님):

- **PromptArtifact** — `/forge` 유틸리티가 실현하는 prompt family. 그 아래 **InitialPrompt**(후속 세션/도구용 prompt)와 **DiaRecipeInstruction**(Dia 브라우저 skill 형태: `{ name, description, body }`, Dia 저장소는 file/CLI/deeplink import가 없어 수동 UI 붙여넣기로 적용).

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install ektyposis@epistemic-protocols
```

## 사용

```
/realize [본질 + 대상 기질]   # 이식 가능한 본질을 기질의 고유 산출물로 실현
```

## License

MIT
