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
 * Single shared access token for v1. Lives client-side because the gate
 * is convenience (keep the URL out of indexers + casual sharing), not a
 * security boundary. Rotate by changing this constant + the GHL email.
 */
const VALID_KEY = "blueprint2026";

// Brand palette per spec.
const PALETTE = ["#1C3A52", "#6B2C3E", "#D4AF37", "#1C3A52", "#6B2C3E"];

const transformer = new Transformer();

export function BlueprintMapClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mmRef = useRef<Markmap | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  const markdown = useMemo(() => buildMindMapMarkdown(), []);

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

    const onResize = () => mm.fit();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      mmRef.current = null;
    };
  }, [authorized, markdown]);

  // Click delegation: intercept #module-* anchor clicks inside the SVG
  // and open the drawer instead of navigating to the hash.
  useEffect(() => {
    if (!authorized) return;
    const svg = svgRef.current;
    if (!svg) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("#module-")) return;

      const id = href.slice(1); // strip leading "#"
      const mod = getModuleById(id);
      if (!mod) return;

      e.preventDefault();
      e.stopPropagation();
      setActiveModule(mod);
    };

    svg.addEventListener("click", handler);
    return () => svg.removeEventListener("click", handler);
  }, [authorized]);

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
            Click any module to open the lesson, video, and tool downloads.
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

      <ModuleDrawer module={activeModule} onClose={() => setActiveModule(null)} />
    </main>
  );
}
