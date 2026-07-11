# 방향 unknowns 노출용 "발산-폐기 인스턴스화" 프로토콜 — 구현 계획 v2 (#606)

> 이슈 #606의 구현 계획 **v2**. 동일 경로의 v1을 대체(supersede)하며 v1은 git
> 이력에서 열람 가능하다. 결여의 서명은 v1과 동일(**복수(plural) · 가짜데이터 ·
> 커밋전 · 발산(divergent)**)이나, v1이 게이트로 남긴 A-vs-B가 본 세션에서
> **B(형제 프로토콜 신설)로 구성**되었고 결핍·정체성·형식블록·배선이 재도출되었다.
>
> **경계**: 이 문서는 설계-계획 단계까지다. SKILL.md 저작·배선·검증은 §10의 후속
> 세션 4단계로 위임한다. §2의 조건부 단서는 M6 → /sublate → codex 라운드3 →
> /ascend 증거 군집 → 사용자 최종 구성(2026-07-10)으로 **해소** — B-첫클래스
> **확정** (경위: §2.2).

---

## 1. 방법 기록: v1→v2 델타

### 1.1 도출 방법의 차이

- **v1**: `/elicit`(결정 좌표 역추적) × `/gap`(미검토 결여 표면화) **단독 조합**으로
  도출. A-vs-B는 근거와 함께 B를 권고하되 **사용자 게이트 상태로 종결**.
- **v2**: 지휘 계획(hyphegesis `/conduct`) 하에 **4갈래 증거**를 수집해 A-vs-B를
  결정으로 구성:
  1. **codex gpt-5.5 xhigh 격리 자문** — B 지지. 근거는 타이핑: 구별되는
     (deficit → resolution) 쌍은 별도 프로토콜이라는 스위트 정체성 기준.
  2. **M1 계약 실측** — `/ground` 형식블록의 계약 수준 재측정: (a) 스킬은 독립
     SKILL.md 계약이라 기계 **재사용 불가**(구조 패턴 참조만 가능), (b) 기존 16개
     프로토콜에 **복수 종단(벌거벗은 Set codomain) 선례 없음** — 모든 종단은 단일
     레코드, (c) **변경규모 비대칭** — 2모드화는 `/ground` 형식 표면을 약 2배로
     부풀리는 반면 신설은 표준 배선 목록(§9)으로 닫힌다.
  3. **`/elicit` 2사이클** — (a) "만들기(수단)"와 "인식(목적)"의 분리 검증,
     (b) 실물-기구 계보를 `/ground`가 아닌 **aitesis(ObservationSpec)**로 재배치,
     (c) 프로토콜 자체 Northstar를 레포 Northstar 4개 절(unknowns 발화 유도 ·
     편향 없는 주의 제약 · 국소 오정렬 근원 해소 · bounded loop)과 정렬.
  4. **사용자 CP1 구성** — 방향 명확 판정(결핍이 실존한다는 자기 경험 확인 포함)
     + **조건부 채택**: "인식론 범위가 성립하면 B로 간다." (단서는 이후 해소·확정 — §2.2)

### 1.2 v1과의 독립 수렴 지점

서로 다른 방법이 같은 지점에 도달한 곳은 결론의 신뢰 근거가 된다:

| v1 좌표 | v1 결론 | v2 독립 도달 | 수렴 |
|---------|---------|--------------|------|
| C4 재사용 경계 | 렌더 코어만 참조, 매핑-스코핑(M,F) 폐기 | M1 실측: 계약 수준 재사용 자체가 불가, 패턴 참조만 | 같은 방향 (v2가 더 강함) |
| C5 initiator | Hybrid | codex 자문·결핍 술어 분석 모두 Hybrid | 일치 |
| C6 종결/폐기 | durable record엔 방향 결정만, 목업은 세션-국소 폐기 | cleanup-바운드 Probe + `discard_trace` 종단 필드 | 일치 (v2가 폐기를 기구로 강제) |

### 1.3 v1 요소의 처분

- **보존**: C1–C6 좌표 프레임, G2(발산 축 보장) 해법(선언 축 구동), G6
  (reduced-space-test 무중복) 재확인, auto-discovery-first 관찰과 package.test.js
  하드코딩 카운트 경고, Greek 이름 후보 중 Proplasma.
- **대체**: deficit 이름(`DirectionLatent` → `DirectionUnrecognizable`, §3), 커맨드
  (`/sketch` → `/preview` vs `/contrast` 병기, §6), G1 결론(세션텍스트 렌더 권고 →
  **계층화된 실현**, §5), 종단 타입(`Promoted(variant)` 처분 제거 — 폐기 강제, §7),
  엣지 세트(3개 → 5개, §8), 배선 목록(M1 실측으로 갱신, §9).

---

## 2. 결정 기록: A 기각, B 채택 (확정)

### 2.1 (A) `/ground` 2모드 확장 — 기각

기각 근거: **코도메인/deficit 이중화가 의미를 희석한다.** `/ground`의 정체성은
`MappingUncertain → ValidatedMapping`(단일 매핑의 검증)이다. 여기에
`DirectionUnrecognizable → DirectionalContrast`(복수 발산의 대비)를 얹으면 한
스킬이 두 (deficit, codomain) 쌍을 가져 per-skill 타이핑 기준을 위반하고, 활성화·
수렴·게이트 구조가 모드 분기로 이중화되어 semantic-closure 유지보수 부채가 된다.
**codex 스틸맨 포함**: codex 자문은 A안을 최강 형태로 재구성한 뒤에도
("instantiate 기계 공유는 표면 논거일 뿐, 계약 수준에서는 공유할 기계가 없다")
같은 결론에 도달했다 — M1 실측 (a)와 독립 일치.

### 2.2 (B) 형제 프로토콜 신설 — 확정 (해소 경위)

사용자 CP1의 채택은 당초 조건부였다("**인식론 범위가 성립하면** 채택"). 그 단서는
다음 경위로 해소되어 B-첫클래스는 **확정**이다: **M6 codex 반박 라운드**가 §5
초판에 FAILS 판정(초판 형태로는 소속 불성립) → **/sublate 반론 4건**(S1–S4) →
**codex 라운드3 평가**(S1 동의+수정 · S2 동의 · S3·S4 수정 — 수정 반영분이 §5의
수리형) → **증거 3채널 완성(/ascend 군집)**: 원칙-위임 답변 원문 4건(세션
91c5f8dd · d2a5b290 · 1608149c, 2026-06-10~17) · 선택지 밖 해석학적 재구성 3표집
· 05-03 프레임-정지 장면(d113dd04, /recollect로 인지) (상세: §3.3) → **사용자
최종 구성(2026-07-10)**: 위 증거와 수리형 §5 위에서 B-첫클래스를 구성적으로 확정.

**기각 기록 (근거와 함께 보존)**: codex의 유틸리티-우선 권고("가시성 소비자
3개(/elicit·/bound·/contextualize)뿐, 사용 증거 축적 전의 첫클래스화는
시기상조")는 검토 후 **기각**. 근거: (i) 레지스트리 가시성은 소비자 수의 함수가
아니라 라우팅 가능성의 전제 조건(§5(d)), (ii) /ascend 군집이 이미 라우팅 수요를
실증 — "축적 전"이라는 전제가 사실과 다르다.

**착지**: 워크트리 → feature branch → PR.

---

## 3. 결핍 (뾰족한 형태)

### 3.1 이름

- **권고: `DirectionUnrecognizable`** — 결핍의 핵심이 "방향이 잠복해 있다"(v1
  `DirectionLatent`)가 아니라 "방향 후보가 **서술로는 인식 불가**하다"임을 직접
  가리킨다. A1의 어휘(recognizable)와 정합.
- 대안(v1): `DirectionLatent` — 방향 미정 상태까지 포괄하나 그 상태는
  `/frame`·`/elicit`의 관할(후보 생성)이므로 과포괄. 병기 후 전자 권고.

### 3.2 술어

```
DirectionUnrecognizable ⟺
    pre_commit(방향 결정)              -- 커밋 직전
  ∧ |direction_candidates| ≥ 2         -- 대안이 이미 존재
  ∧ route(§3.4) = ④                    -- 4단 라우팅이 ④로 귀착 (①–③ 전부 부정)
  ∧ fake_data_sufficient               -- 타입 가드: 대비가 실증거 없이 성립 (§7.1)
  ∧ placeholder_fidelity               -- 타입 가드: 발산 축의 differential futures를 왜곡 없이 운반 (§7.1)
```

초판의 인식-불가 경성 conjunct(`¬recognizable_from_description` —
understood(options)의 부정형)는 **4단 라우팅 우선순위**(§3.4)로 교체 — 인식 불가는
①–③ 라우팅의 잔여로 판정된다. 타입 가드 2종은 초판 `cheap(placeholder 구체화)`를
흡수·정밀화한다 (형식화: §7.1 TYPES).

A1 원문이 이 결핍의 축을 정확히 명명한다:

> "Gate options that present labels without differential futures reduce to
> recall-in-disguise — the user must **mentally simulate** consequences rather
> than **recognize** them from the presented structure." (axioms.md §A1)

즉 이 결핍은 **A1이 본문에 명명한 잔여 실패모드**다: 게이트가 구조적으로 완벽해도
함의가 **언어로 전달 불가능한 종류**일 때 사용자는 머릿속 시뮬레이션으로 떨어진다.
(A1은 이 실패모드를 명명할 뿐 해소 기구를 면허하지 않는다 — 소속 논거: §5(a).)

### 3.3 감지 신호 — 3형상 감지 서명 (Layer 2)

결핍은 세 가지 표면 형상으로 감지된다. 전부 /ascend 증거 군집의 실측 퇴적물이다
— **군집 요약: 8퇴적물 / 2개월 / 단일 프로젝트**:

- **(a) 원칙-위임 답변** — 방향 게이트에서 사용자가 방향을 고르지 못하고 판단을
  원칙으로 위임: "northstar에 정합한 방향으로 진행", "권장방향이라면 진행" 등
  **원문 4건** (세션 91c5f8dd · d2a5b290 · 1608149c, 2026-06-10~17).
- **(b) 선택지 밖 해석학적 재구성** — 제시된 선택지를 고르는 대신 선택지 자체를
  재구성하는 응답, **3표집**.
- **(c) 구체화 요구·결정 정지** — 서술 선택지 앞에서 결정이 정지하고 구체물을
  요구: 05-03 프레임-정지 장면 (**d113dd04**, /recollect로 인지 — /bound-인접
  라우팅 미스 표본, §8), **92480a35**. 초판의 /bound 사용 회고("가까운 미래를
  보고 싶다" 욕구의 경계 선택 오분류 자기 보고)는 이 형상의 초기 표본으로 흡수.

*세션 id들(91c5f8dd 등)과 "codex R9/R12" 류 토큰은 저작 환경의 세션-사적 증거
식별자로, 실행에는 불요하며 출처 추적용으로만 보존된다 — 수신 세션에서
재관측 불가함이 정상.*

**A2-침식 함의 (결핍의 심각도 근거)**: "권장방향이라면 진행"은 단순한 선호 위임이
아니라, differential futures를 인식하지 못한 사용자가 **구성적 판단(Constitution)을
AI에 이양**하는 장면이다 — 인식 실패가 A2의 detection/judgment 분리를 침식한다.

### 3.4 과잉발동 가드 — 4단 라우팅 우선순위

라우팅 이전 관문: differential futures가 **텍스트로 인식 가능**하면 결핍 부재 —
일반 게이트로 충분하다(프로토콜 불필요). 그 다음 ①→④ 순서로 첫 매치가 이긴다:

| 순위 | 조건 | 라우팅 |
|------|------|--------|
| ① | 익숙한 도메인으로의 **구조 매핑이 가능** | `/ground` (analogia — 구조 매핑 검증) |
| ② | **실증거**가 필요 (진짜 데이터·실환경 검증) | `/inquire`(사실 unknowns) · `/reduced-space-test`(실증) |
| ③ | **방향 후보/프레임 자체가 부재** | `/frame`(프레이밍) · `/elicit`(좌표 역추적) |
| ④ | 후보 ≥ 2 ∧ 증거 불요 ∧ `fake_data_sufficient` ∧ `placeholder_fidelity` | **신규 프로토콜** |

주석: 이해가 **물질화를 통해서만** 오는 경우 probe가 **이해+방향 판단을
겸무**한다 — 이때도 라우팅은 ④다(①의 매핑이 없고 ②의 실증거가 불요하므로).

---

## 4. 프로토콜 자체 Northstar + 카탈로그 한 줄

세션 합의 문장 그대로:

> **Northstar**: 방향 선택지가 말로는 알아볼 수 없을 때, 폐기 전제의 값싼 구체물
> 대비로 각 방향의 미래를 알아볼 수 있게 만들어, 커밋 전에 방향 판단을
> 시뮬레이션이 아닌 인식 위에서 구성한다.

> **카탈로그 한 줄 (when-to-use)**: 커밋 직전인데, 방향 후보들이 말로는 판단이
> 안 서고 직접 봐야 알 것 같을 때.

---

## 5. 인식론적 소속 논거 (수리형)

> 이 절이 §2.2 확정의 성립 주장이다. 초판은 M6 codex 반박 라운드에서 FAILS 판정을
> 받았고, /sublate 반론 4건 + codex 라운드3 평가를 거쳐 수리형으로 전면
> 재작성되었다 (경위: §2.2).

**(a) A1은 제약이지 면허가 아니다 — 결핍은 별도의 실증 결핍.** 초판은 "A1의
완성"을 소속 근거로 삼았다(공리가 프로토콜을 요청한다는 구도). 수리형은 방향을
뒤집는다: A1은 게이트가 갖춰야 할 **제약**을 명명할 뿐, 특정 해소 기구를 면허하지
않는다. 소속 근거는 A1 본문이 이미 명명한 잔여 실패모드 — "labels without
differential futures → recall-in-disguise" (axioms.md §A1) — 를 다루는 **별도의
실증 결핍**이 실존한다는 것이다. §3.3의 /ascend 군집(8퇴적물/2개월/단일 프로젝트)이
그 실존 증거다 — 공리가 아니라 **증거가** 프로토콜을 정당화한다.

**(b) aitesis ObservationSpec — cleanup 수명주기 선례로만 인용.** 초판은 aitesis의
동적 관찰 조항(A2)을 "instantiation은 relay"의 직접 근거로 삼았다. 수리형은 유비의
한계를 명시한다: ObservationSpec의 산출은 **증거**(관찰 결과가 주장을 지지)인 반면
신규 probe는 **비증거**(§7.4 오염 가드)다. 따라서 aitesis는 "실물 기구를 만들고
cleanup을 강제하는" **수명주기 선례**로만 인용하며, 관찰-relay 지위의 이전 근거로는 쓰지 않는다.

**(c) 생성 분류 = transform 연산 — 생존 사슬과 파탄 조건.** probe 생성은 A2
관찰-relay가 아니라 **transform 연산**이다 — 선례: epharmoge TOOL GROUNDING의
`adapt (transform) → Edit, Write` (epharmoge/skills/contextualize/SKILL.md:150, "tool call that
changes existing artifacts; medium-agnostic"). transform은 다음 **생존 사슬** 안에서만 합법이다:

```
Constitution 스펙 게이트 (발산 축 + placeholder 정책 확정)
  → transform 생성 (temp-격리 · cleanup-등록 · 가시적 합성 · 비증거)
  → relay 대비 제시 (축별 병치)
  → Constitution 방향 결정
  → cleanup 검증 (discard_trace)
```

**파탄 조건 3종** — 하나라도 위반하면 프로토콜은 frame식 **정지-핸드오프로
강등**된다(transform 지위 상실):
1. **게이트 후 축 선택** — 스펙 게이트 없이 또는 게이트 이후에 발산 축을 AI가 선택
2. **영구 프로젝트 파일 쓰기** — temp-격리 밖 기존 프로젝트 파일 변경
3. **probe의 증거 취급** — placeholder 구체물을 어떤 주장의 근거로 인용

**(d) 첫클래스 근거 = certify-레지스트리 가시성 + 라우팅 수요 실증.** 유틸리티
(레시피)와 프로토콜의 차이는 **레지스트리 가시성**이다: 형제 프로토콜의 certify
파이프라인(소비자: `/elicit` · `/bound` · `/contextualize`)은 **그래프-등록 결핍**
에 대해서만 라우팅한다 — 유틸리티의 deficit 선언은 레지스트리에 비가시라 라우팅
대상이 될 수 없다(기존 유틸리티 `/probe`(epistemic-cooperative)가 그 증례).
그리고 /ascend 군집이 라우팅 수요를 실증한다: **d113dd04는 /bound-인접 라우팅
미스 표본** — 결핍이 레지스트리에 없어 형제 게이트가 이관하지 못한 장면이다.
**codex 반론과 기각 근거 (병기)**: "가시성 소비자 3개뿐, 증거 축적 전 첫클래스화는
시기상조 — 유틸리티로 시작하라." 기각: (i) 레지스트리 가시성은 소비자 수의 함수가
아니라 라우팅 가능성의 **전제** — 유틸리티로 시작하면 d113dd04류 라우팅 미스가
구조적으로 재생산된다; (ii) 증거는 이미 축적되어 있다(/ascend 군집 8퇴적물).
§2.2 기각 기록과 동일 사안.

**실현 계층 (보존 — v2 초판 (5)항)**: 최소 실현은 **텍스트 비네트 probe**(각 방향을
placeholder 데이터로 채운 구체 시나리오 서술 — 하니스 도구 없이 성립, A4), 고급
실현은 병렬 에이전트의 temp-격리 실물 목업. 프로토콜 의미는 실현 계층과 독립이며,
v1 G1 게이트(세션텍스트 vs 실파일)는 이 계층화로 해소된다(§1.3). 자기잠식
반론("서술로 안 되는 결핍을 서술로 푼다") 방어: 비네트는 라벨-서술이 아니라
placeholder-**구체물** 서술이라는 층위 차이.

---

## 6. 정체성 제안

### 6.1 Greek 이름

- **권고: Proplasma** (πρόπλασμα) — 조각가가 대리석에 커밋하기 **전에** 만드는
  예비 점토 모형. 커밋전·값쌈·폐기·방향확인이 어원에 전부 들어 있다. (v1과 수렴)
- 대안: **Hypotyposis** (ὑποτύπωσις, 생생한 밑그림 — 수사학 용어) — "보이게
  만든다" 축 강조, 단 복수·대비 축이 없음.
- 대안: **Antiparabole** (ἀντιπαραβολή, 대조 병치) — 대비 축 강조, 단 커밋전·폐기
  축이 없음.

### 6.2 커맨드 — 병기, PR 리뷰서 확정 (§11-①) (→ §12에서 확정; 본 문구는 이력)

| 후보 | 충돌 검사 | 비고 (codex R12) |
|------|-----------|------------------|
| `/preview` | README.md · marketplace.json · 전체 스킬 디렉터리 무일치 | "커밋 전에 미래를 미리 본다"가 카탈로그 한 줄과 일대일. 단 리포에 "preview"가 **렌더 기질 용어로 기존 사용**(comment-review · triage · image-companion 등) — 용어 중첩 |
| `/contrast` | 무일치 | 종단 타입 `DirectionalContrast` · morphism `contrast` 단계와 **정합** |
| `/probe` | **충돌** — `epistemic-cooperative/skills/probe/` 기존재 (README.md:97) | 불가 |

v2 초판의 `/preview` 단독 권고는 codex R12로 재개방 — 두 후보 **병기**, PR 리뷰에서 확정한다.

### 6.3 Type 서명 · initiator

```
(DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast
```

MODE STATE 이름(`PREVIEW`)은 커맨드 확정(§11-①)을 따른다(`/contrast` 확정 시
`CONTRAST`). Initiator: **Hybrid** — 사용자 발화("봐야 알 것 같다")가 우세하되, AI가
§3.3의 3형상에서 결핍을 감지해 넛지할 수 있음. v1 C5와 수렴.

---

## 7. 형식블록 스케치 (설계 수준 — 완전한 SKILL.md 아님)

### 7.1 TYPES

```
── TYPES (sketch) ──
DirectionProspect   = 커밋 직전의 방향 결정 대상 (input; 후보 방향 ≥ 2 포함)
DirectionAxis       = 선언된 발산 축 — probe들이 서로 다른 값을 커밋해야 하는 방향 unknown
DetectGuards        = 타입 가드 2종 (§3.2 · §3.4-④):
                        fake_data_sufficient : 방향 대비가 실증거 없이 placeholder 구체물만으로 성립
                        placeholder_fidelity : placeholder 구체화가 발산 축 위의 differential futures를 왜곡 없이 운반
PlaceholderPolicy   = 가짜 데이터 규약 { 가시적 합성(명백히 placeholder임이 보임),
                                          비증거 낙인(probe는 어떤 주장의 증거도 아님) }
Probe               = cleanup-바운드 기구 { direction, axes_realized: Map(DirectionAxis, Value),
                                             artifact_ref, cleanup }
ContrastMap         = 축별 대비 — DirectionAxis마다 각 probe가 노출한 미래의 병치
ExposedUnknown      = 대비가 새로 드러낸 방향 unknown (커밋전 점검 대상)
DirectionalContrast = 단일 레코드 {                        -- 종단; M1 관례 준수:
                        contrast_map:    ContrastMap,      --   Set은 필드로 감쌈,
                        exposed_unknowns: Set(ExposedUnknown), -- 벌거벗은 복수 종단 금지
                        direction:       UserDecision,     --   (codex 제안형과 합치)
                        discard_trace:   폐기 검증 기록 }
```

### 7.2 MORPHISM

```
── MORPHISM (sketch) ──
DirectionProspect
  → detect                       -- §3.2 술어 검증 + §3.4 4단 라우팅 (타입 가드 2종 포함)
  → derive_axes                  -- 발산 축 후보 도출 (/elicit 계열 역추적 패턴)
  → set_placeholder_policy       -- 가시적 합성·비증거 낙인 정책 초안
  → gate_spec                    -- Constitution 스펙 게이트: 발산 축 + placeholder 정책 확정 (§5(c) 파탄 조건 1: 게이트 후 축 선택 금지)
  → instantiate_probes           -- transform 연산 (§5(c) 생존 사슬; epharmoge adapt 선례) — ∥ (병렬), isolated (temp-격리), cleanup-등록, |probes| ≥ 2
  → contrast                     -- 축별 병치 → ContrastMap + ExposedUnknowns
  → present                      -- 축별 대비 relay (pre-gate 텍스트, A6 분리)
  → constitute                   -- 방향 판단, Constitution 게이트 — 선택지가 probe로 물질화된 게이트
  → cleanup_verify               -- 모든 probe artifact 폐기 검증 → discard_trace
  → DirectionalContrast
```

### 7.3 Phase 구조 + TOOL GROUNDING 스케치

- Phase 0 detect/derive_axes/set_placeholder_policy — 분석·라우팅 (relay)
- Phase 1 gate_spec — 스펙 게이트 `(constitution)` — 발산 축 + placeholder 정책 확정
- Phase 2 instantiate_probes — `[Write]`/`[Agent]` temp-격리 `(transform)` — §5(c) 생존 사슬; 기존 프로젝트 파일 무변경 제약 (epharmoge `adapt (transform)` 표기 선례)
- Phase 3 contrast/present — 세션텍스트 relay `(extension)`
- Phase 4 constitute — 방향 게이트 `(constitution)`
- Phase 5 cleanup_verify — artifact 추적·폐기 확인 `(extension)`

### 7.4 가드 4종

1. **피상 발산 가드**: probe들은 **gate_spec에서 확정된 축 위에서** 갈려야 한다 —
   표면 변주(색·이름·순서)만 다른 N개는 발산 미성립.
2. **오염 가드**: probe는 **비증거** — placeholder 인스턴스를 이후 어떤 주장의
   근거로도 인용 금지 (PlaceholderPolicy의 낙인이 표식; §5(c) 파탄 조건 3).
3. **고착 가드**: 종단 가치는 `contrast_map`이지 목업이 아니다 — **목업 폐기 강제**
   (v1의 `Promoted(variant)` 처분 제거; 방향이 정해져도 probe는 버리고 실구현은 새로 시작).
4. **과잉발동 가드**: §3.4 4단 라우팅 우선순위.

### 7.5 LOOP

probe 기본 2–4개. 대비가 불충분하면 **재-팬(re-fan) 최대 1회**(bounded loop —
레포 Northstar 준수). 그 후에도 불충분하면 결핍 오진으로 보고 §3.4 라우팅으로
이관. 기본 개수·재-팬 상한 확정은 §11-③.

**의미폐쇄 미비 — 구현 단계 체크리스트로 명시 이관**: 본 스케치는 설계 수준이라
의미폐쇄가 미완이다 — `UserDecision` 타입 미정의, `artifact_ref` 규약, cleanup
실패 분기(discard_trace 부분 실패), 재-팬 종결식 등. §10-① 저작 단계의
semantic-closure 스윕 체크리스트로 이관한다.

---

## 8. 그래프 배선

노드 신설 + **advisory 엣지만** (suppression·precondition 불필요 — deficit 분리,
범용 `* → katalepsis` 엣지가 자동 커버):

| 엣지 | 근거 |
|------|------|
| `prothesis(/frame) → 신규` | 프레이밍이 방향 후보를 공급 |
| `euporia(/elicit) → 신규` | 역추적된 좌표의 미래가 인식 불가할 때 이관 |
| `horismos(/bound) → 신규` | **실측 인용**: d113dd04 (05-03 프레임-정지 장면, /recollect 인지) — /bound-인접 **라우팅 미스 표본**; /bound 사용 회고("가까운 미래를 보고 싶다" 욕구의 경계 선택 오분류)도 같은 형상 (§3.3(c)) |
| `신규 → syneidesis(/gap) · aitesis(/inquire)` | 노출된 unknowns의 하류 **병기** — 커밋전 점검(`/gap`) · 사실 unknowns 조사(`/inquire`). 병기 확정: §11-④ |
| `신규 → analogia(/ground)` | **생존 방향의 익숙-도메인 구조 매핑 검증 (매핑 존재 시)** — analogia는 구조 매핑 검증이지 임의 방향 검증이 아니다 (codex R9) |

표는 5행이지만 4행(`신규 → syneidesis · aitesis` 병기)이 graph.json에서 2개의
edge 객체로 직렬화되므로 **graph.json 객체는 6개**다 (graph.json edge = 단일
source/target 쌍).

### 클러스터

- **권고: Planning** — unknowns **유도** 계보의 완성(`/inquire` 사실 · `/elicit`
  의도 · **신규** 방향). 단 **미확립 — PR 리뷰서 확정** (codex R9) (→ §12에서 확정; 본 문구는 이력).
- 대안 병기: codex 제안 **Analysis** — `/frame → 신규 → /ground` 슬롯. §11-② 확정.

### 구분 테이블 삼분법 (distinction 편집의 핵심 문장)

- **이해 부족** → `/grasp` (내가 이해했는지 검증)
- **경계 부족** → `/bound` (어디까지인지 확정)
- **미래 인식 불가** → **신규** (어느 방향인지 보고 판단)

### reduced-space-test와의 구분 (v1 G6 재확인)

`/reduced-space-test` = **사후 · 실증거 · 단일** 검증 vs 신규 = **커밋전 · 가짜 ·
복수** 대비. 겹치는 축 없음.

---

## 9. 기계적 배선 목록 (M1 실측 그대로)

### 신규 파일 (~5–6)

```
{new}/                              # proplasma (확정 이름으로 대체)
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json         # version은 claude 매니페스트와 동일 (enforced)
  skills/{command}/SKILL.md         # 디렉터리명 = 커맨드 (§11-① 확정 후)
  README.md
  README_ko.md
```

### 필수 편집 (~10)

1. `.claude/skills/verify/graph.json` — 노드 + §8 엣지 (5행(직렬화 6객체); 하류 병기 확정은 §11-④)
2. `.claude-plugin/marketplace.json` — plugins[] 항목
3. `scripts/load-protocols.js` — `CANONICAL_PRECEDENCE` + `CANONICAL_CLUSTERS`
   (클러스터 문자열은 README×2와 정확 일치 요구 — drift 시 fail)
4. `scripts/package.js` — `FIRST_RELEASE_HIGHLIGHTS` (v1의 "package.js는
   auto-discovery가 흡수" 관찰에 대한 M1 정정: 이 상수는 손수 편집)
5. `README.md` — 프로토콜 표 행 + 그리스어 표 + 클러스터 행
6. `README_ko.md` — 동일 3개소 (한국어)
7. `epistemic-cooperative/skills/onboard/SKILL.md` — "16 protocols" → 17 + Data
   Sources/Phase 0 그룹핑
8. onboard `references/scenarios.md` + `references/workflow.md` — 커맨드 refs
9. `epistemic-cooperative/skills/catalog/SKILL.md` — 이름 + 커맨드
10. `src/App.tsx` + `src/lib/i18n.tsx` — 프로토콜 카운트/배지

부수: `scripts/package.test.js` 하드코딩 카운트(views·protocols 배열·zip 목록)는
v1 관찰이 여전히 유효 — 갱신 전 test fail이 정상이며 갱신 자체가 체크리스트다.

### distinction/precedence 편집 — ALL existing SKILL.md (정정)

**co-change.md:15 원문이 권위원** — "New protocol added" 행: "**ALL existing
SKILL.md (precedence descriptions + distinction tables)**". v2 초판의 "엣지 스코프
6개" 한정은 오독이었다: 갱신은 그래프 엣지 인접이 아니라 **기존 SKILL.md
전체(16개 프로토콜)**에 적용 — 각각 distinction 행/precedence 서술 + `plugin.json` 버전범프.

---

## 10. 구현 순서 (후속 세션용 4단계)

| 단계 | 작업 | 완료 기준 |
|------|------|-----------|
| ① SKILL.md 저작 | **형식블록 먼저**(FLOW→MORPHISM→TYPES 순서 enforced, PHASE TRANSITIONS, MODE STATE, TOOL GROUNDING) → 프로즈. CLAUDE.md Editing Conventions 준수(표기 `→`/`∥`/`[Tool]`, prime 규약) | semantic-closure 스윕 수동 통과: §7의 모든 조건이 타입·가드·상태갱신·종결경로·결과식을 가짐 — §7.5 말미의 이관 체크리스트(UserDecision · artifact_ref · cleanup 실패 분기 · 재-팬 종결식) 소진 포함, §12.2–§12.5 이관 항목(probe-먼저 제시 순서 · 파탄조건-모먼트 매핑 · PlaceholderPolicy 골격-충실·데이터-가짜 분할 · 재-팬 미세게이트의 스펙 게이트 겸직 · 방향 게이트 응답 3종(선택·종합·심문) 규율 · transform 중 강제된 공통 커밋의 대비 보고 · 폐기 경계(파일 파기=충족·세션 잔존 허용·비증거 낙인 관통) · 재-팬 예산 공유(대비-불충분과 종합-물질화가 1회 공유)) 소진 포함 |
| ② 배선 | §9 신규 파일 + 필수 편집 10개 + 카운트 갱신 | 클러스터 문자열 README×2 일치, graph.json 노드/엣지 반영, 카운트 정합 |
| ③ 전체 distinction/precedence + 버전범프 | **ALL existing SKILL.md**(16) distinction/precedence 행 + plugin.json bump | co-change.md:15 스코프 소진, 삼분법 문장(§8) 반영 |
| ④ 검증 및 PR | `node .claude/skills/verify/scripts/static-checks.js .` + `node --test scripts/package.test.js anamnesis/scripts/hypomnesis-write.test.mjs`(정적 검증과 **동시 실행 금지**) + `/verify` → feature branch PR | static-checks 0 fail, 테스트 통과, PR 생성(커밋 규약 `feat(<plugin>): 한국어 설명`) |

---

## 11. 잔여 미해결 결정

**해소됨 — 인식론 소속 단서** (초판 §11-①, 최우선 항목): M6(FAILS) → /sublate
반론 4건 → codex 라운드3 → /ascend 증거 3채널 → 사용자 최종 구성(2026-07-10).
경위는 §2.2, 수리형 논거는 §5. 초판 공격 목록의 과잉발동 가드 충분성(⑥)·A4
비네트 긴장(⑦)은 각각 §3.4 4단 라우팅 재구성과 §5 실현-계층 보존 노트에 흡수.

잔여 (PR 리뷰·구현 단계에서 확정) — **전 4건 §12에서 확정 (2026-07-12)**:

1. **명명** — `/preview` vs `/contrast` **병기, PR 리뷰서 확정** (codex R12:
   "preview"는 리포에 렌더 기질 용어로 기존 사용, `/contrast`는 종단 타입
   `DirectionalContrast` · morphism `contrast` 단계와 정합 — §6.2; Greek 이름은
   Proplasma 권고 유지, §6.1).
   → **확정: Proplasma + `/preview`** (MODE STATE `PREVIEW`, `skills/preview/`).
   상세 및 잔여 용어 중첩 노트: §12.1-①.
2. **클러스터** — Planning(unknowns 유도 계보) vs Analysis(codex 워크플로 슬롯).
   권고 Planning, **미확립 — PR 리뷰서 확정** (§8).
   → **확정: Planning**. 상세: §12.1-②.
3. **probe 기본 개수(2–4) · 재-팬 상한(1) 확정** — 값싼-탐색과 대비 충분성의
   균형 검증 (§7.5).
   → **확정: 기본 2–4개 · 재-팬 상한 1회 승인**. 상세: §12.1-③.
4. **엣지 세트 최종화** — 5행(직렬화 6객체) advisory(+하류 `/gap`·`/inquire` 병기)의 과다/과소
   판단 (§8).
   → **확정: advisory 5종 + 하류 병기 승인**(anamnesis→신규 추가 후보는 미채택).
   상세: §12.1-④.

**구현 단계 이관**: §7 형식블록 스케치의 의미폐쇄 미비 항목(`UserDecision` ·
`artifact_ref` · cleanup 실패 분기 · 재-팬 종결식 등)은 §10-① 체크리스트로 명시 이관 (§7.5 말미).

---

## 12. UX 설계 (확정) — 본 세션 결정 기록

§11 잔여 4건이 본 세션에서 전부 확정되었고, 그 확정 위에서 상호작용 설계(네
모먼트)와 개밥먹기 2회가 실행되었다. 이 절은 그 기록이다.

### 12.1 확정 4건

① **명명 = Proplasma + `/preview`** — MODE STATE `PREVIEW`, 스킬 디렉터리
`skills/preview/`. 사용자 직관 축을 우선했다: "커밋 전에 미래를 미리 본다"가
카탈로그 한 줄과 일대일 대응한다(§6.2). 종단 타입 `DirectionalContrast` ·
morphism `contrast` 단계 어휘는 형식블록 내부 표기로만 유지 — 명명 확정은 이
표기를 바꾸지 않는다. 렌더-기질 용어로서의 "preview" 중첩(comment-review ·
triage · image-companion 등, §6.2 codex R12 관찰)은 해소되지 않은 채 남는
잔여이며, 향후 문서화로 관리한다.

② **클러스터 = Planning** — unknowns 유도 계보(`/inquire` 사실 · `/elicit` 의도 ·
신규 방향)의 완성으로 §8 권고를 그대로 채택했다.

③ **probe 기본 2–4개 · 재-팬 상한 1회 승인** — §7.5 스케치 값을 구현자 판단
범위 내에서 그대로 확정했다.

④ **advisory 엣지 5종 승인** — §8의 5행을 그대로 채택하고, 하류 `/gap` ·
`/inquire` 병기도 유지한다. 검토된 추가 후보(anamnesis → 신규 엣지)는 이번
세션에서 미채택으로 기록한다 — 근거가 §8의 5행 범위를 넘지 않는다는 판단.

### 12.2 상호작용 설계 — 네 모먼트

**모먼트 1: 스펙 게이트** — 발산 축 · placeholder 정책 · probe 수 · 실현 계층을
게이트 앞 텍스트로 먼저 전개하고, 게이트 자체는 확정 질문만 담는다(A6 분리).
이 모먼트가 §5(c) 파탄 조건 1(게이트 후 축 선택)의 이행점이다 — 스펙 게이트를
통과하기 전에는 어떤 발산 축도 AI가 선택하지 않는다.

**모먼트 2: 생성 · 대비 제시** — 무상호작용으로 probe를 생성한 뒤, 제시 순서를
고정한다: **probe를 하나씩 먼저 보여주고 → 축별 대비 지도 → 새로 드러난
unknowns** 순서다. 표를 먼저 놓지 않는 이유: 표-먼저는 결핍의 재생산이다 — 표는
probe가 노출하는 구체물의 재추상화이므로, 표를 먼저 보면 사용자는 다시
서술(구조화된 서술이라도)로 판단하게 되어 §3의 결핍(서술로는 인식 불가)이
제시 순서 안에서 되풀이된다.

**모먼트 3: 방향 게이트** — 선택지의 함의는 라벨-서술이 아니라 probe가 이미
노출한 미래를 그대로 가리키는 지시여야 한다(A1의 "recognize, not simulate"를
게이트 표면에 직접 적용). 응답 종류는 3종: **선택 · 종합 · probe 심문**. 종합
응답(제시된 probe들을 사용자가 조합·재구성하는 응답)은 자체로 미세게이트가
된다 — 사용자가 그 자리에서 즉시 확정할지, 종합 내용을 새 probe로 재-팬
물질화할지를 다시 골라야 한다. 이 미세게이트가 필요한 이유는 AI가 "사용자의
종합이 이미 충분히 인식되었는지"를 스스로 측정할 수 없기 때문이다 — 인식
여부는 사용자만 판정 가능하다. 재-팬 예산(§7.5, 상한 1회)은 대비-불충분에
의한 재-팬과 종합-물질화에 의한 재-팬이 **1회를 공유**한다 — 두 사유가 별도
예산을 갖지 않는다.

**모먼트 4: 수확 → 폐기** — 순서를 고정한다: **수확이 폐기보다 먼저다**.
수확 내용은 (a) 확정된 방향, (b) 선택을 가른 대비 행(전체 대비 지도가 아니라
결정에 실제로 기여한 행만), (c) 상속되는 unknowns(§8 하류 엣지로 이관될
것들), (d) `discard_trace`. 비증거 낙인(§7.4 오염 가드)은 이 종결 기록까지
관통한다 — 수확된 대비 행도 이후 어떤 주장의 증거로 재인용되지 않는다.
durable record에는 방향 결정만 남고, probe 자체와 그 상세 서술은 세션-국소로
폐기된다(§9 착지 원칙과 정합).

### 12.3 파탄 조건 3종 준수 매핑

| 파탄 조건 (§5(c)) | 이행 모먼트 |
|---|---|
| ① 게이트 후 축 선택 | 모먼트 1 — 스펙 게이트 통과 전 AI 축 선택 금지 |
| ② 영구 프로젝트 파일 쓰기 | 모먼트 2 — 생성은 temp-격리, 기존 프로젝트 파일 무변경 |
| ③ probe의 증거 취급 | 모먼트 4 — 비증거 낙인이 수확 · 종결 기록까지 관통 |

### 12.4 개밥먹기 2회 기록

**1차 — calendar-ttu Lambda 배포 3갈래 반사실 재연.** 실현 계층은 텍스트
비네트(§5 실현 계층 보존 노트와 정합). 원 장면에서 사용자가 보인 원칙-위임
("권장 방식대로 진행")이 재연 조건 하에서는 직접 선택으로 전환되었다 — 정합
신호로 기록한다. 한계: n=1, 그리고 재연 참가자가 원 장면의 결말을 이미 아는
사후지식(hindsight) 상태였다는 제약이 있어, 이 결과를 일반화 근거로 과잉
해석하지 않는다.

**2차 — 합성 예시(세션 관제 대시보드 첫 화면 3방향), 실물 목업 계층.** HTML로
구현하고 스크래치패드에 격리했다. 전 경로를 실행했다: 심문 → 종합 →
재-팬(2변형) → 재게이트 → 실물 폐기. 목업 5개 파일 전부(5/5) 파기를 확인했다.

### 12.5 순환 수확 8건 (SKILL.md 저작 체크리스트 이관)

1. **PlaceholderPolicy에 "골격 충실 · 데이터 가짜" 분할 명시** —
   `placeholder_fidelity`의 운용 규칙으로 §7.1에 이미 정의된 타입 가드를
   구체 규약으로 보강한다.
2. **재-팬 미세게이트의 스펙 게이트 겸직** — 재-팬 시 옵션 함의에 새 발산
   축이 있다면 그 축을 명시하는 의무가 스펙 게이트의 §5(c) 파탄 조건 1과
   동일하게 승계된다.
3. **방향 게이트 응답 3종 및 심문 처리 규율** — 설계 의도에 관한 질문은
   placeholder 규율 안에서 즉답하고, 사실 unknown(실증거가 필요한 질문)은
   수확 이관 대상으로 분류해 `/inquire` 하류 엣지로 넘긴다.
4. **transform 단계에서 강제된 공통 설계 커밋은 대비 제시에 보고** — probe
   생성 중 모든 갈래에 공통으로 강제된 설계 결정(발산 축이 아닌 공통 전제)이
   있다면, 대비 제시(모먼트 2) 단계에서 그 사실을 명시해야 한다 — 그렇지
   않으면 사용자가 그 공통 전제를 발산 축으로 오인할 수 있다.
5. **폐기 경계 정의** — 파일 파기가 충족 조건이며, 세션 텍스트·대화 이력에
   probe의 흔적이 잔존하는 것은 허용된다. 단 비증거 낙인이 그 잔존 텍스트에도
   관통한다(§12.4의 discard_trace와 정합).
6. **(가) probe-먼저 순서 — 검증 결과** 1차 개밥먹기에서 실행됨, 마찰 관측
   없음. 단 관측 한계 명기: 읽기 행동(사용자가 실제로 어떤 순서로 주목했는지)
   자체는 텍스트 기반 개밥먹기에서 관측 불가능하므로, "효과가 있었다"는
   과잉 주장을 하지 않는다 — 마찰이 없었다는 관측만 성립한다.
7. **(나) 종합 경로 — 2차 실행으로 검증** 2차 개밥먹기(실물 목업)에서 종합
   응답 → 미세게이트 → 재-팬 물질화 경로가 실제로 실행되어 설계가 작동함을
   확인했다.
8. **미검증 잔여 — 재-팬 후 오진 이관 종결식** 재-팬 상한(1회) 소진 후에도
   대비가 불충분한 경우의 "결핍 오진으로 보고 §3.4 라우팅으로 이관"
   종결식은 이번 두 차례 개밥먹기 어느 쪽에서도 실행 경로를 타지 않았다 —
   **미검증**으로 표기한다. 이는 §7.5가 이미 이관해 둔 실패 경로이며, 구현
   단계에서 별도로 검증해야 한다.

---

*v2 작성: hyphegesis 지휘 계획 M5. 선행: M1 계약 실측 · M2 codex 격리 자문 ·
M3–M4 /elicit 2사이클 · CP1 조건부 채택. 후속 완료: M6(FAILS) → /sublate 4건 →
codex 라운드3 → /ascend 군집(8퇴적물) → 사용자 최종 구성(2026-07-10) —
**B-첫클래스 확정**(경위 §2.2). §11 잔여 4건은 §12(본 세션)에서 전부 확정되었다.
남은 것: §10 구현 4단계(워크트리→PR 착지).*
