# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** 2025-06-30 - Added Playwright MCP testing guidelines and verified functionality across all main application screens

## Development Commands

**Development Server:**
```bash
npm run dev
```
Starts Next.js development server on http://localhost:3000

**Build & Production:**
```bash
npm run build    # Build for production
npm start        # Start production server
```

**Code Quality:**
```bash
npm run lint         # ESLint with Next.js config
npm run type-check   # TypeScript type checking without emitting files
```

**External API Integration:**
- Search functionality via Lambda functions (configurable via environment variables)
- Fallback to mock data when external APIs are unavailable
- Environment variable: `EXTERNAL_SEARCH_API_URL` for Lambda integration

## Architecture Overview

This is a Next.js 15 application for managing Japanese educational broadcast content with dual YouTube/Spotify integration.

### Core Data Model
The application centers around `PastBroadcast` objects containing:
- Basic metadata (id, date, title, series, duration)
- Dual media IDs (`youtube_video_id`, `spotify_episode_id`)
- Optional playback timing (`playback_time`) for YouTube deep-linking
- Optional engagement metrics (`likeCount`, `viewCount`, `hypothesisCount`)
- Optional structured summaries with overview, facts, and lessons
- `SearchResultBroadcast` extends base with `excerpt` field for search descriptions
- `ExternalEpisode` interface for external API integration with multi-platform URLs

The application also features `Hypothesis` objects:
- Episode-specific hypothesis data with confidence and originality scores
- Supporting facts/evidence for each hypothesis
- Interactive 2D visualization capabilities

### Key Architectural Patterns

**API-First Design:**
- All data flows through `/pages/api/` endpoints
- External API integration via Lambda functions for search functionality
- Mock data arrays in API routes with external data conversion layers
- Clean separation between data layer and UI components

**Multi-Platform Media Integration:**
- `BroadcastEmbed` component handles YouTube/Spotify switching
- User preference stored in localStorage for embed type
- Consistent interface regardless of media platform

**Series-Based Content Organization:**
- Broadcasts grouped by series (吉田松陰, スパルタ, 人類のコミュニケーション史)
- Expandable/collapsible series groups in main listing
- Series-aware search and filtering with playback time-based YouTube deep-linking

**UI仕様の詳細:**
詳細なUI仕様、コンポーネント構成、API仕様、データ構造については `docs/ui-specifications.md` を参照してください。

**主要機能概要:**
- **4つのタブベースナビゲーション**: 配信一覧、人気の配信、検索、仮説
- **外部API統合**: Lambda関数による検索機能とフォールバック機能
- **マルチプラットフォーム対応**: YouTube/Spotify切り替え可能な埋め込みプレイヤー
- **インタラクティブな仮説可視化**: Rechartsによる2D散布図
- **レスポンシブデザイン**: モバイル/デスクトップ対応

## Playwright MCP使用ルール

### 絶対的な禁止事項

1. **いかなる形式のコード実行も禁止**

   - Python、JavaScript、Bash等でのブラウザ操作
   - MCPツールを調査するためのコード実行
   - subprocessやコマンド実行によるアプローチ

2. **利用可能なのはMCPツールの直接呼び出しのみ**

   - playwright:browser_navigate
   - playwright:browser_screenshot
   - 他のPlaywright MCPツール

3. **エラー時は即座に報告**
   - 回避策を探さない
   - 代替手段を実行しない
   - エラーメッセージをそのまま伝える

### Playwright MCPテスト実績と制約

**テスト済み機能（2025-06-30）:**
- ✅ 4つのメイン画面すべてでアクセス・操作確認済み
- ✅ タブ切り替え、検索機能、シリーズ展開/閉じる操作
- ✅ 基本的なブラウザ操作（navigate, click, type, snapshot）

**制約事項:**
- ⚠️ レスポンス制限: 25,000トークン超過時は詳細確認不可
- ⚠️ 大容量データページ（人気の配信、仮説、設定モーダル）では要素の絞り込みが必要
- ⚠️ 開発サーバー起動時は十分な待機時間（3秒以上）を確保

**推奨テスト手順:**
1. 開発サーバーをバックグラウンドで起動: `npm run dev &`
2. 3秒以上待機してからブラウザアクセス
3. 軽い操作から順次実行（配信一覧 → 検索 → 人気/仮説）
4. 大容量ページでは特定要素を指定してテスト

**データ規模:**
- 配信データ: 約500件（60シリーズ）
- 検索結果: 通常10-50件
- 仮説データ: エピソード別に複数仮説