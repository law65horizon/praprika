export const PACKAGES = {
  silver: {
    name: "Silver",
    price: 45000,
    tagline: "The Perfect Night Out",
    includes: ["1 Premium Spirit", "4 Chasers", "1 Sharing Platter", "Reserved Table"],
    bottles: ["Hennessy VS", "Ciroc Original", "Jameson Black", "Jack Daniel's"],
    platters: ["Chicken Wings (12pcs)", "Spring Rolls & Samosa Mix", "Peppered Gizzard"],
    color: "from-zinc-400 to-zinc-600",
    emoji: "🥈",
  },
  gold: {
    name: "Gold",
    price: 85000,
    tagline: "Elevated Experience",
    includes: ["2 Premium Spirits", "6 Chasers", "2 Sharing Platters", "VIP Table", "Shisha (1 head)"],
    bottles: ["Hennessy VSOP", "Ciroc Apple", "Don Julio Blanco", "Grey Goose"],
    platters: ["Chicken Wings (20pcs)", "Mixed Grill Platter", "Calamari & Prawns", "Peppered Snail"],
    color: "from-amber-500 to-yellow-600",
    emoji: "🥇",
  },
  platinum: {
    name: "Platinum",
    price: 150000,
    tagline: "The Full Praprika Experience",
    includes: ["3 Premium Spirits", "Unlimited Chasers", "3 Sharing Platters", "VIP Booth", "Shisha (2 heads)", "Custom Decoration", "Birthday Cake (on request)"],
    bottles: ["Hennessy XO", "Moët & Chandon", "Don Julio 1942", "Belvedere", "D'Ussé VSOP"],
    platters: ["Full Mixed Grill", "Seafood Platter", "Wagyu Sliders", "Premium Cheese Board"],
    color: "from-violet-500 to-purple-700",
    emoji: "💎",
  },
} as const;

export type PackageTier = keyof typeof PACKAGES;

export const ZONE_HOLDING_FEES: Record<string, { label: string; fee: number; description: string }> = {
  vip_booth: { label: "VIP Booth (Band-Side)", fee: 15000, description: "Front-row to the live band. Our most sought-after seats." },
  standard: { label: "Standard Table", fee: 5000, description: "Comfortable dining in the main hall." },
  outdoor: { label: "Outdoor Terrace", fee: 5000, description: "Al fresco dining under the Asaba sky." },
  bar: { label: "Bar Seating", fee: 0, description: "Walk-in bar stools. No hold required." },
};
