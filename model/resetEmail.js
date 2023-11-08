const mongoose = require('mongoose');

const resetCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Code expires after 1 hour
});

module.exports = mongoose.model('ResetCode', resetCodeSchema)
