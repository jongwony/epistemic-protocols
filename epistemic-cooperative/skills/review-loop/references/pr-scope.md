# PR Scope and Landing

Load for PR scope before the first review and consult again when repairs change head.
Use repository/GitHub tools available to the host; `gh` below is an example binding.

1. Resolve the explicit PR, or detect the current branch's PR with `gh pr view`.
   Capture `headRefOid`, `baseRefName`, the resolved merge-base used by the diff,
   changed paths, and diff statistics. Materialize the revisions locally.
2. Review from a checkout of that PR head. If local `HEAD` differs, reconcile in a
   suitable checkout/worktree or report the mismatch and stop. Merely fetching the
   commit does not update the files a reviewer reads. Preserve unrelated local work;
   overlapping dirt must be stowed or adopted before PR review. A clean worktree
   avoids mixing local content with a committed-tree pointer.
3. If the base branch is itself a PR, fetch its current head and test whether the
   captured cut remains its ancestor. An ordinary advance preserves that relation;
   a rewrite may not. On a broken relation, present the cut, lower PR head, and
   intervening changes and stop for recovery direction.
4. Follow the landing settled at Phase 0. `head` appends repairs to the reviewed head.
   `stacked` cuts a layer from that head. Where using GitHub stacks, check the
   `github/gh-stack` extension, resolve existing ordered membership and the bottom
   base first. Follow `gh stack link --help` to link the repair layer while preserving
   those relationships; supplying only a reviewed PR and new branch can omit existing
   members or reset a non-default bottom base. Verify resulting PR bases and stack
   membership. A base chain alone does not establish linkage. Report a missing
   capability rather than claiming a link.
5. Before re-review, commit repairs to the selected destination and resolve its new
   local head. Keep the original base fixed and compare through this new head. On a
   stack, re-reading the lower PR's `headRefOid` would omit the repairs: use the layer's
   head. Refresh changed paths and intent against the entire captured range.

The resulting verdict covers the reviewed range, including the repair layer when
stacked. A later invocation on the upper PR resolves its own incremental base normally.
The repair layer records its relationship to the reviewed PR and declares no closing
issues of its own; exit recording follows the work's issue links as specified in
[exit handover](exit-handover.md).
