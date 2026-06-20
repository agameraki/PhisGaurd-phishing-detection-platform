const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  directUpgrade,
  getPaymentStatus,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/payment/order
router.post("/order", protect, createOrder);

// @route   POST /api/payment/verify
router.post("/verify", protect, verifyPayment);

// @route   POST /api/payment/upgrade
router.post("/upgrade", protect, directUpgrade);

// @route   GET /api/payment/status
router.get("/status", protect, getPaymentStatus);

module.exports = router;