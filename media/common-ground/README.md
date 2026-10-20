# Common Ground — explainer draft

## English

A ~30-second motion draft of what every protocol shares, for readers who have never seen the project. The same request — "Research 3 competitors and make an exec report" — goes two ways, side by side:

- **Hand off in one line** (left): the AI splits the work across three agents at once. Each agent fills the blanks its own way (one year vs. three years, price vs. market share vs. features), the tables cannot be merged, and the person ends up writing out every condition again: "No, not that…"
- **Ask first, then hand off** (right): the request starts with `/elicit`. The AI reads the intent back in one sentence and shows what is still open, with what leaving each open would change. Seeing that, the person adds a condition nobody had listed — the meeting is about customer churn — and the three agents work from one brief. The merged table comes back with things nobody asked for, organized because the agents shared the same context.

Colors mark how each value reached the work:

| Color | Meaning |
|---|---|
| Grey | The AI decided alone |
| Orange | Recalled alone, after the fact |
| Yellow | Recalled when asked |
| Blue → green | Came to mind on seeing the read-back |
| Purple ✨ | Organized without being asked |

Everything in the clip — companies, churn reasons, logs, numbers — is illustrative, not a run result.

### Files

- `common-ground.en.html`, `common-ground.ko.html` — the animation, one self-contained page per language (Pretendard is loaded from jsdelivr).
- `common-ground.en.mp4`, `common-ground.ko.mp4` — the rendered clips (1280×720, silent).
- `record.js` — records a page to mp4.

### Re-rendering

Prerequisites, not repository dependencies: Node.js with [Playwright](https://playwright.dev) and a Chromium it can launch, `ffmpeg` on `PATH`, and network access for the web font.

```bash
node record.js common-ground.en.html common-ground.en.mp4 30500
node record.js common-ground.ko.html common-ground.ko.mp4 30500
```

The last argument is the recording length in milliseconds; the page's own timeline runs about 28 seconds.

## 한국어

이 프로젝트를 처음 보는 사람을 위해, 모든 프로토콜이 공유하는 바탕을 보여 주는 약 30초짜리 모션 초안입니다. 같은 요청 "경쟁사 3곳 조사해서 임원 보고서 만들어 줘"가 두 갈래로 나란히 진행됩니다.

- **짧게 맡기기** (왼쪽): AI가 곧바로 에이전트 셋에게 나눠 맡깁니다. 에이전트마다 빈칸을 알아서 다르게 채워(1년 vs 3년, 가격 vs 점유율 vs 기능) 표를 합칠 수 없고, 사람은 결국 "아니 그거 말고…" 하며 조건을 처음부터 다시 적습니다.
- **먼저 묻고 맡기기** (오른쪽): 요청 앞에 `/elicit`을 붙입니다. AI가 이해한 의도를 한 문장으로 다시 읽어 주고, 아직 열린 결정과 그것을 비워 두면 바뀌는 것을 보여 줍니다. 그걸 보고 사람은 아무도 적지 않았던 조건 — 이번 회의 안건이 고객 이탈이라는 것 — 을 떠올리고, 에이전트 셋은 같은 지시로 일합니다. 합쳐진 표에는 같은 맥락을 받은 덕분에 요청하지 않은 정리까지 붙어 돌아옵니다.

색은 각 값이 어떻게 작업에 들어왔는지를 나타냅니다: 회색은 AI가 알아서, 주황은 나중에 혼자 떠올림, 노랑은 물어봐서 떠올림, 파랑→초록은 다시 읽어 준 의도를 보고 나서 떠오름, 보라 ✨는 요청 안 했지만 정리됨.

영상 속 회사, 이탈 이유, 로그, 숫자는 모두 각색한 예시이며 실행 결과가 아닙니다.

다시 렌더하려면 위 English 섹션의 명령을 그대로 씁니다. Playwright·Chromium·`ffmpeg`·웹 폰트용 네트워크는 저장소 의존성이 아니라 미리 갖춰야 하는 도구입니다.
