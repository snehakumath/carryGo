const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  order_id: {
    type: String,
    unique: true,
    default: function () {
      return new mongoose.Types.ObjectId().toHexString();
    },
  },
  pickup_loc: {
    type: String,
    required: [true, "Pickup location is required"],
  },
  dropoff_loc: {
    type: String,
    required: [true, "Drop-off location is required"],
  },
  pickup_date: {
    type: Date,
    required: [true, "Pickup date is required"],
  },
  goods_type: {
    type: String,
    required: [true, "Goods type is required"],
  },
  goods_weight: {
    type: Number,
    min: [1, "Goods weight must be greater than zero"],
    required: [true, "Goods weight is required"],
  },
  truckType: {
    type: String,
    required: [true, "Truck type is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "Please provide a valid email address"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Assigned", "Paid", "Completed", "Cancelled"],
    default: "Pending",
  },
  
  transporter_email: {
    type:Schema.Types.ObjectId,
    ref:"User",
    // type: String,
    // match: [/.+@.+\..+/, "Please provide a valid email address"],
    default: null, // Initially, no email assigned
  },
  vehicle_id: { 
      type: Schema.Types.ObjectId,
       ref: "vehicle" 
      },
  order_completed: {
    type: Boolean,
    default: false, // Initially, the order is not completed
  },
  bid_status:{
    type: String,
    enum: ["Pending", "Customer Accepted", "Bidding", "Assigned"],
    default: "Pending",
  },
  final_amount: {
    type: Number,
    default: null,
  },  
  cancelled_by_transporter: {
    type: Boolean,
    default: false,
  },
  cancelled_by_customer: {
    type: Boolean,
    default: false,
  },  
  is_shared: {
    type: Boolean,
    default: false,
  },
  shared_with_email: {
    type: String,
    match: [/.+@.+\..+/, "Please provide a valid email address"],
    default: null,
  },
  pickup_coords: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: '2dsphere',
    },
  },
  dropoff_coords: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

