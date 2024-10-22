const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  type: { type: String, enum: ['training', 'coaching'], required: true },
  maxParticipants: { type: Number, default: 50 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  link: { type: String },
});

module.exports = mongoose.model('Session', sessionSchema);
