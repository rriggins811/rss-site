"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const navLinks: { href: string; label: string; external?: boolean }[] = [
  { href: "/about", label: "About" },
  { href: "/the-blueprint", label: "Blueprint" },
  { href: "/seniorsafe-app", label: "SeniorSafe" },
  { href: "/guides", label: "Guides" },
  { href: "/tools", label: "Tools" },
  { href: "/speaking", label: "Speaking" },
  { href: "/media", label: "Media" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

// Ad-landing minimal header. Triggered when a visitor arrives on
// /freeguide or /guides with a Facebook click signal (fbclid auto-added
// by FB) or explicit ?ads=1 flag. Strips the 9-item nav + the parallel
// "Book free 20-min call" CTA so an ad-clicker has one decision: the
// signup form. Organic traffic to the same paths keeps the full nav.
// Added 2026-05-26 after a Saturday landing-page audit identified the
// 11-link header as the largest exit-ramp leak on the paid funnel.
function useAdMode(): boolean {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (!pathname) return false;
  const isLandingPath =
    pathname === "/freeguide" ||
    pathname === "/guides" ||
    pathname.startsWith("/guides/");
  if (!isLandingPath) return false;
  return (
    searchParams.has("fbclid") ||
    searchParams.get("ads") === "1" ||
    searchParams.get("utm_source") === "meta" ||
    searchParams.get("utm_source") === "facebook"
  );
}

// Minimal logo-only header rendered for ad-landing visitors. Also serves
// as the Suspense fallback during static prerender + the full header's
// initial paint before client-side searchParams resolves.
function MinimalHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-center">
          <Link
            href="/"
            aria-label="Riggins Strategic Solutions home"
            className="flex items-center"
          >
            <Image
              src="/brand/logo-horizontal.png"
              alt="Riggins Strategic Solutions"
              width={240}
              height={52}
              priority
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

// Default site header used by SiteHeaderInner.useAdMode = false. Pulled
// into its own function (rather than inline JSX) so the Suspense boundary
// in <SiteHeader /> can fall back to the full nav during prerender.
function FullHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Riggins Strategic Solutions home" className="flex items-center">
            <Image
              src="/brand/logo-horizontal.png"
              alt="Riggins Strategic Solutions"
              width={240}
              height={52}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) =>
              l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-navy-700 hover:text-burgundy-600 transition-colors"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-navy-700 hover:text-burgundy-600 transition-colors"
                >
                  {l.label}
                </Link>
              )
            )}
            <Button asChild size="sm">
              <Link href="/work-with-ryan">Book free 20-min call</Link>
            </Button>
          </nav>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-navy-700 hover:bg-burgundy-100"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" className="lg:hidden pb-4 flex flex-col gap-2">
            {navLinks.map((l) =>
              l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-2 text-base font-medium text-navy-700 hover:bg-burgundy-100"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-2 text-base font-medium text-navy-700 hover:bg-burgundy-100"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              )
            )}
            <Button asChild className="mt-2 w-full">
              <Link href="/work-with-ryan" onClick={() => setOpen(false)}>
                Book free 20-min call
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}

// Inner component that reads the URL via useSearchParams (must be inside
// a Suspense boundary or the entire page is forced into client-side
// rendering). Picks MinimalHeader for ad traffic, FullHeader otherwise.
function SiteHeaderInner() {
  const adMode = useAdMode();
  return adMode ? <MinimalHeader /> : <FullHeader />;
}

// Public entry. Suspense fallback renders the full nav so the prerendered
// HTML (and any user without JS or with a slow hydration) always sees the
// default navigation. Ad-mode switch happens after hydration, which is
// fine because ad-clickers land with searchParams already in the URL and
// hydration is fast.
export function SiteHeader() {
  return (
    <Suspense fallback={<FullHeader />}>
      <SiteHeaderInner />
    </Suspense>
  );
}
