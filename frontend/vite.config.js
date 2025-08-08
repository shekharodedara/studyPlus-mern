import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    build:
      env.VITE_APP_IS_PRODUCTION === "true"
        ? {
            sourcemap: false,
            brotliSize: false,
            cssCodeSplit: false,
            minify: "esbuild",
          }
        : undefined,
    plugins:
      env.VITE_APP_IS_PRODUCTION === "true" ? [react()] : [react(), mkcert()],
    server:
      env.VITE_APP_IS_PRODUCTION === "false"
        ? {
            host: true,
            proxy: {
              "/api": {
                target: env.VITE_APP_BACKEND_URL,
                changeOrigin: true,
                secure: false,
              },
            },
          }
        : undefined,
  };
});
