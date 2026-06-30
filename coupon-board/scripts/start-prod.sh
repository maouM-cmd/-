#!/usr/bin/env bash
# ローカル本番モード起動（開発用）
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
fi

npm run build
echo "Starting production server on http://localhost:3000"
npm start
