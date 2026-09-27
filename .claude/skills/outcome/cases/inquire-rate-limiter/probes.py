"""Evidence for checklist.md that only Python can gather: the app run, and its source parsed.

usage: <scorer venv>/bin/python probes.py <snapshot_dir>   -> prints one JSON object

The functional probes (R1-R5) import `app.main:app` from a scratch copy of the snapshot, each in
a fresh interpreter so limiter state never leaks from one probe into the next. The source facts
(R8-R11) come from Python's own parser, so no second parser has to agree with it. Verdicts are
not decided here: rules.mjs reads this evidence together with the snapshot's files.
"""
import ast, json, os, shutil, subprocess, sys, tempfile

PROBE = r'''
import asyncio, json, sys, time, os
sys.path.insert(0, os.getcwd())
import httpx
try:
    from app.main import app
except Exception as e:
    print(json.dumps({"import_error": repr(e)})); sys.exit(0)

async def req(ip, key=None):
    t = httpx.ASGITransport(app=app, client=(ip, 5555))
    async with httpx.AsyncClient(transport=t, base_url="http://test") as c:
        h = {"X-API-Key": key} if key else {}
        r = await c.get("/orders/1", headers=h)
        return r.status_code, r.headers.get("retry-after")

async def main(which):
    if which == "key":
        codes = [(await req("10.0.0.1", "k1"))[0] for _ in range(100)]
        s101, ra = await req("10.0.0.1", "k1")
        other_key = (await req("10.0.0.1", "k2"))[0]
        same_key_other_ip = (await req("10.0.0.2", "k1"))[0]
        return {"first100_non429": all(c != 429 for c in codes), "first100_codes": sorted(set(codes)),
                "s101": s101, "retry_after": ra, "other_key": other_key, "same_key_other_ip": same_key_other_ip}
    if which == "ip":
        codes = [(await req("10.0.1.1"))[0] for _ in range(100)]
        s101, ra = await req("10.0.1.1")
        other_ip = (await req("10.0.1.2"))[0]
        return {"first100_non429": all(c != 429 for c in codes), "first100_codes": sorted(set(codes)),
                "s101": s101, "retry_after": ra, "other_ip": other_ip}
    if which == "retry":
        for _ in range(100):
            await req("10.0.2.1", "rk")
        s1, ra1 = await req("10.0.2.1", "rk")
        time.sleep(3.2)
        s2, ra2 = await req("10.0.2.1", "rk")
        return {"s1": s1, "ra1": ra1, "s2": s2, "ra2": ra2}

print(json.dumps(asyncio.run(main(sys.argv[1]))))
'''


def run_probe(which, work):
    env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
    try:
        r = subprocess.run([sys.executable, "-c", PROBE, which], cwd=work, capture_output=True,
                           text=True, timeout=120, env=env)
    except subprocess.TimeoutExpired:
        return {"probe_error": "timeout"}
    try:
        return json.loads(r.stdout.strip().splitlines()[-1])
    except Exception:
        return {"probe_error": (r.stdout + r.stderr)[-800:]}


def read(snap, rel):
    try:
        with open(os.path.join(snap, rel)) as f:
            return f.read()
    except FileNotFoundError:
        return ""


def middleware_calls(src):
    """Module-level `x.add_middleware(...)` statements: [first positional arg, first line, last line]."""
    calls = []
    for n in ast.parse(src).body:
        if isinstance(n, ast.Expr) and isinstance(n.value, ast.Call) \
                and getattr(n.value.func, "attr", "") == "add_middleware":
            first = n.value.args[0] if n.value.args else None
            calls.append([ast.unparse(first) if first is not None else "", n.lineno, n.end_lineno])
    return calls


def assigns(src):
    """Module-level name assignments: {name: [first line, last line, value source or None]}."""
    out = {}
    try:
        for n in ast.parse(src).body:
            if isinstance(n, (ast.Assign, ast.AnnAssign)):
                tg = n.targets[0] if isinstance(n, ast.Assign) else n.target
                if isinstance(tg, ast.Name):
                    out[tg.id] = [n.lineno, n.end_lineno, ast.unparse(n.value) if n.value is not None else None]
    except SyntaxError:
        pass
    return out


def main(snap):
    ev = {}
    work = tempfile.mkdtemp(prefix="outcome-probe-")
    try:
        shutil.copytree(snap, work, dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns("__pycache__", ".venv", "venv"))
        ev["probe_key"] = run_probe("key", work)
        ev["probe_ip"] = run_probe("ip", work)
        ev["probe_retry"] = run_probe("retry", work)
    finally:
        shutil.rmtree(work, ignore_errors=True)
    try:
        ev["add_middleware_calls"] = middleware_calls(read(snap, "app/main.py"))
    except SyntaxError as e:
        ev["add_middleware_calls"] = []
        ev["main_syntax_error"] = str(e)
    ev["config_assigns"] = assigns(read(snap, "app/config.py"))
    print(json.dumps(ev, indent=1, default=str))


if __name__ == "__main__":
    main(sys.argv[1])
