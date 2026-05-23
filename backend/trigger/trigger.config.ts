import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID || "proj_axhphjkfbiuzydjcqabf",
  logLevel: "log",
  // Maximum wall-clock time a single task run may take (v4 required field).
  // 300s covers large campaign sends and CSV upload processing.
  maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
  dirs: ["./src/tasks"],
});
