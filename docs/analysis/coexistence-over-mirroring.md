# Coexistence over Mirroring: 프로토콜과 빌트인 도구의 관계 원칙

> 이 문서는 "Coexistence over Mirroring" 설계 원칙의 도출 과정과 근거를 기술한다.
> 원칙 자체는 CLAUDE.md의 Design Philosophy 섹션에 명시되어 있다.

---

## 배경: Mirroring 유혹

프로토콜 시스템이 성숙해지면서, 빌트인 실행 도구(`/simplify`, `/batch`)의 기능을 프로토콜 내부로 흡수하려는 유혹이 반복적으로 발생했다.

대표적 사례:
- **Epitrope Phase 5**: DelegationContract에 worktree 격리, worker 수, PR 생성 등 실행 세부를 포함하는 제안
- **Prosoche Phase -1**: 태스크 분해(materialization)를 `/batch`의 task decomposition과 유사하게 확장하는 제안

이러한 제안들은 기술적으로 정확했다. 그러나 **정확성과 적합성은 다른 문제**였다.

---

## 문제 진단: 파이프라인 가정

Mirroring 제안의 근저에는 암묵적 가정이 있었다 — 프로토콜들이 **선형 파이프라인**으로 연결되며, 각 단계가 다음 단계를 위한 전처리라는 가정.

```
[Clarify] → [Goal] → [Inquire] → [Frame] → [Gap] → [Attend] → [Execute] → [Grasp]
                                                          ↑
                                                    여기서 실행 기능 필요?
```

이 가정 하에서는, 파이프라인 중간에 실행 도구 호출이 필요할 때 프로토콜이 자체적으로 실행 기능을 갖춰야 한다는 결론이 자연스럽다.

---

## 반증: 실제 조합 패턴

실제 프로토콜 사용 패턴을 분석하면, 전체 체인이 선형으로 실행되는 경우는 관찰되지 않는다. 대신 **2-3단계 마이크로 조합**이 반복적으로 나타난다.

관찰된 안정적 조합 패턴:

| 패턴 | 구성 | 용도 |
|------|------|------|
| 방향 설정 | `clarify → goal` | 의도 명확화 + 목표 구체화 |
| 맥락 확보 | `inquire → grasp` | 맥락 수집 + 이해 확인 |
| 분석 검증 | `frame → gap` | 다관점 분석 + gap 감사 |
| 실행 주의 | `attend → contextualize` | 위험 평가 + 적합성 확인 |

이 패턴에서 핵심적인 관찰:
1. **빌트인 실행 도구는 프로토콜 체인 밖에서 독립적으로 호출된다** — 사이에 끼어드는 것이 아니라 경계에서 결합된다
2. **프로토콜은 실행 도구의 내부 메커니즘을 알 필요가 없다** — `/batch`가 worktree를 사용하든 단일 프로세스로 실행하든, 프로토콜의 인식론적 산출물(GoalContract, DelegationContract 등)에는 영향이 없다

---

## 원칙 도출: Unix Philosophy Homomorphism

이 관찰에서 도출된 원칙:

> 각 프로토콜은 하나의 일을 잘 수행하는 단일 목적 인식론적 도구이다.
> 조합은 bottom-up — 사용자가 인식한 결핍에 따라 필요한 도구만 호출한다.

이것은 Unix 파이프라인 철학과 구조적으로 동형(homomorphic)이다:

```bash
# Unix: 각 도구는 stdin/stdout 경계에서 결합
ls | grep pattern | sort

# Epistemic: 각 프로토콜은 Resolution/Deficit 경계에서 결합
/clarify → /goal → /inquire → /batch → /grasp
```

### 3-Layer 관심사 분리

프로토콜과 빌트인 도구는 서로 다른 레이어에 속한다:

| Layer | 관심사 | 도구 |
|-------|--------|------|
| Epistemic | "올바른 것을 하고 있는가?" | 프로토콜 (`/clarify`, `/goal`, `/inquire`, `/gap`, ...) |
| Execution | "올바르게 실행하고 있는가?" | 빌트인 (`/batch`, `/simplify`) |
| Verification | "이해했는가?" | 프로토콜 (`/grasp`) |

### 핸드오프 인터페이스

레이어 간 교환은 **결과값**만으로 이루어진다:

```
Protocol output          →  Execution input
─────────────────────────────────────────────
GoalContract.outcome     →  <instruction>
Aitesis.gathered_context →  (research supplement)
DelegationContract       →  (autonomy boundary)

                         ↓

Execution output         →  Verification input
─────────────────────────────────────────────
PR URLs, summary, errors →  Katalepsis.R
```

프로토콜은 `/batch`의 worktree 격리를 모른다. `/batch`는 GoalContract를 모른다. 각자 최선을 수행하고, 경계에서 결과만 교환한다.

---

## Mirroring이 위험한 이유

Mirroring(실행 기능의 프로토콜 내부 흡수)이 기술적으로 가능하더라도 피해야 하는 이유:

1. **관심사 결합**: 인식론적 판단과 실행 메커니즘이 결합되면, 실행 도구의 변경이 프로토콜 정의에 파급된다
2. **중복 진화**: `/batch`가 worktree 전략을 개선할 때, 프로토콜 내부의 복제본도 함께 업데이트해야 한다
3. **조합 유연성 감소**: 프로토콜이 특정 실행 도구를 내장하면, 다른 실행 도구와의 조합이 어려워진다
4. **단일 책임 위반**: 프로토콜의 본분은 인식론적 결핍 해소이며, 코드 실행은 그 범위 밖이다

---

## Trim의 의미

이 원칙에서 자연스럽게 도출되는 작업 — **실행 꼬리(execution tail)의 제거**:

| 대상 | 현재 | Trim 후 |
|------|------|---------|
| Epitrope Phase 5 | DC → TeamCreate → Task spawn → SendMessage | DC 산출 → "실행은 `/batch` 또는 수동" |
| Prosoche Phase -1 | Intent → TaskCreate(materialization) → 위험 평가 → agent delegation | 외부 태스크 수신 → 위험 평가 → 결과 표면화 |

Trim의 본질: 프로토콜에서 실행 꼬리를 제거하여, Unix 도구처럼 "하나의 일만 잘 하는" 형태로 순화하는 것.

단, **인식론적 목적의 실행은 유지**:
- Prothesis TeamCreate — 탐구 팀(epistemic), 실행 팀이 아님
- Epharmoge Phase 2 Edit/Write — 사용자 지시에 따른 결과 적용

---

## 결론

"Coexistence over Mirroring"은 단순한 설계 선호가 아니라, **실제 조합 패턴에서 도출된 구조적 원칙**이다. 프로토콜이 실행 도구의 기능을 미러링할수록 두 시스템은 서로의 변경에 취약해지고, 조합 유연성은 감소한다. 반대로 각자의 관심사를 유지하면서 경계에서만 결과를 교환할 때, 양쪽 모두 독립적으로 진화할 수 있다.
