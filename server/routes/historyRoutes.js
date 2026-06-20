const express = require("express");
const router = express.Router();
const {
  getHistory,
  getScanDetail,
  deleteScan,
  getStats,
} = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");
const { requirePremium } = require("../middleware/planMiddleware");

// @route   GET /api/history/stats
router.get("/stats", protect, getStats);

// @route   GET /api/history
router.get("/", protect, getHistory);

// @route   GET /api/history/:id
router.get("/:id", protect, getScanDetail);

// @route   DELETE /api/history/:id
router.delete("/:id", protect, deleteScan);

module.exports = router;