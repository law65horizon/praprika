import { defineField, defineType } from "sanity";

export const packageBookingSchema = defineType({
  name: "packageBooking",
  title: "Package Booking",
  type: "document",
  fields: [
    defineField({ name: "guestName", title: "Guest Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "guestPhone", title: "Phone Number", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "tier",
      title: "Package Tier",
      type: "string",
      options: {
        list: [
          { title: "Silver — ₦45,000", value: "silver" },
          { title: "Gold — ₦85,000", value: "gold" },
          { title: "Platinum — ₦150,000", value: "platinum" },
        ],
      },
    }),
    defineField({ name: "bottleChoice", title: "Bottle Selection", type: "string" }),
    defineField({ name: "platterChoice", title: "Platter Selection", type: "string" }),
    defineField({ name: "eventDate", title: "Preferred Date", type: "date" }),
    defineField({ name: "guestCount", title: "Number of Guests", type: "number" }),
    defineField({ name: "occasion", title: "Occasion", type: "string",
      options: { list: [
        { title: "Birthday", value: "birthday" },
        { title: "Bridal Shower", value: "bridal_shower" },
        { title: "Corporate Event", value: "corporate" },
        { title: "General Celebration", value: "celebration" },
        { title: "Date Night", value: "date_night" },
      ]},
    }),
    defineField({ name: "totalAmount", title: "Package Total (₦)", type: "number" }),
    defineField({ name: "specialRequests", title: "Special Requests", type: "text", rows: 3 }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: [
        { title: "Inquiry", value: "inquiry" },
        { title: "Confirmed", value: "confirmed" },
        { title: "Completed", value: "completed" },
        { title: "Cancelled", value: "cancelled" },
      ]},
      initialValue: "inquiry",
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
  preview: {
    select: { title: "guestName", tier: "tier", date: "eventDate" },
    prepare({ title, tier, date }) {
      const emoji = tier === "platinum" ? "💎" : tier === "gold" ? "🥇" : "🥈";
      return { title: `${emoji} ${title}`, subtitle: `${tier} — ${date}` };
    },
  },
});
