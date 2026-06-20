const User = require("../models/User");

// @desc    Create demo payment order
// @route   POST /api/payment/order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    if (req.user.plan === "premium") {
      return res.status(400).json({
        success: false,
        message: "You are already on the premium plan",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: `demo_order_${Date.now()}`,
        amount: 49900,
        currency: "INR",
        user: {
          name: req.user.name,
          email: req.user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify demo payment and upgrade user
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        plan: "premium",
        paymentId: `DEMO_${Date.now()}`,
        premiumActivatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified. Welcome to PhishGuard Premium!",
      data: {
        plan: user.plan,
        premiumActivatedAt: user.premiumActivatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Direct upgrade (demo mode)
// @route   POST /api/payment/upgrade
// @access  Private
const directUpgrade = async (req, res, next) => {
  try {
    if (req.user.plan === "premium") {
      return res.status(400).json({
        success: false,
        message: "You are already on premium plan",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        plan: "premium",
        paymentId: `DEMO_${Date.now()}`,
        premiumActivatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Upgrade successful! Welcome to PhishGuard Premium!",
      data: {
        plan: user.plan,
        premiumActivatedAt: user.premiumActivatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment status
// @route   GET /api/payment/status
// @access  Private
const getPaymentStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        plan: user.plan,
        premiumActivatedAt: user.premiumActivatedAt,
        paymentId: user.paymentId,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, directUpgrade, getPaymentStatus };