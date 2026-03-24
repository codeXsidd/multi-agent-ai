import type { SystemEvent } from '../api/client';
import { MessageSquare, Server, ArrowRight } from 'lucide-react';

interface Props {
  events: SystemEvent[];
}

export default function AgentChat({ events }: Props) {
  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h4><Server size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> System Event Stream</h4>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
          This view monitors all internal communication between agents, the Task Manager, and the Message Broker.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {events.slice().reverse().map((event, index) => (
          <div key={event.id || index} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare color="white" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {event.sender_id.slice(0, 8)} 
                  </span>
                  <ArrowRight size={14} />
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {event.receiver_id === 'all' ? 'Broadcast (All)' : event.receiver_id.slice(0, 8)}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div style={{ 
                backgroundColor: 'var(--bg-dark)', 
                padding: '12px', 
                borderRadius: '6px', 
                borderLeft: '2px solid var(--primary)', 
                fontSize: '14px', 
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace' 
              }}>
                {event.content}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No system events recorded yet.</div>}
      </div>
    </div>
  );
}
