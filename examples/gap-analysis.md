# 프로토콜 갭 분석

> 7개 프로토콜 체계에서 식별된 커버리지 갭을 문서화합니다.
> Prothesis 다관점 분석(SW/KW/CC 도메인) + 사용자 리뷰를 통해 검증되었습니다.

**분석 범위**: 7개 프로토콜 (Prothesis, Syneidesis, Hermeneia, Katalepsis, Telos, Aitesis, Epitrope)
**유효 갭**: 3개 (7개 후보 중 사용자 리뷰 통과)

---

### 1. 실행 중 Scope 확장 미감지 `High`

**유형**: Type B 공백 (프로토콜 커버리지 밖)

**사용자 맥락**: 작업 도중 사용자가 요구사항을 추가할 때 기존 작업과의 호환성을 평가하는 프로토콜이 없다.

**트리거 발화/행동**: 실행 중 사용자가 "이것도 같이 해 줘"를 반복하며 원래 범위를 넘어서는 요구사항 추가.

**결핍(전)**: `ScopeEvolved → RecalibratedExecution` — 어떤 프로토콜도 실행 중 scope 변경을 감지하고 기존 작업과의 호환성을 평가하지 않는다. 실무 빈도 최고, 재작업 비용 기하급수적.

**해결(후)**: 현재 7개 프로토콜 중 이 결핍을 해소하는 프로토콜이 없으며, 별도 메커니즘이 필요하다.

**인접 프로토콜 배제**: 7개 모두 해당 없음 — Prothesis/Telos/Epitrope/Aitesis는 실행 전 구조화, Syneidesis는 결정 시점 질문, Hermeneia는 표현 해석, Katalepsis는 사후 이해 검증.

---

### 2. Telos-Prothesis 순환 의존 `Medium`

**유형**: 경계 사례 (선형 precedence로 해소 불가)

**사용자 맥락**: "기술 부채 줄이고 싶어" — Telos(목표 미정)와 Prothesis(프레임 미정)가 서로의 출력을 입력으로 요구하는 구조적 이슈.

**트리거 발화/행동**: "기술 부채를 줄여야 하는데, 어떤 관점으로 봐야 할지도, 뭘 성공으로 봐야 할지도 모르겠어."

**결핍(전)**: Telos는 프레임이 있어야 목표를 구성할 수 있고, Prothesis는 목표가 있어야 관점을 선택할 수 있다. 선형 precedence(Telos → Prothesis)로는 첫 단계의 입력이 비어 있어 시작할 수 없다.

**해결(후)**: 고수준 전략 목표에서 발생하며, 이후 분석 품질에 전파된다. 두 프로토콜 간 부트스트래핑 메커니즘이 필요할 수 있다.

**인접 프로토콜 배제**: 특정 프로토콜 배제가 아닌 두 프로토콜 간 인터페이스 문제.

---

### 3. 다중 세션 결정 연속성 부재 `Medium`

**유형**: Type B 공백 (세션 경계 이슈)

**사용자 맥락**: 이전 세션의 Lens L이나 DelegationContract가 새 세션에서 invisible하여 중복 분석과 일관성 상실이 발생한다.

**트리거 발화/행동**: 새 세션에서 "지난번에 정한 분석 프레임을 이어서 쓰자"라고 하지만, 이전 Lens L이 세션 컨텍스트에 없다.

**결핍(전)**: `DecisionForgotten → ContinuedDeliberation` — Reflexion이 근접하지만 "특정 결정 검색"은 미지원. 이전 세션의 프로토콜 산출물(Lens, DC, GoalContract)이 새 세션에서 접근 불가.

**해결(후)**: Reflexion이 부분적으로 커버하지만, 특정 결정/계약을 검색하고 복원하는 메커니즘은 별도로 필요하다.

**인접 프로토콜 배제**: Reflexion이 가장 근접하지만, insight 추출과 결정 복원은 다른 목적이다.

---

## 기각된 갭 후보 (참고용)

| # | 후보 | 기각 사유 |
|---|------|-----------|
| 1 | Syneidesis-Epitrope DC 충돌 | 빈도 Low — slash command 호출 구조상 거의 발생하지 않음 |
| 3 | Hermeneia-Telos false precision | AskUserQuestion으로 해소 가능 |
| 4 | Multi-stakeholder governance | Claude Code 범위 밖 |
| 5 | Prothesis-Syneidesis urgency delay | 빈도 Low — 긴급 상황에서 Prothesis를 호출하지 않음 |
