@echo off
setlocal EnableExtensions
pushd "%~dp0" >nul
if not exist ".package\standard-template\package.json" (
  echo Package payload is missing. Keep .package next to this installer.
  popd >nul
  exit /b 1
)
node ".package\installer\install-harness.js" --authority-source local %*
set "EXIT_CODE=%ERRORLEVEL%"
popd >nul
exit /b %EXIT_CODE%
