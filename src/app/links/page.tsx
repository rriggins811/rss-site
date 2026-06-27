import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/site/SocialLinks";

/**
 * Link-in-bio hub at /links. The single destination for every social bio
 * (TikTok, Instagram, etc.) and "link in comments" on reels. Mobile-first,
 * brand-matched, big tap targets.
 *
 * The Meta Pixel fires here automatically: it is mounted site-wide in the root
 * layout, so every bio tap becomes a retargeting PageView with no per-page
 * code. The site header is hidden on this route (SiteHeaderGate) for a focused,
 * chrome-free page; the standard site footer is inherited from the layout.
 *
 * noindex/nofollow + kept out of the sitemap and main nav on purpose: a utility
 * hub, not search content.
 */

export const metadata: Metadata = {
  title: "Ryan Riggins | Links, Free Tools & Resources",
  description:
    "Every free tool, guide, and resource from Ryan Riggins, Senior Transition Advisor, in one place.",
  alternates: { canonical: "/links" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

type LinkItem = {
  label: string;
  description?: string;
  href: string;
};

type LinkGroup = {
  heading: string;
  items: LinkItem[];
};

const GROUPS: LinkGroup[] = [
  {
    heading: "Start here (free)",
    items: [
      {
        label: "Free Simple Blueprint Guide",
        description: "The 14-page starter guide for families just getting going.",
        href: "/freeguide",
      },
      {
        label: "Net Proceeds Calculator",
        description: "See what you will actually walk away with from a home sale.",
        href: "/tools/net-proceeds-calculator",
      },
      {
        label: "Readiness Assessment",
        description: "Find out where your family really is right now.",
        href: "/tools/readiness-assessment",
      },
      {
        label: "Aging-in-Place vs Move Calculator",
        description: "Run the real 5-year cost math on staying versus moving.",
        href: "/tools/aging-in-place-break-even",
      },
      {
        label: "Senior Help Directory",
        description: "Free programs for seniors, organized by state and county.",
        href: "/resources/senior-help-directory",
      },
    ],
  },
  {
    heading: "The app",
    items: [
      {
        label: "SeniorSafe App",
        description:
          "Daily check-ins, document vault, Maggie AI, and family coordination. Free trial.",
        href: "https://seniorsafeapp.com",
      },
    ],
  },
  {
    heading: "Go deeper",
    items: [
      {
        label: "The Senior Transition Blueprint ($47)",
        description: "The full 20-module course with 70-plus done-for-you tools.",
        href: "/the-blueprint",
      },
      {
        label: "Senior Transition Roadmap ($297)",
        description: "A personalized plan plus a 60-minute call with Ryan.",
        href: "/blueprint-premium",
      },
      {
        label: "The Unheard Conversation (book)",
        description: "How to talk with your parents before a crisis forces it.",
        href: "https://www.amazon.com/dp/B0GQLB5536",
      },
      {
        label: "The Other Side of the Conversation (book)",
        description: "The companion read for the parent's point of view.",
        href: "https://www.amazon.com/dp/B0GRR5FLDD",
      },
    ],
  },
  {
    heading: "Work with Ryan",
    items: [
      {
        label: "Book a Free 20-Minute Call",
        description: "Talk through your situation. No pitch, no pressure.",
        href: "/work-with-ryan",
      },
    ],
  },
  {
    heading: "Follow & learn",
    items: [
      {
        label: "YouTube",
        description: "Walkthroughs, breakdowns, and honest senior-transition advice.",
        href: "https://www.youtube.com/@RigginsStrategicSolutions",
      },
      {
        label: "Read the Blog",
        description: "Plain-English guides on selling, downsizing, and care.",
        href: "/blog",
      },
    ],
  },
];

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function LinkCard({ item }: { item: LinkItem }) {
  const className =
    "group block rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-gold-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500";
  const inner = (
    <>
      <span className="block font-semibold text-navy-700 group-hover:text-burgundy-700">
        {item.label}
      </span>
      {item.description ? (
        <span className="mt-0.5 block text-sm text-ink/65">{item.description}</span>
      ) : null}
    </>
  );

  if (isExternal(item.href)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-navy-700">
      <div className="mx-auto w-full max-w-md px-5 py-12">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="overflow-hidden rounded-full ring-2 ring-gold-500">
            <Image
              src="/brand/ryan-headshot.jpg"
              alt="Ryan Riggins"
              width={104}
              height={104}
              className="object-cover"
              priority
            />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-white">
            Ryan Riggins
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Senior Transition Advisor. Free tools and honest guidance for
            families navigating a parent&rsquo;s transition.
          </p>
        </div>

        {/* Link groups */}
        <div className="mt-10 space-y-8">
          {GROUPS.map((group) => (
            <section key={group.heading}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-500">
                {group.heading}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <LinkCard key={item.label} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Social icon row */}
        <div className="mt-10 flex flex-col items-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Connect
          </p>
          <SocialLinks className="text-white/85" />
        </div>
      </div>
    </main>
  );
}
