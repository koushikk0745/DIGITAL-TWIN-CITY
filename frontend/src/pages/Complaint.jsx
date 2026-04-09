import React, { useState } from 'react';
import { MessageSquare, MapPin, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

const Complaint = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, category: 'Infrastructure', title: 'Pothole on Main Street', status: 'In Progress', priority: 'High', date: '2 hours ago' },
    { id: 2, category: 'Sanitation', title: 'Missed garbage collection', status: 'Pending', priority: 'Medium', date: '5 hours ago' },
    { id: 3, category: 'Noise', title: 'Construction noise violation', status: 'Resolved', priority: 'Low', date: '1 day ago' },
    { id: 4, category: 'Traffic', title: 'Broken traffic signal', status: 'In Progress', priority: 'High', date: '1 day ago' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ category: '', specificReason: '', title: '', description: '', location: '' });

  const getSpecificReasons = (category) => {
    switch(category) {
      case 'Infrastructure': return ['Pothole', 'Broken Streetlight', 'Damaged Sidewalk', 'Collapsed Bridge', 'Other'];
      case 'Sanitation': return ['Missed Garbage Pick-up', 'Illegal Dumping', 'Overflowing Public Bin', 'Other'];
      case 'Noise': return ['Construction Noise', 'Loud Music/Party', 'Industrial Noise', 'Other'];
      case 'Traffic': return ['Broken Signal', 'Heavy Congestion', 'Accident Hazard', 'Missing Signage', 'Other'];
      case 'Safety': return ['Suspicious Activity', 'Vandalism', 'Fire Hazard', 'Other'];
      case 'Environment': return ['Air Pollution', 'Water Contamination', 'Fallen Tree', 'Other'];
      default: return [];
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const complaint = {
      id: complaints.length + 1,
      ...newComplaint,
      title: newComplaint.specificReason ? `${newComplaint.specificReason} - ${newComplaint.title}` : newComplaint.title,
      status: 'Pending',
      priority: 'Medium',
      date: 'Just now'
    };
    setComplaints([complaint, ...complaints]);
    setShowForm(false);
    setNewComplaint({ category: '', specificReason: '', title: '', description: '', location: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Complaint Management</h2>
          <p className="text-slate-400 text-sm">Track and manage citizen complaints</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Send size={18} />
          Submit Complaint
        </button>
      </div>

      {showForm && (
        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium text-white mb-4">New Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Category</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Noise">Noise</option>
                  <option value="Traffic">Traffic</option>
                  <option value="Safety">Safety</option>
                  <option value="Environment">Environment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {newComplaint.category && newComplaint.category !== 'Other' && (
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Specific Reason</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    value={newComplaint.specificReason}
                    onChange={(e) => setNewComplaint({...newComplaint, specificReason: e.target.value})}
                    required
                  >
                    <option value="">Select Specific Issue</option>
                    {getSpecificReasons(newComplaint.category).map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-slate-400 text-sm mb-2">Location</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter location"
                  value={newComplaint.location}
                  onChange={(e) => setNewComplaint({...newComplaint, location: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Title</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Brief description"
                value={newComplaint.title}
                onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Description</label>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none h-24"
                placeholder="Detailed description of the issue"
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                required
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <AlertCircle size={24} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-white">{complaints.filter(c => c.status === 'Pending').length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Clock size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-white">{complaints.filter(c => c.status === 'In Progress').length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle size={24} className="text-green-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Resolved</p>
            <p className="text-2xl font-bold text-white">{complaints.filter(c => c.status === 'Resolved').length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <MessageSquare size={24} className="text-purple-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{complaints.length}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-medium text-white mb-6">All Complaints</h3>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-medium">{complaint.title}</span>
                    <span className={`text-xs font-bold ${getPriorityColor(complaint.priority)}`}>{complaint.priority}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><MessageSquare size={14}/> {complaint.category}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {complaint.location || 'N/A'}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {complaint.date}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-bold border ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Complaint;