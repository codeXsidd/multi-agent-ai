# Multi AI Agent Platform

An open-source (MIT Licensed) platform where multiple AI agents collaborate to solve complex, delegatable tasks. Built with a FastAPI backend and a modern React (Vite) frontend.

## Features
- **Backend**: FastAPI with async multi-agent modular architecture. Includes base agents, a task orchestrator, in-memory short-term context storage, and an asynchronous message broker for agent-to-agent communication.
- **Frontend**: A sleek, dark-themed React application providing a Kanban-like task board, agent registry, and a real-time system event stream.
- **Plugin Architecture**: A developer-friendly interface for dynamically adding custom tools (e.g., a Calculator plugin is provided).
- **Extensible**: The platform gracefully falls back to mock responses if no `OPENAI_API_KEY` is provided, meaning you can test the UI without an API key.

## Folder Structure
```
.
├── backend/
│   ├── api/
│   │   └── router.py           # REST Endpoints for frontend
│   ├── core/
│   │   ├── agent.py            # BaseAgent class wrapping LLMs and memory
│   │   ├── manager.py          # Orchestrates task delegation
│   │   ├── memory.py           # In-memory context storage
│   │   └── communication.py    # Pub/Sub system for agents
│   ├── plugins/
│   │   ├── base.py             # Plugin interface
│   │   └── calculator.py       # Example tool
│   ├── main.py                 # FastAPI Application entry point
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/                # API client connection to backend
│   │   ├── components/         # React Components (TaskBoard, etc.)
│   │   ├── App.tsx             # Main React view
│   │   └── index.css           # Styling
│   └── package.json            # Node dependencies
├── setup.bat                   # Windows quick-start script
├── setup.sh                    # Mac/Linux quick-start script
└── LICENSE                     # MIT License
```

## Setup Guide

### Option 1: Using the setup scripts (Recommended)
We've provided quick setup scripts to get both the backend and frontend running simultaneously.
- **Windows**: Run `setup.bat`
- **Linux/Mac**: Run `bash setup.sh`

### Option 2: Manual Setup

#### 1. Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```
To enable actual AI completions, create a `.env` file in the `backend/` directory:
```
OPENAI_API_KEY=your-api-key-here
```
Run the server:
```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`. Swagger API docs at `http://localhost:8000/docs`.

#### 2. Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at `http://localhost:5173`.

## Developer API Quickstart
The backend exposes comprehensive REST APIs for custom clients:
- `GET /api/agents` - List all registered agents.
- `POST /api/agents` - Create a new dynamic agent.
- `POST /api/tasks` - Delegate a task.
- `GET /api/system/events` - Get the message broker's history.

## License
MIT License.
