const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user di request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

// Middleware for admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
};

// Middleware for subscriber
exports.isSubscriber = (req, res, next) => {
  if (req.user.role !== "subscriber") {
    return res.status(403).json({ message: "Akses hanya untuk subscriber" });
  }
  next();
};