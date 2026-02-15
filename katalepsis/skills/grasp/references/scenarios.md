# Comprehension Scenarios

Verification scenarios for Katalepsis Phase 3. AI presents scenario walkthrough
when user response reveals a comprehension gap that would benefit from concrete
example. AI determines when to use scenarios based on evaluation of user's
answer — not user selection.

## How to Use

When AI determines a scenario walkthrough is appropriate, match current category
and gap type using priority order:
1. Exact match: same Category AND same GapType
2. GapType match: same GapType, any Category (GapType carries verification-specific signal)
3. Category match: same Category, any GapType
4. No match: use closest Category scenario

Present setup + walkthrough table, then resume AskUserQuestion verification.

## Scenario Catalog

### Scenario 1: Refactoring + Scope

**Setup**: AI extracted shared validation logic from an endpoint handler into a
separate utility module. The original handler called validation inline; now it
imports from the utility.

| Step | Verifier asks | Checks |
|------|---------------|--------|
| 1 | "Where does validation happen now compared to before?" | Locates moved logic |
| 2 | "What other files could import this new utility?" | Recognizes scope expansion |
| 3 | "If you change the validation rule, how many places are affected?" | Grasps single-point-of-change |
| 4 | "Does that match what you expected the refactoring to do?" | Confirms or surfaces gap |

### Scenario 2: Bug Fix + Causality

**Setup**: AI fixed a null reference error in optional configuration field
processing. The fix added a default value fallback before the field is accessed.

| Step | Verifier asks | Checks |
|------|---------------|--------|
| 1 | "What value did this field have before the fix when config was missing?" | Identifies null source |
| 2 | "Why did the error only appear with certain configurations?" | Traces causal chain |
| 3 | "What does the default value mean for configs that do set this field?" | Checks unchanged paths |
| 4 | "Could this same pattern exist in other config fields?" | Verifies causal generalization |

### Scenario 3: Architecture + Expectation

**Setup**: AI introduced a middleware layer between request handlers and the
data access layer. Previously handlers called data access directly; now all
requests pass through middleware for logging, auth, and error wrapping.

| Step | Verifier asks | Checks |
|------|---------------|--------|
| 1 | "What happens to a request now that didn't happen before?" | Identifies new stages |
| 2 | "If you add a new handler, what do you need to do differently?" | Tests new contract expectation |
| 3 | "What would break if you bypassed the middleware?" | Verifies architectural invariant |
| 4 | "Is this what you expected when you asked for the change?" | Surfaces expectation alignment |
