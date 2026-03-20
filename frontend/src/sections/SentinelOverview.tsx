import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

const signals = [
  { type: 'pricing', message: 'Pricing change detected — Competitor X', region: 'North America', severity: 'high' },
  { type: 'messaging', message: 'Messaging shift — Homepage hero', region: 'Europe', severity: 'medium' },
  { type: 'launch', message: 'Product launch signal — EU region', region: 'Asia Pacific', severity: 'low' },
  { type: 'trend', message: 'Sentiment shift in target segment', region: 'Latin America', severity: 'medium' },
  { type: 'threat', message: 'New competitor entry detected', region: 'Middle East', severity: 'high' },
];

const heatmapRegions = [
  { id: 'na', name: 'North America', x: 22, y: 32, intensity: 0.85, alerts: 3 },
  { id: 'sa', name: 'South America', x: 28, y: 62, intensity: 0.45, alerts: 1 },
  { id: 'eu', name: 'Europe', x: 52, y: 28, intensity: 0.72, alerts: 2 },
  { id: 'af', name: 'Africa', x: 52, y: 52, intensity: 0.25, alerts: 0 },
  { id: 'as', name: 'Asia', x: 72, y: 35, intensity: 0.68, alerts: 2 },
  { id: 'oc', name: 'Oceania', x: 82, y: 68, intensity: 0.35, alerts: 1 },
];

export default function SentinelOverview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      tl.fromTo(mapRef.current, { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.3');
      tl.fromTo(leftPanelRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.4');
      tl.fromTo(rightPanelRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.4');
      tl.fromTo(legendRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 0.7) return '#FF2D55';
    if (intensity >= 0.4) return '#FFB000';
    return '#00F0C8';
  };

  return (
    <div ref={sectionRef} className="dashboard-view">
      <div ref={canvasRef} className="dashboard-canvas">
        <div className="canvas-content">
          {/* Header */}
          <div ref={titleRef} className="canvas-header">
            <h2 className="canvas-title">Sentinel Overview</h2>
            <p className="canvas-subtitle">Real-time competitive surface across regions</p>
          </div>

          {/* Main Content */}
          <div className="canvas-body relative">
            {/* Left Signal List */}
            <div 
              ref={leftPanelRef}
              className="absolute left-0 top-0 w-[22%] h-[68%] glass-card p-4 flex flex-col"
              style={{ marginTop: '8%' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-primary text-sm">Active Signals</h3>
                <span className="font-mono text-xs text-cyan">{signals.length} new</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {signals.map((signal, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-cobalt/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                        signal.severity === 'high' ? 'text-crimson' :
                        signal.severity === 'medium' ? 'text-amber' :
                        'text-cyan'
                      }`} />
                      <div>
                        <p className="text-xs text-slate-primary leading-relaxed">{signal.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-slate-secondary" />
                          <span className="font-mono text-[10px] text-slate-secondary">{signal.region}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* World Map */}
            <div 
              ref={mapRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[86%] h-[62%]"
            >
              <div className="relative w-full h-full">
                <svg viewBox="0 0 100 60" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(46, 91, 255, 0.1))' }}>
                  <rect width="100" height="60" fill="rgba(11, 13, 16, 0.5)" rx="8" />
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />
                    </pattern>
                  </defs>
                  <rect width="100" height="60" fill="url(#grid)" rx="8" />
                  <path d="M 8 15 Q 15 10 25 12 Q 30 15 28 25 Q 25 32 18 30 Q 12 28 10 22 Q 8 18 8 15" fill="rgba(46, 91, 255, 0.15)" stroke="rgba(46, 91, 255, 0.3)" strokeWidth="0.3" />
                  <path d="M 22 38 Q 28 36 30 42 Q 32 50 28 55 Q 24 58 22 52 Q 20 45 22 38" fill="rgba(0, 240, 200, 0.1)" stroke="rgba(0, 240, 200, 0.2)" strokeWidth="0.3" />
                  <path d="M 45 18 Q 52 15 58 17 Q 62 20 60 26 Q 55 28 48 26 Q 44 23 45 18" fill="rgba(255, 176, 0, 0.15)" stroke="rgba(255, 176, 0, 0.3)" strokeWidth="0.3" />
                  <path d="M 46 32 Q 54 30 58 36 Q 60 45 55 52 Q 48 54 44 48 Q 42 40 46 32" fill="rgba(0, 240, 200, 0.08)" stroke="rgba(0, 240, 200, 0.15)" strokeWidth="0.3" />
                  <path d="M 62 16 Q 75 12 88 16 Q 92 22 90 32 Q 85 38 75 36 Q 65 34 62 26 Q 60 20 62 16" fill="rgba(255, 176, 0, 0.12)" stroke="rgba(255, 176, 0, 0.25)" strokeWidth="0.3" />
                  <path d="M 78 48 Q 85 46 90 50 Q 92 55 88 58 Q 82 60 78 56 Q 76 52 78 48" fill="rgba(0, 240, 200, 0.1)" stroke="rgba(0, 240, 200, 0.2)" strokeWidth="0.3" />
                  {heatmapRegions.map((region) => (
                    <g key={region.id}>
                      <circle cx={region.x} cy={region.y} r={2 + region.intensity * 2} fill={getIntensityColor(region.intensity)} opacity={0.6} className="animate-pulse-glow" />
                      <circle cx={region.x} cy={region.y} r={1} fill={getIntensityColor(region.intensity)} />
                    </g>
                  ))}
                </svg>
                {heatmapRegions.map((region) => (
                  <div key={region.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ left: `${region.x}%`, top: `${region.y}%` }}>
                    <div className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(11, 13, 16, 0.8)', color: getIntensityColor(region.intensity), border: `1px solid ${getIntensityColor(region.intensity)}40` }}>
                      {region.alerts > 0 ? `${region.alerts} alerts` : 'Clear'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Insight Card */}
            <div ref={rightPanelRef} className="absolute right-0 top-0 w-[22%] h-[68%] glass-card p-4 flex flex-col" style={{ marginTop: '8%' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cobalt" />
                <h3 className="font-medium text-slate-primary text-sm">Recommended Response</h3>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="p-4 rounded-xl bg-cobalt/5 border border-cobalt/20 mb-4">
                  <p className="text-sm text-slate-primary leading-relaxed">Adjust positioning on Enterprise page to counter competitor pricing move.</p>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs"><span className="text-slate-secondary">Confidence</span><span className="font-mono text-cyan">94%</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-slate-secondary">Impact</span><span className="font-mono text-amber">High</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-slate-secondary">Time to act</span><span className="font-mono text-crimson">2.4 hours</span></div>
                </div>
                <button className="btn-primary mt-auto text-sm py-2.5">Generate Counter-Play</button>
              </div>
            </div>

            {/* Legend */}
            <div ref={legendRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-full" style={{ background: 'rgba(18, 21, 28, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span className="font-mono text-xs text-slate-secondary">Activity Level:</span>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan" /><span className="font-mono text-[10px] text-slate-secondary">Low</span></div>
              <div className="w-20 h-1 rounded-full bg-gradient-to-r from-cyan via-amber to-crimson" />
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-crimson" /><span className="font-mono text-[10px] text-slate-secondary">High</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
