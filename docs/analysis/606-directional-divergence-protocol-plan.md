# 방향 unknowns 노출용 "발산-폐기 인스턴스화" 프로토콜 — 구현 계획 (#606)

> 이슈 #606에 문서화된 결여의 세부 구현 계획. Thariq Shihipar "A Field Guide to
> Fable: Finding Your Unknowns"의 핵심 기법 — "가짜 데이터로 완전히 다른 러프
> 목업 몇 개를 만들어, 값쌀 때 방향을 확인하라" — 에 대응하는 형식 메커니즘을
> 스위트에 추가한다. 결여의 서명: **복수(plural) · 가짜데이터 · 커밋전 · 발산(divergent)**.
>
> 이 계획은 두 프로토콜을 방법으로 조합해 도출했다: `/elicit`(결정 좌표 역추적)와
> `/gap`(결정 지점별 미검토 결여 표면화). 방법 기록을 먼저 두고, 그 위에 권고를 쌓는다.
>
> **경계**: 이 문서는 계획 단계까지만이다. A vs B 최종 선택은 근거와 함께 권고하되
> 사용자 몫으로 남긴다(§열린 결정 참조). 전체 프로토콜 구현은 방향 확정 후 별도 작업.

---

## 0. 방법 기록: elicit × gap

### 0.1 역추적된 결정 좌표 (elicit)

이 구현이 **암묵적으로 요구하는** 결정 좌표를, 이슈와 기존 스킬 소스를 substrate로
역추적했다. 각 좌표는 기존 형식블록에 근거(basis)를 둔다.

| # | 결정 좌표 | substrate 근거 | 이 계획의 제안값 |
|---|-----------|----------------|------------------|
| C1 | **새 deficit의 정체성** — 기존 `MappingUncertain`과 구별되는 이름·술어 | 스위트는 각 프로토콜을 (deficit → resolution) 쌍으로 타이핑한다. `/elicit`의 certify 단계와 `graph.json` 노드 목록이 deficit 인벤토리를 소비한다 | `DirectionLatent` (방향-미정): 빌드가 커밋됐으나 어느 방향으로 만들지의 unknowns가 잠복 상태 |
| C2 | **codomain의 형태 — 복수성** | 기존 모든 프로토콜의 resolution은 **단일** 객체(`ValidatedMapping`, `AuditedDecision`, `CrystallizedAbstraction`, `ResolvedEndpoint`). 결여의 서명은 "복수" | codomain = 발산 인스턴스의 **집합**(N≥2) + 그로부터 추출된 방향 unknowns |
| C3 | **A vs B — 스킬 배치** | `extend-not-replace`(user 전역 원칙) vs "깔끔한 per-skill 타이핑"(스위트 아키텍처) | **B 권고**(§1). 단, 사용자 게이트로 남김 |
| C4 | **재사용할 instantiate 하위기계 경계** | `/ground`의 `I = M × F × Sₜ → Example`(매핑 스코프된 단일 렌더); `/elicit`의 `ReverseTrace → DimensionProjection`(좌표 역추적) | "추상 씨앗 → 구체 플레이스홀더 렌더"만 재사용; 매핑-스코핑(M,F)은 버리고 복수·발산으로 감쌈(§3.2) |
| C5 | **initiator 분류** (AI-guided / Hybrid / User-initiated) | `/ground`=AI-guided, `/elicit`=Hybrid. "만들기" 이동은 보통 사용자가 발화 | **Hybrid** 제안 — 사용자 발화가 우세하나 AI가 잠복 방향을 감지해 나설 수 있음 |
| C6 | **수렴/종결 조건** | Task Externalization Boundary: durable record엔 방향 결정(framing shift)만, 폐기 목업은 세션에 | 방향 unknowns가 노출되고 ∧ 사용자가 방향 판단(선택/좁힘/열린채 가시화)을 내리면 종결; 변이체는 폐기 |

**핵심 좌표 C2의 함의**: 이 이동의 종결 타입은 *노출된 방향 신호*이고, 변이체 집합은
그 *수단(scaffolding)*이다. `/ground`에서 `Example`이 단일 매핑을 검증하는 vehicle인 것과
대비된다 — 거기선 매핑이 목적, 여기선 대비(contrast)가 목적이고 인스턴스는 소모품이다.

### 0.2 표면화된 결여 (gap)

떠오른 계획안의 미검토 결여를, 결정 지점마다 표면화했다. 압력 순으로 정렬.

| # | 결여 | 압력 | 처리 |
|---|------|------|------|
| G1 | **"만들기"가 파일을 생성하는가, 세션텍스트로 방향을 서술하는가** | **load-bearing** (Epistemic Completeness Boundary 교차) | §열린 결정에 게이트로 표면화. 권고: 세션텍스트 렌더(파일 무변경) — 아래 근거 |
| G2 | **발산이 어떻게 보장되는가** — N개 비슷한 인스턴스가 아니라 서로 다른 방향 가설이려면 | load-bearing | 발산 축(divergence axis) = 잠복 방향 unknown. 각 변이체는 축에 다른 값을 커밋. **이것이 방법이 `/elicit`인 이유** — 역추적된 방향 좌표가 발산 축이 된다. MORPHISM에 내장(§2) |
| G3 | **Greek alias & 커맨드 이름** | cheap-to-settle이나 constitutive(이름=정체성) | 후보 제시, 사용자 결정(§열린 결정). 작업명: **Proplasma / `/sketch`** |
| G4 | **의존성 엣지 설계** — 어떤 프로토콜을 suppress/advise 하는가 | load-bearing (graph.json DAG 무결성) | 제안 엣지셋(§3.3): `euporia→new`, `frame→new`, `new→analogia` (advisory). suppression 불필요 |
| G5 | **변이체 개수(발산도)** | nonblocking | 제안: N∈[2,4] 소프트 캡. plurality(N≥2)는 constitutive, 상한은 값싼-탐색 유지용 |
| G6 | **reduced-space-test와의 중복** | 이슈에서 이미 배제됨 | 재확인만: rst=사후·단일·실검증공간 vs new=커밋전·복수·가짜데이터. 겹치는 축 없음 |

**G1의 근거 (가장 깊은 결여)**: `architectural-principles.md`의 Epistemic Completeness
Boundary는 "EP 원칙은 인식적 substrate를 지배하고, 물리적 실행/making은 native harness나
전문 플러그인에 속한다"고 선언한다. 목업 파일을 실제로 쓰는 버전은 스위트 최초의
`(transform)` 코어 이동이 되어 이 경계를 넘는다. **인식적으로 충실한 버전**은 방향 대비와
노출된 unknowns(인식적 객체)를 산출하고, 실제 파일-making은 (a) 핸드오프로 위임하거나
(b) 세션텍스트 렌더로 소모품화한다 — `/ground`의 `Example`(쓰여진 파일이 아니라 서술된
시나리오)과 동일한 타이핑. 권고는 (b): codomain을 *세션-렌더된 발산 플레이스홀더
인스턴스에서 추출한 노출 방향 unknowns*로 두어 substrate 안에 유지하고, 구성상 폐기가능
(세션텍스트는 증발)하게 한다. 대안(실파일 + cleanup 강제, `/inquire` 스타일)은 사용자 결정.

---

## 1. A vs B 권고

### 권고: **(B) 형제 프로토콜 신설** — instantiate 하위기계 재사용, 자체 deficit·codomain

### 근거

**(1) deficit/codomain 구별성은 스위트의 정체성 기준이다.** 아키텍처 전체가 각 프로토콜을
(deficit → resolution) 쌍으로 타이핑한다. 이슈의 교차검증이 확립했듯, 결여된 메커니즘은
`/ground` 포함 모든 기존 프로토콜과 *서로 다른 구조 축*에서 실패한다 — `/ground`에 대해선
"단일+검증" vs "복수+탐색". 두 개의 진정으로 구별되는 (deficit, codomain) 쌍을 한 스킬에
융합(A안)하는 것은 스위트가 세워진 "깔끔한 타이핑" 자체를 위반한다.

**(2) `/ground`의 형식블록은 이미 과부하 상태다.** 현행 `/ground`가 짊어진 것: `MappingUncertain`,
self-grounding 인식, `PartitionReading` 2차 기계, split-vs-trim의 `/conduct`·`/induce` 라우팅.
여기에 자체 deficit·codomain(복수 폐기 집합)·MORPHISM·수렴·게이트 구조를 가진 *2번째 모드*를
얹으면 이미 조밀한 스킬의 형식 표면이 대략 2배가 된다. 프로젝트의 semantic-closure 요구
(모든 새 조건이 TYPES/PHASE TRANSITIONS/LOOP/CONVERGENCE/TOOL GROUNDING/Rules에 걸쳐
타입·가드·상태갱신·종결경로·결과식을 가져야 함)를 감안하면 2-모드 `/ground`는 유지보수
부채다. 이슈가 명시한 A안의 단점이 substrate로 확증된다.

**(3) "공유 하위기계 + 구별되는 deficit/codomain의 별도 프로토콜"의 선례가 이미 있다:
`/elicit` ↔ `/induce`.** 둘은 명시적 categorical dual이다(`graph.json` 엣지:
`euporia → periagoge, advisory, "categorical dual 양립"`). "의도/인스턴스 ↔ 좌표/추상화"
기계를 공유하지만 deficit과 화살표 방향이 달라 *별도 스킬*이다. `/ground`(단일-검증) vs
new(복수-발산)는 구조적으로 동형이다 — 같은 인스턴스화 substrate, 다른 목적 → 별도 스킬.
**이것이 가장 강한 단일 논거다**: 프로젝트는 정확히 이 형태의 질문을
"substrate 공유하되 스킬 분리" 쪽으로 이미 결정한 바 있다(A5 option-set relay test의
"sibling protocol's established pattern"에 해당하는 citable 선례).

**(4) 이슈가 지적한 스위트 얇음("making/발산 외재화 축이 얇다")은 1급 노드가 더 잘 채운다.**
`/ground` 안에 묻힌 모드는 catalog·클러스터 그룹핑(`load-protocols.js` CANONICAL_CLUSTERS)·
`graph.json` 노드목록·README 표에서 **보이지 않는다**. 새 노드는 "making" 축을 peer로
가시화한다 — 결여를 표면화한다는 목적 자체와 부합. A안은 새 능력을 "Analysis" 클러스터로
분류된 스킬 안에 숨긴다.

**(5) 재사용은 어느 쪽이든 보존된다.** B의 단점은 "스위트 증가"뿐인데, B도 인스턴스화
하위기계를 *재사용*한다(하위기계 층에서 extend-not-replace, user 전역 원칙 준수). 증가분은
노드 1개이고, 스위트는 이미 16노드다. 한계 catalog 비용은 낮다(project profile:
notation maturity High, revision cost Low).

### A안의 반론과 그 한계

A안의 논거는 extend-not-replace + 스킬 수 억제다. 그러나 "extend-not-replace"(user 전역
CLAUDE.md)는 *기존 메커니즘을 다시 짓지 말라*는 것이고, B는 instantiate 하위기계를 재사용해
이를 준수한다. 이는 구별되는 deficit들을 한 스킬에 욱여넣으라는 명령이 아니다. 프로젝트
자체의 아키텍처 원칙(Unix Philosophy Homomorphism, Tier Factorization)은 one-protocol-one-deficit을
선호한다. 스킬 수 억제는 실질 비용이나(노드 1개), 위 (2)의 유지보수 부채가 이를 상회한다.

### 왜 이것이 게이트인가

A vs B는 published-artifact 마이그레이션 난이도를 가진, downstream 파일 배치·catalog·graph
궤적이 진정으로 갈라지는 결정이다. 나중에 되돌리려면 published 플러그인을 삭제/병합해야
한다(외부 커뮤니케이션·버전 이력·사용자 설치에 잔여). 따라서 가역성 티어에서 **비가역**이고,
근거와 함께 권고하되 최종 선택은 사용자 몫으로 남긴다.

---

## 2. 프로토콜 스캐폴드 초안 (B안 기준)

> 작업명 **Proplasma** (πρόπλασμα, 최종물 전에 빚는 예비 모형/마케트) · 커맨드 `/sketch`.
> 이름은 §열린 결정에서 확정. 아래 형식블록은 스위트 표기 관례(영문 타입명)를 따른다.

### 2.1 타입 시그니처

```
(DirectionLatent, Hybrid, DIVERGE-CONTRAST, DirectionSeed × DivergenceAxisSet) → ContrastedDirection
```

### 2.2 MORPHISM (초안)

```
── MORPHISM ──
DirectionSeed
  → detect(seed, latent_direction)      -- 방향 unknowns가 잠복인지(settled 아님) 검증
  → trace_axes(seed, substrate)         -- 발산 축(=변이시킬 방향 unknowns) 식별 [/elicit 역추적 재사용]
  → instantiate_divergent(seed, axes)   -- N≥2 값싼 플레이스홀더-데이터 인스턴스 렌더;
                                        --   각 인스턴스는 축에 서로 다른 값을 커밋 [/ground instantiate 재사용, 복수화]
  → contrast(variants)                  -- 변이체를 나란히 놓고, 각각이 노출하는 방향 unknown 추출
  → judge_direction(user, contrast)     -- 사용자가 대비를 읽고 방향 판단(선택/좁힘/열린채/폐기)
  → dispose(variants, judgment)         -- 변이체는 scaffolding: 폐기(세션텍스트 증발) 또는 하나 승격;
                                        --   방향 결정은 지속, 목업은 지속 안 함
  → ContrastedDirection
requires:  latent(direction(seed))       -- 런타임 체크포인트 (Phase 0)
deficit:   DirectionLatent               -- 활성화 전제조건 (Layer 1/2)
preserves: seed                          -- read-only; 변이체는 소모 scaffolding, seed 변형 아님
invariant: Divergent Contrast over Single Instantiation
```

### 2.3 TYPES (핵심)

```
── TYPES ──
DirectionSeed      = 빌드가 커밋됐으나 방향적으로 under-explored인 의도/스펙 (input type)
DivergenceAxis     = 변이체 간 변이시킬 방향 unknown (substrate에서 역추적; /elicit 연결)
DivergenceAxisSet  = Set(DivergenceAxis), |·| ≥ 1
DisposableInstance = { rendering: String,                       -- 플레이스홀더-데이터 구체 인스턴스
                       committed: Map(DivergenceAxis, Value),   -- 이 변이체가 각 축에 커밋한 값
                       disposable: true }
Variants           = Set(DisposableInstance), |Variants| ≥ 2   -- 복수성은 constitutive
Contrast           = Variants → Set(DirectionalUnknown)         -- 나란히-읽기 → 노출된 unknowns
DirectionalUnknown = { axis: DivergenceAxis, exposed_by: Contrast, still_open: Bool }
V (판단)           = { Choose(variant), Narrow(axis, value), KeepOpen, Dispose }  -- answer coproduct
Disposition        ∈ {Disposed, Promoted(variant)}             -- 변이체의 종결 처분
ContrastedDirection = resolution where
                       exposed(directional_unknowns)
                       ∧ direction_judged(V)
                       ∧ disposition_declared(Disposition)
```

### 2.4 invariant

**Divergent Contrast over Single Instantiation** — codomain은 의도적으로 발산하는 소모
인스턴스의 *복수*이며, 그 *대비*가 인식적 vehicle이다. 단일 검증 매핑이 아니다. 이 불변식이
`/ground`(단일·검증·보존)와 구별하고 B안을 자연스럽게 만든다.

### 2.5 형식-폐쇄 스케치 (semantic-closure 예비)

새 조건마다 타입·가드·상태갱신·종결경로·결과식이 정합해야 한다(commit 전 수동 검증 필수):

- `DirectionLatent` → 가드 `latent(direction(seed))` → Phase 0 detect → skip 조건(방향 이미
  settled, 또는 단일 인스턴스로 충분 → `/ground`로 라우팅)
- 복수성(N≥2) → 가드 `|Variants| ≥ 2` → Phase 1 instantiate_divergent → N<2면 발산 미성립,
  단일 검증이면 `/ground` 라우팅
- `Contrast` → Phase 2 relay 표면화(노출된 unknowns) + `V` 게이트(방향 판단)
- `Disposition` → Phase 3 → 종결경로: 폐기/승격 선언 → `ContrastedDirection`
- 수렴 evidence: 각 변이체 → 노출 unknown → 사용자 방향 판단의 trace (relay)

---

## 3. 파일 배치 & 기존 스킬 재사용 경계

> §3.1 파일 목록은 레지스트레이션 인벤토리 스윕으로 정밀화 예정. 아래는 형식블록·graph.json·
> load-protocols.js·structural-specs 근거의 초안.

### 3.0 아키텍처 핵심: auto-discovery-first

레포는 의도적으로 **auto-discovery-first**다. `scripts/load-protocols.js`의 `discoverPlugins()`가
파일시스템을 워크해 모든 열거(`PLUGINS`, `PROTOCOL_FILES`, ...)를 (a) `.claude-plugin/plugin.json`을
가진 플러그인 디렉터리와 (b) `graph.json`의 노드 목록에서 파생한다. **플러그인이 protocol인지
utility인지는 디렉터리명이 `graph.json.nodes`에 있는가로 갈린다.** 따라서:

- **손수 편집 불필요(auto-discovery가 흡수)**: `package.js`, `install.sh`, `install-codex.sh`,
  `generate-changelog.js`(커밋 scope 파싱), `.github/` 워크플로, `AGENTS.md`/`CLAUDE.md`
  (router 계약 — per-protocol 재기입 시 오히려 warn).
- **손수 편집 필요**: 아래 §3.3의 11개 파일 + 신규 플러그인 트리.

### 3.1 신규 플러그인 골격 (형제 플러그인 템플릿, 신규 파일 5개)

`analogia`/`euporia` 트리를 미러 (per-plugin LICENSE·scripts·tests 없음; LICENSE는 레포 루트만):

```
proplasma/                         # 작업명; 확정 이름으로 대체
  .claude-plugin/plugin.json       # 최소 스키마: name, version(semver), description, author (4필드 enforced)
  .codex-plugin/plugin.json        # 리치 스키마(interface{} 블록 등); version은 claude 매니페스트와 동일해야 함(enforced)
  README.md
  README_ko.md
  skills/sketch/SKILL.md           # 스킬 디렉터리명 = 커맨드(/sketch); 프로토콜 계약(§2)
```

**SKILL.md 필수 컴파일 규칙(누락 시 정적검사 fail)**: emit-load 3규칙(Context-Question
Separation · Plain emit discipline · Round-local salience bundling), "Formal blocks are
runtime-normative", "Gate integrity (Safeguard tier)" + type-preserving materialization,
framing-readout(진행바 글리프 `▓/░` 금지), MORPHISM anatomy, TOOL GROUNDING 주석 소진성.
필수 섹션 헤더: `## Definition` · `## Mode Activation` · `## Protocol` · `## Rules` + 형식블록
`FLOW→MORPHISM→TYPES`(순서 enforced) · `PHASE TRANSITIONS` · `MODE STATE` · `TOOL GROUNDING`.
frontmatter `description:`에 `Type: (Deficit, ...) → Resolution` 임베드(파싱됨).

### 3.2 재사용 경계 (핵심)

스위트에서 "재사용"은 코드 import가 아니라 **구조 패턴 참조**다(스킬은 독립 SKILL.md 계약).
경계를 정밀히:

- **`/ground`(analogia)에서 재사용**: 인스턴스화 하위기계 — "추상 씨앗 → 구체 플레이스홀더
  렌더". `/ground`에선 `I = M × F × Sₜ → Example`(매핑-스코프된 단일). new는 *렌더 코어*만
  재사용하고 매핑-스코핑(M, F)을 버린 뒤 **복수 + 발산축-구동**으로 만든다. 즉 재사용은
  "seed → concrete rendering" 층이지 매핑-검증 기계 전체가 아니다.
- **`/elicit`(euporia)에서 재사용**: substrate에서 방향 좌표를 역추적하는 `ReverseTrace →
  DimensionProjection`. new의 `trace_axes`가 이를 미러한다. 발산 축은 elicit식 좌표지만,
  *질문*으로 표면화하는 대신 new는 발산 *변이체*로 인스턴스화한다. → advisory 엣지 근거.
- **신규(재사용 아님)**: 복수 codomain, contrast 연산, 폐기/scaffolding 의미론, 발산 보장.

### 3.3 손수 편집 레지스트레이션 지점 (인벤토리로 확정, 11개 파일)

정적검사(`static-checks.js`)가 대부분을 enforce하므로 누락 시 fail/warn한다.

1. **`.claude/skills/verify/graph.json`** — `nodes[]`에 노드 추가(이것이 protocol로
   분류시키는 결정점). `version` bump(convention, unenforced). 엣지 추가(제안, §G4):
   - `euporia → new` (advisory): 역추적된 방향 좌표가 발산 축 시드를 좁힘
   - `prothesis → new` (advisory): 선택된 렌즈가 변이체 프레이밍 컨텍스트 제공
   - `new → analogia` (advisory): 방향 선택 후 그 매핑을 `/ground`가 검증
   - suppression 불필요(deficit 분리). precondition 불필요 — 범용 `* → katalepsis` 엣지가
     신규 노드→katalepsis를 자동 커버하므로, 순수 advisory 노드는 precondition 편집이 필요 없다.
     노드는 최소 1개 엣지에 참여해야 함(고립 시 warn).
2. **`.claude-plugin/marketplace.json`** — `plugins[]`에 항목 추가(실제 install source;
   미등록 시 cross-ref-scan warn). version 필드 없음.
3. **`.agents/plugins/marketplace.json`** — Codex 포맷 항목 추가(`source:{source:"local",path}`,
   `policy`, `category`). 정적검사 미enforce이나 Codex install 패리티에 필요.
4. **`README.md`** — 프로토콜 표에 행 1개(`| [Name](./dir) | \`/cmd\` | 사용시점 |`).
5. **`README_ko.md`** — 한국어 프로토콜 표 행 1개 + 클러스터 라인(아래 7과 동기화).
6. **`scripts/load-protocols.js` `CANONICAL_PRECEDENCE`** — 프로토콜명 추가. 릴리스노트
   순서를 구동; 누락 시 릴리스노트 표에서 탈락 → `package.test.js` assertion fail.
   precondition 엣지가 있으면 hard-required(precedence linear-extension 검사).
7. **`scripts/load-protocols.js` `CANONICAL_CLUSTERS`(L38)** — `/sketch`를 클러스터 문자열에
   추가. 이 문자열은 `README.md`·`README_ko.md`의 클러스터 라인과 **정확히 일치**해야 함
   (drift 시 fail). 현행: Planning · Analysis · Decision · Execution · Verification · Cross-cutting.
   **제안: Planning**(커밋전 방향 탐색이 `/inquire`,`/elicit`과 같은 층) — 또는 "making" 축
   가시화용 신규 클러스터(더 큰 변경, §열린 결정의 연장선상 판단).
8. **`epistemic-cooperative/skills/onboard/SKILL.md`** — Data Sources 행 + Phase 0 카테고리
   그룹핑에 `/cmd` 포함(checkOnboardSync fail 방지); "the N protocols" 카운트 문구 갱신(warn).
9. **`epistemic-cooperative/skills/onboard/references/scenarios.md`** — `## Name \`/cmd\`` 헤딩.
10. **`epistemic-cooperative/skills/onboard/references/workflow.md`** — `/cmd` 포함.
11. **`epistemic-cooperative/skills/catalog/SKILL.md`** — `/cmd` + 이름 둘 다 포함(checkCatalogSync fail 방지).

**추가로 `scripts/package.test.js`의 하드코딩 카운트**(auto-derive 아님):
`views.length` 38→39, "includes all 16 protocols" 이름 배열 +1(→17),
package results 39→40, sorted zip 목록에 `sketch.zip` 추가.

**옵션(미enforce)**: GitHub Pages 사이트(`src/components/ProtocolDemo.tsx`, `src/lib/i18n.tsx`)
데모 서브셋 — 쇼케이스 원할 때만.

---

## 4. 검증 방법

1. **정적 검증 (결정적)**:
   ```bash
   node .claude/skills/verify/scripts/static-checks.js .
   ```
   형식블록 anatomy, TOOL GROUNDING 주석 소진성, 클러스터 cross-ref, 노드 등록,
   게이트 전제조건 커널 앵커를 검사.
2. **패키징 + liveness**:
   ```bash
   node --test scripts/package.test.js anamnesis/scripts/hypomnesis-write.test.mjs
   ```
   AGENTS.md 경고: liveness 테스트가 live SKILL.md를 mutate할 수 있으므로 정적 프로토콜
   검증과 **동시 실행 금지**. 주의: `package.test.js`는 하드코딩 카운트를 assert하므로
   §3.3 addendum(views 39, protocols 17, results 40, zip 목록)을 갱신하기 전엔 fail한다 —
   이 갱신 자체가 구현 체크리스트의 일부.
3. **semantic-closure 스윕 (수동)**: §2.5의 모든 새 조건이 타입·가드·상태갱신·종결경로·
   결과식을 TYPES/PHASE TRANSITIONS/LOOP/CONVERGENCE/TOOL GROUNDING/Rules에 걸쳐
   정합하는지 확인. 정적 검사가 증명하지 못하므로 commit 전 수동 확인.
4. **어휘 스윕**: 술어 확정 후 stale vocabulary 렉시컬 스윕(검증 가이드 기준).
5. **`/verify`**: commit 전 실행.
6. **버전 bump + 변경로그**: `plugin.json` version, `graph.json` version, `generate-changelog.js`.

---

## 열린 결정 (사용자 게이트)

이 계획이 사용자에게 남기는 constitutive 결정:

1. **A vs B** — 권고는 **B(형제 프로토콜 신설)**, 근거 §1. 비가역 결정이므로 최종 선택은
   사용자 몫.
2. **G1 — making 실현 형태**: 세션텍스트 렌더(권고, substrate 유지) vs 실파일 목업 +
   cleanup 강제(`/inquire` 스타일, 스위트 최초 `(transform)` 코어). Epistemic Completeness
   Boundary 교차 결정.
3. **G3 — 이름**: Greek alias & 커맨드. 후보:
   - `Proplasma`(πρόπλασμα, 예비 모형) / `/sketch` — 러프-값싼-making 강조
   - `Parathesis`(παράθεσις, 나란히 놓기) / `/contrast` — 대비(contrast) 축 강조
   - `Paradeigma`(παράδειγμα, 예시/패턴) / `/mock` — 가짜데이터 강조(단, 과부하된 용어)

권고: **Proplasma / `/sketch`** (예비-모형 의미가 "커밋전 값싼 발산"을 가장 직접 담음),
차선 `Parathesis / `/contrast`` (대비가 인식적 코어라면).
