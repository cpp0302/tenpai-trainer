# 麻雀点数計算ロジック実装計画

## プロジェクト概要

既存の問題データに正解を事前計算して格納している方式から、実行時に自動計算する方式に移行。
役満を含む全役（40役以上）に対応し、網羅的なテスト（50ケース）を作成する。

## 実装範囲

### 確定事項
- **実装期間**: 4週間（20-28日）
- **役の対応**: 役満含む全役（40役以上）
- **テスト**: 網羅的テスト（50ケース）をTDD方式で作成
- **ルール**: 標準ルール（Mリーグ）のみ、雀魂対応は後回し
- **データ移行**: `correctAnswer`フィールドを削除し、`calculateScore`関数で自動計算

### 実装する40役
1. **基本役（7役）**: リーチ、ツモ、平和、タンヤオ、役牌、一発、ドラ（赤・表・裏）
2. **頻出役（12役）**: 一盃口、三色同順、一気通貫、対々和、三暗刻、混全帯、純全帯、混一色、清一色、七対子、三色同刻、三槓子
3. **偶発役（6役）**: 嶺上開花、槍槓、海底摸月、河底撈魚、二盃口、混老頭
4. **役満（13役+二倍役満3つ）**: 国士無双（13面）、四暗刻（単騎）、大三元、小四喜、大四喜、字一色、清老頭、緑一色、九蓮宝燈（純正）、四槓子、天和、地和

## ディレクトリ構成

```
/lib/calculate/                    # 新規作成
├── index.ts                       # 公開API（calculateScore関数）
├── hand-analyzer.ts               # 手牌解析（面子分解）
├── han-calculator.ts              # 翻数計算
├── fu-calculator.ts               # 符計算
├── score-calculator.ts            # 点数計算
├── yaku/
│   ├── index.ts                  # 役判定の統合
│   ├── yaku-definitions.ts       # 40役の定義
│   ├── basic-yaku.ts             # 基本役
│   ├── yakuhai-yaku.ts           # 役牌
│   ├── sequence-yaku.ts          # 順子系
│   ├── triplet-yaku.ts           # 刻子系
│   ├── terminal-yaku.ts          # 么九系
│   ├── color-yaku.ts             # 色系
│   ├── special-yaku.ts           # 特殊役
│   └── yakuman.ts                # 役満
└── utils/
    ├── tile-comparator.ts        # 牌の比較・ソート
    ├── meld-detector.ts          # 面子・塔子・対子の検出
    └── dora-counter.ts           # ドラカウント

/lib/calculate/__tests__/          # テストファイル
├── hand-analyzer.test.ts
├── yaku-detector.test.ts
├── fu-calculator.test.ts
├── score-calculator.test.ts
├── integration.test.ts
└── fixtures/
    ├── test-hands.ts
    └── expected-results.ts
```

## 実装ステップ（TDD方式）

### Phase 1: 基盤構築（2-3日）

**1.1 環境セットアップ**
- Jestのインストールと設定
- `/lib/calculate/`ディレクトリ作成
- 型定義の拡張（`/lib/types/mahjong.ts`）

**追加する型定義**:
```typescript
// 面子の種類
type MeldType = "shuntsu" | "koutsu" | "kantsu" | "pair";

// 面子
interface Meld {
  type: MeldType;
  tiles: Tile[];
  isConcealed: boolean;  // 暗刻・暗槓かどうか
}

// 待ち形
type WaitType = "ryanmen" | "kanchan" | "penchan" | "shanpon" | "tanki" | "chiitoi" | "kokushi";

// 面子構成
interface MeldPattern {
  head: Meld;           // 雀頭
  melds: Meld[];        // 面子（4つ）
  waitType: WaitType;   // 待ち形
}
```

**1.2 ユーティリティ実装（TDD）**
- テスト作成: `tile-comparator.test.ts`
- 実装: `tile-comparator.ts`（牌のソート・比較・同一判定）
- テスト作成: `meld-detector.test.ts`
- 実装: `meld-detector.ts`（順子・刻子・対子の検出）

### Phase 2: 手牌解析（3-4日）

**2.1 標準形の手牌解析（TDD）**
- テスト作成: `hand-analyzer.test.ts`（5ケース）
  1. 標準形（4面子1雀頭）の単一パターン
  2. 標準形の複数パターン（112233 → 2通り）
  3. 七対子
  4. 国士無双
  5. 不正な手牌（エラーケース）
- 実装: `hand-analyzer.ts`
  - 再帰的バックトラッキングで面子分解
  - 待ち形の判定ロジック
  - 特殊形（七対子、国士無双）の検出

### Phase 3: 基本役判定（4-5日）

**3.1 基本役の実装（TDD）**
- テスト作成: `yaku-detector.test.ts`（Phase 1の7役、各2ケース = 14ケース）
- 実装: `yaku/yaku-definitions.ts`（役の定義構造）
- 実装: `yaku/basic-yaku.ts`（リーチ、ツモ、平和、タンヤオ）
- 実装: `yaku/yakuhai-yaku.ts`（役牌5種）

**3.2 ドラカウント（TDD）**
- テスト作成: `dora-counter.test.ts`
- 実装: `utils/dora-counter.ts`

**3.3 役判定の統合**
- 実装: `yaku/index.ts`（全役チェックの統合）

### Phase 4: 符・点数計算（3-4日）

**4.1 符計算（TDD）**
- テスト作成: `fu-calculator.test.ts`（5ケース）
  1. 平和ツモ（20符）
  2. 七対子（25符）
  3. 面前ロン30符
  4. 刻子の符計算
  5. 待ち形の符
- 実装: `fu-calculator.ts`

**4.2 点数計算（TDD）**
- テスト作成: `score-calculator.test.ts`（5ケース）
  1. 満貫未満（3翻30符）
  2. 満貫（4翻30符）
  3. 跳満（6翻）
  4. 倍満（8翻）
  5. 役満（32000点）
- 実装: `score-calculator.ts`

**4.3 翻数計算**
- 実装: `han-calculator.ts`（シンプルな集計ロジック）

### Phase 5: 統合と初期動作確認（1-2日）

**5.1 公開APIの実装**
- 実装: `index.ts`（calculateScore関数）
- 既存問題p0001での動作確認

**5.2 問題管理ロジックの修正**
- 修正: `/lib/problem/index.ts`
  - `calculateScore`関数を使用
  - `correctAnswer`フィールドは参照しない

**5.3 統合テスト**
- テスト作成: `integration.test.ts`（p0001のテスト）

### Phase 6: 頻出役実装（5-6日）

**6.1 順子系の役（TDD）**
- テスト作成: 一盃口、三色同順、一気通貫（各2ケース）
- 実装: `yaku/sequence-yaku.ts`

**6.2 刻子系の役（TDD）**
- テスト作成: 対々和、三暗刻、三色同刻、三槓子（各2ケース）
- 実装: `yaku/triplet-yaku.ts`

**6.3 么九系の役（TDD）**
- テスト作成: 混全帯、純全帯、混老頭（各2ケース）
- 実装: `yaku/terminal-yaku.ts`

**6.4 色系の役（TDD）**
- テスト作成: 混一色、清一色（各2ケース）
- 実装: `yaku/color-yaku.ts`

**6.5 特殊役（TDD）**
- テスト作成: 七対子、二盃口（各2ケース）
- 実装: `yaku/special-yaku.ts`

**6.6 統合テスト追加**
- `integration.test.ts`に10ケース追加（実戦パターン）

### Phase 7: 偶発役実装（2日）

**7.1 偶発役の実装（TDD）**
- テスト作成: 嶺上開花、槍槓、海底摸月、河底撈魚（各1ケース）
- 実装: 既存の`yaku/special-yaku.ts`に追加

### Phase 8: 役満実装（4-5日）

**8.1 役満の実装（TDD）**
- テスト作成: 13の役満+二倍役満3つ（各1ケース = 16ケース）
- 実装: `yaku/yakuman.ts`
- `hand-analyzer.ts`の拡張（国士無双の特殊処理）

**8.2 統合テスト追加**
- `integration.test.ts`に役満パターン5ケース追加

### Phase 9: 総合テストとエッジケース（2-3日）

**9.1 エッジケーステスト**
- テスト作成: 5ケース
  1. 役牌複合（場風=自風=東で2翻）
  2. 複数の面子構成で符が変わる例
  3. 喰い下がり（混一色の鳴き）
  4. 親の点数計算
  5. 数え役満（13翻以上）

**9.2 カバレッジ確認**
- 目標: 90%以上

**9.3 パフォーマンステスト**
- 目標: 1問あたり10ms以内

### Phase 10: データ移行（1-2日）

**10.1 問題データの修正**
- `problems.json`から`correctAnswer`フィールドを削除
- 必要に応じて問題を追加（5-10問）

**10.2 動作確認**
- 全ての画面（home → practice → result）で動作確認
- ブラウザでの実機テスト

**10.3 ドキュメント更新**
- CLAUDE.mdの更新（実装完了を反映）
- APIドキュメントの作成（`/docs/calculate-api.md`）

## 重要ファイル

### 新規作成（優先度順）
1. `/lib/calculate/index.ts` - 公開API
2. `/lib/calculate/hand-analyzer.ts` - 手牌解析の核心
3. `/lib/calculate/yaku/yaku-definitions.ts` - 40役の定義
4. `/lib/calculate/fu-calculator.ts` - 符計算
5. `/lib/calculate/score-calculator.ts` - 点数計算

### 修正が必要
1. `/lib/types/mahjong.ts` - 型定義の拡張
2. `/lib/problem/index.ts` - calculateScore関数の使用
3. `/data/problems/problems.json` - correctAnswerフィールドの削除

## 検証方法

### ユニットテスト
```bash
npm test -- lib/calculate
```

### 統合テスト
```bash
npm test -- integration
```

### E2Eテスト（ブラウザ）
1. `npm run dev`で開発サーバー起動
2. ホーム画面 → 出題画面 → 結果画面の一連の流れを確認
3. p0001の問題で以下を確認：
   - 手牌表示が正しい
   - 回答後の正誤判定が正しい（リーチ・ツモ・發で3翻30符、親2000・子1000）
   - 解説で役と点数が正しく表示される

### カバレッジレポート
```bash
npm test -- --coverage
```

## 成功基準

1. **全50テストケースが合格**
2. **コードカバレッジ90%以上**
3. **p0001の問題が正しく計算される**（リーチ・ツモ・發 = 3翻30符 = 親2000・子1000）
4. **計算速度10ms以内**（1問あたり）
5. **ブラウザでE2Eテストが通過**

## 注意事項

### エラーハンドリング
- 不正な手牌（14枚でない）
- 和了形でない手牌
- ドラ表示牌が不正

### 複数の面子構成
- 全パターンを列挙し、最も高得点の構成を選択

### 役の排他性
- 一盃口と二盃口は両立しない（高い方を優先）
- 平和と役牌は両立しない

### 喰い下がり
- 混一色: 門前3翻 → 鳴き2翻
- 純全帯: 門前3翻 → 鳴き2翻
- 一気通貫: 門前2翻 → 鳴き2翻（変わらない）
- 三色同順: 門前2翻 → 鳴き2翻（変わらない）

## 実装後の拡張

以下は今回の実装範囲外（将来的に対応）：

1. **雀魂ルール対応**
2. **3人麻雀対応**
3. **問題自動生成**
4. **役の詳細解説**
5. **点数計算の途中経過表示**
