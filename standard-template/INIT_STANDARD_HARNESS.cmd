@echo off
setlocal EnableExtensions EnableDelayedExpansion
set "PAUSE_ON_EXIT="
echo(%CMDCMDLINE%| findstr /i /c:"%~nx0" >nul && set "PAUSE_ON_EXIT=1"

pushd "%~dp0" >nul
for /f "usebackq delims=" %%V in (`node --version 2^>nul`) do set "NODE_VERSION=%%V"
if not defined NODE_VERSION (
  echo Node.js 24 or newer is required before initializing the standard harness starter.
  set "EXIT_CODE=1"
  goto finish
)

set "NODE_VERSION=!NODE_VERSION:v=!"
for /f "tokens=1 delims=." %%M in ("!NODE_VERSION!") do set "NODE_MAJOR=%%M"
echo(!NODE_MAJOR!| findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
  echo Failed to parse the installed Node.js version: v!NODE_VERSION!
  echo Node.js 24 or newer is required before initializing the standard harness starter.
  set "EXIT_CODE=1"
  goto finish
)

set /a NODE_MAJOR_NUM=NODE_MAJOR
if !NODE_MAJOR_NUM! LSS 24 (
  echo Node.js 24 or newer is required before initializing the standard harness starter.
  echo Detected version: v!NODE_VERSION!
  set "EXIT_CODE=1"
  goto finish
)

node ".agents\scripts\init-project.js" %*
set "EXIT_CODE=%ERRORLEVEL%"
if "%EXIT_CODE%"=="0" (
  echo.
  echo Initialization finished. Review the next-step summary above before closing this window.
)
:finish
if defined PAUSE_ON_EXIT (
  echo.
  if "%EXIT_CODE%"=="0" (
    echo Press any key to close this window.
  ) else (
    echo Initialization did not complete. Press any key to close this window.
  )
  pause >nul
)
popd >nul
exit /b %EXIT_CODE%
