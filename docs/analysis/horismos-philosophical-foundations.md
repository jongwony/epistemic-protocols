# Horismos 철학적 기반: Epitrope에서 Horismos로의 전환과 학술적 근거

> 이 문서는 Horismos 프로토콜의 철학적 기반을 아카이브한다.
> BoundaryMap의 이론적 근거인 Transactive Memory Systems, Division of Cognitive Labor,
> Grounding in Communication 세 학술 참조의 진위를 검증하고, 각 이론과 프로토콜 설계 간
> 매핑의 구조적 충실도를 분석한다.
> Horismos의 Core Principle("Transactive Memory directory")은 SKILL.md L104에 명시되어 있다.

---

## 배경: Epitrope → Horismos 전환

Epitrope(ἐπιτροπή, "위임")는 인간-AI 간 역할 위임을 다루는 프로토콜이었다. 그러나 "위임"이라는 프레이밍에는 구조적 한계가 있었다:

1. **위임은 권한 양도를 함축한다** — 실제로 인간-AI 협업에서 필요한 것은 권한 양도가 아니라 인지적 노동의 *분배*
2. **위임은 비대칭적이다** — 한 쪽이 다른 쪽에게 맡기는 구조. 그러나 BoundaryMap은 양방향 정의(user-spec / AI-spec / needs-calibration)를 요구
3. **위임은 누적적이다** — 한 번 위임하면 지속. 그러나 인식론적 경계는 결정 단위(per-decision)로 재정의되어야 함

이 한계를 인식하여 Epitrope를 폐기하고, **Horismos**(ὁρισμός, "경계를 정하다, 정의하다")로 대체했다. Aristotle의 horismos는 세 가지 속성을 갖는다:

| 속성 | Aristotle | Horismos 프로토콜 |
|------|-----------|-------------------|
| **경계 설정** | 본질과 비본질을 구분 | 도메인별 user-spec / AI-spec 분류 |
| **공유성** | 정의는 공동 합의 | BoundaryMap은 인간-AI 양측이 참조하는 공유 자원 |
| **재정의 가능** | 새로운 정보로 정의 갱신 | per-decision 경계 재정의 (누적 프로파일이 아닌 결정 단위) |

이 전환은 Hermeneia → Aitesis → Analogia × 3 → Syneidesis 프로토콜 체인을 통해 검증되었다.

---

## 학술적 기반

### 1. Wegner의 Transactive Memory Systems (TMS)

**인용**:
- Wegner, D.M., Giuliano, T., & Hertel, P. (1985). *Cognitive interdependence in close relationships*. In W.J. Ickes (Ed.), Compatible and incompatible relationships (pp. 253–276). New York: Springer-Verlag.
- Wegner, D.M. (1987). *Transactive Memory: A Contemporary Analysis of the Group Mind*. In B. Mullen & G.R. Goethals (Eds.), Theories of Group Behavior. Springer Series in Social Psychology. New York: Springer.

**검증**: [Springer](https://link.springer.com/chapter/10.1007/978-1-4612-4634-3_9), [Harvard Archives](https://dtg.sites.fas.harvard.edu/DANWEGNER/pub/Wegner%20Transactive%20Memory.pdf), [Semantic Scholar](https://www.semanticscholar.org/paper/Transactive-Memory:-A-Contemporary-Analysis-of-the-Wegner/77648f4b91847a3df191f00ce13d123cf4bf3c88) — 연도, 출판사, 저자 일치 확인.

**핵심 개념**: TMS는 집단 수준의 기억 시스템으로, "개인들의 기억 시스템과 집단 내 커뮤니케이션 과정의 작동을 포함하는" 체계다(Wegner et al., 1985). 그 구성 요소:

- **Directory updating**: 누가 무엇을 아는지 추적
- **Information allocation**: 새로운 정보를 적절한 전문가에게 경로 설정
- **Retrieval coordination**: 필요한 지식을 가진 사람에게 질의

**Horismos 대응**:

| TMS 구성 요소 | Horismos 대응 |
|---------------|---------------|
| Directory updating (누가 무엇을 아는지) | BoundaryMap calibration (도메인 → user-spec / AI-spec) |
| Information allocation (새 정보 경로 설정) | 새 도메인 발견 → recalibrate trigger |
| Retrieval coordination (적절한 사람에게 질의) | 다운스트림 프로토콜이 BoundaryMap 참조하여 행동 결정 |

이 대응에서 BoundaryMap은 본질적으로 **인간-AI dyad의 TMS directory**이다.

### 2. Kitcher의 Division of Cognitive Labor

**인용**:
- Kitcher, P. (1990). *The Division of Cognitive Labor*. The Journal of Philosophy, 87(1), 5–22.

**검증**: [PhilPapers](https://philpapers.org/rec/KITTDO), [PDC](https://www.pdcnet.org/jphil/content/jphil_1990_0087_0001_0005_0022), [Semantic Scholar](https://www.semanticscholar.org/paper/The-Division-of-Cognitive-Labor-Kitcher/1da715bab74002287ba2ae5939196968c0905efd) — 저널, 권호(87/1), 페이지(5–22) 일치 확인.

**핵심 개념**: 과학 커뮤니티에서 인지적 노동의 최적 분배 전략. Kitcher는 "개인 합리성"(individual rationality — 증거의 정확한 평가)과 "집단 합리성"(collective rationality — 커뮤니티를 진리로 이끄는 전략)을 구분한다. 커뮤니티는 접근법을 다양화하여 인식론적 위험을 분산해야 한다.

**Horismos 대응**: Epitrope의 "위임"(delegation) 프레이밍을 탈피하는 이론적 근거를 제공했다. 인간-AI 협업은 권한의 양도가 아니라 **인지적 노동의 분배**이다:

- 사용자 → 비즈니스 도메인 인지적 노동 (목표, 제약, 우선순위)
- AI → 기술 도메인 인지적 노동 (구현, 패턴, 도구)
- needs-calibration → 분배가 불명확한 영역 (프로빙 필요)

### 3. Clark & Brennan의 Grounding in Communication

**인용**:
- Clark, H.H. & Brennan, S.E. (1991). *Grounding in Communication*. In L.B. Resnick, J.M. Levine, & S.D. Teasley (Eds.), Perspectives on Socially Shared Cognition (pp. 127–149). Washington, DC: American Psychological Association.

**검증**: [Stanford (원문 PDF)](https://web.stanford.edu/~clark/1990s/Clark,%20H.H.%20_%20Brennan,%20S.E.%20_Grounding%20in%20communication_%201991.pdf), [APA PsycNET](https://psycnet.apa.org/record/1991-98452-006), [Semantic Scholar](https://www.semanticscholar.org/paper/Grounding-in-communication-Clark-Brennan/5a9cac54de14e58697d0315fe3c01f3dbe69c186) — 출판사(APA), 수록처, 페이지 일치 확인.

**핵심 개념**: 효과적인 커뮤니케이션은 공유 지식(common ground) — 상호 지식, 상호 신념, 상호 가정 — 을 전제한다. 화자와 청자는 내용 조율(coordination of content)과 과정 조율(coordination of process)을 통해 순간순간 common ground를 갱신해야 한다.

**Horismos 대응**:

| Common Ground 개념 | Horismos 대응 |
|-------------------|---------------|
| Common ground (상호 공유 지식) | BoundaryMap (인식론적 경계에 대한 공유 이해) |
| Grounding (순간순간 갱신) | per-decision calibration (결정 단위 경계 재정의) |
| Coordination of content | 도메인별 user-spec / AI-spec 분류 합의 |
| Grounding criterion (acknowledgment) | Qc 게이트 응답 (user-spec / AI-spec / needs-calibration 선택) |

BoundaryMap이 없으면 — 즉 "누가 무엇을 담당하는지"에 대한 common ground가 없으면 — 매 인터랙션마다 마찰이 발생한다. Horismos는 이 common ground를 세션 초기에 확립하여, 이후 모든 프로토콜이 이 공유 이해 위에서 작동하도록 한다.

---

## 매핑 충실도 분석

세 학술 참조의 Horismos 대응 관계는 구조적 충실도가 균일하지 않다. 아카이브 목적상 이 편차를 명시적으로 기록한다.

### 충실도 등급

| 참조 | 등급 | 근거 |
|------|------|------|
| **Wegner TMS → BoundaryMap** | 구조적 대응 (강) | TMS의 세 구성 요소(directory updating, information allocation, retrieval coordination)가 BoundaryMap의 calibration, recalibrate trigger, downstream reference에 1:1 대응 |
| **Clark & Brennan → common ground** | 직접 대응 (강) | BoundaryMap = epistemic common ground, calibration = moment-by-moment grounding update. 원론의 핵심 메커니즘과 직접적 대응 |
| **Kitcher → cognitive labor division** | 영감적 연결 (중) | "위임 → 분배" 프레이밍 전환의 이론적 근거로 기능. 단, 원론의 핵심 긴장(개인 합리성 vs 집단 합리성)은 Horismos에 직접 대응 없음 |

### 주요 구조적 차이

**TMS의 "transactive" 특성 약화**: Wegner의 TMS에서 각 구성원은 자신만의 기억을 보유하며, directory는 *분산형*으로 유지된다 — 각자가 "누가 무엇을 아는지"를 독립적으로 추적한다. 반면 Horismos의 BoundaryMap은 **AI가 중앙 관리하고 사용자가 보정하는** 구조다. "transactive"의 원래 의미인 분산적 상호작용 특성은 인간-AI dyad에서 비대칭적으로 실현된다.

이 차이는 TMS 연구에서 인정하는 한계와도 연결된다 — TMS는 원래 친밀한 관계(close relationships)의 2인 집단에서 시작되어, 이후 조직 수준으로 확장되었으나(Ren & Argote, 2011), 인간-AI dyad로의 확장은 아직 학술적 합의가 형성되지 않은 영역이다.

**Kitcher의 범위 축소**: Kitcher의 원론은 과학 커뮤니티 전체에서 이론적 접근법의 다양화 전략을 다룬다. Horismos에서의 적용은 이를 2자간(human-AI) 도메인 분배로 축소한다. 원론에서 핵심적인 "경쟁적 다양화를 통한 집단 진리 수렴" 메커니즘은 Horismos에 대응하지 않는다.

---

## Epitrope → Horismos 주요 설계 결정

프로토콜 체인(Hermeneia → Aitesis → Analogia × 3 → Syneidesis)을 통해 검증된 결정:

| 결정 | 선택 | 근거 |
|------|------|------|
| **경계 단위** | per-decision (결정 단위) | 누적적 전문성 프로파일이 아닌, 각 결정점마다 경계 재정의 |
| **BoundaryMap 역할** | 공유 자원 (epistemic router) | 전체 프로토콜 파이프라인이 참조하는 공유 자원. CE1 반례를 통해 확인 |
| **Aitesis 흡수 거부** | 독립 프로토콜 유지 | 표면적 유사성("같은 Akinator functor")에도 불구하고: (1) 공유 자원은 독립 프로토콜이어야 함(Unix pipe 원칙), (2) 사실적(factual) vs 구성적(constitutive) 존재론적 차이 |
| **명명** | Horismos > Diorismos > Epignosis | Aristotle의 horismos(경계 + 공유 + 재정의 가능)가 세 요구사항에 1:1 대응 |

---

## 참고 문헌

1. Clark, H.H. & Brennan, S.E. (1991). Grounding in Communication. In L.B. Resnick, J.M. Levine, & S.D. Teasley (Eds.), *Perspectives on Socially Shared Cognition* (pp. 127–149). Washington, DC: American Psychological Association.
2. Kitcher, P. (1990). The Division of Cognitive Labor. *The Journal of Philosophy*, 87(1), 5–22.
3. Wegner, D.M. (1987). Transactive Memory: A Contemporary Analysis of the Group Mind. In B. Mullen & G.R. Goethals (Eds.), *Theories of Group Behavior*. Springer Series in Social Psychology. New York: Springer.
4. Wegner, D.M., Giuliano, T., & Hertel, P. (1985). Cognitive interdependence in close relationships. In W.J. Ickes (Ed.), *Compatible and incompatible relationships* (pp. 253–276). New York: Springer-Verlag.
