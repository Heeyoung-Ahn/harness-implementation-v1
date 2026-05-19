@echo off
setlocal EnableExtensions
set "PAUSE_ON_EXIT="
echo(%CMDCMDLINE%| findstr /i /c:"%~nx0" >nul && set "PAUSE_ON_EXIT=1"
pushd "%~dp0\.." >nul
node "installer\install-harness.js" %*
set "EXIT_CODE=%ERRORLEVEL%"
if defined PAUSE_ON_EXIT (
  echo.
  if "%EXIT_CODE%"=="0" (
    echo Installation finished. Press any key to close this window.
  ) else (
    echo Installation did not complete. Press any key to close this window.
  )
  pause >nul
)
popd >nul
exit /b %EXIT_CODE%
