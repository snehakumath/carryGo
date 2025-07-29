const User = require('../models/user');
const Booking = require('../models/booking');

const getBooking=async(req,res)=>{
  try {
    const email = decodeURIComponent(req.params.email);
    const bookings = await Booking.find({ email })
      .sort({ createdAt: -1 }) // optional: newest first
      .populate("vehicle_id")   // optional: if you want vehicle details
      .populate("transporter_email", "name email phone") // optional: if you want transporter info
      .exec();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    res.status(500).json({ error: "Failed to fetch customer bookings" });
  }
}

const getAllCustomersWithBookings = async (req, res) => {
  try {
    const customers = await User.find({ user_type: "customer" }).select("name email phone city");

    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: "$email",
          count: { $sum: 1 },
        },
      },
    ]);

    const bookingMap = {};
    bookings.forEach((b) => {
      bookingMap[b._id] = b.count;
    });

    const enriched = customers.map((customer) => ({
      ...customer._doc,
      bookingCount: bookingMap[customer.email] || 0,
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Failed to fetch customers:", err);
    res.status(500).json({ error: "Failed to fetch customer data" });
  }
};


const getAdminSummary = async (req, res) => {
  try {
    const customers = await User.countDocuments({ user_type: 'customer' });
    const transporters = await User.countDocuments({ user_type: 'transporter' });
    const bookings = await Booking.countDocuments();

    // Total revenue from confirmed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { final_amount: { $ne: null } } },
      { $group: { _id: null, total: { $sum: "$final_amount" } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;

    // Monthly booking count
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Monthly revenue
    const monthlyRevenue = await Booking.aggregate([
      { $match: { final_amount: { $ne: null } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$final_amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format months
    const formatMonth = (n) =>
      new Date(0, n - 1).toLocaleString("default", { month: "short" });

    const formattedMonthlyBookings = monthlyBookings.map((item) => ({
      month: formatMonth(item._id),
      bookings: item.count,
    }));

    const formattedMonthlyRevenue = monthlyRevenue.map((item) => ({
      month: formatMonth(item._id),
      revenue: item.total,
    }));
    return res.json({
      customers,
      transporters,
      bookings,
      revenue,
      monthlyBookings: formattedMonthlyBookings,
      monthlyRevenue: formattedMonthlyRevenue,
    });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ error: "Failed to fetch admin summary" });
  }
};

const getAllTransportersWithBookings = async (req, res) => {
  try {
    const transporters = await User.find({ user_type: "transporter" }).select("name email phone city");

    const bookings = await Booking.aggregate([
      {
        $match: {
          transporter_email: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$transporter_email",
          count: { $sum: 1 }
        }
      }
    ]);

    // Create booking count map by transporter ID
    const bookingMap = {};
    bookings.forEach((b) => {
      bookingMap[b._id.toString()] = b.count;
    });

    const enriched = transporters.map((t) => ({
      ...t._doc,
      bookingCount: bookingMap[t._id.toString()] || 0
    }));

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Error fetching transporters:", err);
    res.status(500).json({ error: "Failed to fetch transporter data" });
  }
};

const getTransporterBookings = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
     console.log("peepeeee");
    // Get the transporter user
    const transporter = await User.findOne({ email, user_type: "transporter" });
    if (!transporter) {
      return res.status(404).json({ error: "Transporter not found" });
    }

    // Get bookings where this transporter is assigned
    const bookings = await Booking.find({ transporter_email: transporter._id })
      .sort({ createdAt: -1 })
      .populate("vehicle_id")
      .populate("transporter_email", "name email phone")
      .exec();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching transporter bookings:", error);
    res.status(500).json({ error: "Failed to fetch transporter bookings" });
  }
};
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("toggle");
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Suspended" : "Active";
    await user.save();
    return res.status(200).json({ message: `User ${user.status}`, user });
  } catch (err) {
    console.error("Toggle user status error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { getAdminSummary ,
  getAllCustomersWithBookings,
  getBooking,
  getAllTransportersWithBookings,
  getTransporterBookings,
  toggleUserStatus };
