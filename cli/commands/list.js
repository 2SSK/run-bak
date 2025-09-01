import { Command } from "commander";

export function listCommand() {
  const cmd = new Command("list")
    .description("List all available packages")
    .action(() => {
      console.log("Listing all available packages...");
      console.log("Not implemented yet.");
    });

  return cmd;
}
