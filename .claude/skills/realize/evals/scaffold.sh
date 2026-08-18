#!/usr/bin/env bash
# Scaffold for both /inquire cases: a minimal FastAPI service with no rate limiting.
#
# Both cases need the SAME directory contents, because the trigger-positive case is graded on
# whether file-discoverable facts were read rather than asked (C4/C5), and the trigger-negative
# case is graded on whether an already-specified parameter was re-asked (N4). If the two cases
# saw different substrates, a run could pass one by luck.
#
# Everything a run could legitimately discover here is deliberate: the framework, the middleware
# registration pattern, the existing config constants, and the Python pin. Everything it cannot
# discover — the limit value, the counting key, the error response — is absent by design, so the
# trigger-positive case has something real to surface.
set -euo pipefail

mkdir -p app tests

cat > requirements.txt <<'EOF'
fastapi>=0.115,<0.116
uvicorn[standard]>=0.32,<0.33
pydantic>=2.9,<3
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

app = FastAPI(title="orders")

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
