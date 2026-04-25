const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_USER_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error(`[Auth] JWT Verification failed:`, err.message);
    return res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
  }
}

function requireAdmin(req, res, next) {
  if (req.role !== "admin") {
    console.warn(`[Auth] Forbidden: User ${req.userId} attempted to access admin route.`);
    return res.status(403).json({ message: "Forbidden. Admin role required." });
  }
  next();
}

function requireUser(req, res, next) {
  // Allow admins to also access standard user routes (superset of privileges)
  if (req.role !== "user" && req.role !== "admin") {
    console.warn(`[Auth] Forbidden: Account ${req.userId} with role ${req.role} lacks required access.`);
    return res.status(403).json({ message: "Forbidden. User role required." });
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireUser
};
