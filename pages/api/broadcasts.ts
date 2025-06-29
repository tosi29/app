import { NextApiRequest, NextApiResponse } from 'next';
import { PastBroadcast, ExternalEpisode, ExternalApiResponse } from '../../types/broadcast';
import { pastBroadcasts } from '../../data/broadcasts-sample';

// Spotify URLからエピソードIDを抽出する関数
function extractSpotifyEpisodeId(spotifyUrl: string): string {
  const match = spotifyUrl.match(/episode\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
}

// ISO 8601 YouTube duration (PT35M44S) を秒数に変換する関数
function parseYouTubeDurationToSeconds(duration: string): number | undefined {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

// ISO 8601 日時 (2025-04-13T21:00:12Z) を YYYY-MM-DD 形式に変換する関数
function parseYouTubePublishedAt(publishedAt: string): string | undefined {
  try {
    const date = new Date(publishedAt);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 形式
  } catch {
    return undefined;
  }
}

// series_number (例: "9-2") からシリーズ番号を抽出する関数
function extractSeriesNumber(seriesNumber: string): string | undefined {
  const match = seriesNumber.match(/^(\d+)-/);
  return match ? match[1] : undefined;
}

// series_with_number を生成する関数 (例: "9. 吉田松陰")
function generateSeriesWithNumber(seriesName: string, seriesNumber: string): string {
  const number = extractSeriesNumber(seriesNumber);
  if (number && seriesName && seriesName.trim()) {
    return `${number}. ${seriesName.trim()}`;
  }
  // series_numberが無効またはseries_nameが空の場合は"999. その他"として最後に表示
  return seriesName && seriesName.trim() ? seriesName.trim() : '999. その他';
}


// 外部APIデータをPastBroadcast型に変換する関数
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

// 外部APIから配信一覧を取得する関数
async function fetchExternalBroadcasts(): Promise<PastBroadcast[]> {
  try {
    // TODO: 実際の外部APIのURLに置き換える
    const API_URL = process.env.EXTERNAL_BROADCASTS_API_URL || 'https://api.example.com/broadcasts';
    const API_TIMEOUT = 5000; // 5秒タイムアウト
    
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
    
    // データ形式の検証
    if (!data.episodes || !Array.isArray(data.episodes)) {
      throw new Error('Invalid API response format: episodes array not found');
    }
    
    // 外部APIデータをPastBroadcast型に変換（安全な変換）
    return data.episodes
      .filter(episode => episode && episode.id && episode.title) // 必須フィールドをチェック（series_nameは空でもOK）
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
    return []; // エラー時は空配列を返す
  }
}

// Sample data is now imported from data/broadcasts-sample.ts

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  try {
    // 外部APIから配信データを取得
    const externalBroadcasts = await fetchExternalBroadcasts();
    
    // 既存のモックデータと外部データを統合
    // IDの重複を避けるため、外部データのIDを調整
    const adjustedExternalBroadcasts = externalBroadcasts.map((broadcast, index) => ({
      ...broadcast,
      id: pastBroadcasts.length + index + 1, // 既存データの後に続くIDを設定
    }));
    
    const allBroadcasts = [...pastBroadcasts, ...adjustedExternalBroadcasts];
    
    res.status(200).json(allBroadcasts);
  } catch (error) {
    console.error('Error in broadcasts API:', error);
    // エラー時は既存のモックデータのみを返す
    res.status(200).json(pastBroadcasts);
  }
}