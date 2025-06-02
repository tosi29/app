export type Content = {
  text: string;
  type: "TEXT";
};

export type Metadata = {
  series_name: string;
  series_number: string;
  label: string;
  title: string;
  url: string;
};

export type RetrievalResult = {
  content: Content;
  metadata: Metadata;
  score: number;
};

export type RetrieveApiResponse = {
  retrievalResults: RetrievalResult[];
};