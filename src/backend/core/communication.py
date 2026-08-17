import asyncio
from typing import Dict, Any, Callable, List, Optional
from datetime import datetime
import uuid

class Message:
    def __init__(self, sender_id: str, receiver_id: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        self.id = str(uuid.uuid4())
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.content = content
        self.timestamp = datetime.utcnow()
        self.metadata = metadata or {}
        
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata
        }

class MessageBroker:
    """Handles agent-to-agent communication."""
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
        self.history: List[Message] = []

    def subscribe(self, agent_id: str, callback: Callable) -> None:
        if agent_id not in self.subscribers:
            self.subscribers[agent_id] = []
        self.subscribers[agent_id].append(callback)

    async def publish(self, message: Message) -> None:
        self.history.append(message)
        # Deliver to global broadcast if receiver is 'all'
        receivers = [message.receiver_id] if message.receiver_id != "all" else list(self.subscribers.keys())
        
        for rec in receivers:
            if rec in self.subscribers:
                for callback in self.subscribers[rec]:
                    # Run callback asynchronously
                    asyncio.create_task(callback(message))
                    
    def get_history(self) -> List[Dict[str, Any]]:
        return [msg.to_dict() for msg in self.history]

# Global broker instance
broker = MessageBroker()
