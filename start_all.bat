@echo off
echo Starting NyayaSetu AI Services...

start cmd /k "cd ai && python app.py"
start cmd /k "cd backend && node server.js"
start cmd /k "cd frontend && npm start"

echo All services are starting in separate windows.
echo Frontend: http://localhost:3000
echo Gateway: http://localhost:5000
echo AI Service: http://localhost:5001
