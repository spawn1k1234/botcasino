import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // относительный путь для Vercel
  root: ".", // корень проекта
  publicDir: "public", // указываем папку для статических файлов
});
