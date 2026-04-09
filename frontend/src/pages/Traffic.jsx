import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/AppProviders';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Car, AlertCircle } from 'lucide-react';

const Traffic = () => {
  const socket = useContext(SocketContext);
  const [trafficLevel, setTrafficLevel] = useState(40);
  const [incidents, setIncidents] = useState(1);

  // Mock historical data for graph
  const [zoneData] = useState([
    { zone: 'North', volume: 65, capacity: 100 },
    { zone: 'South', volume: 85, capacity: 100 }, // Congeasted
    { zone: 'East', volume: 45, capacity: 100 },
    { zone: 'West', volume: 55, capacity: 100 },
    { zone: 'Downtown', volume: 95, capacity: 100 } // Highly congested
  ]);

  useEffect(() => {
    if (!socket) return;
    socket.on('city-data', (data) => {
      setTrafficLevel(data.traffic.level);
      setIncidents(data.traffic.incidents);
    });
    return () => socket.off('city-data');
  }, [socket]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">City Traffic Control</h2>
          <p className="text-slate-400 text-sm">Live congestion monitoring and routing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 lg:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" className="stroke-slate-700" strokeWidth="12" fill="none" />
              <circle 
                cx="96" cy="96" r="88" 
                className={`stroke-current ${trafficLevel > 80 ? 'text-red-500' : trafficLevel > 50 ? 'text-yellow-500' : 'text-green-500'} transition-all duration-1000`} 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray={`${2 * Math.PI * 88}`} 
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - trafficLevel / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{trafficLevel}%</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Load</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <Car size={18} className="text-slate-400" />
            <span className="text-slate-200 font-medium">{trafficLevel > 80 ? 'Heavy Congestion' : trafficLevel > 50 ? 'Moderate Volume' : 'Smooth Flow'}</span>
          </div>
        </div>

        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Zonal Traffic Volume</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-xs text-slate-400"><span className="w-2 h-2 bg-red-500 rounded-full"></span> High</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Normal</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis dataKey="zone" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}/>
                <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.volume > 80 ? '#ef4444' : entry.volume > 50 ? '#eab308' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-yellow-500" />
          <h3 className="text-lg font-medium text-white">Active Traffic Incidents</h3>
          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{incidents} Active</span>
        </div>
        {incidents > 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg flex gap-4 animate-[pulse_2s_infinite]">
            <div className="w-2 h-full bg-red-500 rounded-full"></div>
            <div>
              <p className="text-white font-medium">Automatic Accident Detection</p>
              <p className="text-sm text-slate-400 mt-1">Incident reported on Highway 4. Rerouting algorithms active.</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">No active incidents reported.</p>
        )}
      </div>
    </div>
  );
};

export default Traffic;
