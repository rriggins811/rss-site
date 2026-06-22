import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Senior transition resources from Riggins Strategic Solutions";

export default function OGImage() {
  return renderOgImage({
    title: "Senior Transition Resources",
    footerNote: "Free in-depth guides",
  });
}
