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
  if (embedType === 'spotify') {
    return (
      <SpotifyPodcastEmbed 
        episodeId={broadcast.spotify_episode_id}
        height={(height || 152).toString()}
      />
    );
  } else {
    return (
      <YouTube 
        videoId={broadcast.youtube_video_id}
        startTime={broadcast.playback_time}
        width={width || 560}
        height={height || 315}
      />
    );
  }
};

export default BroadcastEmbed;