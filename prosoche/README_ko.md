# Prosoche (προσοχή) — /attend

> [English](./README.md)

자율 실행 전에 slow/threshold 실행 위험을 검증 가능한 goal 조건으로 컴파일합니다.

## 타입 시그니처

```
(ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution
```

## 기능

Prosoche는 무상태 가드레일 컴파일러입니다. 자율 실행 구간이 시작되기 전에 컨텍스트에서 경계맵을 추론하고(상위 `/bound` 출력은 추론을 풍부하게 하지만 필수 조건이 아닙니다), 위험을 속도(velocity)로 분할하고, slow/threshold 부분을 검증 가능한 predicate로 컴파일한 뒤, 확정된 집합을 하위 완료조건 enforcer(Claude Code에서는 `/goal`)가 소비할 coarse goal 엔트리로 방출합니다. Fast 위험 — 액션 실행 전 차단이 필요한 모든 것 — 은 범위 밖으로 선언되어 하니스 substrate에 위임됩니다.

**핵심 원칙**: 자동화보다 주의(Attention over Automation) — 실행 위험은 자율 실행이 시작되기 전에 주의를 받으며, 실행 중 중단으로 받지 않습니다. 주의는 조건에 새겨지고, Prosoche의 어떤 것도 실행 구간으로 살아남지 않습니다.

## 활성화 시점

- 사용자가 `/attend` 호출 (사용자 주도만 해당)

## 경계 신호 분류

| 종류 | 컨텍스트 단서 | 속도 |
|------|--------------|------|
| ScopeConfinement | 권한 부여, 선언된 파일/저장소 범위, 샌드박스 제한 | Slow |
| Budget | 토큰/비용/반복/시간 예산 | Slow |
| CompletionThreshold | 명시된 완료 기준: 테스트 통과, CI green, 산출물 존재 | Slow |
| Irreversibility | 가역성 제약, 프로덕션 대상, deploy/push/delete 의도 | 분할: 종료상태 검증 가능 부분 Slow; 사전 차단 부분 Fast → 범위 밖 |
| Emergent | 명명된 종류 밖의 경계 패턴 | 사례별 평가 |

**Slow/threshold** 위험은 루프가 멈출 때 평가 가능하며 — 실행 가능한 predicate(종료 코드, 테스트 결과, 셀 수 있는 임계값, 파일 상태 단언)로 컴파일됩니다. **Fast** 위험은 액션 실행 전 차단이 필요합니다 — 정지 시점 predicate는 구조적으로 이를 잡을 수 없으므로, 시뮬레이션하지 않고 위임합니다.

## 합성

지휘된 워크플로(`/conduct`) 안에서 실행 준비 체인은 `/bound` → `/attend` → `/goal`입니다: `/bound`가 경계맵을 정의하고, `/attend`가 그중 slow/threshold 부분을 검증 가능한 조건으로 컴파일하고, `/goal`이 하나의 bounded interval 안에서 이를 enforce합니다. `/attend`는 `/goal`을 호출하지 않습니다 — 방출이 인식론적 종료점이며, 자율 구간 시작은 사용자의 별도 행위입니다. 구간 이후에는 `/contextualize`와 `/grasp`가 검증합니다.

## 알려진 제한 사항

- **Bounded 플랫폼 주장**: `/goal` leaf-executor 특성은 Claude Code v2.1.140 기준으로만 검증됨; 하니스 버전 변경 시 재검증 필요.
- **추론은 휴리스틱**: 발화되지 않았고 상위에서 포착되지 않은 경계는 추론되지 않습니다; 확인 게이트가 교정 지점입니다.
- **Predicate 커버리지**: 주관적 품질 기준은 컴파일되지 않습니다; prose 조건이 아니라 residual로 표면화됩니다.
- **실행 중 보호 없음**: 컴파일 타임 전용 — fast 위험은 전적으로 사전 차단 substrate의 책임입니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install prosoche@epistemic-protocols
```

## 사용법

```
/attend [작업]    # 실행 가드레일을 검증 가능한 goal 조건으로 컴파일
```

## 라이선스

MIT
