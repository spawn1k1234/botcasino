import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // для относительных путей
  root: ".", // указывает на корень проекта
  publicDir: "public", // указывает папку с публичными файлами
});
