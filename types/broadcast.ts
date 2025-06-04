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
}

export interface PopularBroadcast extends PastBroadcast {
  commentCount: number;
  viewCount: number;
}