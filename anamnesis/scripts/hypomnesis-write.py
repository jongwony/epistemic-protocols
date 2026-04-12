#!/usr/bin/env python3
"""
SessionEnd hook: write hypomnesis store entries for future /recollect access.

Reads session JSONL and extracts recall INDEX files:
  hypomnesis/{session-id}/clue.md      — recall anchors (keywords, user voice)
  hypomnesis/{session-id}/vector.md    — decision index
  hypomnesis/{session-id}/narrative.md — session story (addendum-based)

Architecture:
  - hypomnesis = recall INDEX, session JSONL = SSOT
  - Write rich, read simple (Topology Divergence)
  - Heuristic extraction (no LLM at hook time)
  - Atomic write (tempdir + rename for new sessions)
  - Fail-open: any exception → exit 0 (never block session exit)
"""

import json
import re
import signal
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

# --- SIGHUP guard: survive terminal close ---
try:
    signal.signal(signal.SIGHUP, signal.SIG_IGN)
except (OSError, AttributeError):
    pass

# --- Constants ---
MIN_SESSION_BYTES = 1024
MAX_USER_MESSAGES = 200
MAX_UTTERANCE_LEN = 200
MAX_KEY_UTTERANCES = 5
MAX_KEYWORDS = 15
MAX_DECISIONS = 10
SKIP_REASONS = frozenset({"clear"})

PROTOCOL_MAP = {
    "/frame": "frame", "/gap": "gap", "/clarify": "clarify",
    "/goal": "goal", "/bound": "bound", "/inquire": "inquire",
    "/ground": "ground", "/attend": "attend",
    "/contextualize": "contextualize", "/grasp": "grasp",
    "/reflect": "reflect", "/recollect": "recollect",
    "/write": "write", "/verify": "verify",
    "/catalog": "catalog", "/report": "report",
    "/onboard": "onboard", "/dashboard": "dashboard",
    "/compose": "compose", "/sophia": "sophia", "/curses": "curses",
}

DECISION_RE = re.compile(
    r"(\uacb0\uc815|\ud655\uc815|\uc120\ud0dd|\ucc44\ud0dd|\uae30\uac01|\uac70\ubd80|\ubc29\ud5a5|\ud569\uc758|\uc2b9\uc778|\uba38\uc9c0|"
    r"rejected|decided|confirmed|chosen|approved|selected|merged|"
    r"direction|concluded|finalized)",
    re.IGNORECASE,
)

WORD_RE = re.compile(r"[a-zA-Z\uac00-\ud7a3_][a-zA-Z\uac00-\ud7a30-9_-]{2,}")

STOP_WORDS = frozenset({
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "for", "and", "nor", "but",
    "or", "yet", "so", "in", "on", "at", "to", "from", "by", "with",
    "of", "this", "that", "these", "those", "it", "its", "my", "your",
    "his", "her", "our", "their", "not", "no", "if", "then", "else",
    "when", "while", "as", "up", "out", "about", "into", "through",
    "just", "also", "too", "very", "all", "any", "each", "every",
    "what", "which", "who", "how", "where", "why", "than", "more",
    "some", "other", "only", "now", "here", "there", "new", "like",
})


def text_from_content(content):
    """Extract plain text from message content (string or list of blocks)."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
        return "\n".join(parts)
    return ""


def parse_session(transcript_path):
    """Parse JSONL, return (user_msgs, assistant_texts, timestamps, protocols)."""
    user_msgs = []
    assistant_texts = []
    timestamps = []
    protocols = set()

    with open(transcript_path, "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue

            ts = entry.get("timestamp", "")
            if ts:
                timestamps.append(ts)

            etype = entry.get("type", "")

            if etype == "user" and len(user_msgs) < MAX_USER_MESSAGES:
                text = text_from_content(
                    entry.get("message", {}).get("content", "")
                )
                if not text:
                    continue
                for slash, name in PROTOCOL_MAP.items():
                    if slash in text:
                        protocols.add(name)
                user_msgs.append({"text": text, "ts": ts})

            elif etype == "assistant":
                text = text_from_content(
                    entry.get("message", {}).get("content", "")
                )
                if text:
                    assistant_texts.append(text)

    return user_msgs, assistant_texts, timestamps, sorted(protocols)


def extract_keywords(user_msgs):
    """Frequency-based keyword extraction from user messages."""
    freq = {}
    for msg in user_msgs:
        if _is_noise(msg["text"]):
            continue
        text = _clean_text(msg["text"])
        for w in WORD_RE.findall(text):
            wl = w.lower()
            if wl not in STOP_WORDS and len(wl) >= 3:
                freq[wl] = freq.get(wl, 0) + 1
    return [
        w for w, _ in sorted(freq.items(), key=lambda x: (-x[1], x[0]))
    ][:MAX_KEYWORDS]


def extract_topics(user_msgs, keywords):
    """Infer topics from first messages and file paths."""
    topics = []
    for msg in user_msgs[:3]:
        for path_match in re.findall(
            r"[\w/-]+\.(?:md|py|js|ts|json)", msg["text"][:500]
        ):
            for part in path_match.split("/"):
                cleaned = re.sub(r"\.\w+$", "", part)
                if len(cleaned) > 3 and cleaned not in topics:
                    topics.append(cleaned)
    for kw in keywords[:5]:
        if kw not in topics:
            topics.append(kw)
    return topics[:8]


def _is_noise(text):
    """Detect system-injected or plugin-loaded content."""
    t = text.strip()
    return (
        t.startswith("Base directory for this skill:")
        or t.startswith("<local-command-")
        or t.startswith("<system-reminder>")
        or t.startswith("Tool loaded")
        or "<local-command-caveat>" in t
        or "<local-command-stdout>" in t
    )


def _clean_text(text):
    """Strip XML-like tags and command wrappers."""
    cleaned = re.sub(r"<command-[^>]*>[^<]*</command-[^>]*>\s*", "", text)
    cleaned = re.sub(r"<local-command-[^>]*>.*?</local-command-[^>]*>", "", cleaned, flags=re.DOTALL)
    cleaned = re.sub(r"<system-reminder>.*?</system-reminder>", "", cleaned, flags=re.DOTALL)
    cleaned = re.sub(r"<[^>]+>", "", cleaned)
    return cleaned.strip()


def extract_initial_request(user_msgs):
    """First substantive user message, stripped of system content."""
    for msg in user_msgs:
        if _is_noise(msg["text"]):
            continue
        cleaned = _clean_text(msg["text"])
        if len(cleaned) > 10:
            return cleaned[:500]
    return _clean_text(user_msgs[0]["text"])[:500] if user_msgs else ""


def extract_key_utterances(user_msgs):
    """Notable user quotes — longer and decision-laden."""
    candidates = []
    for msg in user_msgs:
        text = msg["text"].strip()
        if len(text) < 30 or _is_noise(text):
            continue
        if text.startswith("<command-"):
            continue
        if text.strip().isdigit():
            continue
        text = _clean_text(text)
        if len(text) < 30:
            continue
        score = len(text)
        if DECISION_RE.search(text):
            score *= 2
        display = text[:MAX_UTTERANCE_LEN]
        if len(text) > MAX_UTTERANCE_LEN:
            display += "..."
        candidates.append((score, display))
    candidates.sort(key=lambda x: -x[0])
    return [t for _, t in candidates[:MAX_KEY_UTTERANCES]]


def extract_decisions(assistant_texts):
    """Decision signals from assistant text."""
    decisions = []
    for text in assistant_texts:
        for sent in re.split(r"[.\u3002\n]", text):
            sent = sent.strip()
            if DECISION_RE.search(sent) and 20 < len(sent) < 300:
                decisions.append(sent)
                if len(decisions) >= MAX_DECISIONS:
                    return decisions
    return decisions


def extract_cross_refs(user_msgs, assistant_texts):
    """Memory file references and issue/PR numbers."""
    refs = set()
    all_texts = [m["text"] for m in user_msgs[:20]] + assistant_texts[:20]
    memory_re = re.compile(
        r"(memory/[\w_]+\.md|project_[\w_]+\.md|feedback_[\w_]+\.md)"
    )
    issue_re = re.compile(r"(?:PR |#)(\d{1,4})\b")
    for text in all_texts:
        for m in memory_re.finditer(text):
            ref = m.group(0)
            if not ref.startswith("memory/"):
                ref = "memory/" + ref
            refs.add(ref)
        for m in issue_re.finditer(text):
            refs.add(f"#{m.group(1)}")
    return sorted(refs)[:10]


# --- File builders ---


def _esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def build_clue(
    session_id, date, started_at, last_turn_at,
    topics, keywords, initial_request, key_utterances, cross_refs,
):
    lines = [
        "---",
        f"session_id: {session_id}",
        f"date: {date}",
        f"started_at: {started_at}",
        f"last_turn_at: {last_turn_at}",
        f"topics: [{', '.join(topics)}]",
        f"keywords: [{', '.join(keywords)}]",
        f'initial_request: "{_esc(initial_request)}"',
        "key_utterances:",
    ]
    for u in key_utterances:
        lines.append(f'  - "{_esc(u)}"')
    lines.append("cross_refs:")
    for r in cross_refs:
        lines.append(f"  - {r}")
    lines.extend(["---", ""])
    lines.append(f"Session started with: {initial_request[:200]}")
    if topics:
        lines.append(f"Main topics: {', '.join(topics[:5])}")
    if key_utterances:
        lines.append("")
        lines.append("Notable user statements:")
        for u in key_utterances:
            lines.append(f"- {u}")
    return "\n".join(lines) + "\n"


def build_vector(session_id, date, decisions):
    labels = [d[:60] + ("..." if len(d) > 60 else "") for d in decisions[:5]]
    lines = [
        "---",
        f"session_id: {session_id}",
        f"date: {date}",
        f"decisions: [{', '.join(_esc(l) for l in labels)}]",
        "---",
        "",
    ]
    if decisions:
        lines.append("## Decisions")
        for d in decisions:
            lines.append(f"- {d}")
    else:
        lines.append("No explicit decisions detected in this session.")
    return "\n".join(lines) + "\n"


def build_narrative(
    session_id, date, started_at, last_turn_at,
    topics, protocols, initial_request, user_msgs,
):
    lines = [
        "---",
        f"session_id: {session_id}",
        f"started_at: {started_at}",
        f"last_turn_at: {last_turn_at}",
        f"date: {date}",
        f"topics: [{', '.join(topics)}]",
        f"protocols_used: [{', '.join(protocols)}]",
        "continuations: []",
        "forks: []",
        "---",
        "",
        f"## {started_at[:16]} \u2014 Initial Narrative",
        "### Origin",
        initial_request[:500],
        "### Direction",
    ]

    mid = len(user_msgs) // 3
    direction_written = False
    for msg in user_msgs[mid: mid + 5]:
        text = msg["text"].strip()
        if _is_noise(text) or text.startswith("<command-"):
            continue
        cleaned = _clean_text(text)
        if len(cleaned) > 20:
            lines.append(cleaned[:300])
            direction_written = True
            break
    if not direction_written:
        lines.append("Session progressed through structured work.")

    lines.append("### Outcome")
    outcome_written = False
    for msg in reversed(user_msgs[-5:]):
        text = msg["text"].strip()
        if _is_noise(text) or text.startswith("<command-"):
            continue
        cleaned = _clean_text(text)
        if len(cleaned) > 10:
            lines.append(cleaned[:300])
            outcome_written = True
            break
    if not outcome_written:
        lines.append("Session concluded.")

    return "\n".join(lines) + "\n"


# --- Writer ---


def write_store(target_dir, files):
    """Write store files. Atomic rename for new sessions."""
    target_dir = Path(target_dir)
    target_dir.parent.mkdir(parents=True, exist_ok=True)

    if target_dir.exists():
        for name, content in files.items():
            dest = target_dir / name
            if name == "narrative.md" and dest.exists():
                with open(dest, "a", encoding="utf-8") as f:
                    f.write("\n" + content)
            else:
                dest.write_text(content, encoding="utf-8")
    else:
        tmp = Path(tempfile.mkdtemp(dir=target_dir.parent))
        try:
            for name, content in files.items():
                (tmp / name).write_text(content, encoding="utf-8")
            tmp.rename(target_dir)
        except Exception:
            import shutil
            shutil.rmtree(tmp, ignore_errors=True)
            raise


# --- Main ---


def main():
    try:
        hook_input = json.load(sys.stdin)
    except Exception:
        return 0

    session_id = hook_input.get("session_id", "")
    transcript_path = hook_input.get("transcript_path", "")
    reason = hook_input.get("reason", "")

    if reason in SKIP_REASONS or not session_id or not transcript_path:
        return 0

    tp = Path(transcript_path)
    if not tp.exists() or tp.stat().st_size < MIN_SESSION_BYTES:
        return 0

    project_dir = tp.parent
    store_dir = project_dir / "hypomnesis" / session_id

    user_msgs, assistant_texts, timestamps, protocols = parse_session(
        transcript_path
    )
    if not user_msgs:
        return 0

    started_at = timestamps[0] if timestamps else ""
    last_turn_at = timestamps[-1] if timestamps else ""
    date = (
        started_at[:10]
        if started_at
        else datetime.now(timezone.utc).strftime("%Y-%m-%d")
    )

    initial_request = extract_initial_request(user_msgs)
    keywords = extract_keywords(user_msgs)
    topics = extract_topics(user_msgs, keywords)
    key_utterances = extract_key_utterances(user_msgs)
    decisions = extract_decisions(assistant_texts)
    cross_refs = extract_cross_refs(user_msgs, assistant_texts)

    files = {
        "clue.md": build_clue(
            session_id, date, started_at, last_turn_at,
            topics, keywords, initial_request, key_utterances, cross_refs,
        ),
        "vector.md": build_vector(session_id, date, decisions),
        "narrative.md": build_narrative(
            session_id, date, started_at, last_turn_at,
            topics, protocols, initial_request, user_msgs,
        ),
    }
    write_store(store_dir, files)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        sys.exit(0)
