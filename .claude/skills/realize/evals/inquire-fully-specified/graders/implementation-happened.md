---
type: tool_used
tool: Edit
min: 1
target: trace
---
# The relay must proceed, not stop

Phase 0's zero-uncertainty path is `sufficiency_relay(reasoning) → proceed` — present the
finding, then carry on with the prospect unchanged. A relay that stops has been realized as a
gate, which is the failure this case exists to catch.

The prompt asks for edits to `app/main.py`, `app/config.py` and `requirements.txt`, so at least
one edit is the behavioural signature of having proceeded.

This is the mirror of the trigger-positive case's `no-write` / `no-edit` pair: there the tool was
granted and had to go unused, here the same tool is granted and has to be used. Together they
distinguish a protocol that gates correctly from one that gates always or never.
