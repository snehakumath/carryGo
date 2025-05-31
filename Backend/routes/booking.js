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


// POST endpoint to create a new booking
// POST endpoint to create a new booking
router.post("/process", async (req, res) => {
  console.log("🔥 Start processing booking...");
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
  } = req.body;

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
    });

    await newBooking.save();
    await sendNotificationToTransporters(
      `New booking from ${pickup_loc} to ${dropoff_loc}`,
      newBooking._id
    );
    
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


router.get("/goods", async (req, res) => {
  try {
    const goods = await Booking.find({}, "goods_type pickup_loc dropoff_loc email transporter_email status vehicle_id pickup_date bid_status")
    .populate('transporter_email', 'email'); // Fetch relevant fields
    console.log("goods details",goods);
    res.json(goods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const transporterEmail = req.query.transporterEmail;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Step 1: Get transporter by email
    const transporter = await User.findOne({ email: transporterEmail }).lean();
    if (!transporter) return res.status(404).json({ error: "Transporter not found" });

    const transporterId = transporter._id;

    // ✅ Step 2: Fetch bookings
    const [eligibleBookings, acceptedBookings] = await Promise.all([
      Booking.find({
        pickup_date: { $gte: today },
        status: { $in: ["Accepted", "Pending"] },
        bid_status: { $in: ["Pending", "Bidding"] },
      }).lean(),
      Booking.find({
        pickup_date: { $gte: today },
        status: "Accepted",
        bid_status: "Customer Accepted",
        transporter_email: transporterId, // ✅ This now works
      }).lean(),
    ]);

    // ✅ Step 3: Get all bids by transporter
    const transporterBids = await Bidding.find({
      transporter: transporterId,
    }).lean();

    const transporterBidIds = new Set(
      transporterBids.map((bid) => bid.booking_id.toString())
    );

    const placedBids = [];
    const availableOrders = [];

    for (const booking of eligibleBookings) {
      const id = booking._id.toString();
      if (transporterBidIds.has(id)) {
        placedBids.push(booking);
      } else {
        availableOrders.push(booking);
      }
    }

    return res.json({
      availableOrders,
      placedBids,
      acceptedOrders: acceptedBookings,
    });

  } catch (error) {
    console.error("❌ Error in /orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.get("/orders", async (req, res) => {
//   console.log("Helloo");
//   try {
//     const transporterEmail = req.query.transporterEmail;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // 🔍 Find transporter by email to get their _id
//     // const transporter = await User.findOne({ email: transporterEmail }).lean();
//     const transporterId = Booking._id;

//     // 🚚 Get bookings
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
//         transporter_email: transporterId, // ✅ Correct ID now
//       }).lean()
//     ]);
//     const transporter = await User.findOne({ email: transporterEmail }).lean();
//     if (!transporter) return res.status(404).json({ error: "Transporter not found" });
    
//     const transporterBids = await Bidding.find({
//       transporter: transporter._id,
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
//     console.log("Accept Bookings",acceptedBookings);
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

//fetch transporter and vehicle detail for customer
router.get('/:order_id', async (req, res) => {
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
// ✅ Accept Order & Assign Vehicle


// router.post('/orders/accept', async (req, res) => {
//   const { orderId, transporterEmail, vehicleId, customerEmail } = req.body;

//   if (!orderId || !transporterEmail || !vehicleId || !customerEmail) {
//     return res.status(400).json({ error: 'Missing required fields.' });
//   }

//   try {
//     // Find Booking & Update
//     const booking = await Booking.findOneAndUpdate(
//       { orderId },
//       {
//         transporterEmail,
//         vehicleId,
//         status: 'Assigned',
//       },
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found.' });
//     }

//     // Update Vehicle Status to Busy
//     await Vehicle.findByIdAndUpdate(vehicleId, { availabilityStatus: false });

//     // Send notification to the customer
//     await sendNotificationToCustomer(
//       customerEmail,
//       orderId,
//       `Your booking has been accepted by ${transporterEmail} and a vehicle is assigned.`
//     );

//     res.json({ message: 'Order accepted, vehicle assigned.', booking });
//   } catch (error) {
//     console.error('Error accepting order:', error);
//     res.status(500).json({ error: 'Internal Server Error.' });
//   }
// });



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
  try {
      const transporterEmail = req.query.email; // Get the transporter's email from query params
      const orders = await Booking.find({
          $or: [
              {  transporter_email: null }, // Show only unassigned pending orders
              { transporter_email: transporterEmail } // Show only orders assigned to this transporter
          ]
      });

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
            "vehicle_id registration_number vehicle_type length height availability_status order_completed capacity vehicle_number"
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


router.post("/assign-truck",async (req, res) => {
  try {
    const { booking_id, vehicle_id } = req.body;
    if (!booking_id || !vehicle_id) {
      return res.status(400).json({ message: "Booking ID and Vehicle ID are required." });
    }

    // Update booking with assigned vehicle
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking_id,
      { vehicle_id: vehicle_id },
      {status:"Assigned"},
      { new: true }
    );
    

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update vehicle availability
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicle_id,
      { availability_status: false },
      { new: true }
    );
    

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({
      message: "Truck assigned successfully",
      updatedBooking,
      updatedVehicle,
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

router.get('/vehicle/:vehicle_id', async (req, res) => {
  try {
      const { vehicle_id } = req.params;
      const vehicle = await Vehicle.findOne({ vehicle_id });

      if (!vehicle) {
          return res.status(404).json({ message: 'Vehicle not found' });
      }

      res.status(200).json(vehicle);
  } catch (error) {
      console.error('Error fetching vehicle:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



router.put("/vehicles/make-available/:id", async (req, res) => {

  try {
    const vehicle = await Vehicle.findOne({ vehicle_id: req.params.id });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    vehicle.availability_status = true;
    await vehicle.save();

    const order = await Booking.findOne({
      vehicle_id: req.params.id,
      order_completed: false,
    });

    if (order) {
      order.order_completed = true;
      order.status = "Completed";
      await order.save();
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
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status and completion flag
    booking.status = "Completed";
    booking.order_completed = true;
    await booking.save();

    // Update vehicle availability
    const updatedTruck = await Vehicle.findByIdAndUpdate(
      booking.vehicle_id,
      { availability_status: true },
      { new: true }
    );

    if (!updatedTruck) {
      return res.status(404).json({ message: "Associated truck not found" });
    }

    res.status(200).json({
      message: "Order marked as completed and truck availability updated",
      booking,
      updatedTruck,
    });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "Server error completing order" });
  }
});

// routes/orders.js or similar
router.get("/view-orders/:email", async (req, res) => {
  const { email } = req.params;
  console.log("Fetching completed orders for:", email);

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

cron.schedule('0 0 * * *', async () => {
  try {
      const today = new Date();
      await Vehicle.updateMany({ pickup_date: { $lt: today } }, { availability_status: true });
      console.log("✅ Trucks updated automatically based on pickup date.");
  } catch (err) {
      console.error("❌ Error in cron job:", err);
  }
});


module.exports = router;
