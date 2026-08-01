# Entropy track — extraction laws and anchor authorization

Read when `Track = entropy` or `Track = hybrid` — whenever `scan_entropy` is about to run. This is the `── ENTROPY EXTRACTION ──` formal block: runtime-normative contract, not commentary.

```
── ENTROPY EXTRACTION ──
extract : Session → Set(IdentifierTuple)
laws:
  identity:          extract(∅) = ∅
  locality:          extract(s₁ ⊔ s₂) = extract(s₁) ⊔ extract(s₂)          -- disjoint sessions
  compositionality:  extract(s) = ⋃ᵢ extractor_i(s)                         -- plugin-summable

precision(t, corpus) = 1 / (1 + |occ(t, corpus \ {t.source})|)
reject(t, θ) ≡ precision(t, corpus) < θ                                    -- derivable, not enumerated
claim_kind(trace) = expected identifier category implied by the recall trace
compatible_anchor(t, trace) ≡ claim_kind(trace) ∈ AuthorizedClaimKinds(source_namespace(t))
  where AuthorizedClaimKinds(ns) = { ck : (ns, ck) ∈ AuthorizedPairs }   -- a namespace determines the claim kinds it can anchor
        AuthorizedPairs = ⋃ᵢ extractor_i.authorized_pairs                -- each extractor declares the (source_namespace, claim_kind) pairs it grounds; the registry is the explicit witness
  -- the witness is defined LOCALLY (extractor registry), independent of Aitesis's reflexive authorizes: analogous structure, different concern (namespace → claim-kind authorization, not evidence-channel authorization)
  -- the tuple carries source_namespace only; claim_kind(t) is not stored, removing the unused-field inconsistency and matching what the regex writer can materialize

extractor registry:
  core (bootstrap) = { URL_literal, PathRef_literal, PR_literal, Issue_literal, Commit_literal, SessionID_literal }
                     -- semantic categories: URL_path group {URL_literal, PathRef_literal},
                     --                      ExplicitRef group {PR_literal, Issue_literal, Commit_literal},
                     --                      Citation group {SessionID_literal}  -- UUIDs as session citations
                     -- each extractor declares the (source_namespace, claim_kind) it authorizes for entropy anchoring (Anamnesis-local canonical values, self-contained — NOT a shared cross-protocol vocabulary):
                     --   URL_literal → (url, url_reference);      PathRef_literal → (fs_path, path_reference)
                     --   PR_literal → (github_pr, pull_request); Issue_literal → (github_issue, issue);  Commit_literal → (git_commit, commit)
                     --   SessionID_literal → (session, session_citation)
  plugin           = { domain-specific extractors conforming to laws }
```
