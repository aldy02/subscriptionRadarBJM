const express = require("express");
const router = express.Router();
const advertisementController = require("../controllers/advertisementController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Ambil semua paket iklan
router.get("/packages", advertisementController.getAllPackages);

// Ambil detail paket iklan
router.get("/packages/:id", advertisementController.getPackageById);

// Ambil semua iklan aktif
router.get("/active", advertisementController.getActiveAds);

// Tambah paket iklan (admin only)
router.post("/packages", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, size, price } = req.body;
    const Advertisement = require("../models/advertisement");
    const ad = await Advertisement.create({ name, description, size, price });
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;