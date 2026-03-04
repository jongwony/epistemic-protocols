# Epistemic Cooperative (epistemic-cooperative)

Claude Code 세션 분석 및 프로토콜 추천 유틸리티.

> [English](./README.md)

## Epistemic Cooperative란?

Claude Code 사용 패턴을 분석하여 인식론적 프로토콜을 추천하고 커버리지 분석을 제공하는 유틸리티 플러그인이다. 특정 인지 결핍을 해결하는 프로토콜과 달리, Epistemic Cooperative는 **진입점** 역할을 한다 — 사용자의 워크플로우에 맞는 프로토콜을 발견하고 세션 전반의 사용량을 추적한다.

### 두 개의 스킬

| 스킬 | 목적 | 출력 |
|------|------|------|
| `/onboard` | 세션 분석 및 프로토콜 추천 | HTML 프로필 (`~/.claude/.onboard/epistemic-profile.html`) |
| `/dashboard` | 전체 커버리지 분석 대시보드 | HTML 대시보드 (`~/.claude/.insights/dashboard.html`) |

## 스킬

### /onboard — 프로토콜 추천

세션 파일에서 도구 사용 패턴을 추출하고, 패턴을 인식론적 결핍에 매핑하여 실제 작업에 맞는 프로토콜을 추천한다.

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
- Starter Trio: Hermeneia `/clarify`, Telos `/goal`, Syneidesis `/gap`
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

## 아키텍처

```
epistemic-cooperative/
├── .claude-plugin/plugin.json
├── skills/
│   ├── onboard/SKILL.md          # /onboard 프로토콜 추천
│   └── dashboard/SKILL.md        # /dashboard 커버리지 대시보드
└── agents/
    ├── project-scanner.md         # Phase 1: 프로젝트 탐색
    ├── session-analyzer.md        # Phase 2: 패턴 추출 (프로젝트별 병렬)
    └── coverage-scanner.md        # Insights Phase 2: 일괄 집계
```

| 에이전트 | 사용처 | 역할 |
|----------|--------|------|
| project-scanner | `/onboard` Phase 1 | `~/.claude/projects/` 스캔, 최근 프로젝트 선택, 세션 인덱스 읽기 |
| session-analyzer | `/onboard` Phase 2 | JSONL에서 도구 빈도, 재작업 지표, 슬래시 커맨드 이력 추출 |
| coverage-scanner | `/dashboard` Phase 2 | 전체 세션의 facets, session-meta, 슬래시 커맨드 데이터 집계 |

## 사용 시기

| 상황 | 스킬 |
|------|------|
| 인식론적 프로토콜이 처음일 때 | `/onboard` |
| 사용 분석을 보고 싶을 때 | `/dashboard` |
| 프로토콜 추천이 필요할 때 | `/onboard` |
| 워크플로우 변경 후 재평가할 때 | `/onboard` |
| `/onboard` 이후 더 깊은 분석이 필요할 때 | `/dashboard` |
| 시간 경과에 따른 프로토콜 채택 추적 | `/dashboard` |

## 사용법

```
/onboard
/dashboard
```

## 저자

Jongwon Choi (https://github.com/jongwony)
