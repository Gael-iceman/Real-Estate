const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const buildPath = path.join(__dirname, "..", "build");
if (!fs.existsSync(buildPath)) {
  console.error("Build folder not found. Run `npm run build` first.");
  process.exit(1);
}

const port = process.env.PORT || "3000";
const args = ["-s", "build", "-l", String(port)];

const child = spawn("serve", args, {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});