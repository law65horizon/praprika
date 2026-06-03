import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestName, guestPhone, guestEmail, date, time, partySize, zone, holdingFeeAcknowledged, holdingFeeAmount, specialRequests } = body;

    if (!guestName || !guestPhone || !date || !time || !partySize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const doc = await sanityWriteClient.create({
      _type: "reservation",
      guestName,
      guestPhone,
      guestEmail: guestEmail || "",
      date,
      time,
      partySize: Number(partySize),
      zone,
      holdingFeeAcknowledged: holdingFeeAcknowledged || false,
      holdingFeeAmount: holdingFeeAmount || 0,
      specialRequests: specialRequests || "",
      status: "pending",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: doc._id });
  } catch (err) {
    console.error("Reservation creation error:", err);
    return NextResponse.json({ error: "Failed to submit reservation" }, { status: 500 });
  }
}
