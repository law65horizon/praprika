import { defineField, defineType } from "sanity";

export const reservationSchema = defineType({
  name: "reservation",
  title: "Reservation",
  type: "document",
  fields: [
    defineField({ name: "guestName", title: "Guest Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "guestPhone", title: "Phone Number", type: "string", validation: (R) => R.required() }),
    defineField({ name: "guestEmail", title: "Email (optional)", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date", validation: (R) => R.required() }),
    defineField({ name: "time", title: "Time", type: "string", validation: (R) => R.required() }),
    defineField({ name: "partySize", title: "Party Size", type: "number", validation: (R) => R.required().positive() }),
    defineField({
      name: "zone",
      title: "Seating Zone",
      type: "string",
      options: {
        list: [
          { title: "VIP Booth (Band-Side) — ₦15,000 hold", value: "vip_booth" },
          { title: "Standard Table — ₦5,000 hold", value: "standard" },
          { title: "Outdoor Terrace — ₦5,000 hold", value: "outdoor" },
          { title: "Bar Seating — No hold required", value: "bar" },
        ],
      },
    }),
    defineField({ name: "holdingFeeAcknowledged", title: "Holding Fee Acknowledged", type: "boolean", initialValue: false }),
    defineField({ name: "holdingFeeAmount", title: "Holding Fee Amount (₦)", type: "number" }),
    defineField({ name: "specialRequests", title: "Special Requests", type: "text", rows: 3 }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: [
        { title: "Pending", value: "pending" },
        { title: "Confirmed", value: "confirmed" },
        { title: "Cancelled", value: "cancelled" },
        { title: "No Show", value: "no_show" },
        { title: "Completed", value: "completed" },
      ]},
      initialValue: "pending",
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
  preview: {
    select: { title: "guestName", date: "date", zone: "zone", status: "status" },
    prepare({ title, date, zone, status }) {
      const emoji = status === "confirmed" ? "✅" : status === "no_show" ? "👻" : "📅";
      return { title: `${emoji} ${title}`, subtitle: `${date} — ${zone}` };
    },
  },
});
