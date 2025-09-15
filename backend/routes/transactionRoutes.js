const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { uploadPayment } = require("../middleware/uploadMiddleware");

// ===== USER ROUTES =====
// POST: Create subscription transaction
router.post("/subscription", 
  verifyToken, 
  uploadPayment.single('proof_payment'), 
  transactionController.createSubscriptionTransaction
);

// GET: Get user transaction history
router.get("/my-transactions", 
  verifyToken, 
  transactionController.getUserTransactions
);

// GET: Get transaction by invoice number
router.get("/invoice/:invoice_number", 
  verifyToken, 
  transactionController.getTransactionByInvoice
);

// ===== ADMIN ROUTES =====
// GET: Get all transactions (with filtering and pagination)
router.get("/admin/all", 
  verifyToken, 
  isAdmin, 
  transactionController.getAllTransactions
);

// PUT: Update transaction status
router.put("/admin/:id/status", 
  verifyToken, 
  isAdmin, 
  transactionController.updateTransactionStatus
);

// GET: Get transaction statistics for dashboard
router.get("/admin/stats", 
  verifyToken, 
  isAdmin, 
  transactionController.getTransactionStats
);

module.exports = router;