"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getTimeMode, type TimeMode } from "@/lib/timeOfDay";

interface TimeModeContextValue {
  mode: TimeMode;
  setMode: (m: TimeMode) => void;
  isManual: boolean;
}

export const TimeModeContext = createContext<TimeModeContextValue>({
  mode: "day",
  setMode: () => {},
  isManual: false,
});

export function useTimeMode() {
  return useContext(TimeModeContext);
}

export function TimeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<TimeMode>("day");
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    if (!isManual) {
      setModeState(getTimeMode());
    }
  }, [isManual]);

  function setMode(m: TimeMode) {
    setModeState(m);
    setIsManual(true);
  }

  return (
    <TimeModeContext.Provider value={{ mode, setMode, isManual }}>
      <div className={mode === "night" ? "dark" : ""}>
        <div className="min-h-screen" style={{
          backgroundColor: mode === "night" ? "var(--color-night-bg)" : "var(--color-day-bg)",
          transition: "background-color 0.5s ease",
        }}>
          {children}
        </div>
      </div>
    </TimeModeContext.Provider>
  );
}
