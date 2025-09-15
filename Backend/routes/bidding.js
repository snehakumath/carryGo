const express = require("express");
const router = express.Router();
const Bidding = require("../models/bidding");
const Booking = require("../models/booking");
const Vehicle=require("../models/vehicle")
const Notification = require("../models/notification");
const User=require("../models/user");
const mongoose=require('mongoose');
const { sendNotificationToCustomer, sendNotificationToTransporters } = require("./socketIo");

router.post("/place-bid", async (req, res) => {
  try {
    const { booking_id, transporter_email, bid_amount } = req.body;

    if (!booking_id || !transporter_email || !bid_amount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the transporter by email
    const transporter = await User.findOne({ email: transporter_email });
    if (!transporter) {
      return res.status(404).json({ message: "Transporter not found." });
    }

    const existingBid = await Bidding.findOne({ booking_id, transporter: transporter._id });
    if (existingBid) {
      return res.status(400).json({ message: "You have already placed a bid." });
    }

//     const updatedOrder = await Booking.findOneAndUpdate(
//       { _id: booking_id },
// //{ $set: {status:"Bidding",bid_status: "Bidding" } },
//       { new: true }
//     );

    // if (!updatedOrder) {
    //   return res.status(404).json({ message: "Order not found" });
    // }

    const newBid = new Bidding({
      booking_id,
      transporter: transporter._id,
      bid_amount,
      status: "Bidding"
    });

    await newBid.save();
   // console.log("New bid", newBid);
    res.status(201).json({ message: "Bid placed successfully!", newBid });

  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

  
router.get("/viewBids/:booking_id", async (req, res) => {
  const { booking_id } = req.params;

  try {    //here bid_amount 1 means sort in ascending , -1 means descending order
    const pendingBids = await Bidding.find({ booking_id:mongoose.Types.ObjectId(booking_id), status: "Pending" }).sort({ bid_amount: 1 });
    const acceptedBids = await Bidding.find({ booking_id:mongoose.Types.ObjectId(booking_id), status: "Accepted" }).sort({ bid_amount: 1 });
    const rejectedBids = await Bidding.find({ booking_id:mongoose.Types.ObjectId(booking_id), status: "Rejected" }).sort({ bid_amount: 1 });
    res.status(200).json({
      pendingBids,
      acceptedBids,
      rejectedBids
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/customer/accept", async (req, res) => {
  try {
    const { good_id, transporter_email, amount } = req.body;

    if (!good_id || !transporter_email || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transporter = await User.findOne({ email: transporter_email });
    if (!transporter) {
      return res.status(404).json({ error: "Transporter not found" });
    }

    const transporterId = transporter._id;

    // Update booking with accepted transporter
    let updatedBooking = await Booking.findByIdAndUpdate(
      good_id,
      {
        status: "Accepted",
        bid_status: "Customer Accepted",
        transporter_email: transporterId,
        final_amount: amount,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Reject other bids
    await Bidding.updateMany(
      {
        booking_id: new mongoose.Types.ObjectId(good_id),
        transporter: { $ne: transporterId },
      },
      { $set: { status: "Rejected" } }
    );

    // Find the assigned vehicle (if any)
    const vehicle = await Vehicle.findOne({ vehicle_id: updatedBooking.vehicle_id });

    if (vehicle && vehicle.truck_shared) {
      const assignedBookings = await Booking.find({
        _id: { $in: vehicle.assigned_bookings },
        status: "Accepted",
        _id: { $ne: updatedBooking._id }, // exclude current one
      });

      if (assignedBookings.length === 1) {
        // This is the second booking — update both amounts to half
        const sharedAmount = amount / 2;

        // Update the first customer's booking
        await Booking.findByIdAndUpdate(
          assignedBookings[0]._id,
          { final_amount: sharedAmount }
        );

        // Update this customer's booking too
        updatedBooking = await Booking.findByIdAndUpdate(
          good_id,
          { final_amount: sharedAmount },
          { new: true }
        );
      }
    }

    res.status(200).json({ message: "Bid accepted successfully", booking: updatedBooking });

  } catch (error) {
    console.error("❌ Error accepting bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/orders/bid/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { transporterEmail, bidAmount } = req.body;

  if (!transporterEmail || !bidAmount) {
      return res.status(400).json({ message: "Transporter email and bid amount are required." });
  }

  try {
      // Check if the order exists
      const booking = await Booking.findOne({ order_id: orderId });
      if (!booking) {
          return res.status(404).json({ message: "Order not found." });
      }

      const transporter = await User.findOne({ email: transporterEmail });
      if (!transporter) return res.status(404).json({ message: "Transporter not found" });
      
      const newBid = new Bidding({
        booking_id: booking._id,
        transporter: transporter._id,
        bid_amount: bidAmount,
        status: "Pending"
      });
      
      await newBid.save();

      // Optionally update booking status
      await Booking.updateOne({ order_id: orderId }, { status: "Bid" });

      res.status(201).json({ message: "Bid placed successfully.", bid: newBid });
  } catch (error) {
      console.error("Error placing bid:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/:email", async (req, res) => {
  try {
      const { email } = req.params;
      const transporter = await User.findOne({ email });
      if (!transporter) return res.status(404).json({ error: "Transporter not found" });
      
      const bids = await Bidding.find({ transporter: transporter._id });      
      res.status(200).json(bids);
  } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/received/:booking_id", async (req, res) => {
  const { booking_id } = req.params;

  try {
    // Fetch all bids for the given booking_id
    const bids = await Bidding.find({ booking_id:booking_id }).populate('transporter','email');
    res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Failed to fetch bids" });
  }
});
module.exports = router;
