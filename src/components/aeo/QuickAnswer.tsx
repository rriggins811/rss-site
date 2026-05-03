type Props = {
  /** The 40-60 word direct answer AI search engines pull. */
  answer: string;
  /** Short label above the answer, e.g. "How wholesalers target seniors". */
  topic: string;
  className?: string;
};

/**
 * Visually distinct "instant answer" box rendered immediately below
 * the H1 on any page that wants AI-citation-friendly framing.
 *
 * Carries Schema.org Answer microdata so AI search engines that
 * parse microdata (Perplexity, ChatGPT browse, Google AI Overviews)
 * have a structured signal alongside the text.
 */
export function QuickAnswer({ answer, topic, className = "" }: Props) {
  return (
    <div
      itemScope
      itemType="https://schema.org/Answer"
      className={`rounded-r-md border-l-4 border-burgundy-600 bg-cream/70 px-5 py-5 sm:px-6 sm:py-6 ${className}`}
    >
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-burgundy-600">
        Quick answer · {topic}
      </p>
      <p
        itemProp="text"
        className="mt-2 text-base sm:text-lg leading-relaxed text-ink/90"
      >
        {answer}
      </p>
    </div>
  );
}
