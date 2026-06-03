import { defineField, defineType } from "sanity";

export const menuItemSchema = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "price",
      title: "Price (₦)",
      type: "number",
      validation: (R) => R.required().positive(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "available",
      title: "Available Now",
      type: "boolean",
      description: "Toggle off to instantly remove from the live menu",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured Item",
      type: "boolean",
      description: "Show on homepage and highlight in menu",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      media: "image",
      available: "available",
    },
    prepare({ title, subtitle, media, available }) {
      return {
        title: `${available ? "✅" : "❌"} ${title}`,
        subtitle,
        media,
      };
    },
  },
});
