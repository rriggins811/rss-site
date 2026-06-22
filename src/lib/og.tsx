import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared Open Graph card renderer.
 *
 * One burgundy/gold brand card, used by every dynamic route's
 * `opengraph-image` so that resource, tool, and directory shares display the
 * page TOPIC instead of falling back to the founder headshot (the root
 * metadata default). Mirrors the original blog/media card design so all social
 * cards are visually consistent.
 *
 * - `eyebrow` defaults to the brand; pass a section label (e.g. "Senior Help
 *   Directory") to differentiate a content type.
 * - `footerNote` is the small bottom-right note (a date on posts, a label like
 *   "Free guide" elsewhere). Omit to show just the domain.
 */
export function renderOgImage({
  title,
  eyebrow = "Riggins Strategic Solutions",
  footerNote,
}: {
  title: string;
  eyebrow?: string;
  footerNote?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#6B2C3E",
          color: "#FAF8F4",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "22px",
            letterSpacing: "3px",
            color: "#D4AF37",
            textTransform: "uppercase",
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ height: "4px", width: "48px", background: "#D4AF37" }} />
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "32px",
            fontSize: "60px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "#FAF8F4",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: "22px", color: "#D4AF37", fontWeight: 600 }}>
            rigginsstrategicsolutions.com
          </div>
          {footerNote && (
            <div style={{ fontSize: "20px", color: "#FAF8F4", opacity: 0.85 }}>
              {footerNote}
            </div>
          )}
        </div>
      </div>
    ),
    OG_SIZE
  );
}
