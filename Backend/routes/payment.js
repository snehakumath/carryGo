const express = require('express');
const router = express.Router();
const Payment = require('../models/payment'); 
const Booking=require('../models/booking');
const Vehicle=require('../models/vehicle');
const moment = require("moment");
const razorpay=require("../services/razorpay");
const crypto = require("crypto");
const User=require('../models/user');

// Route to get earnings of a transporter
router.get("/earnings/:transporterEmail", async (req, res) => {
  try {
    const transporterEmail = req.params.transporterEmail;

    // Fetch payments for the transporter
    const payments = await Payment.find({ transporter_email: transporterEmail });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No earnings found" });
    }

    // Calculate total earnings and pending payments
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.paid_amount, 0);
    const pendingEarnings = payments.reduce((sum, payment) => sum + (payment.total_amount - payment.paid_amount), 0);

    // Monthly earnings calculation
    const monthlyEarnings = {};
    payments.forEach((payment) => {
      const month = moment(payment.payment_date).format("YYYY-MM");
      if (!monthlyEarnings[month]) {
        monthlyEarnings[month] = { month, vehicles: [] };
      }
      monthlyEarnings[month].vehicles.push({
        vehicle_name: payment.vehicle_id || "Unknown Vehicle",
        earnings: payment.paid_amount,
      });
    });

    // Convert object to array
    const monthlyEarningsArray = Object.values(monthlyEarnings);

    res.status(200).json({
      payments,
      totalEarnings,
      pendingEarnings,
      monthlyEarnings: monthlyEarningsArray,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/completed-orders/:transporterEmail", async (req, res) => {
  const transporterEmail = req.params.transporterEmail;

  try {
    // Step 1: Find the transporter user
    const transporter = await User.findOne({ email: transporterEmail, user_type: "transporter" });
    if (!transporter) return res.status(404).json({ error: "Transporter not found" });

    // Step 2: Get all bookings assigned to transporter & marked as Paid
    const bookings = await Booking.find({
      transporter_email: transporter._id,
      status: "Paid"
    }).populate("vehicle_id");

    // Step 3: Get payment info for each booking
    const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
      const payment = await Payment.findOne({
        order_id: booking._id,
        payment_status: "success"
      });

      return {
        _id: booking._id,
        pickup_loc: booking.pickup_loc,
        dropoff_loc: booking.dropoff_loc,
        deliveryDate: booking.pickup_date,
        amountEarned: payment ? payment.total_amount : 0,
        truck: booking.vehicle_id
      };
    }));

    res.status(200).json(enrichedBookings);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/razorpay/create-order", async (req, res) => {
  try {
    const { amount, bookingId, transporter_email, payment_method } = req.body;
   console.log(amount, bookingId, transporter_email, payment_method);
    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Map transporter
    const transporter = await User.findOne({ email: transporter_email, user_type: "transporter" });
    if (!transporter) return res.status(404).json({ error: "Transporter not found" });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    // Create pending Payment record (IMPORTANT: do not update booking here)
    await Payment.create({
      transaction_id: order.id,       // razorpay order id
      order_id: booking._id,          // your Booking _id
      transporter: transporter._id,   // ObjectId
      total_amount: amount,
      payment_method,
      payment_status: "pending",
    });

    // Return order details to frontend
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// Route 2️⃣: Verify Razorpay payment and update DB
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)  // must match key_secret
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      // 1. Update Payment
      const payment = await Payment.findOneAndUpdate(
        { transaction_id: razorpay_order_id },
        {
          payment_status: "success",
          paid_amount: amount / 100,
          payment_date: new Date(),
        },
        { new: true }
      );

      if (!payment) return res.status(404).json({ error: "Payment record not found" });

      // 2. Update corresponding Booking status
      await Booking.findByIdAndUpdate(payment.order_id, {
        $set: { status: "Paid", final_amount: payment.total_amount }
      });

      res.json({ success: true, payment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update payment/booking" });
    }
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
});



module.exports = router;
