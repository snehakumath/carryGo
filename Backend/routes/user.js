const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');
const {createTokenForUser,validateToken}=require('../services/authentication');

const router = Router();

// Secrets for tokens
const accessTokenSecret = process.env.JWT_SECRET; // Replace with your secret
const refreshTokenSecret =  process.env.JWT_SECRET;;
const refreshTokens = [];

// Serve login and signup pages
router.get('/login', (req, res) => {
  return res.sendFile(path.join(__dirname, '../../Frontend/frontend/dist/index.html'));
});

router.get('/signup', (req, res) => {
  return res.sendFile(path.join(__dirname, '../../Frontend/frontend/dist/index.html'));
});

router.post('/login', async (req, res) => {
  const { user_type, email, password } = req.body;
 console.log("LOGIN route", user_type, email, password);
  try {
    // Find the user first
    const user = await User.findOne({ email, user_type });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or user type" });
    }

    // ✅ Check if the user is suspended
    if (user.status === "Suspended") {
      return res.status(403).json({ success: false, message: "Your account has been suspended. Please contact support." });
    }

    // Match password and generate token
    const accessToken = await User.matchPasswordAndGenerateToken(user_type, email, password);

    // Generate refresh token
    const refreshToken = createTokenForUser({ email, user_type });

    // Set tokens in cookies
    console.log("NODE_ENV =", process.env.NODE_ENV);
const isProduction = process.env.NODE_ENV === 'production';

res.cookie('accessToken', accessToken, {
  httpOnly: true,
  maxAge: 3600000,
  sameSite: isProduction ? 'none' : 'lax', // 'none' in prod for cross-site
  secure: isProduction,                    // true in prod (HTTPS), false dev
  path: '/',
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
  path: '/',
});


    // res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
    // res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    console.log("Successss");
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      accessToken,
      refreshToken,
      user_type,
      email
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(401).json({ success: false, message: error.message });
  }
});


router.post('/signup', async (req, res) => {
  console.log("/signup");
  try {
      const { user_type, name, phone, email, password } = req.body;
      const user = await User.create({ user_type, name, phone, email, password });
      return res.json({ success: true, message: 'Signup successful!' });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'An error occurred during signup' });
  }
});

// Refresh token route
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token is missing!" });
  }

  try {
      // Validate the refresh token
      //const decoded = jwt.verify(refreshToken, refreshSecretKey);
      const decoded = jwt.verify(refreshToken, refreshTokenSecret);


      // Create a new access token
      const newAccessToken = jwt.sign(
          { email: decoded.email, user_type: decoded.user_type },
          secretKey,
          { expiresIn: "1h" }
      );

      // Set the new access token in cookies
      res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 3600000 });

      return res.status(200).json({
          success: true,
          message: "Access token refreshed successfully!",
          accessToken: newAccessToken,
      });
  } catch (error) {
      console.error("Error refreshing token:", error.message);
      return res.status(403).json({ success: false, message: "Invalid or expired refresh token!" });
  }
});


// Logout route
router.post('/logout', (req, res) => {
 console.log("Logout");

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ success: true, message: 'Logged out successfully' });
});



module.exports = router;
