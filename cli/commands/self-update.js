import { Command } from "commander";
import { spawn, spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

function findProjectRoot(startDir) {
  let current = startDir;
  while (true) {
    const pkg = path.join(current, "package.json");
    const scriptsDir = path.join(current, "scripts");
    if (fs.existsSync(pkg) && fs.existsSync(scriptsDir)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return startDir; // Fallback
    current = parent;
  }
}

function runStep(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`$ ${command} ${args.join(" ")}`);
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: "inherit",
      shell: false,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

function hasCommand(command) {
  try {
    const result = spawnSync(command, ["--version"], { stdio: "ignore" });
    return result.status === 0;
  } catch (_) {
    return false;
  }
}

function resolvePackageManager() {
  if (hasCommand("pnpm"))
    return {
      cmd: "pnpm",
      linkArgs: ["link", "--global"],
      installArgs: ["install"],
      buildArgs: ["run", "build:cli"],
    };
  if (hasCommand("npm"))
    return {
      cmd: "npm",
      linkArgs: ["link"],
      installArgs: ["install"],
      buildArgs: ["run", "build:cli"],
    };
  return null;
}

export function selfUpdateCommand() {
  const cmd = new Command("self-update")
    .description("Update the CLI (git pull), rebuild, and link globally")
    .action(async () => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      // Works from both src and dist
      const probableRootFromDist = path.resolve(__dirname, "../../../..");
      const probableRootFromSrc = path.resolve(__dirname, "../..");
      const startDir = fs.existsSync(path.join(probableRootFromDist, "package.json"))
        ? probableRootFromDist
        : probableRootFromSrc;
      const projectRoot = findProjectRoot(startDir);

      console.log(`Project root: ${projectRoot}`);

      const hasGit = fs.existsSync(path.join(projectRoot, ".git"));
      try {
        const pm = resolvePackageManager();
        if (!pm) {
          throw new Error("No supported package manager found. Install pnpm or npm.");
        }
        if (hasGit) {
          await runStep("git", ["fetch", "--all"], projectRoot);
          await runStep("git", ["pull", "--rebase"], projectRoot);
        } else {
          console.log(".git not found; skipping git pull.");
        }

        await runStep(pm.cmd, pm.installArgs, projectRoot);
        await runStep(pm.cmd, pm.buildArgs, projectRoot);
        await runStep(pm.cmd, pm.linkArgs, projectRoot);

        console.log("Self-update complete. You can now run: run --version");
      } catch (error) {
        console.error(`Self-update failed: ${error.message}`);
        process.exitCode = 1;
      }
    });

  return cmd;
}
