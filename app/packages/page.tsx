"use client";

import { useState } from "react";
import { useTimeMode } from "@/components/TimeModeProvider";
import { PACKAGES, type PackageTier } from "@/lib/packages";
import { CheckCircle, ChevronRight, Info } from "lucide-react";

const OCCASIONS = [
  { value: "birthday", label: "🎂 Birthday" },
  { value: "bridal_shower", label: "💍 Bridal Shower" },
  { value: "corporate", label: "💼 Corporate Event" },
  { value: "celebration", label: "🥂 General Celebration" },
  { value: "date_night", label: "🌹 Date Night" },
];

export default function PackagesPage() {
  const { mode } = useTimeMode();
  const isNight = mode === "night";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [tier, setTier] = useState<PackageTier | null>(null);
  const [bottleChoice, setBottleChoice] = useState("");
  const [platterChoice, setPlatterChoice] = useState("");
  const [form, setForm] = useState({
    guestName: "", guestPhone: "", eventDate: "",
    guestCount: "4", occasion: "", specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const pkg = tier ? PACKAGES[tier] : null;

  async function handleSubmit() {
    if (!tier || !pkg) return;
    setLoading(true);
    try {
      await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tier,
          bottleChoice,
          platterChoice,
          totalAmount: pkg.price,
        }),
      });
      setDone(true);
    } catch {
      alert("Submission failed. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  }

  if (done && pkg && tier) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">{pkg.emoji}</div>
          <CheckCircle size={48} className={`mx-auto mb-6 ${isNight ? "text-night-accent" : "text-day-accent"}`} />
          <h1 className="section-title mb-4">Package Inquiry Received</h1>
          <p className="mode-muted font-body text-sm leading-relaxed mb-6">
            Your <strong className="mode-text">{pkg.name} Package</strong> inquiry has been sent to our events team.
            We'll be in touch at <strong className="mode-text">{form.guestPhone}</strong> to confirm your booking and arrange the holding deposit.
          </p>
          <div className={`text-xs p-4 border rounded-sm font-body mode-muted space-y-1 text-left ${isNight ? "border-night-border" : "border-day-border"}`}>
            <p><span className="mode-accent">Package:</span> {pkg.name} — ₦{pkg.price.toLocaleString()}</p>
            <p><span className="mode-accent">Bottle:</span> {bottleChoice}</p>
            <p><span className="mode-accent">Platter:</span> {platterChoice}</p>
            {form.eventDate && <p><span className="mode-accent">Date:</span> {form.eventDate}</p>}
            <p><span className="mode-accent">Guests:</span> {form.guestCount}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">

      {/* Header */}
      <div className={`border-b mode-border px-6 md:px-16 py-12 ${isNight ? "bg-night-surface" : "bg-day-surface"}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] mode-muted font-body mb-3">VIP Packages</p>
          <h1 className="section-title max-w-xl">Celebrate at Praprika</h1>
          <p className="mode-muted font-body text-sm mt-2 max-w-lg">
            Curated nightlife experiences for birthdays, bridal showers, corporate events, and unforgettable evenings.
            Premium bottles, shisha, and platters — configured exactly to your group.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="border-b mode-border px-6 md:px-16 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-body uppercase tracking-wider">
          {["Choose Tier", "Customise", "Your Details"].map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                  done
                    ? isNight ? "bg-night-accent text-night-bg" : "bg-day-accent text-white"
                    : active
                    ? isNight ? "border-2 border-night-accent text-night-accent" : "border-2 border-day-accent text-day-accent"
                    : "border mode-border mode-muted"
                }`}>
                  {done ? "✓" : n}
                </div>
                <span className={active || done ? "mode-accent" : "mode-muted"}>{label}</span>
                {i < 2 && <ChevronRight size={12} className="mode-muted" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">

        {/* ── Step 1: Tier Selection ── */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-light mode-text mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
              Select Your Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.keys(PACKAGES) as PackageTier[]).map((key) => {
                const p = PACKAGES[key];
                const isSelected = tier === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTier(key)}
                    className={`text-left p-6 border rounded-sm transition-all group ${
                      isSelected
                        ? isNight
                          ? "border-night-accent bg-night-accent/10"
                          : "border-day-accent bg-day-accent/10"
                        : "mode-border mode-surface hover:border-day-accent dark:hover:border-night-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{p.emoji}</span>
                      {isSelected && <span className={`text-xs px-2 py-1 rounded-full font-body ${isNight ? "bg-night-accent text-night-bg" : "bg-day-accent text-white"}`}>Selected</span>}
                    </div>
                    <h3 className="text-2xl font-light mode-text mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {p.name}
                    </h3>
                    <p className="text-xs mode-muted font-body mb-4">{p.tagline}</p>
                    <p className={`text-2xl font-body font-medium mb-5 ${isNight ? "text-night-accent" : "text-day-accent"}`}>
                      ₦{p.price.toLocaleString()}
                    </p>
                    <ul className="space-y-2">
                      {p.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs font-body mode-muted">
                          <span className="mode-accent mt-0.5 shrink-0">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className="btn-primary"
                disabled={!tier}
                onClick={() => setStep(2)}
              >
                Continue: Customise →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Customise ── */}
        {step === 2 && pkg && tier && (
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">{pkg.emoji}</span>
              <div>
                <h2 className="text-2xl font-light mode-text" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Customise Your {pkg.name} Package
                </h2>
                <p className="text-xs mode-muted font-body">Make it yours — choose your bottle and platter</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Bottle */}
              <div>
                <label className="text-xs uppercase tracking-widest mode-muted font-body block mb-3">
                  Select Your Bottle{tier !== "silver" ? "s" : ""} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {pkg.bottles.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBottleChoice(b)}
                      className={`text-left p-4 border rounded-sm text-sm font-body transition-all ${
                        bottleChoice === b
                          ? isNight ? "border-night-accent bg-night-accent/10 text-night-accent" : "border-day-accent bg-day-accent/10 text-day-accent"
                          : "mode-border mode-muted hover:mode-text"
                      }`}
                    >
                      🥃 {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platter */}
              <div>
                <label className="text-xs uppercase tracking-widest mode-muted font-body block mb-3">
                  Select Your Platter *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {pkg.platters.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatterChoice(p)}
                      className={`text-left p-4 border rounded-sm text-sm font-body transition-all ${
                        platterChoice === p
                          ? isNight ? "border-night-accent bg-night-accent/10 text-night-accent" : "border-day-accent bg-day-accent/10 text-day-accent"
                          : "mode-border mode-muted hover:mode-text"
                      }`}
                    >
                      🍽️ {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live price summary */}
              {bottleChoice && platterChoice && (
                <div className={`p-5 border rounded-sm ${isNight ? "border-night-accent/30 bg-night-accent/5" : "border-day-accent/30 bg-day-accent/5"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={14} className="mode-accent" />
                    <p className="text-xs uppercase tracking-widest mode-accent font-body">Your Selection</p>
                  </div>
                  <div className="space-y-1 text-sm font-body mode-muted mb-4">
                    <p><span className="mode-text">{pkg.name} Package</span> — All included items</p>
                    <p><span className="mode-text">Bottle:</span> {bottleChoice}</p>
                    <p><span className="mode-text">Platter:</span> {platterChoice}</p>
                  </div>
                  <div className="flex justify-between items-center border-t mode-border pt-4">
                    <span className="text-xs uppercase tracking-wider mode-muted font-body">Package Total</span>
                    <span className={`text-2xl font-body font-medium ${isNight ? "text-night-accent" : "text-day-accent"}`}>
                      ₦{pkg.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4 justify-between">
              <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn-primary"
                disabled={!bottleChoice || !platterChoice}
                onClick={() => setStep(3)}
              >
                Continue: Your Details →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Contact Details ── */}
        {step === 3 && pkg && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-light mode-text mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              Almost there
            </h2>
            <p className="mode-muted text-sm font-body mb-8">Fill in your details and we'll confirm your package within 24 hours.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Full Name *</label>
                  <input className="input-field" placeholder="Your name" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Phone *</label>
                  <input className="input-field" placeholder="+234 ..." value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Event Date</label>
                  <input type="date" className="input-field" value={form.eventDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Number of Guests</label>
                  <select className="input-field" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })}>
                    {[2,3,4,5,6,8,10,12,15,20,25,30].map((n) => (
                      <option key={n} value={n}>{n} guests</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Occasion</label>
                <div className="grid grid-cols-3 gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setForm({ ...form, occasion: o.value })}
                      className={`py-2 px-3 text-xs font-body border rounded-sm transition-all ${
                        form.occasion === o.value
                          ? isNight ? "border-night-accent bg-night-accent/10 text-night-accent" : "border-day-accent bg-day-accent/10 text-day-accent"
                          : "mode-border mode-muted hover:mode-text"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Special Requests</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Balloon setup, custom cake message, dietary requirements..." value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} />
              </div>

              {/* Final summary */}
              <div className={`p-5 border rounded-sm ${isNight ? "border-night-accent/30 bg-night-surface" : "border-day-accent/30 bg-day-surface"}`}>
                <p className="text-sm font-medium mode-text mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>Booking Summary</p>
                <div className="space-y-1 text-xs font-body mode-muted">
                  <div className="flex justify-between"><span>Package</span><span className="mode-text">{pkg.name} {pkg.emoji}</span></div>
                  <div className="flex justify-between"><span>Bottle</span><span className="mode-text">{bottleChoice}</span></div>
                  <div className="flex justify-between"><span>Platter</span><span className="mode-text">{platterChoice}</span></div>
                  {form.guestCount && <div className="flex justify-between"><span>Guests</span><span className="mode-text">{form.guestCount}</span></div>}
                  <div className="flex justify-between border-t mode-border pt-2 mt-2">
                    <span className="mode-text font-medium">Total</span>
                    <span className={`font-medium text-sm ${isNight ? "text-night-accent" : "text-day-accent"}`}>₦{pkg.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className={`mt-3 p-3 rounded-sm text-xs font-body ${isNight ? "bg-night-accent/10 text-night-accent" : "bg-day-accent/10 text-day-accent"}`}>
                  A deposit will be required to confirm your booking. Our team will reach out within 24 hours.
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-between">
              <button className="btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button
                className="btn-primary"
                disabled={loading || !form.guestName || !form.guestPhone}
                onClick={handleSubmit}
              >
                {loading ? "Submitting..." : `Send Package Inquiry · ₦${pkg.price.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
