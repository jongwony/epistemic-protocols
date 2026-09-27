# `epharmoge/` — `/contextualize`

**Responsibility under the Northstar** (root `AGENTS.md`). The protocol here closes the gap between an output that is correct and one that fits. After execution, mismatches between the result and the person's actual situation are surfaced, and the person directs how the result is adapted, so a right answer does not settle into the wrong context.

**Boundary.** `skills/contextualize/SKILL.md` is the contract for `/contextualize`; it names any supporting file in its `references/` to read where that file applies. `README.md`, `README_ko.md`, and `docs/` explain the protocol to people, and `.claude-plugin/` and `.codex-plugin/` carry what a host needs to list and install it; what the protocol does once invoked is set in the `SKILL.md`.

**Next.** `skills/contextualize/SKILL.md`.
