# CLAUDE.md - 麻雀点数計算トレーニングアプリ

常に日本語で会話してください

このドキュメントは、Claude（AI）がこのプロジェクトを理解し、効果的に開発をサポートするための情報をまとめたものです。

## プロジェクト概要

### 目的
既存の点数計算アプリでは実戦と異なる情報提示形式により認知負荷が高い。本アプリは雀魂に近い卓UIで、実戦に近い形で点数計算を練習できる環境を提供する。

### ターゲットユーザー
- 点数計算を覚えたい初心者
- ネット麻雀プレイヤーでリアル麻雀デビューを考えているが点数計算に不安がある人

### MVP範囲
- ローカル完結（データベース・サーバー不要）
- 静的ホスティング可能
- 問題数：1問で動作確認、最終的に5〜10問
- ルール：Mリーグ/雀魂（点数計算に影響する差分のみ対応）

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **ビルド**: 静的エクスポート (`output: "export"`)
- **状態管理**: React hooks (useState, useEffect)
- **永続化**: localStorage (設定・成績), sessionStorage (画面間データ受け渡し)
- **牌素材**: SVG (FluffyStuff/riichi-mahjong-tiles - CC0)

## ディレクトリ構成

```
/docs                          # 要件定義などの各種ドキュメント
  requirements-definition.md   # 要件定義
  technical-requirements.md    # 技術要件
  ui-wire.md                   # UIワイヤー
  /screen-specifications       # 各画面の仕様書

/app                           # Next.js App Router
  page.tsx                     # ホーム画面（設定選択）
  layout.tsx                   # ルートレイアウト
  globals.css                  # グローバルCSS
  /practice
    page.tsx                   # 出題・回答画面
  /result
    page.tsx                   # 結果・解説画面

/components                    # UIコンポーネント
  /ui
    Button.tsx                 # 汎用ボタン
    Input.tsx                  # 汎用入力欄
    OrientationGuard.tsx       # 画面向き制御（横画面強制）
  /mahjong
    Tile.tsx                   # 牌表示（Front.svg背景 + 牌模様）
    Hand.tsx                   # 手牌表示
    DoraIndicator.tsx          # ドラ表示牌

/lib                           # アプリケーションロジック
  /types
    mahjong.ts                 # 麻雀関連の型定義
    problem.ts                 # 問題データの型定義
    settings.ts                # 設定の型定義
    stats.ts                   # 成績データの型定義
  /storage
    index.ts                   # localStorage管理
    session.ts                 # sessionStorage管理
  /problem
    index.ts                   # 問題取得・管理・正誤判定
  /utils
    tile-helper.ts             # 牌関連のヘルパー関数

/data
  /problems
    problems.json              # 問題データ（現在1問）

/public
  /tiles                       # SVG牌素材（40枚）
    Front.svg                  # 牌の枠（背景として使用）
    Man1.svg〜Man9.svg         # 萬子
    Pin1.svg〜Pin9.svg         # 筒子
    Sou1.svg〜Sou9.svg         # 索子
    Ton.svg, Nan.svg...        # 字牌
    Man5-Dora.svg等            # 赤ドラ
```

## 重要な設計思想

### 1. 横画面前提のUI
- スマートフォンは横持ち（ランドスケープ）を前提
- 縦向き時は`OrientationGuard`で回転を促す案内を表示

### 2. practice画面のレイアウト
- 左〜中央（60%）: 卓情報エリア（手牌、ドラ、局情報）
- 右（40%）: 回答エリア（フェーズ遷移：ready → 演出 → 回答）

### 3. 回答入力の表記ゆれ対策
- ツモの場合は「子の支払い」「親の支払い」の2入力欄に分離
- 選択肢式は「子○○ / 親○○」の形式

### 4. 状態管理
- **localStorage**: 設定（ルール、難易度、回答方式）、成績データ（直近2,000件）
- **sessionStorage**: practice → result間のデータ受け渡し
- **React state**: コンポーネント内の一時状態

### 5. 牌の表示
- `Front.svg`を背景として配置
- その上に牌の模様（Man1.svg等）を重ねて表示
- absolute配置で2枚の画像を重ねる

## 画面遷移フロー

```
ホーム (/)
  ↓ 開始ボタン
出題 (/practice)
  ↓ ready → 演出 → 回答
  ↓ 回答する / わからない
結果 (/result)
  ↓ 次の問題 / 同じ問題をもう一度 / ホームへ戻る
```

## 問題データの構造

```typescript
{
  id: string,                    // 問題ID（例: "p0001"）
  difficulty: string,            // 難易度
  table: {                       // 卓情報
    round: { ... },              // 局情報
    players: { ... }             // プレイヤー情報
  },
  hand: {                        // 手牌
    tiles: Tile[]
  },
  winSituation: {                // 和了状況
    winType: "ron" | "tsumo",
    winTile: Tile,
    isRiichi: boolean,
    dora: Tile[],
    uraDora?: Tile[]
  },
  correctAnswer: {               // 正解
    han: number,
    fu: number,
    yaku: Yaku[],
    ronScore?: number,
    tsumoScoreDealer?: number,
    tsumoScoreNonDealer?: number
  }
}
```

## コーディング規約

### TypeScript
- 厳格な型チェック（`strict: true`）
- `any`型は使用しない
- インターフェースは`lib/types/`に集約

### コンポーネント
- 関数コンポーネントを使用
- Propsは明示的に型定義
- "use client"は必要な場合のみ（インタラクティブなコンポーネント）

### スタイリング
- Tailwind CSSのユーティリティクラスを使用
- カスタムCSSは最小限に
- レスポンシブは必要に応じて（基本は横画面前提）

### ファイル命名
- コンポーネント: PascalCase (例: `Tile.tsx`)
- ユーティリティ: kebab-case (例: `tile-helper.ts`)
- 型定義ファイル: kebab-case (例: `mahjong.ts`)

## 既知の問題と解決済み課題

### ✅ 解決済み
1. **sessionStorageの問題**: Fast Refreshで再マウント時にデータが消える
   - 解決: result画面で既にstateにデータがある場合は再読み込みしない
   - `clearLastResult()`を削除（次の問題で上書きされるため不要）

2. **牌の透過問題**: 牌が透明で見づらい
   - 解決: `Front.svg`を背景として配置し、牌の模様を重ねて表示

## 今後の拡張予定

### 短期（必須）
- [ ] 問題データの追加（現在1問 → 5〜10問）
- [ ] 点数計算ロジックの実装（現在は問題に正解を含む形式）
- [ ] ロン問題の追加（現在はツモのみ）

### 中期
- [ ] 統計画面の実装（正答率、平均回答時間）
- [ ] 問題の自動生成
- [ ] 復習機能（間違えた問題のみ）
- [ ] 難易度の追加（実戦モード、網羅モード）

### 長期（将来拡張）
- [ ] ログイン機能（外部認証）
- [ ] 成績のクラウド保存
- [ ] マネタイズ（買い切り型）
- [ ] 3人麻雀対応

## 開発時の注意点

### ポート番号
- 開発サーバーは自動的に空いているポートを使用（3000, 3001, 3002等）
- `npm run dev`の出力で実際のポート番号を確認

### ビルド
- `npm run build` で静的エクスポート
- `out/` ディレクトリに静的ファイルが生成される
- 静的ホスティング（Vercel, Netlify等）にそのままデプロイ可能

### デバッグ
- ブラウザの開発者ツール（F12）のConsoleタブでログ確認
- sessionStorage/localStorageはApplicationタブで確認可能

### Fast Refresh
- ファイル保存時に自動的にブラウザが更新される
- useEffectの依存配列に注意（無限ループを避ける）

## トラブルシューティング

### ChunkLoadError
- 原因: ポート番号の不一致、キャッシュの問題
- 解決: ブラウザで強制リロード（Ctrl+Shift+R）、.nextディレクトリを削除して再ビルド

### 画面が表示されない
- 原因: ビルドファイルが生成されていない
- 解決: `rm -rf .next && npm run dev`

### 画面遷移でエラー
- 原因: sessionStorageのデータが見つからない
- 解決: result画面のuseEffectで既にstateにデータがあるかチェック

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [牌素材リポジトリ](https://github.com/FluffyStuff/riichi-mahjong-tiles)

## コミット履歴

```
6cf90bb - Create .gitignore
6e729eb - 1問目のサンプル問題データと問題管理ロジックを追加
bb3fe43 - ホーム画面を実装
41e20b3 - 出題画面（practice）を実装
6673187 - 結果画面（result）を実装
774b3a1 - README.mdを追加
1c99aac - sessionStorageの問題を修正
5ec18cf - 牌の表示を改善（Front.svgを背景として使用）
03f6c3b - ツモの回答入力欄の順番を変更（子→親）
```

## 開発者へのメモ

このプロジェクトは Claude Sonnet 4.5 との協働により開発されました。
コードの質問や機能追加の際は、このドキュメントを参照してください。
