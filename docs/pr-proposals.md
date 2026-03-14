## Proposals — `/onboard` Quick Proof 개선

현재 PR에 포함된 변경사항과 후속 개선 제안을 정리합니다.

---

### Proposal 1: Quick Post-Trial Navigation `/report` CTA → 텍스트 멘션 ✅

**상태**: 구현 완료 (`171674c`)

**변경**: Quick Post-Trial Navigation의 "오늘은 여기까지" 종료 시 `/report` CTA를 AskUserQuestion 옵션이 아닌 텍스트 멘션으로 변경.

**근거**: Quick path는 3-4 AskUserQuestion 호출 예산. `/report`를 별도 옵션으로 넣으면 budget 초과 + 선택지 과잉. 텍스트로 자연스럽게 안내하는 것이 Quick path의 "가볍게 끝내기" 철학에 부합.

---

### Proposal 2: 재체험 사용자 대상 auto-recommend pool 확장

**상태**: 미구현

**현재 상태**: auto-recommend pool이 `/goal`, `/gap`, `/frame` 3개로 고정 (Rule #3). "다른 프로토콜 체험하기" 선택 시에도 이 3개 안에서만 순환.

**문제**: 사용자가 Quick path를 2-3회 반복하면 pool이 소진됨. 재방문 사용자에게 "다른 프로토콜 체험하기"가 무의미해짐.

**제안**:
- "다른 프로토콜 체험하기" 선택 시 pool 소진 여부 확인
- pool 소진 시 확장 pool로 전환: `/clarify`, `/inquire`, `/bound` 추가 (AI-guided 프로토콜 중 체험 가능한 것)
- 확장 pool에도 Pick-1과 동일한 signal 매칭 + evidence 카드 구조 유지
- `/grasp`, `/attend`는 user-initiated이므로 확장 pool에서도 제외
- Rule #3 수정: "첫 만남(first encounter)에서는 3개만, 재체험 시 확장" 으로 조건부 완화

**영향 범위**: Phase 2a Pick-1, Rule #3, 추가 signal 패턴 + evidence 템플릿 필요

---

### Proposal 3: Phase 0 개인화 안내 scope 축소

**상태**: 미구현

**현재 상태**: Phase 0 AskUserQuestion #1이 3개 옵션 + 한글 설명 포함:
```
- "Quick recommendation — 최근 작업 기반으로 지금 가장 도움될 1가지를 보여주세요"
- "Targeted learning — 특정 프로토콜을 골라서 배워볼게요"
- "Browse all — 먼저 전체 프로토콜을 보고 싶어요"
```

**문제**: 옵션 설명이 길어서 첫 인상이 무겁고, "Quick recommendation"이 기본값이라는 암시가 부족함.

**제안**:
- 옵션 텍스트 간결화:
  ```
  - "바로 추천 받기 (Recommended)"
  - "프로토콜 골라 배우기"
  - "전체 목록 보기"
  ```
- 첫 번째 옵션에 `(Recommended)` 표시로 기본 경로 강조
- 부가 설명은 AskUserQuestion의 `description` 필드로 이동 (label은 짧게)

**영향 범위**: Phase 0 AskUserQuestion #1 텍스트만 변경. 흐름 변경 없음.

---

### Proposal 4: Targeted path AskUserQuestion #2에 카탈로그 정보 전달

**상태**: 미구현

**현재 상태**: Targeted path에서 프로토콜 미지정 시 AskUserQuestion #2:
```
- "Pre-execution (Planning) — /clarify, /goal, /bound, /inquire"
- "Analysis/Decision — /frame, /ground, /gap"
- "Execution/Verification/Understanding — /attend, /contextualize, /grasp"
```

**문제**: 카테고리 + 슬래시 커맨드 나열만으로는 각 프로토콜이 "언제 필요한지" 판단이 어려움. Browse all 경로에서는 카탈로그(When to Use)를 보여주지만, Targeted 직행 시에는 이 정보가 없음.

**제안**:
- AskUserQuestion #2 호출 전에 간소화된 카탈로그를 텍스트로 출력:
  ```
  Planning:
    /clarify — AI가 내 의도를 자꾸 오해할 때
    /goal — 원하는 건 있는데 목표가 불명확할 때
    /bound — AI에게 뭘 맡기고 뭘 내가 할지 정할 때
    /inquire — AI가 맥락 없이 바로 실행하려 할 때

  Analysis/Decision:
    /frame — 어떤 관점으로 분석할지 모를 때
    /ground — 추상적 조언이 내 상황에 맞는지 확인할 때
    /gap — 커밋/배포 직전 놓친 게 없는지 점검할 때

  Execution/Verification:
    /attend — 위험한 실행을 단계별로 통제할 때
    /contextualize — 결과는 맞는데 맥락에 안 맞을 때
    /grasp — AI 작업을 승인했지만 이해 못 했을 때
  ```
- Data Sources 테이블의 "When to Use" 컬럼을 한글 1줄로 요약
- Browse all과 동일한 설치 배지는 생략 (선택 목적이 다름)

**영향 범위**: Phase 0 AskUserQuestion #2 앞에 텍스트 출력 추가. 흐름 변경 없음.
