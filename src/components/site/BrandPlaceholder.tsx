/**
 * Placeholder for a visual slot that is waiting on a real brand asset.
 *
 * Per the Aug 10 visual direction: no stock photography, nothing generated,
 * nothing pulled off the internet. Every non-photo slot on the homepage gets
 * an original brand graphic in the RSS palette, and imagery must not block the
 * build. This renders a type-forward panel in burgundy/gold/cream so the slot
 * reads as intentional brand design rather than a broken image, and labels
 * itself so whoever swaps in the final asset knows what belongs there.
 *
 * Replace with <Image> when the real asset lands. Deliberately NOT next/image:
 * pointing at a file that does not exist yet would 404 in production.
 *
 * Decorative by default (aria-hidden), because in every current slot the
 * surrounding copy already carries the meaning. Pass a `label` for the rare
 * case where the graphic itself is the content.
 */

type Props = {
  /** What belongs in this slot. Shown on screen while it is a placeholder. */
  slot: string;
  /** Optional aspect ratio class, e.g. "aspect-square". Defaults to 4:3. */
  className?: string;
  /** Accessible name. Omit to keep the panel decorative. */
  label?: string;
};

export function BrandPlaceholder({ slot, className, label }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-gold-500/40 bg-gradient-to-br from-burgundy-700 to-navy-700 ${
        className ?? "aspect-[4/3]"
      }`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {/* Gold rule motif, same as the section headers use. */}
      <div className="absolute left-8 top-8 h-1 w-14 rounded bg-gold-300" />
      <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
        <span className="font-serif text-2xl leading-tight text-cream">
          Riggins Strategic Solutions
        </span>
        <span className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
          Brand graphic
        </span>
        <span className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
          {slot}
        </span>
      </div>
    </div>
  );
}
