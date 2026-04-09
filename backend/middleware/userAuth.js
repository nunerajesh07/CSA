// middleware/userAuth.js
// Protects routes that require user authentication.
// Verifies JWT token from the Authorization header using JWT_USER_SECRET.
// On success: attaches userId to req so routes can identify the caller.

const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");

function userAuth(req, res, next) {
  // Token comes in header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, JWT_USER_SECRET);
    req.userId = decoded.id; // Attach userId to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

module.exports = userAuth;
