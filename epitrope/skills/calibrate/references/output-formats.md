# Output Formats

## Phase 2: Scenario Format

**Scenario format** (Akinator-style binary/ternary choice):

```
For this task, I'd like to calibrate how I should handle [domain]:

[Concrete scenario description relevant to the actual task]

Options:
1. **[Autonomy level A]** — [what this means in practice]
2. **[Autonomy level B]** — [what this means in practice]
3. **[Autonomy level C]** — [if applicable]
```

**Design principles**:
- **Concrete scenarios**: Use task-specific situations, not abstract policy questions
- **Binary/ternary**: Maximum 3 options per question (excluding "Other")
- **Refinement available**: After initial answer, may ask one follow-up for precision
- **Domain cap**: Maximum 4 domains per calibration session

**Refinement questions** (optional, one per domain):
- FileModification: "What about persistent files (config, memory, rules) vs. regular code changes?"
- Exploration: "How far should I look beyond the immediate task scope?"
- Strategy: "If I find a better approach mid-execution, should I...?"
- External: "Should I draft PR descriptions for your review or create directly?"

## Phase 4: Contract Format

**Contract format** (Solo mode — WHAT + HOW MUCH):

```
Here's the delegation contract for this task:

**Autonomous** (I'll proceed without asking):
- [list of calibrated autonomous actions]

**Report then act** (I'll tell you what I'm doing, then proceed):
- [list of report-then-act actions]

**Ask before** (I'll ask for permission first):
- [list of ask-before actions]

**Halt conditions** (I'll stop and escalate):
- [list of halt conditions]

**Skipped** (not applicable to this task):
- [list of domains from Λ.skipped, if any]

**Defaults** (uncalibrated domains default):
- Exploration: autonomous (read-only, inherently safe)
- Others: ask-before

Options:
1. **Approve** — apply this contract
2. **Adjust** — I'd like to change something
```

**Contract format** (Team modes — WHO + WHAT + HOW MUCH):

```
Here's the delegation contract for this task:

**Team Structure** (WHO):
- [role assignments]

**Autonomous** (proceed without asking):
- [list of calibrated autonomous actions]

**Report then act** / **Ask before** / **Halt conditions**:
- [as in Solo format]

**Authority transition**:
Approval replaces the team's prior operating contract with this DelegationContract.

Options:
1. **Approve** — apply this contract (authority replacement)
2. **Adjust** — I'd like to change something
```

If user selects "Adjust": present sub-options — "Adjust team structure" (→ Phase 1, TeamAugment/TeamRestructure only) or "Adjust domain calibration" (→ Phase 2). Solo mode only offers "Adjust domain calibration".

**Authority replacement**: Approval is not advisory — it replaces the team's prior operating contract (e.g., MissionBrief from Prothesis) with the DelegationContract. Execution-layer distribution (SendMessage, Task spawning) is handled by built-in commands after protocol termination.
