@echo off
title Quiropractica Leon Universal - Servidor Local
color 0B
echo ============================================================
echo       QUIROPRACTICA LEON UNIVERSAL - SERVIDOR LOCAL
echo ============================================================
echo.
echo Iniciando servidor y abriendo navegador en http://localhost:3000 ...
echo.

SET "PATH=%LOCALAPPDATA%\Programs\nodejs;%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
cd /d "D:\QUIROPRAXIA LEON"

:: Abrir navegador automaticamente
start "" /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: Iniciar la aplicacion
call npm.cmd run dev

pause
