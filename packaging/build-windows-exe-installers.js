import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { RELEASE_BASELINE } from "../.harness/runtime/state/release-baseline.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.resolve(
  process.env.WINDOWS_EXE_OUTPUT_DIR ?? path.join(repoRoot, "dist", RELEASE_BASELINE.windowsExeDirectory)
);
const buildRoot = path.join(os.tmpdir(), `standard-harness-exe-build-${Date.now()}`);
const nodeExe = process.execPath;

if (!fs.existsSync(nodeExe) || path.basename(nodeExe).toLowerCase() !== "node.exe") {
  throw new Error(`This builder must run on Windows with node.exe. Current runtime: ${nodeExe}`);
}
for (const fileName of ["StandardHarnessSetup.exe"]) {
  const target = path.join(outputRoot, fileName);
  if (fs.existsSync(target)) {
    throw new Error(`Windows exe already exists: ${target}`);
  }
}

fs.mkdirSync(outputRoot, { recursive: true });
fs.mkdirSync(buildRoot, { recursive: true });

buildHarnessExe();
copyManuals();

process.stdout.write(
  [
    "Windows exe installers built.",
    `- Folder: ${outputRoot}`,
    "- StandardHarnessSetup.exe",
    "- Manuals copied for operator reference"
  ].join("\n") + "\n"
);

function buildHarnessExe() {
  const stage = path.join(buildRoot, "harness");
  const payload = path.join(stage, "payload");
  fs.mkdirSync(payload, { recursive: true });
  copyDirectory(path.join(repoRoot, "standard-template"), path.join(payload, "standard-template"));
  copyDirectory(path.join(repoRoot, "installer"), path.join(payload, "installer"));
  makeZip(payload, path.join(stage, "payload.zip"));
  fs.copyFileSync(nodeExe, path.join(stage, "node.exe"));
  fs.writeFileSync(path.join(stage, "install-harness.cmd"), harnessInstallCmd(), "utf8");
  fs.writeFileSync(path.join(stage, "install-harness-ui.ps1"), harnessInstallUiPowerShell(), "utf8");
  makeIexpressExe({
    stage,
    targetName: path.join(outputRoot, "StandardHarnessSetup.exe"),
    friendlyName: "Standard Harness Setup",
    appLaunched: "install-harness.cmd",
    installFile: "install-harness.cmd",
    extraFiles: ["install-harness-ui.ps1"],
    sedName: "harness.sed"
  });
}

function copyManuals() {
  fs.copyFileSync(path.join(repoRoot, "reference", "manuals", "HARNESS_MANUAL.md"), path.join(outputRoot, "HARNESS_MANUAL.md"));
}

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, {
    recursive: true,
    filter(sourcePath) {
      const normalized = sourcePath.replaceAll("\\", "/");
      return !normalized.endsWith("/.harness/operating_state.sqlite") &&
        !normalized.endsWith("/.harness/operating_state.sqlite-shm") &&
        !normalized.endsWith("/.harness/operating_state.sqlite-wal") &&
        !normalized.includes("/.tmp/") &&
        !normalized.includes("/dist/");
    }
  });
}

function makeZip(sourceDir, zipPath) {
  execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      `Compress-Archive -Path "${sourceDir}\\*" -DestinationPath "${zipPath}" -Force`
    ],
    { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] }
  );
}

function makeIexpressExe({ stage, targetName, friendlyName, appLaunched, installFile, extraFiles, sedName }) {
  const sedPath = path.join(stage, sedName);
  const temporaryTargetName = path.join(stage, "setup.exe");
  const files = [installFile, ...extraFiles, "node.exe", "payload.zip"];
  const stringLines = files.map((file, index) => `FILE${index}="${file}"`);
  const sourceLines = files.map((_file, index) => `%FILE${index}%=`);
  fs.writeFileSync(
    sedPath,
    [
      "[Version]",
      "Class=IEXPRESS",
      "SEDVersion=3",
      "[Options]",
      "PackagePurpose=InstallApp",
      "ShowInstallProgramWindow=1",
      "HideExtractAnimation=1",
      "UseLongFileName=1",
      "InsideCompressed=0",
      "CAB_FixedSize=0",
      "CAB_ResvCodeSigning=0",
      "RebootMode=N",
      "InstallPrompt=",
      "DisplayLicense=",
      "FinishMessage=",
      `TargetName=${temporaryTargetName}`,
      `FriendlyName=${friendlyName}`,
      `AppLaunched=${appLaunched}`,
      "PostInstallCmd=<None>",
      "AdminQuietInstCmd=",
      "UserQuietInstCmd=",
      "SourceFiles=SourceFiles",
      "[Strings]",
      ...stringLines,
      "[SourceFiles]",
      `SourceFiles0=${stage}\\`,
      "[SourceFiles0]",
      ...sourceLines,
      ""
    ].join("\r\n"),
    "utf8"
  );
  execFileSync("iexpress.exe", ["/N", sedPath], { cwd: stage, stdio: ["ignore", "pipe", "pipe"] });
  fs.copyFileSync(temporaryTargetName, targetName);
}

function harnessInstallCmd() {
  return [
    "@echo off",
    "setlocal EnableExtensions",
    "if \"%~1\"==\"\" goto interactive",
    "set \"WORK=%TEMP%\\StandardHarnessSetup_%RANDOM%_%RANDOM%\"",
    "mkdir \"%WORK%\" >nul 2>nul",
    "powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \"Expand-Archive -LiteralPath '%~dp0payload.zip' -DestinationPath '%WORK%' -Force\"",
    "if errorlevel 1 exit /b %ERRORLEVEL%",
    "set \"STANDARD_HARNESS_BUNDLED_NODE=%~dp0node.exe\"",
    "\"%~dp0node.exe\" \"%WORK%\\installer\\install-harness.js\" %*",
    "set \"EXIT_CODE=%ERRORLEVEL%\"",
    "exit /b %EXIT_CODE%",
    ":interactive",
    "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"%~dp0install-harness-ui.ps1\" -NodePath \"%~dp0node.exe\" -PayloadZip \"%~dp0payload.zip\"",
    "exit /b %ERRORLEVEL%",
    ""
  ].join("\r\n");
}

function harnessInstallUiPowerShell() {
  return [
    "param(",
    "  [Parameter(Mandatory=$true)][string]$NodePath,",
    "  [Parameter(Mandatory=$true)][string]$PayloadZip",
    ")",
    "Add-Type -AssemblyName Microsoft.VisualBasic",
    "Add-Type -AssemblyName System.Windows.Forms",
    "function Ask($title, $message, $default) {",
    "  $value = [Microsoft.VisualBasic.Interaction]::InputBox($message, $title, $default)",
    "  if ([string]::IsNullOrWhiteSpace($value)) { throw 'Installation cancelled.' }",
    "  return $value.Trim()",
    "}",
    "function Slug($value) {",
    "  $slug = ($value.ToLowerInvariant() -replace '[^a-z0-9]+','-').Trim('-')",
    "  if ([string]::IsNullOrWhiteSpace($slug)) { return 'standard-harness-project' }",
    "  return $slug",
    "}",
    "try {",
    "  $projectName = Ask 'Standard Harness Setup' 'Project name' 'New Harness Project'",
    "  $defaultFolder = Join-Path ([Environment]::GetFolderPath('MyDocuments')) (Slug $projectName)",
    "  $targetDir = Ask 'Standard Harness Setup' 'Project repo folder' $defaultFolder",
    "  $profiles = Ask 'Standard Harness Setup' 'Active profiles (example: none or PRF-07,PRF-09)' 'none'",
    "  $work = Join-Path $env:TEMP ('StandardHarnessSetup_' + [guid]::NewGuid().ToString('N'))",
    "  New-Item -ItemType Directory -Path $work -Force | Out-Null",
    "  Expand-Archive -LiteralPath $PayloadZip -DestinationPath $work -Force",
    "  $env:STANDARD_HARNESS_BUNDLED_NODE = $NodePath",
    "  & $NodePath (Join-Path $work 'installer\\install-harness.js') --non-interactive --project-name $projectName --target-dir $targetDir --profiles $profiles",
    "  if ($LASTEXITCODE -ne 0) { throw \"Installer failed with exit code $LASTEXITCODE\" }",
    "  [System.Windows.Forms.MessageBox]::Show(\"Standard Harness installed.`n`nProject: $projectName`nFolder: $targetDir`n`nNext: open the project folder and run HARNESS.cmd status.\", 'Standard Harness Setup') | Out-Null",
    "  exit 0",
    "} catch {",
    "  [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Standard Harness Setup failed') | Out-Null",
    "  exit 1",
    "}",
    ""
  ].join("\r\n");
}
