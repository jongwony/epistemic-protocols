# Reflexion — /reflect

Claude Code를 위한 크로스세션 학습

> [English](./README.md)

## Reflexion이란?

라틴어 *reflexio*("뒤로 구부리다")에서 유래 — **Claude Code 세션에서 실행 가능한 인사이트를 추출하여 영속적 메모리에 저장하는** 스킬로, 세션 간 학습을 가능하게 한다.

### 핵심 문제

세션 지식은 휘발성이다 — 작업 중 발견한 인사이트, 패턴, 선호 설정이 세션 종료와 함께 사라진다. 구조화된 추출 없이는 매 세션이 제로에서 시작한다.

### 해결책

**축적이 아닌 결정화**: 가이드 대화를 통해 구조화된 인사이트를 증류하며, 원시 경험을 단순히 보관하지 않는다. 병렬 에이전트가 추출하고, 사용자가 선택하고, 시스템이 통합한다.

## 흐름

```
Session → Context → ∥Extract → Select → Integrate → Verify
```

```
Phase 1: Context Detection  → 세션 경로 및 메모리 모드 식별
Phase 2: Parallel Extraction → 3개 에이전트가 동시 추출 (session-summarizer, insight-extractor, knowledge-finder)
Phase 3: Guided Selection    → 사용자가 저장할 인사이트 선택 (call AskUserQuestion)
Phase 4: Integration         → 선택된 인사이트를 메모리에 기록 (Tier A: MEMORY.md, Tier B: .insights/)
Phase 5: Verification        → 통합 확인 및 정리
```

## 아키텍처

```
reflexion/
├── skills/reflexion/SKILL.md    # 전체 워크플로우 정의
├── agents/
│   ├── session-summarizer.md    # 세션 요약 생성
│   ├── insight-extractor.md     # 근거 기반 실행 가능한 인사이트 추출
│   └── knowledge-finder.md      # 기존 메모리에서 관련 지식 검색
├── commands/
│   ├── reflect.md               # 사용자 선택을 포함한 전체 추출
│   └── quick-reflect.md         # 저장 없는 빠른 요약
└── references/                  # 형식 의미론, 메모리 계층, 오류 처리
```

Phase 2에서 세 에이전트를 모두 병렬 실행(`run_in_background: true`)한다. 각 에이전트는 핸드오프 디렉토리에 출력을 기록하고, Phase 3에서 이 파일들을 읽어 통합된 선택 인터페이스를 제시한다.

## 명령어

| 명령어 | 용도 |
|--------|------|
| `/reflect` | 가이드 인사이트 선택을 포함한 전체 추출 파이프라인 |
| `/quick-reflect` | 메모리 저장 없는 빠른 세션 요약 |

## 메모리 계층

| 계층 | 대상 | 로딩 시점 | 용도 |
|------|------|-----------|------|
| A | `MEMORY.md` | 매 세션 | 반복 패턴, 아키텍처 결정, 컨벤션 |
| B | `.insights/` | 필요 시 | 아카이브 지식, 도메인 참조, 상세 노트 |

## 사용 시기

**사용**:
- 의미 있는 코딩 세션을 완료한 후
- 결정, 패턴, 디버깅 인사이트를 캡처하고 싶을 때
- 다른 프로젝트로 전환하기 전
- 반복 패턴을 세션 간 유지해야 할 때

**건너뛰기**:
- 의미 있는 인사이트가 없는 단순 세션
- 인사이트가 이미 다른 곳에 문서화되어 있을 때

## 사용법

```
/reflect
/quick-reflect
```

## 저자

Jongwon Choi (https://github.com/jongwony)
