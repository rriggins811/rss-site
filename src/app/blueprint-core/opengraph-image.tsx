import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Senior Transition Blueprint, the complete self-serve system, free";

export default function OGImage() {
  return renderOgImage({
    title: "The Senior Transition Blueprint",
    footerNote: "The complete self-serve system, free, lifetime access",
  });
}
