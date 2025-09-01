import { executeScript } from "./scriptExecutor.js";

export async function callScriptExecutor(schema, cmdType, pkg) {
  try {
    const scriptFile = schema[cmdType]?.[pkg];
    if (!scriptFile) {
      console.error(`No ${cmdType} script found for package: ${pkg}`);
      process.exit(1);
    }
    const output = await executeScript(cmdType, scriptFile);
    return output;
  } catch (error) {
    console.error(`Error executing ${cmdType} script: ${error.message}`);
    process.exit(1);
  }
}
