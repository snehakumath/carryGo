const { model, Schema } = require('mongoose');

const paymentSchema = new Schema(
  {
    transaction_id: {
      type: String,
      required: true,
      unique: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    transporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    total_amount: {
      type: Number,
      required: true,
    },
    paid_amount: {
      type: Number,
      default: 0, // Initial paid amount
    },
    payment_milestones: [
      {
        stage: {
          type: String,
          enum: ['pickup', 'halfway', 'delivered'],
        },
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'paid'],
          default: 'pending',
        },
      },
    ],
    payment_date: {
      type: Date,
      default: Date.now,
    },
    payment_status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'pending',
    },
    payment_method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'UPI'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model('Payment', paymentSchema);
module.exports = Payment;
