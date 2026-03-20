import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

const initialLogs = [
  { timestamp: '09:14:02', agent: 'Scout', message: 'Pricing change detected on /enterprise', type: 'signal' },
  { timestamp: '09:14:18', agent: 'Analyst', message: 'Confidence score: 0.94', type: 'info' },
  { timestamp: '09:14:31', agent: 'Strategist', message: 'Draft response ready for review', type: 'highlight' },
  { timestamp: '09:15:04', agent: 'Scout', message: 'Competitor X launched new feature', type: 'info' },
  { timestamp: '09:15:22', agent: 'Analyst', message: 'Impact assessment: Medium', type: 'info' },
  { timestamp: '09:16:01', agent: 'Scout', message: 'Messaging shift on homepage hero', type: 'signal' },
  { timestamp: '09:16:45', agent: 'Analyst', message: 'Pattern match: 87% similarity', type: 'info' },
  { timestamp: '09:17:12', agent: 'Scout', message: 'New pricing tier detected', type: 'signal' },
  { timestamp: '09:17:38', agent: 'Analyst', message: 'Sentiment analysis complete', type: 'info' },
  { timestamp: '09:18:05', agent: 'Strategist', message: 'Counter-play generated', type: 'highlight' },
];

const chartData = [
  { time: '09:00', signals: 12, velocity: 45 },
  { time: '09:05', signals: 18, velocity: 52 },
  { time: '09:10', signals: 15, velocity: 48 },
  { time: '09:15', signals: 28, velocity: 68 },
  { time: '09:20', signals: 32, velocity: 74 },
  { time: '09:25', signals: 24, velocity: 61 },
  { time: '09:30', signals: 36, velocity: 82 },
];

const threatData = {
  name: 'Competitor X',
  change: 'Pricing reduction 15%',
  impact: 'High',
  confidence: '94%',
};

export default function LiveSignals() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const logPanelRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState(initialLogs);

  // Auto-scroll logs
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = {
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          agent: ['Scout', 'Analyst', 'Strategist'][Math.floor(Math.random() * 3)],
          message: [
            'New signal detected',
            'Analysis complete',
            'Pattern identified',
            'Response generated',
            'Data synced',
          ][Math.floor(Math.random() * 5)],
          type: ['info', 'signal', 'highlight'][Math.floor(Math.random() * 3)],
        };
        return [...prev.slice(1), newLog];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      tl.fromTo(logPanelRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');
      tl.fromTo(chartRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, '-=0.3');
      tl.fromTo(rightColumnRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.3');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'signal': return 'text-amber';
      case 'highlight': return 'text-slate-primary font-medium';
      default: return 'text-slate-secondary';
    }
  };

  return (
    <div ref={sectionRef} className="dashboard-view">
      <div ref={canvasRef} className="dashboard-canvas">
        <div className="canvas-content">
          {/* Header */}
          <div ref={titleRef} className="canvas-header">
            <h2 className="canvas-title">Live Signals</h2>
            <p className="canvas-subtitle">Real-time intelligence stream</p>
          </div>

          {/* Main Content */}
          <div className="canvas-body">
            {/* Left Column - Log Panel */}
            <div ref={logPanelRef} className="w-[28%] flex flex-col gap-4">
              <div className="glass-card flex-1 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cobalt" />
                    <h3 className="font-medium text-slate-primary text-sm">Agent Log</h3>
                  </div>
                  <div className="live-indicator">
                    <div className="live-dot" />
                    <span>LIVE</span>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <div className="terminal-container absolute inset-0">
                    {logs.map((log, index) => (
                      <div key={index} className="terminal-line">
                        <span className="terminal-timestamp">[{log.timestamp}]</span>
                        <span className="terminal-agent">{log.agent} →</span>
                        <span className={`terminal-message ${getLogColor(log.type)}`}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="glass-card p-4 h-[18%]">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="flex flex-col justify-center">
                    <span className="metric-label">Signals/hour</span>
                    <span className="metric-value text-xl text-cyan">142</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="metric-label">Accuracy</span>
                    <span className="metric-value text-xl text-cobalt">94.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Chart */}
            <div ref={chartRef} className="flex-1 glass-card p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cobalt" />
                  <h3 className="font-medium text-slate-primary text-sm">Signal Velocity</h3>
                </div>
                <span className="font-mono text-xs text-slate-secondary">Last 30 min</span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E5BFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2E5BFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A7B0C8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    />
                    <YAxis 
                      hide
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(18, 21, 28, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#F4F6FF' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="velocity" 
                      stroke="#2E5BFF" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorVelocity)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column */}
            <div ref={rightColumnRef} className="w-[22%] flex flex-col gap-4">
              {/* Top Threat Card */}
              <div className="glass-card p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-crimson" />
                  <h3 className="font-medium text-slate-primary text-sm">Top Threat</h3>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="p-3 rounded-lg bg-crimson/5 border border-crimson/20 mb-4">
                    <p className="font-medium text-slate-primary text-sm">{threatData.name}</p>
                    <p className="text-xs text-slate-secondary mt-1">{threatData.change}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-secondary">Impact</span>
                      <span className="font-mono text-crimson">{threatData.impact}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-secondary">Confidence</span>
                      <span className="font-mono text-cyan">{threatData.confidence}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Play Card */}
              <div className="glass-card p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-amber" />
                  <h3 className="font-medium text-slate-primary text-sm">Suggested Play</h3>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="p-3 rounded-lg bg-amber/5 border border-amber/20 mb-4">
                    <p className="text-sm text-slate-primary leading-relaxed">
                      Launch competitive response campaign highlighting unique value props.
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-secondary">Expected ROI</span>
                      <span className="font-mono text-cyan">3.2x</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-secondary">Time to deploy</span>
                      <span className="font-mono text-amber">4 hours</span>
                    </div>
                  </div>

                  <button className="btn-primary mt-auto text-sm py-2.5 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Deploy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
