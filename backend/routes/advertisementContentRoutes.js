const express = require("express");
const router = express.Router();
const advertisementContentController = require("../controllers/advertisementContentController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { uploadAdBanner } = require("../middleware/uploadMiddleware");
const multer = require("multer");

// Setup multer untuk handle multiple files
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'photo') {
        cb(null, 'uploads/iklan');
      } else if (file.fieldname === 'proof_payment') {
        cb(null, 'uploads/payments');
      }
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      if (file.fieldname === 'photo') {
        cb(null, `${timestamp}_ad_${file.originalname}`);
      } else if (file.fieldname === 'proof_payment') {
        cb(null, `${timestamp}_payment_${file.originalname}`);
      }
    }
  })
});

// ===== USER ROUTES =====

// POST: Create advertisement transaction
router.post("/purchase", 
  verifyToken, 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'proof_payment', maxCount: 1 }
  ]), 
  advertisementContentController.createAdvertisementTransaction
);

// GET: Get user advertisement history
router.get("/my-advertisements", 
  verifyToken, 
  advertisementContentController.getUserAdvertisements
);

// GET: Get active advertisements (public)
router.get("/active", 
  advertisementContentController.getActiveAdvertisements
);

// ===== ADMIN ROUTES =====

// GET: Get all advertisement contents (with filtering and pagination)
router.get("/admin/all", 
  verifyToken, 
  isAdmin, 
  advertisementContentController.getAllAdvertisementContents
);

// GET: Get advertisement content by ID
router.get("/admin/:id", 
  verifyToken, 
  isAdmin, 
  advertisementContentController.getAdvertisementContentById
);

module.exports = router;