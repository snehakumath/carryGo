const { Server } = require("socket.io");
const Notification = require("../models/notification");
const User = require("../models/user");
const Bid = require("../models/bidding"); // Import Bid model

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Update to your client URL
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ A user connected: ${socket.id}`);

        // Transporter joins
        socket.on("joinTransporter", async () => {
            console.log(`🚚 Transporter Joined: ${socket.id}`);
            socket.join("transporter-room");

            try {
                const pastNotifications = await Notification.find({ type: "order" })
                    .sort({ createdAt: -1 })
                    .limit(10);
                socket.emit("previousNotifications", pastNotifications);
            } catch (error) {
                console.error("❌ Error fetching past notifications:", error);
            }
        });

        // Customer joins
        socket.on("joinCustomer", async (customerEmail) => {
            try {
                console.log(`👤 Customer ${customerEmail} joining notifications...`);
                socket.join(`customer_${customerEmail}`);

                const user = await User.findOne({ email: customerEmail });
                if (!user) {
                    console.warn(`⚠️ User not found for email: ${customerEmail}`);
                    return;
                }

                console.log(`✅ Customer ${customerEmail} successfully joined their room!`);

                const pastNotifications = await Notification.find({ userId: user._id })
                    .sort({ createdAt: -1 })
                    .limit(10);

                socket.emit("previousNotifications", pastNotifications);
            } catch (error) {
                console.error("❌ Error in joinCustomer:", error);
            }
        });

        // Handle new bid
        socket.on("placeBid", async ({ customerEmail, bidAmount, orderId }) => {
            try {
                const user = await User.findOne({ email: customerEmail });
                if (!user) {
                    console.error("❌ Customer not found in database");
                    return;
                }

                const newBid = new Bid({
                    userId: user._id,
                    orderId,
                    bidAmount,
                    status: "pending",
                });

                await newBid.save();
                console.log("✅ New bid placed:", newBid);

                io.to("transporter-room").emit("newBid", newBid);
                console.log("📢 Bid notification sent to transporters!");
            } catch (error) {
                console.error("❌ Error placing bid:", error);
            }
        });

        // Handle bid acceptance
        socket.on("acceptBid", async ({ bidId, transporterEmail }) => {
            try {
                const transporter = await User.findOne({ email: transporterEmail });
                if (!transporter) {
                    console.error("❌ Transporter not found in database");
                    return;
                }

                const bid = await Bid.findById(bidId);
                if (!bid) {
                    console.error("❌ Bid not found");
                    return;
                }

                bid.status = "accepted";
                bid.transporterId = transporter._id;
                await bid.save();
                console.log("✅ Bid accepted:", bid);

                io.to(`customer_${bid.userId}`).emit("bidAccepted", bid);
                console.log("📢 Notification sent to customer!");
            } catch (error) {
                console.error("❌ Error accepting bid:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`❌ A user disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Emit notification to all transporters


const sendNotificationToTransporters = async (message, orderId) => {
    try {
        if (!io) {
            console.error("⚠️ Socket.io is not initialized");
            return;
        }

        // Check if a notification for this order already exists
        const existingNotification = await Notification.findOne({
            orderId: orderId,
            type: "order",
        });

        if (existingNotification) {
            console.log("⚠️ Notification already exists for this order.");
        } else {
            // Save one notification
            const savedNotification = await Notification.create({
                orderId,
                message,
                type: "order",
                isRead: false, // You can keep this if needed
            });

            console.log("✅ Notification saved in DB:", savedNotification);
        }

        // Emit to all connected transporters
        io.to("transporter-room").emit("newNotification", {
            orderId,
            message,
            type: "order",
        });

        console.log("📢 Notification sent to transporters!");
    } catch (error) {
        console.error("❌ Error sending notification:", error);
    }
};




// Emit notification to a specific customer (by email)
const sendNotificationToCustomer = async (customerEmail, orderId, message) => {
    console.log(`📩 Sending notification to customer: ${customerEmail}`);

    try {
        const user = await User.findOne({ email: customerEmail });
        if (!user) {
            console.error("❌ Customer not found in database");
            return;
        }

        const newNotification = new Notification({
            userId: user._id,
            orderId,
            message,
            type: "order",
            isRead: false,
        });

        await newNotification.save();
        console.log("✅ Notification saved in DB:", newNotification);

        // 🚀 Ensure customer has joined before emitting notification
        setTimeout(() => {
          const customerRoom = io.sockets.adapter.rooms.get(`customer_${customerEmail}`);
          if (customerRoom && customerRoom.size > 0) {
              io.to(`customer_${customerEmail}`).emit("newNotification", newNotification);
              console.log("📢 Notification sent to customer!");
          } else {
              console.warn(`⚠️ Customer room not found, notification not sent.`);
          }
      }, 1000); // Delay to allow socket join
      

    } catch (error) {
        console.error("❌ Error sending customer notification:", error);
    }
};

module.exports = {
    initializeSocket,
    sendNotificationToTransporters,
    sendNotificationToCustomer,
};

