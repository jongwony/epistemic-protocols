# /inquire — Aitesis (αἴτησις)
<a name="aitesis--inquire-αἴτησις"></a>

[한국어](README_ko.md)

<a name="what-is-inquire"></a>
<a name="what-is-aitesis"></a>
<a name="when-to-use"></a>
<a name="the-core-problem"></a>

Use `/inquire` when your task depends on something you haven’t checked yet. In Claude Code, it asks the AI to look through the files and records it can access and tell you what it verified, what remains open, and what you need to decide.

## Example

You’re preparing slides for a project meeting, and several documents mention the launch date. In Claude Code, enter:

```text
/inquire I’m preparing slides for next week’s project review.
```

An example response could look like this:

> - **Confirmed.** The meeting invite lists the launch schedule as the main agenda item.
> - **Conflicting records.** The project plan says June 12. The last meeting notes say June 19. Neither document says which date was approved.
> - **Couldn’t check.** The latest sign-up figures are in a dashboard I can’t access.
> - **Your decision.** Should the slides include the cost estimate, or focus on the schedule?

The AI starts with what matters most to your task. It names the sources behind each finding, explains what it couldn’t verify, and flags relevant discoveries that came up along the way. If you supply an answer, correct its reading, or point it to another source, it can check again. You can also leave the open items as they are.

<a href="../media/inquire.en.mp4"><img src="../media/inquire.en.gif" alt="Side by side: a request to make a meeting deck built at once from one file, versus /inquire on what the person is preparing, where the AI looks as far as it can reach and hands back what it confirmed, what conflicts, what it could not reach, and a finding nobody asked about" width="720"></a>

<sub>Click the preview to watch the `/inquire` demo. The clip uses illustrative values.</sub>

<a name="install"></a>
## Install and run

Run these commands in your terminal:

```sh
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install aitesis@epistemic-protocols
```

<a name="usage"></a>
<a name="the-solution"></a>
Then enter `/inquire` followed by a description of your task in Claude Code:

```text
/inquire [your current task]
```

<details>
<summary>What the AI checks</summary>

The AI identifies uncertainties in your specific task and checks what it can without changing your files or settings. If it needs a temporary copy to make a check, it removes the copy afterward. If a check needs permission, a change to your setup, or a decision from you, the AI tells you what it needs and which check depends on it.

If you want to see how the protocol handles different situations, read the [scenarios](docs/scenarios.md).

</details>

<details>
<summary>How /inquire relates to other commands</summary>

Use `/inquire` when you need to establish the facts a task depends on. Use Proplasma (`/preview`) when you already have candidate directions and want to see rough versions before choosing one.

If Claude Code selects a protocol on its own, it can skip Aitesis when it already has enough context or when you ask to proceed without checking. Calling `/inquire` directly starts a check.

</details>

## Author

[Jongwon Choi](https://github.com/jongwony)
