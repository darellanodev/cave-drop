import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Relative paths, so the build works in any folder
  // (for example GitHub Pages at https://user.github.io/cave-drop/).
  base: "./",
  plugins: [
    // Makes the game installable (PWA) and able to work without internet.
    VitePWA({
      registerType: "autoUpdate", // a new version is used after the next reload
      manifest: {
        name: "Cave Drop",
        short_name: "Cave Drop",
        description:
          "A 2D physics game. Guide the balls to the goal with bars.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#440000",
        theme_color: "#440000",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Files saved in the phone to work without internet.
        globPatterns: ["**/*.{js,css,html,png,svg,ico,webmanifest}"],
      },
    }),
  ],
});
