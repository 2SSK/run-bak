import { proxyActivities } from "@temporalio/workflow";

const activities = proxyActivities({
  startToCloseTimeout: "5 minute",
});

export async function RunScriptWorkflow(args) {
  if (!args || !args.type) {
    throw new Error("type is required (install|remove|update|maintain)");
  }
  if (!args.pkg) {
    throw new Error("pkg is required");
  }
  if (!args.user) {
    throw new Error("User is required");
  }

  const result = await activities.runScript({
    type: args.type,
    pkg: args.pkg,
    user: args.user,
  });
  return result;
}
