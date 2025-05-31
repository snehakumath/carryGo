const mongoose = require("mongoose");
const BiddingSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  transporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bid_amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected","Bidding"], default: "Pending" }
});

module.exports = mongoose.model("Bidding", BiddingSchema);