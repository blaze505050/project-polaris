import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/aeroforge/",
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@wix\/.*$/, replacement: path.resolve(__dirname, "./integrations/wix-mock.ts") },
      { find: "@/integrations", replacement: path.resolve(__dirname, "./integrations") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) {
              return "vendor-three";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (id.includes("chart.js") || id.includes("recharts") || id.includes("d3-")) {
              return "vendor-charts";
            }
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
