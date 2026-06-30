# Apokrypsis (ἀπόκρυψις) — /redact

> [한국어](./README_ko.md)

Redact the secret-shaped values out of a working context — conceal each secret's value while preserving the retrieval pointer that re-obtains it — before that context is emitted, handed to a fresh session, or distilled. A front-door redaction pass with an emit-scan backstop: every secret value is intercepted to a placeholder, command-substitution retrieval commands are preserved, and a load-bearing secret is routed out-of-band rather than dropped.

## Type Signature

```
(SecretExposed, AI, REDACT, WorkingContext) → RedactedContext
```

## What It Does

A working context about to be externalized can carry secret-shaped content — credentials, tokens, API keys, private keys, passwords, and command-substitution secret references. A secret's **value** is the one thing that must never propagate into a portable artifact or a fresh recipient. Apokrypsis intercepts each secret value at its `(item, location)` and replaces it with a placeholder, so the value cannot reach any emit channel, while preserving the *retrieval locus* so a needed secret can still be re-obtained out-of-band.

The morphism runs a front-door pass, surfaces the load-bearing secrets at a gate, then re-checks the actual output:

- **Scan + Classify** — detect every secret per `(item, location)` (one item may carry more than one secret, each keyed separately) and classify each by kind: Credential, Token, ApiKey, PrivateKey, Password, CommandSubstitutionRef, or an emergent shape the named set does not cover.
- **Redact (front door)** — replace each secret value with the placeholder `[REDACTED:{kind}@{location}]` in the candidate (never the source). For a command-substitution form (`$(vault read …)`), the form *is* the retrieval locus: it is preserved as a grounded pointer, and only a separately-inlined resolved value is redacted.
- **Out-of-band disposition gate** — a **load-bearing** secret (one the declared next task genuinely needs) is surfaced — by kind, location, and placeholder, never by value — for the user to route: **Route** by a stable retrieval pointer, **Supply** out-of-band at use time, or **Drop**. A needed secret is never silently dropped.
- **Emit-scan backstop** — re-check the *actual* candidate output for any value that slipped through (a detection miss, or a value copied downstream after redaction). A catch is routed to the same gate, never silently re-redacted — a deterministic re-redact would re-miss exactly the secret the front door already missed.

**Core principle**: Value Never Emitted — a secret value never reaches an emit channel; a secret is surfaced only by kind, location, and placeholder, never by value. And Conceal over Erase — the value is concealed, the retrieval locus is kept, so a load-bearing secret is routed out-of-band rather than lost.

## When It Activates

- User calls `/redact` (Layer 1, always available) — typically just before `/distill` or any portable emit.
- AI detects secret-shaped content in a context about to be externalized (Layer 2, silent detection).

**Composition with `/distill`**: `/distill` (Diylisis) assumes a **secret-free working context** — secret redaction is not part of the distill morphism. Apokrypsis is the upstream pass that earns that assumption: its `RedactedContext` **is** the secret-free context `/distill` consumes. Run `/redact`, then `/distill` on the result.

**Substrate boundary**: Secret/credential policy is substrate-adjacent. Apokrypsis surfaces, classifies, and records each secret's disposition — the epistemic work — but does not enforce external substrate semantics: it never writes a value to a vault, mutates a secret store, or transmits a credential. Route / Supply record what the recipient must do out-of-band; enforcement is delegated by handoff. This is why Apokrypsis is packaged as a specialized plugin rather than a graph-node protocol — its composition with the protocols is the prose secret-free-context contract, not a dependency-graph edge.

## Disposition Coproduct

A load-bearing secret surfaced at the gate is routed into one of three named dispositions — the value stays redacted either way; the disposition routes how the recipient re-obtains it.

| Disposition | Meaning |
|-------------|---------|
| **Route** | Carry the secret by a stable retrieval pointer the recipient resolves out-of-band (a vault path, a secret-store key, the preserved command-substitution form). |
| **Supply** | No stable pointer — the recipient supplies the value out-of-band at use time (env injection, prompt-time secret); the handoff names what is needed, never the value. |
| **Drop** | The next task does not need this secret; release it (the placeholder remains as a marker, the value is gone). |

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install apokrypsis@epistemic-protocols
```

## Usage

```
/redact [optional next-task]   # Redact secret values from a working context before it is distilled or handed off
```

## License

MIT
