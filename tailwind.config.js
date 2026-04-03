/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F5F3EE",
        primary: "#2A5F2A",
        card: "#FFFFFF",
        accent: "#F5A623",
        textPrimary: "#1A1A1A",
        textSecondary: "#888888",
        vegBadge: "#2A5F2A",
        nonVegBadge: "#E05A2B",
      },
    },
  },
  plugins: [],
}
