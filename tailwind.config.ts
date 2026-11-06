import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--theme-bg)",
        surface: "var(--theme-surface)",
        "surface-secondary": "var(--theme-surface-secondary)",
        primary: "var(--theme-text)",
        secondary: "var(--theme-text-secondary)",
        btn: "var(--theme-btn)",
        "btn-text": "var(--theme-btn-text)",
        accent: "var(--theme-accent)",
        border: "var(--theme-border)",
        "badge-bg": "var(--theme-badge-bg)",
        "badge-text": "var(--theme-badge-text)"
      },
      fontFamily: {
        serif: [
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif"
        ],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Noto Sans",
          "sans-serif"
        ]
      },
      boxShadow: {
        glass:
          "0 10px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
        soft: "var(--theme-shadow)"
      }
    }
  },
  plugins: []
} satisfies Config;
