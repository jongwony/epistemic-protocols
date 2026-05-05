# Euporia (εὐπορία)

Extended-Mind 역방향 귀납을 통한 해소 — `/elicit`.

## 개요

Euporia는 추상적 aporia(통로 없음)을 통과하는 길을 연다. 사용자의 외화된 인지 substrate(코드베이스, 규칙, 과거 세션, 사용자 환경)에서 결정 좌표를 역추적하여 cycle별로 emergent하게 dimension projection으로 surface하고, 사용자의 답변이 그 좌표가 이미 외화된 인지에 implicit하게 존재했음을 explicit화하는 방식으로 작동. resolution은 단일 axis로 고정된 추출이 아닌 cycle 반복을 통해 emergent하게 도달한다.

본 프로토콜은 Periagoge(`/induce`)와 categorical dual 관계 — Periagoge는 구체적 인스턴스에서 추상으로 상향(bottom-up colimit), Euporia는 의도에서 substrate를 거쳐 좌표로 하향(top-down reverse induction). 두 프로토콜은 동일 dialectic substrate의 직교 방향으로 합성된다.

## Type

```
(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate)
  → ResolvedEndpoint
```

그리스어 εὐπορία("좋은 통로 / 통과의 길")는 aporia(ἀπορία, "통로 없음")로부터 해소를 향해 emergent하게 발생하는 자원성을 가리킴. Plato 후기 변증법은 aporia와 euporia를 탐구의 짝지어진 계기로 엮는다.

## 호출 시점

사용자의 의도가 발화되어 있으나 그 결정 좌표가 외화된 substrate에 implicit하게 존재할 때 활성화. 발화가 단일 axis-specific protocol에 commit되지 않으면서, 동시에 substrate가 해당 의도 해소에 필요한 값들의 흔적을 담고 있는 conjunction이 게이트.

의도가 axis-determined되어 단일 axis-specific protocol이 해소를 커버할 수 있다면 그 프로토콜로 위임. 사용자가 명명되지 않은 본질로 수렴하는 인스턴스 집합을 가지고 있고 locator가 부재하다면 Periagoge로 위임.

## 구성

- `skills/elicit/SKILL.md` — 프로토콜 정의 (10 formal blocks, prose, rules)
- `.claude-plugin/plugin.json` — plugin manifest
