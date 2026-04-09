const mongoose = require('mongoose');

const WaterSchema = new mongoose.Schema({
  tankLevel: { type: Number, required: true },
  pressure: { type: Number },
  flowRate: { type: Number },
  quality: { type: Number },
  ph: { type: Number },
  turbidity: { type: Number },
  sector: { type: String },
  status: { type: String, enum: ['Normal', 'Warning', 'Critical'], default: 'Normal' },
  timestamp: { type: Date, default: Date.now }
});

const Water = mongoose.model('Water', WaterSchema);
module.exports = Water;