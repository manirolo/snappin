import { defineConfig } from "@trigger.dev/sdk/v3";

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
  dirs: ["./invoice/trigger", "./inbox/trigger"],
});
