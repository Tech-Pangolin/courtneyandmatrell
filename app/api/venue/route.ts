import { NextResponse } from "next/server";

export async function GET() {
  const name = process.env.VENUE_NAME || "";
  const address = process.env.VENUE_ADDRESS || "";
  const time = process.env.VENUE_TIME || "";

  if (!name && !address && !time) {
    return NextResponse.json({ error: "Venue not configured" }, { status: 404 });
  }

  return NextResponse.json(
    {
      name,
      address,
      time,
    },
    { status: 200 }
  );
}

