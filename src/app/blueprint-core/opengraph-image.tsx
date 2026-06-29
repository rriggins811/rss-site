import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blueprint Core, the self-serve Senior Transition system, $47";

export default function OGImage() {
  return renderOgImage({
    title: "Blueprint Core",
    footerNote: "The self-serve system, $47, lifetime access",
  });
}
