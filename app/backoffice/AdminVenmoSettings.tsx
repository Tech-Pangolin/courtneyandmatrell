"use client";

import { useEffect, useState } from "react";

export function AdminVenmoSettings() {
  const [venmoHandle, setVenmoHandle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings/venmo");
        if (!res.ok) return;
        const data = (await res.json()) as { venmoHandle?: string };
        if (data.venmoHandle) {
          setVenmoHandle(data.venmoHandle);
        }
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/venmo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venmoHandle }),
      });
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-10">
      <div className="deco-card w-full px-4 py-4 sm:px-6 sm:py-6">
        <h2 className="text-lg font-semibold text-ivory">A Toast From Afar · Venmo Settings</h2>
        <p className="mt-1 text-xs text-[rgba(247,231,206,0.78)]">
          Configure the Venmo handle guests will use when sending a toast.
        </p>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
              Venmo Handle
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
              placeholder="CoCoLLC"
              value={venmoHandle}
              onChange={(e) => setVenmoHandle(e.target.value)}
            />
            <p className="mt-1 text-[0.7rem] text-[rgba(247,231,206,0.65)]">
              Example: <span className="font-mono">CoCoLLC</span>. Do not include the @ symbol.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save Venmo Handle"}
            </button>
            {saved && (
              <span className="text-xs text-[rgba(247,231,206,0.8)]">
                Saved.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

