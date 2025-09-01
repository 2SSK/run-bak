import { Command } from "commander";
import { callScriptExecutor } from "../../common/callScriptExecutor.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const schema = require("../schema.json");

export function installCommand() {
  const cmd = new Command("install")
    .description("Install packages using bash script")
    .argument("<packages...>", "Package to install")
    .option("-a, --all", "Install multiple packages")
    .action(async (packages, options) => {
      if (options.all) {
        for (const pkg of packages) {
          console.log(`Installing package: ${pkg}`);
          await callScriptExecutor(schema, "install", pkg);
        }
      } else {
        const target = packages[0];
        console.log(`Installing package: ${target}`);
        await callScriptExecutor(schema, "install", target);
      }
    });
  return cmd;
}
