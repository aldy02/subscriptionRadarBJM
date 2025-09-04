const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const multer = require("multer");
const path = require("path");

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/news");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg'];
    const allowedExtensions = ['.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file JPG/JPEG yang diperbolehkan"), false);
    }
  },
});

// Middleware for handling multer errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "Ukuran file terlalu besar (maksimal 5MB)" });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// CRUD routes
router.post("/", 
  upload.single("photo"), 
  handleUploadError, 
  newsController.createNews
);

router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);

router.put("/:id", 
  upload.single("photo"), 
  handleUploadError, 
  newsController.updateNews
);

router.delete("/:id", newsController.deleteNews);

module.exports = router;