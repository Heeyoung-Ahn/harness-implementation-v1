@echo off
setlocal EnableExtensions

for /f "usebackq delims=" %%V in (`node --version 2^>nul`) do set "NODE_VERSION=%%V"
if not defined NODE_VERSION (
  echo Node.js 24 or newer is required before installing PMW.
  exit /b 1
)

node "%~dp0install-pmw.js" %*
exit /b %ERRORLEVEL%
