import { workflows } from "../config/workflowModules.js";
import Provider from "./Provider.js";

class WorkflowProvider extends Provider {
  constructor() {
    super();
    this.workflows = workflows;
    this.workflowMetadata = {};
  }

  register() {
    Object.keys(this.workflows).forEach((workflow) => {
      const workflowPath = this.workflows[workflow];
      this.registerWorkflow(workflow, workflowPath.path, {
        taskQueue: workflowPath.queue,
        activityDependencies: workflowPath.activityDependencies,
      });
    });

    this.app.bindService("workflows", this.workflows);
    this.app.bindService("workflowMetadata", this.workflowMetadata);
  }

  boot() {
    // No boot logic needed for workflows
  }

  registerWorkflow(name, workflowPath, metadata = {}) {
    this.workflows[name] = workflowPath;

    const taskQueues = Array.isArray(metadata.taskQueue)
      ? metadata.taskQueue
      : metadata.taskQueue
        ? [metadata.taskQueue]
        : ["default"];

    this.workflowMetadata[name] = {
      taskQueue: taskQueues,
      activityDependencies: metadata.activityDependencies || [],
    };
    return this;
  }
}

export default WorkflowProvider;
