#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
PORT="${PORT:-3000}"
BASE="http://127.0.0.1:${PORT}"

echo "==> Production verify (${BASE})"

curl -sf "${BASE}/api/health" | grep -q '"status":"ok"' && echo "✓ health"

curl -sf "${BASE}/api/deals" | grep -q 'service_name' && echo "✓ deals list"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/" | grep -q 200 && echo "✓ home page"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/post" | grep -q 200 && echo "✓ post page"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/terms" | grep -q 200 && echo "✓ terms"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/privacy" | grep -q 200 && echo "✓ privacy"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/favorites" | grep -q 200 && echo "✓ favorites"

curl -sf -o /dev/null -w "%{http_code}" "${BASE}/admin" | grep -q 200 && echo "✓ admin"

DEAL_ID=$(curl -sf "${BASE}/api/deals" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d[0]?.id||'')")
if [ -n "$DEAL_ID" ]; then
  curl -sf -o /dev/null -w "%{http_code}" "${BASE}/deal/${DEAL_ID}" | grep -q 200 && echo "✓ deal detail"
  curl -sf "${BASE}/api/deals/${DEAL_ID}/comments" | grep -q '\[' && echo "✓ comments api"
fi

echo ""
echo "All checks passed."
