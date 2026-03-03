"use client";

import { useEffect, useRef, useState } from "react";

interface InviteCodeFormProps {
  onVerified: () => void;
}

export function InviteCodeForm({ onVerified }: InviteCodeFormProps) {
  const [digits, setDigits] = useState(["", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError(null);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < inputsRef.current.length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.some((d) => !d)) {
      setError("Please enter your full three‑digit code.");
      return;
    }

    const code = digits.join("");
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as { success?: boolean };

      if (data.success) {
        setWelcome(true);
        setTimeout(() => {
          onVerified();
        }, 700);
      } else {
        setError("This celebration is by invitation only. Please confirm your code.");
      }
    } catch {
      setError("This celebration is by invitation only. Please confirm your code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="deco-card invite-input mt-6 px-6 py-6 sm:px-8 sm:py-7">
      <p className="deco-heading text-xs tracking-[0.25em] text-[rgba(247,231,206,0.7)]">
        RSVP &amp; Private Entry
      </p>
      <h3 className="mt-3 text-lg font-semibold text-ivory">
        Enter your three‑digit invitation code
      </h3>
      <p className="mt-1 text-sm text-[rgba(247,231,206,0.7)]">
        Your code is printed on your save‑the‑date. One digit per box.
      </p>

      <div className="mt-5 flex items-center justify-start gap-4 sm:gap-5">
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="invite-input-field"
            value={digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`Invitation code digit ${index + 1}`}
          />
        ))}
      </div>

      <button
        type="submit"
        className="btn-primary mt-6 inline-flex items-center gap-2"
        disabled={submitting}
      >
        {submitting ? "Verifying…" : "Verify & Continue"}
      </button>

      {error && (
        <p className="mt-4 text-sm italic text-[rgba(247,231,206,0.75)] transition-opacity">
          {error}
        </p>
      )}

      {welcome && !error && (
        <p className="mt-4 text-sm sparkle-text italic">
          Welcome. The curtain rises…
        </p>
      )}
    </form>
  );
}

