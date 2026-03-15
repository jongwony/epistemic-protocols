# Prosoche (προσοχή) — /attend

> [English](./README.md)

상위 인식론적 결핍을 라우팅하고 AI 작업 중 실행 시간 위험을 평가합니다.

## 타입 시그니처

```
(ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution
```

## 기능

Prosoche는 태스크 실행 전에 상위 인식론적 결핍을 스캔하고, 준비 상태 결핍이 감지되면 적절한 프로토콜로 라우팅한 후, 의도를 태스크로 구체화하고 각각을 비가역성, 인간 커뮤니케이션, 보안 경계, 프롬프트 인젝션, 외부 변경, 범위 이탈 등의 위험 신호에 대해 분류합니다. 대부분의 태스크는 조용히 통과하고(p=Low), 위험이 감지된 태스크만 사용자 판단을 위해 표면화됩니다.

**Phase -1 (Sub-A0)**: 태스크 구체화 전에 실행 컨텍스트를 6개 상위 결핍 조건(`/clarify`, `/goal`, `/bound`, `/inquire`, `/frame`, `/ground`)에 대해 스캔합니다. 실행 차단 결핍만 표면화됩니다. 결핍이 감지되지 않으면 투명하게 통과합니다.

**핵심 원칙**: 자동화보다 주의(Attention over Automation) — 자율성이 기본값이며, 진정한 위험 경계 또는 미해결 상위 결핍에서만 중단됩니다.

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
- **서브에이전트 Gate 준수**: 비-prosoche 팀 에이전트는 프롬프트 주입으로 Gate 인식을 받으며, 시스템 제약이 아닙니다. 준수가 보장되지 않습니다.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install prosoche@epistemic-protocols
```

## 사용법

```
/attend [작업]    # 상위 준비 상태 확인 + 실행 중 위험 분류 활성화
```

## 라이선스

MIT
