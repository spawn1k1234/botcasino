import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // относительный путь для Vercel
  publicDir: "public", // указываем папку для статических файлов
  build: {
    outDir: "dist", // указываем, куда будет собираться проект
  },
});
