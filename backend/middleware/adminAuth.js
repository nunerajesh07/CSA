




const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");

function adminAuth(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; 

  try {

    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
    req.adminId = decoded.id; 
    next(); 
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired admin token." });
  }
}

module.exports = adminAuth;
