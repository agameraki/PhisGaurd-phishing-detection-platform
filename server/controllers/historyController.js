const Scan = require("../models/Scan");

// @desc    Get all scans for logged in user
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Scan.countDocuments({ user: req.user._id });

    const scans = await Scan.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "emailData.subject emailData.sender riskScore riskLevel recommendation createdAt"
      );

    res.status(200).json({
      success: true,
      data: scans,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single scan details
// @route   GET /api/history/:id
// @access  Private
const getScanDetail = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

    // Make sure user owns this scan
    if (scan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this scan",
      });
    }

    res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a scan
// @route   DELETE /api/history/:id
// @access  Private
const deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

    // Make sure user owns this scan
    if (scan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this scan",
      });
    }

    await scan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Scan deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scan statistics for logged in user
// @route   GET /api/history/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const totalScans = await Scan.countDocuments({ user: req.user._id });

    const riskBreakdown = await Scan.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRiskScore = await Scan.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$riskScore" },
        },
      },
    ]);

    // Last 7 scans for trend
    const recentScans = await Scan.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("riskScore riskLevel createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalScans,
        riskBreakdown,
        avgRiskScore: avgRiskScore[0]?.avgScore?.toFixed(1) || 0,
        recentScans,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, getScanDetail, deleteScan, getStats };