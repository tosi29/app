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
  likes_count?: number;
};

export type RetrievalResult = {
  content: Content;
  metadata: Metadata;
  score: number;
};

export type RetrieveApiResponse = {
  retrievalResults: RetrievalResult[];
};