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
