import os
import uuid
import json
from typing import List, Dict, Any, Optional
from backend.core.memory import SimpleMemory
from backend.core.communication import broker, Message

class BaseAgent:
    def __init__(self, name: str, role: str, system_prompt: str, tools: Optional[List[Dict[str, Any]]] = None):
        self.id = str(uuid.uuid4())
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.memory = SimpleMemory()
        self.memory.add_message("system", self.system_prompt)
        self.tools = tools or []
        
        # Subscribe to broker
        broker.subscribe(self.id, self.handle_message)

    async def handle_message(self, message: Message):
        """Called by the broker when a message is received"""
        self.memory.add_message("user", f"Message from {message.sender_id}: {message.content}")

    async def execute_task(self, task_description: str) -> str:
        """Process a task using LLM or fallback."""
        self.memory.add_message("user", task_description)
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "dummy" or api_key == "":
            response_content = (
                f"[{self.name}] Default Mock Response. I've received your task: '{task_description}'.\n"
                f"(Configure OPENAI_API_KEY in .env to enable real AI processing.)"
            )
            self.memory.add_message("assistant", response_content)
            return response_content
            
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=api_key)
            messages = self.memory.get_context(limit=10)
            
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            
            response_content = response.choices[0].message.content
            self.memory.add_message("assistant", response_content)
            return response_content
            
        except Exception as e:
            error_msg = f"[{self.name}] Error executing task: {str(e)}"
            self.memory.add_message("assistant", error_msg)
            return error_msg
            
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "system_prompt": self.system_prompt
        }
