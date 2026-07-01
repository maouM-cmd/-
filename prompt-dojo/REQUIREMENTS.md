# プロンプ道場 要件定義

## 概要

プロンプトを書いて、自動構造チェックとコミュニティの星評価でスキルアップする公開Webサービス。

## 確定事項

| 項目 | 内容 |
|------|------|
| サイト名 | **プロンプ道場** |
| 評価方式 | ルールベース自動採点 + 他ユーザーの星評価（1〜5） |
| 認証 | ニックネーム + HTTP-only セッションCookie |
| 課題管理 | 管理画面（`/admin`）から CRUD |
| 共有 | 投稿ごとに固有URL、OGP対応 |

## MVP機能

- 課題一覧・詳細
- プロンプト入力フォーム（リアルタイム自動フィードバック）
- 投稿・共有
- 星評価（みんなで評価）
- ランキング（総合 / 自動 / コミュニティ）
- 投稿履歴
- 管理画面
- 利用規約・プライバシーポリシー

## 環境変数

```
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_NAME=プロンプ道場
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_OPERATOR_NAME=プロンプ道場運営
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
```

## スコープ外（Phase 2）

- OAuth / メール会員登録
- LLM API による自動採点
- コメント・通報
