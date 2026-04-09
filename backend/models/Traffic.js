const mongoose = require('mongoose');

const TrafficSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  volume: { type: Number, required: true },
  capacity: { type: Number, default: 100 },
  incidents: { type: Number, default: 0 },
  avgSpeed: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

const Traffic = mongoose.model('Traffic', TrafficSchema);
module.exports = Traffic;