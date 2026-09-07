import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Terbitan satu fail untuk dikongsi sebagai pautan. Tiada PWA, tiada pekerja perkhidmatan.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist-artifact",
    emptyOutDir: true,
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: { input: "index-artifact.html" }
  }
});
