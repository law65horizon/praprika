import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestName, guestPhone, tier, bottleChoice, platterChoice, eventDate, guestCount, occasion, totalAmount, specialRequests } = body;

    if (!guestName || !guestPhone || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const doc = await sanityWriteClient.create({
      _type: "packageBooking",
      guestName,
      guestPhone,
      tier,
      bottleChoice,
      platterChoice,
      eventDate,
      guestCount: Number(guestCount) || 0,
      occasion: occasion || "",
      totalAmount: Number(totalAmount) || 0,
      specialRequests: specialRequests || "",
      status: "inquiry",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: doc._id });
  } catch (err) {
    console.error("Package booking error:", err);
    return NextResponse.json({ error: "Failed to submit package booking" }, { status: 500 });
  }
}
