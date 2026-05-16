import Link from "next/link";
import {
  type ClusterMember,
  getRelatedFor,
  memberToUrl,
} from "@/lib/internal-links";
import { getPostBySlug } from "@/lib/blog";
import { getResourceBySlug } from "@/lib/resources";
import { getToolBySlug } from "@/lib/tools";

type Props = {
  /** Type + slug of the CURRENT page so its cluster siblings can be resolved. */
  current: ClusterMember;
  /** Optional explicit cap. Defaults to 4. */
  limit?: number;
  /** Optional title override. Defaults to "Related reading". */
  title?: string;
  /** Tailwind background utility — match the surrounding section. */
  bgClass?: string;
};

/**
 * Renders a cluster-aware "Related reading" block for the current page.
 * Pulls cluster siblings from the typed registry in lib/internal-links.ts
 * and resolves each one's title/excerpt from the corresponding content
 * source (blog/resources/tools registries). Returns null silently if the
 * page isn't in any cluster — safe to mount on every tool/post.
 *
 * The cluster's human label renders above the link list so visitors AND
 * Google AI Overviews see the topical-cluster framing explicitly.
 */
export function RelatedReading({
  current,
  limit = 4,
  title = "Related reading",
  bgClass = "bg-cream",
}: Props) {
  const { cluster, related } = getRelatedFor({
    type: current.type,
    slug: current.slug,
    limit,
  });

  if (!cluster || related.length === 0) return null;

  // Resolve each cluster member to its display title + excerpt. The lookup
  // functions return null when a slug doesn't exist (typo, deleted post),
  // in which case we skip that member rather than render a broken link.
  const items = related
    .map((m) => {
      const url = memberToUrl(m);
      if (m.type === "blog") {
        const post = getPostBySlug(m.slug);
        if (!post) return null;
        return {
          url,
          type: m.type,
          title: post.frontmatter.title,
          excerpt: post.frontmatter.excerpt,
        };
      }
      if (m.type === "resource") {
        const r = getResourceBySlug(m.slug);
        if (!r) return null;
        return { url, type: m.type, title: r.title, excerpt: r.description };
      }
      if (m.type === "tool") {
        const t = getToolBySlug(m.slug);
        if (!t) return null;
        return { url, type: m.type, title: t.title, excerpt: t.description };
      }
      return null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) return null;

  const typeLabel: Record<ClusterMember["type"], string> = {
    tool: "Free tool",
    blog: "Blog post",
    resource: "Guide",
  };

  return (
    <section className={`${bgClass} border-y border-border`}>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-burgundy-600">
          Topic cluster · {cluster.label}
        </p>
        <h2 className="mt-3 text-2xl md:text-3xl">{title}</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((it) => (
            <li key={it.url}>
              <Link
                href={it.url}
                className="group block rounded-md border border-border bg-white p-5 hover:border-burgundy-600 transition-colors h-full"
              >
                <span className="block text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                  {typeLabel[it.type]}
                </span>
                <h3 className="mt-2 font-serif text-lg text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm text-ink/75 leading-relaxed">
                  {it.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
