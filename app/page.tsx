import { sanityClient } from "@/lib/sanityClient";
import HomeClient from "@/components/HomeClient";
import type { MenuItem } from "@/lib/types";

// ─── Sanity queries ───────────────────────────────────────────────────────────
const FEATURED_QUERY = `*[_type == "menuItem" && featured == true][0...6]{
  _id, name, description, price, featured, available,
  image{ asset->{ _ref, url } },
  category->{ name, emoji }
}`;

const EVENT_QUERY = `*[_type == "event" && isFeatured == true] | order(date asc)[0]{
  title, date, time, description, tag
}`;

const PACKAGES_QUERY = `*[_type == "packageBooking"] | order(_createdAt asc)[0...1]`;

export const revalidate = 60;

export default async function HomePage() {
  const [featuredItems, nextEvent] = await Promise.all([
    sanityClient.fetch<MenuItem[]>(FEATURED_QUERY),
    sanityClient.fetch<{title:string;date:string;time:string;description:string;tag:string} | null>(EVENT_QUERY),
  ]);

  return <HomeClient featuredItems={featuredItems ?? []} nextEvent={nextEvent} />;
}
