@echo off
title Quiropractica Leon Universal - Servidor Local
color 0B
echo ============================================================
echo       QUIROPRACTICA LEON UNIVERSAL - SERVIDOR LOCAL
echo ============================================================
echo.
echo Iniciando servidor y esperando conexion en http://localhost:3000 ...
echo.

SET "PATH=%LOCALAPPDATA%\Programs\nodejs;%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
cd /d "D:\QUIROPRAXIA LEON"

:: Esperar a que el servidor este 100% listo antes de abrir el navegador
start "" /b powershell -WindowStyle Hidden -NoProfile -Command "for ($i = 0; $i -lt 30; $i++) { Start-Sleep -Seconds 1; try { $tcp = New-Object System.Net.Sockets.TcpClient('127.0.0.1', 3000); if ($tcp.Connected) { $tcp.Close(); Start-Sleep -Milliseconds 600; break } } catch {} }; Start-Process 'http://localhost:3000/admin'"

:: Iniciar la aplicacion
call npm.cmd run dev

pause
