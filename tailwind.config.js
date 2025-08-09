// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        // Define your color palette with semantic names
        primary: "#0a1d2f", // The main background color
        "primary-light": "#102a43", // A slightly lighter shade for cards/inputs
        "primary-dark": "#061421", // A slightly darker shade for borders/hover
        accent: "#ff6687", // The main accent color
        "accent-hover": "#ff4d73", // A brighter/darker accent for hover states
        "text-primary": "#ffffff", // Main text color (white)
        "text-secondary": "#d1d5db", // Lighter gray for secondary text
      },
    },
  },
  plugins: [],
};
