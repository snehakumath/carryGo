  
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


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
const allowedOrigins = [
  "http://localhost:5173",       // local frontend
  process.env.FRONTEND_URL,      // production frontend from env
  /\.vercel\.app$/               // matches ALL vercel preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests (e.g. curl, Postman)

    const isAllowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
}));


// Serve static frontend files
// app.use(express.static(path.join(__dirname, '../Frontend/dist')));
console.log("URL",process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI || process.env.MONGO_LOCAL_URI )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
    
app.get('/', (_req, res) => {
      res.status(200).send('CarryGo API is running');
    });
    
app.use("/auth", authRoutes);
app.use('/api', allRoutes);
app.use('/booking', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/bids", biddingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/admin',adminRotes);

app.use('/', userRoute);

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
// });



server.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// module.exports = { app, server, io };
