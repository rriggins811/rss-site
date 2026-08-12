import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Senior Help Directory county pages live under /blog/, but the Cowork
      // handoff prompts (and intuition) often reach for the /resources/ form.
      // Permanently redirect any /resources/<x>-county-senior-help-directory to
      // its real /blog/ page so a mistyped or shared link never 404s. Matches a
      // single segment ending in the shared county suffix, so it never touches
      // the directory hub (/resources/senior-help-directory) or the real
      // /resources/[slug] pillar pages.
      {
        source: "/resources/:slug([^/]*-county-senior-help-directory)",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        // Friendly alias for the Senior Scam Protection hub (canonical lives
        // at /resources/senior-scam-protection).
        source: "/resources/protect-parents-from-scams",
        destination: "/resources/senior-scam-protection",
        permanent: true,
      },
      // "Readiness Assessment" became "Family Readiness Score" on Aug 10 2026.
      // Kept here rather than vercel.json so the redirect is part of the app
      // and testable locally. The bare /readiness-assessment form never was a
      // real route: it was the (broken) share URL baked into the tool, so this
      // also recovers anyone arriving from an old Facebook or LinkedIn share.
      // /blueprint-core and /the-blueprint were two pages for the same free
      // product, both self-canonical and both in the sitemap, so Google saw
      // duplicate content and the ranking signal split between them.
      // /the-blueprint wins on inbound links by a wide margin (120 references
      // against 8), so it is canonical and this retires the other. The name
      // "Blueprint Core" is retired anyway.
      // "Blueprint Premium" is now "The Senior Transition Roadmap". The URL
      // carried the retired product name, so the page moved to /the-roadmap.
      // 40 published blog posts, the GHL emails, and any ad or partner link
      // still point at the old path, so this redirect is load-bearing rather
      // than cosmetic. Do not remove it.
      {
        source: "/blueprint-premium",
        destination: "/the-roadmap",
        permanent: true,
      },
      {
        source: "/blueprint-core",
        destination: "/the-blueprint",
        permanent: true,
      },
      {
        source: "/tools/readiness-assessment",
        destination: "/tools/family-readiness-score",
        permanent: true,
      },
      {
        source: "/readiness-assessment",
        destination: "/tools/family-readiness-score",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        // Site-wide security headers. Deliberately NO X-Frame-Options /
        // frame-ancestors: the interactive tools are embedded via same-origin
        // iframes (ToolIframe -> /tools/<slug>.html) and the paid course embeds
        // the tool HTML too, so a framing restriction could break that feature.
        // The headers below never affect functionality.
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
