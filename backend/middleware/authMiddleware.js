const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const userSubscription = require("../models/userSubscription");

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

// Middleware: hanya untuk admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
};

// Middleware: hanya untuk subscriber dengan paket aktif
exports.subscriberOnly = async (req, res, next) => {
  try {
    const now = new Date();
    const activeSubscription = await userSubscription.findOne({
      where: {
        user_id: req.user.id,
        start_date: { [Op.lte]: now },
        end_date: { [Op.gte]: now },
      },
    });

    if (!activeSubscription) {
      return res.status(403).json({ message: "Akses hanya untuk subscriber aktif" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};