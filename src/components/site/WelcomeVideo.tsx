import { SocialLinks } from "@/components/site/SocialLinks";

/**
 * Homepage welcome video: an AI-avatar greeting from Ryan, the first thing a
 * visitor sees. 16:9 self-hosted player (no third-party branding), poster +
 * click-to-play, loads only on play (preload="none"). Beneath the player:
 * the AI-avatar disclosure, the NCREC compliance line, and the same social
 * icons used in the footer.
 *
 * Assets (added when the landscape render lands, compressed via ffmpeg):
 *   public/video/welcome-ryan.mp4   (the H.264 video)
 *   public/video/welcome-poster.jpg (a still frame for the poster)
 */
export function WelcomeVideo() {
  return (
    <section className="bg-cream border-b border-border">
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-10 lg:pt-16 text-center">
        <div className="relative w-full overflow-hidden rounded-xl border border-border bg-navy-900 shadow-xl shadow-navy-900/15 aspect-video">
          <video
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="none"
            poster="/video/welcome-poster.jpg"
          >
            <source src="/video/welcome-ryan.mp4" type="video/mp4" />
            Your browser does not support the video tag. Watch at{" "}
            <a href="/work-with-ryan">work with Ryan</a>.
          </video>
        </div>

        <p className="mt-4 text-xs text-ink/55">
          AI avatar of Ryan, reading Ryan&rsquo;s words.
        </p>
        <p className="mt-1 text-xs text-ink/55">
          Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp
          Realty
        </p>

        <div className="mt-4 flex justify-center">
          <SocialLinks className="text-navy-700" />
        </div>
      </div>
    </section>
  );
}
