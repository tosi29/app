import React from 'react';
import SpotifyPodcastEmbed from './SpotifyPodcastEmbed';
import YouTube from './YouTube';
import { PastBroadcast } from '../types/broadcast';

interface BroadcastEmbedProps {
  broadcast: PastBroadcast;
  embedType: 'youtube' | 'spotify';
  height?: string | number;
  width?: number;
}

const BroadcastEmbed: React.FC<BroadcastEmbedProps> = ({ 
  broadcast, 
  embedType, 
  height,
  width 
}) => {
  if (embedType === 'spotify') {
    return (
      <SpotifyPodcastEmbed 
        episodeId={broadcast.spotify_episode_id}
        height={typeof height === 'number' ? height.toString() : height || "152"}
      />
    );
  } else {
    return (
      <YouTube 
        videoId={broadcast.youtube_video_id}
        width={width || 560}
        height={typeof height === 'string' ? parseInt(height, 10) : height || 315}
      />
    );
  }
};

export default BroadcastEmbed;