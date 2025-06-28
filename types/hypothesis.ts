// Define the Hypothesis interface
export interface Hypothesis {
  id: number;
  episodeId: number;
  hypothesis: string;
  fact: string; // The underlying fact or evidence that inspired this hypothesis
  confidenceScore: number; // 0 to 1 where 1 is most confident
  originalityScore: number; // 0 to 1 where 1 is most original/unique
  proposer: string;
}