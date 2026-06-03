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
    ];
  },
};

export default nextConfig;
