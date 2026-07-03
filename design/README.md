# Design Rationale (Layer 3)

Runtime에 로드하지 않는 설계 결정 이력. 프로토콜 개발자를 위한 문서.

## 디렉토리 구조

| 문서 | 내용 |
|------|------|
| `morphism-extraction.md` | Morphism/Prose 경계 결정 이력 — 프로토콜 타입 전이 메타데이터를 어디에 저장할지(graph.json vs SKILL.md `── MORPHISM ──`)에 대한 결정 |
| `aitesis-empirical-resolution.md` | Aitesis Phase 1의 실증적 보강(empirical enrichment) 확장 결정 이력 — 사용자에게 묻기 전 환경을 테스트해 근거를 수집하는 경로 |

## 원칙

- Layer 3 문서는 런타임에 참조되지 않음
- 설계 결정의 **근거**와 **폐기된 대안**을 기록
- "왜 이렇게 결정했는가?"에 답하는 문서
