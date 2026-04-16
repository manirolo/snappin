import { defineConfig } from "@trigger.dev/sdk/v3";
import { syncEnvVars } from "@trigger.dev/build/extensions/core";
import dotenvx from "@dotenvx/dotenvx";
import { readFileSync } from "fs";

export default defineConfig({
  project: "proj_zwtnczkjxkhnfysisekz",
  runtime: "node",
  logLevel: "log",
  machine: "medium-1x",
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  extensions: [
    syncEnvVars(async () => {
      const envContent = readFileSync(".env.production", "utf-8");
      const parsed = dotenvx.parse(envContent);
      return parsed ?? {};
    }),
  ],
  dirs: ["./invoice/trigger", "./accounts/trigger", "./mobileScanners/trigger"],
});
