"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTimeMode } from "@/components/TimeModeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reserve" },
  { href: "/packages", label: "Packages" },
];

export default function Nav() {
  const pathname = usePathname();
  const { mode, setMode } = useTimeMode();
  const [open, setOpen] = useState(false);
  const isNight = mode === "night";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b mode-border bg-day-bg/90 dark:bg-night-bg/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl tracking-widest uppercase mode-accent"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, letterSpacing: "0.2em" }}
          >
            Praprika
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs uppercase tracking-widest font-body transition-colors duration-200 ${
                pathname === href
                  ? "mode-accent"
                  : "mode-muted hover:mode-text"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Day/Night Toggle */}
          <button
            onClick={() => setMode(isNight ? "day" : "night")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border mode-border text-xs uppercase tracking-wider mode-muted hover:mode-accent transition-all"
            title={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            {isNight ? (
              <>
                <Sun size={13} />
                <span className="hidden sm:inline">Day</span>
              </>
            ) : (
              <>
                <Moon size={13} />
                <span className="hidden sm:inline">Night</span>
              </>
            )}
          </button>

          {/* CTA */}
          <Link href="/reservations" className="hidden md:block btn-primary py-2 px-4 text-xs">
            Reserve
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden mode-muted"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t mode-border mode-surface px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm uppercase tracking-widest font-body py-2 transition-colors ${
                pathname === href ? "mode-accent" : "mode-muted"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
