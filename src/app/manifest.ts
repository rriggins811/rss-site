import type { MetadataRoute } from "next";

/**
 * Web app manifest (served at /manifest.webmanifest, auto-linked by Next).
 * Gives the brand proper presentation when the site is saved to a phone home
 * screen or surfaced in browser/PWA UI. Icons point at the stable public
 * logo-mark asset (512x512). theme/background use the brand burgundy + cream.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Riggins Strategic Solutions",
    short_name: "RSS",
    description:
      "Consumer-protection education for families facing a parent's senior housing transition: free guides, tools, and a state-by-state Senior Help Directory.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F4",
    theme_color: "#6B2C3E",
    icons: [
      {
        src: "/brand/logo-mark.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
