import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoldRule } from "@/components/site/GoldRule";
import { SocialLinks } from "@/components/site/SocialLinks";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbListSchema, localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact Ryan",
  description:
    "Text, call, email, or book a free 20-minute call with Ryan Riggins. Senior transition advisor serving Greensboro and the NC Triad.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const breadcrumbs = breadcrumbListSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <main>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={breadcrumbs} />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="bg-burgundy-100 text-burgundy-700 border-0">
              Contact
            </Badge>
            <h1 className="mt-6">Let&rsquo;s talk.</h1>
            <p className="mt-6 max-w-prose text-lg text-ink/80">
              Easiest path is the free 20-minute call. No pressure, no upsells. You
              bring the situation, I&rsquo;ll give you straight answers — whether or
              not you ever work with me again.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/work-with-ryan">Book your free 20-minute call</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl shadow-navy-900/10">
            <Image
              src="/photos/contact_office_hero.jpg"
              alt="Professional office ready for a family consultation"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="bg-white border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <GoldRule />
          <h2 className="mt-3">Three ways to reach me.</h2>
          <p className="mt-4 max-w-prose text-lg text-ink/80">
            Pick whatever feels right for where you are right now.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Book a call</CardTitle>
                <CardDescription>
                  20 minutes, free, on my calendar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-ink/80 mb-6">
                  Best if you want real answers to a specific situation. Most common
                  starting point.
                </p>
                <Button asChild className="w-full">
                  <Link href="/work-with-ryan">Book free call</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Text me</CardTitle>
                <CardDescription>Quick questions, fastest reply.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-ink/80 mb-6">
                  Same number for text and voice. I read every message myself, not an
                  assistant.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="sms:+13365538933">(336) 553-8933</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Email</CardTitle>
                <CardDescription>For documents or longer context.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-ink/80 mb-6">
                  Attach whatever helps. I reply within one business day.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:ryan@rigginsstrategicsolutions.com">
                    Email Ryan
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* OR SEND A MESSAGE */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">Or send me a message.</h2>
          <p className="mt-3 text-ink/80 max-w-prose">
            If the form&rsquo;s easier than a call right now, use this. Ryan
            reads every message himself.
          </p>
          <div className="mt-8">
            <ContactForm source="website-contact" tag="website-contact-form" />
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <GoldRule />
          <h2 className="mt-3">Where I work.</h2>
          <div className="mt-6 space-y-5 text-lg text-ink/85 leading-relaxed max-w-prose">
            <p>
              Everything RSS builds is national. The Blueprint, SeniorSafe, the
              books, the podcast, the daily content. Any family in any state can use
              these tools. That was the whole point of building them.
            </p>
            <p>
              I do carry a North Carolina real estate license (#361546 with eXp
              Realty), but I don&rsquo;t work as a traditional listing agent. My role
              with families is the transition itself. The hard conversations, the
              plan, the cleanout, the move, the family coordination, the paperwork
              nobody warned you about. That&rsquo;s where I&rsquo;m useful.
            </p>
            <p>
              When it&rsquo;s time to actually list or buy, I match you with a vetted
              agent who specializes in working with seniors. In the Triad and across
              North Carolina, that&rsquo;s a trusted partner or someone in my eXp
              network. Outside NC, I coordinate through a national referral network
              of agents who get this work. Either way: the right person in the right
              role, and no family stuck with a transactional agent who doesn&rsquo;t
              understand what&rsquo;s really going on.
            </p>
          </div>
        </div>
      </section>

      {/* FOLLOW / CONNECT */}
      <section className="bg-white border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <GoldRule />
          <h2 className="mt-3 text-2xl md:text-3xl">Follow along.</h2>
          <p className="mt-3 text-ink/80 max-w-prose">
            Short-form education, client stories, and the occasional rant about
            what families should watch out for.
          </p>
          <SocialLinks className="mt-6 text-navy-700" />
        </div>
      </section>
    </main>
  );
}
