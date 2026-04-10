




const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");

function userAuth(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; 

  try {

    const decoded = jwt.verify(token, JWT_USER_SECRET);
    req.userId = decoded.id; 
    next(); 
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

module.exports = userAuth;
