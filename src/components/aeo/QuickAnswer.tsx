type Props = {
  /** The 40-60 word direct answer AI search engines pull. */
  answer: string;
  /** Short label above the answer, e.g. "How wholesalers target seniors". */
  topic: string;
  /**
   * Optional explicit question. When present, wraps the block in
   * Schema.org Question microdata with acceptedAnswer pointing at the
   * inner Answer scope. Use on top-of-funnel landing pages where the
   * literal user intent ("What is X?", "How do I Y?") is the page topic.
   */
  question?: string;
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
export function QuickAnswer({ answer, topic, question, className = "" }: Props) {
  const wrapperClass = `aeo-answer-box rounded-r-md border-l-4 border-burgundy-600 bg-cream/70 px-5 py-5 sm:px-6 sm:py-6 ${className}`;

  if (question) {
    return (
      <div itemScope itemType="https://schema.org/Question" className={wrapperClass}>
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-burgundy-600">
          Quick answer · {topic}
        </p>
        <p itemProp="name" className="mt-2 font-serif text-lg sm:text-xl leading-snug text-navy-700">
          {question}
        </p>
        <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
          <p itemProp="text" className="mt-2 text-base sm:text-lg leading-relaxed text-ink/90">
            {answer}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div itemScope itemType="https://schema.org/Answer" className={wrapperClass}>
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-burgundy-600">
        Quick answer · {topic}
      </p>
      <p itemProp="text" className="mt-2 text-base sm:text-lg leading-relaxed text-ink/90">
        {answer}
      </p>
    </div>
  );
}
