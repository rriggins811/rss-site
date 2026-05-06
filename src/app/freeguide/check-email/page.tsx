import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Check your email | Simple Blueprint",
  description:
    "Check your inbox for the Simple Blueprint PDF and an activation link to your free account.",
  alternates: { canonical: "/freeguide/check-email" },
  robots: { index: false, follow: false },
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main>
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <Badge
            variant="secondary"
            className="bg-burgundy-100 text-burgundy-700 border-0"
          >
            Almost there
          </Badge>
          <h1 className="mt-6 leading-[1.05]">Check your email.</h1>
          <p className="mt-6 text-lg text-ink/85 leading-relaxed max-w-prose">
            {email ? (
              <>
                I just sent a message to <strong>{email}</strong>. It has the
                Simple Blueprint PDF and a button to activate your free account.
              </>
            ) : (
              <>
                I just sent you the Simple Blueprint PDF and a button to
                activate your free account.
              </>
            )}
          </p>

          <div className="mt-10 rounded-lg bg-white border border-border p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl text-navy-700">
              What to do next.
            </h2>
            <ol className="mt-4 space-y-3 text-ink/85 list-decimal list-inside">
              <li>Open the email I just sent (subject line starts &ldquo;Your Simple Blueprint is here&rdquo;).</li>
              <li>Read the PDF or save it for later.</li>
              <li>
                Click <strong>Activate my free account</strong>. You will set
                a password on the next screen.
              </li>
              <li>
                That same login also unlocks a 14-day trial of the SeniorSafe
                app on your phone.
              </li>
            </ol>

            <p className="mt-6 text-sm text-ink/70 leading-relaxed">
              Don&rsquo;t see it after a couple minutes? Check spam, then mark
              the email safe so the follow-ups get through. Outlook users:
              the email is from{" "}
              <strong>ryan@rigginsstrategicsolutions.com</strong>.
            </p>
          </div>

          <p className="mt-8 text-sm text-ink/70">
            Already activated?{" "}
            <a
              href="https://blueprint.rigginsstrategicsolutions.com/login"
              className="text-burgundy-600 hover:text-burgundy-700 underline underline-offset-2"
            >
              Log in here
            </a>
            .
          </p>

          <p className="mt-2 text-sm text-ink/70">
            <Link
              href="/"
              className="text-burgundy-600 hover:text-burgundy-700 underline underline-offset-2"
            >
              Back to home
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
