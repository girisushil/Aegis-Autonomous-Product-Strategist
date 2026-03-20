import { useState, useEffect, useContext } from 'react';
import { Activity, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  isCombatMode: boolean;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
}

export default function Header({ isCombatMode }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Airia', status: 'online', latency: 24 },
    { name: 'Supabase', status: 'online', latency: 18 },
    { name: 'Linear', status: 'online', latency: 32 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate latency fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        latency: Math.max(10, service.latency + Math.floor(Math.random() * 10) - 5),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-3 h-3 text-cyan" />;
      case 'degraded':
        return <AlertTriangle className="w-3 h-3 text-amber" />;
      case 'offline':
        return <Activity className="w-3 h-3 text-crimson" />;
      default:
        return <CheckCircle2 className="w-3 h-3 text-cyan" />;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-500 header-container`}
      style={{
        background: isCombatMode 
          ? 'linear-gradient(180deg, rgba(255, 176, 0, 0.15) 0%, rgba(18, 21, 28, 0.95) 100%)'
          : 'linear-gradient(180deg, #12151C 0%, rgba(18, 21, 28, 0.95) 100%)',
        borderBottom: isCombatMode 
          ? '1px solid rgba(255, 176, 0, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #2E5BFF 0%, #1A3DCC 100%)',
            }}
          >
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-lg text-slate-primary hidden sm:block">
            AEGIS
          </span>
        </div>

        {/* System Health Ticker */}
        <div className="hidden md:flex items-center gap-6">
          {/* Status Badge */}
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
              isCombatMode 
                ? 'bg-amber/10 border-amber/40 text-amber crisis-pulse' 
                : 'bg-cyan/10 border-cyan/30 text-cyan'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isCombatMode ? 'bg-amber' : 'bg-cyan'} status-indicator`} />
            <span className="font-mono text-xs font-medium uppercase tracking-wider">
              {isCombatMode ? 'SYSTEM: CRISIS MODE' : 'SYSTEM: MONITORING'}
            </span>
          </div>

          {/* Service Status */}
          <div className="flex items-center gap-4">
            {services.map((service) => (
              <div 
                key={service.name}
                className="flex items-center gap-2 text-xs"
              >
                {getStatusIcon(service.status)}
                <span className="font-mono text-slate-secondary">{service.name}</span>
                <span className="font-mono text-slate-secondary/60">{service.latency}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Time */}
          <div className="hidden lg:block font-mono text-xs text-slate-secondary">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-secondary hover:bg-white/5 hover:text-slate-primary transition-all duration-200">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-crimson" />
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10">
            <div 
              className="w-full h-full flex items-center justify-center font-mono text-sm font-medium"
              style={{
                background: 'linear-gradient(135deg, rgba(46, 91, 255, 0.2) 0%, rgba(46, 91, 255, 0.1) 100%)',
                color: '#2E5BFF',
              }}
            >
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
