const mongoose = require('mongoose');

const WasteSchema = new mongoose.Schema({
  collected: { type: Number, required: true },
  recycled: { type: Number },
  landfill: { type: Number },
  organic: { type: Number },
  binsCollected: { type: Number },
  missedCollections: { type: Number },
  efficiency: { type: Number },
  vehicleStatus: { type: String },
  zone: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Waste = mongoose.model('Waste', WasteSchema);
module.exports = Waste;