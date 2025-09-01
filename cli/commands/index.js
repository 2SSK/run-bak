import { Command } from "commander";
import { installCommand } from "./install.js";
import { listCommand } from "./list.js";
import { removeCommand } from "./remove.js";
import { selfUpdateCommand } from "./self-update.js";
import { updateCommand } from "./update.js";
import { maintainCommand } from "./maintain.js";

export function mainCLI() {
  const program = new Command();

  program
    .name("mycli")
    .description("A modular CLI built with commander.js")
    .version("1.0.0");

  // Register the subcommands
  program.addCommand(selfUpdateCommand());
  program.addCommand(listCommand());
  program.addCommand(installCommand());
  program.addCommand(removeCommand());
  program.addCommand(updateCommand());
  program.addCommand(maintainCommand());

  program.parse(process.argv);
}
