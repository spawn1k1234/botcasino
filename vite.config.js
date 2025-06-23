import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // оставляем, если нужна относительная загрузка
  build: {
    outDir: "dist", // ← ключевой момент!
  },
});
