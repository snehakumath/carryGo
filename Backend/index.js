// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const path=require('path');
// const userRoute = require('./routes/user');
// const cookieParser = require('cookie-parser');
// const authRoutes = require("./routes/auth");
// const allRoutes=require("./routes/allRoutes");
// const bookingRoutes=require('./routes/booking');
// const paymentRoutes=require('./routes/payment');

// const http = require('http'); // Import http module
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app); // Create server
// const io = socketIo(server); // Pass server to socket.io
// dotenv.config();

// const PORT = process.env.PORT || 8000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:5173', // Allow frontend origin
//   methods: 'GET, POST, PUT, DELETE',
//   allowedHeaders: 'Content-Type, Authorization',
//   credentials: true,
// }));


// app.use(express.static(path.join(__dirname, '../Frontend/frontend/dist')));
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carryGo')
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));
    

// app.use("/auth", authRoutes); // Ensure this is correctly mounted
// app.use('/api',allRoutes);   
// app.use('/booking',bookingRoutes);   
// app.use('/api/payments',paymentRoutes); 
// app.use('/',userRoute);
// app.get('*', (req, res) => {
//      res.sendFile(path.join(__dirname, '../Frontend/frontend/dist', 'index.html'));
//        });
    
// app.get("/",(req,res)=>{
//             return res.sendFile("home");
//         });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = { app, server, io };
  
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

const http = require("http");
const { initializeSocket } = require("./routes/socketIo");
require("dotenv").config();

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: "http://localhost:5173", // Update with your frontend URL
    credentials: true, // Allow cookies to be sent
  }));
  
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../Frontend/frontend/dist')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carryGo')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use('/api', allRoutes);
app.use('/booking', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/bids", biddingRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use('/', userRoute);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/frontend/dist', 'index.html'));
});

// app.get("/", (req, res) => {
//     return res.send("Welcome to CarryGo API");
// });


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = { app, server, io };
