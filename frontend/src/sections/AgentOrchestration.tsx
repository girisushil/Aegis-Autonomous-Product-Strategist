import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Bot, Activity, Cpu, Brain, Zap, CheckCircle2 } from 'lucide-react';

const agentNodes = [
  { id: 'ingest', label: 'Data Ingestion', icon: Activity, status: 'active', column: 0 },
  { id: 'enrich', label: 'Signal Enrichment', icon: Cpu, status: 'active', column: 0 },
  { id: 'detect', label: 'Pattern Detection', icon: Brain, status: 'processing', column: 0 },
  { id: 'scenario', label: 'Scenario Builder', icon: Bot, status: 'processing', column: 1 },
  { id: 'response', label: 'Response Generator', icon: Zap, status: 'standby', column: 1 },
  { id: 'decision', label: 'Decision Output', icon: CheckCircle2, status: 'standby', column: 2 },
];

const connections = [
  { from: 'ingest', to: 'enrich' },
  { from: 'enrich', to: 'detect' },
  { from: 'detect', to: 'scenario' },
  { from: 'detect', to: 'response' },
  { from: 'scenario', to: 'decision' },
  { from: 'response', to: 'decision' },
];

const statusPills = [
  { label: 'Scout', status: 'Active', color: 'cyan' },
  { label: 'Analyst', status: 'Processing', color: 'cobalt' },
  { label: 'Strategist', status: 'Standby', color: 'amber' },
];

export default function AgentOrchestration() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const graphCardRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const edgesRef = useRef<SVGSVGElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const [packetPosition, setPacketPosition] = useState(0);

  // Packet animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketPosition(prev => (prev + 1) % connections.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      tl.fromTo(graphCardRef.current, { scale: 0.95, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
      tl.fromTo(pillsRef.current, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.4');
      tl.fromTo(nodesRef.current, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.4 }, '-=0.3');

      if (edgesRef.current) {
        const paths = edgesRef.current.querySelectorAll('path');
        paths.forEach((path, i) => {
          const length = (path as SVGPathElement).getTotalLength?.() || 100;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(path, { strokeDashoffset: 0, duration: 0.3 }, `-=${0.2}`);
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00F0C8';
      case 'processing': return '#2E5BFF';
      case 'standby': return '#FFB000';
      default: return '#A7B0C8';
    }
  };

  const getNodePosition = (index: number) => {
    const node = agentNodes[index];
    const columnOffset = node.column * 280;
    const rowOffset = (index % 3) * 100;
    return { x: 100 + columnOffset, y: 80 + rowOffset };
  };

  return (
    <div ref={sectionRef} className="dashboard-view">
      <div ref={canvasRef} className="dashboard-canvas">
        <div className="canvas-content">
          {/* Header */}
          <div ref={titleRef} className="canvas-header">
            <h2 className="canvas-title">Agent Orchestration</h2>
            <p className="canvas-subtitle">Multi-agent system architecture</p>
          </div>

          {/* Status Pills */}
          <div ref={pillsRef} className="flex items-center justify-center gap-4">
            {statusPills.map((pill) => (
              <div 
                key={pill.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: `rgba(${
                    pill.color === 'cyan' ? '0, 240, 200' :
                    pill.color === 'cobalt' ? '46, 91, 255' :
                    '255, 176, 0'
                  }, 0.1)`,
                  border: `1px solid rgba(${
                    pill.color === 'cyan' ? '0, 240, 200' :
                    pill.color === 'cobalt' ? '46, 91, 255' :
                    '255, 176, 0'
                  }, 0.3)`,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: pill.color === 'cyan' ? '#00F0C8' :
                               pill.color === 'cobalt' ? '#2E5BFF' :
                               '#FFB000',
                    animation: pill.status === 'Processing' ? 'pulse-dot 1.5s ease-in-out infinite' : 'none'
                  }}
                />
                <span className="font-mono text-xs" style={{
                  color: pill.color === 'cyan' ? '#00F0C8' :
                         pill.color === 'cobalt' ? '#2E5BFF' :
                         '#FFB000'
                }}>
                  {pill.label}: {pill.status}
                </span>
              </div>
            ))}
          </div>

          {/* Graph Card */}
          <div ref={graphCardRef} className="flex-1 glass-card p-6 relative overflow-hidden">
            {/* SVG Connections */}
            <svg 
              ref={edgesRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 900 350"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgba(46, 91, 255, 0.4)" />
                </marker>
              </defs>
              
              {connections.map((conn, i) => {
                const fromNode = agentNodes.find(n => n.id === conn.from);
                const toNode = agentNodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                const fromIndex = agentNodes.indexOf(fromNode);
                const toIndex = agentNodes.indexOf(toNode);
                const fromPos = getNodePosition(fromIndex);
                const toPos = getNodePosition(toIndex);
                
                return (
                  <path
                    key={i}
                    d={`M ${fromPos.x + 100} ${fromPos.y + 30} L ${toPos.x} ${toPos.y + 30}`}
                    fill="none"
                    stroke="rgba(46, 91, 255, 0.3)"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}

              {/* Traveling packet */}
              {connections.map((conn, i) => {
                if (i !== packetPosition) return null;
                const fromNode = agentNodes.find(n => n.id === conn.from);
                const toNode = agentNodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                const fromIndex = agentNodes.indexOf(fromNode);
                const toIndex = agentNodes.indexOf(toNode);
                const fromPos = getNodePosition(fromIndex);
                const toPos = getNodePosition(toIndex);
                
                return (
                  <circle
                    key={`packet-${i}`}
                    r="4"
                    fill="#2E5BFF"
                    className="animate-pulse-glow"
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="1"
                      path={`M ${fromPos.x + 100} ${fromPos.y + 30} L ${toPos.x} ${toPos.y + 30}`}
                    />
                  </circle>
                );
              })}
            </svg>

            {/* Nodes */}
            <div className="relative w-full h-full" style={{ minHeight: '350px' }}>
              {agentNodes.map((node, index) => {
                const Icon = node.icon;
                const pos = getNodePosition(index);
                
                return (
                  <div
                    key={node.id}
                    ref={el => { if (el) nodesRef.current[index] = el; }}
                    className="absolute flex flex-col items-center gap-2"
                    style={{
                      left: `${(pos.x / 900) * 100}%`,
                      top: `${(pos.y / 350) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div 
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        node.status === 'processing' ? 'node-thinking' : ''
                      }`}
                      style={{
                        background: `linear-gradient(135deg, rgba(${
                          node.status === 'active' ? '0, 240, 200' :
                          node.status === 'processing' ? '46, 91, 255' :
                          '255, 176, 0'
                        }, 0.15) 0%, rgba(11, 13, 16, 0.8) 100%)`,
                        border: `1px solid rgba(${
                          node.status === 'active' ? '0, 240, 200' :
                          node.status === 'processing' ? '46, 91, 255' :
                          '255, 176, 0'
                        }, 0.4)`,
                        boxShadow: `0 0 20px rgba(${
                          node.status === 'active' ? '0, 240, 200' :
                          node.status === 'processing' ? '46, 91, 255' :
                          '255, 176, 0'
                        }, 0.2)`,
                      }}
                    >
                      <Icon 
                        className="w-8 h-8" 
                        style={{ color: getStatusColor(node.status) }}
                      />
                    </div>
                    <span 
                      className="font-mono text-xs whitespace-nowrap"
                      style={{ color: getStatusColor(node.status) }}
                    >
                      {node.label}
                    </span>
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: getStatusColor(node.status),
                        animation: node.status === 'processing' ? 'pulse-dot 1.5s ease-in-out infinite' : 'none'
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
