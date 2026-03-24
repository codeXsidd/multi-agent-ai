# Multi AI Agent Platform 🚀

## 📌 About
An open-source platform where multiple AI agents collaborate to solve complex, delegatable tasks. It provides a developer-friendly, asynchronous multi-agent architecture.

## ✨ Features
- Asynchronous multi-agent modular architecture
- Built-in task orchestrator and in-memory short-term context
- Sleek Kanban-like task board with real-time event stream
- Developer-friendly plugin system (e.g., Calculator tool included)

## 🛠 Tech Stack
- Python / FastAPI
- React / Vite
- Node.js

## 🚀 Getting Started
### Using Setup Scripts (Recommended)
We've provided quick setup scripts to get both the backend and frontend running simultaneously.
- **Windows**: Run `setup.bat`
- **Linux/Mac**: Run `bash setup.sh`

### Manual Setup
1. **Backend**: Navigate to `src/backend`. Create a `.env` with your `OPENAI_API_KEY`. Create a virtual environment, install `requirements.txt`, and run `uvicorn main:app --reload`.
2. **Frontend**: Navigate to `src/frontend`. Run `npm install` and `npm run dev`.

The UI will be available at `http://localhost:5173`. The API will be available at `http://localhost:8000`.

## 🤝 Contribution Guide
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. 

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us. Also check out issues labeled `good-first-issue` if you want a great place to start!

## ⭐ Star this repo
If you find this project useful, please consider giving it a star! It helps us a lot.
