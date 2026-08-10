"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  slug: string;
  title: string;
  minHeight: number;
};

/**
 * Embeds a same-origin /tools/<slug>.html file inside an iframe and
 * auto-sizes the iframe height from the embedded document's scrollHeight.
 *
 * Same-origin means we can read iframe.contentDocument directly, no
 * postMessage bridge needed.
 */
export function ToolIframe({ slug, title, minHeight }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState<number>(minHeight);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    let stopped = false;
    let ro: ResizeObserver | null = null;

    function measure() {
      if (!iframe || stopped) return;
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;
      // Measure the BODY only. documentElement.scrollHeight stretches to fill
      // whatever height the iframe already has, so folding it into a Math.max
      // made this a one-way ratchet: the frame could grow but never shrink,
      // and it could never drop below the initial minHeight. Every tool sat on
      // ~1000px of dead space under its intro screen, and any view that got
      // shorter (questions -> results) left a gap the size of the difference.
      const h = Math.max(doc.body.scrollHeight, doc.body.offsetHeight);
      // Sanity floor: a mid-reflow read of ~0 would collapse the frame.
      if (h > 50) {
        setHeight((prev) => (Math.abs(prev - h) > 4 ? h : prev));
      }
    }

    function attach() {
      measure();
      const doc = iframe?.contentDocument;
      if (!doc || !doc.body) return;
      try {
        ro = new ResizeObserver(measure);
        ro.observe(doc.body);
        ro.observe(doc.documentElement);
      } catch {
        // fall through to interval-based polling
      }
    }

    const onLoad = () => attach();
    iframe.addEventListener("load", onLoad);

    // Belt-and-suspenders: poll a couple times to catch late reflows
    // (images loading, fonts swapping, client-rendered result panels).
    const interval = window.setInterval(measure, 750);

    // In case the iframe is already loaded (fast cache hit).
    if (iframe.contentDocument?.readyState === "complete") attach();

    return () => {
      stopped = true;
      iframe.removeEventListener("load", onLoad);
      window.clearInterval(interval);
      if (ro) ro.disconnect();
    };
  }, [slug]);

  return (
    <iframe
      ref={ref}
      src={`/tools/${slug}.html`}
      title={title}
      loading="lazy"
      className="w-full border-0 bg-transparent"
      style={{ height: `${height}px` }}
    />
  );
}
