import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/AppProviders';
import { Trash2, Recycle, Truck, AlertTriangle, TrendingUp } from 'lucide-react';

const Waste = () => {
  const socket = useContext(SocketContext);
  const [wasteData, setWasteData] = useState({ collected: 125, recycled: 45, efficiency: 92 });
  const [history, setHistory] = useState(
    Array.from({ length: 10 }).map((_, i) => ({ day: `Day ${i+1}`, collected: Math.floor(Math.random() * 50 + 100), recycled: Math.floor(Math.random() * 20 + 30) }))
  );

  useEffect(() => {
    if (!socket) return;
    socket.on('city-data', (data) => {
      if (data.waste) {
        setWasteData(data.waste);
      }
    });
    return () => socket?.off('city-data');
  }, [socket]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Waste Management System</h2>
        <p className="text-slate-400 text-sm">Real-time waste collection and recycling monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-white">{wasteData.collected} <span className="text-lg text-slate-500">tons</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Trash2 size={24} className="text-purple-400" />
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Recycled</p>
            <p className="text-3xl font-bold text-green-400">{wasteData.recycled} <span className="text-lg text-slate-500">tons</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <Recycle size={24} className="text-green-400" />
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Efficiency</p>
            <p className="text-3xl font-bold text-cyan-400">{wasteData.efficiency}<span className="text-lg text-slate-500">%</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <TrendingUp size={24} className="text-cyan-400" />
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Active Vehicles</p>
            <p className="text-3xl font-bold text-white">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Truck size={24} className="text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium text-white mb-6">Collection History</h3>
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">{item.day}</span>
                <div className="flex gap-6">
                  <span className="text-purple-400">{item.collected}t</span>
                  <span className="text-green-400">{item.recycled}t</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium text-white mb-6">Zone Status</h3>
          <div className="space-y-4">
            {['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Downtown'].map((zone, i) => (
              <div key={zone} className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center">
                <span className="text-slate-300">{zone}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  i < 3 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {i < 3 ? 'Completed' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waste;