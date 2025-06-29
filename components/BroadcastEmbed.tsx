import React from 'react';
import SpotifyPodcastEmbed from './SpotifyPodcastEmbed';
import YouTube from './YouTube';
import { PastBroadcast } from '../types/broadcast';

interface BroadcastEmbedProps {
  broadcast: PastBroadcast;
  embedType: 'youtube' | 'spotify';
  height?: number;
  width?: number;
}

const BroadcastEmbed: React.FC<BroadcastEmbedProps> = ({ 
  broadcast, 
  embedType, 
  height,
  width 
}) => {
  const hasSpotify = broadcast.spotify_episode_id && broadcast.spotify_episode_id.trim() !== '';
  const hasYouTube = broadcast.youtube_video_id && broadcast.youtube_video_id.trim() !== '';

  // 希望の埋め込みタイプが利用できない場合は代替を使用
  if (embedType === 'spotify') {
    if (hasSpotify) {
      return (
        <SpotifyPodcastEmbed 
          episodeId={broadcast.spotify_episode_id}
          height={(height || 152).toString()}
        />
      );
    } else if (hasYouTube) {
      return (
        <YouTube 
          videoId={broadcast.youtube_video_id}
          startTime={broadcast.playback_time}
          width={width || 560}
          height={height || 315}
        />
      );
    }
  } else {
    if (hasYouTube) {
      return (
        <YouTube 
          videoId={broadcast.youtube_video_id}
          startTime={broadcast.playback_time}
          width={width || 560}
          height={height || 315}
        />
      );
    } else if (hasSpotify) {
      return (
        <SpotifyPodcastEmbed 
          episodeId={broadcast.spotify_episode_id}
          height={(height || 152).toString()}
        />
      );
    }
  }

  // どちらも利用できない場合
  return (
    <div className="w-full flex justify-center my-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="text-center text-gray-600">
        <p className="mb-2">🎵 配信が利用できません</p>
        <p className="text-sm">YouTube・Spotify版ともに現在利用できません</p>
      </div>
    </div>
  );
};

export default BroadcastEmbed;