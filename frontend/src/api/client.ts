const API_BASE = "http://localhost:8000/api";

export interface Agent {
  id: string;
  name: string;
  role: string;
  system_prompt: string;
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result: string | null;
  assigned_to: string | null;
}

export interface SystemEvent {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

export const fetchAgents = async (): Promise<Agent[]> => {
  const res = await fetch(`${API_BASE}/agents`);
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
};

export const createAgent = async (name: string, role: string, systemPrompt: string): Promise<any> => {
  const res = await fetch(`${API_BASE}/agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role, system_prompt: systemPrompt }),
  });
  if (!res.ok) throw new Error("Failed to create agent");
  return res.json();
};

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTask = async (description: string, agentId?: string): Promise<any> => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, agent_id: agentId || null }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const fetchSystemEvents = async (): Promise<SystemEvent[]> => {
  const res = await fetch(`${API_BASE}/system/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};
