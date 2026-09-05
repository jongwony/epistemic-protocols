# Epistemic Cooperative (epistemic-cooperative)

프로토콜 학습, work-unit triage, 결정 지점 유틸리티.

> [English](./README.md)

## Epistemic Cooperative란?

인식론적 프로토콜 온보딩, 작업 orchestration, 그리고 결정 지점 유틸리티에 걸친 유틸리티 플러그인이다. 시작하는 자리이면서 — 체험 기반 프로토콜 학습, 이슈에서 형성하는 focused work unit — 동시에 몇몇 스킬은 그 자신의 특정 결정 지점에서 작동한다: 지시문 배치 감사, 초안된 게이트의 옵션 집합 검사, 리뷰를 수렴까지 끌고 가기.

### 스킬

| 스킬 | 목적 | 출력 |
|------|------|------|
| `/onboard` | 빠른 추천 + 프로토콜 학습 | 터미널 기반 가이드 경험 |
| `/probe` | 결핍 인식 fit review — 역증거 조건이 붙은 복수의 결핍 가설을 제시하고 사용자 인식으로 라우팅 | 프로토콜 route |
| `/triage` | GitHub 이슈 기반 work-unit triage | routed work unit, 기판 레코드로 외재화 후 포인터로 전달 |
| `/forge` | 레퍼런스-grounded prompt-artifact 형성 | prompt artifact (후속 세션/도구용 initial prompt, 또는 상주 custom-skill recipe) |
| `/reduced-space-test` | bounded 대리 공간에서의 scoped 실증 검증 | scoped resolution + carried residual |
| `/review-loop` | source-agnostic 코드/PR 리뷰-resolve 루프 — 프로젝트가 표방한 목표로 아티팩트를 수렴 | 적용된 수정 + 인계 + 수렴 trace |
| `/place` | 배치 감사 — 지시문 산문의 절 각각을 다섯 목적지(로드 계층 셋, ledger, 삭제) 중 하나로 라우팅하고 집행 축을 설정 | 라우팅 보고서 — 라우트 블록 + 리포트 수준 발견 (읽기 전용) |
| `/gate-check` | 자문 검증 결정 게이트 — 독립 판정자가 작업이 아니라 초안 옵션 집합 자체를 판정하고, 그 인용 근거를 검증한 뒤에야 사용자에게 도달 | 초안대로의 게이트, 릴레이로 제시되는 확정 옵션, 재구성된 옵션 집합, 또는 검사가 닫지 못한 경우 수리 공간·다툼 있는 읽기·어느 쪽도 답이 아닌 두 집합 |
| `/white-bear` | 프로즈 감사 — 불필요한 경쟁-대상 언급 (금지 프레이밍, 대체된-경로 언급, 부정 앵커링) | JSON findings (읽기 전용) |
| `/zero-shot` | 프로즈 감사 — 앵커링 예시 대신 원칙 진술 | JSON findings (읽기 전용) |
| `/steer` | 프로젝트 프로필 재조정 — 세션의 calibration drift 를 감사하고 cluster 별 사용자 verdict | 갱신된 project-profile 규칙 + settled-direction 절 |
| `/realign` | 3-horizon 융합으로 프로젝트 가이드 direction line 도출 | 프로젝트 가이드에 기록된 fused direction line |
| `/goal-research` | 백그라운드 Codex CLI 세션에 위임한 리서치 (`goal` 범위 설정 + Aitesis 검증) | 되돌려 받은 리서치 trace |

## 스킬

### /onboard — 빠른 추천 + 프로토콜 학습

최근 세션 기반 빠른 추천으로 시작하고, 원하면 가이드 학습으로 이어간다.

```
Quick Proof:    ENTRY → QUICKSCAN → PICK-1 → EVIDENCE → TRIAL → INSIGHT → NEXT
Targeted:       ENTRY → QUICKSCAN → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
Targeted + std: ENTRY → SCENARIO → TRIAL → QUIZ → GUIDE
```

| 단계 | 설명 |
|------|------|
| 0. Entry | 경로 선택: 빠른 추천 / 특정 프로토콜 학습 / 전체 둘러보기 |
| 1. Quick Scan | 최근 세션 메타데이터를 인라인으로 수집 (Glob + Read) |
| 2a. Pick-1 | Quick path: `/elicit`, `/inquire`, `/frame` 중 1개 추천 선택 |
| 2b. Evidence | Quick path: 근거 카드 1개 표시 (최대 2줄) |
| 2. Map | Targeted path: 컴팩트 매핑 테이블로 프로토콜 매칭 |
| 3. Scenario | Targeted path: 프리셋 시나리오로 개입 지점 제시 |
| 4. Trial | 미니 연습 프롬프트로 실제 프로토콜 실행 |
| 5. Quiz | Targeted path: 소크라테스식 프로토콜 인식 문제 |
| 6. Guide | Targeted path: 학습 요약 + 다음 프로토콜 제안 |

주요 특징:
- **학습보다 가치 증명 먼저**: quick path는 3분 이내에 가치를 체감
- **한 번에 하나만**: 추천 1개, 근거 카드 1개, 체험 1회 — 카탈로그 불필요
- **Onboarding Pool**: `/elicit`, `/inquire`, `/frame` — Quick 추천 + Targeted 폴백 통합
- 실제 프로토콜 시험 실행 (프로토콜당 2-3 교환)
- Targeted path는 전체 학습 경험 유지 (시나리오, 퀴즈, 가이드)

### /triage — Work-Unit Formation

GitHub `RawIssueSet`을 그룹화하고, 각 issue group을 공유 problem frame으로 normalize한 뒤, 현재 세션에서 active `AGENTS.md` northstar와 융합해 focused work unit을 형성한다. 사용자가 route를 선택하면 `/triage`는 각 routed unit을 기판 레코드로 외재화하고 수신 세션에 그 레코드의 항해 블록을 건넨다. 이슈 범위 없이 `/triage`만 호출하면 현재 repository의 open backlog에서 시작하고, full issue substrate를 읽기 전에 triage load를 판정한다.

```
RAW ISSUES → GROUP → NORMALIZE → NORTHSTAR FUSION → WORK UNIT → ROUTE → EXTERNALIZE (WorkUnitRecord) → POINT
```

주요 특징:
- bare `/triage`는 open-backlog metadata intake를 먼저 수행한 뒤 issue load, repo load, mapping load, intent ambiguity로 small / medium / large posture를 판정한다.
- label만이 아니라 problem pressure 기준으로 similarity grouping
- 기본은 `IssueGroup -> FocusedWorkUnit` 1:1, northstar fusion 중 실행축이 갈라질 때만 split
- route choice는 현재 세션에서 사용자가 결정: independent session, re-triage
- independent session으로 routed된 unit은 레코드를 외재화하고 포인터로 전달; re-triage는 레코드를 외재화하지 않음

### /forge — Reference-Grounded Prompt-Artifact Formation

대상 레퍼런스 문서(벤더 모델 prompt guide, Codex Goals 스펙)를 읽고, 사용자의 미명세 의도를 modality-aware IR로 역귀납한 뒤, canonical-external 동적 fetch + staleness guard로 레퍼런스에 grounding하고, 후속 세션/도구용 prompt artifact(후속 세션/도구용 initial prompt, 또는 상주 custom-skill recipe)를 projection한다.

```
ReferenceIntake → ResolvedIntentIR → GroundedReference → VendorPromptDraft → PromptArtifact
```

주요 특징:
- 벤더-무관 core(의도 IR + staleness 정책) + 인자화 adapter seam; Higgsfield·gpt-image·codex-goals·claude-session·dia 어댑터 동봉
- core는 IR까지; 산출물 형태는 adapter-결정(core 승격 금지)
- relay 슬롯 인용·constitution 슬롯 플래그된 채워진 초안 — 빈 질문 목록도 맹목 완성초안도 아님
- 교차-adapter 추상은 의도적으로 유예된 colimit(triage-gated-vendor-harness의 형제), 누적 사용 전 미추출

### /reduced-space-test — Scoped Empirical Validation

추론만으로 불확실한 명제(동작/성능/전이/가치)를 사용자와 동기화한 constraint-bounded 대리 공간에서 검증하고, 미커버 여집합을 후속 프로토콜로 carry-forward한다. 핵심 행위는 목표↔대리 동등성 주장을 검증가능한 facet으로 분해하는 것 — 대리 공간을 "만드는" 것이 아니다.

```
ClaimIntake → ScopedClaimFrame → BoundedTestSpace → EmpiricalEvidence → ScopedResolution → CarriedResidual
```

주요 특징:
- orchestration 유틸리티(`/bound` + `/inquire` 합성, 조건부 `/elicit`·`/induce` front); 새 프로토콜·graph 노드 없음
- constraint sync는 Constitution 상호작용 — 사용자가 그은 경계가 검증가능한 claim을 구성
- scoped claim 전용 — 절대 동등성이 아니라 정의된 조건 범위 내 실패확률 저감
- residual 여집합은 1차 산출물로 후속 프로토콜에 라우팅

## 아키텍처

```
epistemic-cooperative/
├── .claude-plugin/plugin.json
└── skills/
    ├── onboard/SKILL.md          # /onboard 퀘스트 기반 프로토콜 학습
    ├── probe/SKILL.md            # /probe 결핍 인식 fit review
    ├── triage/SKILL.md           # /triage work-unit formation
    ├── forge/SKILL.md            # /forge reference-grounded prompt-artifact formation
    ├── reduced-space-test/SKILL.md  # /reduced-space-test scoped empirical validation
    ├── review-loop/SKILL.md      # /review-loop 수렴 페이스 리뷰-resolve 루프
    ├── place/SKILL.md            # /place 지시문 산문 배치 감사
    ├── gate-check/SKILL.md       # /gate-check 자문 검증 결정 게이트
    ├── white-bear/SKILL.md       # /white-bear 경쟁-대상 언급 프로즈 감사
    ├── zero-shot/SKILL.md        # /zero-shot 앵커링 예시 프로즈 감사
    ├── steer/SKILL.md            # /steer 프로젝트 프로필 재조정
    ├── realign/SKILL.md          # /realign 프로젝트 가이드 direction line 융합
    └── goal-research/SKILL.md    # /goal-research Codex 위임 리서치
```

## 사용 시기

| 상황 | 스킬 |
|------|------|
| 인식론적 프로토콜이 처음일 때 | `/onboard` |
| 체험을 통한 프로토콜 학습 | `/onboard` |
| 워크플로우 변경 후 재평가할 때 | `/onboard` |
| 관련 GitHub 이슈를 focused work unit으로 만들 때 | `/triage` |
| 불확실한 명제를 bounded 대리 공간에서 검증할 때 | `/reduced-space-test` |
| 뭔가 어긋났는데 어떤 결핍인지 아직 이름 붙이지 못할 때 | `/probe` |
| 모든 finding 이 처분될 때까지 변경을 리뷰로 끌고 갈 때 | `/review-loop` |
| 지시문 산문의 한 절이 어디에 속하는지 정할 때 | `/place` |
| 초안된 옵션 집합이 사용자에게 닿기 전에 검사할 때 | `/gate-check` |
| 프로즈의 금지 프레이밍·앵커링 예시를 감사할 때 | `/white-bear`, `/zero-shot` |
| 관찰된 calibration drift 로 프로젝트 프로필을 갱신할 때 | `/steer` |
| 프로젝트 가이드 direction line 을 다시 도출할 때 | `/realign` |
| 리서치 질문을 Codex 에 위임할 때 | `/goal-research` |
## 사용법

```
/onboard
/probe
/triage
/triage #41 #52 #60
/review-loop codex 123
/place path/to/SKILL.md
/goal-research <question>
```

## 저자

Jongwon Choi (https://github.com/jongwony)
