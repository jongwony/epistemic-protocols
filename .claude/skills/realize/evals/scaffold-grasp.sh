#!/usr/bin/env bash
# Scaffold for both /grasp cases: a service with a rate limiter someone else wrote.
#
# Both cases mount the SAME directory, for the reason the /inquire pair does. What
# separates them is not the substrate but what the user asks to understand:
#
#   grasp-adjudicable  -- the limiter's BEHAVIOUR. Every claim about it is settled by
#                         lines in this tree, so an adjudication against a wrong answer
#                         has material to attach and must attach it.
#   grasp-unattachable -- why this ALGORITHM was chosen over another. Nothing here
#                         records that, so an adjudication would have nothing to attach
#                         and the contract says not to adjudicate at all.
#
# Different substrates would let a run pass one by luck: the second case would then be
# testing whether a file is missing rather than whether the protocol notices it has no
# ground. The absence has to sit inside the same tree the first case reads from.
#
# Two natural misreadings are deliberately available and deliberately false:
#   1. "sliding window" -- it is fixed-window; `int(now // WINDOW_SECONDS)` buckets, so
#      a caller can send 2x the limit across a boundary. One quotable line settles it.
#   2. "shared across workers" -- `_HITS` is a module-level dict, per process. Under the
#      4 workers `deploy.sh` starts, the effective limit is 4x. Two quotable lines.
#
# What is NOT here, and must not be added: any comment, docstring, ADR, commit message
# or README sentence stating WHY fixed-window was chosen. The choice is visible; its
# rationale is not recorded anywhere in this tree.
set -euo pipefail

mkdir -p app tests

cat > requirements.txt <<'EOF'
fastapi>=0.115,<0.116
uvicorn[standard]>=0.32,<0.33
pydantic>=2.9,<3
EOF

cat > app/limiter.py <<'EOF'
"""Request rate limiting."""

import time

from fastapi import Request
from fastapi.responses import JSONResponse

WINDOW_SECONDS = 60
MAX_REQUESTS = 100

_HITS: dict[tuple[str, int], int] = {}


def _bucket(now: float) -> int:
    return int(now // WINDOW_SECONDS)


async def rate_limit(request: Request, call_next):
    client = request.client.host if request.client else "unknown"
    key = (client, _bucket(time.time()))
    _HITS[key] = _HITS.get(key, 0) + 1
    if _HITS[key] > MAX_REQUESTS:
        return JSONResponse(
            status_code=429,
            content={"detail": "rate limit exceeded"},
        )
    return await call_next(request)
EOF

cat > app/config.py <<'EOF'
"""Runtime configuration. Values here are read at import time."""

TIMEOUT_SECONDS = 30
RETRY_MAX = 3
CORS_ALLOW_ORIGINS = ["https://example.com"]
EOF

cat > app/main.py <<'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ALLOW_ORIGINS, TIMEOUT_SECONDS
from app.limiter import rate_limit

app = FastAPI(title="orders")

app.middleware("http")(rate_limit)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "timeout": str(TIMEOUT_SECONDS)}


@app.get("/orders/{order_id}")
async def get_order(order_id: str) -> dict[str, str]:
    return {"id": order_id, "status": "pending"}
EOF

cat > app/__init__.py <<'EOF'
EOF

cat > deploy.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
exec uvicorn app.main:app --host 0.0.0.0 --port 8080 --workers 4
EOF
chmod +x deploy.sh

cat > tests/test_health.py <<'EOF'
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
EOF

cat > pyproject.toml <<'EOF'
[project]
name = "orders"
version = "0.1.0"
requires-python = ">=3.12"
EOF
