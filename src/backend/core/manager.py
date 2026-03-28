from typing import Dict, List, Optional
from backend.core.agent import BaseAgent
from backend.core.communication import broker, Message
import uuid

class TaskManager:
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.tasks: Dict[str, Dict] = {}

    def register_agent(self, agent: BaseAgent):
        self.agents[agent.id] = agent
        return agent.id

    def get_agents(self) -> List[Dict]:
        return [agent.to_dict() for agent in self.agents.values()]

    async def delegate_task(self, task_description: str, agent_id: Optional[str] = None) -> str:
        task_id = str(uuid.uuid4())
        self.tasks[task_id] = {
            "id": task_id,
            "description": task_description, 
            "status": "pending", 
            "result": None,
            "assigned_to": None
        }
        
        if not self.agents:
            self.tasks[task_id]["status"] = "failed"
            self.tasks[task_id]["result"] = "No agents available in the system."
            return task_id
            
        # Select target agent
        if agent_id and agent_id in self.agents:
            target = self.agents[agent_id]
        else:
            target = list(self.agents.values())[0]
            
        self.tasks[task_id]["status"] = "in_progress"
        self.tasks[task_id]["assigned_to"] = target.name
        
        # Execute task
        try:
            result = await target.execute_task(task_description)
            self.tasks[task_id]["status"] = "completed"
            self.tasks[task_id]["result"] = result
            
            # Broadcast the completion message
            msg = Message(sender_id=target.id, receiver_id="all", content=f"Task completed: {task_id}")
            await broker.publish(msg)
            
        except Exception as e:
            self.tasks[task_id]["status"] = "failed"
            self.tasks[task_id]["result"] = str(e)
            
        return task_id
        
    def get_tasks(self) -> List[Dict]:
        return list(self.tasks.values())
        
    def get_agent_memory(self, agent_id: str):
        if agent_id in self.agents:
            return self.agents[agent_id].memory.get_all()
        return []

# Singleton instance
manager = TaskManager()
