/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      site_color: "#ff4900",
      color_white: "#fff",
      color_gray: "#9ca9b9",
      color_dark: "#000",
      color_dark_gray: "#444",
      header_bg_dark: "#3b3c4c",
      header_bg_light: "#eef0f2",
      header_bg_menu: "#45475a",
      main_bg_dark: "#2f303e",
      footer_bg_dark: "#2f303e",
      footer_bg_light: "#fff",
      pages_status_type: "#ff5a5a",
      pages_status_showing: "#6cc174",
      pages_bg_star: "#38394a",
      pages_bg_bookopen: "#48495b",
      pages_star: "#ffdd73",
      text_color: "#999",
      color_Manhwa: "#5ab0ff",
      color_Manga: "#ff5a5a",
      color_Novel: "#ffdd73",
    },
  },
  plugins: [],
  darkMode: "class",
  important: true,
  mode: "jit",
};
