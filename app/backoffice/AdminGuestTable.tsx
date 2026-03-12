"use client";

import { useState } from "react";

type RsvpRow = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: "attending" | "not_attending";
  attendees?: number;
  note?: string;
  createdAt?: string;
};

interface AdminGuestTableProps {
  initialRsvps: RsvpRow[];
}

export function AdminGuestTable({ initialRsvps }: AdminGuestTableProps) {
  const [rsvps, setRsvps] = useState<RsvpRow[]>(initialRsvps);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalAttending = rsvps
    .filter((r) => r.rsvpStatus === "attending")
    .reduce((sum, r) => sum + (r.attendees || 0), 0);

  const handleFieldChange = (id: string, field: keyof RsvpRow, value: string | number) => {
    setRsvps((prev) =>
      prev.map((r) => (r._id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveRow = async (row: RsvpRow) => {
    setSavingId(row._id);
    try {
      const res = await fetch(`/api/rsvp/${row._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: row.email ?? "",
          phone: row.phone ?? "",
          attendees:
            typeof row.attendees === "number"
              ? Math.max(0, Math.min(999, row.attendees))
              : 0,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      const updated = (await res.json()) as any;
      setRsvps((prev) =>
        prev.map((r) => (r._id === row._id ? { ...r, ...updated, _id: r._id } : r))
      );
    } catch (err) {
      console.error(err);
      // Optionally show toast
    } finally {
      setSavingId(null);
    }
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this RSVP? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsvp/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      setRsvps((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const exportCsv = () => {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Attendees",
      "Note",
      "CreatedAt",
    ];
    const rows = rsvps.map((r) => [
      r.name ?? "",
      r.email ?? "",
      r.phone ?? "",
      r.rsvpStatus ?? "",
      typeof r.attendees === "number" ? String(r.attendees) : "",
      r.note ?? "",
      r.createdAt ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((field) => {
            const s = String(field ?? "");
            if (s.includes('"') || s.includes(",") || s.includes("\n")) {
              return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "guest-list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-8">
      <div className="deco-card w-full px-4 py-4 sm:px-6 sm:py-6">
        <div>
          <h2 className="text-lg font-semibold text-ivory">Guest List</h2>
          <p className="mt-1 text-xs text-[rgba(247,231,206,0.78)]">
            Edit contact details inline, remove entries, or export your list.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[rgba(247,231,206,0.9)]">
            <thead className="border-b border-[rgba(247,231,206,0.2)] text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Attendees</th>
                <th className="px-3 py-2">Received</th>
                <th className="px-3 py-2 text-right align-top">
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(247,231,206,0.5)] bg-black px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[rgba(247,231,206,0.9)] shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition hover:border-[rgba(247,231,206,0.9)] hover:text-ivory"
                      onClick={exportCsv}
                    >
                      Export CSV
                    </button>
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-[rgba(247,231,206,0.12)] last:border-0"
                >
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">
                    <input
                      type="email"
                      className="w-full rounded-md border border-[rgba(247,231,206,0.3)] bg-black/40 px-2 py-1 text-xs text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)]"
                      value={r.email ?? ""}
                      onChange={(e) =>
                        handleFieldChange(r._id, "email", e.target.value)
                      }
                      onBlur={() => saveRow(r)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="tel"
                      className="w-full rounded-md border border-[rgba(247,231,206,0.3)] bg-black/40 px-2 py-1 text-xs text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)]"
                      value={r.phone ?? ""}
                      onChange={(e) =>
                        handleFieldChange(r._id, "phone", e.target.value)
                      }
                      onBlur={() => saveRow(r)}
                    />
                  </td>
                  <td className="px-3 py-2 capitalize">
                    {r.rsvpStatus === "attending" ? "Attending" : "Not attending"}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      className="w-20 rounded-md border border-[rgba(247,231,206,0.3)] bg-black/40 px-2 py-1 text-xs text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)]"
                      value={typeof r.attendees === "number" ? r.attendees : 0}
                      onChange={(e) =>
                        handleFieldChange(
                          r._id,
                          "attendees",
                          Number.isNaN(parseInt(e.target.value, 10))
                            ? 0
                            : parseInt(e.target.value, 10)
                        )
                      }
                      onBlur={() => saveRow(r)}
                    />
                  </td>
                  <td className="px-3 py-2 text-xs text-[rgba(247,231,206,0.7)]">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(255,99,132,0.7)] px-3 py-1 text-xs text-[rgba(255,161,181,0.9)] hover:bg-[rgba(255,99,132,0.15)]"
                      onClick={() => deleteRow(r._id)}
                      disabled={deletingId === r._id}
                    >
                      {deletingId === r._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-[rgba(247,231,206,0.18)] pt-4 text-sm text-[rgba(247,231,206,0.9)]">
          <p>
            <span className="font-semibold">Total confirmed attendees:</span>{" "}
            {totalAttending}
          </p>
        </div>

        {savingId && (
          <p className="mt-2 text-xs text-[rgba(247,231,206,0.7)]">
            Saving changes…
          </p>
        )}
      </div>
    </section>
  );
}

