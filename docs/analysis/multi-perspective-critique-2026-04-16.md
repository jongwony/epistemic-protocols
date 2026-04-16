# Multi-Perspective Critique: Formalism, Runtime Fit, and Axiom Portability

2026-04-16 기준 저장소 기반 분석. 목표는 다음 3개 우려를 현재 저장소의 실제 구조와 대조해 평가하는 것이다.

1. 과도한 형식화로 인한 실제 런타임과의 괴리 위험
2. 엄밀성 중심 설계와 세션 속도/UX 사이의 trade-off
3. A-axioms 중심 설계의 과적합 및 맥락 portability 문제

이 문서는 먼저 현재 저장소만으로 독립 판단을 세우고, 마지막에 `docs/audit-2026-04-11.md`와 대조한다.

## 핵심 판단

| 우려 | 판정 | 이유 |
|---|---|---|
| 과도한 형식화 → 런타임 괴리 | 타당 | 정적 검증과 문서 일관성은 강하지만, 핵심 실행 루프 일부는 여전히 플랫폼 신호와 자연어 세션 조합에 의존한다. |
| 엄밀성 ↔ 속도/UX trade-off | 부분 타당 | 저장소가 비용을 인식하고 일부 완화 장치를 두고 있으나, 전역 latency budget이나 profile 분화는 없다. |
| A-axioms 과적합 | 부분 타당 | 고위험/계획 맥락에서는 강하지만, 탐색/창의 맥락에 대한 명시적 profile 분화가 부족하다. |

## 관측 사실

- `docs/verification.md`는 `structure`, `tool-grounding`, `spec-vs-impl`, `partition-invariant`, `gate-type-soundness` 같은 정적 검증 축을 정의한다.
- 2026-04-16에 `node .claude/skills/verify/scripts/static-checks.js .`를 실행한 결과 `fail = 0`, `warn = 7`이었다.
- 같은 결과에서 `prothesis/skills/frame/SKILL.md`의 `AgreementStrength`, `prosoche/skills/attend/SKILL.md`의 `DetectedDeficit`가 dead type 후보로 경고되었다.
- 같은 결과에서 `epharmoge/skills/contextualize/SKILL.md`, `anamnesis/skills/recollect/SKILL.md`는 gate-type-soundness 경고가 남아 있다.
- `.claude/rules/architectural-principles.md`는 inter-protocol data flow를 “Session Text Composition”으로 정의하고, structured transport를 의도적으로 채택하지 않았다고 밝힌다.
- `prothesis/skills/frame/SKILL.md`는 Phase 3의 operational cost가 선택된 관점 수 `|Pₛ|`에 비례해 증가한다고 명시한다.
- 같은 파일의 Known Limitations는 `IdleNotification`이 `SubagentStop` 이벤트 의미론에 의존하며, abnormal termination에서는 보장이 약하다고 적는다.
- `docs/co-change.md`는 gate interaction pattern이나 protocol change가 여러 파일과 version bump, `/verify`를 동반한다고 적는다.
- `syneidesis/README.md`는 이 프로젝트가 “intentional friction”을 설계 의도로 갖고 있음을 명시한다.
- `aitesis/skills/inquire/SKILL.md`는 `CodeDerivable < CanonicalExternal < Instrumentation < UserTacit` cost ordering을 도입해 user interrupt 비용을 줄이려 한다.
- `epistemic-cooperative/skills/compose/SKILL.md`는 늦은 gate 배치의 decision load 문제를 유효한 concern으로 인정하면서도 아직 해결되지 않았다고 적는다.

## Lens 1: 런타임/플랫폼 실현성

### 판단

형식 스펙이 완전히 공중에 떠 있는 것은 아니다. 다만 “실제 런타임에서 강제되는 부분”과 “호스트가 따라줘야만 성립하는 부분”이 같은 밀도로 서술되어 있어, 읽는 사람에게 보장 강도를 과대 인상시킬 위험이 있다.

### 근거

- 강한 쪽:
  - `docs/verification.md`와 `static-checks.js`가 formal block 일관성, cross-reference, partition invariant, precedence, gate/type alignment 일부를 실제로 검사한다.
  - `anamnesis/hooks/hooks.json`와 관련 스크립트는 SessionEnd, PreCompact, SubagentStop 훅을 실제 자산으로 가진다.
  - `docs/ci-review-pipeline.md`는 advisory-only limitation을 우회하기 위한 실제 CI 설계를 문서화한다.
- 약한 쪽:
  - `.claude/rules/architectural-principles.md`의 Session Text Composition은 프로토콜 간 전달을 구조화 데이터가 아니라 자연어 세션 문맥에 의존시킨다.
  - `prothesis/skills/frame/SKILL.md`는 `IdleNotification`, `SubagentStop`, abnormal termination ordering 같은 플랫폼 의미론을 전제하지만, 동일 파일의 Known Limitations에서 그 보장이 플랫폼별로 달라질 수 있음을 인정한다.
  - `prothesis/skills/frame/references/agent-teams-bp-applicability.md`는 일부 best practice를 “Environment-dependent”로 분류한다.

### 해석

- 현재 저장소의 load-bearing 핵심은 “프로토콜 전부의 실행 보장”이 아니라 “문서 구조와 검증 규율”이다.
- 즉, 이 프로젝트의 강점은 런타임을 완전히 formalize했다는 점보다, 런타임 의존 가정을 문서화하고 정적 drift를 줄이는 데 있다.
- 따라서 비판의 핵심은 “형식 스펙이 거짓이다”가 아니라 “보장 수준의 층위가 섞여 있다”에 가깝다.

## Lens 2: 제품/UX/채택성

### 판단

속도/UX trade-off 비판은 타당하지만, 이 저장소는 그 비용을 무시하지는 않는다. 문제는 비용을 인정하는 것과, 세션 유형별로 비용을 다르게 예산화하는 것은 별개의 일이라는 점이다.

### 근거

- `syneidesis/README.md`는 friction을 설계 목표로 공개적으로 채택한다.
- `prothesis/skills/frame/SKILL.md`는 독립 관점 수가 늘수록 tool call이 증가한다고 직접 적는다.
- 같은 파일의 `gate-reduction-delay` guard는 high-friction gating이 과도하게 지속될 수 있음을 설계자가 이미 인식하고 있음을 보여준다.
- `aitesis/skills/inquire/SKILL.md`는 lowest-cost valid source를 우선하는 규칙으로 불필요한 사용자 인터럽트를 줄이려 한다.
- `epistemic-cooperative/skills/dashboard/SKILL.md`와 `report/SKILL.md`는 friction 분석을 별도 지표로 다룬다.
- 반면 `epistemic-cooperative/skills/compose/SKILL.md`는 gate chain의 cumulative decision load를 아직 정식 모델링하지 못했다고 적는다.

### 해석

- 이 저장소는 “엄밀함이 느릴 수 있다”는 사실을 모르고 있는 것이 아니다.
- 다만 비용 인식이 아직 전역 정책으로 정제되지는 않았다.
- 현재 상태는 “비용을 측정할 도구와 언어는 있으나, 어떤 세션에서 얼마나 마찰을 허용할지 profile로 제어하지는 않는 상태”에 가깝다.

### 실무적 함의

- Dev/SRE 세션에서는 동일한 guard라도 “최소 인터럽트”와 “강한 게이팅”의 기대치가 다르다.
- 지금 구조는 safety-heavy posture에 더 최적화되어 있고, fast-path posture는 부분적 휴리스틱 수준에 머무른다.

## Lens 3a: Type Theory

### 판단

Type Theory 관점에서는 “완전한 형식 체계”라고 부르기보다 “강한 typed discipline을 지향하는 문서-검증 체계”라고 부르는 편이 더 정확하다.

### 근거

- 강점:
  - `MODE STATE`의 partition invariant는 실제 정적 검사 대상이다.
  - `Answer types`를 closed coproduct로 취급하고 gate-type-soundness를 검사하려는 시도는 문서 수준 타입 discipline으로 기능한다.
  - `spec-vs-impl` 검사는 dead type, rename drift, resolution mismatch를 줄이는 데 실제 효과가 있다.
- 한계:
  - 2026-04-16 static checks에서도 dead type 및 gate/prose mismatch 경고가 남아 있다.
  - `gate-type-soundness` pass 메시지 자체에 “0 matched to prose”가 여럿 포함되어 있어, 타입 선언과 prose gate가 항상 강하게 결속되지는 않는다.
  - `docs/audit-2026-04-11.md`가 지적했듯 현재 표기 중 일부는 MLTT 수준 생성자 discipline보다는 typed notation에 가깝다.

### 해석

- 이 프로젝트는 타입 이론을 실행 가능한 formal semantics로 구현했다기보다, 문서 drift를 줄이는 설계 언어로 차용하고 있다.
- 따라서 “type-like structure”라는 주장은 방어 가능하지만, “fully type-theoretic protocol calculus” 같은 강한 자기 설명은 과장될 수 있다.

## Lens 3b: Category Theory

### 판단

Category Theory 관점에서는 생산적인 구조 비유가 존재한다. 그러나 비유와 증명된 대응이 아직 엄격히 구분되지 않는다.

### 근거

- `docs/structural-specs.md`는 FLOW, MORPHISM, TOOL GROUNDING 사이의 관계를 구조적으로 설명한다.
- `.claude/rules/axioms.md`의 A4는 tool grounding을 natural transformation에 “analogous”한 것으로 설명하면서, rigorous formalization은 남아 있다고 명시한다.
- 같은 저장소 전반에서 `*` composition, product, morphism, convergence 같은 용어가 일관되게 쓰인다.
- 반면 `docs/audit-2026-04-11.md`는 COMPOSITION block이 placeholder에 가깝고, 일부 categorical vocabulary가 실제 binding 없이 사용된다고 비판한다.

### 해석

- 현재 categorical language는 설계자에게 유용한 compression layer다.
- 하지만 외부 독자에게는 “형식적 엄밀성”으로 읽히기 쉽다.
- 따라서 category theory는 이 저장소에서 “구성 원리의 비유적 압축”으로는 성공적이지만, “엄밀한 수학적 근거”로 제시되면 반격 지점을 남긴다.

## Lens 4: 철학/공리 portability

### 판단

A1/A2/A6/A7은 high-stakes planning, review, execution gating 맥락에서는 강하다. 그러나 exploration-heavy 연구, 창의적 설계, 느슨한 브레인스토밍 같은 맥락까지 동일 강도로 일반화하면 과보수적으로 작동할 수 있다.

### 근거

- `.claude/rules/axioms.md`는 A1-A7을 cross-cutting foundation으로 제시한다.
- `.claude/rules/architectural-principles.md`는 protocols와 built-ins를 분리하고 epistemic cost topology를 강조한다.
- 여러 protocol은 prior-pattern bias, pollution, gate judgment override를 인정한다.
- `README.md`/`README_ko.md`는 프로젝트를 “direction errors를 early stage에서 줄이는 도구”로 설명한다.
- `docs/audit-2026-04-11.md`는 실제 machinery가 README보다 더 큰 철학적/형식적 mission을 암묵적으로 수행한다고 지적한다.

### 해석

- 현재 axioms는 “어떤 세션 타입에서 얼마나 강하게 적용되는가”보다 “좋은 epistemic behavior의 보편 규칙”으로 서술된다.
- 이 방식은 안전성에는 유리하지만, 창의성이나 탐색성의 가치가 큰 세션에서는 과하게 마찰을 만들 수 있다.
- 특히 A1/A6은 대체로 넓게 유지 가능하지만, A7 guard intensity나 A5 gating density는 세션 타입별 profile이 필요하다.

## 수렴과 충돌

### 수렴하는 지점

- 여러 렌즈가 공통으로 지적하는 핵심은 “내부 정합성”과 “외부 보장 강도”가 동일하지 않다는 점이다.
- 런타임 lens와 Type lens는 모두 “정적 일관성은 강하지만 실행 의미론은 부분적으로 호스트 의존”이라고 수렴한다.
- UX lens와 portability lens는 모두 “현재 posture가 safety-heavy 쪽으로 기울어 있다”고 수렴한다.
- Type lens와 Category lens는 모두 “형식 언어가 설계 압축으로는 유효하지만, claim strength가 커질수록 반박 가능성도 커진다”고 수렴한다.

### 관점 의존적인 지점

- Runtime lens는 실제 훅과 스크립트, verify 파이프라인이 있기 때문에 “공허한 스펙”이라는 비판에는 동의하지 않는다.
- Category lens는 구조 비유 자체를 문제 삼지 않는다. 문제는 비유가 언제 formal claim처럼 들리는가에 있다.
- UX lens는 intentional friction을 본질적 결함으로 보지 않는다. 다만 friction budget 부재를 문제로 본다.

## 우선순위 실행안

### P0 즉시

- `runtime dependency ledger`를 추가한다.
  - 각 protocol의 핵심 추상 연산에 대해 `보장 수준`, `호스트 의존 primitive`, `실패 시 징후`, `fallback`을 1행씩 적는다.
  - 특히 `IdleNotification`, `SubagentStop`, hook write path, session-text transfer 같이 의미론이 약한 지점을 명시한다.
- `formal claim strength` 라벨을 도입한다.
  - `validated by static checks`
  - `host-dependent operational prose`
  - `heuristic or analogy`
- static checks 경고 7건을 먼저 소거한다.
  - dead type
  - gate/prose mismatch
  - TOOL GROUNDING 누락형 경고

### P1 구조 보완

- 세션 profile을 도입한다.
  - `strict`
  - `balanced`
  - `exploratory`
- profile별로 다음을 조정한다.
  - gate density
  - citation strictness
  - multi-perspective fan-out 상한
  - dismiss/relay 기본 posture
- friction telemetry를 강화한다.
  - gates per session
  - wait points
  - tool amplification
  - dismiss/withdraw 비율
  - high-friction loop duration

### P2 철학/표현 정리

- Type/Category vocabulary를 두 층으로 분리한다.
  - 설계 압축용 구조 언어
  - 엄밀 formal claim
- A-axioms를 core와 posture로 분리한다.
  - core 예시: A2 detection/authority, 일부 A1 recognition
  - posture-sensitive 예시: A5 gate density, A7 guard intensity
- README mission과 실제 machinery 사이를 잇는 bridge 문서를 둔다.
  - 현재 프로젝트가 plan-stage alignment tool인지
  - 아니면 broader epistemic interaction calculus인지
  - 이 구분이 있어야 “axiom portability” 논의도 정리된다.

## 반증 가능 시나리오

이 분석은 다음 시나리오에서 반증되거나 수정될 수 있다.

- 플랫폼 독립 실행 실험에서 Prothesis 팀 대기/종료 semantics가 여러 호스트에서 안정적으로 동일하게 재현되면, runtime 괴리 비판은 약해진다.
- session telemetry에서 strict gating이 Dev/SRE 세션에서도 friction보다 failure prevention 이득이 압도적으로 크다면, UX trade-off 비판은 약해진다.
- gate-type-soundness와 spec-vs-impl 검사가 prose mismatch까지 자동 봉쇄하게 되면, Type-theoretic 비판은 약해진다.
- exploration/creative 세션용 profile을 도입했는데도 창의성 저하가 관측되지 않으면, portability 비판은 일부 후퇴한다.

## 기존 감사와의 독립 대조

### 독립 수렴

- 이 문서도 `docs/audit-2026-04-11.md`와 마찬가지로 “프로토콜 실행 층이 자기 설명 층보다 강하다”는 결론에 수렴한다.
- A4/A4-adjacent runtime semantics가 platform dependency를 가진다는 점에서도 수렴한다.
- pre-formal vocabulary 또는 overclaim 위험이 있다는 지점에서도 수렴한다.

### 부분 수렴

- 감사 문서는 철학적 anchor와 formal vocabulary의 엄밀성 문제를 더 강하게 제기한다.
- 본 문서는 그보다 실무적으로, “보장 강도 라벨이 섞여 있다”는 표현으로 더 낮은 해상도의 결론을 낸다.

### 차이

- 본 문서는 UX/채택성 관점을 별도 축으로 더 강하게 다룬다.
- 감사 문서가 soundness와 self-description의 괴리를 root issue로 본다면, 본 문서는 `runtime guarantee`, `friction budget`, `axiom profile`의 3축을 실천적 root issue로 본다.

## Post-Analysis Updates

이 분석 작성 직후 저장소에는 다음 후속 조치가 반영되었다.

- `docs/mission-bridge.md`가 추가되어 README/landing의 public hook와 `CLAUDE.md`의 broader machinery framing 사이를 잇는 bridge가 생겼다.
- `CLAUDE.md`와 `docs/mission-bridge.md`는 mission/vision canonicality를 maintainer/contributor governance 범위로 한정하고, runtime user contract는 `SKILL.md`와 plugin description에 있음을 명시한다.
- `docs/co-change.md`에는 mission/vision wording 변경 시 audience boundary와 runtime dependency 누수를 함께 점검해야 한다는 규칙이 추가되었다.
- 따라서 본문 P2의 “bridge 문서를 둔다”는 항목은 더 이상 미실행 제안이 아니라 반영 완료된 조치다.

아직 남아 있는 후속 과제는 다음이다.

- `SKILL.md self-containment`를 source-level 규칙 준수만이 아니라 packaged `Skill.md`와 plugin metadata 기준의 artifact-level verification으로 검증하는 체계는 아직 없다.
- 따라서 self-containment는 현재 문서 규칙과 reviewer vigilance에 크게 의존하며, blind consumer audit 또는 artifact contract test는 후속 구현 과제로 남아 있다.

## 최종 결론

이 프로젝트의 잠재적 지적사항은 “형식화가 많다”는 사실 자체보다, 서로 다른 보장 수준이 같은 문체로 서술된다는 점에서 발생한다.

- 형식 스펙은 내부 일관성과 drift 억제에는 실제로 기여한다.
- 그러나 런타임 의미론 전체를 같은 수준으로 고정하는 것은 아니다.
- intentional friction은 설계 의도이지만, 세션 타입별 budget 없이 일반화되면 adoption friction이 된다.
- A-axioms는 강한 핵심을 갖고 있지만, 모든 작업 모드에 동일 강도로 portable하다고 보기에는 아직 profile 분화가 부족하다.

따라서 현재 가장 좋은 진전은 formalism을 버리는 것이 아니라, 보장 강도와 적용 posture를 더 정직하게 분리하는 것이다.
