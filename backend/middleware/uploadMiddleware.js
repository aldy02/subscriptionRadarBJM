const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder uploads ada
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// === Upload bukti pembayaran ===
const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/payments");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_payment" + path.extname(file.originalname));
  },
});

const uploadPayment = multer({ storage: paymentStorage });

// === Upload banner iklan ===
const adStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/iklan");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_banner" + path.extname(file.originalname));
  },
});

const uploadAdBanner = multer({ storage: adStorage });

// === Upload gambar berita ===
const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/news");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_news" + path.extname(file.originalname));
  },
});

const uploadNews = multer({ storage: newsStorage });

module.exports = {
  uploadPayment,
  uploadAdBanner,
  uploadNews,
};