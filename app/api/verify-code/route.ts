import { NextResponse } from "next/server";
import crypto from "crypto";

type RateEntry = {
  count: number;
  windowStart: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

// Simple in-memory rate limit per IP for this endpoint.
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

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  const len = Math.max(aBuf.length, bBuf.length);
  const aPadded = Buffer.alloc(len);
  const bPadded = Buffer.alloc(len);
  aBuf.copy(aPadded);
  bBuf.copy(bPadded);

  return crypto.timingSafeEqual(aPadded, bPadded);
}

export async function POST(req: Request) {
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    // Return generic failure to avoid revealing rate limit state.
    return NextResponse.json({ success: false });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false });
  }

  const code = typeof (body as { code?: unknown }).code === "string" ? (body as { code: string }).code : "";

  const secret = process.env.INVITE_ACCESS_CODE || "";

  if (!secret || !code) {
    return NextResponse.json({ success: false });
  }

  const ok = timingSafeEqual(code, secret);

  return NextResponse.json({ success: ok });
}

