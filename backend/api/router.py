from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from backend.core.manager import manager
from backend.core.agent import BaseAgent
from backend.core.communication import broker

api_router = APIRouter()

class TaskRequest(BaseModel):
    description: str
    agent_id: Optional[str] = None

class AgentCreateRequest(BaseModel):
    name: str
    role: str
    system_prompt: str

@api_router.get("/agents", response_model=List[Dict])
async def get_agents():
    """List all registered agents."""
    return manager.get_agents()

@api_router.post("/agents", response_model=Dict)
async def create_agent(request: AgentCreateRequest):
    """Register a new agent dynamically."""
    new_agent = BaseAgent(
        name=request.name,
        role=request.role,
        system_prompt=request.system_prompt
    )
    agent_id = manager.register_agent(new_agent)
    return {"id": agent_id, "message": f"Agent {request.name} created successfully"}

@api_router.get("/agents/{agent_id}/memory")
async def get_agent_memory(agent_id: str):
    """Retrieve full conversational history for an agent."""
    memory = manager.get_agent_memory(agent_id)
    if memory is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"agent_id": agent_id, "memory": memory}

@api_router.post("/tasks", response_model=Dict)
async def create_task(request: TaskRequest):
    """Formally delegate a new task to the system or specific agent."""
    task_id = await manager.delegate_task(request.description, request.agent_id)
    return {"task_id": task_id, "message": "Task delegated"}

@api_router.get("/tasks", response_model=List[Dict])
async def get_tasks():
    """View all task statuses and results."""
    return manager.get_tasks()

@api_router.get("/system/events")
async def get_system_events():
    """Get history of inter-agent messages."""
    return broker.get_history()
