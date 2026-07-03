#!/usr/bin/env bash
# GitHub投稿前の安全チェック（破壊的操作なし）
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

ERRORS=0
WARNINGS=0

fail() { echo "ERROR: $1"; ERRORS=$((ERRORS + 1)); }
warn() { echo "WARN:  $1"; WARNINGS=$((WARNINGS + 1)); }
ok()   { echo "OK:    $1"; }

echo "=== GitHub Preflight Check ==="
echo "Root: $ROOT"
echo ""

# 1. Branch name
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "[1] Branch: $BRANCH"
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  warn "main/master ブランチにいます。feature branch 推奨"
else
  ok "feature branch"
fi

# 2. Uncommitted changes
echo ""
echo "[2] Working tree"
if [[ -z "$(git status --porcelain 2>/dev/null)" ]]; then
  ok "clean (committed)"
else
  ok "has changes (ready to commit)"
  git status --short | head -20
fi

# 3. Secret patterns in diff
echo ""
echo "[3] Secret scan (diff)"
SECRET_PATTERNS='(api[_-]?key|secret|password|token|private[_-]?key)\s*[:=]\s*["\x27][^"\x27]{8,}'
if git diff HEAD 2>/dev/null | grep -iE "$SECRET_PATTERNS" >/dev/null 2>&1; then
  fail "diff にシークレットらしき文字列があります。確認してください"
elif git diff --cached 2>/dev/null | grep -iE "$SECRET_PATTERNS" >/dev/null 2>&1; then
  fail "staged diff にシークレットらしき文字列があります"
else
  ok "no obvious secrets in diff"
fi

# 4. .env files staged
echo ""
echo "[4] Env files"
if git diff --cached --name-only 2>/dev/null | grep -E '\.env' >/dev/null; then
  fail ".env ファイルがステージされています"
else
  ok "no .env staged"
fi

# 5. Large files (>1MB)
echo ""
echo "[5] Large files (>1MB)"
LARGE=$(git diff --cached --name-only 2>/dev/null | while read -r f; do
  [[ -f "$f" ]] && [[ $(stat -c%s "$f" 2>/dev/null || stat -f%z "$f" 2>/dev/null || echo 0) -gt 1048576 ]] && echo "$f"
done)
if [[ -n "$LARGE" ]]; then
  warn "大きなファイル: $LARGE"
else
  ok "no large staged files"
fi

# 6. Project-specific lint (coupon-board if changed)
echo ""
echo "[6] Project lint (if applicable)"
if git diff --name-only HEAD 2>/dev/null | grep -q "^coupon-board/" || \
   git diff --cached --name-only 2>/dev/null | grep -q "^coupon-board/"; then
  if [[ -d "coupon-board/node_modules" ]]; then
    (cd coupon-board && npm run lint) && ok "coupon-board lint" || fail "coupon-board lint failed"
  else
    warn "coupon-board changed but node_modules missing — run npm ci"
  fi
else
  ok "coupon-board not changed (skipped)"
fi

echo ""
echo "=== Summary: $ERRORS error(s), $WARNINGS warning(s) ==="

if [[ $ERRORS -gt 0 ]]; then
  echo "FIX errors before pushing."
  exit 1
fi

echo ""
echo "Next:"
echo "  node business-ops/scripts/github-ship.mjs"
echo "  git add -A && git commit && git push"
echo ""
echo "NOTE: push / merge は人間の承認後に実行してください。"
