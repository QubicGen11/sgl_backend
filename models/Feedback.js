// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  services: [String],
  individuals: [String],
  professionalism: Object,
  responseTime: Object,
  overallServices: Object,
  feedback: String,
  recommend: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
