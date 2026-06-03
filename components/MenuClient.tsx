"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useTimeMode } from "@/components/TimeModeProvider";
import { shouldShowCategory } from "@/lib/timeOfDay";
import type { CartItem, Category, MenuItem } from "@/lib/types";
import { ShoppingBag, Plus, Minus, X, AlertCircle, CheckCircle, Moon, Sun } from "lucide-react";

function formatPrice(n: number) { return `₦${n.toLocaleString()}`; }

// ─── Menu Item Card ───────────────────────────────────────────────────────────
function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  const { mode } = useTimeMode();
  const isNight = mode === "night";
  const imgUrl = item.image?.asset?.url;

  return (
    <div className={`group border mode-border overflow-hidden transition-all hover:border-day-accent dark:hover:border-night-accent ${!item.available ? "opacity-50" : ""}`}
      style={{ background: isNight ? "var(--color-night-surface)" : "var(--color-day-surface)" }}>

      {/* Image area */}
      <div className="relative w-full h-44 overflow-hidden" style={{ background: isNight ? "var(--color-night-border)" : "var(--color-day-border)" }}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">🍽️</div>
        )}
        {item.featured && (
          <div className={`absolute top-2 left-2 text-xs px-2 py-0.5 font-body rounded-sm ${isNight ? "bg-night-accent text-night-bg" : "bg-day-accent text-white"}`}>
            Chef's Pick
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-xs px-3 py-1 bg-red-500/80 text-white font-body rounded-sm flex items-center gap-1">
              <AlertCircle size={10} /> Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-body font-medium mode-text text-sm leading-snug">{item.name}</h3>
        {item.description && (
          <p className="text-xs mode-muted font-body leading-relaxed line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <p className={`font-body font-medium text-base ${isNight ? "text-night-accent" : "text-day-accent"}`}>
            {formatPrice(item.price)}
          </p>
          <button
            onClick={() => item.available && onAdd(item)}
            disabled={!item.available}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              item.available
                ? isNight
                  ? "bg-night-accent/10 text-night-accent hover:bg-night-accent hover:text-night-bg"
                  : "bg-day-accent/10 text-day-accent hover:bg-day-accent hover:text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Drawer ─────────────────────────────────────────────────────────────
function OrderDrawer({ cart, onClose, onUpdateQty, onRemove }: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const { mode } = useTimeMode();
  const isNight = mode === "night";
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const [step, setStep] = useState<"cart" | "details" | "done">("cart");
  const [form, setForm] = useState({ name: "", phone: "", type: "dine_in", notes: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.phone) return;
    setLoading(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: form.name, guestPhone: form.phone,
          items: cart.map((i) => ({ itemName: i.name, quantity: i.quantity, price: i.price })),
          totalAmount: total, orderType: form.type, notes: form.notes,
        }),
      });
      setStep("done");
    } catch { alert("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full flex flex-col shadow-2xl border-l mode-border"
        style={{ background: isNight ? "var(--color-night-surface)" : "var(--color-day-surface)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b mode-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="mode-accent" />
            <span className="font-body font-medium mode-text">Your Order</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-body ${isNight ? "bg-night-accent/20 text-night-accent" : "bg-day-accent/20 text-day-accent"}`}>
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button onClick={onClose} className="mode-muted hover:mode-text transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "cart" && (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border mode-border p-3">
                  {item.image?.asset?.url && (
                    <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-sm">
                      <Image src={item.image.asset.url} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body mode-text font-medium truncate">{item.name}</p>
                    <p className="text-xs mode-muted font-body">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => onUpdateQty(item._id, -1)} className="w-6 h-6 rounded-full border mode-border mode-muted hover:mode-accent flex items-center justify-center"><Minus size={10} /></button>
                    <span className="text-sm font-body mode-text w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item._id, 1)} className="w-6 h-6 rounded-full border mode-border mode-muted hover:mode-accent flex items-center justify-center"><Plus size={10} /></button>
                    <button onClick={() => onRemove(item._id)} className="mode-muted hover:text-red-400 ml-1"><X size={14} /></button>
                  </div>
                </div>
              ))}
              <div className="border-t mode-border pt-4 mt-4 flex justify-between items-center">
                <span className="font-body mode-muted text-sm">Total</span>
                <span className={`font-body text-lg font-medium ${isNight ? "text-night-accent" : "text-day-accent"}`}>{formatPrice(total)}</span>
              </div>
            </div>
          )}
          {step === "details" && (
            <div className="space-y-4">
              <p className="text-sm mode-muted font-body">Just a few details so we can bring your order to you.</p>
              <input className="input-field" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input-field" placeholder="Phone Number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="dine_in">Dine In</option>
                <option value="takeout">Takeout</option>
                <option value="delivery">Delivery</option>
              </select>
              <textarea className="input-field resize-none" rows={3} placeholder="Special instructions (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          )}
          {step === "done" && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <CheckCircle size={48} className={isNight ? "text-night-accent" : "text-day-accent"} />
              <h3 className="text-2xl mode-text" style={{ fontFamily: "var(--font-display)" }}>Order Received!</h3>
              <p className="text-sm mode-muted font-body max-w-xs">Your order has been sent to the kitchen. A member of staff will confirm shortly.</p>
            </div>
          )}
        </div>

        {step !== "done" && (
          <div className="p-6 border-t mode-border space-y-3">
            {step === "cart" && <button className="btn-primary w-full" onClick={() => setStep("details")}>Continue to Details</button>}
            {step === "details" && (
              <>
                <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading || !form.name || !form.phone}>
                  {loading ? "Placing Order..." : `Place Order · ${formatPrice(total)}`}
                </button>
                <button className="btn-outline w-full" onClick={() => setStep("cart")}>Back to Cart</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MenuClient({ categories, items }: { categories: Category[]; items: MenuItem[] }) {
  const { mode, setMode } = useTimeMode();
  const isNight = mode === "night";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Filter categories and items by time mode
  const visibleCategories = useMemo(
    () => categories.filter((c) => shouldShowCategory(c.timeRestriction, mode)),
    [categories, mode]
  );

  // Set initial active category when categories load or mode changes
  useEffect(() => {
    if (visibleCategories.length > 0) {
      setActiveCatId(visibleCategories[0]._id);
    }
  }, [visibleCategories]);

  const activeCategory = visibleCategories.find((c) => c._id === activeCatId) ?? visibleCategories[0];

  const visibleItems = useMemo(
    () => items.filter((item) => item.category?._id === activeCategory?._id),
    [items, activeCategory]
  );

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { _id: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) => prev.map((i) => i._id === id ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0));
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  function scrollCatIntoView(id: string) {
    setActiveCatId(id);
    // Scroll the nav button into view
    const btn = navRef.current?.querySelector(`[data-cat="${id}"]`) as HTMLElement;
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div className="pt-16 min-h-screen">

      {/* ── Page header ── */}
      <div className="border-b mode-border px-6 md:px-16 py-10"
        style={{ background: isNight ? "var(--color-night-surface)" : "var(--color-day-surface)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] mode-muted font-body mb-3">
              {isNight ? "🌙 Night Menu" : "☀️ Daytime Menu"}
            </p>
            <h1 className="section-title">
              {isNight ? "Tonight's Selection" : "Today's Menu"}
            </h1>
            <p className="mode-muted font-body text-sm mt-2 max-w-md">
              {isNight
                ? "Cocktails, bottles, finger foods, and late-night comfort dishes — live until close."
                : "Fresh, seasonal, and crafted for the day. Express combos available for quick service."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Day / Night toggle */}
            <div className="flex border mode-border overflow-hidden text-xs font-body uppercase tracking-wider">
              <button onClick={() => setMode("day")}
                className="flex items-center gap-1.5 px-4 py-2 transition-colors"
                style={!isNight ? { background: "var(--color-day-accent)", color: "white" } : {color: 'var(--color-night-muted)'}}>
                <Sun size={12} /> Day
              </button>
              <button onClick={() => setMode("night")}
                className="flex items-center gap-1.5 px-4 py-2 transition-colors"
                style={isNight ? { background: "var(--color-night-accent)", color: "var(--color-night-bg)" } : {}}>
                <Moon size={12} /> Night
              </button>
            </div>

            {/* Cart button */}
            <button
              onClick={() => cartCount > 0 && setDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-body transition-all border mode-border"
              style={cartCount > 0 ? { background: isNight ? "var(--color-night-accent)" : "var(--color-day-accent)", color: isNight ? "var(--color-night-bg)" : "white", borderColor: "transparent" } : {}}
            >
              <ShoppingBag size={14} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category navbar ── */}
      {visibleCategories.length > 0 && (
        <div className="sticky top-16 z-30 border-b mode-border"
          style={{ background: isNight ? "var(--color-night-bg)" : "var(--color-day-bg)" }}>
          <div ref={navRef} className="max-w-6xl mx-auto px-6 md:px-16 flex gap-0 overflow-x-auto scrollbar-none">
            {visibleCategories.map((cat) => {
              const isActive = cat._id === activeCategory?._id;
              return (
                <button
                  key={cat._id}
                  data-cat={cat._id}
                  onClick={() => scrollCatIntoView(cat._id)}
                  className="flex items-center gap-2 px-5 py-4 text-xs uppercase tracking-widest font-body whitespace-nowrap transition-all border-b-2 shrink-0"
                  style={{
                    borderBottomColor: isActive ? (isNight ? "var(--color-night-accent)" : "var(--color-day-accent)") : "transparent",
                    color: isActive ? (isNight ? "var(--color-night-accent)" : "var(--color-day-accent)") : (isNight ? "var(--color-night-muted)" : "var(--color-day-muted)"),
                  }}
                >
                  {cat.emoji && <span>{cat.emoji}</span>}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Menu grid ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10">
        {visibleItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="mode-muted font-body text-sm">No items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleItems.map((item) => (
              <MenuCard key={item._id} item={item} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>

      {/* Sticky cart bar */}
      {cartCount > 0 && !drawerOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl font-body font-medium text-sm transition-all hover:scale-105"
            style={{ background: isNight ? "var(--color-night-accent)" : "var(--color-day-accent)", color: isNight ? "var(--color-night-bg)" : "white" }}
          >
            <ShoppingBag size={16} />
            View Order · {cartCount} item{cartCount !== 1 ? "s" : ""} · {formatPrice(cart.reduce((s, i) => s + i.price * i.quantity, 0))}
          </button>
        </div>
      )}

      {drawerOpen && (
        <OrderDrawer
          cart={cart}
          onClose={() => setDrawerOpen(false)}
          onUpdateQty={updateQty}
          onRemove={(id) => setCart((prev) => prev.filter((i) => i._id !== id))}
        />
      )}
    </div>
  );
}
