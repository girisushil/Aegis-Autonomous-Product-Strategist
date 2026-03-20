import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Eye, Brain, Target, Radio, TrendingUp, Shield } from 'lucide-react';

const personas = [
  {
    id: 'scout',
    name: 'Scout',
    description: 'Monitors the competitive surface 24/7. Detects pricing changes, messaging shifts, and product launches across all channels.',
    icon: Eye,
    color: 'cyan',
    tags: ['Pricing', 'Messaging', 'Launches'],
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Turns noise into structured signals. Identifies patterns, trends, and sentiment shifts with machine learning precision.',
    icon: Brain,
    color: 'cobalt',
    tags: ['Trends', 'Sentiment', 'Risk'],
  },
  {
    id: 'strategist',
    name: 'Strategist',
    description: 'Builds responses and measures outcomes. Creates counter-plays, optimizes positioning, and tracks ROI.',
    icon: Target,
    color: 'amber',
    tags: ['Positioning', 'Plays', 'ROI'],
  },
];

export default function AgentPersonas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card) => {
        gsap.fromTo(card,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getColorStyles = (color: string) => {
    switch (color) {
      case 'cyan':
        return {
          bg: 'rgba(0, 240, 200, 0.1)',
          text: '#00F0C8',
          border: 'rgba(0, 240, 200, 0.2)',
        };
      case 'cobalt':
        return {
          bg: 'rgba(46, 91, 255, 0.1)',
          text: '#2E5BFF',
          border: 'rgba(46, 91, 255, 0.2)',
        };
      case 'amber':
        return {
          bg: 'rgba(255, 176, 0, 0.1)',
          text: '#FFB000',
          border: 'rgba(255, 176, 0, 0.2)',
        };
      default:
        return {
          bg: 'rgba(46, 91, 255, 0.1)',
          text: '#2E5BFF',
          border: 'rgba(46, 91, 255, 0.2)',
        };
    }
  };

  return (
    <div ref={sectionRef} className="section-flowing">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="mb-12">
          <h2 className="font-heading font-semibold text-3xl text-slate-primary mb-4">
            Meet the Agents
          </h2>
          <p className="text-slate-secondary max-w-2xl leading-relaxed">
            Aegis runs a team of specialized agents. Each handles a distinct part of the 
            intelligence cycle—so you don't have to.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="space-y-6">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            const colors = getColorStyles(persona.color);
            
            return (
              <div
                key={persona.id}
                ref={el => { if (el) cardsRef.current[index] = el; }}
                className="persona-card group cursor-pointer"
              >
                <div 
                  className="persona-icon transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: colors.bg,
                    color: colors.text,
                  }}
                >
                  <Icon className="w-8 h-8" />
                </div>
                
                <div className="persona-content">
                  <h3 className="persona-name">{persona.name}</h3>
                  <p className="persona-description">{persona.description}</p>
                  <div className="persona-tags">
                    {persona.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="persona-tag transition-all duration-200 group-hover:border-opacity-30"
                        style={{
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Decorative arrow */}
                <div 
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: colors.text }}
                >
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            { value: '24/7', label: 'Monitoring', icon: Radio },
            { value: '< 2min', label: 'Response Time', icon: TrendingUp },
            { value: '99.9%', label: 'Uptime', icon: Shield },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="glass-card p-6 text-center hover:border-cobalt/30 transition-all duration-300"
              >
                <Icon className="w-6 h-6 text-cobalt mx-auto mb-3" />
                <div className="metric-value text-2xl mb-1">{stat.value}</div>
                <div className="metric-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
