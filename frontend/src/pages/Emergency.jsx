import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/AppProviders';
import { AlertTriangle, Siren, Flame, Heart, Shield, Car, MapPin, Clock } from 'lucide-react';

const Emergency = () => {
  const socket = useContext(SocketContext);
  const [alerts, setAlerts] = useState([]);
  const [activeIncidents, setActiveIncidents] = useState([
    { id: 1, type: 'Fire', severity: 'High', location: 'Sector 4, Industrial Area', time: '10 min ago', status: 'Dispatched' },
    { id: 2, type: 'Medical', severity: 'Medium', location: 'Main St. & 5th Ave', time: '25 min ago', status: 'On Scene' }
  ]);

  const [units, setUnits] = useState({ fire: 8, ambulance: 12, police: 15 });

  useEffect(() => {
    if (!socket) return;
    socket.on('city-alert', (alert) => {
      if (alert.type === 'danger' || alert.type === 'warning') {
        setAlerts(prev => [alert, ...prev].slice(0, 5));
      }
    });

    socket.on('city-data', (data) => {
      if (data.emergency) {
        setUnits({
          fire: data.emergency.fireUnits,
          ambulance: data.emergency.ambulances,
          police: data.emergency.policeUnits
        });
      }
    });

    return () => {
      socket.off('city-alert');
      socket.off('city-data');
    };
  }, [socket]);

  const getIcon = (type) => {
    switch(type) {
      case 'Fire': return <Flame size={20} className="text-orange-500" />;
      case 'Medical': return <Heart size={20} className="text-red-500" />;
      case 'Crime': return <Shield size={20} className="text-purple-500" />;
      case 'Accident': return <Car size={20} className="text-blue-500" />;
      default: return <Siren size={20} className="text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Emergency Response Center</h2>
          <p className="text-slate-400 text-sm">Real-time emergency monitoring and dispatch</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 font-bold">{activeIncidents.length} Active Incidents</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="text-orange-400" size={24} />
            <span className="text-slate-300 font-medium">Fire Units</span>
          </div>
          <p className="text-3xl font-bold text-white">{units.fire}</p>
          <p className="text-slate-400 text-sm">Standby</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="text-blue-400" size={24} />
            <span className="text-slate-300 font-medium">Ambulances</span>
          </div>
          <p className="text-3xl font-bold text-white">{units.ambulance}</p>
          <p className="text-slate-400 text-sm">Ready</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-purple-400" size={24} />
            <span className="text-slate-300 font-medium">Police Units</span>
          </div>
          <p className="text-3xl font-bold text-white">{units.police}</p>
          <p className="text-slate-400 text-sm">Patrolling</p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-yellow-400" size={24} />
            <span className="text-slate-300 font-medium">Response Time</span>
          </div>
          <p className="text-3xl font-bold text-white">8<span className="text-lg text-slate-500">min</span></p>
          <p className="text-slate-400 text-sm">Average</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-medium text-white mb-6">Active Incidents</h3>
        <div className="space-y-4">
          {activeIncidents.map((incident) => (
            <div key={incident.id} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center gap-4">
              {getIcon(incident.type)}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-bold">{incident.type}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {incident.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {incident.time}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-medium">
                {incident.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emergency;