import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Plug, Sliders, Users, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';

const steps = [
  {
    id: 'connect',
    number: '01',
    title: 'Connect',
    description: 'Link your data sources in minutes. Integrate with CRM, analytics, and competitive intelligence tools.',
    icon: Plug,
    color: 'cyan',
    features: ['One-click integrations', 'API access', 'Custom webhooks'],
  },
  {
    id: 'configure',
    number: '02',
    title: 'Configure',
    description: 'Set thresholds and alert rules. Define what matters to your business and how agents should respond.',
    icon: Sliders,
    color: 'cobalt',
    features: ['Smart thresholds', 'Alert routing', 'Escalation rules'],
  },
  {
    id: 'delegate',
    number: '03',
    title: 'Delegate',
    description: 'Let agents run—you review decisions. Approve, modify, or override agent recommendations.',
    icon: Users,
    color: 'amber',
    features: ['Human-in-the-loop', 'Approval workflows', 'Audit trails'],
  },
];

export default function Implementation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<SVGSVGElement>(null);

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

      scrollTl.fromTo(cardsRef.current,
        { y: '60vh', opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.03, ease: 'none' },
        0
      );

      // Connector lines draw-on
      if (linesRef.current) {
        const lines = linesRef.current.querySelectorAll('line');
        lines.forEach((line, i) => {
          const length = Math.sqrt(
            Math.pow(parseFloat(line.getAttribute('x2') || '0') - parseFloat(line.getAttribute('x1') || '0'), 2) +
            Math.pow(parseFloat(line.getAttribute('y2') || '0') - parseFloat(line.getAttribute('y1') || '0'), 2)
          );
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          scrollTl.to(line, { strokeDashoffset: 0, ease: 'none' }, 0.15 + i * 0.03);
        });
      }

      // EXIT (70% - 100%)
      scrollTl.fromTo(cardsRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, stagger: 0.02, ease: 'power2.in' },
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

  const getColorStyles = (color: string) => {
    switch (color) {
      case 'cyan':
        return { text: '#00F0C8', bg: 'rgba(0, 240, 200, 0.1)', border: 'rgba(0, 240, 200, 0.2)' };
      case 'cobalt':
        return { text: '#2E5BFF', bg: 'rgba(46, 91, 255, 0.1)', border: 'rgba(46, 91, 255, 0.2)' };
      case 'amber':
        return { text: '#FFB000', bg: 'rgba(255, 176, 0, 0.1)', border: 'rgba(255, 176, 0, 0.2)' };
      default:
        return { text: '#2E5BFF', bg: 'rgba(46, 91, 255, 0.1)', border: 'rgba(46, 91, 255, 0.2)' };
    }
  };

  return (
    <div ref={sectionRef} className="section-pinned">
      <div ref={canvasRef} className="dashboard-canvas">
        <div className="canvas-content">
          {/* Header */}
          <div ref={titleRef} className="canvas-header">
            <h2 className="canvas-title">Implementation</h2>
            <p className="canvas-subtitle">Deploy Aegis in three simple steps</p>
            <button className="inline-flex items-center gap-2 mt-3 text-cobalt hover:text-cobalt-glow transition-colors text-sm">
              <ExternalLink className="w-4 h-4" />
              View Documentation
            </button>
          </div>

          {/* Steps */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Connector Lines SVG */}
            <svg 
              ref={linesRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ top: '50%', transform: 'translateY(-50%)', height: '2px' }}
            >
              <line 
                x1="28%" 
                y1="1" 
                x2="45%" 
                y2="1" 
                stroke="rgba(46, 91, 255, 0.3)" 
                strokeWidth="2"
              />
              <line 
                x1="55%" 
                y1="1" 
                x2="72%" 
                y2="1" 
                stroke="rgba(46, 91, 255, 0.3)" 
                strokeWidth="2"
              />
            </svg>

            {/* Step Cards */}
            <div className="flex items-center justify-center gap-8 w-full">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const colors = getColorStyles(step.color);
                
                return (
                  <div
                    key={step.id}
                    ref={el => { if (el) cardsRef.current[index] = el; }}
                    className="w-[22%] glass-card p-6 flex flex-col hover:border-cobalt/30 transition-all duration-300 group"
                  >
                    {/* Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <span 
                        className="font-heading font-bold text-4xl"
                        style={{ color: colors.text, opacity: 0.3 }}
                      >
                        {step.number}
                      </span>
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: colors.bg }}
                      >
                        <Icon className="w-6 h-6" style={{ color: colors.text }} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-heading font-semibold text-lg text-slate-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-secondary leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mt-auto">
                      {step.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 
                            className="w-4 h-4 flex-shrink-0" 
                            style={{ color: colors.text }}
                          />
                          <span className="text-xs text-slate-secondary">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow (except last) */}
                    {index < steps.length - 1 && (
                      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-carbon-deep border border-white/[0.08] flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-cobalt" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center justify-center gap-12 pt-4">
            {[
              { value: '< 1 hour', label: 'Average setup time' },
              { value: '50+', label: 'Integrations' },
              { value: '99.9%', label: 'Uptime SLA' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="metric-value text-xl mb-1">{stat.value}</div>
                <div className="metric-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
