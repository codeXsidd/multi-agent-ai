from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

class MemoryItem:
    def __init__(self, role: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        self.id = str(uuid.uuid4())
        self.role = role
        self.content = content
        self.timestamp = datetime.utcnow()
        self.metadata = metadata or {}
        
    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata
        }

class BaseMemory:
    def add_message(self, role: str, content: str, metadata: Optional[Dict[str, Any]] = None) -> MemoryItem:
        raise NotImplementedError

    def get_context(self, limit: int = 10) -> List[Dict[str, Any]]:
        raise NotImplementedError
        
    def clear(self):
        raise NotImplementedError

class SimpleMemory(BaseMemory):
    """In-memory storage for short-term context."""
    def __init__(self):
        self.messages: List[MemoryItem] = []

    def add_message(self, role: str, content: str, metadata: Optional[Dict[str, Any]] = None) -> MemoryItem:
        item = MemoryItem(role, content, metadata)
        self.messages.append(item)
        return item

    def get_context(self, limit: int = 10) -> List[Dict[str, Any]]:
        # Return last N messages formatted for LLM
        return [{"role": msg.role, "content": msg.content} for msg in self.messages[-limit:]]
    
    def get_all(self):
        return [msg.to_dict() for msg in self.messages]
    
    def clear(self):
        self.messages = []
