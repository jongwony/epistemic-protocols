# Epistemic Cooperative (epistemic-cooperative)

프로토콜 학습, 사용 분석, 커버리지 대시보드, work-unit triage, dispatch orchestration 유틸리티.

> [English](./README.md)

## Epistemic Cooperative란?

인식론적 프로토콜 온보딩, 분석, 작업 orchestration을 위한 유틸리티 플러그인이다. 특정 결정 지점을 다루는 프로토콜과 달리, Epistemic Cooperative는 **진입점** 역할을 한다 — 체험 기반 프로토콜 학습을 안내하고, 근거 기반 분석 리포트를 생성하며, 세션 전반의 사용량을 추적하고, 이슈에서 focused work unit을 형성해 선택된 unit을 실행으로 넘긴다.

### 스킬

| 스킬 | 목적 | 출력 |
|------|------|------|
| `/onboard` | 빠른 추천 + 프로토콜 학습 | 터미널 기반 가이드 경험 |
| `/report` | Growth Map — 인식론적 분석 | HTML 아티팩트 (`~/.claude/.report/growth-map.html`) |
| `/dashboard` | 전체 커버리지 분석 대시보드 | HTML 대시보드 (`~/.claude/.dashboard/dashboard.html`) |
| `/catalog` | 프로토콜 핸드북 — 즉시 참조 | 터미널 기반 프로토콜 브라우저 |
| `/compose` | 프로토콜 합성 저작 | 합성 SKILL.md 파일 생성 |
| `/triage` | GitHub 이슈 기반 work-unit triage | dispatchable initial prompt |
| `/dispatch` | focused work-unit 실행 | 브랜치, PR, feedback inscription |
| `/forge` | 레퍼런스-grounded initial-prompt 형성 | 후속 세션/도구용 initial prompt |

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
| 2a. Pick-1 | Quick path: `/gap`, `/frame` 중 1개 추천 선택 |
| 2b. Evidence | Quick path: 근거 카드 1개 표시 (최대 2줄) |
| 2. Map | Targeted path: 컴팩트 매핑 테이블로 프로토콜 매칭 |
| 3. Scenario | Targeted path: 프리셋 시나리오로 개입 지점 제시 |
| 4. Trial | 미니 연습 프롬프트로 실제 프로토콜 실행 |
| 5. Quiz | Targeted path: 소크라테스식 프로토콜 인식 문제 |
| 6. Guide | Targeted path: 학습 요약 + /report CTA |

주요 특징:
- **학습보다 가치 증명 먼저**: quick path는 3분 이내에 가치를 체감
- **한 번에 하나만**: 추천 1개, 근거 카드 1개, 체험 1회 — 카탈로그 불필요
- **Onboarding Pool**: `/gap`, `/frame` — Quick 추천 + Targeted 폴백 통합
- 실제 프로토콜 시험 실행 (프로토콜당 2-3 교환)
- Targeted path는 전체 학습 경험 유지 (시나리오, 퀴즈, 가이드)
- 근거 기반 분석은 `/report`, 빠른 가치 증명은 `/onboard`

### /report — Growth Map

세션 패턴을 분석하고 `/insights` 데이터를 타게팅 입력으로 통합하여 Growth Map을 생성한다 — 프로토콜 채택 패턴, 커버리지 갭, 안티패턴을 다루는 직교 인식론적 분석.

```
SCAN → EXTRACT → MAP → PRESENT → GUIDE
```

| 단계 | 설명 |
|------|------|
| 1. Scan | 프로젝트와 세션 파일 탐색 (project-scanner에 위임) |
| 2. Extract | 세션 JSONL에서 행동 패턴 추출 (session-analyzer에 위임) |
| 3. Map | 매핑 테이블을 통해 패턴을 프로토콜에 매칭 |
| 4. Present | 결과 표시 및 HTML 프로필 생성 (사용자 확인) |
| 5. Guide | 프로토콜 시작 CTA 및 설치 안내 |

주요 특징:
- 패턴 기반 프로토콜 매칭 (행동, 환경, 마찰 패턴)
- 3단계 폴백: 정밀 매핑 (3+ 패턴) → 보충 추천 (1-2) → Starter Trio
- 세션 진단 및 안티패턴 탐지
- Facets 데이터 가속화 (이전 `/dashboard` 실행 데이터 활용)

### /dashboard — 커버리지 대시보드

모든 Claude Code 세션 데이터를 분석하여 커버리지 지표, 마찰 분석, 성장 타임라인, 품질 점수를 포함하는 종합 사용 분석 대시보드를 제공한다.

```
COLLECT → AGGREGATE → ANALYZE → PRESENT
```

| 단계 | 설명 |
|------|------|
| 1. Collect | facets, session-meta, 프로젝트 데이터 인벤토리 |
| 2. Aggregate | 일괄 데이터 수집 (coverage-scanner에 위임) |
| 3. Analyze | 7개 연산: 커버리지, 사용량, 마찰, 성장, 업적, 만족도, 품질 |
| 4. Present | HTML 대시보드 + 콘솔 요약 |

대시보드 섹션:
- **Coverage**: 프로토콜별 상황 발생 vs. 프로토콜 사용 비율
- **Protocol Usage**: 슬래시 커맨드 호출 횟수 및 최초 사용일
- **Friction Mapping**: 마찰 키를 프로토콜 그룹에 매핑
- **Growth Timeline**: 주간 세션 수 및 채택일
- **Achievements**: 세션, 프로토콜, 코드, 연속 사용 마일스톤
- **Quality Score**: 복합 점수 0-100 (결과 35%, 마찰 20%, 만족도 25%, 커버리지 20%)

### /catalog — 프로토콜 핸드북

모든 프로토콜을 탐색하고, 관심 클러스터별로 비교하며, 상세 시나리오를 확인한다. 텍스트 출력 전용, 프로토콜별 시나리오 상세 모드 제공.

### /compose — 프로토콜 합성 저작

프로토콜 체인에서 합성 SKILL.md 파일을 생성한다. 그래프 제약 조건을 검증하고, 게이트를 카탈로그화하고, 배치를 제안하고, 파이프라인 템플릿을 생성한다.

```
SPECIFY → VALIDATE → CATALOG → DISPOSITION → GENERATE
```

| 단계 | 설명 |
|------|------|
| 0. Specify | 체인 명세 입력 및 정규화 |
| 1. Validate | graph.json precondition/suppression 검증 |
| 2. Catalog | 프로토콜별 TOOL GROUNDING 항목 추출 (Constitution/Extension 분류) |
| 3. Disposition | 합성 시점 게이트 배치 분석 |
| 4. Generate | 합성 SKILL.md 템플릿 생성 |

주요 특징:
- 그래프 인식 체인 검증 (precondition, suppression)
- TOOL GROUNDING 항목에서 자동 게이트 인벤토리
- 합성 시점 배치 모델 (epistemic access × catch-chain × BoundaryMap)
- Catch-chain 불변량 검증
- `/review` 패턴 템플릿 출력 (pipeline context rules 포함)

### /triage — Work-Unit Formation

GitHub `RawIssueSet`을 그룹화하고, 각 issue group을 공유 problem frame으로 normalize한 뒤, 현재 세션에서 active `AGENTS.md` northstar와 융합해 dispatchable initial prompt를 emit한다. 이슈 범위 없이 `/triage`만 호출하면 현재 repository의 open backlog에서 시작하고, full issue substrate를 읽기 전에 triage load를 판정한다.

```
RAW ISSUES → GROUP → NORMALIZE → NORTHSTAR FUSION → WORK UNIT → INITIAL PROMPT → ROUTE
```

주요 특징:
- bare `/triage`는 open-backlog metadata intake를 먼저 수행한 뒤 issue load, repo load, mapping load, intent ambiguity로 small / medium / large posture를 판정한다.
- label만이 아니라 problem pressure 기준으로 similarity grouping
- 기본은 `IssueGroup -> FocusedWorkUnit` 1:1, northstar fusion 중 실행축이 갈라질 때만 split
- route choice는 현재 세션에서 사용자가 결정: independent session, linear `/dispatch`, parallel `/dispatch`, re-triage

### /dispatch — Focused Work-Unit Execution

`/triage`가 만든 focused work unit 또는 initial prompt를 받아 `/bound`로 실행 topology 계약을 설정하고, 각 unit의 premise를 검증한 뒤 branch/PR로 fanout하고 review feedback을 linked issue에 inscribe한다.

```
DETECT → BOUND → LOAD WORK UNITS → PREMISE → FANOUT → FEEDBACK
```

주요 특징:
- dispatch 내부에서 open issue intake를 하지 않음; backlog discovery는 `/triage`로 라우팅
- branch 생성 전 premise verification
- 선택된 work unit에 대한 linear 또는 parallel fanout
- fresh-context continuity를 위한 verbatim rejection feedback inscription

### /forge — Reference-Grounded Initial-Prompt Formation

대상 레퍼런스 문서(벤더 모델 prompt guide, Codex Goals 스펙)를 읽고, 사용자의 미명세 의도를 modality-aware IR로 역귀납한 뒤, canonical-external 동적 fetch + staleness guard로 레퍼런스에 grounding하고, 후속 세션/도구용 initial prompt를 projection한다.

```
ReferenceIntake → ResolvedIntentIR → GroundedReference → VendorPromptDraft → InitialPrompt
```

주요 특징:
- 벤더-무관 core(의도 IR + staleness 정책) + 인자화 adapter seam; Higgsfield·codex-goals 어댑터 동봉
- core는 IR까지; 산출물 형태는 adapter-결정(core 승격 금지)
- relay 슬롯 인용·constitution 슬롯 플래그된 채워진 초안 — 빈 질문 목록도 맹목 완성초안도 아님
- 교차-adapter 추상은 의도적으로 유예된 colimit(triage-gated-vendor-harness의 형제), 누적 사용 전 미추출

## 아키텍처

```
epistemic-cooperative/
├── .claude-plugin/plugin.json
├── skills/
│   ├── onboard/SKILL.md          # /onboard 퀘스트 기반 프로토콜 학습
│   ├── report/SKILL.md           # /report Growth Map
│   ├── dashboard/SKILL.md        # /dashboard 커버리지 대시보드
│   ├── catalog/SKILL.md          # /catalog 프로토콜 핸드북
│   ├── compose/SKILL.md          # /compose 프로토콜 합성 저작
│   ├── triage/SKILL.md           # /triage work-unit formation
│   ├── dispatch/SKILL.md         # /dispatch focused work-unit execution
│   └── forge/SKILL.md            # /forge reference-grounded initial-prompt formation
└── agents/
    ├── project-scanner.md         # Phase 1: 프로젝트 탐색
    ├── session-analyzer.md        # Phase 2: 패턴 추출 (프로젝트별 병렬)
    └── coverage-scanner.md        # Insights Phase 2: 일괄 집계
```

| 에이전트 | 사용처 | 역할 |
|----------|--------|------|
| project-scanner | `/report` Phase 1 | `~/.claude/projects/` 스캔, 최근 프로젝트 선택, 세션 인덱스 읽기 |
| session-analyzer | `/report` Phase 2 | JSONL에서 도구 빈도, 재작업 지표, 슬래시 커맨드 이력 추출 |
| coverage-scanner | `/dashboard` Phase 2 | 전체 세션의 facets, session-meta, 슬래시 커맨드 데이터 집계 |

## 사용 시기

| 상황 | 스킬 |
|------|------|
| 인식론적 프로토콜이 처음일 때 | `/onboard` |
| 체험을 통한 프로토콜 학습 | `/onboard` |
| 근거 기반 분석 리포트 필요 | `/report` |
| 사용 분석을 보고 싶을 때 | `/dashboard` |
| 워크플로우 변경 후 재평가할 때 | `/report` |
| `/onboard` 이후 더 깊은 분석이 필요할 때 | `/report` 또는 `/dashboard` |
| 시간 경과에 따른 프로토콜 채택 추적 | `/dashboard` |
| 빠른 프로토콜 참조 | `/catalog` |
| 다중 프로토콜 합성 워크플로우 구축 | `/compose` |
| 관련 GitHub 이슈를 focused work unit으로 만들 때 | `/triage` |
| 선택된 focused work unit을 실행할 때 | `/dispatch` |
## 사용법

```
/onboard
/report
/dashboard
/catalog
/compose clarify → goal → bound → inquire
/triage
/triage #41 #52 #60
/dispatch <initial prompt>
```

## 저자

Jongwon Choi (https://github.com/jongwony)
