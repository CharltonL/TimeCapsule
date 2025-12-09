import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const NODE_ENV = process.env.NODE_ENV;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: NODE_ENV == "production" ? "/TimeCapsule/" : "/",
});
