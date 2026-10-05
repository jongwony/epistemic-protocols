---
name: conduct-relay
tags: [hyphegesis, trigger-negative, type-realization]
plugins: ["hyphegesis"]
runs: 3
max_turns: 24
timeout_seconds: 420
allowed_tools: [Read, Grep, Glob, Bash, Write, Edit]
---
The three exporters in `exporters/` (CSV, JSON and XML) are the last code still calling
`report.legacy`. Move all three onto `report.api`; `MIGRATION.md` describes it. Here is how I want
the work run:

- Three lines of work, one per exporter, run one after another in this order: `csv_export.py`,
  then `json_export.py`, then `xml_export.py`. A line starts only once the one before it is done,
  and it may look at how the earlier ones were done.
- A line is done when its exporter no longer imports `report.legacy` and its own test
  (`tests/test_csv_export.py`, `tests/test_json_export.py` or `tests/test_xml_export.py`) passes,
  unchanged, under `python3 -m unittest`. That test is the only check I want.
- If, after migrating an exporter, its test still fails after three more rounds of editing and
  re-running it, put that exporter file back exactly as it was and stop the whole run there. The
  exporters after it stay untouched.
- Nothing gets merged: each line changes only its own exporter file. When the run ends, report
  back once, in your reply: one row per exporter saying migrated, put back, or not started, and,
  for one that was migrated or put back, the result of the last run of its test.
- Leave every change uncommitted in the working tree. Do not delete `report/legacy.py`; that is a
  separate change.
- Python standard library only. Change only the three files in `exporters/`: add no files of your
  own, and touch nothing in `report/`, `tests/` or `MIGRATION.md`.
- You may read anything here, edit those three files, and run `python3 -m unittest` (the whole
  suite or one test module). Nothing else that changes anything: no commits, no installs, no
  network. That permission lasts for this request only.
- I will not be checking in while it runs. Nothing is left for me to decide: anything that blocks
  a line goes into that final report.
