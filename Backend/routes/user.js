const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');
const {createTokenForUser,validateToken}=require('../services/authentication');

const router = Router();

// Secrets for tokens
const accessTokenSecret = '$uperMan@123'; // Replace with your secret
const refreshTokenSecret = '$uperMan@124';
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

  try {
    // Authenticate the user and generate an access token
    const accessToken = await User.matchPasswordAndGenerateToken(user_type, email, password);

    // Create a refresh token using `createTokenForUser`
    const refreshToken = createTokenForUser({ email, user_type });
    
    // Set both tokens in cookies (HTTP-Only for security)
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      accessToken,
      refreshToken,
      user_type,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(401).json({ success: false, message: error.message });
  }
});

router.post('/signup', async (req, res) => {
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
      const decoded = jwt.verify(refreshToken, refreshSecretKey);

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
  // const { refreshToken } = req.body;

  // const index = refreshTokens.indexOf(refreshToken);
  // if (index > -1) {
  //   refreshTokens.splice(index, 1);
  // }

  // res.clearCookie('token');
  // return res.json({ success: true, message: 'Logged out successfully' });

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ success: true, message: 'Logged out successfully' });
});



module.exports = router;
