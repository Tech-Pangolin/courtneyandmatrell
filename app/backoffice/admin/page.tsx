import { connectMongo } from "../../../lib/mongodb";
import { RsvpModel } from "../../../models/Rsvp";
import { AdminGuestTable } from "../AdminGuestTable";
import { AdminVenmoSettings } from "../AdminVenmoSettings";

export const dynamic = "force-dynamic";

export default async function BackofficeAdminPage() {
  await connectMongo();
  const rsvps = await RsvpModel.find().sort({ createdAt: -1 }).lean();

  const guestbook = rsvps.filter(
    (r) => r.rsvpStatus === "not_attending" && typeof r.note === "string" && r.note.trim()
  );

  const serializedRsvps = rsvps.map((r: any) => ({
    _id: r._id.toString(),
    name: r.name,
    email: r.email,
    phone: r.phone,
    rsvpStatus: r.rsvpStatus,
    attendees: r.attendees,
    note: r.note,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
  }));

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10">
      <h1 className="text-2xl font-semibold text-ivory">Back Office · Guests</h1>
      <p className="mt-2 text-sm text-[rgba(247,231,206,0.8)]">
        Review RSVP responses, totals, and notes from guests.
      </p>

      <AdminGuestTable initialRsvps={serializedRsvps} />

      <section className="mt-10">
        <div className="deco-card w-full px-4 py-4 sm:px-6 sm:py-6">
          <h2 className="text-lg font-semibold text-ivory">Guestbook · From Afar</h2>
          <p className="mt-1 text-xs text-[rgba(247,231,206,0.78)]">
            Notes from guests who can&apos;t be there in person.
          </p>

          {guestbook.length === 0 ? (
            <p className="mt-4 text-sm text-[rgba(247,231,206,0.7)]">
              No guestbook entries yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-4 text-sm text-[rgba(247,231,206,0.9)]">
              {guestbook.map((r: any) => (
                <li
                  key={r._id.toString()}
                  className="rounded-xl border border-[rgba(247,231,206,0.25)] bg-black/40 px-4 py-3"
                >
                  <p className="text-[rgba(247,231,206,0.95)]">{r.note}</p>
                  <p className="mt-2 text-xs text-[rgba(247,231,206,0.7)]">
                    — {r.name}
                    {r.email ? ` · ${r.email}` : ""}
                    {r.phone ? ` · ${r.phone}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <AdminVenmoSettings />
    </main>
  );
}

