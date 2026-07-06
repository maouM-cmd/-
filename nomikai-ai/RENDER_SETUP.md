# Render 本番セットアップ — 飲み会盛り上げAI

> デプロイの概要は [DEPLOY.md](./DEPLOY.md)。本書は **初回 Blueprint セットアップ** のチェックリストです。  
> デプロイ自体は人間が Render ダッシュボードで実施してください（課金・承認が必要）。

## 1. Blueprint 初回セットアップ

- [ ] Render Dashboard → **New** → **Blueprint**
- [ ] リポジトリを接続（Root Directory: `nomikai-ai`）
- [ ] `render.yaml` を検出してサービスを作成
- [ ] Starter プラン + 1GB ディスクが有効か確認
- [ ] 初回デプロイが成功するまで待つ

## 2. 環境変数（コピペ用テンプレート）

Render Dashboard → nomikai-ai → **Environment** に設定:

```env
# 必須（プッシュ通知・OAuth リダイレクト・絶対リンク）
APP_URL=https://YOUR-SERVICE.onrender.com

# Google OAuth（任意 — 未設定時はメール/パスワードのみ）
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI 盛り上げ（任意）
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# 店舗検索・地図（任意）
GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Web Push（任意 — 幹事・参加者通知）
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_SUBJECT=mailto:you@example.com

# 運営表示
NEXT_PUBLIC_OPERATOR_NAME=飲み会盛り上げAI運営
NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
```

`APP_URL` は **末尾スラッシュなし** の公開 URL にしてください。

## 3. Google Cloud Console（OAuth）

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. OAuth 2.0 Client ID（Web application）を作成
3. **Authorized redirect URIs** に追加:

```
https://YOUR-SERVICE.onrender.com/api/auth/google/callback
```

ローカル開発時は追加:

```
http://localhost:3000/api/auth/google/callback
```

4. Client ID / Secret を Render の `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` に設定

## 4. VAPID 鍵の生成（任意）

```bash
npx web-push generate-vapid-keys
```

- 公開鍵 → `VAPID_PUBLIC_KEY` と `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- 秘密鍵 → `VAPID_PRIVATE_KEY`

## 5. デプロイ後の確認

```bash
APP_URL=https://YOUR-SERVICE.onrender.com bash scripts/verify-prod.sh
```

手動確認:

- [ ] `/login` で Google ログイン（OAuth 設定時）
- [ ] 飲み会作成 → 参加登録 → プラン生成
- [ ] 参加者が「通知を有効にする」→ プラン生成でプッシュ受信
- [ ] 幹事画面・マイページから「複製」
- [ ] スマホでホーム画面に追加（PWA）
- [ ] サービス再起動後もデータが残る（ディスクマウント）

## 6. トラブルシューティング

| 症状 | 対処 |
|------|------|
| Google ログイン `redirect_uri_mismatch` | `APP_URL` と Google Console の URI が完全一致しているか確認 |
| プッシュが届かない | `APP_URL` 設定、VAPID 鍵、HTTPS、通知許可を確認 |
| 再起動でデータ消失 | Render Disk が `/app/data` にマウントされているか確認 |
