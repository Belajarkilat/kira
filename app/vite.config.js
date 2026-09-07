import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // GitHub Pages disajikan dari sub-laluan, jadi laluan asas datang dari persekitaran.
  base: process.env.BASE_PATH || "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["ikon-192.png", "ikon-512.png", "ikon-maskable.png"],
      manifest: {
        name: "Kira",
        short_name: "Kira",
        description: "Kira sekejap, tahu untung.",
        lang: "ms",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#EDEAE1",
        theme_color: "#1A1D16",
        categories: ["business", "finance", "productivity"],
        icons: [
          { src: "ikon-192.png", sizes: "192x192", type: "image/png" },
          { src: "ikon-512.png", sizes: "512x512", type: "image/png" },
          { src: "ikon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "fon-css" }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "fon-fail",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
});
