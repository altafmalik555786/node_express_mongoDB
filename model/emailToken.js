const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    email: { type: String, required: true },
    expiration: { type: Date, required: true },
  });

module.exports = mongoose.model('Token', tokenSchema)