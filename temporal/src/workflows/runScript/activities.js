import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { executeScript } from "../../../../common/scriptExecutor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "../../../schema.json");

export async function runScript({ type, pkg, user }) {
  console.log("Received request to run script via Temporal");
  console.log(`type: ${type}, pkg: ${pkg}, user: ${user}`);

  if (!type) {
    throw new Error("type is required (install|remove|update|maintain)");
  }
  if (!pkg) {
    throw new Error("pkg is required (script/package name)");
  }
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema not found at ${schemaPath}`);
  }

  const schemaRaw = await fs.promises.readFile(schemaPath, "utf-8");
  const schema = JSON.parse(schemaRaw);

  const allowed = schema?.[type] && Object.prototype.hasOwnProperty.call(schema[type], pkg);
  if (!allowed) {
    throw new Error(`Script not allowed by schema: ${type}/${pkg}`);
  }

  const scriptFile = schema[type][pkg];
  const output = await executeScript(type, scriptFile);
  return output.trim().split("\n");
}
