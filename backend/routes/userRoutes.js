const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getMyProfile,
} = require("../controllers/userController");
const uploadProfile = require("../middleware/uploadProfile.js")
const { verifyToken } = require("../middleware/authMiddleware");
const multer = require("multer"); 

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.put(
  "/me",
  verifyToken,
  (req, res, next) => {
    uploadProfile.single("profile_photo")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "Ukuran file maksimal 2MB" });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  updateProfile
);

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;