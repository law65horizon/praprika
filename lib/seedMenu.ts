import type { MenuItem } from "./types";

export const SEED_MENU: MenuItem[] = [
  // Mains
  { _id: "m1", name: "Praprika Jollof Rice", description: "Party-style smoky jollof with your choice of protein", price: 4500, category: "mains", timeRestriction: "both", available: true, featured: true },
  { _id: "m2", name: "Grilled Tilapia", description: "Whole tilapia, peppered or plain, served with plantain and sauce", price: 6500, category: "mains", timeRestriction: "both", available: true },
  { _id: "m3", name: "Fried Rice & Chicken", description: "Nigerian-style fried rice with crispy fried chicken", price: 4800, category: "mains", timeRestriction: "both", available: true },

  // Traditional
  { _id: "t1", name: "Pounded Yam & Egusi", description: "Smooth pounded yam with rich egusi soup and assorted meat", price: 5500, category: "traditional", timeRestriction: "both", available: true, featured: true },
  { _id: "t2", name: "Ofe Akwu (Banga Soup)", description: "Delta-style banga soup with eba or fufu", price: 5200, category: "traditional", timeRestriction: "day", available: true },
  { _id: "t3", name: "Afang Soup & Semovita", description: "Rich Efik afang with tender assorted meat", price: 5800, category: "traditional", timeRestriction: "day", available: true },
  { _id: "t4", name: "Catfish Pepper Soup", description: "Hot and spicy point-and-kill pepper soup — the midnight special", price: 6800, category: "traditional", timeRestriction: "night", available: true, featured: true },

  // Combos
  { _id: "c1", name: "Corporate Express Combo", description: "Jollof rice + 1 protein + soft drink. In under 40 minutes.", price: 3500, category: "combos", timeRestriction: "day", available: true, featured: true },
  { _id: "c2", name: "Lunch Set — Continental", description: "Pasta or rice + salad + juice. Light and quick.", price: 3800, category: "combos", timeRestriction: "day", available: true },

  // Small Plates
  { _id: "sp1", name: "Chicken Wings (8pcs)", description: "Peppered, BBQ, or buffalo sauce", price: 3200, category: "small_plates", timeRestriction: "both", available: true, featured: true },
  { _id: "sp2", name: "Spring Rolls & Samosas", description: "6pcs of each, served with dipping sauce", price: 2800, category: "small_plates", timeRestriction: "both", available: true },
  { _id: "sp3", name: "Peppered Gizzard", description: "Slow-cooked, rich and spiced", price: 2500, category: "small_plates", timeRestriction: "both", available: true },
  { _id: "sp4", name: "Wagyu Sliders (3pcs)", description: "Premium wagyu patty, brioche bun, truffle aioli", price: 4500, category: "small_plates", timeRestriction: "night", available: true },

  // Grills
  { _id: "g1", name: "Mixed Grill Platter", description: "Beef suya, chicken, sausage & plantain on a sharing board", price: 9500, category: "grills", timeRestriction: "night", available: true, featured: true },
  { _id: "g2", name: "Peppered Snail", description: "Giant Congo snail, pepper sauce, served with toothpicks", price: 5500, category: "grills", timeRestriction: "night", available: true },

  // Cocktails
  { _id: "ck1", name: "Palm Wine Sangria", description: "House-infused palm wine, tropical fruits, prosecco", price: 3500, category: "cocktails", timeRestriction: "night", available: true, featured: true },
  { _id: "ck2", name: "Asaba Sunset", description: "Coconut rum, passion fruit, ginger beer, burnt orange", price: 3200, category: "cocktails", timeRestriction: "night", available: true },
  { _id: "ck3", name: "Delta Mule", description: "Vodka, fresh ginger, lime, and hibiscus", price: 2800, category: "cocktails", timeRestriction: "night", available: true },
  { _id: "ck4", name: "Virgin Zobo Cooler", description: "House-made hibiscus, cloves, ginger, mint — non-alcoholic", price: 1800, category: "cocktails", timeRestriction: "both", available: true },

  // Bottles
  { _id: "b1", name: "Hennessy VS (70cl)", description: "Served with ice bucket and 4 chasers", price: 28000, category: "bottles", timeRestriction: "night", available: true, featured: true },
  { _id: "b2", name: "Hennessy VSOP (70cl)", description: "Premium cognac, ice bucket, 4 chasers", price: 45000, category: "bottles", timeRestriction: "night", available: true },
  { _id: "b3", name: "Moët & Chandon (75cl)", description: "Chilled champagne, flutes, and strawberries", price: 38000, category: "bottles", timeRestriction: "night", available: true },
  { _id: "b4", name: "Ciroc Vodka (70cl)", description: "Any flavour, ice bucket, 4 chasers", price: 25000, category: "bottles", timeRestriction: "night", available: true },

  // Desserts
  { _id: "d1", name: "Puff Puff & Custard", description: "Nigerian puff puff, warm vanilla custard, dusted with sugar", price: 2200, category: "desserts", timeRestriction: "both", available: true },
  { _id: "d2", name: "Molten Lava Cake", description: "Dark chocolate, vanilla bean ice cream, raspberry coulis", price: 3800, category: "desserts", timeRestriction: "both", available: true, featured: true },
];
