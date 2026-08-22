type Props = {
  /** YouTube video ID, not a full URL. */
  id: string;
  /** Caption under the frame. Usually the post title. */
  caption?: string;
  className?: string;
};

/**
 * Short talk answering the page's question, rendered above the article body.
 *
 * The reader this is for is mid-crisis and will watch four minutes before
 * reading three thousand words, so it sits between the QuickAnswer and the
 * prose rather than buried below the fold. Uses youtube-nocookie so an
 * embedded player does not set tracking cookies on a page whose whole promise
 * is that nothing is being taken from the reader.
 */
export function PostVideo({ id, caption, className = "" }: Props) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative w-full overflow-hidden rounded-md border border-border bg-navy-700 pt-[56.25%]">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={caption ?? "Watch instead of reading"}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption className="mt-2 text-sm text-ink/60">
        {caption ?? "Prefer to watch? The short version."}
      </figcaption>
    </figure>
  );
}
