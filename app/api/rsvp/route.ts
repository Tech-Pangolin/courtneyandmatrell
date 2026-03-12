import { NextResponse } from "next/server";
import { connectMongo } from "../../../lib/mongodb";
import { RsvpModel } from "../../../models/Rsvp";

export async function POST(request: Request) {
  await connectMongo();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, attendees, rsvpStatus, note } = body as {
    name?: string;
    email?: string;
    phone?: string;
    attendees?: number;
    rsvpStatus?: "attending" | "not_attending";
    note?: string;
  };

  const inviteCode = process.env.INVITE_ACCESS_CODE || "";

  if (!inviteCode || !name || !rsvpStatus) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const doc = await RsvpModel.create({
      inviteCode,
      name,
      email,
      phone,
      attendees: typeof attendees === "number" ? attendees : 1,
      rsvpStatus,
      note,
    });

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
  } catch (err) {
    console.error("Error creating RSVP", err);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}

