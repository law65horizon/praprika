import { defineField, defineType } from "sanity";

export const orderSchema = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({ name: "guestName", title: "Guest Name", type: "string" }),
    defineField({ name: "guestPhone", title: "Guest Phone", type: "string" }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "itemName", title: "Item", type: "string" },
            { name: "quantity", title: "Qty", type: "number" },
            { name: "price", title: "Unit Price (₦)", type: "number" },
          ],
          preview: {
            select: { title: "itemName", subtitle: "quantity" },
            prepare({ title, subtitle }) {
              return { title, subtitle: `Qty: ${subtitle}` };
            },
          },
        },
      ],
    }),
    defineField({ name: "totalAmount", title: "Total (₦)", type: "number" }),
    defineField({ name: "orderType", title: "Order Type", type: "string",
      options: { list: [
        { title: "Dine In", value: "dine_in" },
        { title: "Takeout", value: "takeout" },
        { title: "Delivery", value: "delivery" },
      ]},
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: [
        { title: "New", value: "new" },
        { title: "Confirmed", value: "confirmed" },
        { title: "In Kitchen", value: "in_kitchen" },
        { title: "Ready", value: "ready" },
        { title: "Completed", value: "completed" },
      ]},
      initialValue: "new",
    }),
    defineField({ name: "notes", title: "Special Notes", type: "text", rows: 2 }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
  orderings: [{ title: "Newest First", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { title: "guestName", subtitle: "totalAmount", status: "status" },
    prepare({ title, subtitle, status }) {
      const emoji = status === "new" ? "🆕" : status === "in_kitchen" ? "👨‍🍳" : status === "ready" ? "✅" : "📋";
      return { title: `${emoji} ${title}`, subtitle: `₦${subtitle?.toLocaleString()}` };
    },
  },
});
