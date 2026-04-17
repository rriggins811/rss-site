import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/site/LegalPage";
import { getLegalBySlug } from "@/lib/legal";

const SLUG = "terms";

export async function generateMetadata(): Promise<Metadata> {
  const page = getLegalBySlug(SLUG);
  if (!page) return { title: "Not found" };
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    alternates: { canonical: `/${SLUG}` },
  };
}

export default function TermsOfServicePage() {
  const page = getLegalBySlug(SLUG);
  if (!page) notFound();
  return <LegalPage page={page} />;
}
