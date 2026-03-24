@echo off
echo Starting Multi AI Agent Platform...

echo Installing backend dependencies...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
start cmd /k "echo Starting FastAPI Server... && uvicorn main:app --reload"
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
start cmd /k "echo Starting Vite Development Server... && npm run dev"
cd ..

echo Platform started! Check http://localhost:5173 for the UI.
