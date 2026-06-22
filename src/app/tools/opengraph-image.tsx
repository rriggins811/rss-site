import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Free senior transition tools from Riggins Strategic Solutions";

export default function OGImage() {
  return renderOgImage({
    title: "Free Senior Transition Tools",
    footerNote: "Calculators and quizzes",
  });
}
