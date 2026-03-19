import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const normalizeBasePath = (value?: string) => {
  if (!value || value === "/") {
    return "/";
  }

  const trimmed = value.trim();
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutDuplicateTrailingSlashes = withLeadingSlash.replace(/\/+$/, "");

  return `${withoutDuplicateTrailingSlashes}/`;
};

const inferProductionBasePath = () => {
  if (process.env.VITE_BASE_PATH) {
    return normalizeBasePath(process.env.VITE_BASE_PATH);
  }

  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    return "/";
  }

  const [owner, repo] = repository.split("/");
  if (!owner || !repo) {
    return "/";
  }

  return repo === `${owner}.github.io` ? "/" : normalizeBasePath(repo);
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? inferProductionBasePath() : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
