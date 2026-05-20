import { NextResponse } from "next/server";
import { connectMongo } from "../../../../lib/mongodb";
import { RsvpModel } from "../../../../models/Rsvp";

type RateEntry = {
  count: number;
  windowStart: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;

const rateMap = new Map<string, RateEntry>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  rateMap.set(ip, entry);

  return entry.count > RATE_LIMIT_MAX_ATTEMPTS;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  const ip =
    (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ found: false }, { status: 200 });
  }

  await connectMongo();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const contact = typeof (body as { contact?: unknown }).contact === "string"
    ? (body as { contact: string }).contact.trim()
    : "";

  if (!contact) {
    return NextResponse.json({ error: "Missing contact" }, { status: 400 });
  }

  const emailMatch = contact.includes("@");
  let docs;

  if (emailMatch) {
    const normalizedEmail = contact.toLowerCase();
    docs = await RsvpModel.find({
      email: { $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i") },
    })
      .select("name rsvpStatus attendees")
      .lean()
      .exec();
  } else {
    const digits = contact.replace(/\D/g, "");
    if (digits.length !== 10) {
      return NextResponse.json(
        { error: "Enter a valid email or 10-digit phone number." },
        { status: 400 }
      );
    }
    const withPhone = await RsvpModel.find({ phone: { $exists: true, $nin: [null, ""] } })
      .select("name rsvpStatus attendees phone")
      .lean()
      .exec();
    docs = withPhone.filter(
      (doc) => (doc.phone || "").replace(/\D/g, "") === digits
    );
  }

  if (!docs.length) {
    return NextResponse.json({ found: false }, { status: 200 });
  }

  return NextResponse.json({
    found: true,
    guests: docs.map((doc) => ({
      name: doc.name,
      rsvpStatus: doc.rsvpStatus,
      attendees: doc.attendees ?? 0,
    })),
  });
}
