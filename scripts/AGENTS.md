# `scripts/`

**Responsibility under the Northstar** (root `AGENTS.md`). Machinery the rest of the repository builds on. `load-protocols.js` is the canonical registry of which protocols exist and in what order, so anything that needs the protocol set derives it from there instead of listing it; `package.js` builds the release archives from the plugin directories.

**Boundary.** `install.sh` and `install-codex.sh` are what the README's install commands run; the rest is maintainer machinery, and using a protocol does not require reading any of it.

**Next.** Root `AGENTS.md` §Development for the commands, then `load-protocols.js`.
