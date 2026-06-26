"use client";

import { useEffect, useRef } from "react";
import { type Module, moduleVideoUrl } from "@/lib/blueprint-modules";
import { getGuidePreview } from "@/lib/blueprint-guide-previews";

// The starter tools unlocked at the $9.99 (preview) tier, matching the free
// guide's giveaway. Everything else stays a locked teaser until the $47 Blueprint.
const FREE_TOOL_HREFS = new Set<string>([
  "/blueprint-tools/Tool_00A_Quick_Start_7Day_Checklist.pdf",
  "/blueprint-tools/Tool_00B_Family_Sharing_Letter.pdf",
  "/blueprint-tools/Tool_01A_Starting_Point_Quick_Assessment.pdf",
  "/blueprint-tools/Tool_02A_5_Pile_Sorting_System.pdf",
  "/blueprint-tools/Tool_03A_Paperwork_3_Folder_System.pdf",
]);

type Props = {
  module: Module | null;
  onClose: () => void;
  /**
   * Preview/tripwire mode (the public /blueprint-preview demo). Swaps the
   * YouTube embed for the Supabase overview video, shows the tools as LOCKED
   * teasers instead of downloads, and adds an unlock CTA. Defaults to the
   * full buyer experience.
   */
  preview?: boolean;
  /** Where the unlock CTA points in preview mode. */
  upgradeUrl?: string;
};

/**
 * Right-side drawer that delivers the actual lesson content for a
 * module: title, embedded video, outcome bullets, tool downloads, and
 * an optional CTA into the GHL course player.
 *
 * Renders as a fixed full-height overlay with a backdrop. Closes on
 * the X button, a click on the backdrop, or the Escape key. While
 * mounted, body scroll is locked so the underlying mind map stays put.
 *
 * The slide animation uses a CSS translate, gated by the presence of
 * `module`, so the drawer animates in even on the first open. We do
 * NOT unmount when closed; we just hide off-screen so the next open
 * is instant (Markmap re-renders are expensive enough as-is).
 */
export function ModuleDrawer({ module, onClose, preview = false, upgradeUrl }: Props) {
  const open = module !== null;
  const guide = preview && module ? getGuidePreview(module.id) : undefined;
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset drawer scroll to top whenever a new module opens
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.scrollTop = 0;
    }
  }, [open, module?.id]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop: click-outside to close */}
      <button
        type="button"
        aria-label="Close lesson"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/45"
        tabIndex={-1}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={module ? `Module ${module.number}: ${module.title}` : "Lesson"}
        className={`absolute right-0 top-0 h-full w-full overflow-y-auto bg-[#FAF8F3] shadow-2xl transition-transform duration-300 ease-out sm:w-[560px] md:w-[600px] lg:w-[50vw] lg:max-w-[720px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {/* Header strip */}
        <div
          className="sticky top-0 z-10 flex items-start gap-4 px-5 py-4 sm:px-7 sm:py-5"
          style={{ background: "#1C3A52", color: "#FAF8F3" }}
        >
          <div className="flex-1 min-w-0">
            {module && (
              <>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-75">
                  {module.phase}
                </p>
                <h2
                  className="mt-1 mb-0 text-lg sm:text-xl font-semibold leading-tight"
                  style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                >
                  Module {module.number}: {module.title}
                </h2>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md border border-cream/30 px-2 py-1 text-sm font-medium text-cream/90 hover:bg-cream/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            Close
            <span aria-hidden className="ml-1.5">&times;</span>
          </button>
        </div>

        {module && (
          <div className="px-5 py-6 sm:px-7 sm:py-8 space-y-8">
            {/* Video */}
            <section>
              <h3
                className="m-0 mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#6B2C3E]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {preview ? "Watch the overview" : "Watch the lesson"}
              </h3>
              {preview ? (
                <div
                  className="relative w-full overflow-hidden rounded-lg bg-black"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <video
                    key={module.id}
                    src={moduleVideoUrl(module)}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={`Module ${module.number} overview video`}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ) : module.youtubeId ? (
                <div
                  className="relative w-full overflow-hidden rounded-lg bg-black"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <iframe
                    key={module.id}
                    src={`https://www.youtube.com/embed/${module.youtubeId}`}
                    title={`Module ${module.number}: ${module.title}`}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              ) : (
                <div
                  className="flex w-full items-center justify-center rounded-lg border border-dashed border-[#1C3A52]/25 bg-white px-4 py-10 text-center text-sm text-[#1C3A52]/70"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  Video coming soon. The written lesson and tools are available below.
                </div>
              )}
            </section>

            {/* Outcomes */}
            <section>
              <h3
                className="m-0 mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#6B2C3E]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                What you&rsquo;ll do
              </h3>
              <ul className="m-0 space-y-2 pl-0 list-none">
                {module.outcomes.map((o) => (
                  <li
                    key={o}
                    className="relative pl-6 text-[#1C3A52]/90 leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full"
                      style={{ background: "#D4AF37" }}
                    />
                    {o}
                  </li>
                ))}
              </ul>
            </section>

            {/* Readable excerpt from the free Simple Blueprint guide (preview only) */}
            {guide && (
              <section>
                <h3
                  className="m-0 mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#6B2C3E]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Inside this module
                </h3>
                <p className="m-0 mb-4 text-[#1C3A52]/90 leading-relaxed">
                  {guide.intro}
                </p>
                <p className="m-0 mb-2 font-semibold text-[#1C3A52]">{guide.heading}</p>
                <ul className="m-0 space-y-2 pl-0 list-none">
                  {guide.points.map((p) => (
                    <li
                      key={p}
                      className="relative pl-6 text-[#1C3A52]/90 leading-relaxed"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full"
                        style={{ background: "#D4AF37" }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                {guide.footnote && (
                  <p className="mt-3 mb-0 text-sm italic text-[#1C3A52]/65">
                    {guide.footnote}
                  </p>
                )}
              </section>
            )}

            {/* Tools: real downloads in the full experience, locked teasers in preview */}
            {module.tools.length > 0 && !preview && (
              <section>
                <h3
                  className="m-0 mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#6B2C3E]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Tools &amp; downloads
                </h3>
                <ul className="m-0 grid gap-3 pl-0 list-none sm:grid-cols-1">
                  {module.tools.map((tool) => (
                    <li key={tool.href}>
                      <a
                        href={tool.href}
                        download
                        className="group flex items-center gap-3 rounded-lg border border-[#1C3A52]/15 bg-white px-4 py-3 transition-colors hover:border-[#6B2C3E] hover:bg-[#6B2C3E]/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                      >
                        <span
                          aria-hidden
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors group-hover:bg-[#6B2C3E] group-hover:text-[#FAF8F3]"
                          style={{ background: "#1C3A52", color: "#FAF8F3" }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-[#1C3A52] group-hover:text-[#6B2C3E]">
                            {tool.name}
                          </span>
                          <span className="block text-xs text-[#1C3A52]/60">
                            PDF download
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Tools in preview/$9.99 mode: the starter set is unlocked as real
                downloads; the rest are locked teasers with the $47 upsell. */}
            {module.tools.length > 0 && preview && (() => {
              const freeTools = module.tools.filter((t) => FREE_TOOL_HREFS.has(t.href));
              const lockedTools = module.tools.filter((t) => !FREE_TOOL_HREFS.has(t.href));
              return (
                <section>
                  <h3
                    className="m-0 mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#6B2C3E]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Done-for-you tools in this module
                  </h3>

                  {freeTools.length > 0 && (
                    <ul className="m-0 mb-3 grid gap-3 pl-0 list-none sm:grid-cols-1">
                      {freeTools.map((tool) => (
                        <li key={tool.href}>
                          <a
                            href={tool.href}
                            download
                            className="group flex items-center gap-3 rounded-lg border border-[#1C3A52]/15 bg-white px-4 py-3 transition-colors hover:border-[#6B2C3E] hover:bg-[#6B2C3E]/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                          >
                            <span
                              aria-hidden
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors group-hover:bg-[#6B2C3E] group-hover:text-[#FAF8F3]"
                              style={{ background: "#1C3A52", color: "#FAF8F3" }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-semibold text-[#1C3A52] group-hover:text-[#6B2C3E]">
                                {tool.name}
                              </span>
                              <span className="block text-xs font-semibold" style={{ color: "#6B2C3E" }}>
                                Yours free, PDF download
                              </span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {lockedTools.length > 0 && (
                    <ul className="m-0 grid gap-3 pl-0 list-none sm:grid-cols-1">
                      {lockedTools.map((tool) => (
                        <li key={tool.href}>
                          <div className="flex items-center gap-3 rounded-lg border border-[#1C3A52]/15 bg-[#1C3A52]/[0.03] px-4 py-3">
                            <span
                              aria-hidden
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                              style={{ background: "#1C3A52", color: "#D4AF37" }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-semibold text-[#1C3A52]">
                                {tool.name}
                              </span>
                              <span className="block text-xs text-[#1C3A52]/60">
                                Included in the full Blueprint
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {upgradeUrl && lockedTools.length > 0 && (
                    <a
                      href={upgradeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{ background: "#D4AF37", color: "#1C3A52" }}
                    >
                      Unlock all 70+ tools, full Blueprint for $30 (normally $47)
                      <span aria-hidden className="ml-2">&rarr;</span>
                    </a>
                  )}
                </section>
              );
            })()}

            {/* GHL lesson CTA (hidden when no URL set) */}
            {module.ghlLessonUrl && (
              <section>
                <a
                  href={module.ghlLessonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 sm:w-auto"
                  style={{ background: "#D4AF37", color: "#1C3A52" }}
                >
                  Open the full lesson in the course
                  <span aria-hidden className="ml-2">&rarr;</span>
                </a>
              </section>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
