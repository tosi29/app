export interface BroadcastSummary {
  overview: string; // 今回の配信概要：50文字
  facts: string[]; // 事実や出来事：3行
  lessons: string[]; // 学び・教訓・法則：3行
}

export interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  series: string;
  duration: string;
  url: string;
  youtube_video_id: string;
  spotify_episode_id: string;
  likeCount?: number;
  summary?: BroadcastSummary;
}

export interface PopularBroadcast extends PastBroadcast {
  commentCount: number;
  viewCount: number;
}