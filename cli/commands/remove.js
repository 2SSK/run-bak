import { Command } from "commander";
import { callScriptExecutor } from "../../common/callScriptExecutor.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const schema = require("../schema.json");

export function removeCommand() {
  const cmd = new Command("remove")
    .description("Remove packages using bash script")
    .argument("<packages...>", "Package to remove")
    .option("-a, --all", "Remove multiple packages")
    .action(async (packages, options) => {
      if (options.all) {
        for (const pkg of packages) {
          console.log(`Removing package: ${pkg}`);
          await callScriptExecutor(schema, "remove", pkg);
        }
      } else {
        const target = packages[0];
        console.log(`Remove package: ${target}`);
        await callScriptExecutor(schema, "remove", target);
      }
    });
  return cmd;
}
