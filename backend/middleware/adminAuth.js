// middleware/adminAuth.js
// Protects routes that require admin authentication.
// Verifies JWT token using JWT_ADMIN_SECRET (different from user secret).
// On success: attaches adminId to req so admin routes can identify the caller.

const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");

function adminAuth(req, res, next) {
  // Token comes in header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // Verify using ADMIN secret — admins and users have different secrets
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
    req.adminId = decoded.id; // Attach adminId to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired admin token." });
  }
}

module.exports = adminAuth;
