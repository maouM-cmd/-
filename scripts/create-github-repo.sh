#!/usr/bin/env bash
set -euo pipefail

REPO_OWNER="${REPO_OWNER:-maouM-cmd}"
REPO_NAME="${REPO_NAME:-coupon-board}"
REPO_DESC="招待・紹介キャンペーンをみんなで共有する掲示板サイト（Next.js + SQLite）"
REMOTE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"

echo "==> 新しいリポジトリ: ${REPO_OWNER}/${REPO_NAME}"

if ! command -v gh >/dev/null 2>&1; then
  echo "エラー: GitHub CLI (gh) が見つかりません。"
  echo "手動手順: REPO_SETUP.md を参照してください。"
  exit 1
fi

if gh repo view "${REPO_OWNER}/${REPO_NAME}" >/dev/null 2>&1; then
  echo "==> リポジトリは既に存在します: ${REMOTE_URL}"
else
  echo "==> GitHub にリポジトリを作成中..."
  if ! gh repo create "${REPO_OWNER}/${REPO_NAME}" \
    --public \
    --description "${REPO_DESC}"; then
    echo ""
    echo "自動作成に失敗しました（権限不足の可能性があります）。"
    echo "以下の手順で空のリポジトリを作成してから、再度このスクリプトを実行してください:"
    echo "  https://github.com/new → Repository name: ${REPO_NAME}"
    echo ""
    exit 1
  fi
  echo "==> 作成完了: ${REMOTE_URL}"
fi

CURRENT_REMOTE="$(git remote get-url origin 2>/dev/null || true)"
if [[ "${CURRENT_REMOTE}" != *"${REPO_NAME}"* ]]; then
  echo "==> origin を ${REMOTE_URL} に更新"
  git remote set-url origin "${REMOTE_URL}"
fi

BRANCH="$(git branch --show-current)"
echo "==> ${BRANCH} をプッシュ中..."
git push -u origin "${BRANCH}"
git push -u origin main 2>/dev/null || true

echo ""
echo "完了しました: ${REMOTE_URL}"
