import React from 'react';
import styles from '../styles/SpotifyPodcastEmbed.module.css';

interface SpotifyPodcastEmbedProps {
  episodeId: string;
  startTime?: number; // Start time in seconds (optional)
  width?: string;
  height?: string;
}

export default function SpotifyPodcastEmbed({ 
  episodeId, 
  startTime = 0, 
  width = "100%", 
  height = "352" 
}: SpotifyPodcastEmbedProps): React.ReactNode {
  // Construct the Spotify embed URL
  const baseUrl = `https://open.spotify.com/embed/episode/${episodeId}`;
  const params = new URLSearchParams({
    utm_source: 'generator'
  });
  
  // Add start time parameter if provided and greater than 0
  if (startTime > 0) {
    params.set('t', startTime.toString());
  }
  
  const embedUrl = `${baseUrl}?${params.toString()}`;

  return (
    <div className={styles.embedContainer}>
      <iframe
        className={styles.spotifyIframe}
        src={embedUrl}
        width={width}
        height={height}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={`Spotify Podcast Episode ${episodeId}`}
      />
    </div>
  );
}