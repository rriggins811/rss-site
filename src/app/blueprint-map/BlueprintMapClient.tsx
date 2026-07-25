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
import { trackPixelEvent, getFbc, getFbp } from "@/lib/meta/pixel";

/**
 * Legacy shared key for full-course buyers (?key=blueprint2026). Kept working
 * so the existing buyer path never breaks. Convenience gate, not a security
 * boundary.
 */
const VALID_KEY = "blueprint2026";

// Free-pivot: the Blueprint is free now, so the locked-tool CTAs for legacy
// map-tier visitors point at the free account signup instead of the old paid
// upgrade checkout.
const UPGRADE_URL =
  "https://blueprint.rigginsstrategicsolutions.com/signup";

// The sales page cold visitors land on when they have no valid key or token.
const SALES_PAGE = "/blueprint-preview";

// Brand palette per spec.
const PALETTE = ["#1C3A52", "#6B2C3E", "#D4AF37", "#1C3A52", "#6B2C3E"];

const transformer = new Transformer();

// Legacy attribution: fire Meta Purchase (pixel + CAPI, deduped on the stripe
// session id) when a map buyer from the old paid checkout lands on the success
// page and the instant-access unlock succeeds. The map is no longer sold, so
// this only fires for stragglers returning from pre-pivot Stripe sessions.
function fireMapPurchase(sessionId: string) {
  const eventId = `purchase_${sessionId}`;
  const customData = {
    value: 9.99,
    currency: "USD",
    content_name: "blueprint_map",
  };
  try {
    trackPixelEvent({ eventName: "Purchase", eventId, customData });
  } catch {
    /* pixel best-effort */
  }
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName: "Purchase",
        eventId,
        eventSourceUrl:
          typeof window !== "undefined" ? window.location.href : "",
        userData: { fbc: getFbc(), fbp: getFbp() },
        customData,
      }),
    }).catch(() => {});
  } catch {
    /* CAPI best-effort */
  }
}

/**
 * Access modes:
 *  - "full" = full-course access (?key or a token with tier "full"): real
 *             tool downloads.
 *  - "map"  = legacy map-tier buyer (token tier "map"/"map_book"): overview
 *             videos + summaries, tools shown as locked teasers with a
 *             free-signup CTA.
 *  - null   = still checking (token validation is async) → render nothing.
 */
type Mode = "full" | "map" | null;

export function BlueprintMapClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mmRef = useRef<Markmap | null>(null);
  const purchaseFiredRef = useRef(false);
  const [mode, setMode] = useState<Mode>(null);
  const [claiming, setClaiming] = useState(false);
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

  // Gate: ?key (legacy shared key) → full. ?token → validate server-side,
  // tier drives mode. Neither → bounce to the sales page.
  useEffect(() => {
    let cancelled = false;
    const key = searchParams.get("key");
    const token = searchParams.get("token");
    const sessionId = searchParams.get("session_id");

    const applyTier = (tier?: string | null): boolean => {
      if (tier === "full") {
        setMode("full");
        return true;
      }
      if (tier === "map" || tier === "map_book") {
        setMode("map");
        return true;
      }
      return false;
    };

    if (key === VALID_KEY) {
      setMode("full");
      return;
    }

    if (token) {
      fetch(`/api/blueprint-access?token=${encodeURIComponent(token)}`)
        .then((r) => r.json())
        .then((d: { tier?: string | null }) => {
          if (!cancelled && !applyTier(d.tier)) router.replace(SALES_PAGE);
        })
        .catch(() => {
          if (!cancelled) router.replace(SALES_PAGE);
        });
      return () => {
        cancelled = true;
      };
    }

    if (sessionId) {
      // Just purchased: poll until the Stripe webhook has written the access row
      // (usually a second or two), then unlock. Fall back to the check-your-email
      // page if it takes too long.
      setClaiming(true);
      let attempts = 0;
      const poll = () => {
        if (cancelled) return;
        fetch(`/api/blueprint-access?session_id=${encodeURIComponent(sessionId)}`)
          .then((r) => r.json())
          .then((d: { tier?: string | null }) => {
            if (cancelled) return;
            if (applyTier(d.tier)) {
              setClaiming(false);
              if (!purchaseFiredRef.current) {
                purchaseFiredRef.current = true;
                fireMapPurchase(sessionId);
              }
              return;
            }
            if (++attempts >= 12) {
              router.replace(`${SALES_PAGE}?purchased=1`);
              return;
            }
            setTimeout(poll, 1500);
          })
          .catch(() => {
            if (cancelled) return;
            if (++attempts >= 12) {
              router.replace(`${SALES_PAGE}?purchased=1`);
              return;
            }
            setTimeout(poll, 1500);
          });
      };
      poll();
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

  if (mode === null) {
    if (!claiming) return null;
    return (
      <main
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-[#FAF8F3] px-6 text-center"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#1C3A52]/20 border-t-[#1C3A52]"
          aria-hidden
        />
        <p className="m-0 font-semibold text-[#1C3A52]">
          Unlocking your Blueprint Map...
        </p>
        <p className="m-0 text-sm text-[#1C3A52]/60">
          This takes a few seconds. A link is also on its way to your email.
        </p>
      </main>
    );
  }

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
