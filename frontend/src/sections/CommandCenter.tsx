import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, TrendingDown, Activity, Zap, Shield, Bell } from 'lucide-react';

const metrics = [
  { 
    label: 'Strategic Drift Score', 
    value: '↑ 12%', 
    trend: 'up',
    rawValue: '84.2',
    icon: Activity 
  },
  { 
    label: 'Market Pressure Index', 
    value: '84.2', 
    trend: 'neutral',
    rawValue: '84.2',
    icon: Zap 
  },
  { 
    label: 'ARR at Risk', 
    value: '$2.4M', 
    trend: 'down',
    rawValue: '$2.4M',
    icon: Shield 
  },
];

export default function CommandCenter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const metricCardsRef = useRef<HTMLDivElement[]>([]);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Canvas entrance
      tl.fromTo(canvasRef.current,
        { scale: 0.985, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6 }
      );

      // Header entrance
      tl.fromTo(headerRef.current,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.4'
      );

      // Metric cards stagger
      tl.fromTo(metricCardsRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
        '-=0.3'
      );

      // Bottom cards
      tl.fromTo([leftCardRef.current, rightCardRef.current],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);



  return (
    <div ref={sectionRef} className="dashboard-view">
      <div ref={canvasRef} className="dashboard-canvas">
        {/* Scan Line Effect */}
        <div className="scan-line" />
        
        <div className="canvas-content">
          {/* Header */}
          <div ref={headerRef} className="canvas-header">
            <h1 className="canvas-title">Command Center</h1>
            <p className="canvas-subtitle">Real-time market intelligence dashboard</p>
          </div>

          {/* Metrics Grid */}
          <div className="metric-grid">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  ref={el => { if (el) metricCardsRef.current[index] = el; }}
                  className="metric-card"
                >
                  <div className="metric-card-header">
                    <span className="metric-card-label">{metric.label}</span>
                    <Icon className="w-4 h-4 text-slate-secondary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="metric-card-value">{metric.value}</span>
                    {metric.trend === 'up' && (
                      <TrendingUp className="w-4 h-4 text-cyan" />
                    )}
                    {metric.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-crimson" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Cards */}
          <div className="canvas-body">
            {/* Left Card - Sentinel Feed */}
            <div ref={leftCardRef} className="large-card">
              <div className="large-card-header">
                <h3 className="large-card-title">Sentinel Feed</h3>
                <div className="live-indicator">
                  <div className="live-dot" />
                  <span>LIVE</span>
                </div>
              </div>
              <div className="large-card-body">
                <div className="terminal-container">
                  <div className="terminal-line">
                    <span className="terminal-timestamp">[09:14:02]</span>
                    <span className="terminal-agent">Scout →</span>
                    <span className="terminal-message signal">Pricing change detected on /enterprise</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-timestamp">[09:14:18]</span>
                    <span className="terminal-agent">Analyst →</span>
                    <span className="terminal-message">Confidence score: 0.94</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-timestamp">[09:14:31]</span>
                    <span className="terminal-agent">Strategist →</span>
                    <span className="terminal-message highlight">Draft response ready for review</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-timestamp">[09:15:04]</span>
                    <span className="terminal-agent">Scout →</span>
                    <span className="terminal-message">Competitor X launched new feature</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-timestamp">[09:15:22]</span>
                    <span className="terminal-agent">Analyst →</span>
                    <span className="terminal-message">Impact assessment: Medium</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-timestamp">[09:16:01]</span>
                    <span className="terminal-agent">Scout →</span>
                    <span className="terminal-message signal">Messaging shift on homepage hero</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-timestamp">[09:16:45]</span>
                    <span className="terminal-agent">Analyst →</span>
                    <span className="terminal-message">Pattern match: 87% similarity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Agent Status */}
            <div ref={rightCardRef} className="large-card">
              <div className="large-card-header">
                <h3 className="large-card-title">Agent Status</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan animate-pulse-glow" />
                  <span className="font-mono text-xs text-cyan">All Systems Operational</span>
                </div>
              </div>
              <div className="large-card-body flex flex-col gap-4">
                {/* Agent Status Items */}
                {[
                  { name: 'Scout', status: 'Active', tasks: 12, color: 'cyan' },
                  { name: 'Analyst', status: 'Processing', tasks: 4, color: 'cobalt' },
                  { name: 'Strategist', status: 'Standby', tasks: 0, color: 'amber' },
                ].map((agent) => (
                  <div 
                    key={agent.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: `rgba(${
                            agent.color === 'cyan' ? '0, 240, 200' :
                            agent.color === 'cobalt' ? '46, 91, 255' :
                            '255, 176, 0'
                          }, 0.15)`,
                        }}
                      >
                        <Activity className="w-5 h-5" style={{
                          color: agent.color === 'cyan' ? '#00F0C8' :
                                 agent.color === 'cobalt' ? '#2E5BFF' :
                                 '#FFB000'
                        }} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-primary">{agent.name}</div>
                        <div className="font-mono text-xs text-slate-secondary">{agent.status}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm text-slate-secondary">
                        {agent.tasks} tasks
                      </div>
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: agent.color === 'cyan' ? '#00F0C8' :
                                     agent.color === 'cobalt' ? '#2E5BFF' :
                                     '#FFB000',
                          animation: agent.status === 'Processing' ? 'pulse-dot 1.5s ease-in-out infinite' : 'none'
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Quick Actions */}
                <div className="mt-auto pt-4 border-t border-white/[0.06]">
                  <div className="flex gap-3">
                    <button className="btn-primary flex-1 text-sm py-2.5">
                      Open Center
                    </button>
                    <button className="btn-glass px-4">
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
