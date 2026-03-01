# Prosoche (προσοχή) — /attend

> [English](./README.md)

실행 중 AI 작업의 위험을 연속적으로 평가합니다.

## 타입 시그니처

```
(ExecutionBlind, User, EVALUATE, ExecutionAction) → SituatedExecution
```

## 기능

Prosoche는 대기 중인 AI 작업을 비가역성, 인간 커뮤니케이션, 보안 경계, 프롬프트 인젝션, 외부 변경, 범위 이탈 등의 위험 신호에 대해 연속적으로 모니터링합니다. 대부분의 작업은 조용히 통과하고(p=Low), 위험이 감지된 작업만 사용자 판단을 위해 표면화됩니다.

**핵심 원칙**: 자동화보다 주의(Attention over Automation) — 자율성이 기본값이며, 진정한 위험 경계에서만 중단됩니다.

## 활성화 시점

- 사용자가 `/attend` 호출
- AI가 고자율 실행 컨텍스트 감지 (예: bypass permissions, 다단계 체인)

## 위험 신호 분류

| 신호 | 기본 심각도 | 예시 |
|------|-----------|------|
| Irreversibility | Gate | `rm`, `git push`, `--force`, `DROP`, `deploy` |
| HumanCommunication | Gate | `gh comment`, `slack message`, `email send` |
| SecurityBoundary | Gate | 설정 내 `$(...)`, `.env` 접근, 자격 증명 |
| PromptInjection | Gate (캐시 불가) | 데이터 필드의 명령어 패턴 |
| ExternalMutation | Advisory | API 쓰기, 캐시 작업 (프로덕션이면 Gate) |
| ScopeEscalation | Advisory | 작업 범위 외 파일 (비가역+범위이탈이면 Gate) |

## 세션 승인 캐시

작업을 승인하면 패턴 `(tool_name, target, env_context)`이 세션 동안 캐시됩니다. 이후 동일 패턴 작업은 조용히 통과합니다. 예외: PromptInjection 신호는 절대 캐시되지 않습니다.

환경 인식: `("pulumi up", "auth-stack", "dev")` 승인은 `("pulumi up", "auth-stack", "prod")`에 적용되지 않습니다.

## 알려진 제한 사항

- **서브에이전트 모니터링 제한**: Prosoche는 메인 에이전트의 실행 스트림만 모니터링합니다. Task 서브에이전트가 실행하는 작업은 모니터링되지 않습니다. `boundaries.md` 규칙과 서브에이전트 권한 제한을 보완 수단으로 사용하세요.
- **단일 패스 감지**: Phase 0 위험 신호 스캔은 단일 패스입니다. 오탐지(특히 PromptInjection)는 재평가되지 않습니다.

## 설치

```bash
/plugin install prosoche
```

## 사용법

```
/attend [작업]    # 실행 중 위험 모니터링 활성화
```

## 라이선스

MIT
