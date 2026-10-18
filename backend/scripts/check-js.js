const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
let failed = false;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (!["node_modules", "dist", "uploads"].includes(entry.name)) walk(full); }
    else if (entry.name.endsWith(".js")) {
      const result = spawnSync(process.execPath, ["--check", full], { encoding: "utf8" });
      if (result.status !== 0) { failed = true; process.stderr.write(result.stderr || result.stdout); }
    }
  }
}
walk(root);
if (failed) process.exit(1);
console.log("JavaScript syntax check passed.");
