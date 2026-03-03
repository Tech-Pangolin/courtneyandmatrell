"use client";

import { useState } from "react";

interface RegistrationFormProps {
  inviteVerified: boolean;
}

export function RegistrationForm({ inviteVerified }: RegistrationFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not_attending">("attending");
  const [guestCount, setGuestCount] = useState(1);
  const [mealPreference, setMealPreference] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteVerified) {
      setError("Please confirm your invitation code before registering.");
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          rsvpStatus,
          guestCount,
          mealPreference,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      setSubmitted(true);
    } catch {
      setError("We weren’t able to complete your registration. Please try again.");
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
          Thank you for sharing this moment with us. A confirmation email will arrive shortly with
          your details and private venue information.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="deco-card mt-8 grid gap-5 px-6 py-6 sm:px-8 sm:py-7 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <p className="deco-heading text-xs tracking-[0.25em] text-[rgba(247,231,206,0.7)]">
          Registration
        </p>
        <h3 className="mt-3 text-lg font-semibold text-ivory">
          Tell us how you&apos;ll celebrate with us
        </h3>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          First Name
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Last Name
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Password
        </label>
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          RSVP
        </label>
        <div className="mt-2 flex gap-3 text-sm text-[rgba(247,231,206,0.86)]">
          <button
            type="button"
            className={`rounded-full px-3 py-1 ${
              rsvpStatus === "attending"
                ? "bg-[rgba(247,231,206,0.18)] text-ivory"
                : "bg-black/40 text-[rgba(247,231,206,0.7)]"
            }`}
            onClick={() => setRsvpStatus("attending")}
          >
            Joyfully accepts
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
            Regretfully declines
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Guest Count
        </label>
        <input
          type="number"
          min={0}
          max={10}
          className="mt-1 w-24 rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={guestCount}
          onChange={(e) => setGuestCount(parseInt(e.target.value || "0", 10))}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          Meal Preference
        </label>
        <input
          type="text"
          placeholder="Example: Beef, vegetarian, or chef’s choice"
          className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={mealPreference}
          onChange={(e) => setMealPreference(e.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
          A note to the couple (optional)
        </label>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share a favorite memory, a toast in the making, or a wish for the years ahead."
        />
      </div>

      <div className="md:col-span-2 flex flex-col items-start gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Submitting…" : "Complete Registration"}
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

