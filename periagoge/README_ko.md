# Periagoge (περιαγωγή)

진행 중인 추상의 보정과 결정화 — `/induce`.

> [English](./README.md)

## 개요

Periagoge는 진행 중인 추상을 결정화된 형태로 돌려세운다. 인스턴스 집합이 사용자가 감지하고는 있으나 아직 명명하지 못한 본질로 수렴했을 때, 프로토콜은 그 진행 중인 개념을 인스턴스 집합에 대해 보정하고, 사용자 자신의 도메인에서 길어낸 근거 예시와 짝지은 후보 추상을 제안하며, 사용자의 응답 — 수용, 범위 확장, 특정 차원을 따른 축소, 인접 추상과의 융합, 직교 축으로의 재정향 — 을 통해 후보를 다듬어 추상이 스스로 자리를 잡을 때까지 진행한다.

본 프로토콜은 Euporia(`/elicit`)와 방향성 dual 관계 — Periagoge는 구체적 인스턴스에서 추상으로 상향(bottom-up 방향), Euporia는 의도에서 substrate를 거쳐 좌표로 하향(top-down 방향). 두 프로토콜은 동일 dialectic substrate의 직교 방향으로 합성된다. 해당 페어링은 informal direction-orthogonality로서 정식 categorical limit/colimit duality는 아니다.

## Type

```
(AbstractionInProcess, AI, INDUCE, A)
  → CrystallizedAbstraction
```

## 이름

이 이름은 Plato 『국가』 VII.518d에서 περιαγωγή가 가지적인 것을 향한 영혼의 돌아섬을 가리키는 데서 구조적 유비를 취한다. 본 프로토콜은 그 돌아섬 구조를 차용할 뿐 플라톤적 paideia를 주장하지 않는다. Synagoge(συναγωγή, 모음)와 Diairesis(διαίρεσις, 나눔)는 『파이드로스』 265d–266a에 기술된 쌍둥이 변증법적 운동이며, 여기서는 사용자 응답 계열의 이름일 뿐 플라톤적 방법론에 대한 주장이 아니다.

## 호출 시점

인스턴스 집합이 어떤 본질로 수렴했으나 그 이름·범위·위치가 아직 확정되지 않았을 때 활성화 — 사용자가 사례들이 무언가를 공유한다고 감지하지만 그 공유된 것에 아직 locator가 없는 상태.

이미 존재하는 추상이 비교나 검증만을 기다리는 경우는 다른 곳으로 라우팅된다. 사용자의 의도가 발화되어 있으나 그 결정 좌표가 외화된 substrate에 implicit하게 존재한다면 Euporia(`/elicit`)로 위임. 개념이 이미 과거 작업에 존재하여 형성이 아닌 인지만 필요하다면 Anagoge(`/ascend`)로 위임.

## 구성

- `skills/induce/SKILL.md` — 프로토콜 정의 (formal blocks, prose, rules)
- `.claude-plugin/plugin.json` — plugin manifest
