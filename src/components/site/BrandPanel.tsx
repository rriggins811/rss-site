/**
 * Type-forward brand panel, rendered in code rather than as an image.
 *
 * The Aug 10 visual direction bans stock photography and generated imagery,
 * and asks for original brand graphics in the RSS palette. The brand already
 * has a settled type treatment for exactly this, used across the Facebook
 * carousels and the Meet backgrounds: burgundy field, gold letterspaced
 * kicker, white serif display line, gold rule, and the license line set small
 * and quiet at the bottom.
 *
 * Those existing assets are all 1:1 or 4:5 with post-specific copy baked in
 * ("Link in comments"), so none of them drop into a page slot. Reproducing the
 * system in CSS is better than commissioning a raster anyway: it stays sharp
 * at any size, weighs nothing, reflows on mobile, and the words stay real text
 * that screen readers and crawlers can actually read.
 *
 * Swap to <Image> only if a slot ever needs genuine artwork rather than type.
 */

type Props = {
  /** Small gold line above the display text. Optional. */
  kicker?: string;
  /** The display line. Set in the serif face, this is the whole point. */
  heading: string;
  /** Supporting line under the gold rule. Optional. */
  sub?: string;
  /** Show the compliance line at the bottom. Defaults to true. */
  showLicense?: boolean;
  /** Aspect ratio utility, e.g. "aspect-square". Defaults to 4:3. */
  className?: string;
};

export function BrandPanel({
  kicker,
  heading,
  sub,
  showLicense = true,
  className,
}: Props) {
  return (
    <div
      className={`relative flex flex-col justify-center overflow-hidden rounded-xl bg-burgundy-700 px-8 py-12 text-center sm:px-12 ${
        className ?? "aspect-[4/3]"
      }`}
    >
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 sm:text-sm">
          {kicker}
        </p>
      ) : null}

      <p
        className={`font-serif leading-[1.15] text-cream text-3xl sm:text-4xl lg:text-5xl ${
          kicker ? "mt-4" : ""
        }`}
      >
        {heading}
      </p>

      {sub ? (
        <>
          <span
            aria-hidden
            className="mx-auto mt-6 block h-[3px] w-16 rounded bg-gold-300"
          />
          <p className="mt-6 text-lg font-semibold leading-relaxed text-gold-300 sm:text-xl">
            {sub}
          </p>
        </>
      ) : null}

      {/* The social graphics set the license line very faint. On the web it is
          a disclosure that has to stay readable, so it runs at an opacity that
          clears WCAG AA for small text rather than matching print exactly. */}
      {showLicense ? (
        <p className="absolute inset-x-0 bottom-5 text-[11px] text-cream/75">
          Ryan Riggins &middot; NC Real Estate License #361546 &middot; eXp Realty
        </p>
      ) : null}
    </div>
  );
}
