

// module.exports = auth;  
require('dotenv').config();
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  try {
    // Header se token lena (frontend "Authorization: Bearer token" bhejta hai)
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: 0, message: "No Token-Please SignUp-Login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // 👈 ab har route pe tumhe req.user.id aur req.user.email mil jayega
    next();
  } catch (err) {
    return res.status(401).json({ status: 0, message: "Invalid token" });
  }
}

module.exports = auth;


