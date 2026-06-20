const express = require("express");
const router = express.Router();
const { scanEmail, getScan } = require("../controllers/scanController");
const { protect } = require("../middleware/authMiddleware");
const { checkScanLimit } = require("../middleware/planMiddleware");

// @route   POST /api/scan
router.post("/", protect, checkScanLimit, scanEmail);

// @route   GET /api/scan/:id
router.get("/:id", protect, getScan);

module.exports = router;