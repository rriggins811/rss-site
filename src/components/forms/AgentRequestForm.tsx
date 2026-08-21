"use client";

import { useState } from "react";
import { CONVERSION_LABELS, fireGoogleAdsConversion } from "@/components/site/GoogleAdsTag";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "w-full rounded-md border border-cream-200 bg-white px-3.5 py-2.5 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";
const LABEL = "mb-1.5 block text-sm font-semibold text-navy";

export default function AgentRequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/agent-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again, or just call 336-553-8933.");
        setStatus("error");
        return;
      }
      setMsg(data.message ?? "Got it.");
      setStatus("sent");
      fireGoogleAdsConversion(CONVERSION_LABELS.agentRequest);
    } catch {
      setError("Something went wrong. Try again, or just call 336-553-8933.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border-2 border-gold bg-white p-8 text-center">
        <p className="font-serif text-2xl text-navy">{msg}</p>
        <p className="mt-3 text-ink/70">
          Nothing starts until you say so. If something changes before you hear from me,
          call or text <strong className="text-navy">336-553-8933</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-cream-200 bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="first_name">First name</label>
          <input id="first_name" name="first_name" required autoComplete="given-name" className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="last_name">
            Last name <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <input id="last_name" name="last_name" autoComplete="family-name" className={FIELD} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="phone">
            Phone <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={FIELD} />
        </div>
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="location">Where is the house?</label>
        <input id="location" name="location" placeholder="City and state is plenty" className={FIELD} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="timeline">Roughly when?</label>
          <select id="timeline" name="timeline" defaultValue="" className={FIELD}>
            <option value="">Not sure yet</option>
            <option value="now">We need to move on this now</option>
            <option value="3-6">3 to 6 months</option>
            <option value="6-12">6 to 12 months</option>
            <option value="exploring">Still just exploring</option>
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="offer">Has anyone made you an offer?</label>
          <select id="offer" name="offer" defaultValue="" className={FIELD}>
            <option value="">Select one</option>
            <option value="none">No</option>
            <option value="letters">A few letters or calls</option>
            <option value="pushing">Yes, someone is pushing</option>
            <option value="signed">Something is signed, or about to be</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={LABEL} htmlFor="notes">
          Anything else? <span className="font-normal text-ink/50">(optional)</span>
        </label>
        <textarea id="notes" name="notes" rows={3} className={FIELD} />
      </div>

      {error ? (
        <div role="alert" aria-live="assertive" className="mt-4 rounded-md border border-burgundy/30 bg-burgundy/5 p-3 text-sm text-burgundy">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-md bg-navy px-7 py-3.5 font-semibold text-cream transition hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send this to Ryan"}
      </button>
      <p className="mt-3 text-center text-sm text-ink/60">
        No obligation, and nothing starts until you say so.
      </p>
    </form>
  );
}
