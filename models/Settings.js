const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  organizationName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  individualsList: { type: [String], required: true },
  servicesList: { type: [String], required: true },
  feedbackQuestions: { type: [String], required: true },
  customFeedbackQuestions: { type: [String], required: true }, // New field to store custom questions
  titleOptions: { type: [String], required: true }, // New field to store title options
  newsletterOptions: { type: [String], required: true } // New field to store newsletter options
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
