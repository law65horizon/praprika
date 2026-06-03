"use client";

import Link from "next/link";
import Image from "next/image";
import { useTimeMode } from "@/components/TimeModeProvider";
import { MapPin, Phone, Clock, ChevronRight, Music, Star } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { PACKAGES } from "@/lib/packages";

interface Props {
  featuredItems: MenuItem[];
  nextEvent: { title: string; date: string; time: string; description: string; tag: string } | null;
}

function formatPrice(n: number) {
  return `₦${n.toLocaleString()}`;
}

export default function HomeClient({ featuredItems, nextEvent }: Props) {
  const { mode } = useTimeMode();
  const isNight = mode === "night";

  return (
    <div className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[96vh] flex flex-col justify-end overflow-hidden">

        {/* Background image - day uses warm restaurant photo, night uses dark lounge */}
        <div className="absolute inset-0">
          {isNight ? (
            // Night: deep cinematic dark with gold overlay
            <div className="absolute inset-0 bg-night-bg">
              {/* Atmospheric radial glows */}
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse 80% 60% at 20% 60%, rgba(201,168,76,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 30%, rgba(124,58,237,0.08) 0%, transparent 60%)",
              }} />
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }} />
            </div>
          ) : (
            // Day: use an actual food photography placeholder via picsum with warm overlay
            <>
              <div className="absolute inset-0 bg-day-bg" />
              {/* Warm editorial gradient overlaid on right side */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(105deg, rgba(253,246,236,0.97) 0%, rgba(253,246,236,0.92) 40%, rgba(196,135,58,0.15) 70%, rgba(139,69,19,0.25) 100%)",
              }} />
              {/* Decorative food-inspired blobs */}
              <div className="absolute top-0 right-0 w-1/2 h-full hidden md:block overflow-hidden">
                <div className="w-full h-full" style={{
                  background: "radial-gradient(ellipse at 70% 40%, rgba(232,168,78,0.2) 0%, rgba(196,135,58,0.1) 40%, transparent 70%)",
                }} />
                {/* Floating decorative rings */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-day-accent/10" />
                <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full border border-day-accent/5" />
                <div className="absolute bottom-1/4 right-1/5 w-48 h-48 rounded-full border border-day-border/30" />
              </div>
            </>
          )}
        </div>

        {/* Overlay gradient at bottom for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none" style={{
          background: isNight
            ? "linear-gradient(to top, rgba(13,10,8,0.98) 0%, rgba(13,10,8,0.7) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(253,246,236,0.98) 0%, rgba(253,246,236,0.6) 50%, transparent 100%)",
        }} />

        {/* Live event pill — night only */}
        {isNight && nextEvent && (
          <div className="relative z-10 px-6 md:px-16 mb-6">
            <div className="inline-flex items-center gap-3 border border-night-accent/40 bg-night-accent/10 px-4 py-2 rounded-full">
              <Music size={13} className="text-night-accent animate-pulse" />
              <span className="text-xs text-night-accent uppercase tracking-widest font-body">
                {nextEvent.tag} · {nextEvent.date} · {nextEvent.time}
              </span>
            </div>
          </div>
        )}

        {/* Hero text */}
        <div className="relative z-10 px-6 md:px-16 pb-16 max-w-6xl">
          <p
            className="text-xs uppercase tracking-[0.4em] mode-muted font-body mb-4"
            style={{ animationDelay: "0.1s", animation: "var(--animate-fade-up)", opacity: 0, animationFillMode: "forwards" }}
          >
            {isNight ? "Premium Lounge · Live Music · Asaba" : "Restaurant & Lounge · Asaba, Delta State"}
          </p>

          <h1
            className="mode-text leading-[0.9] mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4rem, 13vw, 11rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              animation: "var(--animate-fade-up)",
              animationDelay: "0.2s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            {isNight ? (
              <>Where<br />the <em className="mode-accent italic">night</em><br />lives.</>
            ) : (
              <>Flavour,<br /><em className="mode-accent italic">crafted</em><br />daily.</>
            )}
          </h1>

          <p
            className="mode-muted font-body text-base md:text-lg max-w-lg leading-relaxed mb-10"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.35s", opacity: 0, animationFillMode: "forwards" }}
          >
            {isNight
              ? "Signature cocktails, premium bottles, live entertainment, and late-night Nigerian comfort food — all under one roof on DBS Road."
              : "Vibrant local flavours meet contemporary dining. Nigerian classics, continental dishes, and express lunch combos — served fresh daily."}
          </p>

          <div
            className="flex flex-wrap gap-4"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.5s", opacity: 0, animationFillMode: "forwards" }}
          >
            <Link href="/menu" className="btn-primary">
              {isNight ? "See Tonight's Menu" : "View Full Menu"}
            </Link>
            <Link href="/reservations" className="btn-outline">
              Reserve a Table
            </Link>
            {isNight && (
              <Link href="/packages" className="btn-outline">
                VIP Packages
              </Link>
            )}
          </div>
        </div>

        {/* Vertical address text */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 opacity-20"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-xs uppercase tracking-[0.5em] mode-muted font-body">
            Block 2 DDPA Estate · DBS Road · Asaba
          </span>
        </div>
      </section>

      {/* ── Event Banner (Night only) ────────────────────────────────────── */}
      {isNight && nextEvent && (
        <section className="bg-night-accent/10 border-y border-night-accent/20 px-6 md:px-16 py-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Music size={16} className="text-night-accent" />
                <span className="text-xs uppercase tracking-widest text-night-accent font-body">Next Live Event</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-night-text)" }}>
                {nextEvent.title}
              </h2>
              <p className="text-sm mt-1 font-body" style={{ color: "var(--color-night-muted)" }}>{nextEvent.date} · {nextEvent.time}</p>
              <p className="text-sm mt-2 max-w-lg font-body leading-relaxed" style={{ color: "var(--color-night-muted)" }}>{nextEvent.description}</p>
            </div>
            <Link href="/reservations" className="btn-primary whitespace-nowrap flex items-center gap-2 self-start md:self-center">
              Book VIP Table <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ── Info strip ──────────────────────────────────────────────────── */}
      <section className="border-b mode-border px-6 md:px-16 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x mode-border">
          {[
            { icon: MapPin, label: "Location", value: "Block 2, DDPA Estate, Plot 75 DBS Road, Asaba" },
            { icon: Clock, label: "Hours", value: "10:00 AM — 11:00 PM (later on event nights)" },
            { icon: Phone, label: "Call Us", value: "+234 913 200 8111" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="md:px-8 flex items-start gap-4">
              <Icon size={18} className="mode-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-widest mode-muted font-body mb-1">{label}</p>
                <p className="mode-text font-body text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Dishes ─────────────────────────────────────────────── */}
      {featuredItems.length > 0 && (
        <section className="px-6 md:px-16 py-20 border-b mode-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] mode-muted font-body mb-3">
                  {isNight ? "Tonight's Highlights" : "Chef's Selection"}
                </p>
                <h2 className="section-title">Featured dishes</h2>
              </div>
              <Link href="/menu" className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider mode-accent font-body hover:opacity-70 transition-opacity">
                Full menu <ChevronRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <FeaturedCard key={item._id} item={item} isNight={isNight} />
              ))}
            </div>

            <div className="mt-10 flex md:hidden">
              <Link href="/menu" className="btn-outline w-full justify-center">
                View Full Menu
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Packages Preview ────────────────────────────────────────────── */}
      <section className={`px-6 md:px-16 py-20 border-b mode-border ${isNight ? "bg-night-surface" : "bg-day-surface"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] mode-muted font-body mb-3">VIP Experiences</p>
              <h2 className="section-title">Celebrate with us</h2>
              <p className="mode-muted font-body text-sm mt-3 max-w-lg">
                Birthdays, bridal showers, corporate events. Curated packages with premium bottles, shisha, and platters.
              </p>
            </div>
            <Link href="/packages" className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider mode-accent font-body hover:opacity-70 transition-opacity">
              All packages <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["silver", "gold", "platinum"] as const).map((tier) => {
              const pkg = PACKAGES[tier];
              return (
                <Link
                  key={tier}
                  href="/packages"
                  className="group border mode-border p-7 hover:border-day-accent dark:hover:border-night-accent transition-all"
                  style={{ background: isNight ? "var(--color-night-bg)" : "var(--color-day-bg)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{pkg.emoji}</span>
                    <span className="text-xs uppercase tracking-widest mode-muted font-body">Package</span>
                  </div>
                  <h3 className="text-2xl font-light mode-text mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    {pkg.name}
                  </h3>
                  <p className="text-xs mode-muted font-body mb-4">{pkg.tagline}</p>
                  <p className="text-xl font-body font-medium mode-accent mb-5">
                    {formatPrice(pkg.price)}
                  </p>
                  <ul className="space-y-1.5 mb-6">
                    {pkg.includes.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-body mode-muted">
                        <span className="mode-accent shrink-0">—</span> {item}
                      </li>
                    ))}
                    {pkg.includes.length > 3 && (
                      <li className="text-xs font-body mode-muted">+ {pkg.includes.length - 3} more...</li>
                    )}
                  </ul>
                  <div className="flex items-center gap-1 text-xs uppercase tracking-wider mode-accent font-body opacity-0 group-hover:opacity-100 transition-opacity">
                    Book this package <ChevronRight size={11} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Praprika ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 border-b mode-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] mode-muted font-body mb-4">The Experience</p>
          <h2 className="section-title mb-12 max-w-lg">
            {isNight ? "An evening worth remembering" : "Crafted for every moment"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--color-day-border)" }}>
            {(isNight ? NIGHT_FEATURES : DAY_FEATURES).map((f) => (
              <div key={f.title} className="mode-surface p-8 hover:bg-day-accent/5 dark:hover:bg-night-accent/5 transition-colors group" style={{ background: isNight ? "var(--color-night-surface)" : "var(--color-day-surface)" }}>
                <div className="text-3xl mb-4">{f.emoji}</div>
                <h3 className="text-xl font-light mode-text mb-2" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                <p className="text-sm mode-muted font-body leading-relaxed">{f.desc}</p>
                <Link href={f.href} className="inline-flex items-center gap-1 text-xs uppercase tracking-wider mode-accent mt-4 opacity-0 group-hover:opacity-100 transition-opacity font-body">
                  {f.cta} <ChevronRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t mode-border px-6 md:px-16 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="mode-accent text-xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.15em" }}>PRAPRIKA</span>
          <p className="text-xs mode-muted font-body text-center">
            Block 2, DDPA Estate, Plot 75 DBS Road, Asaba · +234 913 200 8111
          </p>
          <p className="text-xs mode-muted font-body">© 2025 Praprika Restaurant & Lounge</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────
function FeaturedCard({ item, isNight }: { item: MenuItem; isNight: boolean }) {
  const imgUrl = item.image?.asset?.url;

  return (
    <Link href="/menu" className="group block overflow-hidden border mode-border hover:border-day-accent dark:hover:border-night-accent transition-all">
      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden bg-day-border dark:bg-night-border">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            🍽️
          </div>
        )}
        {/* Featured badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 text-xs font-body rounded-sm ${isNight ? "bg-night-accent text-night-bg" : "bg-day-accent text-white"}`}>
          <Star size={9} fill="currentColor" /> Chef's Pick
        </div>
      </div>

      {/* Info */}
      <div className="p-5 mode-surface">
        <p className="text-xs mode-muted font-body uppercase tracking-wider mb-1">{item.category?.emoji} {item.category?.name}</p>
        <h3 className="font-body font-medium mode-text mb-1 text-sm">{item.name}</h3>
        {item.description && (
          <p className="text-xs mode-muted font-body leading-relaxed line-clamp-2 mb-3">{item.description}</p>
        )}
        <p className={`font-body font-medium text-base ${isNight ? "text-night-accent" : "text-day-accent"}`}>
          ₦{item.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

const DAY_FEATURES = [
  { emoji: "🍲", title: "Nigerian Classics", desc: "Traditional swallows, pepper soup, local stews — crafted with intention and premium ingredients.", href: "/menu", cta: "See Menu" },
  { emoji: "⚡", title: "Express Lunch Combos", desc: "Quick, satisfying, and generous. In and out in under 45 minutes for the corporate crowd.", href: "/menu", cta: "Order Now" },
  { emoji: "🪑", title: "Reserve Your Table", desc: "Weekend dining fills fast. Secure your spot in advance and skip the wait entirely.", href: "/reservations", cta: "Reserve" },
];

const NIGHT_FEATURES = [
  { emoji: "🍹", title: "Signature Cocktails", desc: "House-crafted drinks that pair the boldness of West Africa with classic mixology.", href: "/menu", cta: "View Bar Menu" },
  { emoji: "🎵", title: "Live Entertainment", desc: "Afrobeats, Highlife, Soul — our live band nights are the heartbeat of DBS Road.", href: "/reservations", cta: "Book for Event" },
  { emoji: "🥂", title: "VIP Packages", desc: "Silver, Gold, and Platinum nightlife experiences. Premium bottles, shisha, and curated platters.", href: "/packages", cta: "Explore Packages" },
];
