"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/the-blueprint", label: "The Blueprint" },
  { href: "/seniorsafe-app", label: "SeniorSafe App" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Riggins Strategic Solutions home" className="flex items-center">
            <Image
              src="/logo/riggins_logo_horizontal.png"
              alt="Riggins Strategic Solutions"
              width={240}
              height={52}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-navy-700 hover:text-burgundy-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
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
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-base font-medium text-navy-700 hover:bg-burgundy-100"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
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
