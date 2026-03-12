import { NextResponse } from "next/server";
import { connectMongo } from "../../../../lib/mongodb";
import { SettingsModel } from "../../../../models/Settings";

export async function GET() {
  await connectMongo();
  let settings = await SettingsModel.findById("global").lean();

  if (!settings) {
    settings = await SettingsModel.create({ _id: "global" });
  }

  return NextResponse.json(
    { venmoHandle: settings.venmoHandle || "CoCoLLC" },
    { status: 200 }
  );
}

export async function PUT(request: Request) {
  await connectMongo();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { venmoHandle } = body as { venmoHandle?: string };
  if (typeof venmoHandle !== "string" || !venmoHandle.trim()) {
    return NextResponse.json({ error: "Invalid venmo handle" }, { status: 400 });
  }

  const raw = venmoHandle.trim();
  const normalized = raw.startsWith("@") ? raw.slice(1) : raw;

  const settings = await SettingsModel.findByIdAndUpdate(
    "global",
    { venmoHandle: normalized },
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json(
    { venmoHandle: settings?.venmoHandle || "CoCoLLC" },
    { status: 200 }
  );
}

