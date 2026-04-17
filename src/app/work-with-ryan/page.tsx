import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { EmailFallback } from "@/components/site/EmailFallback";
import { BOOKING_URL } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book a call with Ryan",
  description:
    "Book a free 30-minute call with Senior Transition Advisor Ryan Riggins. No listing pitch. No sales pressure. Straight answers on where you are and what's next.",
  alternates: { canonical: "/work-with-ryan" },
};

export default function WorkWithRyanPage() {
  return (
    <main>
      {/* HEADER */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
          <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
            Book a call
          </Badge>
          <h1 className="mt-6 leading-[1.05]">
            Book a 30-minute call with Ryan.
          </h1>
          <p className="mt-6 text-lg text-ink/80 leading-relaxed max-w-prose mx-auto">
            We&rsquo;ll walk through where you are, what&rsquo;s urgent, and
            what your next move is. This is not a listing pitch. Ryan is
            licensed but does not work as a traditional listing agent. The call
            is $0 and there&rsquo;s no sales pressure.
          </p>
        </div>
      </section>

      {/* BOOKING WIDGET */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="w-full overflow-hidden rounded-lg border border-border bg-white">
            <iframe
              src={BOOKING_URL}
              title="Book a 30-minute call with Ryan Riggins"
              className="block w-full"
              style={{ minHeight: "820px", border: 0 }}
              allow="payment *; fullscreen *"
            />
          </div>

          <div className="mt-6 flex justify-center">
            <EmailFallback align="center" />
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS */}
      <section className="bg-sand border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">What happens on the call.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="font-serif text-2xl text-gold-500">01</div>
              <h3 className="mt-2 font-serif text-xl text-navy-700">
                You tell me the situation.
              </h3>
              <p className="mt-3 text-ink/80 leading-relaxed">
                Who it&rsquo;s for. What&rsquo;s happening. Who&rsquo;s
                involved. I don&rsquo;t need every detail. The outline is
                enough.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="font-serif text-2xl text-gold-500">02</div>
              <h3 className="mt-2 font-serif text-xl text-navy-700">
                I give you straight answers.
              </h3>
              <p className="mt-3 text-ink/80 leading-relaxed">
                Is this urgent? Is there a $50K mistake in your path? What
                should you do this week versus next month? No spin.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="font-serif text-2xl text-gold-500">03</div>
              <h3 className="mt-2 font-serif text-xl text-navy-700">
                You decide what&rsquo;s next.
              </h3>
              <p className="mt-3 text-ink/80 leading-relaxed">
                Maybe it&rsquo;s a free resource. Maybe it&rsquo;s the
                Blueprint. Maybe it&rsquo;s nothing. Whatever you decide is
                fine.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
