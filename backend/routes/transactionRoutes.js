const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { uploadPayment } = require("../middleware/uploadMiddleware");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

// User buat transaksi subscription/advertisement
router.post(
  "/",
  verifyToken,
  uploadPayment.single("proof_payment"), // upload bukti pembayaran
  transactionController.createTransaction
);

// User lihat semua transaksi miliknya
router.get("/my", verifyToken, transactionController.getMyTransactions);

// Admin validasi transaksi
router.put(
  "/validate/:transactionId",
  verifyToken,
  adminOnly,
  transactionController.validateTransaction
);

module.exports = router;