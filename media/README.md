# Explainer clips

## English

This folder holds a practical series of short motion explainers that show the protocols' use cases one protocol at a time, for readers who have never seen the project. Episodes are added one protocol at a time; each is named `<command>.<lang>.*` — the rendered clip and its preview here, the source page under `src/`.

### `/elicit`

A ~30-second clip.

The same request, "Research 3 competitors and make an exec report", goes two ways side by side:

- **Hand off in one line** (left): the AI splits the work across three sub-agents at once. Each agent fills the blanks its own way (one year vs. three years; price vs. market share vs. features), so the tables can't be merged. The person ends up writing out every condition again: "No, not that…"
- **Ask first, then hand off** (right): the request starts with `/elicit`. The AI reads the intent back in one sentence and shows the decisions still open, each with what leaving it open would change. Seeing that, the person adds a condition nobody had listed: the meeting is about customer churn. All three sub-agents then work from one brief. Because they share that context, the merged table comes back with organization nobody asked for (✨).

The colors show how each value reached the work:

| Color | Meaning |
|---|---|
| Grey | The AI decided alone |
| Orange | Recalled alone, after the fact |
| Yellow | Recalled when asked |
| Blue → green | Came to mind on seeing the read-back |
| Purple ✨ | Organized without being asked |

Everything in the clip is illustrative, not a run result: the companies, churn reasons, logs and numbers.

#### Files


- `src/elicit.en.html`, `src/elicit.ko.html`: the animation, as one self-contained page per language. Pretendard loads from jsdelivr.
- `elicit.en.mp4`, `elicit.ko.mp4`: the rendered clips (1280×720, silent).
- `elicit.en.gif`, `elicit.ko.gif`: animated previews (720 px, 8 fps) that the READMEs embed, each linking to its clip.
- `record.js`: records a page to mp4.

#### Re-rendering

You need these tools first; they are not repository dependencies:

- Node.js with [Playwright](https://playwright.dev) and a Chromium it can launch
- `ffmpeg` on `PATH`
- network access, to load the web font

```bash
node record.js src/elicit.en.html elicit.en.mp4 30500
node record.js src/elicit.ko.html elicit.ko.mp4 30500
```

The last argument is how long to record, in milliseconds. The page's own timeline runs about 28 seconds. To rebuild a preview from its clip:

```bash
ffmpeg -i elicit.en.mp4 -vf "fps=8,scale=720:-1:flags=lanczos,palettegen=stats_mode=diff" palette.png
ffmpeg -i elicit.en.mp4 -i palette.png -lavfi "fps=8,scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" elicit.en.gif
```

### `/inquire`

A ~30-second clip.

Two ways into the same customer churn meeting, side by side:

- **Hand it off now** (left): "Make the deck for next week's customer churn meeting." The AI builds it at once from the one file at hand, a sales deck, and leaves the calendar, past minutes, churn dashboard and refund data unopened. The deck says churn is 4%. The day after the meeting an exec points out the dashboard says 6%, and the person recalls, alone, what should have been checked.
- **Gather context first** (right): the person says what they are about to do, starting with `/inquire`: "I'm preparing next week's customer churn meeting." The AI lists what the preparation rests on and where it will look, then looks as far as it can reach before asking anything. It hands everything back at once, each item marked: confirmed with its source; two sources that conflict (dashboard 6% vs. a sales deck from Q2); a source it could not reach and what reaching it needs (finance team access); the one decision that is the person's; and a finding nobody asked about (✨): 4 in 10 churned users left right after a plan change. The turn is not held: the AI says any answer is welcome and that open items stay marked if none comes. Seeing the finding, the person settles the number and puts the plan change on page one. The deck is built from that, with the unreached refund data left blank and marked.

The colors show where each value came from:

| Color | Meaning |
|---|---|
| Grey | The AI decided alone |
| Orange | Recalled alone, after the fact |
| Green | Confirmed by a source |
| Pink | Sources conflict |
| Blue → green | Came to mind on seeing the findings |
| Purple ✨ | Found without being asked |

Everything in the clip is illustrative, not a run result: the meeting, sources, numbers and findings.

#### Files

- `src/inquire.en.html`, `src/inquire.ko.html`: the animation, one page per language.
- `inquire.en.mp4`, `inquire.ko.mp4`: the rendered clips (1280×720, silent).
- `inquire.en.gif`, `inquire.ko.gif`: the previews the `aitesis` READMEs embed.

They re-render the same way as `/elicit`, with `inquire` in place of `elicit` in each command.

## 한국어

이 폴더는 이 프로젝트를 처음 보는 사람을 위해 프로토콜의 쓰임새를 한 프로토콜씩 보여 주는 짧은 모션 설명 영상(실전 시리즈)을 모아 둡니다. 편은 한 프로토콜씩 추가되고, 각 편의 이름은 `<command>.<lang>.*`입니다. 렌더한 영상과 미리보기는 이 폴더에, 원본 페이지는 `src/`에 있습니다.

### `/elicit`

약 30초짜리 영상입니다.

같은 요청 "경쟁사 3곳 조사해서 임원 보고서 만들어 줘"가 두 갈래로 나란히 진행됩니다.

- **짧게 맡기기** (왼쪽): AI가 곧바로 서브 에이전트 셋에게 일을 나눠 맡깁니다. 에이전트마다 빈칸을 알아서 다르게 채워서(1년 vs 3년, 가격 vs 점유율 vs 기능) 표를 합칠 수 없습니다. 사람은 결국 "아니 그거 말고…" 하며 조건을 처음부터 다시 적습니다.
- **먼저 묻고 맡기기** (오른쪽): 요청 앞에 `/elicit`을 붙입니다. AI가 이해한 의도를 한 문장으로 다시 읽어 주고, 아직 열린 결정을 보여 줍니다. 결정마다 비워 두면 무엇이 바뀌는지도 함께 보여 줍니다. 그걸 보고 사람은 아무도 적지 않았던 조건, 곧 이번 회의 안건이 고객 이탈이라는 것을 떠올립니다. 이제 서브 에이전트 셋은 같은 지시로 일합니다. 같은 맥락을 받은 덕분에, 합쳐진 표에는 요청하지 않은 정리(✨)까지 붙어 돌아옵니다.

색은 각 값이 어떻게 작업에 들어왔는지를 나타냅니다.

| 색 | 뜻 |
|---|---|
| 회색 | AI가 알아서 정함 |
| 주황 | 나중에 혼자 떠올림 |
| 노랑 | 물어봐서 떠올림 |
| 파랑→초록 | 다시 읽어 준 의도를 보고 나서 떠오름 |
| 보라 ✨ | 요청하지 않았지만 정리됨 |

영상 속 회사, 이탈 이유, 로그, 숫자는 모두 각색한 예시이고, 실제 실행 결과가 아닙니다.

#### 파일

- `src/elicit.en.html`, `src/elicit.ko.html`: 언어별로 한 페이지에 담긴 애니메이션 원본입니다. Pretendard 폰트는 jsdelivr에서 불러옵니다.
- `elicit.en.mp4`, `elicit.ko.mp4`: 렌더한 영상입니다(1280×720, 무음).
- `elicit.en.gif`, `elicit.ko.gif`: README에 넣는 움직이는 미리보기입니다(720px, 8fps). 누르면 영상으로 갑니다.
- `record.js`: 페이지를 mp4로 녹화합니다.

#### 다시 렌더하기

다음 도구는 저장소 의존성이 아니므로 미리 갖춰 두어야 합니다.

- Node.js와 [Playwright](https://playwright.dev), 그리고 Playwright가 실행할 수 있는 Chromium
- `PATH`에서 찾을 수 있는 `ffmpeg`
- 웹 폰트를 불러올 네트워크

```bash
node record.js src/elicit.en.html elicit.en.mp4 30500
node record.js src/elicit.ko.html elicit.ko.mp4 30500
```

마지막 인자는 녹화 시간(밀리초)입니다. 페이지 자체의 타임라인은 약 28초입니다. 미리보기는 위 English 섹션의 `ffmpeg` 두 줄로 영상에서 다시 만듭니다.

### `/inquire`

약 30초짜리 영상입니다.

같은 고객 이탈 회의를 두 가지 방식으로 준비하는 모습을 나란히 보여 줍니다.

- **바로 맡기기** (왼쪽): "다음 주 고객 이탈 회의 자료 만들어 줘." AI는 손에 잡힌 영업 자료 하나로 곧바로 자료를 만들고, 캘린더·지난 회의록·이탈 대시보드·환불 데이터는 열어 보지 않습니다. 자료에는 이탈률 4%가 들어갑니다. 회의 다음 날 임원이 "대시보드엔 6%던데요?"라고 짚고 나서야, 사람은 무엇을 확인했어야 했는지 혼자 떠올립니다.
- **먼저 맥락부터 모으기** (오른쪽): 사람은 `/inquire`로 시작해 하려는 일을 말합니다. "다음 주 고객 이탈 회의를 준비하려고 해." AI는 이 준비가 무엇에 기대는지와 어디서 찾아볼지를 먼저 적고, 묻기 전에 닿는 데까지 찾아봅니다. 그리고 한 번에 돌려줍니다. 출처와 함께 확인된 것, 서로 다른 두 출처(대시보드 6% vs 2분기 기준 영업 자료 4%), 닿지 못한 곳과 닿으려면 필요한 것(재무팀 권한), 사람이 정할 결정, 그리고 아무도 묻지 않은 발견(✨), 곧 이탈 고객 10명 중 4명이 요금제 변경 직후 떠났다는 사실입니다. AI는 답을 기다리며 턴을 붙잡지 않습니다. 무엇이든 답해 달라고 하고, 답이 없어도 열린 칸은 표시해 두고 진행한다고 말합니다. 그 발견을 본 사람은 숫자를 정하고 요금제 이야기를 첫 장으로 올립니다. 자료는 거기서 만들어지고, 닿지 못한 환불 데이터 칸은 비워 둔 채 표시됩니다.

색은 각 값이 어디서 왔는지를 나타냅니다.

| 색 | 뜻 |
|---|---|
| 회색 | AI가 알아서 정함 |
| 주황 | 나중에 혼자 떠올림 |
| 초록 | 출처로 확인됨 |
| 분홍 | 출처끼리 서로 다름 |
| 파랑→초록 | 찾아온 결과를 보고 나서 떠오름 |
| 보라 ✨ | 묻지 않았지만 찾음 |

영상 속 회의, 출처, 숫자, 발견은 모두 각색한 예시이고, 실제 실행 결과가 아닙니다.

#### 파일

- `src/inquire.en.html`, `src/inquire.ko.html`: 언어별 애니메이션 원본입니다.
- `inquire.en.mp4`, `inquire.ko.mp4`: 렌더한 영상입니다(1280×720, 무음).
- `inquire.en.gif`, `inquire.ko.gif`: `aitesis` README에 넣는 미리보기입니다.

다시 렌더하는 방법은 `/elicit`과 같고, 명령의 `elicit`을 `inquire`로 바꾸면 됩니다.
