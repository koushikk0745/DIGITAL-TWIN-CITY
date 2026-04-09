import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock } from 'lucide-react';

const News = () => {
  const [news, setNews] = useState([
    { title: 'New Smart Grid Activated in Downtown', source: 'City Tribune', time: '2 hours ago', category: 'Energy' },
    { title: 'Water Conservation Efforts Show 15% Reduction', source: 'Eco Daily', time: '5 hours ago', category: 'Water' },
    { title: 'Major Traffic Redirections for Weekend Festival', source: 'Metro News', time: '1 day ago', category: 'Traffic' },
    { title: 'City Launches Emergency Response App', source: 'Tech Today', time: '1 day ago', category: 'Emergency' },
    { title: 'New Recycling Centers Open in All Zones', source: 'Green City', time: '2 days ago', category: 'Waste' },
    { title: 'Air Quality Improves After New Regulations', source: 'Environmental Watch', time: '3 days ago', category: 'Pollution' }
  ]);

  useEffect(() => {
    api.get('/data/news')
      .then(res => {
        if (Array.isArray(res.data)) {
          setNews(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">City News & Updates</h2>
        <p className="text-slate-400 text-sm">Latest announcements and developments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(news) && news.map((item, index) => (
          <div key={index} className="glass-panel overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300">
            <div className="h-48 bg-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 w-full h-full"></div>
              <div className="w-full h-full bg-blue-900/30 group-hover:bg-blue-800/50 transition-colors flex items-center justify-center">
                <span className="text-blue-500/20 text-6xl">📰</span>
              </div>
            </div>
            <div className="p-6 relative z-20 -mt-12">
              <span className="bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">{item.category}</span>
              <h3 className="text-lg font-bold text-white mt-4 mb-3 leading-tight group-hover:text-cyan-400 transition-colors">{item.title}</h3>
              <div className="flex items-center text-slate-500 text-sm">
                <Clock size={14} className="mr-1" /> {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;