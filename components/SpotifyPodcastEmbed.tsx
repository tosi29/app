import React from 'react';

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
  // 空文字列や無効なIDをチェック
  if (!episodeId || episodeId.trim() === '') {
    return (
      <div className="w-full flex justify-center my-1 max-md:my-0.5">
        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-center text-gray-600">
          <p className="mb-1">🎵 Spotify版が利用できません</p>
          <p className="text-sm">エピソードIDが見つかりません</p>
        </div>
      </div>
    );
  }

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
    <div className="w-full flex justify-center my-1 max-md:my-0.5">
      <iframe
        className="rounded-xl border-none shadow-md max-w-full max-md:rounded-lg"
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