"use client";

import { useState } from "react";

export default function BackofficeLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/backoffice/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      window.location.href = "/backoffice/admin";
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4">
      <div className="deco-card w-full px-6 py-6 sm:px-8 sm:py-8">
        <h1 className="text-xl font-semibold text-ivory">Back Office</h1>
        <p className="mt-2 text-sm text-[rgba(247,231,206,0.8)]">
          Private access for the couple and planners.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
              Username
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </div>

          {error && (
            <p className="text-sm italic text-[rgba(247,231,206,0.82)]">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

