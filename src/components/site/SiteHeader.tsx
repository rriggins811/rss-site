"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Top-nav structure. A `link` renders as a single anchor. A `dropdown`
 * renders as a button + accessible menu (Articles / Tools / Downloads
 * grouped under "Free Resources"). Keeping this as a discriminated union
 * means adding a future dropdown anywhere is a one-entry change here.
 *
 * `matchPrefixes` on a dropdown is the set of route prefixes that mark
 * the trigger as active (so the trigger highlights when the user is on
 * /resources, /tools, or /guides, including any nested route like
 * /resources/[slug]).
 */
type NavItem =
  | { type: "link"; href: string; label: string; external?: boolean }
  | {
      type: "dropdown";
      label: string;
      matchPrefixes: string[];
      children: { href: string; label: string; description?: string }[];
    };

const navItems: NavItem[] = [
  { type: "link", href: "/about", label: "About" },
  { type: "link", href: "/the-blueprint", label: "Blueprint" },
  { type: "link", href: "/seniorsafe-app", label: "SeniorSafe" },
  {
    type: "dropdown",
    label: "Free Resources",
    matchPrefixes: ["/resources", "/tools", "/guides"],
    children: [
      {
        href: "/resources",
        label: "Articles",
        description: "Readable pillar guides",
      },
      {
        href: "/resources/senior-help-directory",
        label: "Senior Help Directory",
        description: "Local senior aid by state & county",
      },
      {
        href: "/tools",
        label: "Tools",
        description: "Calculators and quizzes",
      },
      {
        href: "/guides",
        label: "Downloads",
        description: "Email-gated PDF guides",
      },
    ],
  },
  { type: "link", href: "/speaking", label: "Speaking" },
  { type: "link", href: "/media", label: "Media" },
  { type: "link", href: "/blog", label: "Blog" },
  { type: "link", href: "/contact", label: "Contact" },
];

// Ad-landing minimal header. Triggered when a visitor arrives on
// /freeguide or /guides with a Facebook click signal (fbclid auto-added
// by FB) or explicit ?ads=1 flag. Strips the full nav + the parallel
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

// Match a pathname against a dropdown's matchPrefixes — exact match
// (/tools === /tools) OR descendant (/tools/foo starts with /tools/).
// We don't use bare `startsWith(prefix)` because /toolsuite would falsely
// match a /tools prefix. Anchoring on `/` after the prefix prevents that.
function pathMatchesPrefix(pathname: string | null, prefix: string): boolean {
  if (!pathname) return false;
  return pathname === prefix || pathname.startsWith(prefix + "/");
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

/**
 * Accessible dropdown for the desktop nav. Hover-opens (with a short
 * close delay on mouseleave to bridge the trigger/menu gap) AND
 * click/keyboard activates so it works without a pointer.
 *
 * Keyboard model (WAI-ARIA Authoring Practices "Menu Button" pattern):
 *   - Enter / Space / ArrowDown on the trigger opens the menu and
 *     focuses the first item.
 *   - ArrowUp / ArrowDown on items cycles focus.
 *   - Home / End jump to first/last.
 *   - Escape closes and returns focus to the trigger.
 *   - Tab from inside the menu closes and lets focus continue naturally
 *     (no focus trap — this is a nav, not a modal).
 */
function NavDropdown({
  label,
  matchPrefixes,
  items,
}: {
  label: string;
  matchPrefixes: string[];
  items: { href: string; label: string; description?: string }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = matchPrefixes.some((p) => pathMatchesPrefix(pathname, p));

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }, [cancelClose]);

  // Click outside + Escape to close.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Cleanup any pending close timer on unmount.
  useEffect(() => () => cancelClose(), [cancelClose]);

  function focusItem(index: number) {
    const items = menuRef.current?.querySelectorAll<HTMLAnchorElement>(
      'a[role="menuitem"]'
    );
    if (!items || items.length === 0) return;
    const wrapped = (index + items.length) % items.length;
    items[wrapped].focus();
  }

  function onTriggerKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      // Focus first item on next paint so the menu is mounted.
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(-1));
    }
  }

  function onMenuKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>('a[role="menuitem"]') ?? []
    );
    if (items.length === 0) return;
    const idx = items.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(idx + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(idx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(items.length - 1);
    } else if (e.key === "Tab") {
      // Let focus leave naturally; just close the menu.
      setOpen(false);
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
          isActive ? "text-burgundy-700" : "text-navy-700 hover:text-burgundy-600"
        }`}
      >
        {label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[16rem] rounded-md border border-border bg-cream shadow-lg py-2"
        >
          {items.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-navy-700 hover:bg-burgundy-100 hover:text-burgundy-700 focus:bg-burgundy-100 focus:text-burgundy-700 focus:outline-none transition-colors"
            >
              <div className="font-medium">{c.label}</div>
              {c.description && (
                <div className="mt-0.5 text-xs text-ink/60">{c.description}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Expandable Free Resources group inside the mobile hamburger menu.
 * Renders a disclosure button (label + chevron) that toggles the
 * indented child links. Auto-expands when the current page is one of
 * the children's routes so the active branch is visible by default.
 */
function MobileNavGroup({
  label,
  matchPrefixes,
  items,
  onItemClick,
}: {
  label: string;
  matchPrefixes: string[];
  items: { href: string; label: string; description?: string }[];
  onItemClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = matchPrefixes.some((p) => pathMatchesPrefix(pathname, p));
  const [expanded, setExpanded] = useState(isActive);
  const sectionId = `mobile-nav-group-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={sectionId}
        onClick={() => setExpanded((v) => !v)}
        className={`w-full inline-flex items-center justify-between rounded-md px-3 py-2 text-base font-medium hover:bg-burgundy-100 ${
          isActive ? "text-burgundy-700" : "text-navy-700"
        }`}
      >
        <span>{label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {expanded && (
        <div id={sectionId} className="mt-1 ml-4 flex flex-col gap-1 border-l border-border pl-3">
          {items.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              onClick={onItemClick}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy-700 hover:bg-burgundy-100"
            >
              <div className="font-medium">{c.label}</div>
              {c.description && (
                <div className="mt-0.5 text-xs text-ink/60">{c.description}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Default site header used when adMode is false. Pulled into its own
// function (rather than inline JSX) so the Suspense boundary in
// <SiteHeader /> can fall back to the full nav during prerender.
function FullHeader() {
  const [open, setOpen] = useState(false);
  const closeMobile = () => setOpen(false);

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
            {navItems.map((item) => {
              if (item.type === "dropdown") {
                return (
                  <NavDropdown
                    key={item.label}
                    label={item.label}
                    matchPrefixes={item.matchPrefixes}
                    items={item.children}
                  />
                );
              }
              return item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-navy-700 hover:text-burgundy-600 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-navy-700 hover:text-burgundy-600 transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
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
            {navItems.map((item) => {
              if (item.type === "dropdown") {
                return (
                  <MobileNavGroup
                    key={item.label}
                    label={item.label}
                    matchPrefixes={item.matchPrefixes}
                    items={item.children}
                    onItemClick={closeMobile}
                  />
                );
              }
              return item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-base font-medium text-navy-700 hover:bg-burgundy-100"
                  onClick={closeMobile}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-base font-medium text-navy-700 hover:bg-burgundy-100"
                  onClick={closeMobile}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-2 w-full">
              <Link href="/work-with-ryan" onClick={closeMobile}>
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
