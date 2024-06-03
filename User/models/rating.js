const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: false }
});

module.exports = mongoose.model('Rating', ratingSchema);
