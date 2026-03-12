import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "cm_backoffice_session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password } = body as { username?: string; password?: string };

  const envUser = (process.env.BACKOFFICE_USERNAME || "").trim();
  const rawHash = process.env.BACKOFFICE_PASSWORD_HASH || "";
  const envHash = rawHash.trim().replace(/^"(.+)"$/, "$1");

  if (!envUser || !envHash) {
    return NextResponse.json({ error: "Backoffice credentials not configured" }, { status: 500 });
  }

  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  if (username !== envUser) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Support both bcrypt-hash and plain-text stored passwords to reduce setup friction.
  let ok = false;
  if (envHash.startsWith("$2a$") || envHash.startsWith("$2b$") || envHash.startsWith("$2y$")) {
    ok = await bcrypt.compare(password, envHash);
  } else {
    ok = password === envHash;
  }
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return res;
}

