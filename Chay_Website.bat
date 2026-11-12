@echo off
title QLTT - Khoi Dong Website
cd /d "%USERPROFILE%\Projects\QLTT"
echo ========================================================
echo   DANG KHOI DONG HE THONG QUAN LY HO SO THANH TOAN (QLTT)
echo ========================================================
echo.
echo Website se mo tai: http://localhost:3000
echo Nhan Ctrl+C de dung may chu khi khong su dung.
echo.
start http://localhost:3000
npm run dev