import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestName, guestPhone, items, totalAmount, orderType, notes } = body;

    if (!guestName || !guestPhone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const doc = await sanityWriteClient.create({
      _type: "order",
      guestName,
      guestPhone,
      items,
      totalAmount,
      orderType: orderType || "dine_in",
      notes: notes || "",
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: doc._id });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
