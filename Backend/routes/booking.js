const express = require("express");
const router = express.Router();
const mongoose=require('mongoose');
const Booking = require("../models/booking"); // Adjust path to your Booking model
const jwt = require("jsonwebtoken");
const Vehicle = require('../models/vehicle');
const User = require('../models/user'); 
const Bidding = require("../models/bidding");
const { getIo } = require("./socketIo"); 
const cron = require('node-cron');
const Notification=require("../models/notification");
const { sendNotificationToCustomer, sendNotificationToTransporters } = require("./socketIo"); // Import socket functions
// const authenticateJWT=require('../middleware/auth'); 

const authenticateUser = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "$uperMan@123");
    req.user = decoded; // Attach user details to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

router.post("/process", async (req, res) => {
 // console.log("🔥 Start processing booking...");
  const {
    pickup_loc,
    dropoff_loc,
    pickup_date,
    goods_type,
    goods_weight,
    truckType,
    name,
    phone,
    email,
    is_shared,
    pickup_coords,
  dropoff_coords,
  } = req.body;
//console.log("is shared",is_shared);
  try {
    // Create and save booking
    const newBooking = new Booking({
      pickup_loc,
      dropoff_loc,
      pickup_date,
      goods_type,
      goods_weight,
      truckType,
      name,
      phone,
      email,
      is_shared,
      pickup_coords: {
        type: 'Point',
        coordinates: [pickup_coords.lng, pickup_coords.lat],
      },
      dropoff_coords: {
        type: 'Point',
        coordinates: [dropoff_coords.lng, dropoff_coords.lat],
      },
      
    });
 // console.log("Booking",newBooking);
    await newBooking.save();
    await sendNotificationToTransporters(
      `New booking from ${pickup_loc} to ${dropoff_loc}`,
      newBooking._id
    );
    //console.log("Saved");
    // Respond with success message
    res.status(201).json({
      message: "Booking successfully created!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({
      error: "An error occurred while creating the booking.",
      details: error.message,
    });
  }
});
router.get("/similar-routes/:bookingId", async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const MAX_DISTANCE_METERS = 20000; // 20km

  const similarBookings = await Booking.find({
    _id: { $ne: booking._id }, // Exclude current
    pickup_coords: {
      $near: {
        $geometry: booking.pickup_coords,
        $maxDistance: MAX_DISTANCE_METERS,
      },
    },
    dropoff_coords: {
      $near: {
        $geometry: booking.dropoff_coords,
        $maxDistance: MAX_DISTANCE_METERS,
      },
    },
  });

  res.json(similarBookings);
});


router.get("/goods", async (req, res) => {
  try {
    const goods = await Booking.find({}, "booking_id goods_type pickup_loc dropoff_loc email transporter_email status pickup_date bid_status is_shared vehicle_id")
    .populate('transporter_email', 'email')
    .populate("_id", "vehicle_type model_make capacity registration_number vehicle_id"); // Fetch relevant fields
    // console.log("goods details",goods);
    res.json(goods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// router.get("/orders", async (req, res) => {
//   try {
//     const transporterEmail = req.query.transporterEmail;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // ✅ Step 1: Get transporter by email
//     const transporter = await User.findOne({ email: transporterEmail }).lean();
//     if (!transporter) return res.status(404).json({ error: "Transporter not found" });

//     const transporterId = transporter._id;

//     // ✅ Step 2: Fetch bookings
//     const [eligibleBookings, acceptedBookings] = await Promise.all([
//       Booking.find({
//         pickup_date: { $gte: today },
//         status: { $in: ["Accepted", "Pending"] },
//         bid_status: { $in: ["Pending", "Bidding"] },
//       }).lean(),
//       Booking.find({
//         pickup_date: { $gte: today },
//         status: "Accepted",
//         bid_status: "Customer Accepted",
//         transporter_email: transporterId, // ✅ This now works
//       }).lean(),
//     ]);

//     // ✅ Step 3: Get all bids by transporter
//     const transporterBids = await Bidding.find({
//       transporter: transporterId,
//     }).lean();

//     const transporterBidIds = new Set(
//       transporterBids.map((bid) => bid.booking_id.toString())
//     );

//     const placedBids = [];
//     const availableOrders = [];

//     for (const booking of eligibleBookings) {
//       const id = booking._id.toString();
//       if (transporterBidIds.has(id)) {
//         placedBids.push(booking);
//       } else {
//         availableOrders.push(booking);
//       }
//     }

//     return res.json({
//       availableOrders,
//       placedBids,
//       acceptedOrders: acceptedBookings,
//     });

//   } catch (error) {
//     console.error("❌ Error in /orders:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.get("/orders", async (req, res) => {
  try {
    const transporterEmail = req.query.transporterEmail;
    if (!transporterEmail) {
      return res.status(400).json({ error: "Transporter email required" });
    }

    const transporter = await User.findOne({ email: transporterEmail }).lean();
    if (!transporter) {
      return res.status(404).json({ error: "Transporter not found" });
    }
    const transporterId = transporter._id;
     console.log("Transporter Id", transporterId);
    // 1️⃣ Get all "Bidding" bids by this transporter
    const transporterBids = await Bidding.find({
      transporter: transporterId,
      status: "Bidding",
    }).select("booking_id").lean();
    console.log("TransporterBids",transporterBids);
    const bidBookingIds = transporterBids.map(b => b.booking_id);

    // 2️⃣ Available Orders → Booking.status = Pending and not already bid by transporter
    const availableOrders = await Booking.find({
      pickup_date: { $gte: new Date() },
      status: "Pending",
      _id: { $nin: bidBookingIds },
    }).lean();
   console.log("Available Orders",availableOrders);
    // 3️⃣ Placed Bids → transporter has bid but still "Bidding"
    const placedBids = await Bidding.find({
      transporter: transporterId,
      status: "Bidding",
    })
      .populate("booking_id")
      .lean();
      console.log("placee bids",placedBids);

    // 4️⃣ Accepted Orders → transporter bid status is "Accepted"
    const acceptedOrders = await Bidding.find({
      transporter: transporterId,
      status: "Accepted",
    })
      .populate("booking_id")
      .lean();

    return res.json({
      availableOrders,
      placedBids,
      acceptedOrders,
    });

  } catch (error) {
    console.error("❌ Error in /orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



// router.get("/orders", async (req, res) => {
//   try {
//     const transporterEmail = req.query.transporterEmail;
//     if (!transporterEmail) {
//       return res.status(400).json({ error: "Transporter email required" });
//     }

//     // ✅ Get transporter
//     const transporter = await User.findOne({ email: transporterEmail }).lean();
//     if (!transporter) {
//       return res.status(404).json({ error: "Transporter not found" });
//     }

//     const transporterId = transporter._id;

//     // 1️⃣ Available Orders → transporter not assigned yet
//     const availableOrders = await Booking.find({
//       pickup_date: { $gte: new Date() },
//       transporter_email: null,
     
//     }).lean();

//     // 2️⃣ Placed Bids → transporter placed bid but still bidding
//     const placedBids = await Booking.find({
//       pickup_date: { $gte: new Date() },
//       transporter_email: transporterId,
//       bid_status: "Bidding",
//     }).lean();

//     // 3️⃣ Accepted Orders → customer accepted this transporter
//     const acceptedOrders = await Booking.find({
//       pickup_date: { $gte: new Date() },
//       transporter_email: transporterId,
//       bid_status: "Customer Accepted",
//      status: { $in: ["Accepted", "Assigned"] },
//     }).lean();

//     //console.log("Result orders",acceptedOrders, availableOrders, placedBids);
//     return res.json({
//       availableOrders,
//       placedBids,
//       acceptedOrders,
//     });
//   } catch (error) {
//     console.error("❌ Error in /orders:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });


//fetch transporter and vehicle detail for customer
router.get('/:order_id', async (req, res) => {
  console.log("2");
  try {
    const booking = await Booking.findOne({ order_id: req.params.order_id }).populate('vehicle_id');
    if (!booking) return res.status(404).send('Booking not found');

    let response = {
      booking,
      status: booking.status || 'Pending',
    };

    // If the status is accepted, show transporter details
    if (booking.status === 'Accepted') {
      const transporter = await User.findOne({ email: booking.transporter_email });
      if (!transporter) {
        return res.status(404).send('Transporter not found');
      }
      response.transporter = transporter;
    } else {
      response.status = 'Pending';
    }

    // If vehicle is allotted, show vehicle details
    if (booking.vehicle_id) {
      response.vehicle = booking.vehicle_id;
    } else {
      response.vehicle = 'Vehicle not allotted';
    }

    res.status(200).json(response);

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


router.get('/user/me', authenticateUser, async (req, res) => {
  try {
      const { email, user_type } = req.user; // Extract user details from decoded token
      return res.json({ success: true, email, user_type });
  } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch user data" });
  }
});


// Endpoint to fetch transporter details by email
router.get('/transporter/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch user with email and user_type as 'transporter'
    const transporter = await User.findOne({ email, user_type: 'transporter' });
    
    if (!transporter) {
      return res.status(404).json({ message: 'Transporter not found' });
    }

    // Send transporter details (you can customize what information to send back)
    res.json({
      name: transporter.name,
      email: transporter.email,
      phone: transporter.phone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Reject Order
router.post("/orders/reject", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  try {
    const booking = await Booking.findOneAndUpdate(
      { order_id: orderId },
      { status: "Rejected" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.json({ message: "Order rejected successfully.", booking });
  } catch (error) {
    console.error("Error rejecting order:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// ✅ Get All Pending Orders (Only Show Unassigned Orders or Assigned to Logged-in Transporter)
router.get("/orders/:transporterEmail", async (req, res) => {
  console.log("hiittt");
  try {
    const transporterEmail = req.query.transporterEmail; // Get the transporter's email from query params
      const orders = await Booking.find({
          $or: [
              {  transporter_email: null }, // Show only unassigned pending orders
              { transporter_email: transporterEmail } // Show only orders assigned to this transporter
          ]
      });
     console.log("ORders",orders);
      res.json(orders);
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal Server Error." });
  }
});


// ✅ Get Busy & Available Trucks
router.get("/trucks/status", async (req, res) => {
    try {
        const busyTrucks = await Vehicle.find({ availability_status: false });
        const availableTrucks = await Vehicle.find({ availability_status: true });

        res.json({ busyTrucks, availableTrucks });
    } catch (error) {
        console.error("Error fetching truck status:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// ✅ Get Transporter's Trucks
router.get("/trucks/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const trucks = await Vehicle.find(
          { email: email },
            "vehicle_id registration_number vehicle_type length height availability_status order_completed capacity vehicle_number truck_shared"
        );
        res.json(trucks);
    } catch (error) {
        console.error("Error fetching transporter's trucks:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// ✅ Accept an Order & Assign to Transporter
router.put("/orders/accept/:orderId", async (req, res) => {
  try {
      const { orderId } = req.params;
      const { transporterEmail, truckId } = req.body;

      if (!transporterEmail || !truckId) {
          return res.status(400).json({ message: "Missing required fields: transporterEmail and truckId" });
      }

      // ✅ Fetch Existing Order
      const existingOrder = await Booking.findOne({ order_id: orderId });

      if (!existingOrder) {
          return res.status(404).json({ message: `Order with ID ${orderId} not found` });
      }

      if (existingOrder.status === "Assigned") {
          return res.status(400).json({ message: "Order has already been assigned" });
      }

      const customerEmail = existingOrder.email;

      // ✅ Validate Truck ID (String-based, no ObjectId conversion needed)
      const vehicleBefore = await Vehicle.findOne({ vehicle_id: truckId });

      if (!vehicleBefore) {
          return res.status(400).json({ message: "Invalid truck ID" });
      }
      if (!vehicleBefore.availability_status) {
          return res.status(400).json({ message: "Truck is already assigned" });
      }

      // ✅ Update the Booking Order
      const updatedOrder = await Booking.findOneAndUpdate(
          { order_id: orderId },
          {
              $set: {
                  status: "Assigned",
                  transporter_email: transporterEmail,
                  vehicle_id: truckId
              }
          },
          { new: true }
      );
      // ✅ Update Vehicle Availability Status
      const updatedVehicle = await Vehicle.findOneAndUpdate(
          { vehicle_id: truckId },
          { $set: { availability_status: false } },  // ✅ Use correct field
          { new: true }
      );
      // ✅ Send Notification to Customer
      if (customerEmail) {
        console.log("CustomerEmail",customerEmail);
          sendNotificationToCustomer(
              customerEmail,
              orderId,
              `Your order #${orderId} has been assigned to a transporter.`
          );
      } else {
          console.warn("⚠️ Customer email is missing, notification not sent.");
      }

      res.status(200).json({ message: "Order assigned successfully", order: updatedOrder });

  } catch (error) {
      console.error("❌ Error updating order:", error);
      res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/assign-truck", async (req, res) => {
  try {
    const { booking_id, vehicle_id, truck_shared } = req.body;

    if (!booking_id || !vehicle_id) {
      return res.status(400).json({ message: "Booking ID and Vehicle ID are required." });
    }

    // Ensure vehicle_id is stored as ObjectId & set status to Assigned

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking_id,
      {
        vehicle_id: new mongoose.Types.ObjectId(vehicle_id),
        status: "Assigned"
      },
      { new: true }
    )
    .populate("transporter_email", "email")
    .populate("vehicle_id", "vehicle_type model_make capacity registration_number");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update vehicle document
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.assigned_bookings.push(booking_id);
    vehicle.truck_shared = truck_shared;

    if (truck_shared) {
      if (vehicle.assigned_bookings.length >= 2) {
        vehicle.availability_status = false;
      }
    } else {
      vehicle.availability_status = false;
    }

    await vehicle.save();

    res.status(200).json({
      message: "Truck assigned successfully",
      updatedBooking,
      vehicle
    });
  } catch (error) {
    console.error("Error assigning truck:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update Truck Status Back to Available
router.post("/trucks/update-status", async (req, res) => {
    const { truckId, status } = req.body;
    try {
        const updatedTruck = await Vehicle.findOneAndUpdate(
            { vehicle_id: truckId },
            { availability_status: status === "available" },
            { new: true }
        );

        if (!updatedTruck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        res.status(200).json({ message: "Truck status updated", updatedTruck });
    } catch (error) {
        console.error("Error updating truck status:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/vehicles/:vehicle_id", async (req, res) => {
  console.log("HRR");
  try {
    const vehicle = await Vehicle.findById(req.params.vehicle_id); // <-- use _id
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/vehicles/make-available/:id", async (req, res) => {
   console.log("make-available",req.params.id);
  try {
    const vehicle = await Vehicle.findOne({ vehicle_id: req.params.id });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    vehicle.availability_status = true;
    vehicle.truck_shared=false;
    await vehicle.save();

    const order = await Booking.findOne({
      vehicle_id: vehicle._id,
      order_completed: false,
    });

    if (order) {
      order.order_completed = true;
      order.status = "Completed";
      await order.save();
      vehicle.assigned_bookings = vehicle.assigned_bookings.filter(
        (bookingId) => bookingId.toString() !== order._id.toString()
      );
    }

    res.status(200).json({
      success: true,
      message: "Vehicle marked as available and order completed",
      vehicle,
      order,
    });
  } catch (error) {
    console.error("Error updating vehicle and order status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// ⏰ Cron Job - Automatically Free Up Trucks After Pickup Date
router.post("/complete-order", async (req, res) => {
  const { booking_id } = req.body;

  try {
    if (!booking_id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Update booking
    booking.status = "Completed";
    booking.order_completed = true;
    await booking.save();

    let updatedTruck = null;
    if (booking.vehicle_id) {
      try {
        // Force into ObjectId
        const vehicleObjectId = new mongoose.Types.ObjectId(booking.vehicle_id);
        updatedTruck = await Vehicle.findByIdAndUpdate(
          vehicleObjectId,
          { availability_status: true },
          { new: true }
        );
      } catch (err) {
        console.error("🚨 Vehicle update failed:", err.message);
      }
    }

    return res.status(200).json({
      message: "Order marked as completed",
      booking,
      updatedTruck,
    });
  } catch (error) {
    console.error("❌ Error completing order:", error); // print full stack trace
    return res
      .status(500)
      .json({ message: error.message || "Server error completing order" });
  }
});


// routes/orders.js or similar
router.get("/view-orders/:email", async (req, res) => {
  const { email } = req.params;
  //console.log("Fetching completed orders for:", email);

  try {
    const completedBookings = await Booking.find({
      email,
      status: "Completed",
    })
      .populate("vehicle_id")
      .populate("transporter_email");

  // console.log("Complete bookings:", completedBookings);

    // ✅ FIX: Wrap in an object with `success` and `orders`
    res.status(200).json({
      success: true,
      orders: completedBookings,
    });
  } catch (error) {
    console.error("Error fetching completed bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed orders.",
    });
  }
});

router.get("/delivered-orders/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Step 1: Find transporter by email
    const transporter = await User.findOne({ email: email, user_type: "transporter" });

    if (!transporter) {
      return res.status(404).json({ message: "Transporter not found with this email" });
    }

    // Step 2: Use transporter _id to find completed bookings
    const completedBookings = await Booking.find({
      transporter_email: transporter._id,
      status: "Completed",
      order_completed: true,
    })
    .populate("vehicle_id")
    .populate("transporter_email");

    if (completedBookings.length === 0) {
      return res.status(200).json({ message: "No completed bookings yet.", completedBookings: [] });
    }

    res.status(200).json({ completedBookings });
  } catch (error) {
    console.error("Error fetching completed bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/stats/:email", async (req, res) => {
  const email = req.params.email;

  try {
    // Step 1: Find transporter by email
    const transporter = await User.findOne({ email: email, user_type: "transporter" });

    if (!transporter) {
      return res.status(404).json({ error: "Transporter not found with this email" });
    }
  // console.log(",,,",transporter,email);
    // Step 2: Use transporter._id for booking stats
    const totalResponses = await Booking.countDocuments({
      transporter_email: transporter._id,
    });

    const acceptedOrders = await Booking.countDocuments({
      transporter_email: transporter._id,
      status: "Accepted",
    });

    const successfulOrders = await Booking.countDocuments({
      transporter_email: transporter._id,
      $or: [{ status: "Completed" }, { order_completed: true }],
    });
  console.log("res", totalResponses,
    acceptedOrders,
    successfulOrders,);
    res.status(200).json({
      totalResponses,
      acceptedOrders,
      successfulOrders,
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

cron.schedule('0 0 * * *', async () => {
  try {
      const today = new Date();
      await Vehicle.updateMany({ pickup_date: { $lt: today } }, { availability_status: true });
      console.log("✅ Trucks updated automatically based on pickup date.");
  } catch (err) {
      console.error("❌ Error in cron job:", err);
  }
});

// Cancel booking + check for suspension
router.post('/cancel-booking', async (req, res) => {
  const { booking_id, transporter_email } = req.body;

  try {
    // 1. Find transporter
    const transporter = await User.findOne({ email: transporter_email, user_type: "transporter" });
    if (!transporter) return res.status(404).json({ message: "Transporter not found" });

    // 2. Cancel the booking
    const booking = await Booking.findByIdAndUpdate(
      booking_id,
      { status: "Cancelled" },
      {transporter_email:null},
      {vehicle_id:null},
      {shared_with_email:null},  
      {final_amiunt:null},    
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 3. Count cancellations
    const cancelledCount = await Booking.countDocuments({
      transporter_email: transporter._id,
      status: "Cancelled",
    });

    let logoutUser = false;

    // 4. Suspend if >=3
    if (cancelledCount >= 3) {
      await User.updateOne({ _id: transporter._id }, { status: "Suspended" });
      console.log(`${transporter_email} suspended for ${cancelledCount} cancellations.`);
      logoutUser = true;
    }

    return res.json({
      success: true,
      message: "Booking cancelled",
      cancelledCount,
      logout: logoutUser, // 🔥 return this to frontend
    });

  } catch (err) {
    console.error("Cancel error:", err);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
});


module.exports = router;
