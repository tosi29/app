# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture Overview

This is a Next.js 15 application for managing Japanese educational broadcast content with dual YouTube/Spotify integration.

### Core Data Model
The application centers around `PastBroadcast` objects containing:
- Basic metadata (id, date, title, excerpt, series, duration)
- Dual media IDs (`youtube_video_id`, `spotify_episode_id`)
- Optional engagement metrics (`likeCount`, `viewCount`, `hypothesisCount`)
- Optional structured summaries with overview, facts, and lessons

### Key Architectural Patterns

**API-First Design:**
- All data flows through `/pages/api/` endpoints
- Currently uses mock data arrays in API routes
- Clean separation between data layer and UI components

**Multi-Platform Media Integration:**
- `BroadcastEmbed` component handles YouTube/Spotify switching
- User preference stored in localStorage for embed type
- Consistent interface regardless of media platform

**Series-Based Content Organization:**
- Broadcasts grouped by series (吉田松陰, スパルタ, 人類のコミュニケーション史)
- Expandable/collapsible series groups in main listing
- Series-aware search and filtering

**Tab-Based Navigation:**
Four main content areas accessible via `Tabs` component:
1. **Broadcasts** - Series-grouped past content
2. **Popular** - Engagement-sorted content  
3. **Search** - Full-text search with filters
4. **Hypotheses** - Episode hypothesis interface with 2D visualization

### Component Relationships

**Data Flow:**
- API routes (`/pages/api/`) provide data endpoints
- Page components (`/pages/`) fetch data and manage state
- UI components (`/components/`) receive data as props
- CSS Modules (`/styles/`) provide component-specific styling

**Key Components:**
- `BroadcastsContent` - Main listing with series grouping logic
- `SearchContent` - Search interface with filtering and result display
- `HypothesesSection` - 2D graph visualization and hypothesis management
- `BroadcastSummaryModal` - Rich episode summary display
- `SettingsModal` - User preferences (embed type selection)

**API Endpoints:**
- `/api/broadcasts` - Main broadcast content data
- `/api/hypotheses` - Hypothesis data with facts and scores
- `/api/popular-broadcasts` - Engagement metrics including hypothesis counts
- `/api/search-broadcasts` - Search functionality across content

### TypeScript Integration
- Strict TypeScript configuration with comprehensive type checking
- Centralized type definitions in `/types/` directory
- Interface-driven development for broadcast and hypothesis data structures
- Key interfaces: `PastBroadcast`, `PopularBroadcast`, `Hypothesis`

### Hypotheses Feature
- Interactive 2D graph visualization (confidence vs originality)
- Each hypothesis includes supporting facts/evidence
- Episode-specific filtering and analysis
- User feedback system (interesting, groundbreaking, worth testing)
- Confidence score and originality score metrics

### Styling Architecture
- TailwindCSS utility classes for rapid UI development
- Responsive design with mobile-first approach
- Japanese language support throughout UI
