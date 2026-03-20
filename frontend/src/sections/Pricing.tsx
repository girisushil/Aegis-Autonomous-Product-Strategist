import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Check, Zap, Building2, Rocket } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For small teams validating competitive intel.',
    price: '0',
    period: 'forever free',
    icon: Rocket,
    featured: false,
    features: [
      '3 data sources',
      'Basic signal detection',
      'Email alerts',
      '7-day data retention',
      'Community support',
    ],
    cta: 'Start Free',
    color: 'slate',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams that need autonomous response.',
    price: '499',
    period: '/month',
    icon: Zap,
    featured: true,
    features: [
      'Unlimited data sources',
      'Advanced agent orchestration',
      'Real-time alerts & webhooks',
      '90-day data retention',
      'Priority support',
      'Custom playbooks',
      'API access',
    ],
    cta: 'Start Trial',
    color: 'cobalt',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Dedicated agents, custom playbooks, SLAs.',
    price: 'Custom',
    period: '',
    icon: Building2,
    featured: false,
    features: [
      'Everything in Business',
      'Dedicated agents',
      'Custom integrations',
      'Unlimited retention',
      '24/7 phone support',
      'On-premise option',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    color: 'amber',
  },
];

export default function Pricing() {
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
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: index * 0.1,
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
      case 'cobalt':
        return { 
          text: '#2E5BFF', 
          bg: 'rgba(46, 91, 255, 0.1)',
          border: 'rgba(46, 91, 255, 0.4)',
          glow: '0 8px 32px rgba(46, 91, 255, 0.15)',
        };
      case 'amber':
        return { 
          text: '#FFB000', 
          bg: 'rgba(255, 176, 0, 0.1)',
          border: 'rgba(255, 176, 0, 0.3)',
          glow: '0 8px 32px rgba(255, 176, 0, 0.1)',
        };
      default:
        return { 
          text: '#A7B0C8', 
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          glow: 'none',
        };
    }
  };

  return (
    <div ref={sectionRef} className="section-flowing">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="font-heading font-semibold text-3xl text-slate-primary mb-4">
            Pricing
          </h2>
          <p className="text-slate-secondary max-w-xl mx-auto">
            Choose the plan that fits your team's needs. All plans include core intelligence features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const colors = getColorStyles(plan.color);
            
            return (
              <div
                key={plan.id}
                ref={el => { if (el) cardsRef.current[index] = el; }}
                className={`pricing-card ${plan.featured ? 'featured' : ''}`}
                style={plan.featured ? {
                  boxShadow: colors.glow,
                  animation: 'pulse-glow 4s ease-in-out infinite',
                } : {}}
              >
                {/* Featured Badge */}
                {plan.featured && (
                  <div className="pricing-badge">Most Popular</div>
                )}

                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: colors.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: colors.text }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-slate-primary">
                      {plan.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="pricing-description">{plan.description}</p>

                {/* Price */}
                <div className="pricing-price">
                  {plan.price !== 'Custom' && '$'}
                  {plan.price}
                  <span>{plan.period}</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check 
                        className="w-4 h-4 flex-shrink-0 mt-0.5" 
                        style={{ color: colors.text }}
                      />
                      <span className="text-sm text-slate-secondary">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button 
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    plan.featured 
                      ? 'btn-primary' 
                      : 'btn-glass'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Enterprise Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-secondary text-sm">
            Need a custom solution?{' '}
            <button className="text-cobalt hover:text-cobalt-glow transition-colors">
              Talk to our sales team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
