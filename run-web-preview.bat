@echo off
setlocal
cd /d "%~dp0"
echo Starting Offline Document Translator web preview...
echo.
npm run start:open
pause
