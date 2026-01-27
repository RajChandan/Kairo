export const theme = {
  colors: {
    bg: "#0A0F14",
    surface: "#0F1623",
    card: "#111827",
    border: "rgba(255,255,255,0.06)",

    text: "#E5E7EB",
    muted: "#9CA3AF",

    primary: "#38BDF8",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    white: "#FFFFFF",
  },

  radius: {
    card: 20,
    input: 14,
    pill: 999,
  },

  space: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },

  text: {
    h1: { fontSize: 28, fontWeight: "800" as const },
    h2: { fontSize: 18, fontWeight: "800" as const },
    body: { fontSize: 15, fontWeight: "600" as const },
    small: { fontSize: 13, fontWeight: "600" as const },
    metric: { fontSize: 32, fontWeight: "900" as const },
  },
};
