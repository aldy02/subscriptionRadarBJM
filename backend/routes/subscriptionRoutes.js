const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  createSubscription,
  getMySubscriptions,
  getAllSubscriptions,
} = require("../controllers/subscriptionController");

const router = express.Router();

// Customer buat langganan
router.post("/", verifyToken, createSubscription);

// Customer lihat langganan mereka
router.get("/my", verifyToken, getMySubscriptions);

// Admin lihat semua langganan
router.get("/", verifyToken, isAdmin, getAllSubscriptions);

module.exports = router;