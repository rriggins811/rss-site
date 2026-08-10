import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "@/components/site/SocialLinks";

const footerNav: { heading: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    heading: "Work with Ryan",
    links: [
      { href: "/blueprint-preview", label: "Blueprint Map (free)" },
      { href: "/blueprint-core", label: "Senior Transition Blueprint (free)" },
      { href: "/blueprint-premium", label: "Senior Transition Roadmap (free, by application)" },
      { href: "/in-your-corner", label: "Get Me in Your Corner (No added cost)" },
      { href: "/seniorsafe-app", label: "SeniorSafe App" },
      { href: "/work-with-ryan", label: "Book a call" },
    ],
  },
  {
    heading: "Free tools",
    links: [
      { href: "/tools", label: "All free tools and calculators" },
      { href: "/tools/family-readiness-score", label: "Family Readiness Score" },
      { href: "/tools/net-proceeds-calculator", label: "Net Proceeds Calculator" },
      { href: "/tools/aging-in-place-break-even", label: "Aging-in-Place Break-Even" },
      { href: "/resources/senior-help-directory", label: "Senior Help Directory" },
      { href: "/freeguide", label: "Simple Blueprint (free PDF)" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/about", label: "About Ryan" },
      { href: "/blog", label: "Blog" },
      { href: "/resources", label: "Resources" },
      {
        href: "/resources/cash-buyer-scams-elderly-homeowners",
        label: "Wholesaler & cash-buyer protection",
      },
      { href: "/media", label: "Media & podcasts" },
      { href: "/speaking", label: "Speaking" },
      {
        href: "https://www.amazon.com/dp/B0GQLB5536",
        label: "Book: The Unheard Conversation",
        external: true,
      },
      {
        href: "https://www.amazon.com/dp/B0GRR5FLDD",
        label: "Book: The Other Side of the Conversation",
        external: true,
      },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const legalLinks: { href: string; label: string }[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/referral-terms", label: "Referral Partner Terms" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-700 text-cream mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image
              src="/brand/logo-horizontal.png"
              alt="Riggins Strategic Solutions"
              width={220}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-sm text-cream/80 leading-relaxed">
              Ryan Riggins, Senior Transition Advisor. Plain-English guidance for
              families facing a senior housing transition. Greensboro, NC &middot;
              Serving families nationwide.
            </p>
            <p className="mt-2 text-xs text-cream/70 leading-relaxed">
              Licensed NC broker (#361546, eXp Realty). Fiduciary duty to the
              family, not a pitch.
            </p>
            <p className="mt-3 text-sm">
              <a href="tel:+13365538933" className="hover:text-gold-300">
                (336) 553-8933
              </a>
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <h3 className="font-serif text-cream text-base font-semibold">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {group.links.map((l) => (
                  <li key={`${group.heading}-${l.label}`}>
                    {l.external ? (
                      <a href={l.href} className="text-cream/80 hover:text-gold-300">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-cream/80 hover:text-gold-300">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* One quiet line for the proactive and higher-net-worth families who
            are planning ahead rather than reacting to a crisis. Deliberately
            in the footer: the homepage hero belongs to the adult child in the
            thick of it, and this must not dilute it. */}
        <div className="mt-10 border-t border-cream/15 pt-6">
          <p className="text-sm text-cream/80">
            Planning ahead, before a crisis?{" "}
            <Link
              href="/work-with-ryan"
              className="font-semibold text-gold-300 underline underline-offset-4 hover:text-gold-100"
            >
              Start the same conversation earlier
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-cream/15">
          <div className="flex justify-center md:justify-end">
            <SocialLinks className="text-cream/85" />
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-cream/70">
            <p>&copy; {year} Riggins Strategic Solutions. All rights reserved.</p>
            <ul className="flex flex-wrap gap-4">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-cream/60 leading-relaxed">
            This site uses Google Analytics (GA4) and the Meta Pixel to measure
            how visitors use the pages and to optimize advertising. No personal
            information is collected without your consent. If your browser
            sends a Do Not Track signal, analytics are disabled. See our{" "}
            <Link href="/privacy" className="underline hover:text-gold-300">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
