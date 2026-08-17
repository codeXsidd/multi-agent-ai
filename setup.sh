#!/bin/bash

echo "Starting Multi AI Agent Platform..."

echo "=================================="
echo "Installing backend dependencies..."
echo "=================================="
cd src/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ../..

# Start backend in background (run from src/ so "backend" package is importable)
echo "Starting FastAPI Server on port 8000..."
cd src
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

echo "=================================="
echo "Installing frontend dependencies..."
echo "=================================="
cd src/frontend
npm install

# Start frontend in background
echo "Starting Vite Development Server..."
npm run dev &
FRONTEND_PID=$!
cd ../..

echo "=================================="
echo "Platform started!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers."
echo "=================================="

# Wait for process to exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
