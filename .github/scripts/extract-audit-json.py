#!/usr/bin/env python3
"""Extract the last balanced JSON object containing a `findings` field from a text file.

Used by .github/workflows/claude-style-audit.yml as the slow-path JSON extractor when
the audit's final assistant message includes prose around the JSON object. The fast path
(direct `jq -e '.findings'` on the last assistant message) is attempted first by the
workflow; this script runs only on fast-path failure.

Usage: python3 extract-audit-json.py <input-file>
Output: stdout receives the extracted JSON object (single line). Exit 0 on success, 1 on
no candidate found, 2 on usage error.
"""
import json
import sys


def extract(text: str) -> str | None:
    candidates = []
    depth = 0
    start = -1
    for i, ch in enumerate(text):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}' and depth > 0:
            depth -= 1
            if depth == 0 and start >= 0:
                candidates.append(text[start:i + 1])
                start = -1

    for c in reversed(candidates):
        try:
            obj = json.loads(c)
        except json.JSONDecodeError:
            continue
        if isinstance(obj, dict) and 'findings' in obj:
            return json.dumps(obj)
    return None


def main() -> int:
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <input-file>", file=sys.stderr)
        return 2
    with open(sys.argv[1], encoding='utf-8') as fh:
        text = fh.read()
    result = extract(text)
    if result is None:
        return 1
    print(result)
    return 0


if __name__ == '__main__':
    sys.exit(main())
