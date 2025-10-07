import { forwardRef, useEffect } from "react"

export const YoutubeVideo = forwardRef<HTMLIFrameElement, { videoId: string }>(function YoutubeVideo({ videoId }, ref) {
  // Extract video ID from full URL if necessary
  const id = videoId.includes("youtube.com") ? new URL(videoId).searchParams.get("v") : videoId

  useEffect(() => {
    // Load YouTube API script if not already loaded
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="aspect-video w-full">
      <div
        ref={ref}
        id="youtube-player"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
})

