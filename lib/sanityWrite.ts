import { createClient } from "@sanity/client";

export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
