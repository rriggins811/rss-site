import Link from "next/link";

/**
 * SeniorSafe is now live on iPhone, Android, and the web (Apr 29, 2026).
 *
 * URLs are configurable so we can swap in the production App Store /
 * Play Store listings without touching markup.
 */

// TODO(ryan): replace with real App Store listing URL
const APP_STORE_URL =
  "https://apps.apple.com/app/seniorsafe/id0000000000";

// TODO(ryan): replace with real Play Store listing URL
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.seniorsafeapp";

const WEB_APP_URL = "https://app.seniorsafeapp.com";

type Variant = "light" | "dark";

type Props = {
  className?: string;
  variant?: Variant;
  /** Hide the lead-in line if the surrounding hero already covers it. */
  hideLeadIn?: boolean;
};

/**
 * Renders the three platform CTAs under a hero. Apple + Google badges are
 * inline SVG (so we don't depend on remote brand-asset CDNs) and follow
 * Apple/Google badge guidelines: black pill, gold-on-black logo, two-line
 * text with "Download on the / App Store" and "GET IT ON / Google Play".
 */
export function AppPlatformBadges({
  className = "",
  variant = "light",
  hideLeadIn = false,
}: Props) {
  const leadInClass =
    variant === "dark" ? "text-cream/80" : "text-ink/70";
  const webBtnClass =
    variant === "dark"
      ? "border-cream/40 text-cream hover:bg-cream/10"
      : "border-ink/30 text-ink hover:bg-ink/5";

  return (
    <div className={className}>
      {!hideLeadIn && (
        <p className={`text-sm font-semibold ${leadInClass}`}>
          Now live on iPhone, Android, and the web.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download SeniorSafe on the App Store"
          className="inline-block transition-opacity hover:opacity-85"
        >
          <AppStoreBadge />
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get SeniorSafe on Google Play"
          className="inline-block transition-opacity hover:opacity-85"
        >
          <PlayStoreBadge />
        </a>
        <Link
          href={WEB_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex h-[44px] items-center rounded-md border px-4 text-sm font-semibold ${webBtnClass}`}
        >
          Use in browser
        </Link>
      </div>
    </div>
  );
}

function AppStoreBadge() {
  return (
    <svg
      width="135"
      height="44"
      viewBox="0 0 135 44"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="135" height="44" rx="7" fill="#000" />
      <g fill="#fff">
        <path d="M28.6 22.0c0-2.0 1.6-2.97 1.7-3.04-.92-1.35-2.36-1.53-2.87-1.55-1.21-.13-2.38.71-3 .71-.62 0-1.59-.7-2.62-.68-1.34.02-2.6.78-3.29 1.97-1.42 2.46-.36 6.09 1.01 8.08.68.97 1.49 2.06 2.55 2.02 1.03-.04 1.42-.66 2.66-.66 1.24 0 1.59.66 2.67.64 1.1-.02 1.8-.99 2.47-1.97.78-1.13 1.1-2.24 1.12-2.3-.02-.01-2.14-.82-2.16-3.26zm-1.97-5.97c.56-.7.94-1.66.83-2.62-.81.04-1.79.55-2.37 1.23-.51.6-.97 1.6-.85 2.53.91.07 1.83-.46 2.39-1.14z" />
        <text
          x="40"
          y="18"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
          fontSize="8"
          fill="#fff"
        >
          Download on the
        </text>
        <text
          x="40"
          y="33"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
          fontSize="16"
          fontWeight="600"
          fill="#fff"
        >
          App Store
        </text>
      </g>
    </svg>
  );
}

function PlayStoreBadge() {
  return (
    <svg
      width="148"
      height="44"
      viewBox="0 0 148 44"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="148" height="44" rx="7" fill="#000" />
      <g transform="translate(12, 10)">
        <path
          d="M0 0v24l13-12L0 0z"
          fill="url(#playGradient1)"
        />
        <path
          d="M13 12L17 8 4 0 0 .2 13 12z"
          fill="url(#playGradient2)"
        />
        <path
          d="M13 12l-13 11.8L4 24l13-8-4-4z"
          fill="url(#playGradient3)"
        />
        <path
          d="M17 8l5 3c1.4.8 1.4 2.2 0 3l-5 3-4-4 4-5z"
          fill="url(#playGradient4)"
        />
      </g>
      <defs>
        <linearGradient id="playGradient1" x1="0" y1="0" x2="13" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A0FF" />
          <stop offset="1" stopColor="#00DEFF" />
        </linearGradient>
        <linearGradient id="playGradient2" x1="0" y1="0" x2="17" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE000" />
          <stop offset="1" stopColor="#FFBD00" />
        </linearGradient>
        <linearGradient id="playGradient3" x1="0" y1="24" x2="17" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF3A44" />
          <stop offset="1" stopColor="#C31162" />
        </linearGradient>
        <linearGradient id="playGradient4" x1="13" y1="8" x2="22" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C7B8" />
          <stop offset="1" stopColor="#00BB6B" />
        </linearGradient>
      </defs>
      <text
        x="40"
        y="18"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
        fontSize="7"
        fill="#fff"
        letterSpacing="0.5"
      >
        GET IT ON
      </text>
      <text
        x="40"
        y="33"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
        fontSize="16"
        fontWeight="600"
        fill="#fff"
      >
        Google Play
      </text>
    </svg>
  );
}
