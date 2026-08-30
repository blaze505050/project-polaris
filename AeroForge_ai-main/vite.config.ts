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
  server: {
    port: 5173,
    host: true,
  },
});
