import { NativeConnection, Worker } from "@temporalio/worker";
import app from "./bootstrap/app.js";
import ErrorHandler from "./core/ErrorHandler.js";

async function run() {
  try {
    const config = app.service("config").temporal;
    const logger = app.service("logger");
    const allActivities = app.service("activities");
    const workflows = app.service("workflows");
    const workflowMetadata = app.service("workflowMetadata");

    logger.info("Connecting to Temporal", { address: config.serverAddress });
    const connection = await NativeConnection.connect({
      address: config.serverAddress,
    });

    const workers = [];
    const uniqueTaskQueues = new Set();
    const workflowTaskQueueMap = {};
    const workflowMap = {};

    Object.entries(workflowMetadata).forEach(([workflowName, metadata]) => {
      const taskQueues = Array.isArray(metadata.taskQueue)
        ? metadata.taskQueue
        : [metadata.taskQueue];

      taskQueues.forEach((queue) => uniqueTaskQueues.add(queue));

      workflowMap[workflowName] = {
        workflow: workflows[workflowName],
        activityDependencies: new Set(metadata.activityDependencies),
        taskQueues: taskQueues,
      };

      taskQueues.forEach((taskQueue) => {
        if (!workflowTaskQueueMap[taskQueue]) {
          workflowTaskQueueMap[taskQueue] = {
            workflows: {},
          };
        }

        workflowTaskQueueMap[taskQueue].workflows[workflowName] =
          workflows[workflowName];
      });
    });

    logger.info("Workflow to Activity mappings:", {
      workflows: Object.keys(workflowMap).map((name) => ({
        name,
        taskQueues: workflowMap[name].taskQueues,
        activities: [...workflowMap[name].activityDependencies],
      })),
    });

    let workflowPath;

    for (const namespace of config.namespaces) {
      for (const taskQueue of uniqueTaskQueues) {
        const taskQueueData = workflowTaskQueueMap[taskQueue];
        const taskQueueWorkflows = Object.keys(taskQueueData.workflows);
        const activities = {};

        taskQueueWorkflows.forEach((workflowName) => {
          const workflow = workflowMap[workflowName];
          workflow.activityDependencies.forEach((activityName) => {
            if (allActivities[activityName]) {
              activities[activityName] = allActivities[activityName];
            } else {
              logger.warn(
                `Activity ${activityName} not found but required by workflow "${workflowName}"`
              );
            }
          });
          workflowPath = workflowMap[workflowName].workflow.toString();
        });

        const workflowDetails = taskQueueWorkflows.map((wfName) => {
          const wf = workflowMap[wfName];
          return {
            name: wfName,
            registeredInTaskQueue: wf.taskQueues,
            currentTaskQueue: taskQueue,
            activityDependencies: [...wf.activityDependencies],
          };
        });

        const activityNames = Object.keys(activities);

        logger.info("Creating worker with workflow-activity mapping", {
          namespace,
          taskQueue,
          workflows: workflowDetails,
          registeredActivities: activityNames,
          totalActivities: activityNames.length,
        });

        const worker = await Worker.create({
          connection,
          namespace,
          workflowsPath: workflowPath,
          activities,
          taskQueue,
          maxConcurrentActivityTaskExecutions: 10,
          maxConcurrentWorkflowTaskExecutions: 50,
        });

        workers.push(worker);
      }
    }

    logger.info(`Started workers`, { count: workers.length });
    await Promise.all(workers.map((worker) => worker.run()));

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down graceffully...`);
      await Promise.all(workers.map((worker) => worker.shutdown()));
      setTimeout(() => {
        logger.info("Worker shutdown complete.");
        process.exit(0);
      }, 1000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    ErrorHandler.handle(err, "Worker initialization");
    process.exit(1);
  }
}

run();
