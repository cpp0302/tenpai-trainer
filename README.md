# 麻雀点数計算トレーニングアプリ

実戦に近い形で点数計算を練習できるトレーニングアプリです。

## 特徴

- 雀魂に近い卓UIで実戦形式の練習が可能
- Mリーグルール/雀魂ルールの選択対応
- テキスト入力/選択肢式の回答方式切り替え
- スマートフォン横画面対応
- ローカル完結（データベース・サーバー不要）

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- 静的エクスポート対応

## 開発環境構築

### 必要要件

- Node.js 22以上
- npm

### セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

## ビルド

```bash
# プロダクションビルド
npm run build

# ビルドしたアプリの起動
npm run start
```

静的ファイルは `out/` ディレクトリに生成されます。

## デプロイ

静的ホスティングサービス（Vercel、Netlify、GitHub Pagesなど）にデプロイ可能です。

### Vercelへのデプロイ

```bash
npm run build
vercel deploy
```

## ディレクトリ構成

```
/app                    # Next.js App Router
  /page.tsx            # ホーム画面
  /practice            # 出題画面
  /result              # 結果画面
/components            # UIコンポーネント
  /ui                  # 汎用UIコンポーネント
  /mahjong             # 麻雀特有コンポーネント（牌、卓UIなど）
/lib                   # アプリケーションロジック
  /types               # TypeScript型定義
  /scoring             # 点数計算ロジック
  /storage             # localStorage管理
  /problem             # 問題取得・管理
  /utils               # ユーティリティ関数
/data                  # 問題データ
  /problems            # 問題JSON
/public                # 静的ファイル
  /tiles               # SVG牌素材
```

## ライセンス

### アプリケーションコード

MIT License

### 牌素材

- Source: https://github.com/FluffyStuff/riichi-mahjong-tiles
- License: CC0 1.0 Universal (Public Domain)

## 開発者

このアプリは Claude Sonnet 4.5 との協働により開発されています。
