import { Command } from "commander";
import { callScriptExecutor } from "../../common/callScriptExecutor.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const schema = require("../schema.json");

export function updateCommand() {
  const cmd = new Command("update")
    .description("Update packages using bash script")
    .argument("<packages...>", "Package to update")
    .option("-a, --all", "Update multiple packages")
    .action(async (packages, options) => {
      if (options.all) {
        for (const pkg of packages) {
          console.log(`Updating package: ${pkg}`);
          await callScriptExecutor(schema, "update", pkg);
        }
      } else {
        const target = packages[0];
        console.log(`Updating package: ${target}`);
        await callScriptExecutor(schema, "update", target);
      }
    });
  return cmd;
}
