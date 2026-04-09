import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/AppProviders';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Battery, Activity } from 'lucide-react';

const Energy = () => {
  const socket = useContext(SocketContext);
  const [energyData, setEnergyData] = useState({ usageMW: 450, gridStatus: 'Stable' });
  const [history, setHistory] = useState(
    Array.from({ length: 20 }).map((_, i) => ({ time: `10:${i}0`, mw: 400 + Math.random() * 50 }))
  );

  useEffect(() => {
    if (!socket) return;
    socket.on('city-data', (data) => {
      setEnergyData(data.energy);
      setHistory(prev => {
        const h = [...prev, { time: new Date(data.timestamp).toLocaleTimeString(), mw: parseFloat(data.energy.usageMW) }];
        if (h.length > 20) h.shift();
        return h;
      });
    });
    return () => socket.off('city-data');
  }, [socket]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Smart Grid Management</h2>
        <p className="text-slate-400 text-sm">Real-time electricity consumption and distribution</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Current Load</p>
            <p className="text-3xl font-bold text-white">{energyData.usageMW} <span className="text-lg text-slate-500">MW</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Zap size={24} className="text-yellow-400" />
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Grid Status</p>
            <p className="text-2xl font-bold text-green-400">{energyData.gridStatus}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <Activity size={24} className="text-green-400" />
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Battery Storage</p>
            <p className="text-3xl font-bold text-white">84<span className="text-lg text-slate-500">%</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Battery size={24} className="text-blue-400" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Live Consumption Graph</h3>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#eab308' }}
              />
              <Area type="monotone" dataKey="mw" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorYellow)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Energy;
