const mongoose = require('mongoose');

const EnergySchema = new mongoose.Schema({
  usageMW: { type: Number, required: true },
  gridStatus: { type: String, enum: ['Stable', 'Warning', 'Critical'], default: 'Stable' },
  peakLoad: { type: Number },
  renewablePercentage: { type: Number },
  batteryStorage: { type: Number },
  solarOutput: { type: Number },
  windOutput: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

const Energy = mongoose.model('Energy', EnergySchema);
module.exports = Energy;