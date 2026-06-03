import { defineField, defineType } from "sanity";

export const eventSchema = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Event Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "date", title: "Date", type: "date", validation: (R) => R.required() }),
    defineField({ name: "time", title: "Time", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "isFeatured", title: "Show on Homepage", type: "boolean", initialValue: true }),
    defineField({ name: "image", title: "Event Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "tag", title: "Tag (e.g. Live Band, DJ Night)", type: "string" }),
  ],
  preview: {
    select: { title: "title", date: "date", featured: "isFeatured" },
    prepare({ title, date, featured }) {
      return { title: `${featured ? "⭐ " : ""}${title}`, subtitle: date };
    },
  },
});
