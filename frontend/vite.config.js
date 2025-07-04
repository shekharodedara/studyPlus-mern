import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), mkcert()],
    server: {
      host: true,
      proxy: {
        "/api": {
          target: env.VITE_APP_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});