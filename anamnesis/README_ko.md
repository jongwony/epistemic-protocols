# Anamnesis — /recollect (ἀνάμνησις)

모호한 회상을 인지된 맥락으로 해소 (ἀνάμνησις: 상기, 떠올리기)

> [English](./README.md)

## Anamnesis란?

플라톤 ἀνάμνησις(상기)의 현대적 재해석 — **모호한 단서를 기존 메모리 및 세션 저장소와 대조하여, 키워드 매칭 검색 결과를 반환하는 대신 올바른 과거 맥락을 소크라테스식 인지(recognition)로 사용자에게 안내하는** 프로토콜.

### 핵심 문제

AI 시스템은 모호한 회상 신호(`RecallAmbiguous`)를 놓치기 쉽습니다 — 사용자는 어떤 과거 세션·결정·산출물이 지금 관련 있다는 감각은 있지만, 구체적으로 그것을 지칭할 수 없습니다. 단서가 충분히 특정되지 않은 상태에서 키워드 검색은 너무 많거나 너무 적은 결과를 반환하고, 올바른 과거 맥락에 닿기 전에 신호가 유실됩니다.

### 해결책

**검색보다 인지(Recognition over Retrieval)**: AI가 SSOT(세션 JSONL)와 hypomnesis INDEX를 Salience 차원을 따라 스캔하여, 후보를 소크라테스식 내러티브 지문(origin → direction → outcome)으로 제시하고, 사용자가 직접 매치를 인지합니다 — 또는 인접 벡터를 통해 소크라테스식 probe로 세부 조정하거나, 직교적 회상 차원으로 방향을 재설정합니다. 모호한 회상을 인지된 맥락으로 변환합니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Hermeneia | Hybrid | `IntentMisarticulated → ClarifiedIntent` |
| Telos | AI-guided | `GoalIndeterminate → DefinedEndState` |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

**Anamnesis vs Aitesis** — 가장 가까운 이웃. 둘 다 정보 접근을 다루지만, 현상학적 판별이 다릅니다. Aitesis는 사용자가 알지 못하는 사실을 발견합니다(`ContextInsufficient` — "정보가 필요하다"). Anamnesis는 사용자가 존재한다는 것은 어렴풋이 아는 맥락을 확인합니다(`RecallAmbiguous` — "이거 어디서 다뤘던 것 같은데"). 충족을 기다리는 빈 지향(empty intention)이면 Anamnesis; 해당 주제에 지향 자체가 없으면 Aitesis.

## 프로토콜 흐름

```
Phase 0: Detect      → 빈 지향 감지, 입력 타입 분류, 트랙 디스패치 (silent)
Phase 1: Scan        → Salience 차원을 따라 저장소 스캔, 후보 순위화
Phase 2: Recognize   → 순위화된 후보를 소크라테스식 인지를 위해 제시 (gate interaction)
Phase 3: Integrate   → 인지된 맥락을 세션 텍스트로 방출; 불일치 시 Refine/Reorient 로 루프
```

## Salience 차원

`MarkerProfile`의 여섯 차원 — 회상 후보 순위화와 초기 후보가 빗나갔을 때 소크라테스식 probe 구성에 사용.

| 차원 | 마커링 대상 |
|------|-------------|
| Coinage | 과거 논의를 고정하는 조어·신조어 — 전체 코퍼스에서는 희귀하지만 한 세션 내에서 반복되는 토큰 (Zipf 편차 신호) |
| Actor | 과거 맥락에 등장한 존재들 (사람, 시스템, 모듈, 파일) |
| Temporal | 시점 참조, 세션 날짜, 순서 단서 — 회상을 시간축에 배치 |
| Emotional | 정서적 마커 — 좌절, 놀람, 돌파 — 한 순간을 기억에 남게 하는 요소 |
| Cognitive | 추론 마커 — 내려진 결정, 해소된 트레이드오프, 도달한 깨달음 |
| Singularity | 일회성 사건·인시던트·예외적 에피소드 — 일상 논의와 구별되는 것들 |

## 사용 시점

**사용하세요**:
- 과거 세션·결정이 지금 관련 있다는 감각은 있지만 지칭할 수 없을 때
- 메모리 키워드 검색이 너무 많거나 너무 적은 결과를 반환할 때
- 단서가 구조화되지 않은 현상학적 형태("그때 얘기했던 그거…")일 때
- 다음 단계가 어떤 과거 맥락을 이어받느냐에 달려 있을 때

**건너뛰세요**:
- 이미 세션 ID, 파일 경로, 결정을 알고 있을 때 — 직접 조회가 더 저렴
- 과거 맥락 자체가 존재하지 않을 때 (새로운 도메인 — Aitesis `/inquire` 사용)
- 요청이 기억이 아닌 생성일 때

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install anamnesis@epistemic-protocols
```

## 사용법

```
/recollect [모호한 단서 — 키워드, 단편, 또는 설명]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
