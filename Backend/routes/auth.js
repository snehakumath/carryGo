const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

router.get('/status', (req, res) => {
  console.log("auth status",req.cookies);
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  console.log("Token",token);
  if (!token) {
    return res.status(401).json({ loggedIn: false, user: null, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded",decoded);
    return res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ loggedIn: false, user: null, message: 'Invalid or expired token' });
  }
});


  module.exports = router;