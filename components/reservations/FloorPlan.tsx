"use client";

import { ZONE_HOLDING_FEES } from "@/lib/packages";

interface FloorPlanProps {
  selectedZone: string;
  onSelectZone: (zone: string) => void;
  isNight: boolean;
}

const ZONES = [
  { id: "vip_booth", label: "VIP", sublabel: "Band-Side Booth" },
  { id: "standard", label: "Table", sublabel: "Standard Dining" },
  { id: "outdoor", label: "Terrace", sublabel: "Outdoor Seating" },
  { id: "bar", label: "Bar", sublabel: "Bar Seating" },
];

export default function FloorPlan({ selectedZone, onSelectZone, isNight }: FloorPlanProps) {
  const accent = isNight ? "#C9A84C" : "#C4873A";
  const bg = isNight ? "#161210" : "#FFF8F0";
  const border = isNight ? "#2A2118" : "#E8D5B7";
  const textMain = isNight ? "#F0E6D3" : "#2C1810";
  const textMuted = isNight ? "#7A6A58" : "#8B6F5C";
  const selectedFill = isNight ? "#C9A84C22" : "#C4873A22";
  const selectedStroke = accent;
  const hoverFill = isNight ? "#C9A84C11" : "#C4873A11";

  function zoneColor(id: string) {
    if (id === selectedZone) return { fill: selectedFill, stroke: selectedStroke };
    return { fill: "transparent", stroke: border };
  }

  return (
    <div className="w-full">
      <p className="text-xs uppercase tracking-widest mode-muted font-body mb-4">
        Tap a zone to select your seating preference
      </p>

      <svg
        viewBox="0 0 600 420"
        className="w-full rounded-sm border mode-border"
        style={{ background: bg, maxHeight: 420 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Outer walls ── */}
        <rect x="20" y="20" width="560" height="380" rx="4" fill="none" stroke={border} strokeWidth="2" />

        {/* ── Stage / Band area ── */}
        <rect x="200" y="30" width="200" height="50" rx="3" fill={isNight ? "#C9A84C18" : "#C4873A12"} stroke={accent} strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="300" y="50" textAnchor="middle" fill={accent} fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="2" textLength="80" lengthAdjust="spacing">STAGE</text>
        <text x="300" y="66" textAnchor="middle" fill={textMuted} fontSize="9" fontFamily="DM Sans, sans-serif">🎵 Live Band</text>

        {/* ── VIP Booths (band-side) ── */}
        <g
          onClick={() => onSelectZone("vip_booth")}
          style={{ cursor: "pointer" }}
          className="group"
        >
          <rect x="30" y="95" width="160" height="130" rx="3"
            fill={selectedZone === "vip_booth" ? selectedFill : hoverFill}
            stroke={selectedZone === "vip_booth" ? selectedStroke : border}
            strokeWidth={selectedZone === "vip_booth" ? 2 : 1.5}
          />
          {/* Booth shapes */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="45" y={105 + i * 38} width="55" height="26" rx="2"
                fill={selectedZone === "vip_booth" ? `${accent}22` : "transparent"}
                stroke={selectedZone === "vip_booth" ? accent : border}
                strokeWidth="1"
              />
              <rect x="110" y={105 + i * 38} width="55" height="26" rx="2"
                fill={selectedZone === "vip_booth" ? `${accent}22` : "transparent"}
                stroke={selectedZone === "vip_booth" ? accent : border}
                strokeWidth="1"
              />
            </g>
          ))}
          <text x="110" y="238" textAnchor="middle" fill={selectedZone === "vip_booth" ? accent : textMuted} fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="1.5">VIP BOOTHS</text>
          {selectedZone === "vip_booth" && (
            <text x="110" y="220" textAnchor="middle" fill={accent} fontSize="14">✓</text>
          )}
        </g>

        {/* ── Standard Tables (center) ── */}
        <g
          onClick={() => onSelectZone("standard")}
          style={{ cursor: "pointer" }}
        >
          <rect x="210" y="95" width="180" height="200" rx="3"
            fill={selectedZone === "standard" ? selectedFill : hoverFill}
            stroke={selectedZone === "standard" ? selectedStroke : border}
            strokeWidth={selectedZone === "standard" ? 2 : 1.5}
          />
          {/* Table grid 2x3 */}
          {[0, 1].map((col) =>
            [0, 1, 2].map((row) => (
              <g key={`${col}-${row}`}>
                {/* Table */}
                <rect
                  x={225 + col * 80}
                  y={108 + row * 58}
                  width="50"
                  height="36"
                  rx="3"
                  fill={selectedZone === "standard" ? `${accent}18` : "transparent"}
                  stroke={selectedZone === "standard" ? accent : border}
                  strokeWidth="1"
                />
                {/* Chair top */}
                <rect x={225 + col * 80 + 8} y={104 + row * 58} width="14" height="6" rx="2"
                  fill={border} />
                <rect x={225 + col * 80 + 28} y={104 + row * 58} width="14" height="6" rx="2"
                  fill={border} />
                {/* Chair bottom */}
                <rect x={225 + col * 80 + 8} y={143 + row * 58} width="14" height="6" rx="2"
                  fill={border} />
                <rect x={225 + col * 80 + 28} y={143 + row * 58} width="14" height="6" rx="2"
                  fill={border} />
              </g>
            ))
          )}
          <text x="300" y="308" textAnchor="middle" fill={selectedZone === "standard" ? accent : textMuted} fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="1.5">STANDARD TABLES</text>
          {selectedZone === "standard" && (
            <text x="300" y="290" textAnchor="middle" fill={accent} fontSize="14">✓</text>
          )}
        </g>

        {/* ── Outdoor Terrace (right) ── */}
        <g
          onClick={() => onSelectZone("outdoor")}
          style={{ cursor: "pointer" }}
        >
          <rect x="410" y="95" width="155" height="130" rx="3"
            fill={selectedZone === "outdoor" ? selectedFill : hoverFill}
            stroke={selectedZone === "outdoor" ? selectedStroke : border}
            strokeWidth={selectedZone === "outdoor" ? 2 : 1.5}
            strokeDasharray={selectedZone === "outdoor" ? "none" : "6 3"}
          />
          {/* Umbrella tables */}
          {[0, 1].map((col) =>
            [0, 1].map((row) => (
              <g key={`out-${col}-${row}`}>
                <circle cx={435 + col * 60} cy={120 + row * 55} r="16"
                  fill={selectedZone === "outdoor" ? `${accent}18` : "transparent"}
                  stroke={selectedZone === "outdoor" ? accent : border}
                  strokeWidth="1"
                />
                {/* Umbrella pole */}
                <line x1={435 + col * 60} y1={110 + row * 55} x2={435 + col * 60} y2={136 + row * 55}
                  stroke={border} strokeWidth="1.5" />
              </g>
            ))
          )}
          <text x="487" y="238" textAnchor="middle" fill={selectedZone === "outdoor" ? accent : textMuted} fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="1.5">TERRACE</text>
          <text x="487" y="250" textAnchor="middle" fill={textMuted} fontSize="8" fontFamily="DM Sans, sans-serif">Al Fresco</text>
          {selectedZone === "outdoor" && (
            <text x="487" y="220" textAnchor="middle" fill={accent} fontSize="14">✓</text>
          )}
        </g>

        {/* ── Bar area (bottom) ── */}
        <g
          onClick={() => onSelectZone("bar")}
          style={{ cursor: "pointer" }}
        >
          <rect x="30" y="300" width="560" height="80" rx="3"
            fill={selectedZone === "bar" ? selectedFill : hoverFill}
            stroke={selectedZone === "bar" ? selectedStroke : border}
            strokeWidth={selectedZone === "bar" ? 2 : 1.5}
          />
          {/* Bar counter */}
          <rect x="50" y="315" width="380" height="20" rx="2"
            fill={isNight ? "#2A2118" : "#E8D5B7"}
            stroke={border}
            strokeWidth="1"
          />
          {/* Bar stools */}
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={68 + i * 40} cy={350} r="10"
              fill={selectedZone === "bar" ? `${accent}22` : "transparent"}
              stroke={selectedZone === "bar" ? accent : border}
              strokeWidth="1"
            />
          ))}
          <text x="490" y="340" textAnchor="middle" fill={selectedZone === "bar" ? accent : textMuted} fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="1.5">BAR SEATING</text>
          <text x="490" y="355" textAnchor="middle" fill={textMuted} fontSize="8" fontFamily="DM Sans, sans-serif">Walk-in</text>
          {selectedZone === "bar" && (
            <text x="490" y="375" textAnchor="middle" fill={accent} fontSize="12">✓</text>
          )}
        </g>

        {/* ── Entrance label ── */}
        <text x="300" y="408" textAnchor="middle" fill={textMuted} fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="2">ENTRANCE</text>
        <line x1="260" y1="400" x2="290" y2="400" stroke={textMuted} strokeWidth="1" />
        <line x1="310" y1="400" x2="340" y2="400" stroke={textMuted} strokeWidth="1" />

        {/* ── Legend ── */}
        <g>
          <rect x="410" y="250" width="8" height="8" fill={`${accent}30`} stroke={accent} strokeWidth="1" />
          <text x="422" y="259" fill={textMuted} fontSize="8" fontFamily="DM Sans, sans-serif">Selected</text>
          <rect x="410" y="266" width="8" height="8" fill="transparent" stroke={border} strokeWidth="1" strokeDasharray="3 2" />
          <text x="422" y="275" fill={textMuted} fontSize="8" fontFamily="DM Sans, sans-serif">Available</text>
        </g>
      </svg>

      {/* Zone info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        {ZONES.map((z) => {
          const info = ZONE_HOLDING_FEES[z.id];
          const isSelected = selectedZone === z.id;
          return (
            <button
              key={z.id}
              onClick={() => onSelectZone(z.id)}
              className={`text-left p-3 border rounded-sm transition-all text-xs font-body ${
                isSelected
                  ? isNight
                    ? "border-night-accent bg-night-accent/10 text-night-accent"
                    : "border-day-accent bg-day-accent/10 text-day-accent"
                  : "mode-border mode-muted hover:mode-text"
              }`}
            >
              <p className="font-medium mb-0.5">{z.label}</p>
              <p className="opacity-70 text-[10px]">{z.sublabel}</p>
              <p className={`mt-1 font-medium ${isSelected ? "" : "mode-accent"}`}>
                {info.fee > 0 ? `₦${info.fee.toLocaleString()} hold` : "No hold"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
