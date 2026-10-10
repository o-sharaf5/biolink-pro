import type { ThemeSettings } from "@/types";

export function isDark(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export function radiusCss(radius: ThemeSettings["borderRadius"]): string {
  switch (radius) {
    case "none":
      return "0px";
    case "sm":
      return "6px";
    case "lg":
      return "12px";
    case "full":
      return "9999px";
  }
}
