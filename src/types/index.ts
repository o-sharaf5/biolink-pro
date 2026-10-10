export interface ThemeSettings {
  accentColor: string;
  background: string;
  fontStyle: "sans" | "serif" | "mono";
  borderRadius: "none" | "sm" | "lg" | "full";
  showTipCard: boolean;
}

export const defaultTheme: ThemeSettings = {
  accentColor: "#7c3aed",
  background: "#fafafa",
  fontStyle: "sans",
  borderRadius: "lg",
  showTipCard: true,
};
