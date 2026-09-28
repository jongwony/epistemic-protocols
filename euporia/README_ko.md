# Euporia (εὐπορία)

Extended-Mind 역방향 귀납을 통한 해소 — `/elicit`.

## 개요

Euporia는 추상적 aporia(통로 없음)을 통과하는 길을 연다 — 방향은 있지만 그것이 어떤 결정에 따라 갈리는지 아직 짚지 못한 상태. 사용자 자신의 자료(코드베이스, 규칙, 과거 세션), 사용자의 말, 그리고 그 의도가 놓인 영역의 결정 구조에서 결정 좌표를 찾아, 각 좌표를 어디서 왔는지와 정하지 않고 두면 무엇이 달라지는지와 함께 올린다. 모든 답은 통째로 대화에 들어가고(선택지 밖에서 이름 붙인 좌표나 기각한 축도 포함), 다음 라운드는 그 전부에서 다시 찾는다. 한 번 준 값은 사용자 자신의 말로만 바뀐다. 의도를 읽어 줄 때 값마다 누가 냈는지를 표시한다 — 사용자의 말인지, 근거가 붙은 AI의 제안인지. 의도를 정하는 답은, 그 답이 받는 것 가운데 보이지 않은 것이 없으면 그대로 해소가 된다 — 확인 턴을 따로 두지 않는다. 닫힘이 AI가 새로 더한 것을 받게 된다면 그 빈틈 하나만 먼저 묻는다. 철회하거나 다음 갈 곳을 댈 수도 있다. 남은 것은 잔여로 남고, 기본값으로 닫히지 않는다.

본 프로토콜은 Periagoge(`/induce`)와 방향성 dual 관계 — Periagoge는 구체적 인스턴스에서 추상으로 상향(bottom-up 방향), Euporia는 의도에서 substrate를 거쳐 좌표로 하향(top-down 방향). 두 프로토콜은 동일 dialectic substrate의 직교 방향으로 합성된다. 해당 페어링은 informal direction-orthogonality로서 정식 categorical limit/colimit duality는 아니다.

## Type

```
(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed)
  → ResolvedEndpoint
```

## 이름

그리스어 εὐπορία — 문자 그대로 "좋은 통로"(εὖ "잘" + πόρος "길") — 는 aporia(ἀπορία, "통로 없음")로부터 해소를 향해 emergent하게 발생하는 자원성을 가리킴. Plato 후기 변증법은 aporia와 euporia를 탐구의 짝지어진 계기로 엮으며, 본 프로토콜은 그 해소-통로 구조를 차용한다.

## 호출 시점

사용자의 의도가 발화되어 있으나 사용자가 아직 이름 붙이지 않은 결정에 따라 갈릴 때 활성화 — 발화, 사용자의 자료, 또는 그 의도가 놓인 영역의 결정 구조에서 읽는다. 모든 좌표가 이미 사용자의 말이나 닿을 수 있는 증거로 정해져 있으면, 무엇이 각 좌표를 정했는지 보고하고 좌표를 올리지 않고 끝난다.

의도가 axis-determined되어 단일 axis-specific protocol이 해소를 커버할 수 있다면 그 프로토콜로 위임. 사용자가 명명되지 않은 본질로 수렴하는 인스턴스 집합을 가지고 있고 locator가 부재하다면 Periagoge로 위임.

## 구성

- `skills/elicit/SKILL.md` — 프로토콜 정의 (elaborate 되는 Lean 4 형식 블록, prose, rules)
- `.claude-plugin/plugin.json` — plugin manifest
