import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Senior Help Directory by Riggins Strategic Solutions";

export default function OGImage() {
  return renderOgImage({
    title: "Senior Help Directory",
    footerNote: "Free senior aid, all 50 states and DC",
  });
}
