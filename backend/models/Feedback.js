const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, enum: ['infrastructure', 'traffic', 'public_services', 'other'] },
  description: { type: String, required: true },
  location: { type: String },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
