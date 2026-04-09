const mongoose = require('mongoose');

const PollutionSchema = new mongoose.Schema({
  aqi: { type: Number, required: true },
  pm25: { type: Number },
  pm10: { type: Number },
  ozone: { type: Number },
  no2: { type: Number },
  so2: { type: Number },
  co: { type: Number },
  status: { type: String, enum: ['Good', 'Moderate', 'Unhealthy', 'Very Unhealthy'], default: 'Good' },
  location: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Pollution = mongoose.model('Pollution', PollutionSchema);
module.exports = Pollution;