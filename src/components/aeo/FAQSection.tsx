import { JsonLd } from "@/components/site/JsonLd";
import { GoldRule } from "@/components/site/GoldRule";

export type FAQItem = { question: string; answer: string };

type Props = {
  items: FAQItem[];
  title?: string;
  /** Optional anchor id so callers can link to the section. */
  id?: string;
  /** Optional kicker line above the heading (e.g. "Common questions"). */
  kicker?: string;
};

/**
 * Visible Q+A list + matching FAQPage JSON-LD. The schema is
 * generated from the same `items` array used to render the JSX so
 * Google's "schema must match visible content" rule is enforced
 * structurally.
 */
export function FAQSection({
  items,
  title = "Frequently Asked Questions",
  id,
  kicker,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id={id} className="bg-sand border-y border-border">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <GoldRule />
        {kicker && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-burgundy-600">
            {kicker}
          </p>
        )}
        <h2 className="mt-3">{title}</h2>
        <div className="mt-10 space-y-8">
          {items.map((item) => (
            <div key={item.question}>
              <h3 className="font-serif text-xl text-navy-700">
                {item.question}
              </h3>
              <p className="mt-3 text-ink/80 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
