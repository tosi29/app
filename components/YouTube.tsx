import React from 'react';

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
  // 空文字列や無効なIDをチェック
  if (!videoId || videoId.trim() === '') {
    return (
      <div className="w-full flex justify-center my-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
        <div className="text-center text-gray-600">
          <p className="mb-2">📹 YouTube版が利用できません</p>
          <p className="text-sm">動画IDが見つかりません</p>
        </div>
      </div>
    );
  }

  // Construct the YouTube embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`;

  return (
    <div className="w-full flex justify-center my-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm max-md:p-2 max-md:my-2 max-sm:p-1 max-sm:border-none max-sm:bg-transparent max-sm:shadow-none">
      <iframe
        width={width}
        height={height}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="rounded-lg max-w-full h-auto max-md:w-full max-md:aspect-video"
      />
    </div>
  );
}