"use client";

import { useEffect, useState } from "react";

interface RegistrationFormProps {
  inviteVerified: boolean;
  onAttendingConfirmed?: () => void;
  onVisible?: () => void;
  onSubmitted?: () => void;
}

export function RegistrationForm({
  inviteVerified,
  onAttendingConfirmed,
  onVisible,
  onSubmitted,
}: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [attendees, setAttendees] = useState(1);
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not_attending">("attending");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (inviteVerified && !fadeIn) {
      setFadeIn(true);
      onVisible?.();
    }
  }, [inviteVerified, fadeIn, onVisible]);

  const formatPhone = (digits: string) => {
    const d = digits.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteVerified) {
      setError("Please confirm your invitation code before registering.");
      return;
    }

    const trimmedName = name.trim();
    const nameValid = /^[A-Za-z' -]{2,}$/.test(trimmedName);
    const rawPhone = phoneDigits.replace(/\D/g, "");
    const hasEmail = !!email.trim();
    const hasPhone = rawPhone.length > 0;
    const phoneValid = !hasPhone || rawPhone.length === 10;
    const attendeesValid =
      rsvpStatus === "not_attending" || (Number.isFinite(attendees) && attendees >= 1);

    if (!trimmedName || !nameValid) {
      setError("Please enter your full name using letters only.");
      return;
    }

    if (rsvpStatus === "not_attending") {
      if (!hasEmail) {
        setError("Please enter an email address so we can recognize your RSVP.");
        return;
      }
    } else {
      if (!hasEmail && !hasPhone) {
        setError("Please enter an email address or a phone number.");
        return;
      }
      if (!phoneValid) {
        setError("Please enter a 10‑digit phone number.");
        return;
      }
    }
    if (!attendeesValid) {
      setError("Please enter the number of people attending.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: email.trim() || undefined,
          phone: hasPhone ? rawPhone : undefined,
          attendees: rsvpStatus === "attending" ? attendees : 0,
          rsvpStatus,
          note: note?.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      if (rsvpStatus === "attending") {
        // Remember attending RSVP in a simple cookie so the venue can be revealed automatically later.
        try {
          document.cookie =
            "cm_rsvp_attending=1; path=/; max-age=31536000; SameSite=Lax";
        } catch {
          // ignore cookie errors in non-browser environments
        }
        onAttendingConfirmed?.();
      }

      onSubmitted?.();
      setSubmitted(true);
    } catch {
      setError("We weren’t able to complete your RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!inviteVerified) {
    return (
      <div className="mt-6 text-sm text-[rgba(247,231,206,0.75)]">
        Once your invitation code is confirmed, your private registration form will appear here.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-8 deco-card px-6 py-7 sm:px-8">
        <h3 className="text-lg font-semibold sparkle-text">You’re in.</h3>
        <p className="mt-2 text-sm text-[rgba(247,231,206,0.82)]">
          Thank you for sharing this moment with us. Your RSVP details have been recorded and the location details have been revealed.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-8 grid gap-5 md:grid-cols-2 transition-opacity duration-700 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="md:col-span-2">
        <p className="deco-heading text-xs tracking-[0.25em] text-[rgba(247,231,206,0.7)]">
          RSVP Details
        </p>
        <h3 className="mt-3 text-lg font-semibold text-ivory">Tell us who&apos;s attending</h3>
      </div>

      <div className="md:col-span-2 mt-1">
        <p className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Attendance
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-sm text-[rgba(247,231,206,0.86)]">
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              rsvpStatus === "attending"
                ? "bg-[rgba(247,231,206,0.18)] text-ivory"
                : "bg-black/40 text-[rgba(247,231,206,0.7)]"
            }`}
            onClick={() => setRsvpStatus("attending")}
          >
            I will be attending
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              rsvpStatus === "not_attending"
                ? "bg-[rgba(247,231,206,0.18)] text-ivory"
                : "bg-black/40 text-[rgba(247,231,206,0.7)]"
            }`}
            onClick={() => setRsvpStatus("not_attending")}
          >
            I will not be attending
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Name
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Email
        </label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {rsvpStatus === "attending" && (
        <>
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
              Phone
            </label>
            <input
              type="tel"
              inputMode="tel"
              className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
              value={formatPhone(phoneDigits)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setPhoneDigits(digits.slice(0, 10));
              }}
              placeholder="(555) 555‑5555"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
              Number of Attendees
            </label>
            <input
              type="number"
              min={1}
              max={10}
              className="mt-1 w-24 rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
              value={attendees}
              onChange={(e) => {
                const n = parseInt(e.target.value || "1", 10);
                if (Number.isNaN(n)) {
                  setAttendees(1);
                } else {
                  setAttendees(Math.min(10, Math.max(1, n)));
                }
              }}
            />
          </div>
        </>
      )}

      {rsvpStatus === "not_attending" && (
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
            A note to the couple (optional)
          </label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Share your warm wishes or a note about why you can’t be there in person."
          />
        </div>
      )}

      <div className="md:col-span-2 flex flex-col items-center gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit RSVP"}
        </button>
        {error && (
          <p className="text-sm italic text-[rgba(247,231,206,0.82)]">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

