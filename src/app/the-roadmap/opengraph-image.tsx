import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Senior Transition Roadmap, built with Ryan, free by application";

export default function OGImage() {
  return renderOgImage({
    title: "The Senior Transition Roadmap",
    footerNote: "Built with Ryan, free, by application",
  });
}
