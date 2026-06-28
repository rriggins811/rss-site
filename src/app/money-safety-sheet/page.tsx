import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema } from "@/lib/schema";

const PDF_PATH = "/family-money-safety-sheet.pdf";
const TITLE = "Free Family Money Safety Sheet | Protect Your Parents From Scams";
const DESCRIPTION =
  "A free printable one-page sheet to protect your parents from phone and money scams: a family code word, who to call, the hard rules, and the line to memorize.";

export const metadata: Metadata = {
  // Site suffix is appended by the root layout title template.
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/money-safety-sheet" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/money-safety-sheet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function MoneySafetySheetPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "The Family Money Safety Sheet", path: "/money-safety-sheet" },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:py-24">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Free download
          </Badge>
          <h1 className="mt-6 leading-[1.05]">The Family Money Safety Sheet</h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed">
            A free one-page sheet that stops a scammer cold. Print it, fill it in
            with your family, and tape it by the phone. The code word, the two
            people to call before any money moves, the hard rules, and the one
            line everyone should memorize.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                data-track="download_resource"
                data-track-params='{"resource":"family-money-safety-sheet","source":"money_safety_sheet_landing"}'
              >
                Download the free sheet (PDF)
              </a>
            </Button>
          </div>
          <p className="mt-5 text-base text-ink/70">
            Want a hand building your family&apos;s?{" "}
            <Link
              href="/work-with-ryan"
              className="font-medium text-burgundy-600 underline underline-offset-4 hover:text-burgundy-700"
            >
              Book a free call.
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
