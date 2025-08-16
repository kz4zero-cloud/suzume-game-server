@echo off
cd /d "C:\Users\coupl\Desktop\game\my-multiplayer-game"

REM サーバー起動（バックグラウンド）
start cmd /k "node server.js"

REM ngrokでポート3000を外部公開
ngrok http 3000
pause
