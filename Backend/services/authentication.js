// const jwt = require('jsonwebtoken'); // Ensure jsonwebtoken is imported
// const secretKey = process.env.JWT_SECRET || "$uperMan@123"; // Secret key

// // Function to create a token for a user
// function createTokenForUser(user) {
//     try {
        
//         const token = jwt.sign(
//             { email: user.email, user_type: user.user_type }, 
//             secretKey, 
//             { expiresIn: "1h" } // Token valid for 1 hour
//         );
//         console.log("Token generated successfully:", token);
//         return token;
//     } catch (err) {
//         console.error("Error generating token:", err.message);
//         throw new Error("Token generation failed");
//     }

//     // const payload = {
//     //     email: user.email,
//     //     user_type: user.user_type, // Ensure this matches the structure used during verification
//     // };
//     // const token = jwt.sign(payload, secret, { expiresIn: '1h' });
//     // return token;
// }

// // Function to validate a token
// function validateToken(token) {
//     try {
//         const decoded = jwt.verify(token, secretKey);
//         console.log("Token verified successfully:", decoded);
//         return decoded;
//     } catch (err) {
//         if (err.name === "TokenExpiredError") {
//             console.error("Error: Token has expired");
//             throw new Error("Token expired");
//         } else {
//             console.error("Error verifying token:", err.message);
//             throw new Error("Invalid token");
//         }
//     }
    
//     // return jwt.verify(token, secret); // Verify the token using the same secret
// }

// const isAuthenticated = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
  
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded; // Attach user information to the request
//       next();
//     } catch (error) {
//       return res.status(403).json({ error: "Invalid token" });
//     }
//   }

  
// module.exports = {
//     createTokenForUser,
//     validateToken,
//     isAuthenticated,
// };

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || "$uperMan@123"; // Fallback for development

// Function to create a JWT token
function createTokenForUser(user) {
    try {
        const token = jwt.sign(
            { email: user.email, user_type: user.user_type }, 
            secretKey, 
            { expiresIn: "1h" } // Token valid for 1 hour
        );
        console.log("Token generated successfully:", token);
        return token;
    } catch (err) {
        console.error("Error generating token:", err.message);
        throw new Error("Token generation failed");
    }
}

// Function to validate a token
function validateToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("Token verified successfully:", decoded);
        return decoded;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.error("Error: Token has expired");
            throw new Error("Token expired");
        } else {
            console.error("Error verifying token:", err.message);
            throw new Error("Invalid token");
        }
    }
}

// Middleware to authenticate user
const refreshSecretKey = process.env.JWT_REFRESH_SECRET || "$uperMan@124";

const isAuthenticated = (req, res, next) => {
    let token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken; // Get refresh token from cookies

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach user information to request
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError" && refreshToken) {
            try {
                // Verify refresh token
                const decodedRefresh = jwt.verify(refreshToken, refreshSecretKey);
                
                // Generate new access token
                const newAccessToken = jwt.sign(
                    { email: decodedRefresh.email, user_type: decodedRefresh.user_type },
                    secretKey,
                    { expiresIn: "30d" }
                );

                // Set the new access token in cookies
                res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 3600000 });

                req.user = decodedRefresh; // Use refresh token data
                return next();
            } catch (refreshError) {
                return res.status(403).json({ error: "Unauthorized - Invalid or expired refresh token" });
            }
        }

        return res.status(403).json({ error: "Unauthorized - Invalid token" });
    }
};

module.exports = {
    createTokenForUser,
    validateToken,
    isAuthenticated,
};

