"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import {
  buildMindMapMarkdown,
  getModuleById,
  type Module,
} from "@/lib/blueprint-modules";
import { ModuleDrawer } from "@/components/blueprint-map/ModuleDrawer";

/**
 * Legacy shared key for $47 buyers (?key=blueprint2026). Kept working so the
 * existing buyer path never breaks. Convenience gate, not a security boundary.
 */
const VALID_KEY = "blueprint2026";

// Where the $9.99 map's locked-tool CTAs point (the full $47 Blueprint).
const UPGRADE_URL = "https://blueprint.rigginsstrategicsolutions.com/the-blueprint";

// The sales page cold visitors land on when they have no valid key or token.
const SALES_PAGE = "/blueprint-preview";

// Brand palette per spec.
const PALETTE = ["#1C3A52", "#6B2C3E", "#D4AF37", "#1C3A52", "#6B2C3E"];

const transformer = new Transformer();

/**
 * Access modes:
 *  - "full" = $47 buyer (?key) or a token with tier "full": real tool downloads.
 *  - "map"  = $9.99 buyer (token tier "map"/"map_book"): overview videos +
 *             summaries, tools shown as locked teasers with an upgrade CTA.
 *  - null   = still checking (token validation is async) → render nothing.
 */
type Mode = "full" | "map" | null;

export function BlueprintMapClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mmRef = useRef<Markmap | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  // "map" mode renders the preview-style experience (videos + summaries +
  // locked tools); "full" renders real downloads.
  const preview = mode === "map";

  const markdown = useMemo(
    () =>
      preview
        ? buildMindMapMarkdown({
            rootTitle: "The Senior Transition Blueprint",
            tagline: "by Ryan Riggins · Riggins Strategic Solutions",
          })
        : buildMindMapMarkdown(),
    [preview]
  );

  // Gate: ?key (legacy $47) → full. ?token → validate server-side, tier drives
  // mode. Neither → bounce to the sales page.
  useEffect(() => {
    let cancelled = false;
    const key = searchParams.get("key");
    const token = searchParams.get("token");

    if (key === VALID_KEY) {
      setMode("full");
      return;
    }
    if (token) {
      fetch(`/api/blueprint-access?token=${encodeURIComponent(token)}`)
        .then((r) => r.json())
        .then((data: { tier?: string | null }) => {
          if (cancelled) return;
          if (data.tier === "full") setMode("full");
          else if (data.tier === "map" || data.tier === "map_book") setMode("map");
          else router.replace(SALES_PAGE);
        })
        .catch(() => {
          if (!cancelled) router.replace(SALES_PAGE);
        });
      return () => {
        cancelled = true;
      };
    }
    router.replace(SALES_PAGE);
  }, [searchParams, router]);

  // Lock body scroll while the full-screen map is mounted.
  useEffect(() => {
    if (mode === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mode]);

  // Markmap render.
  useEffect(() => {
    if (mode === null || !svgRef.current) return;

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

    const onResize = () => mm.fit();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      mmRef.current = null;
    };
  }, [mode, markdown]);

  // Click delegation: intercept #module-* anchor clicks inside the SVG and open
  // the drawer instead of navigating to the hash.
  useEffect(() => {
    if (mode === null) return;
    const svg = svgRef.current;
    if (!svg) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";

      if (href.startsWith("#module-")) {
        const id = href.slice(1);
        const mod = getModuleById(id);
        if (!mod) return;
        e.preventDefault();
        e.stopPropagation();
        setActiveModule(mod);
        return;
      }

      if (/^https?:\/\//i.test(href)) {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, "_blank", "noopener,noreferrer");
      }
    };

    svg.addEventListener("click", handler);
    return () => svg.removeEventListener("click", handler);
  }, [mode]);

  if (mode === null) return null;

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
            {preview
              ? "Click any module to watch the overview and see what is inside."
              : "Click any module to open the lesson, video, and tool downloads."}
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

      <ModuleDrawer
        module={activeModule}
        onClose={() => setActiveModule(null)}
        preview={preview}
        upgradeUrl={UPGRADE_URL}
      />
    </main>
  );
}
