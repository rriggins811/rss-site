import type { JsonLdValue } from "@/lib/schema";

type Props = { data: JsonLdValue };

/**
 * Inline JSON-LD. Injects <script type="application/ld+json"> so crawlers and
 * LLMs get structured data without DOM overhead.
 *
 * Using JSON.stringify + dangerouslySetInnerHTML is the standard pattern for
 * JSON-LD in React. The input is a plain object, not user HTML.
 */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
