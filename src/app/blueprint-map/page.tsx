import type { Metadata } from "next";
import { Suspense } from "react";
import fs from "node:fs";
import path from "node:path";
import { BlueprintMapClient } from "./BlueprintMapClient";

export const metadata: Metadata = {
  title: "Blueprint Mind Map",
  description: "Interactive mind map of the 19-module Senior Transition Blueprint.",
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
 * Source markdown lives at content/blueprint-map.md. Read at build time
 * and inlined into the static page so the client doesn't have to fetch
 * a separate request.
 */
export default function BlueprintMapPage() {
  const filePath = path.join(process.cwd(), "content", "blueprint-map.md");
  const markdown = fs.readFileSync(filePath, "utf8");

  return (
    <Suspense fallback={null}>
      <BlueprintMapClient markdown={markdown} />
    </Suspense>
  );
}
