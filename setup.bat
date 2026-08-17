@echo off
echo Starting Multi AI Agent Platform...

echo Installing backend dependencies...
cd src\backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..\..

echo Starting FastAPI Server...
start cmd /k "cd src && echo Starting FastAPI Server... && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo Installing frontend dependencies...
cd src\frontend
npm install
start cmd /k "echo Starting Vite Development Server... && npm run dev"
cd ..\..

echo Platform started! Check http://localhost:5173 for the UI.
