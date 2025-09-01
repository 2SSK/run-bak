import app from "../bootstrap/app.js";
import { startChild } from "@temporalio/workflow";

async function startWorkflow(
  workflowRef,
  { workflowId, taskQueue, args = [] },
) {
  const { getTemporalClient } = app.service("temporalClient");
  const client = await getTemporalClient();

  const workflow = await client.workflow.start(workflowRef, {
    workflowId,
    taskQueue,
    args,
  });

  const result = {
    handle: workflow.result(),
    workflowId: workflow.workflowId,
    firstExecutionRunId: workflow.firstExecutionRunId,
  };

  return result;
}

async function startChildWorkflow(childWorkflow, options) {
  return await startChild(childWorkflow, options);
}

export { startWorkflow, startChildWorkflow };
