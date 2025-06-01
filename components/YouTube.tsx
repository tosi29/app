import React from 'react';
import styles from '../styles/YouTube.module.css';

interface YouTubeProps {
  videoId: string;
  startTime?: number;
  width?: number;
  height?: number;
}

export default function YouTube({ 
  videoId, 
  startTime, 
  width = 560, 
  height = 315 
}: YouTubeProps): React.ReactNode {
  // Construct the YouTube embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`;

  return (
    <div className={styles.youtubeContainer}>
      <iframe
        width={width}
        height={height}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className={styles.youtubeIframe}
      />
    </div>
  );
}