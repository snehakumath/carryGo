const express = require('express');
const router = express.Router();
const { signup, login } = require('../admin-controller/admin');
const { getAdminSummary } = require('../admin-controller/allfuncs');
const { getAllCustomersWithBookings ,getBooking,getAllTransportersWithBookings
    ,getTransporterBookings,toggleUserStatus
} = require("../admin-controller/allfuncs");
const {checkAuth}=require('../admin-controller/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/summary',getAdminSummary)

router.get("/customers", getAllCustomersWithBookings);
router.get("/customer-bookings/:email",getBooking);
router.get("/transporters", getAllTransportersWithBookings);
router.get("/transporter-bookings/:email", getTransporterBookings);
router.patch("/toggle-user-status/:id", toggleUserStatus);
router.get('/check-auth', checkAuth);

module.exports = router;
