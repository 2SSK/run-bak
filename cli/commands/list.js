import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function listCommand() {
  const cmd = new Command("list")
    .description("List all available packages")
    .action(() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const schemaPath = path.resolve(__dirname, "../schema.json");
      let schema;
      try {
        schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
      } catch (err) {
        console.error("Failed to read schema.json:", err);
        process.exit(1);
      }

      const allPackages = [];
      for (const section of ["install", "remove"]) {
        if (schema[section]) {
          for (const pkg in schema[section]) {
            allPackages.push({ section, pkg, script: schema[section][pkg] });
          }
        }
      }

      const color = (ok) => ok ? '\x1b[32mPresent\x1b[0m' : '\x1b[31mAbsent\x1b[0m';
      const pkgs = [];
      for (const { section, pkg, script } of allPackages) {
        if (!pkgs.some(p => p.pkg === pkg)) {
          const dir = section === "install" ? "install" : "remove";
          const scriptPath = path.resolve(__dirname, `../../scripts/${dir}/${script}`);
          pkgs.push({ pkg, present: fs.existsSync(scriptPath) });
        }
      }
      const maxLen = Math.max(...pkgs.map(p => p.pkg.length));
      console.log("Package status:");
      pkgs.forEach(p => console.log(`- ${p.pkg.padEnd(maxLen)} : ${color(p.present)}`));
    });

  return cmd;
}
