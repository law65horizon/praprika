export type TimeMode = "day" | "night";

export function getTimeMode(date?: Date): TimeMode {
  const now = date ?? new Date();
  const hours = now.getHours();
  return hours >= 10 && hours < 16 ? "day" : "night";
}

export function shouldShowCategory(
  timeRestriction: "both" | "day" | "night",
  mode: TimeMode
): boolean {
  if (timeRestriction === "both") return true;
  return timeRestriction === mode;
}
