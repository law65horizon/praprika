# Praprika Restaurant & Lounge — Web Application

A full-stack demo web application for **Praprika Restaurant and Lounge, Asaba**.
Built with **Next.js 15 (App Router)** + **Sanity Studio v5** (embedded).

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS v3, custom design tokens |
| CMS | Sanity Studio v5 (embedded at `/studio`) |
| Icons | Lucide React |
| Animation | Framer Motion |
| Fonts | Cormorant Garant (display) + DM Sans (body) |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Sanity project

```bash
npx sanity@latest init --bare
```

Copy your **Project ID** and **Dataset name** (use `production`).

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here
```

To get a write token:
- Go to [sanity.io/manage](https://sanity.io/manage)
- Select your project → API → Tokens
- Create a token with **Editor** permissions

### 4. Add CORS origin for localhost

In [sanity.io/manage](https://sanity.io/manage) → your project → API → CORS Origins:
- Add `http://localhost:3000`
- Check "Allow credentials"

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio)

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, event banner, feature cards |
| `/menu` | Time-aware menu with order cart + kitchen toggle demo |
| `/reservations` | SVG floor plan + zone selection + holding fee framing |
| `/packages` | 3-step VIP package customiser |
| `/studio` | Embedded Sanity Studio (CMS) |

---

## Key Features

### Day / Night Mode
- The nav toggle (Sun/Moon icon) switches the entire site between Day and Night mode
- Automatically detects real time: Day = 10am–4pm, Night = 4pm onwards
- Mode affects: colour palette, menu categories shown, copy, hero text, event banners

### Time-Aware Menu
- Day mode shows: Mains, Traditional, Combos, Small Plates, Desserts
- Night mode shows: Cocktails, Bottles, Small Plates, Grills, Desserts
- Items with `timeRestriction: "day"` or `"night"` only show in the relevant mode
- Orders saved to Sanity with guest name, phone, items, and status

### Kitchen Availability Toggle (Demo)
- Click the 👨‍🍳 Kitchen button on the menu page
- Toggle any item off — it disappears from the menu with an "Unavailable" badge
- In production: this lives in Sanity Studio as the `available` boolean field on `menuItem`

### SVG Floor Plan
- Interactive vector floor plan of the restaurant
- Zones: VIP Booth (Band-Side), Standard Table, Outdoor Terrace, Bar Seating
- Selecting a zone populates the holding fee acknowledgement

### Holding Fee Framing
- VIP Booth: ₦15,000 hold required
- Standard / Outdoor: ₦5,000 hold required
- Bar: no hold required
- Guest must acknowledge the fee before submitting
- Reservation + fee amount saved to Sanity

### Package Customiser (3-step)
- Step 1: Choose tier (Silver ₦45k / Gold ₦85k / Platinum ₦150k)
- Step 2: Select bottle + platter from tier-specific options
- Step 3: Enter contact details, occasion, guest count
- Booking saved to Sanity as `packageBooking` document

---

## Sanity Documents

| Schema | Purpose |
|---|---|
| `menuItem` | Menu items with `available` toggle (the kitchen feature) |
| `order` | Guest orders — name, phone, items, status |
| `reservation` | Table reservations with zone + holding fee |
| `packageBooking` | VIP package inquiries |
| `event` | Live music events for the homepage banner |

---

## Seeding Demo Menu Data

The menu page uses `lib/seedMenu.ts` — hardcoded demo items that work without Sanity.
To switch to live Sanity data, replace `SEED_MENU` import in `app/menu/page.tsx` with a
`sanityClient.fetch()` call using this GROQ query:

```groq
*[_type == "menuItem"] | order(category asc) {
  _id, name, description, price, category,
  timeRestriction, available, featured
}
```

---

## Deployment (Vercel)

```bash
npx vercel
```

Add the three environment variables in the Vercel project settings.
Add your Vercel domain to Sanity CORS origins.

---

## Pitch Notes

For the cold call demo, highlight:
1. **Day/Night toggle** — "Watch the whole site transform based on time of day"
2. **Kitchen toggle** — "Your staff can mark items unavailable from their phone, instantly"
3. **Floor plan** — "Customers pick exactly where they sit, and commit with a holding fee"
4. **Packages** — "No more WhatsApp back-and-forth for VIP bookings — it's all online"
5. **Sanity Studio** — "You control every menu item, price, and event from a clean dashboard"
# praprika
# praprika
