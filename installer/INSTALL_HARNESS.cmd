@echo off
setlocal EnableExtensions
pushd "%~dp0\.." >nul
node "installer\install-harness.js" %*
set "EXIT_CODE=%ERRORLEVEL%"
popd >nul
exit /b %EXIT_CODE%
