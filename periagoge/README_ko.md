# Periagoge (περιαγωγή)

구체적 사례를 먼저 대응시키고, 공유하는 것을 맨 뒤에 명명 — `/induce`.

> [English](./README.md)

## 개요

Periagoge는 진행 중인 추상을 결정화된 형태로 돌려세운다. 인스턴스 집합이 사용자가 감지하고는 있으나 아직 명명하지 못한 본질로 수렴했을 때, 프로토콜은 가장 정렬하기 쉬운 두 사례를 나란히 놓아 사용자가 대응을 세우게 하고, 그 대응이 실어 나르는 불변 관계를 열린 읽기들과 함께 추출하며, 사용자가 판정하는 추가 사례와 근접 비사례에 대해 그 읽기들을 탐침으로 갈라낸 뒤, 그제서야 살아남은 것에 이름과 규칙을 제안한다 — 추상은 앞서 제시된 후보에 이끌리는 것이 아니라 사용자가 세운 대응에 의해 자리를 잡는다.

본 프로토콜은 Euporia(`/elicit`)와 방향성 dual 관계 — Periagoge는 구체적 인스턴스에서 추상으로 상향(bottom-up 방향), Euporia는 의도에서 substrate를 거쳐 좌표로 하향(top-down 방향). 두 프로토콜은 동일 dialectic substrate의 직교 방향으로 합성된다. 해당 페어링은 informal direction-orthogonality로서 정식 categorical limit/colimit duality는 아니다.

## Type

```
(AbstractionInProcess, AI, INDUCE, A)
  → CrystallizedAbstraction
```

## 이름

이 이름은 Plato 『국가』 VII.518d에서 περιαγωγή가 가지적인 것을 향한 영혼의 돌아섬을 가리키는 데서 구조적 유비를 취한다. 본 프로토콜은 그 돌아섬 구조를 차용할 뿐 플라톤적 paideia를 주장하지 않는다. 『파이드로스』 265d–266a의 변증법적 어휘 — 모음과 나눔 — 이 대응·탐침 운동의 원천 용어를 제공한다; 차용은 용어 차원이며 플라톤적 방법론에 대한 주장이 아니다.

## 호출 시점

인스턴스 집합이 어떤 본질로 수렴했으나 그 이름·범위·위치가 아직 확정되지 않았을 때 활성화 — 사용자가 사례들이 무언가를 공유한다고 감지하지만 그 공유된 것에 아직 locator가 없는 상태.

이미 존재하는 추상이 비교나 검증만을 기다리는 경우는 다른 곳으로 라우팅된다. 사용자의 의도가 발화되어 있으나 그 결정 좌표가 외화된 substrate에 implicit하게 존재한다면 Euporia(`/elicit`)로 위임. 개념이 이미 과거 작업에 존재하여 형성이 아닌 인지만 필요하다면 Anamnesis(`/recollect`)로 위임.

## 구성

- `skills/induce/SKILL.md` — 프로토콜 정의 (formal blocks, prose, rules)
- `.claude-plugin/plugin.json` — plugin manifest
