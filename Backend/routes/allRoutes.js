// profile.js (Backend Route)

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { validateToken } = require('../services/authentication');  // Token validation utility
const multer = require('multer');
const path = require('path');
const Vehicle=require('../models/vehicle');
const Payment=require('../models/payment');
const Feedback=require('../models/feedback');
const Booking=require('../models/booking');


// Get profile data
router.get('/profile', async (req, res) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // Validate token and extract user details
        const decoded =validateToken(token);
        const user = await User.findOne({ email: decoded.email }).select('-password -salt'); // Exclude sensitive data like password
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
});

// Update profile data
router.put('/profile', async (req, res) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decoded =await validateToken(token);
        const user = await User.findOneAndUpdate({ email: decoded.email }, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ success: false, message: 'Error updating profile' });
    }
});

// Set storage engine for profile picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pics');
  },
  filename: (req, file, cb) => {
 
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
}).single('profilePicture');


// Upload route for profile picture
// router.post('/upload-profile-pic', upload, async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: "No file uploaded" });
//     }
    
//     // Update user profile with the new image URL
//     const user = await User.findByIdAndUpdate(
//       req.user.id, 
//       { profilePicture: `/uploads/profile-pics/${req.file.filename}` },
//       { new: true }
//     );

//     res.status(200).send({ success: true, user });
//   } catch (error) {
//     res.status(500).send({ message: "Error uploading profile picture", error });
//   }
// });

router.post('/upload-profile-pic', validateToken, upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.email }, 
      { profilePicture: `/uploads/profile-pics/${req.file.filename}` },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile picture", error });
  }
});


router.get("/vehicles", async (req, res) => {
  try {
    const trucks = await Vehicle.find();
    res.json(trucks);
  } catch (err) {
    console.error("Error fetching trucks:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// 🚛 **Add a Truck**
router.post("/vehicles", async (req, res) => {
  try {
    const {
      vehicle_id,
      email,
      vehicle_type,
      model_make,
      registration_number,
      engine_number,
      fuel_type,
      capacity,
      length,
      height,
      availability_status,
    } = req.body;
     
     // Debugging log
    // console.log("Received Data:", req.body);
    // Check required fields
    if (!vehicle_id || !email || !vehicle_type || !model_make || !registration_number || !engine_number || !fuel_type || !capacity || !length || !height) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check for existing vehicle
    const existingVehicle = await Vehicle.findOne({
      $or: [{ vehicle_id }, { registration_number }, { engine_number }],
    });

    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle already exists with this ID, registration number, or engine number" });
    }

    const newVehicle = new Vehicle({
      vehicle_id,
      email,
      vehicle_type,
      model_make,
      registration_number,
      engine_number,
      fuel_type,
      capacity,
      length,
      height,
      availability_status,
    });

    await newVehicle.save();
    res.json(newVehicle);
  } catch (err) {
    console.error("Error adding vehicle:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// 🗑️ Delete a Vehicle
router.delete("/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    res.status(500).json({ message: "Database error" });
  }
});

router.get('/pending-transactions', async (req, res) => {
  try {
      const pendingTransactions = await Payment.find({ payment_status: 'pending' })
          .populate('order_id') // Populate order details if needed
          .sort({ payment_date: -1 }); // Sort by latest transactions

          if (!pendingTransactions.length) {
            return res.status(404).json({ success: false, message: "No pending transactions found" });
        }
  
      res.status(200).json({
          success: true,
          count: pendingTransactions.length,
          transactions: pendingTransactions
      });
  } catch (error) {
      console.error("Error fetching pending transactions:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/notifications/markAsRead', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await Notification.updateMany({ userId: user._id }, { isRead: true });

    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET average rating and success rate of a transporter
router.get("/transporter/stats/:email", async (req, res) => {
  const email = req.params.email;
  console.log("/stats-",email);

  try {
    const transporter = await User.findOne({ email, user_type: "transporter" });
    if (!transporter) {
      return res.status(404).json({ message: "Transporter not found" });
    }

    const totalBookings = await Booking.countDocuments({
      transporter_email: transporter._id,
    });

    const successfulBookings = await Booking.countDocuments({
      transporter_email: transporter._id,
      $or: [{ status: "Completed" }, { order_completed: true }],
    });
    const feedbacks = await Feedback.find({ transporter_email: email });
    const avgRating =
      feedbacks.length > 0
        ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
        : 0;
    return res.status(200).json({
      avgRating: avgRating.toFixed(1),
      successRate: totalBookings > 0 ? ((successfulBookings / totalBookings) * 100).toFixed(0) : 0,
    });
  } catch (error) {
    console.error("Error in /stats/:email", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
