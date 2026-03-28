from typing import Any, Dict

class BasePlugin:
    """Base class for all tools/plugins that agents can use."""
    name: str = "BasePlugin"
    description: str = "A basic plugin description."
    
    def get_tool_schema(self) -> Dict[str, Any]:
        """Returns the OpenAI function calling schema for this plugin."""
        raise NotImplementedError
        
    async def execute(self, **kwargs) -> Any:
        """Executes the plugin tool logic."""
        raise NotImplementedError
