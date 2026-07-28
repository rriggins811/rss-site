import type { Metadata } from "next";
import { Suspense } from "react";
import { BlueprintMapClient } from "./BlueprintMapClient";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    url: `https://rigginsstrategicsolutions.com/blueprint-map`,
    siteName: "Riggins Strategic Solutions",
    images: ["https://rigginsstrategicsolutions.com/og/blueprint-map.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://rigginsstrategicsolutions.com/og/blueprint-map.png"],
  },
  title: "Blueprint Mind Map",
  description:
    "Interactive mind map of the 20-module Senior Transition Blueprint with embedded lessons and tool downloads.",
  alternates: { canonical: "/blueprint-map" },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/**
 * Token-gated route accessed via post-purchase email and the Module 0
 * GHL lesson. NOT linked from header/footer/sitemap.
 *
 * Mind-map data lives in src/lib/blueprint-modules.ts. The client
 * component generates the simplified Markmap source from that data,
 * intercepts module-link clicks, and opens an inline lesson drawer.
 */
export default function BlueprintMapPage() {
  return (
    <Suspense fallback={null}>
      <BlueprintMapClient />
    </Suspense>
  );
}
