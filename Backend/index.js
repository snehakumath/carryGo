  
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const userRoute = require('./routes/user');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth");
const allRoutes = require("./routes/allRoutes");
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const biddingRoutes = require("./routes/bidding");
const feedbackRoutes = require('./routes/feedback');
const  adminRotes=require('./routes/adminRoutes');

const http = require("http");
const { initializeSocket } = require("./routes/socketIo");
require("dotenv").config();

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
    "http://localhost:5173", // local frontend
    process.env.FRONTEND_URL  // deployed frontend
  ];
  
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );
// app.use(cors({
//     origin: "http://localhost:5173", // Update with your frontend URL
//     credentials: true, // Allow cookies to be sent
//   }));
  
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../Frontend/frontend/dist')));

mongoose.connect(process.env.MONGO_URI || process.env.MONGO_LOCAL_URI )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use('/api', allRoutes);
app.use('/booking', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/bids", biddingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/admin',adminRotes);

app.use('/', userRoute);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/frontend/dist', 'index.html'));
});

// app.get("/", (req, res) => {
//     return res.send("Welcome to CarryGo API");
// });


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = { app, server, io };
