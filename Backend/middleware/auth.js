const { validateToken } = require("../services/authentication");
const secretKey = process.env.JWT_SECRET || "$uperMan@123"; // Secret key
const jwt = require('jsonwebtoken');

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };
}
const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;  // Read token from cookie

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};



module.exports = {
  checkForAuthenticationCookie,
  authenticateJWT,
};