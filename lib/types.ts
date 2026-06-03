export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  timeRestriction: "both" | "day" | "night";
  sortOrder: number;
  emoji?: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: Category;
  image?: { asset: { _ref: string; url?: string } };
  available: boolean;
  featured?: boolean;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: { asset: { _ref: string; url?: string } };
}
