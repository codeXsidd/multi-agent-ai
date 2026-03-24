from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.api.router import api_router
from backend.core.manager import manager
from backend.core.agent import BaseAgent

# Load environment variables (e.g., OPENAI_API_KEY)
load_dotenv()

app = FastAPI(
    title="Multi AI Agent Platform API",
    description="API for managing and interacting with multiple collaborating AI agents.",
    version="1.0.0"
)

# Enable CORS for frontend flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    # Initialize some default agents for the platform
    research_agent = BaseAgent(
        name="ResearchAgent",
        role="Researcher",
        system_prompt="You are a meticulous researcher. Your job is to gather accurate and concise information. Present it clearly."
    )
    writer_agent = BaseAgent(
        name="WriterAgent",
        role="Writer",
        system_prompt="You are a creative technical writer. Your job is to format text creatively using Markdown. Ensure the result is readable and engaging."
    )
    
    manager.register_agent(research_agent)
    manager.register_agent(writer_agent)
    print("Default agents initialized!")

@app.get("/")
async def root():
    return {"message": "Welcome to the Multi AI Agent Platform API. Head to /docs for Swagger UI API references."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
