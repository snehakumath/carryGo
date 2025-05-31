const { model, Schema } = require('mongoose');

const notificationSchema = new Schema({
  userId: { // Renamed from 'email' to 'userId' for clarity
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  orderId: { // Renamed from 'order_id' to 'orderId' for consistency
    type: Schema.Types.ObjectId,
    ref: 'Booking',
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['order', 'payment', 'assignment', 'general'],
    required: true,
  },
  isRead: { // Renamed from 'is_read' to 'isRead' for camelCase consistency
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

notificationSchema.index({ userId: 1, orderId: 1, type: 1 }, { unique: true });

const Notification = model('Notification', notificationSchema);
module.exports = Notification;

