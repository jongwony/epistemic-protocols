# `lean/`

**Responsibility under the Northstar** (root `AGENTS.md`). The Northstar calls the protocols a metalanguage of structured types; this directory is where those types are made precise enough for a machine to check. A protocol's `SKILL.md` carries a Lean block that models its contract, and what is stated and proved about that model lives here.

**Boundary.** `EpistemicProtocols/Ground.lean` is the shared section every protocol block carries verbatim. `EpistemicProtocols/<Protocol>/Theorems.lean` states and proves the guarantees of one protocol's block. `Audit/` checks the blocks against the definition rules, and `Tests/` holds fixtures that break those rules on purpose. The contract text itself stays in the protocol's `SKILL.md`; the modules built from it are generated, not checked in. A property proved here holds under the judgments the block leaves open, which it takes as assumptions.

**Next.** `lakefile.toml` at the repository root for how the pieces build, then the `Theorems.lean` of the protocol in question.
