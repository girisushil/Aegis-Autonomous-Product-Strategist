import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Shield, Lock, Server, Globe, CheckCircle2, Database } from 'lucide-react';

const securityFeatures = [
  { 
    icon: Shield, 
    label: 'SOC 2 Type II', 
    description: 'Certified security controls',
    status: 'certified'
  },
  { 
    icon: Globe, 
    label: 'GDPR Ready', 
    description: 'Full data protection compliance',
    status: 'compliant'
  },
  { 
    icon: Lock, 
    label: 'Encryption', 
    description: 'At rest & in transit (AES-256)',
    status: 'active'
  },
  { 
    icon: Server, 
    label: 'On-Premise', 
    description: 'Optional self-hosted deployment',
    status: 'available'
  },
];

export default function SecurityTrust() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(titleRef.current,
        { y: '-4vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(leftPanelRef.current,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(rightPanelRef.current,
        { x: '50vw', opacity: 0, scale: 1.03 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(featuresRef.current,
        { y: '12px', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.1
      );

      // EXIT (70% - 100%)
      scrollTl.fromTo(leftPanelRef.current,
        { x: 0, opacity: 1 },
        { x: '-16vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(rightPanelRef.current,
        { x: 0, opacity: 1 },
        { x: '16vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(titleRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="section-pinned">
      <div ref={canvasRef} className="dashboard-canvas">
        <div className="canvas-content">
          {/* Header */}
          <div ref={titleRef} className="canvas-header">
            <h2 className="canvas-title">Security & Trust</h2>
            <p className="canvas-subtitle">Enterprise-grade security for your data</p>
          </div>

          {/* Main Content */}
          <div className="canvas-body">
            {/* Left Panel - Features List */}
            <div 
              ref={leftPanelRef}
              className="w-[36%] glass-card p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-cobalt" />
                <h3 className="font-medium text-slate-primary">Security Standards</h3>
              </div>

              <div className="space-y-4 flex-1">
                {securityFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.label}
                      ref={el => { if (el) featuresRef.current[index] = el; }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cobalt/30 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cobalt/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cobalt/20 transition-colors">
                        <Icon className="w-5 h-5 text-cobalt" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-primary text-sm">
                            {feature.label}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-cyan" />
                        </div>
                        <p className="text-xs text-slate-secondary">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compliance Badges */}
              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <p className="metric-label mb-4">Compliance</p>
                <div className="flex flex-wrap gap-3">
                  {['SOC 2', 'GDPR', 'HIPAA', 'ISO 27001'].map((badge) => (
                    <span 
                      key={badge}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-slate-secondary"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Data Center Visual */}
            <div 
              ref={rightPanelRef}
              className="flex-1 glass-card p-0 overflow-hidden relative"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div 
                  className="w-full h-full"
                  style={{
                    background: `
                      linear-gradient(90deg, rgba(46, 91, 255, 0.1) 1px, transparent 1px),
                      linear-gradient(rgba(46, 91, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>

              {/* Server Rack Visualization */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full max-w-md">
                  {/* Server Racks */}
                  <div className="flex gap-4 justify-center">
                    {[1, 2, 3].map((rack) => (
                      <div 
                        key={rack}
                        className="w-20 h-64 bg-carbon-deep border border-white/[0.1] rounded-lg p-2 flex flex-col gap-2"
                      >
                        {/* Server Units */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div 
                            key={i}
                            className="flex-1 bg-white/[0.05] rounded flex items-center justify-between px-2"
                          >
                            <div className="flex gap-1">
                              <div 
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{
                                  background: i % 3 === 0 ? '#00F0C8' : i % 3 === 1 ? '#2E5BFF' : '#FFB000',
                                  animationDelay: `${i * 0.2}s`,
                                }}
                              />
                              <div 
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{
                                  background: i % 3 === 0 ? '#00F0C8' : i % 3 === 1 ? '#2E5BFF' : '#FFB000',
                                  animationDelay: `${i * 0.2 + 0.1}s`,
                                }}
                              />
                            </div>
                            <div className="w-8 h-0.5 bg-white/10 rounded" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full bg-carbon-deep border border-white/[0.1]">
                    <Database className="w-4 h-4 text-cobalt" />
                    <span className="font-mono text-xs text-slate-secondary">
                      Data Center — Frankfurt
                    </span>
                    <div className="w-2 h-2 rounded-full bg-cyan animate-pulse-glow" />
                  </div>
                </div>
              </div>

              {/* Security Stats */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between">
                <div className="text-center">
                  <div className="metric-value text-lg">256-bit</div>
                  <div className="metric-label">Encryption</div>
                </div>
                <div className="text-center">
                  <div className="metric-value text-lg">99.99%</div>
                  <div className="metric-label">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="metric-value text-lg">24/7</div>
                  <div className="metric-label">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
