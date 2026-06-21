# Anagoge — /ascend (ἀναγωγή)

모호한 회상을 더 높은 단위(granularity)로 격상 (ἀναγωγή: 끌어올림)

> [English](./README.md)

## Anagoge란?

Anamnesis(ἀνάμνησις)의 의도된 형제 — ana-mnesis가 하나의 과거 맥락을 *회상*한다면, ana-goge는 그 회상을 그 위에 있는 연결된 단위로 *끌어올립니다*. Anagoge는 **각 deposit에 저장된 anchor를 읽고 공유 anchor·키워드·메타데이터로 세션을 가로질러 관련 deposit을 read-time에 발견하여 deposit 그래프를 재구성하고, 흩어진 deposit들이 이미 함의하는 상위 단위 — 연결된 작업 라인, 토픽 클러스터, 또는 이미 침전된(sedimented) 개념 — 를 인지하는** 프로토콜입니다. 회상을 어느 한 세션으로 해소하는 대신 말입니다.

### 핵심 문제

때때로 모호한 회상(`RecallGranularityInsufficient`)은 *무언가*가 중요하다고 인지할 만큼의 신호는 있지만, 올바른 해소 단위가 어느 한 세션이 아닙니다. 사용자는 여러 세션에 걸친 작업 라인 전체, 흩어진 단편들의 토픽 클러스터, 또는 이전 작업이 이미 침전시킨 개념을 향해 손을 뻗고 있습니다. 단일 세션 회상은 한 조각만 반환하고 단위를 놓칩니다 — 인지 *대상* 자체가 잘못된 granularity에 있는 것입니다.

### 해결책

**집계보다 인지(Recognition over Aggregation)**: AI가 올바른 단위가 supra-session임을 감지하고, 회상이 어떤 상위 단위를 의미하는지 분류(연결된 세션 체인, 토픽 클러스터, 침전된 개념 노드)하며, 각 deposit에 저장된 anchor를 읽고 공유 anchor·키워드·메타데이터로 관련 deposit을 read-time에 발견하여 연결을 재구성하고, 그 타입의 상위 단위 후보를 조립하여 내러티브로 제시합니다 — 체인은 origin → development → arrival, 클러스터는 단편들 + deposit들이 증언하는 토픽의 마지막 상태, 개념 노드는 노드 + 어떤 deposit들이 그것을 forge했는지. 사용자가 단위를 인지합니다. 상위 단위는 인지될 뿐 융합·합성되지 않으며, Anagoge는 **아무것도 쓰지 않습니다**.

deposit 그래프는 네 가지 불변식을 갖는 구조적 타입입니다: 중앙 집계자 없음(그래프는 read-time 연결의 추론된 합집합으로만 존재하며 순회로 재구성됨), 엣지 기반 조립(단위는 글로벌 조인이 아니라 추론된 엣지를 따라 구성), 격리 보존(세션 간 링크와 읽기만 — 세션 간 쓰기 없음), broken-link 관용(누락된 타겟으로의 링크는 오류가 아니라 아직-작성되지-않은 지식).

### 다른 프로토콜과의 차이

| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Anamnesis | AI-guided | `RecallAmbiguous → RecalledContext` |
| **Anagoge** | **AI-guided** | **`RecallGranularityInsufficient → HigherGranularityUnit`** |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |

**Anagoge vs Anamnesis** — 가장 가까운 형제. Anamnesis는 모호한 회상을 *한* 세션으로 해소하고, Anagoge는 그 세션이 속한 supra-session *단위*로 해소합니다. 판별: 한 세션이 회상에 답하는가? 예 → Anamnesis; 아니오, 올바른 단위가 세션 위의 체인 / 클러스터 / 개념 → Anagoge.

**Anagoge vs Aitesis** — Anagoge는 *이미 침전된* deposit을 순회하며 그 연결을 read-time에 재구성하고, Aitesis는 *새로 발견할* 사례를 수집합니다. 관련 사례를 연결하는 게 아니라 발견해야 한다면 `/inquire`로 라우팅하세요.

**Anagoge vs Periagoge** — Anagoge는 이미 침전된 개념 노드를 *인지*(recognition-only)하고, Periagoge는 인스턴스로부터 새 추상화를 *형성*합니다. 개념이 아직 없고 결정화되어야 한다면 `/induce`로 라우팅하세요.

**Anagoge vs Euporia** — Anagoge는 *어떤 기억된 단위*가 관련 있는지 찾고, Euporia는 *결정 의도*를 endpoint를 향해 역추적합니다.

**Hyphegesis와의 dual 관계** — `/conduct` synthesis checkpoint가 흩어진 cross-worker 결과를 연결된 세션 단위로 elevate하도록 Anagoge로 라우팅할 수 있습니다.

## 프로토콜 흐름

```
Phase 0: Detect      → supra-session granularity 인지, 단위 타입 분류, 순회 디스패치 (silent)
Phase 1: Traverse    → read-time에 관련 deposit 발견(공유 anchor/키워드/메타데이터), 상위 단위 후보 조립, 순위화
Phase 2: Recognize   → 상위 단위 후보를 인지를 위해 내러티브로 제시 (gate interaction)
Phase 3: Integrate   → 격상된 상위 단위를 세션으로 방출; 불일치 시 Refine/Reorient 로 루프
```

## 상위 단위 (Higher-Granularity Units)

Anagoge가 회상을 격상시킬 수 있는 세 가지 단위 타입.

| 단위 | 무엇인가 |
|------|----------|
| ConnectedSessionChain | 세션에 걸친 연결된 작업 라인 — 어디서 시작해, 어떻게 발전하고, 어디에 도달했는지 |
| TopicCluster | 한 토픽의 단편 클러스터 + deposit들이 증언하는 그 토픽의 마지막 상태 |
| SedimentedConceptNode | 이미 침전된 개념 노드 + 어떤 deposit들이 그것을 forge했는지 (형성이 아니라 인지) |

## 사용 시점

**사용하세요**:
- 여러 세션에 걸친 작업 라인·토픽·개념 전체가 기억나지만 어느 한 세션이 아닐 때
- 단일 세션 회상이 한 조각만 반환하는데 정작 더 큰 단위를 의미할 때
- 다세션 궤적이 무엇을 말했는지가 아니라 어디에 *도달*했는지가 필요할 때
- 이전 작업이 이미 개념을 침전시켰고 그 형성이 아니라 노드 자체가 필요할 때

**건너뛰세요**:
- 한 세션이 회상을 해소할 때 — Anamnesis `/recollect` 사용
- 사례를 기존 deposit에서 순회하는 게 아니라 새로 발견해야 할 때 — Aitesis `/inquire` 사용
- 인스턴스로부터 새 개념을 형성하고 싶을 때 — Periagoge `/induce` 사용
- 결정 의도를 역추적하고 싶을 때 — Euporia `/elicit` 사용

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install anagoge@epistemic-protocols
```

## 사용법

```
/ascend [모호한 단서 — 세션에 걸쳐 기억나는 작업 라인, 토픽, 또는 개념]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
