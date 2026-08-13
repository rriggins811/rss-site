import localFont from "next/font/local";

/**
 * Fraunces, the warm display serif used for headlines on /the-roadmap,
 * /need-an-agent and /in-your-corner.
 *
 * SELF-HOSTED ON PURPOSE. This was next/font/google, which downloads font
 * files from Google at BUILD time, and it failed three production deploys:
 *
 *   Module not found: Can't resolve
 *   '@vercel/turbopack-next/internal/font/google/font'
 *     -> [next]/internal/font/google/fraunces_*.module.css
 *
 * 6dfb19d, 7a81e2a and 6cb4c37 all died that way, while 7a81e2a then built
 * cleanly on a plain redeploy of the identical SHA. Intermittent, and only
 * ever Fraunces: Inter and Lora have never failed once.
 *
 * The distinguishing factor is size of the generated stylesheet. Fraunces was
 * the only face requesting style: ["normal", "italic"], so three weights times
 * two styles across every unicode subset produced ~18 @font-face blocks, each
 * needing that internal module resolved. Inter and Lora request a single
 * style. Consolidating the three per-page declarations into one call site did
 * not help, because the count of call sites was never what was failing.
 *
 * Committing the files removes the build-time network dependency outright.
 * These are the two variable faces (roman and italic, latin subset), which
 * cover the whole 100-900 range in two files rather than six static instances,
 * so the generated CSS is a fraction of what it was.
 *
 * Fraunces is licensed under the SIL Open Font License 1.1, which permits
 * redistribution. Fetched from Google Fonts, v38.
 *
 * Consumers use `fraunces.className`, not a Tailwind utility. next/font emits
 * an unlayered class, whereas a Tailwind utility sits in @layer utilities and
 * loses to the unlayered `h1, h2, h3, h4 { font-family: var(--font-serif) }`
 * in globals.css, which silently renders these headlines in Lora.
 */
export const fraunces = localFont({
  src: [
    {
      path: "./fonts/Fraunces-Roman-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/Fraunces-Italic-latin.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});
