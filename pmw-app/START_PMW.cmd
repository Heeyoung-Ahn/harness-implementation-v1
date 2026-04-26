@echo off
setlocal EnableExtensions
pushd "%~dp0" >nul
set "PMW_NODE=node"
if exist "%~dp0runtime-node\node.exe" set "PMW_NODE=%~dp0runtime-node\node.exe"
start "" "http://127.0.0.1:4174"
"%PMW_NODE%" "runtime\server.js"
set "EXIT_CODE=%ERRORLEVEL%"
popd >nul
exit /b %EXIT_CODE%
