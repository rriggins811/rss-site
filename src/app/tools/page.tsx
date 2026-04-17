import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";
import { Button } from "@/components/ui/button";
import { EmailFallback } from "@/components/site/EmailFallback";
import {
  TOOLS,
  CATEGORY_LABELS,
  type Tool,
  type ToolCategory,
} from "@/lib/tools";
import { breadcrumbListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Tools for Senior Transitions",
  description:
    "Nine free calculators, planning tools, and assessments for families navigating a senior housing transition. No email gate, no pitch.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Tools for Senior Transitions",
    description:
      "Nine free calculators, planning tools, and assessments for families navigating a senior housing transition.",
    type: "website",
    url: "/tools",
  },
};

type ExtraCard = {
  slug: string;
  title: string;
  shortDescription: string;
  href: string;
  badge?: string;
};

const EXTRA_PLANNING: ExtraCard[] = [
  {
    slug: "simple-blueprint",
    title: "Simple Blueprint",
    shortDescription: "Entry-level guide to the transition",
    href: "/freeguide",
    badge: "Free PDF",
  },
];

type Card = (Tool & { href: string; badge?: string }) | ExtraCard;

function toCard(t: Tool): Card {
  return { ...t, href: `/tools/${t.slug}` };
}

function groupedCards(): Record<ToolCategory, Card[]> {
  const financial = TOOLS.filter((t) => t.category === "financial").map(toCard);
  const planning = [
    ...TOOLS.filter((t) => t.category === "planning").map(toCard),
    ...EXTRA_PLANNING,
  ];
  const assessment = TOOLS.filter((t) => t.category === "assessment").map(toCard);
  return { financial, planning, assessment };
}

function CardLink({ card }: { card: Card }) {
  return (
    <Link
      href={card.href}
      className="group block h-full rounded-lg border border-border bg-white p-6 hover:border-burgundy-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg text-navy-700 leading-snug group-hover:text-burgundy-700 transition-colors">
          {card.title}
        </h3>
        {"badge" in card && card.badge ? (
          <span className="rounded-full bg-gold-100 border border-gold-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-700 whitespace-nowrap">
            {card.badge}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-ink/80 leading-relaxed">
        {card.shortDescription}
      </p>
      <p className="mt-4 text-sm font-semibold text-burgundy-600 group-hover:text-burgundy-700 transition-colors">
        Open tool &rarr;
      </p>
    </Link>
  );
}

export default function ToolsHubPage() {
  const groups = groupedCards();

  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ]);

  const categories: { key: ToolCategory; heading: string; intro: string }[] = [
    {
      key: "financial",
      heading: CATEGORY_LABELS.financial,
      intro:
        "The dollar-and-cents side. Run the numbers before a wholesaler or a listing agent runs them for you.",
    },
    {
      key: "planning",
      heading: CATEGORY_LABELS.planning,
      intro:
        "The decisions that drive the transition. Stay or move, what to fix, who inherits what.",
    },
    {
      key: "assessment",
      heading: CATEGORY_LABELS.assessment,
      intro:
        "Honest check-ins. Where the family actually stands today, not where everyone's telling each other they stand.",
    },
  ];

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="leading-[1.1]">Free tools for families in transition.</h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed max-w-2xl mx-auto">
            Nine calculators, planners, and assessments built for the families
            we work with every day. No email gate. No pitch. Use them, share
            them, and book a call if you want help interpreting the results.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.map((cat) => (
        <section key={cat.key} className="bg-white border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl">{cat.heading}</h2>
              <p className="mt-3 text-ink/80 leading-relaxed">{cat.intro}</p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {groups[cat.key].map((card) => (
                <CardLink key={card.slug} card={card} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl">
            Used a tool and want a second set of eyes?
          </h2>
          <p className="mt-4 text-ink/80 leading-relaxed">
            Book a free 20-minute call. Walk through your results with Ryan, get
            the honest read, and leave with the next two or three steps clearly
            laid out.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link
                href="/work-with-ryan"
                data-track="book_call_click"
                data-track-params='{"location":"tools-hub"}'
              >
                Book a free 20-min call
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/freeguide">Get the free Simple Blueprint</Link>
            </Button>
          </div>
          <EmailFallback className="mt-6" align="center" />
        </div>
      </section>
    </main>
  );
}
