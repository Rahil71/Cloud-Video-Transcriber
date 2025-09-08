const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  cloudURL: { type: String, required: true },
  publicId: { type: String, required: true }, // for deleting later
  status: { type: String, default: 'uploaded' },
  transcript: { type: String, default: " " },
  summary: { type: String, default: ' ' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
