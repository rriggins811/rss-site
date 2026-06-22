import { getResourceContent } from "@/lib/resource-content";
import { getResourceBySlug } from "@/lib/resources";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Riggins Strategic Solutions resource guide";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title =
    getResourceContent(slug)?.frontmatter.title ??
    getResourceBySlug(slug)?.title ??
    "Senior Transition Resources";
  return renderOgImage({ title, footerNote: "Free guide" });
}
