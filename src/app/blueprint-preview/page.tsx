import type { Metadata } from "next";
import { MODULES } from "@/lib/blueprint-modules";
import { MapCheckoutButton } from "@/components/blueprint-map/MapCheckoutButton";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    url: `https://rigginsstrategicsolutions.com/blueprint-preview`,
    siteName: "Riggins Strategic Solutions",
    images: ["https://rigginsstrategicsolutions.com/og/blueprint-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://rigginsstrategicsolutions.com/og/blueprint-preview.png"],
  },
  title: "The Senior Transition Blueprint Map, Free",
  description:
    "Watch the entire 20-module Senior Transition Blueprint explained, module by module, free. Video lessons, plain-English summaries, and starter tools.",
  alternates: { canonical: "/blueprint-preview" },
  // Sales/ad landing page. Kept out of search so it does not compete with the
  // main Blueprint pages; it is reached from ads and direct links.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const NAVY = "#1C3A52";
const MAROON = "#6B2C3E";
const GOLD = "#D4AF37";
const CREAM = "#FAF8F3";

export default async function BlueprintMapSalesPage({
  searchParams,
}: {
  searchParams: Promise<{ purchased?: string; canceled?: string }>;
}) {
  const sp = await searchParams;
  const justPurchased = sp.purchased === "1";
  const canceled = sp.canceled === "1";

  // Group modules by phase for the "what's inside" list.
  const phases: { phase: string; mods: typeof MODULES }[] = [];
  for (const m of MODULES) {
    const last = phases[phases.length - 1];
    if (last && last.phase === m.phase) last.mods.push(m);
    else phases.push({ phase: m.phase, mods: [m] });
  }

  return (
    <main
      style={{ background: CREAM, fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      className="min-h-screen text-[#1C3A52]"
    >
      {justPurchased && (
        <div
          className="px-6 py-4 text-center text-sm font-semibold"
          style={{ background: NAVY, color: CREAM }}
        >
          Thank you. Your private link to the Blueprint Map is on its way to your
          email right now. Check your inbox and spam over the next couple of
          minutes.
        </div>
      )}
      {canceled && (
        <div className="px-6 py-3 text-center text-sm" style={{ background: "#f3ece0" }}>
          Checkout canceled. No charge was made. The map is still here whenever
          you are ready.
        </div>
      )}

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
        <p
          className="m-0 mb-4 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: MAROON }}
        >
          The Senior Transition Blueprint
        </p>
        <h1
          className="m-0 text-3xl sm:text-4xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
        >
          See the entire system before you move your parent anywhere.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#1C3A52]/85">
          A senior move has 20 moving parts. Miss one and it can quietly cost
          your family $20,000 or more. This is the whole map, walked through,
          module by module, by someone who spent eight years on the other side
          of these deals.
        </p>
        <figure className="mx-auto mt-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/blueprint-map-graphic.png"
            alt="The Blueprint Map: the central plan and its 8 main branches (Start Here, Sort and Prep, Authority Money and Care, Sell and Move, Settle In, Your Action Plan, the navigator option, and the books), every step of a senior transition in order on one screen."
            width={1060}
            height={648}
            className="mx-auto h-auto w-full max-w-2xl rounded-xl border shadow-sm"
            style={{ borderColor: "rgba(28,58,82,0.12)" }}
          />
          <figcaption className="mt-3 text-sm text-[#1C3A52]/60">
            This is the map. Every step in order, on one screen.
          </figcaption>
        </figure>
        <div className="mt-9 flex justify-center">
          <MapCheckoutButton />
        </div>
        <p className="mt-3 text-sm text-[#1C3A52]/60">
          Free. Sign up with your email, no payment, no card.
        </p>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-3xl px-6 pb-4">
        <div
          className="grid gap-4 rounded-2xl border p-6 sm:grid-cols-2 sm:p-8"
          style={{ borderColor: "rgba(28,58,82,0.12)", background: "#ffffff" }}
        >
          {[
            ["20 video lessons", "A short, plain-English walkthrough of every module, start to finish."],
            ["The full mind map", "Click any of the 20 modules and see exactly how the pieces connect."],
            ["Plain-English summaries", "The key decision, the real numbers, and the common mistake, for each module."],
            ["Starter tools included", "The same essential checklists we hand out with the free guide, ready to use."],
          ].map(([title, body]) => (
            <div key={title} className="flex gap-3">
              <span
                aria-hidden
                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                style={{ background: GOLD }}
              />
              <div>
                <p className="m-0 font-semibold">{title}</p>
                <p className="m-0 text-sm text-[#1C3A52]/70">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's inside (the 20 modules) */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2
          className="m-0 mb-6 text-center text-2xl font-bold"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
        >
          What is inside the map
        </h2>
        <div className="space-y-6">
          {phases.map(({ phase, mods }) => (
            <div key={phase}>
              <p
                className="m-0 mb-2 text-xs font-semibold uppercase tracking-[0.14em]"
                style={{ color: MAROON }}
              >
                {phase}
              </p>
              <ul className="m-0 grid gap-x-6 gap-y-1 pl-0 list-none sm:grid-cols-2">
                {mods.map((m) => (
                  <li
                    key={m.id}
                    className="relative pl-5 text-sm text-[#1C3A52]/90 leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-[0.5em] h-1.5 w-1.5 rounded-full"
                      style={{ background: GOLD }}
                    />
                    Module {m.number}: {m.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Close */}
      <section className="mx-auto max-w-2xl px-6 pb-20 text-center">
        <div
          className="rounded-2xl px-6 py-10 sm:px-10"
          style={{ background: NAVY, color: CREAM }}
        >
          <h2
            className="m-0 text-2xl font-bold"
            style={{ fontFamily: "var(--font-lora), Georgia, serif", color: CREAM }}
          >
            The whole thing is free. The only cost is guessing.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[#FAF8F3]/85">
            Watch the videos, read the summaries, and decide what your family
            needs, before you make a single expensive decision.
          </p>
          <div className="mt-8 flex justify-center">
            <MapCheckoutButton />
          </div>
          <p className="mt-4 text-sm text-[#FAF8F3]/60">
            The done-for-you toolkit comes with it. All 69 tools, free.
          </p>
        </div>
        <p className="mt-8 text-xs text-[#1C3A52]/55">
          Ryan Riggins, NC Real Estate License #361546, eXp Realty. Riggins
          Strategic Solutions is an education and media company. This is not
          financial, tax, medical, or legal advice.
        </p>
      </section>
    </main>
  );
}
