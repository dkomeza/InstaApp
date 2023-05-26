import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.join(__dirname, "/src") },
      { find: "@assets", replacement: path.join(__dirname, "/src/assets") },
      { find: "@components", replacement: path.join(__dirname, "/src/components") },
      { find: "@features", replacement: path.join(__dirname, "/src/features") },
      { find: "@layouts", replacement: path.join(__dirname, "/src/layouts") },
      { find: "@lib", replacement: path.join(__dirname, "/src/lib") },
      { find: "@pages", replacement: path.join(__dirname, "/src/pages") },
      { find: "@services", replacement: path.join(__dirname, "/src/services") },
      { find: "@utils", replacement: path.join(__dirname, "/src/utils") },
    ],
  },
});
