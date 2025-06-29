export interface BroadcastSummary {
  overview: string; // 今回の配信概要：50文字
  facts: string[]; // 事実や出来事：3行
  lessons: string[]; // 学び・教訓・法則：3行
}

export interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  series: string;
  duration: string;
  url: string;
  youtube_video_id: string;
  spotify_episode_id: string;
  playback_time?: number;
  likeCount?: number;
  summary?: BroadcastSummary;
}

export interface PopularBroadcast extends PastBroadcast {
  hypothesisCount: number;
  viewCount: number;
}

export interface SearchResultBroadcast extends PastBroadcast {
  excerpt: string; // 検索結果でのみ使用する概要情報
}

export interface ExternalEpisode {
  category: string;
  id: string;
  url: {
    youtube_url: string;
    spotify_url: string;
    voicy_url: string;
  };
  title: string;
  youtube_id: string;
  series_name: string;
}

export interface ExternalApiResponse {
  count: number;
  episodes: ExternalEpisode[];
}