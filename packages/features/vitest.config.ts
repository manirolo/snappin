import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    name: "features",        // ← change this to match the package: "core", "features", "api"
    environment: "node",
    globals: true,
    include: ["**/__tests__/**/*.test.ts"],
  },
})