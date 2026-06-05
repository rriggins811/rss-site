import { SocialLinks } from "@/components/site/SocialLinks";

/**
 * Homepage welcome-video card: an AI-avatar greeting from Ryan, shown in the
 * RIGHT column of the hero (beside the value-prop copy). 16:9 self-hosted
 * player (poster + click-to-play, preload="none" so it only loads on play),
 * with the AI-avatar disclosure, NCREC compliance line, and the same social
 * icons used in the footer beneath it. No section wrapper, it lives inside the
 * hero grid.
 *
 * Assets (public/video): welcome-ryan.mp4 (compressed H.264) + welcome-poster.jpg.
 */
export function WelcomeVideo() {
  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-navy-900 shadow-xl shadow-navy-900/15 aspect-video">
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          preload="none"
          poster="/video/welcome-poster.jpg"
        >
          <source src="/video/welcome-ryan.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <p className="mt-3 text-center text-xs text-ink/55">
        AI avatar of Ryan, reading Ryan&rsquo;s words.
      </p>
      <p className="mt-1 text-center text-xs text-ink/55">
        Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp Realty
      </p>

      <div className="mt-3 flex justify-center">
        <SocialLinks className="text-navy-700" />
      </div>
    </div>
  );
}
