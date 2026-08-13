import { Fraunces } from "next/font/google";

/**
 * Fraunces, the warm display serif used for headlines on /the-roadmap,
 * /need-an-agent and /in-your-corner.
 *
 * Declared here, once, and imported by those pages rather than instantiated in
 * each of them.
 *
 * next/font/google self-hosts the font files for visitors, but it downloads
 * them from Google at BUILD time. Every separate Fraunces() call was its own
 * build-time fetch, so a single unreachable fonts.gstatic.com failed the whole
 * deploy. That is what broke the two builds on Aug 12 2026:
 *
 *   Module not found: Can't resolve
 *   '@vercel/turbopack-next/internal/font/google/font'
 *     -> [next]/internal/font/google/fraunces_96df58ee.module.css
 *
 * Commit 7a81e2a failed that way and then built cleanly on a plain redeploy of
 * the identical SHA, which is what identifies it as a network flake rather
 * than a code fault. One call site is one fetch.
 *
 * Consumers use `fraunces.className`, not a Tailwind utility. next/font emits
 * an unlayered class, whereas a Tailwind utility sits in @layer utilities and
 * loses to the unlayered `h1, h2, h3, h4 { font-family: var(--font-serif) }`
 * in globals.css, which silently renders these headlines in Lora.
 */
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
