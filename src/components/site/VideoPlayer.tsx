type Props = {
  title: string;
  youtubeId?: string;
  videoUrl?: string;
  poster?: string;
};

/**
 * Prefers the YouTube embed: it costs us no egress and the watch time lands on
 * the channel instead of evaporating. Falls back to the direct mp4 (served from
 * GHL's CDN, never from this repo) so a page still works before the reel has
 * been uploaded to YouTube.
 */
export function VideoPlayer({ title, youtubeId, videoUrl, poster }: Props) {
  if (youtubeId) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-ink/5 pt-[177.78%] sm:pt-0 sm:aspect-[9/16] sm:h-[70vh] sm:max-h-[720px] sm:w-auto">
        <iframe
          className="absolute inset-0 h-full w-full sm:relative sm:h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (videoUrl) {
    return (
      <video
        className="mx-auto max-h-[720px] w-full rounded-xl bg-ink/5 sm:w-auto"
        controls
        preload="metadata"
        poster={poster}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support embedded video.
      </video>
    );
  }

  return null;
}
