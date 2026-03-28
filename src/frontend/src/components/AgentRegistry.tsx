import { useState } from 'react';
import { type Agent, createAgent } from '../api/client';
import { UserPlus, Bot } from 'lucide-react';

interface Props {
  agents: Agent[];
  onRefresh: () => void;
}

export default function AgentRegistry({ agents, onRefresh }: Props) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name || !role || !systemPrompt) return;
    setIsSubmitting(true);
    try {
      await createAgent(name, role, systemPrompt);
      setName('');
      setRole('');
      setSystemPrompt('');
      onRefresh();
    } catch (e) {
      alert("Error creating agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h4><UserPlus size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Register New Agent</h4>
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. CodeReviewer" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Role</label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Senior Developer" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>System Prompt</label>
            <textarea 
              value={systemPrompt} 
              onChange={e => setSystemPrompt(e.target.value)} 
              placeholder="You are an expert at..."
              rows={4}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button className="btn" onClick={handleCreate} disabled={isSubmitting}>Register</button>
        </div>
      </div>

      <h4>Active Platform Agents ({agents.length})</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
        {agents.map(agent => (
          <div key={agent.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: 'var(--text-main)' }}>{agent.name}</h4>
              <div style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>{agent.role}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{agent.system_prompt.length > 60 ? agent.system_prompt.substring(0, 60) + '...' : agent.system_prompt}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.5 }}>ID: {agent.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
