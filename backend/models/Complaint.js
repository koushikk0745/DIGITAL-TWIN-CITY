const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Infrastructure', 'Sanitation', 'Noise', 'Traffic', 'Safety', 'Environment', 'Other'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: String },
  resolution: { type: String },
  resolvedAt: { type: Date },
  timestamp: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint;