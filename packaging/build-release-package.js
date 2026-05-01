import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RELEASE_BASELINE } from "../.harness/runtime/state/release-baseline.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = path.join(repoRoot, "dist", RELEASE_BASELINE.releasePackageDirectory);
const payloadRoot = path.join(packageRoot, ".package");

if (fs.existsSync(packageRoot)) {
  throw new Error(`Release package already exists: ${packageRoot}`);
}

fs.mkdirSync(payloadRoot, { recursive: true });

copyDirectory("standard-template", path.join(payloadRoot, "standard-template"));
copyDirectory("installer", path.join(payloadRoot, "installer"));
copyDirectory("pmw-app", path.join(payloadRoot, "pmw-app"));

copyFile("reference/manuals/HARNESS_MANUAL.md", path.join(packageRoot, "HARNESS_MANUAL.md"));
copyFile("reference/manuals/PMW_MANUAL.md", path.join(packageRoot, "PMW_MANUAL.md"));
writeHarnessInstaller(path.join(packageRoot, "INSTALL_HARNESS.cmd"));
writePmwInstaller(path.join(packageRoot, "INSTALL_PMW.cmd"));

process.stdout.write(
  [
    "Release package built.",
    `- Folder: ${packageRoot}`,
    "- Top-level files:",
    "  - INSTALL_HARNESS.cmd",
    "  - HARNESS_MANUAL.md",
    "  - INSTALL_PMW.cmd",
    "  - PMW_MANUAL.md",
    "- Internal payload: .package/"
  ].join("\n") + "\n"
);

function copyDirectory(relativeSource, target) {
  const source = path.join(repoRoot, relativeSource);
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, {
    recursive: true,
    filter(sourcePath) {
      const normalized = sourcePath.replaceAll("\\", "/");
      return !normalized.endsWith("/.harness/operating_state.sqlite") &&
        !normalized.endsWith("/.harness/operating_state.sqlite-shm") &&
        !normalized.endsWith("/.harness/operating_state.sqlite-wal") &&
        !normalized.includes("/.tmp/");
    }
  });
}

function copyFile(relativeSource, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(repoRoot, relativeSource), target);
}

function writeHarnessInstaller(target) {
  fs.writeFileSync(
    target,
    [
      "@echo off",
      "setlocal EnableExtensions",
      "pushd \"%~dp0\" >nul",
      "if not exist \".package\\standard-template\\package.json\" (",
      "  echo Package payload is missing. Keep .package next to this installer.",
      "  popd >nul",
      "  exit /b 1",
      ")",
      "node \".package\\installer\\install-harness.js\" %*",
      "set \"EXIT_CODE=%ERRORLEVEL%\"",
      "popd >nul",
      "exit /b %EXIT_CODE%",
      ""
    ].join("\r\n"),
    "utf8"
  );
}

function writePmwInstaller(target) {
  fs.writeFileSync(
    target,
    [
      "@echo off",
      "setlocal EnableExtensions",
      "pushd \"%~dp0\" >nul",
      "if not exist \".package\\pmw-app\\INSTALL_PMW.cmd\" (",
      "  echo Package payload is missing. Keep .package next to this installer.",
      "  popd >nul",
      "  exit /b 1",
      ")",
      "call \".package\\pmw-app\\INSTALL_PMW.cmd\" %*",
      "set \"EXIT_CODE=%ERRORLEVEL%\"",
      "popd >nul",
      "exit /b %EXIT_CODE%",
      ""
    ].join("\r\n"),
    "utf8"
  );
}
