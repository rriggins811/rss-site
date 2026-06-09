"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the global site header on focused, chrome-free routes (currently the
 * /links link-in-bio hub). Everything else renders the header normally. The
 * footer is intentionally left global. SiteHeader is passed as children so it
 * stays server-rendered; this gate only decides whether to show it.
 */
const BARE_ROUTES = new Set(["/links"]);

export function SiteHeaderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && BARE_ROUTES.has(pathname)) return null;
  return <>{children}</>;
}
