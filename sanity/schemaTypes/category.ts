import { defineField, defineType } from "sanity";

export const categorySchema = defineType({
  name: "category",
  title: "Menu Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "timeRestriction",
      title: "Show During",
      type: "string",
      options: {
        list: [
          { title: "All Day", value: "both" },
          { title: "Daytime Only (10am–4pm)", value: "day" },
          { title: "Nighttime Only (4pm–close)", value: "night" },
        ],
      },
      initialValue: "both",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first in the menu",
      initialValue: 99,
    }),
    defineField({
      name: "emoji",
      title: "Emoji Icon",
      type: "string",
      description: "Single emoji to represent this category e.g. 🍲",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "timeRestriction", emoji: "emoji" },
    prepare({ title, subtitle, emoji }) {
      return { title: `${emoji ?? ""} ${title}`, subtitle };
    },
  },
});
