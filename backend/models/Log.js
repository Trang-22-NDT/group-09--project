const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  action: { type: String, required: true }, // e.g. login:failed, login:success, forgot-password
  ip: { type: String, default: null },
  userAgent: { type: String, default: null },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Log', logSchema);
