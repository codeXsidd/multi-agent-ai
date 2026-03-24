import { useState, useEffect } from 'react';
import { type Agent, type Task, type SystemEvent, fetchAgents, fetchTasks, fetchSystemEvents } from './api/client';
import TaskBoard from './components/TaskBoard';
import AgentRegistry from './components/AgentRegistry';
import AgentChat from './components/AgentChat';
import { LayoutDashboard, Users, Activity } from 'lucide-react';

function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'board' | 'registry' | 'chat'>('board');

  const loadData = async () => {
    try {
      const [agentsData, tasksData, eventsData] = await Promise.all([
        fetchAgents(),
        fetchTasks(),
        fetchSystemEvents()
      ]);
      setAgents(agentsData);
      setTasks(tasksData);
      setEvents(eventsData);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Simple polling for MVP
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Activity size={24} /> Multi AI Platform
          </h2>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className={`btn ${activeTab === 'board' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('board')}
          >
            <LayoutDashboard size={18} /> Task Board
          </button>
          <button
            className={`btn ${activeTab === 'registry' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('registry')}
          >
            <Users size={18} /> Agent Registry
          </button>
          <button
            className={`btn ${activeTab === 'chat' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('chat')}
          >
            <Activity size={18} /> System Events
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h3>
            {activeTab === 'board' && "Task Delegation Board"}
            {activeTab === 'registry' && "Agent Registry"}
            {activeTab === 'chat' && "System Event Stream"}
          </h3>
        </div>
        <div className="content-area">
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'board' && <TaskBoard tasks={tasks} agents={agents} onRefresh={loadData} />}
            {activeTab === 'registry' && <AgentRegistry agents={agents} onRefresh={loadData} />}
            {activeTab === 'chat' && <AgentChat events={events} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
