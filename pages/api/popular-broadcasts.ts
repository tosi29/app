import { NextApiRequest, NextApiResponse } from 'next';
import { PopularBroadcast, PastBroadcast, ExternalEpisode, ExternalApiResponse } from '../../types/broadcast';
import { hypotheses } from '../../data/hypotheses-sample';

// Spotify URLからエピソードIDを抽出する関数（broadcasts.tsから移動）
function extractSpotifyEpisodeId(spotifyUrl: string): string {
  const match = spotifyUrl.match(/episode\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
}

// ISO 8601 YouTube duration を秒数に変換する関数（broadcasts.tsから移動）
function parseYouTubeDurationToSeconds(duration: string): number | undefined {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

// ISO 8601 日時を YYYY-MM-DD 形式に変換する関数（broadcasts.tsから移動）
function parseYouTubePublishedAt(publishedAt: string): string | undefined {
  try {
    const date = new Date(publishedAt);
    return date.toISOString().split('T')[0];
  } catch {
    return undefined;
  }
}

// series_number からシリーズ番号を抽出する関数（broadcasts.tsから移動）
function extractSeriesNumber(seriesNumber: string): string | undefined {
  const match = seriesNumber.match(/^(\d+)-/);
  return match ? match[1] : undefined;
}

// series_with_number を生成する関数（broadcasts.tsから移動）
function generateSeriesWithNumber(seriesName: string, seriesNumber: string): string {
  const number = extractSeriesNumber(seriesNumber);
  if (number && seriesName && seriesName.trim()) {
    return `${number}. ${seriesName.trim()}`;
  }
  return seriesName && seriesName.trim() ? seriesName.trim() : '999. その他';
}

// 外部APIデータをPastBroadcast型に変換する関数（broadcasts.tsから移動）
function convertExternalEpisodeToPastBroadcast(episode: ExternalEpisode): PastBroadcast {
  return {
    id: parseInt(episode.id),
    date: parseYouTubePublishedAt(episode.youtube_published_at),
    title: episode.title,
    series: generateSeriesWithNumber(episode.series_name, episode.series_number),
    duration: parseYouTubeDurationToSeconds(episode.youtube_duration),
    url: episode.url.youtube_url,
    youtube_video_id: episode.youtube_id,
    spotify_episode_id: extractSpotifyEpisodeId(episode.url.spotify_url),
  };
}

// 外部APIから配信一覧を取得する関数（broadcasts.tsから移動）
async function fetchExternalBroadcasts(): Promise<PastBroadcast[]> {
  try {
    const API_URL = process.env.EXTERNAL_BROADCASTS_API_URL || 'https://api.example.com/broadcasts';
    const API_TIMEOUT = 5000;
    
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
    
    const data: ExternalApiResponse = await response.json();
    
    if (!data.episodes || !Array.isArray(data.episodes)) {
      throw new Error('Invalid API response format: episodes array not found');
    }
    
    return data.episodes
      .filter(episode => episode && episode.id && episode.title)
      .map(convertExternalEpisodeToPastBroadcast);
      
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('External API request timed out');
      } else {
        console.error('Failed to fetch external broadcasts:', error.message);
      }
    } else {
      console.error('Unknown error occurred while fetching external broadcasts');
    }
    return [];
  }
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<PopularBroadcast[]>
) {
  try {
    // 外部APIから配信データを取得
    const broadcasts = await fetchExternalBroadcasts();
    
    // Count hypotheses for each episode
    const hypothesisCounts: Record<number, number> = {};
    hypotheses.forEach(hypothesis => {
      hypothesisCounts[hypothesis.episodeId] = (hypothesisCounts[hypothesis.episodeId] || 0) + 1;
    });
    
    // Create popular broadcasts data
    const popularBroadcasts: PopularBroadcast[] = broadcasts.map(broadcast => {
      const hypothesisCount = hypothesisCounts[broadcast.id] || 0;
      // Calculate a view count based on likes and hypotheses (simulated data)
      const viewCount = (broadcast.likeCount || 0) * 10 + hypothesisCount * 5;
      
      return {
        ...broadcast,
        hypothesisCount,
        viewCount
      };
    });
    
    res.status(200).json(popularBroadcasts);
  } catch (error) {
    console.error('Error in popular-broadcasts API:', error);
    // エラー時は空配列を返す
    res.status(200).json([]);
  }
}