# `/simplify` → Prothesis 진화 계보

> 이 문서는 Claude Code 빌트인 `/simplify`와 Prothesis 프로토콜의 구조적 기원 관계와
> 분기 과정을 기술한다.

---

## 기원: 공통 패턴

Prothesis v1.0(2025-12-26)은 `/simplify`와 구조적으로 동일한 패턴에서 출발했다 — **3-phase fan-out**.

`/simplify`의 구조:
```
Instruction → [Agent 1: Code Reuse Review]
            → [Agent 2: Code Quality Review]  → Aggregation → False-positive filtering
            → [Agent 3: Efficiency Review]
```

Prothesis v1.0의 구조:
```
Question → [Phase 1: Perspective A]
         → [Phase 2: Perspective B]  → Phase 3: Integration
         → [Phase 3: Perspective C]
```

동일 패턴: 하나의 입력을 복수의 병렬 분석으로 분산시키고, 결과를 통합.

---

## 진화 타임라인

> 아래 버전 번호(v1.0~v5.0+)는 구조적 전환점을 기준으로 한 **회고적 재구성**이며,
> 실제 git tag나 plugin.json 버전과 일치하지 않는다. 현재 plugin.json 버전은 `5.2.0`.

```
/simplify (bundled)           Prothesis
──────────────────           ─────────────────────────────────────
3 fixed Agent fan-out   ←≡→  v1.0 (Dec 26): 3-phase fan-out (구조적 동일)
                              v2.0 (Jan 8): Command → Skill 전환
                              v3.0 (Feb 9): ★ 질적 분기점 ★ — Task → TeamCreate
                              v4.0 (Feb 21): theoria/praxis 분리 → 실행을 Epitrope로
                              v5.0+ (Feb 21~): /frame 리네이밍, two-mode
```

**v3.0이 질적 분기점**인 이유: Task 기반 위임에서 Agent Teams(TeamCreate + SendMessage)로 전환하면서, `/simplify`의 "고정 3-agent" 패턴과 구조적으로 달라졌다. 45일, 43개 커밋에 걸쳐 "같은 패턴의 다른 구현"에서 "근본적으로 다른 아키텍처"로 전환.

---

## 취약점-대응 매핑

Prothesis의 각 구조적 추가는 `/simplify`의 특정 취약점에 대한 대응이다:

| `/simplify` 취약점 | Prothesis 대응 |
|---------------------|----------------|
| **Coordinator Rationalization**: 조율자가 subagent 결과를 자의적으로 종합 | Phase 4 구조화된 보고서, `remaining_divergence` 필드로 불일치 명시 보존 |
| **고정 관점 (3개)**: 항상 동일한 3가지 리뷰 축 | 사용자 선택 + 동적 관점, productive tension 설계 |
| **One-shot 제한**: 한 번 분석으로 종료 | 수렴 루프 (`extend`/`deepen`) — 수렴할 때까지 반복 |
| **분석-실행 결합**: 리뷰와 코드 수정이 같은 컨텍스트 | theoria/praxis 분리 — 실행은 Epitrope로 위임 |

---

## 구조 비교

| 차원 | `/simplify` | Prothesis |
|------|-------------|-----------|
| **Agent 수** | 3 (고정) | 2-6 (동적) |
| **관점 선택** | 하드코딩 (Reuse, Quality, Efficiency) | 사용자 선택 + AI 추천 |
| **수렴 메커니즘** | 없음 (one-shot) | 수렴 루프 (extend/deepen/add_perspective) |
| **격리** | 없음 (메인 컨텍스트) | Agent team (TeamCreate) |
| **불일치 처리** | False-positive 필터링 (제거) | `remaining_divergence` (보존) |
| **사용자 상호작용** | 0회 | Phase 0 관점 선택, Phase 5 결과 검토 |
| **프롬프트 크기** | ~200 tokens | ~2,000 tokens |

---

## 트레이드오프 특성

핵심 트레이드오프: **경량성 vs 신호 보존**

- `/simplify`: 가볍지만 신호 손실에 취약 — 고정 관점은 문제의 핵심 축을 놓칠 수 있고, one-shot은 표면적 합의에 머무를 수 있으며, false-positive 필터링은 진짜 불일치를 제거할 수 있다
- Prothesis: 무겁지만 신호 보존 구조화 — 사용자 선택 관점은 문제에 맞는 축을 보장하고, 수렴 루프는 표면 아래의 불일치를 드러내며, `remaining_divergence`는 합의되지 않은 것을 명시한다

이것이 양자의 공존을 정당화한다:
- **코드 리뷰처럼 관점이 고정된 도메인**: `/simplify`의 경량 fan-out이 적합
- **탐구적 분석처럼 관점이 가변적인 도메인**: Prothesis의 구조화된 신호 보존이 적합

---

## 설계 시사점

이 계보 분석에서 도출되는 교훈:

1. **기원의 공유가 역할의 중복을 의미하지 않는다** — 같은 패턴에서 출발했더라도 해결하는 문제가 다르면 독립적 도구로 분화할 수 있다
2. **질적 분기는 양적 누적에서 발생한다** — v1.0→v2.0의 점진적 변경이 v3.0의 구조적 전환을 가능하게 했다
3. **실행 분리는 프로토콜 순화의 핵심 단계이다** — v4.0에서 실행(praxis)을 Epitrope로 위임함으로써, Prothesis는 순수한 탐구(theoria) 도구가 되었다
