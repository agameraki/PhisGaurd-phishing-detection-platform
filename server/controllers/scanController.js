const Scan = require("../models/Scan");
const User = require("../models/User");
const { analyzeEmail } = require("../services/riskEngine");
const {
  compileIndicators,
  calculateConfidence,
  generateExplanation,
} = require("../services/detectors/scoringEngine");

const THREAT_CATEGORY_MAP = {
  urgency: "Urgency",
  domain: "Domain Risk",
  url: "Domain Risk",
  sensitiveData: "Combined Risk",
  contentQuality: "Content Quality",
  scams: "Suspicious Offer",
  quality: "Content Quality",
};

const buildThreats = (breakdown = {}) => {
  const threats = [];

  for (const [key, result] of Object.entries(breakdown)) {
    if (!result?.details?.length) continue;

    const perDetailScore = Math.max(
      1,
      Math.round(result.score / result.details.length)
    );

    for (const detail of result.details) {
      threats.push({
        category: THREAT_CATEGORY_MAP[key] || "Combined Risk",
        detail,
        score: perDetailScore,
      });
    }
  }

  return threats;
};

// @desc    Scan an email
// @route   POST /api/scan
// @access  Private
const scanEmail = async (req, res, next) => {
  try {
    const { subject, sender, content, attachments = [] } = req.body;

    // Validate fields
    if (!subject || !sender || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject, sender and content",
      });
    }

    // Run comprehensive risk engine analysis (v2.0)
    const riskAnalysis = analyzeEmail(subject, sender, content, attachments);

    // Extract detailed information for response
    const {
      riskScore,
      riskLevel,
      recommendation,
      color,
      threatBreakdown = {},
      breakdown = {},
      analysis = {},
    } = riskAnalysis;

    const indicators = compileIndicators(analysis);
    const confidence = calculateConfidence(
      indicators,
      analysis.attachments?.hasAttachments,
      (analysis.urls || []).length >= 2
    );
    const explanation = generateExplanation(riskLevel, indicators, riskScore);
    const threats = buildThreats(breakdown);

    // Format links for storage
    const formattedLinks = (analysis.urls || []).map((link) => ({
      url: link.url,
      domain: link.domain,
      displayText: truncateUrl(link.url),
      isSuspicious: link.isSuspicious,
      reasons: link.risks,
      riskScore: link.riskScore,
    }));

    const totalLinks = formattedLinks.length;
    const suspiciousLinks = formattedLinks.filter((l) => l.isSuspicious).length;

    // Save scan to database
    const scan = await Scan.create({
      user: req.user._id,
      emailData: { subject, sender, content },
      riskScore,
      riskLevel,
      recommendation,
      threats,
      links: formattedLinks.map((link) => ({
        url: link.url,
        displayText: link.displayText,
        isSuspicious: link.isSuspicious,
        reason: (link.reasons || []).join("; "),
      })),
      urgencyScore: threatBreakdown.urgencyScore || 0,
      domainRisk: threatBreakdown.domainRisk || 0,
      grammarScore: threatBreakdown.contentIssues || 0,
    });

    // Increment user scan count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { scanCount: 1 },
    });

    // Return comprehensive analysis result
    res.status(200).json({
      success: true,
      message: "Email scanned successfully with advanced detection",
      data: {
        scanId: scan._id,

        // Core Results
        riskScore,
        riskLevel,
        confidence,
        color,
        recommendation,

        // Threat breakdown (used by dashboard components)
        threatBreakdown,
        urgencyScore: threatBreakdown.urgencyScore || 0,
        domainRisk: threatBreakdown.domainRisk || 0,
        grammarScore: threatBreakdown.contentIssues || 0,
        sensitiveDataRisk: threatBreakdown.sensitiveDataRisk || 0,
        senderRisk: threatBreakdown.senderRisk || 0,

        explanation: {
          title: explanation.title,
          message: explanation.message,
          recommendation: explanation.recommendation,
        },

        indicators,
        indicatorCount: Object.values(indicators).flat().length,

        analysis: {
          senderDomain: {
            domain: analysis.senderDomain?.domain,
            isFreeProvider: analysis.senderDomain?.isFreeProvider,
            brandMismatch: analysis.senderDomain?.brandMismatch,
            risks: analysis.senderDomain?.risks,
          },
          urls: {
            total: totalLinks,
            suspicious: suspiciousLinks,
            details: formattedLinks,
          },
          sensitiveInfo: {
            hasSensitiveRequests: analysis.sensitiveInfo?.hasSensitiveRequests,
            detectedTypes: analysis.sensitiveInfo?.detectedTypes,
            details: analysis.sensitiveInfo?.details,
          },
          contentPatterns: {
            urgency: analysis.contentPatterns?.urgency,
            scams: analysis.contentPatterns?.scams,
            quality: analysis.contentPatterns?.quality,
          },
          attachments: {
            hasAttachments: analysis.attachments?.hasAttachments,
            details: analysis.attachments?.details,
            overallRisk: analysis.attachments?.overallRisk,
          },
        },

        threats,
        links: formattedLinks,
        totalLinks,
        suspiciousLinks,

        scannedAt: scan.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Utility: Truncate long URLs for display
const truncateUrl = (url) => {
  if (url.length > 50) {
    return url.substring(0, 47) + "...";
  }
  return url;
};

// @desc    Get single scan result
// @route   GET /api/scan/:id
// @access  Private
const getScan = async (req, res, next) => {
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

module.exports = { scanEmail, getScan };
