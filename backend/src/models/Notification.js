const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['appointment', 'message', 'call', 'report', 'recommendation'] },
  message: String,
  isRead: { type: Boolean, default: false },
  relatedId: mongoose.Schema.Types.ObjectId // e.g., appointmentId
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);