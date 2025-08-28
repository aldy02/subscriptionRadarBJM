const express = require("express");
const { register, login, updateProfile } = require("../controllers/authController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// upload photo using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.post("/register", register);
router.post("/login", login);
// Update profile (dengan upload foto)
router.put("/update-profile/:id", upload.single("profile_photo"), updateProfile);

module.exports = router;