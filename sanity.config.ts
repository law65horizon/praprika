import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "praprika-studio",
  title: "Praprika Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Praprika")
          .items([
            S.listItem()
              .title("🍽️ Menu Categories")
              .child(S.documentTypeList("category")),
            S.listItem()
              .title("🥘 Menu Items")
              .child(S.documentTypeList("menuItem")),
            S.divider(),
            S.listItem()
              .title("📦 Orders")
              .child(
                S.documentTypeList("order").defaultOrdering([
                  { field: "submittedAt", direction: "desc" },
                ])
              ),
            S.listItem()
              .title("🪑 Reservations")
              .child(
                S.documentTypeList("reservation").defaultOrdering([
                  { field: "submittedAt", direction: "desc" },
                ])
              ),
            S.listItem()
              .title("🥂 Package Bookings")
              .child(
                S.documentTypeList("packageBooking").defaultOrdering([
                  { field: "submittedAt", direction: "desc" },
                ])
              ),
            S.divider(),
            S.listItem()
              .title("🎵 Events")
              .child(S.documentTypeList("event")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  basePath: '/studio'
});
