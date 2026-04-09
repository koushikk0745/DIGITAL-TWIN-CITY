import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/AppProviders';
import { AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';

const Alerts = () => {
  const socket = useContext(SocketContext);
  const [alerts, setAlerts] = useState([
    { type: 'info', msg: 'System initialized. Monitoring active.', timestamp: new Date() }
  ]);

  useEffect(() => {
    if (!socket) return;
    socket.on('city-alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 20)); // keep last 20
    });
    return () => socket.off('city-alert');
  }, [socket]);

  const getAlertStyle = (type) => {
    switch(type) {
      case 'danger': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: <ShieldAlert size={24} className="text-red-500" /> };
      case 'warning': return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: <AlertTriangle size={24} className="text-yellow-500" /> };
      case 'success': return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: <CheckCircle size={24} className="text-green-500" /> };
      default: return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: <Info size={24} className="text-blue-500" /> };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">City Event Log</h2>
        <p className="text-slate-400 text-sm">Real-time automated alerts from IoT sensors</p>
      </div>

      <div className="glass-panel p-6 min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Feed
          </h3>
          <span className="text-xs text-slate-500">Auto-updating...</span>
        </div>

        <div className="space-y-4">
          {alerts.map((alert, idx) => {
            const style = getAlertStyle(alert.type);
            return (
              <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${style.border} ${style.bg} animate-[fadeIn_0.5s_ease-out]`}>
                <div className="mt-1">{style.icon}</div>
                <div className="flex-1">
                  <p className={`font-medium ${style.text} mb-1 shadow-sm`}>{alert.msg}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          {alerts.length === 0 && <div className="text-center text-slate-500 py-10">No recent alerts.</div>}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
