import { sanityClient } from "@/lib/sanityClient";
import MenuClient from "@/components/MenuClient";
import type { Category, MenuItem } from "@/lib/types";

const CATEGORIES_QUERY = `*[_type == "category"] | order(sortOrder asc){
  _id, name, slug, timeRestriction, sortOrder, emoji
}`;

const MENU_QUERY = `*[_type == "menuItem"]{
  _id, name, description, price, available, featured,
  image{ asset->{ _ref, url } },
  category->{ _id, name, slug, timeRestriction, sortOrder, emoji }
}`;

export const revalidate = 30;

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    sanityClient.fetch<Category[]>(CATEGORIES_QUERY),
    sanityClient.fetch<MenuItem[]>(MENU_QUERY),
  ]);

  return <MenuClient categories={categories ?? []} items={items ?? []} />;
}
