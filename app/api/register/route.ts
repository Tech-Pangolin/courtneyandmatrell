import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "../../../lib/mongodb";
import { UserModel } from "../../../models/User";
import { appendGuestToSheet } from "../../../lib/googleSheets";

export async function POST(req: Request) {
  await connectMongo();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    rsvpStatus,
    guestCount,
    mealPreference,
  } = body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    rsvpStatus?: string;
    guestCount?: number;
    mealPreference?: string;
  };

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await UserModel.findOne({ email: normalizedEmail }).lean().exec();
  if (existing) {
    return NextResponse.json({ error: "Already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const doc = await UserModel.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    passwordHash,
    rsvpStatus: rsvpStatus === "not_attending" ? "not_attending" : "attending",
    guestCount: Number.isFinite(guestCount) ? guestCount : 1,
    mealPreference: mealPreference || "",
    inviteVerified: true,
  });

  const now = new Date();

  await appendGuestToSheet([
    now.toISOString(),
    doc.firstName,
    doc.lastName,
    doc.email,
    doc.rsvpStatus,
    doc.guestCount,
    doc.mealPreference,
    doc.inviteVerified ? "Yes" : "No",
    doc.emailVerified ? "Yes" : "No",
    now.toISOString(),
  ]);

  return NextResponse.json({ success: true });
}

