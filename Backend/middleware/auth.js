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
  console.log("Request Headers:", req.headers); // Log headers to see if Authorization is present
  console.log("Request Body:", req.body); // Log the body to ensure it's not modified by mistake

  const token = req.header("Authorization")?.split(" ")[1];
  
  if (!token) {
    return res.status(403).send("Access Denied. No token provided.");
  }

  jwt.verify(token,secretKey, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token.");
    }
    req.user = user; 
    next(); 
  });
};



module.exports = {
  checkForAuthenticationCookie,
  authenticateJWT,
};