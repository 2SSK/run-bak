import dotenv from "dotenv";
dotenv.config();

const run_script_queue = process.env.RUN_SCRIPT_QUEUE || "run_script_queue";

export const workflows = {
  RunScriptWorkflow: {
    path: new URL("../src/workflows/runScript/workflow.js", import.meta.url)
      .pathname,
    queue: run_script_queue,
    activityDependencies: ["runScript"],
  },
};
