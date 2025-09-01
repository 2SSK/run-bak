import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptDir = path.resolve(__dirname, "..", "scripts");

export const actionRegistry = {
  migration: path.join(scriptDir, "migration.sh"),
  moveToProd: path.join(scriptDir, "moveToProd.sh"),
  gitPull: path.join(scriptDir, "gitPull.sh"),
  publish: path.join(scriptDir, "publish.sh"),
};
