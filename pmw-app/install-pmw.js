import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = path.dirname(fileURLToPath(import.meta.url));
const localAppData = process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local");
const installRoot = path.join(localAppData, "StandardHarnessPMW", "app");
const desktopDir = path.join(os.homedir(), "Desktop");
const shortcutPath = path.join(desktopDir, "Standard Harness PMW.cmd");
const bundledNode = process.env.STANDARD_HARNESS_BUNDLED_NODE;
const installedNodePath = path.join(installRoot, "runtime-node", "node.exe");

fs.mkdirSync(installRoot, { recursive: true });
copyIfExists("package.json");
copyIfExists("START_PMW.cmd");
copyIfExists("INSTALL_PMW.cmd");
copyIfExists("install-pmw.js");
copyDirectory("runtime");
if (bundledNode && fs.existsSync(bundledNode)) {
  fs.mkdirSync(path.dirname(installedNodePath), { recursive: true });
  fs.copyFileSync(bundledNode, installedNodePath);
}

const nodeCommand = fs.existsSync(installedNodePath) ? installedNodePath : "node";

fs.mkdirSync(desktopDir, { recursive: true });
fs.writeFileSync(
  shortcutPath,
  [
    "@echo off",
    `pushd "${installRoot}" >nul`,
    "start \"\" \"http://127.0.0.1:4174\"",
    `"${nodeCommand}" "runtime\\server.js"`,
    "set \"EXIT_CODE=%ERRORLEVEL%\"",
    "popd >nul",
    "exit /b %EXIT_CODE%",
    ""
  ].join("\r\n"),
  "utf8"
);

process.stdout.write(
  [
    "Standard Harness PMW installed.",
    `- App folder: ${installRoot}`,
    fs.existsSync(installedNodePath) ? `- Bundled runtime: ${installedNodePath}` : "- Bundled runtime: not installed; system Node.js is required",
    `- Desktop launcher: ${shortcutPath}`,
    `- Registry path: ${path.join(process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"), "StandardHarnessPMW", "projects.json")}`,
    "- Start PMW from the desktop shortcut or run START_PMW.cmd in the app folder."
  ].join("\n") + "\n"
);

function copyIfExists(relativePath) {
  const source = path.join(sourceRoot, relativePath);
  if (!fs.existsSync(source)) {
    return;
  }
  fs.copyFileSync(source, path.join(installRoot, relativePath));
}

function copyDirectory(relativePath) {
  const source = path.join(sourceRoot, relativePath);
  const target = path.join(installRoot, relativePath);
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}
