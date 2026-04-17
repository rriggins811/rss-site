"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  source?: string;
  tag?: string;
  className?: string;
};

export function ContactForm({
  source = "website-contact",
  tag = "website-contact-form",
  className = "",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/webhook/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first,
          last_name: last || undefined,
          email,
          phone: phone || undefined,
          message,
          source,
          tag,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Something went wrong. Try again.");
        return;
      }
      trackEvent("contact_form_submit", { source });
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-lg bg-white border border-gold-300 p-8 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="font-serif text-2xl text-navy-700">
          Message sent. Thanks, {first || "there"}.
        </div>
        <p className="mt-3 text-ink/80 leading-relaxed">
          Ryan reads every message himself. You&rsquo;ll hear back within one
          business day.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-lg bg-white border border-border p-6 md:p-8 shadow-sm ${className}`}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="c-first">First name *</Label>
          <Input
            id="c-first"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            disabled={submitting}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="c-last">Last name</Label>
          <Input
            id="c-last"
            name="last_name"
            type="text"
            autoComplete="family-name"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            disabled={submitting}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div>
          <Label htmlFor="c-email">Email *</Label>
          <Input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="c-phone">Phone (optional)</Label>
          <Input
            id="c-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting}
            className="mt-2"
            placeholder="(336) 555-0100"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="c-message">What&rsquo;s going on? *</Label>
        <Textarea
          id="c-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          className="mt-2"
          placeholder="A few sentences on the situation and where you are right now."
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-burgundy-700" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send message"}
      </Button>

      <p className="mt-3 text-xs text-ink/60 text-center">
        Ryan reads every message himself. One business day reply.
      </p>
    </form>
  );
}
