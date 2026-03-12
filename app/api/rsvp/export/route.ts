import { NextResponse } from "next/server";
import { connectMongo } from "../../../../lib/mongodb";
import { RsvpModel } from "../../../../models/Rsvp";

export async function GET() {
  await connectMongo();
  const rsvps = await RsvpModel.find().sort({ createdAt: -1 }).lean();

  const header = [
    "Name",
    "Email",
    "Phone",
    "Status",
    "Attendees",
    "Note",
    "CreatedAt",
  ];

  const rows = rsvps.map((r: any) => [
    r.name ?? "",
    r.email ?? "",
    r.phone ?? "",
    r.rsvpStatus ?? "",
    typeof r.attendees === "number" ? String(r.attendees) : "",
    r.note ?? "",
    r.createdAt ? new Date(r.createdAt).toISOString() : "",
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

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="guest-list.csv"',
    },
  });
}

