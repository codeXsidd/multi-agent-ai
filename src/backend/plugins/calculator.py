from .base import BasePlugin
from typing import Any, Dict
import re

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
        
    def _safe_eval(self, expression: str) -> float:
        """Safely evaluate a mathematical expression using only basic arithmetic operators."""
        # Remove whitespace
        expression = expression.replace(" ", "")
        
        # Validate expression contains only allowed characters
        if not re.match(r'^[\d+\-*/().]+$', expression):
            raise ValueError("Invalid characters in expression")
        
        # Prevent multiple operators in a row (except for negative numbers)
        if re.search(r'[\+\-\*/]{2,}', expression.replace('--', '')):
            raise ValueError("Invalid operator sequence")
        
        # Evaluate using a safe approach - parse and evaluate step by step
        # For simplicity, we'll use Python's eval with restricted globals
        # but validate the expression first
        allowed_names = {}
        code = compile(expression, "<string>", "eval")
        
        for name in code.co_names:
            if name not in allowed_names:
                raise ValueError(f"Use of '{name}' not allowed")
        
        return eval(code, {"__builtins__": {}}, allowed_names)
        
    async def execute(self, expression: str, **kwargs) -> Any:
        try:
            result = self._safe_eval(expression)
            return str(result)
        except Exception as e:
            return f"Error evaluating expression: {str(e)}"
