export function getYouTubeThumbnailUrl(videoUrl: string): string | null {
  const videoIdMatch = videoUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (!videoIdMatch || !videoIdMatch[1]) {
    return null; // Некорректный URL
  }

  const videoId = videoIdMatch[1];
  return `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
