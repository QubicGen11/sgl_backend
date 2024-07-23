const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  email: { type: String, required: true },
  organizationName: { type: String, required: false },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  services: { type: [String], required: true },
  individuals: { type: [String], required: true },
  professionalism: { type: Object, required: true },
  responseTime: { type: Object, required: true },
  overallServices: { type: Object, required: true },
  feedback: { type: String, required: true },
  recommend: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);