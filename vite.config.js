import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ command, mode }) => {
  const plugins = [react()];

  // Conditionally add Replit plugins in development
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer());
    } catch (error) {
      console.warn("Could not load @replit/vite-plugin-cartographer:", error.message);
    }
  }

  try {
    const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorOverlay.default());
  } catch (error) {
    console.warn("Could not load @replit/vite-plugin-runtime-error-modal:", error.message);
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      target: 'es2022',
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    esbuild: {
      target: 'es2022'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2022',
        supported: {
          'top-level-await': true
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 5000,
      allowedHosts: "all",
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});