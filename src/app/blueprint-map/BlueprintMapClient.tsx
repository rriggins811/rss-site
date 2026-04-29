"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

/**
 * Single shared access token for v1. Lives client-side because the gate
 * is convenience (keep the URL out of indexers + casual sharing), not a
 * security boundary. Rotate by changing this constant + the GHL email.
 */
const VALID_KEY = "blueprint2026";

// Brand palette per spec.
const PALETTE = ["#1C3A52", "#6B2C3E", "#D4AF37", "#1C3A52", "#6B2C3E"];

type Props = {
  markdown: string;
};

const transformer = new Transformer();

export function BlueprintMapClient({ markdown }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mmRef = useRef<Markmap | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Gate check
  useEffect(() => {
    const key = searchParams.get("key");
    if (key !== VALID_KEY) {
      router.replace("/the-blueprint");
      return;
    }
    setAuthorized(true);
  }, [searchParams, router]);

  // Lock body scroll while the full-screen map is mounted
  useEffect(() => {
    if (!authorized) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [authorized]);

  // Markmap render
  useEffect(() => {
    if (!authorized || !svgRef.current) return;

    const { root } = transformer.transform(markdown);
    const mm = Markmap.create(
      svgRef.current,
      {
        color: (node: { state?: { depth?: number } }) => {
          const depth = node.state?.depth ?? 0;
          return PALETTE[depth % PALETTE.length];
        },
        duration: 500,
        maxWidth: 320,
        spacingHorizontal: 110,
        spacingVertical: 16,
        initialExpandLevel: 2,
      },
      root
    );
    mmRef.current = mm;

    // Re-fit on viewport changes so the map stays centered on rotate / resize
    const onResize = () => {
      mm.fit();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      mmRef.current = null;
    };
  }, [authorized, markdown]);

  // Pre-auth render: nothing (router.replace is in flight). Avoids flashing
  // the full-screen map for unauthorized visitors.
  if (!authorized) return null;

  return (
    <main
      className="fixed inset-0 z-[60] flex flex-col bg-[#FAF8F3]"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <header
        className="px-6 py-4 text-[#FAF8F3]"
        style={{ background: "#1C3A52" }}
      >
        <div className="mx-auto max-w-6xl flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h1
            className="text-lg sm:text-xl font-semibold m-0 leading-tight"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          >
            The Senior Transition Blueprint, Interactive Mind Map
          </h1>
          <p className="m-0 text-xs sm:text-sm opacity-85">
            Click any module to expand. Click a video link to watch the lesson.
          </p>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        <svg
          ref={svgRef}
          className="block w-full h-full"
          aria-label="Senior Transition Blueprint mind map"
        />
      </div>
    </main>
  );
}
