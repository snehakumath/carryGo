// models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    // unique: true ❌ remove this
  },  
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  transporter_email: {
    type: String,
    match: [/.+@.+\..+/, "Please provide a valid email address"],
    default: null,
  },  
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  feedbackText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
