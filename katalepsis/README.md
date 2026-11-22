# /grasp — Katalepsis (κατάληψις)
<a name="katalepsis--grasp-κατάληψις"></a>

> [한국어](./README_ko.md)

Use `/grasp` when something in front of you — a large change, code someone else wrote, a dense document, or a result done for you — is hard to follow, or you find yourself nodding along without being sure. Skip it for a trivial formatting change, when you already understand the material, or when you do not want an explanation.

<a name="usage"></a>
Type:

```
/grasp
```

Or ask in your own words: "what did you do?", "explain this", "help me understand", "I don't understand this", or "I can't follow this".

The AI reads the target and the sources around it, then shows a map built around your purpose (in your words, or marked as the AI's reading for you to correct in one line). For each aspect your purpose turns on, the map shows a one-line summary, the facts and material it rests on, and your own reading if you gave one, kept separate from what the target actually does. The AI explains each aspect with one fitting picture, example, or metaphor, and goes deeper when you ask. You move the map in your own words:
- Say "got it" to leave an aspect resting on the AI's explanation, accepted.
- Say "I'd need to see it" to run a check and look at the result together.
- Say "that seems off" to see the facts that bear on your reading — or, if none do, what would settle it.

When what you understand serves your purpose, you say so to close. The map records what the target does and the evidence for it, what you explained in your own words, and which AI explanations you accepted, along with what still needs checking and how, and any AI doubt.

<a name="what-is-katalepsis"></a>
<a name="the-core-problem"></a>
<a name="the-solution"></a>
<a name="difference-from-simple-explanation"></a>
<a name="protocol-flow"></a>
<a name="when-to-use"></a>
<a name="what-the-map-carries"></a>
<details>
<summary>How the map works and how it differs from a simple explanation</summary>

### Name and Problem

**Katalepsis** reinterprets Stoic κατάληψις (firm grasp, certain comprehension) so you can follow along and reach verified understanding of a target in context, whoever produced it. When a target is complex, you may not grasp it in full (`TargetUngrasped`) — thinking you understand, or feeling overwhelmed without an entry point.

**Grounded, not asserted**: an explanation is never taken as understanding. Each aspect separates what the target does (with its material and results) from what you have said of it (your reading, acceptance of the AI's explanation, or nothing yet).

### Difference from Simple Explanation

| Dimension | Simple Explanation | Katalepsis |
|-----------|-------------------|------------|
| Direction | AI talks, user listens | AI shows the map; you move it — accepting, asking to see, or pushing back |
| Entry point | AI decides what to explain | Your stated purpose, or AI's reading of it, marked as AI's and corrected in one line |
| Confirmation | Assumed after explanation | Each aspect separates what the target does (with its material) from what you understand (in your words or as AI's explanation accepted) |
| Ending | Undefined | You say your understanding serves your purpose; the map, with pending checks and any AI doubt, is the record |

### Protocol Flow

```
Gather   → Read the target's material, and the sources that bear on it
Map      → The purpose (the user's words, or AI's reading marked as AI's) and the
           aspects it turns on, each with its facts and the user's own reading
Explain  → Each aspect in one fitting representation; a check, run on the
           user's ask or on AI's stated judgment, adds a fact; the user's
           reading has the facts that bear on it set beside it — where none
           do, what would settle it is named
Close    → The user says what they understand now serves their purpose; the
           map at that moment is the record, with any dissent
```

### What the Map Carries

| Aspect | Description |
|--------|-------------|
| **What the purpose turns on** | What the target does that your purpose needs — explained in one representation, deeper on request; your own reading has the facts that bear on it set beside it |
| **Unvoiced edge** | An edge of what the target does that you have not voiced and your purpose needs, grounded in the target's material — raised openly on the map |
| **Contradiction** | Two sourced statements that cannot both hold on the same scope: one you hold a side of is shown with its working in one round (your words, the target's material, why they part, where they agree); one inside the target is shown as a finding; one against an earlier AI explanation is the AI's to correct |
| **Check** | Something to see or try before trusting an aspect — run on your word, its result shown beside the aspect. Where a reachable check would show what the target does on an aspect your purpose turns on (including what your reading says it does), the AI runs the cheapest on its stated judgment before reporting, or offers it with what running it needs. A result is a fact about the target, never proof of what you understand, which only your own words give |

</details>

<a name="install"></a>
<a name="author"></a>
<details>
<summary>Install and author</summary>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install katalepsis@epistemic-protocols
```

Author: Jongwon Choi (https://github.com/jongwony)

</details>
