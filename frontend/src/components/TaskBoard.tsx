import { useState } from 'react';
import { type Task, type Agent, createTask } from '../api/client';
import { PlusCircle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Props {
  tasks: Task[];
  agents: Agent[];
  onRefresh: () => void;
}

export default function TaskBoard({ tasks, agents, onRefresh }: Props) {
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!newTaskDesc.trim()) return;
    setIsSubmitting(true);
    try {
      await createTask(newTaskDesc, selectedAgent || undefined);
      setNewTaskDesc('');
      setSelectedAgent('');
      onRefresh();
    } catch (e) {
      alert("Error creating task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 color="var(--success)" />;
      case 'in_progress': return <Clock color="var(--primary)" />;
      case 'failed': return <AlertCircle color="var(--danger)" />;
      default: return <Clock color="var(--text-muted)" />;
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h4>Create New Task</h4>
        <div style={{ marginTop: '12px' }}>
          <textarea 
            placeholder="Describe the task for the agents..." 
            rows={3}
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }}
            >
              <option value="">Any Available Agent</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
            </select>
            <button className="btn" onClick={handleCreate} disabled={isSubmitting}>
              <PlusCircle size={18} /> Delegate Task
            </button>
          </div>
        </div>
      </div>

      <h4>Active Tasks ({tasks.length})</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        {tasks.map(task => (
          <div key={task.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Task: {task.description}</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getStatusIcon(task.status)}
                <span style={{ textTransform: 'capitalize' }}>{task.status}</span>
              </div>
            </div>
            <div style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>
              Assigned to: {task.assigned_to || 'System'} | ID: <span style={{ fontFamily: 'monospace' }}>{task.id.slice(0,8)}</span>
            </div>
            {task.result && (
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-dark)', borderRadius: '6px', borderLeft: '3px solid var(--primary)', whiteSpace: 'pre-wrap' }}>
                {task.result}
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No tasks assigned yet.</div>}
      </div>
    </div>
  );
}
