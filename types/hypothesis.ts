// Define the Hypothesis interface
export interface Hypothesis {
  id: number;
  episodeId: number;           // 関連するエピソードID
  hypothesis: string;          // 仮説の内容
  fact: string;               // 仮説を支える事実・根拠
  x: number;                  // UMAP次元削減によるX座標（0-1正規化）
  y: number;                  // UMAP次元削減によるY座標（0-1正規化）
  proposer: string;           // 仮説提案者（'AI'など）
  topic: string;              // BERTopicによる分類トピック名
  createdAt: string;          // ISO 8601形式の作成日時
}