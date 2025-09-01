import { Command } from "commander";
import { callScriptExecutor } from "../../common/callScriptExecutor.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const schema = require("../schema.json");

export function maintainCommand() {
	const cmd = new Command("maintain")
		.description("Maintain packages using bash script")
		.argument("<packages...>", "Package to maintain")
		.option("-a, --all", "Maintain multiple packages")
		.action(async (packages, options) => {
			if (options.all) {
				for (const pkg of packages) {
					console.log(`Maintaining package: ${pkg}`);
					await callScriptExecutor(schema, "maintain", pkg);
				}
			} else {
				const target = packages[0];
				console.log(`Maintaining package: ${target}`);
				await callScriptExecutor(schema, "maintain", target);
			}
		});
	return cmd;
}
