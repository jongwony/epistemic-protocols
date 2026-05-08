# Matt Pocock Skills의 확장인지적 Grounding

> 이 문서는 [`mattpocock/skills`](https://github.com/mattpocock/skills)의
> 지침을 형식적 skill-to-protocol 대응표가 아니라, 지침이 전제하는 철학의
> 관점에서 분석한다. 중심 질문은 다음이다: Matt Pocock의 "small, composable
> skills"는 인간-AI 협업에서 어떤 인지적 관계를 보존하려 하는가?

---

## 결론

`mattpocock/skills`는 AI에게 더 많은 자율성을 주는 framework가 아니라,
인간이 통제권을 잃지 않으면서 AI를 확장된 인지 도구로 편입하기 위한
실용적 의식 절차에 가깝다. `epistemic-protocols`는 같은 구조를
`Relay/Constitution`, `BoundaryMap`, `Recognition`, `Applicability` 같은
철학적-형식적 구분으로 명시화한다.

따라서 두 프로젝트의 관계는 다음처럼 요약할 수 있다.

| 프로젝트 | 철학적 위치 |
|----------|-------------|
| `mattpocock/skills` | 확장인지의 실용 공학 |
| `epistemic-protocols` | 확장인지의 인식론적 형식화 |

---

## 1. Control 보존: framework가 아니라 constitution boundary

Matt Pocock repo의 README는 GSD, BMAD, Spec-Kit 같은 접근이 "process를
소유하면서 control을 빼앗고, process 내부의 bug를 해결하기 어렵게 만든다"고
비판한다. 그 대안으로 제시되는 것은 큰 orchestration framework가 아니라
작고, 적응 가능하고, 조합 가능한 markdown skill이다.

이 문제의식은 `epistemic-protocols`의 relay/constitution boundary와 직접
대응한다. `docs/philosophical-anchors.md`는 AI가 사용자의 확장인지 도구로
작동할 수 있는 영역과, 사용자의 구성적 판단이 돌아와야 하는 영역을
구분한다. Clark & Chalmers의 Extended Mind 논의도 인지가 두개골 내부에만
있지 않고, 환경과 도구가 인지 과정의 일부가 될 수 있음을 제안한다.

핵심은 "AI를 막자"가 아니다. 더 정확히는 다음이다.

> AI가 relay 가능한 곳에서는 강력한 도구가 되게 하되, constitutive judgment를
> 자동화 framework에 넘기지 않는다.

이 관점에서 Matt Pocock skills는 인간의 통제권을 유지하기 위한 anti-agent
전략이 아니라, AI를 신뢰 가능한 확장인지 도구로 배치하기 위한
constitution-preserving interface다.

---

## 2. Shared language: 용어집이 아니라 common ground substrate

Matt Pocock repo에서 `CONTEXT.md`와 `/grill-with-docs`가 중요한 이유는
agent가 project jargon을 해독하지 못하면 인간과 AI가 같은 말을 다르게
이해하기 때문이다. README는 agent가 프로젝트에 투입될 때 보통 jargon을
즉석에서 추론해야 하고, 그 결과 장황하고 불안정한 언어를 사용한다고 본다.

이 문제는 Domain-Driven Design의 ubiquitous language와 맞닿아 있다. Martin
Fowler는 Eric Evans의 ubiquitous language를 개발자와 사용자 사이에 구축되는
rigorous common language로 설명하고, domain model과 대화 속 언어가 함께
검증되고 진화해야 한다고 정리한다.

현상학/확장인지 관점에서 `CONTEXT.md`는 단순 정보 저장소가 아니다. 그것은
인간-AI dyad가 같은 대상을 같은 의미로 인식하도록 유지하는 외부화된
common ground substrate다. Clark & Brennan 계열의 grounding 이론에서도
common ground는 두 사람이 같은 정보를 갖는 것만이 아니라, 그 정보를 서로
공유하고 같은 방식으로 해석한다는 상호 인식이다.

따라서 `/grill-with-docs`는 "질문을 많이 하는 skill"이 아니라, 인간-AI
협업의 공유 지평을 계속 갱신하는 grounding loop다.

---

## 3. Typed categorical metalanguage: domain language들을 잇는 functorial bridge

위 대응만으로는 DDD의 Ubiquitous Language에 대한 `epistemic-protocols`의
대응이 충분하지 않다. `CONTEXT.md`와 BoundaryMap은 common ground의
외부화라는 점에서 1차 대응이지만, `epistemic-protocols`가 실제로 도입한
더 깊은 대응물은 **Type Theory / Category Theory를 결합한 typed categorical
metalanguage**다.

DDD의 Ubiquitous Language는 특정 bounded context 안에서 domain expert와
developer가 같은 모델을 같은 언어로 말하게 만든다. 반면 `epistemic-protocols`는
여러 domain language를 직접 하나로 합치려 하지 않는다. 대신 각 protocol의
`TYPES`, `FLOW`, `MORPHISM`, `PHASE TRANSITIONS`, `CONVERGENCE`를 통해
도메인별 언어가 어떤 구조를 보존하며 변환되는지 명시한다.

이 구분은 다음처럼 볼 수 있다.

| 층위 | 역할 |
|------|------|
| Ubiquitous Language | 한 bounded context 내부의 shared semantic vocabulary |
| Type Theory | 그 vocabulary가 허용하는 값, 응답, 전이의 local grammar |
| Category Theory | 서로 다른 local grammars 사이의 구조 보존 mapping |

따라서 "Type Theory / Category Theory가 Ubiquitous Language에 대응된다"는
직관은 방향이 맞지만, 더 정확히는 다음과 같다.

> Type Theory와 Category Theory는 또 하나의 domain language가 아니라,
> domain languages 사이의 번역 가능성과 구조 보존을 검증하는 common
> metalanguage다.

이 프로젝트 내부에서도 그 흔적은 분명하다. `design/morphism-extraction.md`는
FLOW와 MORPHISM 사이를 forgetful functor로 설명한다. FLOW는 operational
category에 가깝고, MORPHISM은 epistemic category에 가깝다. forgetful functor는
tool annotation과 computational intermediate를 버리고, 핵심 type transition만
보존한다. `docs/structural-specs.md`도 MORPHISM을 FLOW의 image로 설명하며,
FLOW의 세부 실행 구조를 잊고 essential type transition skeleton을 남기는
관계로 정리한다.

이 관점에서 Analogia의 "domain 사이의 functor"는 단순 비유가 아니다. DDD의
domain term이 `Order`, `Shipment`, `Cancellation`이라면, `epistemic-protocols`의
protocol term은 `Decision`, `Gap`, `BoundaryMap`, `ValidatedMapping`이다.
AI 협업에서 필요한 것은 단어 치환이 아니라, 한 domain language의 관계와
제약이 다른 domain language로 넘어갈 때 무엇이 보존되는지 확인하는 일이다.

예를 들어 `materialization cascade` 같은 project-local term은 단어 자체로는
다른 프로젝트에 이식되지 않는다. 그러나 그 term이 가리키는 구조가
"상태 변화가 하위 artifact 생성으로 전파되는 관계"라면, Analogia는 그 구조가
현재 concrete domain에서도 대응되는지 검증할 수 있다. 이때 category-theoretic
언어는 "같은 단어인가"가 아니라 "관계가 보존되는가"를 묻는 compression layer가
된다.

단, 이 언어는 엄밀한 수학적 증명으로 과잉 주장되어서는 안 된다. 기존
`multi-perspective-critique`도 현재 categorical language가 설계자에게 유용한
compression layer로는 성공적이지만, 완전한 수학적 근거로 제시되면 반격 지점을
남긴다고 본다. 그러므로 이 프로젝트에서 Category Theory의 적절한 지위는
formal proof가 아니라 **structure-preserving design discipline**이다.

---

## 4. Feedback loop: relay 가능성을 만드는 감각기관

Matt Pocock repo의 또 다른 핵심 전제는 "feedback 없이 agent는 flying blind"라는
것이다. `/diagnose`는 첫 단계로 feedback loop 구축을 요구하고, 그 loop가
debugging의 대부분이라고 말한다. `/tdd`는 red-green-refactor를 통해 한 번에
하나의 observable behavior만 전진하게 만든다.

Pragmatic Programmer의 "small deliberate steps" 원칙과도 같은 축에 있다.
작은 단계, feedback, 조정은 불확실한 미래를 점치지 않고 현재 확인 가능한
증거로 전진하는 방법이다. Simon Willison의 agentic engineering pattern도
red/green TDD가 coding agent에 잘 맞는 이유를 같은 방식으로 설명한다:
테스트가 먼저 실패하는 것을 보고, 구현 뒤에는 같은 테스트가 통과하는 것을
확인한다.

`epistemic-protocols` 언어로 바꾸면 feedback loop는 Relay 가능성을 성립시키는
조건이다. AI가 "감"으로 실행하면 constitution을 침범하지만, 재현 가능한
pass/fail loop가 있으면 AI의 행동은 검증 가능한 extension으로 내려온다.

그러므로 `/diagnose`, `/tdd`, `/prototype`은 단순한 개발 방법론이 아니다.
그것들은 AI-as-tool이 blind generation에서 evidence-guided relay로 전환되는
감각기관이다.

---

## 5. Small/composable skills: attention hygiene

Matt Pocock의 "small, easy to adapt, composable"은 단순 취향이 아니다.
확장인지 관점에서 도구는 workspace 안에 들어오는 순간 인지 비용을 만든다.
`docs/philosophical-anchors.md`의 Epistemic Cost Topology는 사용되지 않은
protocol도 marginal attention을 점유한다고 본다. 도구가 reliable availability를
갖는 순간, 그것은 호출되지 않아도 확장된 인지장 안의 가능성으로 존재한다.

이 관점에서 큰 agent framework의 문제는 기능이 많다는 점 자체가 아니다.
문제는 사용자의 인지 공간에 너무 많은 불명확한 가능성과 숨은 process를 올려
놓는다는 점이다. 반대로 작은 slash skill은 다음 성질을 가진다.

- 필요할 때만 호출된다.
- scope가 국소적이다.
- 실패 양상이 비교적 보인다.
- 사용자가 skill 자체를 수정하거나 버릴 수 있다.

따라서 small/composable skill은 "간단해서 좋다"가 아니라, 확장된 인지 공간에
올리는 도구의 attentional footprint를 작게 유지하는 attention hygiene이다.

---

## 6. 구조적 대응

| Matt Pocock의 실천 명제 | 철학적 의미 | `epistemic-protocols` 대응 |
|--------------------------|-------------|-----------------------------|
| Process가 control을 빼앗으면 안 된다 | 구성적 판단은 framework에 양도될 수 없다 | Constitution boundary |
| Shared language가 필요하다 | 인간-AI dyad의 common ground가 필요하다 | Horismos, Anamnesis, BoundaryMap |
| Domain languages를 연결해야 한다 | 구조 보존 번역을 위한 metalanguage가 필요하다 | TYPES, MORPHISM, Analogia, functorial mapping |
| Feedback loop가 없으면 agent는 blind하다 | Relay는 evidence와 entropy 감소에 의존한다 | Aitesis, Prosoche, Epharmoge |
| Prototype으로 설계를 확인한다 | 추상 설계를 감각 가능한 artifact로 만든다 | Analogia, Epharmoge |
| Skills는 small/composable해야 한다 | 확장인지 workspace의 오염을 줄인다 | Epistemic Cost Topology |

---

## 7. Rules 작성 판단

Type Theory / Category Theory 도입 이유를 `.claude/rules`에 새 규칙으로
작성할지는 신중해야 한다. 현재 판단은 **새 auto-loaded rule을 만들지 않는
것이 맞다**.

이유는 세 가지다.

1. **이미 충분한 규칙 표면이 있다.** `.claude/rules/axioms.md`의 A4는
   Semantic Autonomy를 설명하면서 abstract epistemic operation과 platform
   realization 사이의 structure-preserving mapping을 언급한다. A5는 interaction
   factorization을 통해 gate의 추상/실현 분해를 다룬다.
2. **구체적 편집 기준은 이미 `docs/structural-specs.md`에 있다.** TYPES,
   FLOW, MORPHISM, PHASE TRANSITIONS의 관계는 contributor-facing structural
   specification으로 충분히 운영 가능하다.
3. **Epistemic Cost Topology상, 새 rule은 cognitive pollution을 만든다.**
   Category/Type Theory는 매 turn 자동 적용되어야 하는 사용자-facing 원칙이
   아니라, protocol authoring과 verification 때 호출되는 contributor-facing
   설계 언어다.

따라서 적절한 위치는 `.claude/rules`가 아니라 다음 중 하나다.

| 위치 | 판단 |
|------|------|
| `docs/analysis/` | 현재처럼 철학적/역사적 grounding을 보관하기에 적합 |
| `docs/structural-specs.md` | 편집 기준으로 안정화된 경우 적합 |
| `.claude/principles/architectural-principles.md` | 반복적으로 authoring 판단에 쓰이면 lazy-loaded principle로 승격 가능 |
| `.claude/rules/axioms.md` | 매 turn 필요한 foundation이 되었을 때만 적합 |

현재는 이 분석 문서에 보관하고, 이후 protocol 편집에서 같은 판단이 반복되면
`.claude/principles/architectural-principles.md`에 짧은 lazy-loaded 원칙으로
승격하는 경로가 가장 안전하다. 원칙 후보는 다음 정도로 압축할 수 있다.

> Typed Categorical Metalanguage: Type Theory specifies local protocol grammar;
> Category Theory specifies structure-preserving translation between protocol
> grammars. Use this language as authoring discipline, not as proof rhetoric.

---

## 8. 대응이 약한 지점

이 대응은 강하지만, 두 프로젝트가 같은 일을 한다는 뜻은 아니다.

1. Matt Pocock skills는 철학을 명시하지 않고 실천 규칙으로 압축한다.
   `/diagnose`는 "feedback loop"를 말하지만, 그것을 relay/constitution
   boundary로 형식화하지 않는다.
2. `epistemic-protocols`는 철학적 구분을 명시적으로 protocol boundary와
   morphism으로 만든다. 그만큼 더 무겁고, 잘못 호출되면 cognitive pollution이
   발생할 수 있다.
3. Matt Pocock 쪽의 강점은 낮은 의식 비용과 즉시성이다. epistemic-protocols의
   강점은 결핍 유형과 판단 권한을 명확히 구분하는 설명력이다.

따라서 두 프로젝트의 관계는 복제가 아니라 상보성이다. Matt Pocock skills는
실천적으로 이미 작동하는 extended-cognition workflow이고,
`epistemic-protocols`는 그 workflow가 왜 작동하는지, 어디서 멈춰야 하는지,
어느 판단을 사용자에게 되돌려야 하는지를 설명하는 형식적 언어를 제공한다.

---

## Source Notes

### 프로젝트 내부 근거

- `docs/philosophical-anchors.md`: relay/constitution boundary, Extended Mind,
  Epistemic Cost Topology, Anamnesis의 recognition grounding. Clark & Chalmers
  (1998) 1차 인용 포함.
- `docs/analysis/horismos-philosophical-foundations.md`: BoundaryMap과 common
  ground, transactive memory, cognitive labor 분배. §3에 Clark & Brennan
  (1991) *Grounding in Communication* 1차 인용 포함.
- `design/morphism-extraction.md`: Type Theory / Category Theory 관점에서
  FLOW와 MORPHISM의 관계를 검증한 설계 결정 이력.
- `docs/structural-specs.md`: formal block anatomy와 FLOW-MORPHISM 관계.
- `.claude/rules/axioms.md`: A4 Semantic Autonomy와 A5 Interaction Kind
  Factorization.
- `.claude/principles/architectural-principles.md`: Session Text Composition과
  functor composition escalation path.

### 외부 근거

- [`mattpocock/skills`](https://github.com/mattpocock/skills): 원 repo README,
  small/composable skills, control 보존, shared language, feedback loop.
  - [`skills/engineering/diagnose/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/engineering/diagnose/SKILL.md):
    feedback loop를 debugging의 핵심으로 둔다.
  - [`skills/engineering/tdd/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md):
    public interface를 통한 behavior verification과 vertical red-green loop.
  - [`skills/engineering/grill-with-docs/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md):
    glossary, ADR, code cross-reference를 통한 shared language 갱신.
- Clark, A. & Chalmers, D. (1998). The Extended Mind. *Analysis*, 58(1), 7–19.
  Active externalism과 환경의 인지적 역할의 정전 — `philosophical-anchors.md`
  §A2 참조.
- Clark, H.H. & Brennan, S.E. (1991). Grounding in Communication. In Resnick,
  Levine, & Teasley (Eds.), *Perspectives on Socially Shared Cognition*
  (pp. 127–149). APA — common ground 이론 1차 인용은
  `horismos-philosophical-foundations.md` §3 참조.
- [Martin Fowler, Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html):
  DDD의 common rigorous language와 domain model 검증.
- [Pragmatic Programmer Tips](https://pragprog.com/tips/): small steps,
  feedback, requirements learning loop.
- [Simon Willison, Red/green TDD](https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/):
  coding agent와 red/green TDD의 적합성.
- [Common Ground at Scale](https://www.designative.info/2026/03/14/common-ground-at-scale-maintaining-shared-understanding-when-agents-mediate/):
  AI-mediated collaboration에서 grounding과 shared understanding의 중요성.
