import { getToolBySlug } from "@/lib/tools";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Riggins Strategic Solutions free tool";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = getToolBySlug(slug)?.title ?? "Free Senior Transition Tools";
  return renderOgImage({ title, footerNote: "Free interactive tool" });
}
