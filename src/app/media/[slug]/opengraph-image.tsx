import { ImageResponse } from "next/og";
import { getMediaBySlug, formatMediaDate } from "@/lib/media";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Riggins Strategic Solutions podcast appearance";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMediaBySlug(slug);
  const title = item?.frontmatter.title ?? "Riggins Strategic Solutions";
  const podcast = item?.frontmatter.podcast ?? "";
  const dateStr = item ? formatMediaDate(item.datePublished) : "";

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
          Podcast &middot; Riggins Strategic Solutions
        </div>

        <div
          style={{
            marginTop: "32px",
            fontSize: "56px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "#FAF8F4",
          }}
        >
          {title}
        </div>

        {podcast && (
          <div
            style={{
              marginTop: "20px",
              fontSize: "26px",
              color: "#F8EFD3",
              fontFamily: "sans-serif",
            }}
          >
            {podcast}
          </div>
        )}

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
          {dateStr && (
            <div style={{ fontSize: "20px", color: "#FAF8F4", opacity: 0.85 }}>
              {dateStr}
            </div>
          )}
        </div>
      </div>
    ),
    size
  );
}
