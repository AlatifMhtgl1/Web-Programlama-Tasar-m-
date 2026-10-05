@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo Gerekli Python paketleri kontrol ediliyor...
py -m pip install -r requirements.txt
if errorlevel 1 (
  echo Paket kurulumu basarisiz. Python ve internet baglantisini kontrol edin.
  pause
  exit /b 1
)
echo Uygulama baslatiliyor. Durdurmak icin Ctrl+C tuslarina basin.
py app.py
pause
