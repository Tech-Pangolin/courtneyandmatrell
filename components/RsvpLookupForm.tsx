"use client";

import { useState } from "react";

export type LookupGuest = {
  name: string;
  rsvpStatus: "attending" | "not_attending";
  attendees: number;
};

interface RsvpLookupFormProps {
  onSuccess: (guests: LookupGuest[]) => void;
  onBack: () => void;
}

export function RsvpLookupForm({ onSuccess, onBack }: RsvpLookupFormProps) {
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = contact.trim();
    if (!trimmed) {
      setError("Please enter the email or phone number you used when you RSVP’d.");
      return;
    }

    const isEmail = trimmed.includes("@");
    const digits = trimmed.replace(/\D/g, "");
    if (!isEmail && digits.length !== 10) {
      setError("Please enter a valid email address or 10-digit phone number.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: trimmed }),
      });

      const data = (await res.json()) as {
        found?: boolean;
        guests?: LookupGuest[];
        error?: string;
      };

      if (!res.ok) {
        setError(data.error || "We couldn’t look up your RSVP. Please try again.");
        return;
      }

      if (!data.found || !data.guests?.length) {
        setError(
          "We couldn’t find an RSVP with that email or phone. Check your entry or contact the couple."
        );
        return;
      }

      try {
        document.cookie = "cm_rsvp_venue=1; path=/; max-age=31536000; SameSite=Lax";
      } catch {
        // ignore
      }

      onSuccess(data.guests);
    } catch {
      setError("We couldn’t look up your RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="deco-card invite-input mt-6 px-6 py-6 sm:px-8 sm:py-7">
      <p className="deco-heading text-xs tracking-[0.25em] text-[rgba(247,231,206,0.7)]">
        Returning Guest
      </p>
      <h3 className="mt-3 text-lg font-semibold text-ivory">Confirm your RSVP</h3>
      <p className="mt-1 text-sm text-[rgba(247,231,206,0.7)]">
        Enter the email or phone number you used when you RSVP’d to view your confirmation and
        venue details.
      </p>

      <div className="mt-5">
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Email or phone
        </label>
        <input
          type="text"
          inputMode="email"
          autoComplete="email tel"
          className="mt-1 w-full min-w-0 rounded-lg border border-[rgba(17, 16, 14, 0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60 lg:min-w-[415px]"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            setError(null);
          }}
          placeholder="you@example.com or (555) 555-5555"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Looking up…" : "View venue information"}
        </button>
        <button
          type="button"
          className="text-sm text-[rgba(247,231,206,0.75)] underline-offset-2 hover:text-ivory hover:underline"
          onClick={onBack}
        >
          New guest? Enter invitation code
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm italic text-[rgba(247,231,206,0.82)]">{error}</p>
      )}
    </form>
  );
}

interface RsvpLookupSuccessProps {
  guests: LookupGuest[];
}

export function RsvpLookupSuccess({ guests }: RsvpLookupSuccessProps) {
  return (
    <div className="deco-card mt-6 px-6 py-7 sm:px-8">
      <h3 className="text-lg font-semibold sparkle-text">RSVP confirmed</h3>
      <p className="mt-2 text-sm text-[rgba(247,231,206,0.82)]">
        We found the following {guests.length === 1 ? "guest" : "guests"} on file. Venue details
        are shown above.
      </p>
      <ul className="mt-4 space-y-3 text-sm text-[rgba(247,231,206,0.9)]">
        {guests.map((guest, index) => (
          <li
            key={`${guest.name}-${index}`}
            className="rounded-lg border border-[rgba(247,231,206,0.2)] bg-black/30 px-4 py-3"
          >
            <span className="font-medium text-ivory">{guest.name}</span>
            <span className="mt-1 block text-[rgba(247,231,206,0.75)]">
              {guest.rsvpStatus === "attending"
                ? `Attending · ${guest.attendees} ${guest.attendees === 1 ? "guest" : "guests"}`
                : "Not attending"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
