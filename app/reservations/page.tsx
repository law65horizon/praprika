"use client";

import { useState } from "react";
import { useTimeMode } from "@/components/TimeModeProvider";
import FloorPlan from "@/components/reservations/FloorPlan";
import { ZONE_HOLDING_FEES } from "@/lib/packages";
import { CheckCircle, Info, AlertCircle } from "lucide-react";

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
  "8:00 PM", "9:00 PM", "10:00 PM",
];

export default function ReservationsPage() {
  const { mode } = useTimeMode();
  const isNight = mode === "night";

  const [selectedZone, setSelectedZone] = useState("standard");
  const [form, setForm] = useState({
    guestName: "", guestPhone: "", guestEmail: "",
    date: "", time: "", partySize: "2", specialRequests: "",
  });
  const [acknowledged, setAcknowledged] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const zoneInfo = ZONE_HOLDING_FEES[selectedZone];
  const hasHoldingFee = zoneInfo.fee > 0;

  function isFormValid() {
    const base = form.guestName && form.guestPhone && form.date && form.time && form.partySize;
    if (!base) return false;
    if (hasHoldingFee && !acknowledged) return false;
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          zone: selectedZone,
          holdingFeeAcknowledged: acknowledged,
          holdingFeeAmount: zoneInfo.fee,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <CheckCircle size={56} className={`mx-auto mb-6 ${isNight ? "text-night-accent" : "text-day-accent"}`} />
          <h1 className="section-title mb-4">Reservation Received</h1>
          <p className="mode-muted font-body text-sm leading-relaxed mb-2">
            Thank you, <strong className="mode-text">{form.guestName}</strong>. Your table reservation at Praprika has been submitted.
          </p>
          <p className="mode-muted font-body text-sm leading-relaxed mb-6">
            We'll confirm via phone to <strong className="mode-text">{form.guestPhone}</strong> within a few hours.
            {hasHoldingFee && ` Our team will reach out regarding your ₦${zoneInfo.fee.toLocaleString()} holding fee.`}
          </p>
          <div className={`text-xs p-4 border rounded-sm font-body mode-muted ${isNight ? "border-night-border" : "border-day-border"}`}>
            <p><strong className="mode-text">Date:</strong> {form.date} at {form.time}</p>
            <p className="mt-1"><strong className="mode-text">Zone:</strong> {zoneInfo.label}</p>
            <p className="mt-1"><strong className="mode-text">Party size:</strong> {form.partySize} guests</p>
          </div>
          <button
            onClick={() => { setStep("form"); setAcknowledged(false); setForm({ guestName: "", guestPhone: "", guestEmail: "", date: "", time: "", partySize: "2", specialRequests: "" }); }}
            className="btn-outline mt-6"
          >
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">

      {/* Header */}
      <div className={`border-b mode-border px-6 md:px-16 py-12 ${isNight ? "bg-night-surface" : "bg-day-surface"}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] mode-muted font-body mb-3">Reservations</p>
          <h1 className="section-title max-w-xl">Reserve your table</h1>
          <p className="mode-muted font-body text-sm mt-2 max-w-lg">
            Weekend tables fill fast — especially on live band nights. Select your preferred zone and we'll hold your spot.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Left: Floor Plan ── */}
          <div>
            <h2 className="text-xl font-light mode-text mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
              Choose Your Zone
            </h2>
            <FloorPlan
              selectedZone={selectedZone}
              onSelectZone={(zone) => { setSelectedZone(zone); setAcknowledged(false); }}
              isNight={isNight}
            />

            {/* Zone description */}
            {selectedZone && (
              <div className={`mt-4 p-4 border rounded-sm text-sm font-body ${isNight ? "border-night-border bg-night-surface" : "border-day-border bg-day-surface"}`}>
                <p className="font-medium mode-text mb-1">{zoneInfo.label}</p>
                <p className="mode-muted text-xs leading-relaxed">{zoneInfo.description}</p>
                {hasHoldingFee ? (
                  <div className={`flex items-start gap-2 mt-3 p-3 rounded-sm text-xs ${isNight ? "bg-night-accent/10 text-night-accent" : "bg-day-accent/10 text-day-accent"}`}>
                    <Info size={12} className="mt-0.5 shrink-0" />
                    <p>
                      A <strong>₦{zoneInfo.fee.toLocaleString()}</strong> holding fee secures this zone.
                      This is credited against your final bill on the night. It protects your spot and ensures
                      we don't turn away walk-ins for a table that won't be used.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-sm text-xs mode-muted border mode-border">
                    No holding fee required for bar seating. Walk-in or reserve ahead of time.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Reservation Form ── */}
          <div>
            <h2 className="text-xl font-light mode-text mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
              Your Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Full Name *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Chidi Okeke"
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Phone *</label>
                  <input
                    className="input-field"
                    placeholder="+234 ..."
                    value={form.guestPhone}
                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Email (optional)</label>
                <input
                  className="input-field"
                  placeholder="for confirmation"
                  value={form.guestEmail}
                  onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Party Size *</label>
                  <select
                    className="input-field"
                    value={form.partySize}
                    onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                  >
                    {[1,2,3,4,5,6,7,8,10,12,15,20].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Preferred Time *</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm({ ...form, time: slot })}
                      className={`py-2 px-1 text-xs font-body border rounded-sm transition-all ${
                        form.time === slot
                          ? isNight
                            ? "bg-night-accent border-night-accent text-night-bg font-medium"
                            : "bg-day-accent border-day-accent text-white font-medium"
                          : "mode-border mode-muted hover:mode-text"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider mode-muted font-body block mb-2">Special Requests</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Birthday decorations, dietary requirements, occasion..."
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                />
              </div>

              {/* Holding fee acknowledgement */}
              {hasHoldingFee && (
                <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${
                  acknowledged
                    ? isNight ? "border-night-accent bg-night-accent/10" : "border-day-accent bg-day-accent/10"
                    : "mode-border"
                }`}>
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 shrink-0 accent-amber-500"
                  />
                  <span className="text-xs font-body mode-muted leading-relaxed">
                    I understand that a <strong className="mode-text">₦{zoneInfo.fee.toLocaleString()} holding fee</strong> is required
                    to confirm my <strong className="mode-text">{zoneInfo.label}</strong> reservation. This amount is
                    credited in full against my bill on the night. No-shows forfeit the holding fee.
                    Praprika staff will contact me to process this payment after submission.
                  </span>
                </label>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-body p-3 border border-red-400/30 rounded-sm bg-red-400/10">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* Summary box before submit */}
              {form.guestName && form.date && form.time && (
                <div className={`p-4 border rounded-sm text-xs font-body mode-muted ${isNight ? "border-night-border bg-night-surface" : "border-day-border bg-day-surface"}`}>
                  <p className="mode-text font-medium mb-2 text-sm">Reservation Summary</p>
                  <div className="space-y-1">
                    <p><span className="mode-accent">Guest:</span> {form.guestName}</p>
                    <p><span className="mode-accent">Date:</span> {form.date} at {form.time}</p>
                    <p><span className="mode-accent">Party:</span> {form.partySize} guests</p>
                    <p><span className="mode-accent">Zone:</span> {zoneInfo.label}</p>
                    {hasHoldingFee && (
                      <p><span className="mode-accent">Holding Fee:</span> ₦{zoneInfo.fee.toLocaleString()} {acknowledged ? "✓ Acknowledged" : "(acknowledgement required)"}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                className="btn-primary w-full"
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
              >
                {loading ? "Submitting..." : hasHoldingFee ? `Submit Reservation · ₦${zoneInfo.fee.toLocaleString()} hold applies` : "Confirm Reservation"}
              </button>

              <p className="text-xs mode-muted font-body text-center">
                Questions? Call us at <strong className="mode-text">+234 913 200 8111</strong>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
