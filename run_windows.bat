@echo off
title iDotMatrix Manager
echo Baslatiliyor... Lutfen bekleyin.
if exist "backend\venv\Scripts\python.exe" (
    start "iDotMatrix Manager" "backend\venv\Scripts\python.exe" launcher.py
) else (
    echo Python sanal ortami bulunamadi. Lutfen once kurulumu yapin.
    pause
)
