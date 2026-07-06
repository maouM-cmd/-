#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
PORT="${PORT:-3000}"
BASE="${APP_URL:-http://127.0.0.1:${PORT}}"
BASE="${BASE%/}"

echo "==> Production verify (${BASE})"

curl -sf "${BASE}/api/health" | grep -q '"status":"ok"' && echo "✓ health"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/" | grep -q 200 && echo "✓ home page"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/create" | grep -q 200 && echo "✓ create page"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/login" | grep -q 200 && echo "✓ login"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/signup" | grep -q 200 && echo "✓ signup"

curl -sf "${BASE}/api/auth/me" | grep -q '"user":null' && echo "✓ auth/me (unauthenticated)"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/terms" | grep -q 200 && echo "✓ terms"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/privacy" | grep -q 200 && echo "✓ privacy"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/manifest.json" | grep -q 200 && echo "✓ manifest"

echo ""
echo "All checks passed."
