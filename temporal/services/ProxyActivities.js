import { proxyActivities } from "@temporalio/workflow";

const retryPolicy = {
  initialInterval: 10 * 1000,
  maximumInterval: 2 * 60 * 1000,
  backoffCoefficient: 3.0,
  maximumAttempts: 3,
};

function getActivityProxies(timeout = 10, options = {}) {
  const defaultOptions = {
    startToCloseTimeout: `${timeout} seconds`,
    retry: retryPolicy,
    ...options,
  };
  return proxyActivities(defaultOptions);
}

export async function executeActivity(
  activityName,
  args,
  timeout = 10,
  draftPayload = {}
) {
  const activities = getActivityProxies(timeout);
  try {
    return await activities[activityName](...args);
  } catch (error) {
    if (Object.entries(draftPayload).length > 0) {
      const newPayload = [
        {
          ...draftPayload.args,
          activityName,
          args,
          error: error,
        },
      ];
      await activities[draftPayload.activityName](...newPayload);
    }
    throw error;
  }
}
