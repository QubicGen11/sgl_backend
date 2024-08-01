const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  organizationName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  services: { type: [String], required: true },
  individuals: { type: [String], required: true },
  professionalism: { type: Map, of: Number, required: true },
  responseTime: { type: Map, of: Number, required: true },
  overallServices: { type: Map, of: Number, required: true },
  feedback: { type: String, required: true },
  recommend: { type: String, required: true },
  subscribeNewsletter: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  customResponses: { type: Map, of: String },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
