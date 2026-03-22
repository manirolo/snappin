import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    name: "api",       
    environment: "node",
    globals: true,
    include: ["**/__tests__/**/*.test.ts"],
  },
})