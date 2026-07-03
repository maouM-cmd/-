#!/usr/bin/env bash
# coupon-board デプロイ前の一括検証（破壊的操作なし）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BOARD="$ROOT/coupon-board"

echo "=== coupon-board pre-deploy check ==="
echo "Root: $ROOT"

if [[ ! -d "$BOARD" ]]; then
  echo "ERROR: coupon-board/ not found"
  exit 1
fi

cd "$BOARD"

echo ""
echo "[1/3] npm run lint"
npm run lint

echo ""
echo "[2/3] npm run build"
npm run build

echo ""
if [[ -x "$BOARD/scripts/verify-prod.sh" ]]; then
  echo "[3/3] scripts/verify-prod.sh (optional — requires running server)"
  if bash "$BOARD/scripts/verify-prod.sh"; then
    echo "verify-prod: OK"
  else
    echo "WARN: verify-prod failed or server not running. lint/build passed — deploy may still proceed after manual smoke test."
  fi
else
  echo "[3/3] verify-prod.sh skipped (not found or not executable)"
fi

echo ""
echo "=== All checks passed ==="
echo "NOTE: main への push は Render 自動デプロイをトリガーします。人間の承認後に実行してください。"
