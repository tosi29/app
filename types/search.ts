export type Content = {
  text: string;
  type: "TEXT";
};

export type Metadata = {
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

export type RetrievalResult = {
  content: Content;
  metadata: Metadata;
  score: number;
};

export type RetrieveApiResponse = {
  retrievalResults: RetrievalResult[];
};

export type SearchResultItem = {
  title: string;
  series: string;
  description: string;
  url: string;
  playback_time: number;
};

export type SearchResponse = {
  query: string;
  count: number;
  totalCount: number;
  results: SearchResultItem[];
};