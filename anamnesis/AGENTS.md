# `anamnesis/` — `/recollect`

**Responsibility under the Northstar** (root `AGENTS.md`). The protocol here resolves vague recall before earlier work is redone or contradicted. What the person reaches for is looked up in the records past sessions left and shown from those records themselves, and the person's recognition — not the AI's search — decides what was meant.

**Boundary.** `skills/recollect/SKILL.md` is the contract for `/recollect`, and the files in its `references/` are parts of that contract it points to where they apply. `README.md` and `README_ko.md` explain the protocol to people, and `.claude-plugin/` and `.codex-plugin/` carry what a host needs to list and install it; what the protocol does once invoked is set in the `SKILL.md`. `hooks/` and `scripts/` are machinery that runs beside sessions and keeps the record store `/recollect` searches; the `SKILL.md` states what it reads from that store.

**Next.** `skills/recollect/SKILL.md`.
