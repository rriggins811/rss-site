import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Get Me in Your Corner, a vetted agent and an advocate on the home sale";

export default function OGImage() {
  return renderOgImage({
    title: "Get Me in Your Corner",
    footerNote: "A vetted agent and an advocate, no added cost",
  });
}
