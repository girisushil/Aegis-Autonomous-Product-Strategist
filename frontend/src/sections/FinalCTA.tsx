import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Mail, Twitter, Linkedin, Github, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headlineRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(ctaRef.current,
        { scale: 0.98, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            end: 'top 70%',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="section-flowing">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <div ref={headlineRef} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cobalt/10 border border-cobalt/30 mb-6">
            <Shield className="w-4 h-4 text-cobalt" />
            <span className="font-mono text-xs text-cobalt">Trusted by 500+ teams</span>
          </div>
          
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-slate-primary mb-6 leading-tight">
            Ready to defend your<br />
            <span className="text-cobalt">market position?</span>
          </h2>
          
          <p className="text-slate-secondary text-lg max-w-xl mx-auto">
            Deploy Aegis in under an hour. Start with a 14-day pilot and see the difference autonomous intelligence makes.
          </p>
        </div>

        {/* CTA Form */}
        <div ref={ctaRef} className="mb-16">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-primary placeholder:text-slate-secondary focus:outline-none focus:border-cobalt/50 transition-colors"
                disabled={submitted}
              />
            </div>
            <button
              type="submit"
              disabled={submitted}
              className="btn-primary px-8 py-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Request Sent
                </>
              ) : (
                <>
                  Request Pilot Access
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-slate-secondary">
            No credit card required. Full feature access during pilot.
          </p>
        </div>

        {/* Footer */}
        <footer ref={footerRef} className="pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #2E5BFF 0%, #1A3DCC 100%)',
                }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-slate-primary">AEGIS</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-secondary hover:text-slate-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-secondary hover:text-slate-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-secondary hover:text-slate-primary transition-colors">
                Security
              </a>
              <a 
                href="mailto:contact@aegis.io" 
                className="text-sm text-cobalt hover:text-cobalt-glow transition-colors"
              >
                contact@aegis.io
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-secondary hover:text-slate-primary hover:bg-white/[0.1] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-secondary/60">
              © 2024 Aegis Intelligence. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
