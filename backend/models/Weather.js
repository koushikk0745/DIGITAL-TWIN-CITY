const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  temp: { type: Number, required: true },
  humidity: { type: Number },
  windSpeed: { type: Number },
  windDirection: { type: String },
  condition: { type: String, enum: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Stormy', 'Snowy'], default: 'Sunny' },
  pressure: { type: Number },
  visibility: { type: Number },
  uvIndex: { type: Number },
  forecast: [{
    day: { type: String },
    high: { type: Number },
    low: { type: Number },
    condition: { type: String }
  }],
  timestamp: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', WeatherSchema);
module.exports = Weather;