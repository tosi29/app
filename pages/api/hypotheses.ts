import { NextApiRequest, NextApiResponse } from 'next';
import { Hypothesis } from '../../types/hypothesis';
import { hypotheses } from '../../data/hypotheses-sample';

// Function to transform external API data to internal format
function transformExternalData(externalData: any[]): Hypothesis[] {
  return externalData.map((item) => ({
    id: item.id,
    episodeId: item.episode_id,
    hypothesis: item.hypothesis,
    fact: item.fact,
    x: item.x,
    y: item.y,
    proposer: item.proposer,
    topic: item.topic,
    createdAt: item.created_at,
  }));
}

// Function to fetch hypotheses from external API
async function fetchExternalHypotheses(): Promise<Hypothesis[]> {
  try {
    const API_URL = process.env.EXTERNAL_HYPOTHESES_API_URL;
    const API_TIMEOUT = 5000;
    
    if (!API_URL) {
      throw new Error('EXTERNAL_HYPOTHESES_API_URL environment variable is not set');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const externalData = await response.json();
    
    // Handle the external API response structure: {count: number, hypotheses: array}
    const hypothesesArray = externalData.hypotheses;
    
    if (!Array.isArray(hypothesesArray)) {
      throw new Error('Invalid API response format: hypotheses array not found');
    }
    
    return transformExternalData(hypothesesArray);
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('External hypotheses API request timed out');
      } else {
        console.error('Failed to fetch external hypotheses:', error.message);
      }
    } else {
      console.error('Unknown error occurred while fetching external hypotheses');
    }
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hypothesis[]>
) {
  const { episodeId } = req.query;
  
  try {
    // Try to fetch from external API first
    const externalHypotheses = await fetchExternalHypotheses();
    
    // Use external data if available, otherwise fallback to sample data
    const allHypotheses = externalHypotheses.length > 0 ? externalHypotheses : hypotheses;
    
    // If episodeId is provided, filter hypotheses for that episode
    if (episodeId && !Array.isArray(episodeId)) {
      const filteredHypotheses = allHypotheses.filter(
        hypothesis => hypothesis.episodeId === parseInt(episodeId, 10)
      );
      return res.status(200).json(filteredHypotheses);
    }
    
    // Otherwise return all hypotheses
    res.status(200).json(allHypotheses);
    
  } catch (error) {
    console.error('Error in hypotheses API:', error);
    
    // Final fallback to sample data
    const fallbackHypotheses = hypotheses;
    
    if (episodeId && !Array.isArray(episodeId)) {
      const filteredHypotheses = fallbackHypotheses.filter(
        hypothesis => hypothesis.episodeId === parseInt(episodeId, 10)
      );
      return res.status(200).json(filteredHypotheses);
    }
    
    res.status(200).json(fallbackHypotheses);
  }
}