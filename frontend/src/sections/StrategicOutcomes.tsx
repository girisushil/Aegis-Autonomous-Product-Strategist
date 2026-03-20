import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users } from 'lucide-react';

const outcomes = [
  {
    id: 'response',
    value: 3.2,
    suffix: '×',
    label: 'Faster response time',
    description: 'From days to hours',
    icon: Clock,
    color: 'cyan',
  },
  {
    id: 'churn',
    value: 40,
    suffix: '%',
    label: 'Reduction in churn risk',
    description: 'Proactive intervention',
    icon: Users,
    color: 'cobalt',
  },
  {
    id: 'revenue',
    value: 1.2,
    prefix: '$',
    suffix: 'M',
    label: 'Protected revenue',
    description: 'Last quarter alone',
    icon: DollarSign,
    color: 'amber',
  },
];

function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '', 
  shouldAnimate 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  shouldAnimate: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, shouldAnimate]);

  const formatted = value % 1 === 0 
    ? Math.round(displayValue).toString()
    : displayValue.toFixed(1);

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default function StrategicOutcomes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardsRef = useRef<HTMLDivElement[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onEnter: () => setShouldAnimate(true),
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(titleRef.current,
        { y: '-4vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(leftCardRef.current,
        { scale: 0.85, opacity: 0, y: '14vh' },
        { scale: 1, opacity: 1, y: 0, ease: 'none' },
        0
      );

      scrollTl.fromTo(rightCardsRef.current,
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.03, ease: 'none' },
        0.08
      );

      // EXIT (70% - 100%)
      scrollTl.fromTo(leftCardRef.current,
        { scale: 1, opacity: 1, y: 0 },
        { scale: 0.96, opacity: 0, y: '-6vh', ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(rightCardsRef.current,
        { x: 0, opacity: 1 },
        { x: '16vw', opacity: 0, stagger: 0.02, ease: 'power2.in' },
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
        return { text: '#00F0C8', bg: 'rgba(0, 240, 200, 0.1)' };
      case 'cobalt':
        return { text: '#2E5BFF', bg: 'rgba(46, 91, 255, 0.1)' };
      case 'amber':
        return { text: '#FFB000', bg: 'rgba(255, 176, 0, 0.1)' };
      default:
        return { text: '#2E5BFF', bg: 'rgba(46, 91, 255, 0.1)' };
    }
  };

  return (
    <div ref={sectionRef} className="section-pinned">
      <div ref={canvasRef} className="dashboard-canvas">
        <div className="canvas-content">
          {/* Header */}
          <div ref={titleRef} className="canvas-header">
            <h2 className="canvas-title">Strategic Outcomes</h2>
            <p className="canvas-subtitle">Proven results from enterprise deployments</p>
          </div>

          {/* Main Content */}
          <div className="canvas-body">
            {/* Left Big Card */}
            <div 
              ref={leftCardRef}
              className="w-[36%] glass-card p-8 flex flex-col justify-center"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: getColorStyles(outcomes[0].color).bg }}
              >
                <Clock 
                  className="w-8 h-8" 
                  style={{ color: getColorStyles(outcomes[0].color).text }}
                />
              </div>
              
              <div className="metric-value text-6xl mb-4">
                <AnimatedNumber 
                  value={outcomes[0].value} 
                  suffix={outcomes[0].suffix}
                  shouldAnimate={shouldAnimate}
                />
              </div>
              
              <h3 className="font-heading font-semibold text-xl text-slate-primary mb-2">
                {outcomes[0].label}
              </h3>
              <p className="text-slate-secondary text-sm">
                {outcomes[0].description}
              </p>

              <div className="mt-auto pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan" />
                  <span className="font-mono text-xs text-slate-secondary">
                    vs. manual process
                  </span>
                </div>
              </div>
            </div>

            {/* Right Stacked Cards */}
            <div className="flex-1 flex flex-col gap-4">
              {outcomes.slice(1).map((outcome, index) => {
                const Icon = outcome.icon;
                const colors = getColorStyles(outcome.color);
                
                return (
                  <div
                    key={outcome.id}
                    ref={el => { if (el) rightCardsRef.current[index] = el; }}
                    className="flex-1 glass-card p-6 flex items-center gap-6"
                  >
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.bg }}
                    >
                      <Icon className="w-7 h-7" style={{ color: colors.text }} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="metric-value text-3xl mb-1" style={{ color: colors.text }}>
                        <AnimatedNumber 
                          value={outcome.value} 
                          prefix={outcome.prefix}
                          suffix={outcome.suffix}
                          shouldAnimate={shouldAnimate}
                        />
                      </div>
                      <h3 className="font-medium text-slate-primary mb-1">
                        {outcome.label}
                      </h3>
                      <p className="text-xs text-slate-secondary">
                        {outcome.description}
                      </p>
                    </div>

                    <TrendingDown className="w-5 h-5 text-cyan flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caption */}
          <div className="mt-4 text-center">
            <p className="font-mono text-xs text-slate-secondary">
              Results from a 90-day deployment with a Series B SaaS team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
