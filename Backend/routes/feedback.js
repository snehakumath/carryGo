const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
const Booking = require('../models/booking');
const User = require('../models/user');
const mongoose = require('mongoose');


router.post('/', async (req, res) => {
  try {
    const { orderId, rating, feedbackText } = req.body;
  //  console.log('🔔 Received feedback request:', req.body);

    // Find booking by order_id (string)
    const booking = await Booking.findOne({ order_id: orderId }).populate('transporter_email');
   // console.log('📦 Booking found:', booking);

    if (!booking) {
      console.log('❌ No booking found with orderId:', orderId);
      return res.status(404).json({ message: 'Booking not found with this orderId.' });
    }

    // Check if feedback already exists for this booking _id
    const existingFeedback = await Feedback.findOne({ orderId: booking._id });
   // console.log('🔍 Existing feedback for booking:', existingFeedback);

    if (existingFeedback) {
      console.log('⚠️ Feedback already submitted for this order.');
      return res.status(400).json({ message: 'Feedback already submitted for this order.' });
    }

    // Find customer user by booking.email
    const customer = await User.findOne({ email: booking.email });
  //  console.log('👤 Customer found:', customer);

    if (!customer) {
      console.log('❌ Customer user not found with email:', booking.email);
      return res.status(404).json({ message: 'Customer user not found' });
    }

    // Extract transporter email (string)
    let transporterEmail = null;
    if (booking.transporter_email && booking.transporter_email.email) {
      transporterEmail = booking.transporter_email.email;
     // console.log('🚚 Transporter (populated) email:', transporterEmail);
    } else if (typeof booking.transporter_email === 'string') {
      transporterEmail = booking.transporter_email;
    //  console.log('🚚 Transporter (string) email:', transporterEmail);
    } else {
      console.log('⚠️ Transporter not assigned yet for this order.');
      return res.status(400).json({ message: 'Transporter not assigned yet for this order.' });
    }

    // Create feedback document
    const feedback = new Feedback({
      orderId: booking._id,
      customerId: customer._id,
      transporter_email: transporterEmail,
      rating: parseInt(rating),
      feedbackText,
    });

    await feedback.save();
   // console.log('✅ Feedback saved successfully:', feedback);

    res.status(201).json({ message: 'Feedback submitted successfully.', feedback });

  } catch (err) {
    console.error('❗ Error saving feedback:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// GET feedback for an order
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    //console.log("Get", orderId);

    if (!mongoose.isValidObjectId(orderId)) {
      console.log("Invalid ObjectId format"); // ✅ Debug
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    const objectId = new mongoose.Types.ObjectId(orderId);
    //console.log("Object Id", objectId);

    const feedback = await Feedback.findOne({ orderId: objectId });
    //console.log("Feedback", feedback);

    if (!feedback) {
      return res.status(404).json({ message: 'No feedback found for this order.' });
    }

    res.json({ feedback });

  } catch (err) {
    console.log("Catch Error", err); // ✅ Debug
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});
module.exports = router; 