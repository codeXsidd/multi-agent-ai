from .base import BasePlugin
from typing import Any, Dict

class CalculatorPlugin(BasePlugin):
    name = "Calculator"
    description = "Provides basic arithmetic calculation capabilities."
    
    def get_tool_schema(self) -> Dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": "calculate",
                "description": "Evaluate a simple math expression.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "The math expression (e.g. '2 + 2' or '5 * 4 / 2')."
                        }
                    },
                    "required": ["expression"]
                }
            }
        }
        
    async def execute(self, expression: str, **kwargs) -> Any:
        try:
            # Danger: Eval is dangerous in prod. This is just for MVP purposes.
            # In a real app we'd use a safe math parser.
            result = eval(expression, {"__builtins__": None}, {})
            return str(result)
        except Exception as e:
            return f"Error evaluating expression: {str(e)}"
