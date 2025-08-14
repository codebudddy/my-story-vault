import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Critical for Firebase Hosting
  build: {
    outDir: "dist", // Ensure output is 'dist'
    rollupOptions: {
      output: {
        manualChunks: {
          "firebase-vendor": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
          ],
        },
      },
    },
  },
});
