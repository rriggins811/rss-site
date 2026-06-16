"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the global site header on focused, chrome-free routes: the /links
 * link-in-bio hub, and the /g/* warm-funnel ad landing + delivery pages
 * (one guide, one action, no nav to leak clicks). Everything else renders
 * the header normally. The footer is intentionally left global. SiteHeader
 * is passed as children so it stays server-rendered; this gate only decides
 * whether to show it.
 */
const BARE_ROUTES = new Set(["/links"]);
const BARE_PREFIXES = ["/g/"];

export function SiteHeaderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && BARE_ROUTES.has(pathname)) return null;
  if (pathname && BARE_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <>{children}</>;
}
