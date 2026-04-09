import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AppProviders';
import { CheckCircle, Clock, MapPin } from 'lucide-react';

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([
    { _id: '1', category: 'infrastructure', description: 'Street light not working on Main Street', location: 'Sector 3', status: 'resolved', createdAt: new Date(Date.now() - 86400000) },
    { _id: '2', category: 'traffic', description: 'Traffic signal timing issue at downtown intersection', location: 'Downtown', status: 'pending', createdAt: new Date(Date.now() - 172800000) },
    { _id: '3', category: 'public_services', description: 'Park maintenance needed in North Zone', location: 'North Zone', status: 'pending', createdAt: new Date(Date.now() - 259200000) }
  ]);
  const [formData, setFormData] = useState({ category: 'infrastructure', description: '', location: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', formData);
      setMessage('Feedback submitted successfully!');
      setFormData({ category: 'infrastructure', description: '', location: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error submitting feedback.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Citizen Feedback Portal</h2>
        <p className="text-slate-400 text-sm">Report issues directly to city administration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-6 lg:col-span-1 border-t-4 border-t-cyan-500">
          <h3 className="text-lg font-bold text-white mb-4">Submit a Report</h3>
          {message && <div className="mb-4 p-3 rounded bg-blue-500/20 text-blue-300 text-sm">{message}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select 
                className="glass-input appearance-none" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="infrastructure">Infrastructure</option>
                <option value="traffic">Traffic/Roads</option>
                <option value="public_services">Public Services</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Location / Zone</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="e.g. Sector 4, Main St." 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea 
                className="glass-input h-24 resize-none" 
                placeholder="Give details about the issue..." 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">Submit Report</button>
          </form>
        </div>

        <div className="glass-panel p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Recent Reports</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {feedbacks.length === 0 ? <p className="text-slate-500">No reports found.</p> : feedbacks.map((fb) => (
              <div key={fb._id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded uppercase font-bold tracking-wider">{fb.category}</span>
                    <span className={`flex items-center text-xs font-medium ${fb.status === 'resolved' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {fb.status === 'resolved' ? <CheckCircle size={14} className="mr-1"/> : <Clock size={14} className="mr-1"/>}
                      {fb.status}
                    </span>
                  </div>
                  <p className="text-slate-200 text-sm mb-2">{fb.description}</p>
                  <p className="text-slate-500 text-xs flex items-center"><MapPin size={12} className="mr-1" /> {fb.location}</p>
                </div>
                {fb.status !== 'resolved' && (
                  <button 
                    onClick={() => {
                      setFeedbacks(feedbacks.map(f => f._id === fb._id ? { ...f, status: 'resolved' } : f));
                    }}
                    className="btn-secondary h-fit whitespace-nowrap text-xs"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;