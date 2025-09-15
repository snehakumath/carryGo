const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../models/payment");
const Booking = require("../models/booking");

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body;

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (expectedSignature !== signature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    if (body.event === "payment.captured") {
      const { order_id, amount, id: transaction_id } = body.payload.payment.entity;

      // 1. Idempotency check → skip if payment already processed
      const existingPayment = await Payment.findOne({ transaction_id }).session(session);
      if (existingPayment && existingPayment.payment_status === "success") {
        await session.abortTransaction();
        session.endSession();
        return res.json({ status: "duplicate webhook ignored" });
      }

      // 2. Update/Create Payment atomically
      const payment = await Payment.findOneAndUpdate(
        { transaction_id },
        {
          order_id,
          payment_status: "success",
          paid_amount: amount / 100,
          payment_date: new Date(),
        },
        { new: true, upsert: true, session }
      );

      // 3. Update Booking atomically
      await Booking.findByIdAndUpdate(
        payment.order_id,
        {
          $set: { status: "Paid", final_amount: payment.total_amount }
        },
        { session }
      );
    }

    // ✅ Commit both payment + booking
    await session.commitTransaction();
    session.endSession();

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
