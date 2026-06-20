const User = require("../models/User");

// Check if user can scan (free tier limit)
const checkScanLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.plan === "premium") {
      return next();
    }

    // Check and reset daily count if 24 hours passed
    const now = new Date();
    const lastReset = new Date(user.lastScanReset);
    const hoursDiff = (now - lastReset) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
      user.scanCount = 0;
      user.lastScanReset = now;
      await user.save();
      return next();
    }

    // Check if free user exceeded 3 scans
    if (user.scanCount >= 3) {
      return res.status(403).json({
        success: false,
        message: "Daily scan limit reached. Upgrade to premium for unlimited scans.",
        limitReached: true,
        scansUsed: user.scanCount,
        scansAllowed: 3,
        resetTime: new Date(lastReset.getTime() + 24 * 60 * 60 * 1000),
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking scan limit",
    });
  }
};

// Check if user has premium plan
const requirePremium = (req, res, next) => {
  if (req.user.plan !== "premium") {
    return res.status(403).json({
      success: false,
      message: "This feature requires a premium plan",
      requiresUpgrade: true,
    });
  }
  next();
};

module.exports = { checkScanLimit, requirePremium };