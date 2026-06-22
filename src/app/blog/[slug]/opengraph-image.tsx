import { getPostBySlug, formatPostDate } from "@/lib/blog";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Riggins Strategic Solutions blog post";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.frontmatter.title ?? "Riggins Strategic Solutions";
  const dateStr = post ? formatPostDate(post.datePublished) : undefined;
  return renderOgImage({ title, footerNote: dateStr });
}
