const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

router.get('/status', (req, res) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ loggedIn: false, user: null });
    }
    try {
      const decoded = jwt.verify(token, secret);
      return res.json({ loggedIn: true, user: decoded });
    } catch (err) {
      console.error('Token verification failed:', err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ loggedIn: false, user: null, message: "Token expired" });
      }
      return res.status(401).json({ loggedIn: false, user: null });
    }
  });

  module.exports = router;