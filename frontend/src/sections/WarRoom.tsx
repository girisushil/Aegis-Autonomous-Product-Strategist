import { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { gsap } from 'gsap';
import { Bot, X, MessageSquare, TrendingUp, Shield, Zap, Terminal } from 'lucide-react';
import { CombatModeContext, NotificationContext } from '../App';

const WS_URL = 'ws://localhost:8000/ws/war-room';

interface AgentLog {
  agent: string;
  message: string;
}

interface AgentPhase {
  Scout: 'idle' | 'active' | 'complete';
  Analyst: 'idle' | 'active' | 'complete';
  Strategist: 'idle' | 'active' | 'complete';
  Remediation: 'idle' | 'active' | 'complete';
}

const AGENT_COLORS: Record<string, string> = {
  Scout: '#00F0C8',
  Analyst: '#2E5BFF',
  Strategist: '#FFB000',
  Optimist: '#00F0C8',
  Skeptic: '#FF6B6B',
  Remediation: '#2E5BFF',
  System: '#8B949E',
  Linear: '#5E6AD2',
  Airia: '#00F0C8',
};

export default function WarRoom() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement[]>([]);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [phases, setPhases] = useState<AgentPhase>({ Scout: 'idle', Analyst: 'idle', Strategist: 'idle', Remediation: 'idle' });
  const [summary, setSummary] = useState<Record<string, any> | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const { setIsCombatMode } = useContext(CombatModeContext);
  const { triggerNotification } = useContext(NotificationContext);

  // Auto-scroll the terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleInitiateWarRoom = useCallback(() => {
    setIsCombatMode(true);
    setShowModal(true);
    setLogs([]);
    setSummary(null);
    setPhases({ Scout: 'idle', Analyst: 'idle', Strategist: 'idle', Remediation: 'idle' });
    setIsRunning(true);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send('INITIATE');
      setLogs(prev => [...prev, { agent: 'System', message: 'WebSocket connected. INITIATE signal sent.' }]);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'connected') {
        setLogs(prev => [...prev, { agent: 'System', message: `Engine: ${data.engine}` }]);
      }
      else if (data.type === 'agent_log') {
        setLogs(prev => [...prev, { agent: data.agent, message: data.message }]);
      }
      else if (data.type === 'phase') {
        setPhases(prev => ({ ...prev, [data.agent]: data.status }));
      }
      else if (data.type === 'complete') {
        setSummary(data.summary);
        setIsRunning(false);
        setLogs(prev => [...prev, { agent: 'System', message: '═══ WAR ROOM SEQUENCE COMPLETE ═══' }]);
        triggerNotification('Mission Complete: Strategic Response Dispatched', 'success');
      }
      else if (data.type === 'action_links') {
        setSummary(prev => ({ ...prev, linear_url: data.linear_url, linear_id: data.linear_id, airia_pdf_url: data.airia_pdf_url }));
      }
      else if (data.type === 'pulse') {
        // Background pulse - can show in terminal
        setLogs(prev => [...prev, { agent: 'Pulse', message: `Drift: ${data.metrics.strategic_drift_score} | ARR Risk: ${data.metrics.arr_at_immediate_risk}` }]);
      }
    };

    ws.onerror = () => {
      setLogs(prev => [...prev, { agent: 'System', message: '⚠ WebSocket error. Ensure backend is running on port 8000.' }]);
      setIsRunning(false);
    };

    ws.onclose = () => {
      setLogs(prev => [...prev, { agent: 'System', message: 'Connection closed.' }]);
      setIsRunning(false);
    };
  }, [setIsCombatMode]);

  const handleClose = () => {
    wsRef.current?.close();
    setShowModal(false);
    setIsCombatMode(false);
    setIsRunning(false);
  };

  const getProgressPercent = (status: string) =>
    status === 'complete' ? 100 : status === 'active' ? 60 : 0;

  const getStatusLabel = (status: string) =>
    status === 'complete' ? 'Complete' : status === 'active' ? 'Running...' : 'Queued';

  // Mount-based entrance animation (SPA — no scroll triggers)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      tl.fromTo(graphRef.current, { opacity: 0 }, { opacity: 0.35, duration: 0.4 }, '-=0.3');
      tl.fromTo(modalRef.current, { scale: 0.9, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
      tl.fromTo(bubblesRef.current[0], { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.3');
      tl.fromTo(bubblesRef.current[1], { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.4');
      tl.fromTo(ctaRef.current, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 }, '-=0.2');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const agentDebate = [
    { id: 'optimist', name: 'Optimist Agent', role: 'Growth Strategist', avatar: 'O', message: 'Launch a counter-campaign now—momentum is high. Our data shows a 23% increase in engagement if we act within the next 4 hours.', color: 'cyan', side: 'left' },
    { id: 'skeptic', name: 'Skeptic Agent', role: 'Risk Analyst', avatar: 'S', message: 'Wait. Verify the signal across two more regions. We need 95% confidence before committing resources to a full campaign.', color: 'amber', side: 'right' },
  ];

  return (
    <div ref={sectionRef} className="dashboard-view">
      <div ref={canvasRef} className="dashboard-canvas">
        <div className="canvas-content relative">
          {/* Header */}
          <div ref={titleRef} className="canvas-header">
            <h2 className="canvas-title">Multi-Agent War Room</h2>
            <p className="canvas-subtitle">Collaborative strategic decision-making</p>
          </div>

          {/* Background Graph */}
          <div ref={graphRef} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.35 }}>
            <div className="w-[60%] h-[50%] glass-card p-6">
              <div className="flex items-center justify-center h-full gap-8">
                {['Scout', 'Analyst', 'Strategist'].map((agent, i) => (
                  <div key={agent} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ background: `rgba(${i === 0 ? '0, 240, 200' : i === 1 ? '46, 91, 255' : '255, 176, 0'}, 0.15)`, border: `1px solid rgba(${i === 0 ? '0, 240, 200' : i === 1 ? '46, 91, 255' : '255, 176, 0'}, 0.3)` }}>
                      <Bot className="w-8 h-8" style={{ color: i === 0 ? '#00F0C8' : i === 1 ? '#2E5BFF' : '#FFB000' }} />
                    </div>
                    <span className="font-mono text-xs text-slate-secondary">{agent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div ref={modalRef} className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card-active p-8 w-[72%] max-w-[800px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-cobalt" />
                  <h3 className="font-heading font-semibold text-xl text-slate-primary">Strategic Debate</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cobalt/10 border border-cobalt/30">
                  <div className="w-2 h-2 rounded-full bg-cobalt animate-pulse-glow" />
                  <span className="font-mono text-xs text-cobalt">Consensus: 87%</span>
                </div>
              </div>
              <div className="space-y-6 mb-8">
                {agentDebate.map((agent, index) => (
                  <div key={agent.id} ref={el => { if (el) bubblesRef.current[index] = el; }}
                    className={`flex ${agent.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                    <div className="agent-bubble max-w-[80%]" style={{ borderColor: agent.color === 'cyan' ? 'rgba(0, 240, 200, 0.2)' : 'rgba(255, 176, 0, 0.2)' }}>
                      <div className="agent-bubble-header">
                        <div className="agent-bubble-avatar" style={{ background: agent.color === 'cyan' ? 'rgba(0, 240, 200, 0.15)' : 'rgba(255, 176, 0, 0.15)', color: agent.color === 'cyan' ? '#00F0C8' : '#FFB000', borderColor: agent.color === 'cyan' ? 'rgba(0, 240, 200, 0.3)' : 'rgba(255, 176, 0, 0.3)' }}>
                          {agent.avatar}
                        </div>
                        <div>
                          <div className="agent-bubble-name">{agent.name}</div>
                          <div className="agent-bubble-role">{agent.role}</div>
                        </div>
                      </div>
                      <p className="agent-bubble-message">{agent.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan" /><span className="font-mono text-xs text-slate-secondary">Success probability: 78%</span></div>
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-amber" /><span className="font-mono text-xs text-slate-secondary">Risk level: Medium</span></div>
                </div>
                <button ref={ctaRef} onClick={handleInitiateWarRoom} className="btn-primary flex items-center gap-2 animate-pulse-glow">
                  <Zap className="w-4 h-4" />
                  INITIATE MULTI-AGENT WAR ROOM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live War Room Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
          <div className="modal-content" style={{ maxWidth: '900px', width: '90%' }}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cobalt/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cobalt" />
                </div>
                <div>
                  <h3 className="modal-title">War Room — Live Agent Pipeline</h3>
                  <p className="font-mono text-xs text-slate-secondary">
                    {isRunning ? 'Agents executing...' : summary ? 'Pipeline complete' : 'Initializing...'}
                  </p>
                </div>
              </div>
              <button className="modal-close" onClick={handleClose}><X className="w-5 h-5" /></button>
            </div>

            {/* Agent Progress Bars */}
            <div className="p-4 rounded-xl bg-cobalt/5 border border-cobalt/20 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-5 h-5 text-cobalt" />
                <span className="font-medium text-slate-primary">Agent Deployment Status</span>
              </div>
              <div className="space-y-2">
                {(['Scout', 'Analyst', 'Strategist', 'Remediation'] as const).map((agent) => (
                  <div key={agent} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-secondary w-20">{agent}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${getProgressPercent(phases[agent])}%`,
                          background: AGENT_COLORS[agent],
                          boxShadow: phases[agent] === 'active' ? `0 0 12px ${AGENT_COLORS[agent]}` : 'none',
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs w-20 text-right" style={{ color: AGENT_COLORS[agent] }}>
                      {getStatusLabel(phases[agent])}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Agent Terminal */}
            <div
              className="rounded-xl border border-white/[0.06] overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}
            >
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="font-mono text-[10px] text-slate-secondary ml-2">aegis://war-room/live</span>
              </div>
              <div className="p-4 h-[280px] overflow-y-auto font-mono text-xs leading-relaxed" id="live-agent-log">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <span style={{ color: AGENT_COLORS[log.agent] || '#8B949E', minWidth: '80px', flexShrink: 0 }}>
                      [{log.agent}]
                    </span>
                    <span style={{ color: '#C9D1D9' }}>{log.message}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Summary (shown after completion) */}
            {summary && (
              <div className="mt-4 p-4 rounded-xl bg-cyan/5 border border-cyan/20">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-cyan" />
                  <span className="font-medium text-slate-primary">Mission Debrief</span>
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs text-slate-secondary">
                  <div>Signals Captured: <span className="text-cyan">{summary.signals_captured}</span></div>
                  <div>High-Risk Users: <span className="text-cyan">{summary.high_risk_users?.toLocaleString()}</span></div>
                  <div>ARR at Risk: <span className="text-red-400">{summary.arr_at_risk}</span></div>
                  <div>Drift Score: <span className="text-amber">{summary.drift_score}</span></div>
                  <div className="col-span-2 mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-4">
                    {summary.linear_url && (
                      <a href={summary.linear_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 text-[#5E6AD2] hover:bg-[#5E6AD2]/20 transition-all">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="font-medium">Linear: {summary.linear_id}</span>
                      </a>
                    )}
                    {summary.airia_pdf_url && (
                      <a href={summary.airia_pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan hover:bg-cyan/20 transition-all">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="font-medium">Airia PDF Brief</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="btn-primary flex-1" onClick={handleClose}>
                {summary ? 'Accept & Close' : 'Close War Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
