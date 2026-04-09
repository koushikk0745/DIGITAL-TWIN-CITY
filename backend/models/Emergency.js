const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  type: { type: String, enum: ['Fire', 'Medical', 'Crime', 'Natural Disaster', 'Accident'], required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  location: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Reported', 'Dispatched', 'On Scene', 'Resolved'], default: 'Reported' },
  unitsDispatched: { type: Number, default: 0 },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  timestamp: { type: Date, default: Date.now }
});

const Emergency = mongoose.model('Emergency', EmergencySchema);
module.exports = Emergency;