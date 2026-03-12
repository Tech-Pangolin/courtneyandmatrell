import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectMongo } from "../../../../lib/mongodb";
import { RsvpModel } from "../../../../models/Rsvp";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectMongo();
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, phone, attendees } = body as {
    email?: string;
    phone?: string;
    attendees?: number;
  };

  const update: Record<string, unknown> = {};
  if (typeof email === "string") update.email = email.trim() || undefined;
  if (typeof phone === "string") update.phone = phone.trim() || undefined;
  if (typeof attendees === "number" && attendees >= 0) update.attendees = attendees;

  try {
    const doc = await RsvpModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error("Error updating RSVP", err);
    return NextResponse.json({ error: "Failed to update RSVP" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectMongo();
  const { id } = await context.params;
  try {
    const res = await RsvpModel.findByIdAndDelete(id).lean();
    if (!res) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting RSVP", err);
    return NextResponse.json({ error: "Failed to delete RSVP" }, { status: 500 });
  }
}

