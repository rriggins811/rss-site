"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  source?: string;
  className?: string;
};

export function StarterGuideForm({
  source = "website-freeguide",
  className = "",
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/webhook/starter-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first,
          last_name: last || undefined,
          email,
          phone: phone || undefined,
          source,
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
      trackEvent("lead_magnet_download", { source });
      // Redirect to the dedicated check-email page so the activation flow
      // is the obvious next step.
      router.push(
        `/freeguide/check-email?email=${encodeURIComponent(email)}`
      );
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
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
          <Label htmlFor="sg-first">First name *</Label>
          <Input
            id="sg-first"
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
          <Label htmlFor="sg-last">Last name</Label>
          <Input
            id="sg-last"
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

      <div className="mt-4">
        <Label htmlFor="sg-email">Email *</Label>
        <Input
          id="sg-email"
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

      <div className="mt-4">
        <Label htmlFor="sg-phone">Phone (optional)</Label>
        <Input
          id="sg-phone"
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
        {submitting ? "Sending..." : "Send me the Simple Blueprint"}
      </Button>

      <p className="mt-3 text-xs text-ink/60 text-center">
        Plain-English PDF. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
