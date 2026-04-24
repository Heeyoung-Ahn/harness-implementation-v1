@echo off
setlocal EnableExtensions EnableDelayedExpansion

pushd "%~dp0" >nul
for /f "usebackq delims=" %%V in (`node --version 2^>nul`) do set "NODE_VERSION=%%V"
if not defined NODE_VERSION (
  echo Node.js 24 or newer is required before initializing the standard harness starter.
  popd >nul
  exit /b 1
)

set "NODE_VERSION=!NODE_VERSION:v=!"
for /f "tokens=1 delims=." %%M in ("!NODE_VERSION!") do set "NODE_MAJOR=%%M"
echo(!NODE_MAJOR!| findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
  echo Failed to parse the installed Node.js version: v!NODE_VERSION!
  echo Node.js 24 or newer is required before initializing the standard harness starter.
  popd >nul
  exit /b 1
)

set /a NODE_MAJOR_NUM=NODE_MAJOR
if !NODE_MAJOR_NUM! LSS 24 (
  echo Node.js 24 or newer is required before initializing the standard harness starter.
  echo Detected version: v!NODE_VERSION!
  popd >nul
  exit /b 1
)

node ".agents\scripts\init-project.js" %*
set "EXIT_CODE=%ERRORLEVEL%"
popd >nul
exit /b %EXIT_CODE%
