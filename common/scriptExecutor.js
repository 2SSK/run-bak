import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.dirname(__filename);
const repoRoot = path.resolve(projectRoot, "..");
const scriptDir = path.join(repoRoot, "scripts");

const commmandTypeScriptPath = {
  install: path.join(scriptDir, "install"),
  remove: path.join(scriptDir, "remove"),
  update: path.join(scriptDir, "update"),
  maintain: path.join(scriptDir, "maintain"),
};

export async function executeScript(type, script) {
  const baseDir = commmandTypeScriptPath[type];
  if (!baseDir) {
    throw new Error(`Unsupported script type: ${type}`);
  }
  const scriptPath = path.join(baseDir, script);
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Script not found at path: ${scriptPath}`);
  }
  console.log(`Executing script: ${scriptPath}`);

  try {
    try {
      await fs.promises.chmod(scriptPath, 0o755);
    } catch (_) {
      // Ignore chmod errors (e.g., read-only filesystem); attempt execution anyway
    }

    const quotedPath = `'${scriptPath.replace(/'/g, "'\\''")}'`;
    const command = `sudo /usr/bin/env bash ${quotedPath}`;
    const child = exec(command, {
      env: {
        ...process.env,
        DEBIAN_FRONTEND: "noninteractive",
        APT_LISTCHANGES_FRONTEND: "none",
        CI: "1",
      },
      maxBuffer: 1024 * 1024 * 100,
    });

    let capturedStdout = "";
    let capturedStderr = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      capturedStdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      capturedStderr += text;
      process.stderr.write(text);
    });

    const exitCode = await new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", resolve);
      child.on("exit", resolve);
    });

    if (exitCode !== 0) {
      throw new Error(
        `Script exited with code ${exitCode}: ${capturedStderr.trim()}`,
      );
    }

    return capturedStdout;
  } catch (error) {
    console.error(`Error executing script: ${error.message}`);
    throw new Error(`Script execution failed: ${error.message}`);
  }
}
