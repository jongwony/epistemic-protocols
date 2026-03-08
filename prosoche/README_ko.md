# Prosoche (προσοχή) — /attend

> [English](./README.md)

기존 태스크를 위험 신호별로 분류하고, 위험이 감지된 항목을 표면화합니다.

## 타입 시그니처

```
(ExecutionBlind, User, EVALUATE, ExecutionAction) → SituatedExecution
```

## 기능

Prosoche는 기존 태스크를 읽고 각각을 비가역성, 인간 커뮤니케이션, 보안 경계, 프롬프트 인젝션, 외부 변경, 범위 이탈 등의 위험 신호에 대해 분류합니다. 대부분의 태스크는 조용히 통과하고(p=Low), 위험이 감지된 태스크만 사용자 판단을 위해 표면화됩니다.

**핵심 원칙**: 자동화보다 주의(Attention over Automation) — 자율성이 기본값이며, 진정한 위험 경계에서만 중단됩니다.

## 활성화 시점

- 사용자가 `/attend` 호출 (사용자 주도만 해당)

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

- **단일 패스 분류**: 위험 신호 분류(Phase 0)는 단일 패스입니다. 오분류(특히 PromptInjection)된 태스크는 재평가 없이 통과합니다.
- **분류 정확도**: p=Low로 오분류된 태스크는 Gate를 완전히 우회합니다. Prosoche는 위험을 분류할 뿐 실행하지 않으며, 실행 책임은 호출자에게 있습니다.
- **TaskList 의존성**: Prosoche는 호출 시점의 기존 태스크를 읽습니다. 태스크가 없으면 분류할 대상이 없습니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install prosoche@epistemic-protocols
```

## 사용법

```
/attend [작업]    # 실행 중 위험 분류 활성화
```

## 라이선스

MIT
