import { NextResponse } from "next/server";

export async function GET() {
  const name = process.env.VENUE_NAME || "";
  const address = process.env.VENUE_ADDRESS || "";

  if (!name && !address) {
    return NextResponse.json({ error: "Venue not configured" }, { status: 404 });
  }

  return NextResponse.json(
    {
      name,
      address,
    },
    { status: 200 }
  );
}

