# UI仕様書 - 配信管理アプリケーション

## 概要

本アプリケーションは、過去の配信の管理、人気配信の表示、検索、およびリスナーコメントの可視化を提供するWebアプリケーションです。タブベースのインターフェースと設定モーダルを提供し、4つの主要機能を持ちます。

## 技術スタック

### 使用技術

- **フレームワーク**: Next.js 15.2.4
- **言語**: TypeScript 5.8.3  
- **UIライブラリ**: React 18.2.0
- **スタイリング**: TailwindCSS 3.4.17
- **開発ツール**: ESLint 8.56.0

### アーキテクチャ

- **ページ構成**: Single Page Application（SPA）形式
- **ルーティング**: Next.js Router（クライアントサイド）
- **API**: Next.js API Routes
- **状態管理**: React Hooks（useState, useEffect）

## 全体構成

### レイアウト構造

- ヘッダーエリア（タブナビゲーション + 設定アイコン）
- メインコンテンツエリア（動的切り替え）
- 設定モーダル（プラットフォーム切り替え）
- レスポンシブデザイン対応

### ナビゲーション構成

#### タブナビゲーション
1. **配信一覧** (`broadcasts`) - 過去の配信一覧表示
2. **人気の配信** (`popular`) - 人気配信のソート表示
3. **検索** (`search`) - キーワード・シリーズ検索  
4. **コメント** (`comments`) - コメント可視化（散布図）

#### 設定機能
- **設定アイコン** (⚙️) - タブエリア右上に配置
- **設定モーダル**: プラットフォーム切り替え（Spotify/YouTube）
- 全タブ共通で適用される再生プラットフォーム設定

## 1. 配信一覧タブ

### 機能概要

シリーズ別にグループ化された過去の配信一覧を表示。表示モードの切り替え、シリーズの展開/折りたたみ、ソート機能を提供します。

### 表示モード

#### グループ表示モード
- シリーズ別にグループ化して表示
- 各シリーズは展開/折りたたみ可能
- アルファベット順でシリーズ表示

#### 一覧表示モード
- 全配信を一覧表示
- ソート機能付き（日付、タイトル、再生時間）
- ソート方向指示子（↑↓）付きヘッダー

### 表示制御
- **表示モード切り替え**: グループ表示 / 一覧表示
- **すべて展開** / **すべて閉じる** ボタン（グループ表示時のみ）

### テーブル構成

| カラム | 内容 |
|--------|------|
| 日付 | YYYY-MM-DD形式 |
| タイトル | エピソードタイトル |
| 再生時間 | MM:SS形式 |
| リンク | 再生・コメント表示ボタン |

### インタラクション機能

#### シリーズ展開/折りたたみ
- シリーズヘッダーをクリックで展開/折りたたみ
- 初期状態：全シリーズ展開済み
- トグルアイコン（▼/▶）で状態表示

#### アクションボタン
- **再生ボタン**: インライン埋め込みプレイヤーの表示/非表示切り替え
  - 表示状態：「非表示」ボタン
  - 非表示状態：「再生」ボタン
  - プラットフォーム設定に応じてSpotify/YouTube埋め込み表示
- **コメントボタン**: コメントタブへ遷移（`/?tab=comments&episodeId=${id}`）
  - 💬アイコン付き「コメントを見る」テキスト
- **概要ボタン**: 配信概要モーダル表示（概要データがある場合のみ）
  - 📝アイコン付き「概要」テキスト

#### 埋め込みプレイヤー
- テーブル行の下部に表示
- **Spotify**: 高さ200pxの埋め込み
- **YouTube**: 560x315pxの埋め込み
- レスポンシブ対応

### データ読み込み状態
- ローディング中："配信データを読み込み中..."表示

## 2. 人気の配信タブ

### 機能概要

人気の配信を閲覧数、コメント数、いいね数などでソート表示する機能を提供します。

### テーブル構成

| カラム | 内容 |
|--------|------|
| タイトル | エピソードタイトル + シリーズ名 |
| 再生 | 再生回数（数値） |
| コメント | コメント数 |
| 👍 | いいね数 |
| 日付 | YYYY-MM-DD形式 |
| リンク | 再生・コメント表示ボタン |

### ソート機能

#### ソート可能カラム
- **タイトル**: アルファベット順
- **再生**: 再生回数順  
- **コメント**: コメント数順
- **👍**: いいね数順
- **日付**: 日付順

#### ソート操作
- ヘッダークリックでソート実行
- 同一カラム再クリックで昇順/降順切り替え
- ソート方向指示子（↑↓）表示
- 初期設定：再生回数の降順

### アクション機能
- **再生ボタン** (▶️): インライン埋め込みプレイヤー表示
- **停止ボタン** (⏹️): 埋め込みプレイヤー非表示  
- **コメントボタン** (💬): コメントタブへ遷移
- **概要ボタン** (📝): 配信概要モーダル表示（概要データがある場合のみ）

### データ読み込み状態
- ローディング中："人気の配信データを読み込み中..."表示

## 3. 検索タブ

### 機能概要

キーワードおよびシリーズフィルターによる配信検索機能を提供します。

### フォーム構成

#### 検索フィールド
- **検索キーワード入力**: タイトル・概要でのテキスト検索

#### 検索ボタン
- 通常状態："検索"
- ローディング状態："検索中..." + ボタン無効化

### 検索結果表示

#### 結果カード形式
各検索結果はカード形式で表示：
- **エピソードタイトル** （見出し）
- **シリーズ名** （サブタイトル）
- **エピソード概要** （説明文）
- **アクションボタン** （再生・コメント表示）
- **インライン埋め込みプレイヤー** （再生ボタン押下時）

#### 検索結果数表示
- "検索結果: {件数}件" ヘッダー表示

### アクション機能
- **再生ボタン**: カード内に埋め込みプレイヤー表示/非表示
- **コメントボタン**: コメントタブへ遷移
- **概要ボタン**: 配信概要モーダル表示（概要データがある場合のみ）

### 状態管理
- 検索実行前：フォームのみ表示
- 検索結果なし："該当する配信はありません。"メッセージ表示
- ローディング中：検索中表示

## 4. コメントタブ

### 機能概要

リスナーコメントの2次元散布図による可視化を提供します。X軸は「意見度」、Y軸は「ポジティブ度」を表現します。

### グラフ仕様

#### 座標系
- **2次元散布図**: 600x600px（デスクトップ）、450x450px（モバイル）
- **X軸**: 意見度（0-1、リアクション→意見）
- **Y軸**: ポジティブ度（0-1、ネガティブ→ポジティブ）

#### データポイント表示
- コメントを散布図上の点として表示
- シリーズ別の自動色分け表示
- ホバー・クリックでのインタラクション機能

#### シリーズ色分けシステム
- 全シリーズをアルファベット順でソート
- 3色（basic/guest/community）を順番に割り当て
- 動的シリーズ追加に対応

### インタラクション機能

#### マウスインタラクション
- **ホバー**: ツールチップ表示、ドットサイズ拡大
- **クリック**: 詳細ツールチップ固定表示、フィードバックボタン表示

#### ツールチップ
- **基本表示**: エピソード番号、コメントテキスト、投稿者名
- **詳細表示**: 上記 + フィードバックボタン（👍役に立つ、❤️共感できる、🎯的を射ている）

### エピソード選択機能
- ドロップダウンでエピソード切り替え
- URLパラメータでの直接指定対応（`episodeId`）

### 表示状態
- **全エピソード**: すべてのコメントを表示、シリーズ別凡例表示
- **特定エピソード**: 選択エピソードのコメントのみ表示
- **ローディング状態**: "コメントを読み込んでいます..."表示

## データ構造

### 配信データ（PastBroadcast）

```typescript
interface PastBroadcast {
  id: number;
  date: string;              // YYYY-MM-DD形式
  title: string;             // エピソードタイトル
  excerpt: string;           // 概要テキスト
  series: string;            // シリーズ名
  duration: string;          // MM:SS形式
  url: string;               // 配信URL
  youtube_video_id: string;  // YouTube動画ID
  spotify_episode_id: string; // SpotifyエピソードID
  likeCount?: number;        // いいね数（オプショナル）
  summary?: BroadcastSummary; // 配信概要（オプショナル）
}
```

### 配信概要データ（BroadcastSummary）

```typescript
interface BroadcastSummary {
  overview: string;   // 今回の配信概要：50文字
  facts: string[];    // 事実や出来事：3行
  lessons: string[];  // 学び・教訓・法則：3行
}
```

### コメントデータ（Comment）

```typescript
interface Comment {
  id: number;
  episodeId: number;
  text: string;           // コメント本文
  author: string;         // ユーザー名
  positiveScore: number;  // 0-1の値（ポジティブ度合い）
  opinionScore: number;   // 0-1の値（意見度合い）
}
```

### 人気配信データ（PopularBroadcast）

```typescript
interface PopularBroadcast extends PastBroadcast {
  commentCount: number;   // コメント数
  viewCount: number;      // 再生回数
}
```

### 検索API結果データ（RetrievalResult）

```typescript
interface RetrievalResult {
  content: {
    text: string;
    type: "TEXT";
  };
  metadata: {
    episode_id: string;
    series_name: string;
    series_number: string;
    label?: string;
    title: string;
    duration: number;
    position?: number;
    spotify_episode_id?: string;
    youtube_video_id?: string;
  };
  score: number;
}
```

## API仕様

### エンドポイント

- **GET /api/broadcasts**: 全配信データ取得
- **GET /api/popular-broadcasts**: 人気配信データ取得（再生回数・コメント数付き）
- **GET /api/search-broadcasts**: 検索機能
  - クエリパラメータ：`query`（検索キーワード）
  - レスポンス形式：`RetrievalResult[]`（検索結果配列）
- **GET /api/comments**: コメントデータ取得
  - クエリパラメータ：`episodeId`（特定エピソード指定）

## URLルーティング

### パラメーター仕様

- **タブ切り替え**: `/?tab={tabId}`
  - `tab=broadcasts`: 配信一覧タブ
  - `tab=popular`: 人気の配信タブ
  - `tab=search`: 検索タブ  
  - `tab=comments`: コメントタブ

- **エピソード指定**: `/?tab=comments&episodeId={id}`
  - 特定エピソードのコメント表示

### ナビゲーション動作

- **Shallow routing**: ページリロードなしでURL更新
- `router.replace()` を使用してブラウザ履歴の最適化
- ブラウザの戻る/進むボタンに対応

## ローディング・エラー状態

### ローディング表示
- 配信一覧："配信データを読み込み中..."
- 人気の配信："人気の配信データを読み込み中..."
- コメント："コメントを読み込んでいます..."
- 検索："検索中..."

### エラーハンドリング
- API呼び出し失敗時はコンソールエラーログ出力
- 検索結果なし時："該当する配信はありません。"表示

## 設定モーダル機能

### 機能概要
- タブエリア右上の設定アイコン（⚙️）から起動
- プラットフォーム切り替え設定を提供
- 選択したプラットフォームが全タブの再生機能に適用

### モーダル構成
- **ヘッダー**: "設定" タイトル + 閉じるボタン（✕）
- **コンテンツエリア**: プラットフォーム選択UI
- **背景**: クリックで閉じる半透明オーバーレイ

### プラットフォーム選択
- **ラベル**: "再生プラットフォーム:"
- **Spotifyボタン**: アクティブ時は主要色、非アクティブ時は標準背景
- **YouTubeボタン**: アクティブ時は主要色、非アクティブ時は標準背景

### 動作
- 設定アイコンクリックでモーダル表示
- プラットフォームボタンクリックで即座に切り替え
- 既に表示中の埋め込みプレイヤーも新しいプラットフォームに切り替わる
- 背景クリックまたは✕ボタンでモーダル閉じる

## 配信概要モーダル機能

### 機能概要
- 配信の概要情報を表示するモーダルダイアログ
- 概要データが存在する配信に対してのみ表示される概要ボタンから起動
- 構造化された配信内容サマリーを提供

### モーダル構成
- **ヘッダー**: "配信概要" タイトル + 閉じるボタン（✕）
- **コンテンツエリア**: 
  - **配信概要**: 50文字程度の配信の要約
  - **事実や出来事**: 配信中に話された事実のリスト表示
  - **学び・教訓・法則**: 配信から得られる学びのリスト表示
- **背景**: クリックで閉じる半透明オーバーレイ

### 表示内容
#### 概要セクション
- エピソードタイトルとシリーズ名
- 配信概要テキスト（overview）

#### 事実・出来事セクション
- 配信中に言及された事実や出来事のリスト
- 各項目は箇条書きで表示

#### 学び・教訓セクション  
- 配信から得られる学びや教訓のリスト
- 各項目は箇条書きで表示

### 動作
- 概要ボタンクリックでモーダル表示
- 背景クリックまたは✕ボタンでモーダル閉じる
- モーダル表示中は背景スクロール無効化

---

*この仕様書は現在のソースコードベース（2025年1月）に基づいて作成されています。*