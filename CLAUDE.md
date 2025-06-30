# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** 2025-06-29 - Reflects hypothesis visualization enhancements, external API integration, and UI improvements

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

**Tab-Based Navigation:**
Four main content areas accessible via `Tabs` component:
1. **Broadcasts** - Series-grouped past content with expandable/collapsible groups
2. **Popular** - Engagement-sorted content with hypothesis count integration
3. **Search** - External API search with Lambda integration and fallback functionality
4. **Hypotheses** - Interactive 2D scatter plot visualization using Recharts library

### Component Relationships

**Data Flow:**
- API routes (`/pages/api/`) provide data endpoints
- Page components (`/pages/`) fetch data and manage state
- UI components (`/components/`) receive data as props
- CSS Modules (`/styles/`) provide component-specific styling

**Key Components:**
- `BroadcastsContent` - Main listing with series grouping, view mode toggle, and sorting
- `SearchContent` - Search interface with external API integration and fallback
- `HypothesesSection` - Interactive 2D scatter plot with Recharts, simplified display
- `BroadcastSummaryModal` - Rich episode summary display with structured content
- `SettingsModal` - User preferences (embed type selection)
- `PopularBroadcastsContent` - Engagement metrics with hypothesis count integration

**API Endpoints:**
- `/api/broadcasts` - Main broadcast content data with external API integration and fallback
- `/api/hypotheses` - Hypothesis data with episode filtering, confidence/originality scores
- `/api/popular-broadcasts` - Engagement metrics including calculated hypothesis counts
- `/api/search-broadcasts` - External Lambda search with excerpt generation and playback time support

### TypeScript Integration
- Strict TypeScript configuration with comprehensive type checking
- Centralized type definitions in `/types/` directory
- Interface-driven development for broadcast and hypothesis data structures
- Key interfaces: `PastBroadcast`, `PopularBroadcast`, `SearchResultBroadcast`, `ExternalEpisode`, `Hypothesis`

### Hypotheses Feature
- Interactive 2D scatter plot using Recharts library (confidence vs originality)
- Simplified graph display without axis labels/numbers for clean interface
- Each hypothesis includes supporting facts/evidence arrays
- Episode-specific filtering and analysis with dropdown selection
- User feedback system with emoji interactions (🤔 interesting, ✨ groundbreaking, 🎯 worth testing)
- Confidence score and originality score metrics (0-100 scale)
- Responsive design with mobile optimization
- Real-time tooltip display with hypothesis details

### External API Integration
- Lambda function integration for search functionality with environment variable configuration
- Robust fallback system when external APIs are unavailable
- YouTube deep-linking with playback time parameters for precise episode moments
- Multi-platform URL support (YouTube, Spotify, Voicy) with automatic detection
- External episode data conversion to internal broadcast format with excerpt extraction
- Error handling and graceful degradation for network issues

### Styling Architecture
- TailwindCSS utility classes for rapid UI development
- Responsive design with mobile-first approach (breakpoints for mobile/desktop)
- Japanese language support throughout UI with proper typography
- Recharts integration for data visualization with custom styling
- Component-specific CSS modules for complex layouts
- Consistent color schemes and spacing patterns

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