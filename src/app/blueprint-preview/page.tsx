import type { Metadata } from "next";
import { Suspense } from "react";
import { BlueprintMapClient } from "../blueprint-map/BlueprintMapClient";

export const metadata: Metadata = {
  title: "The Senior Transition Blueprint, Interactive Preview",
  description:
    "Explore the full 19-module Senior Transition Blueprint as an interactive mind map. Watch the overview videos and see every done-for-you tool included.",
  alternates: { canonical: "/blueprint-preview" },
  // Ungated marketing/tripwire demo. Kept out of search so it does not compete
  // with the main Blueprint pages; it is reached from ads and direct links.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Public, ungated preview of the Blueprint mind map, used as ad creative and a
 * low-ticket tripwire. Same map and drawer as /blueprint-map, but in `preview`
 * mode: Supabase overview videos, tools shown as LOCKED teasers (no downloads),
 * and an unlock CTA into the full Blueprint. The token-gated buyer map at
 * /blueprint-map is unchanged.
 */
export default function BlueprintPreviewPage() {
  return (
    <Suspense fallback={null}>
      <BlueprintMapClient preview />
    </Suspense>
  );
}
