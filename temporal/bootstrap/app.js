import dotenv from "dotenv";
dotenv.config();

import Application from "../core/Application.js";
import WorkflowProvider from "../providers/WorkflowProvider.js";
import ActivityProvider from "../providers/ActivityProvider.js";
import TemporalClientProvider from "../providers/TemporalClientProvider.js";
import Logger from "../core/Logger.js";

const logger = new Logger({
  level: process.env.LOG_LEVEL || "info",
});

const app = new Application();

app.bindService("config", {
  temporal: {
    serverAddress: process.env.TEMPORAL_SERVER_ADDRESS,
    namespaces: (process.env.TEMPORAL_NAMESPACE || "default").split(","),
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
});

app.bindService("logger", logger);

app
  .register(new WorkflowProvider())
  .register(new ActivityProvider())
  .register(new TemporalClientProvider());

app.registerServices().boot();

logger.info("Application started successfully.");

export default app;
