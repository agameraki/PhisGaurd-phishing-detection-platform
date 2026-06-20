// Weighted scoring configuration - POINT SYSTEM (not percentages)
const SCORING_CONFIG = {
  // Maximum points each component can contribute
  maxPoints: {
    senderDomain: 25,          // Free email, brand mismatch, etc.
    urlAnalysis: 35,           // IP, shortened, typosquatting, etc.
    sensitiveInfo: 30,         // Password, OTP, card, bank account, etc.
    urgency: 15,               // Urgent language
    scamPatterns: 15,          // Lottery, inheritance, etc.
    contentQuality: 10,        // Grammar, caps, etc.
    attachments: 20,           // Dangerous files
  },

  // Risk level thresholds (updated per requirements)
  thresholds: {
    safe: 30,                  // 0-29: Safe
    suspicious: 60,            // 30-59: Suspicious
    highRisk: 80,              // 60-79: High Risk
    likelyPhishing: 100,       // 80-100: Likely Phishing
  },
};

/**
 * Calculate final risk score from component scores
 * Each component contributes UP TO its maxPoints value
 * Scores are summed and capped at 100
 */
const calculateWeightedScore = (componentScores) => {
  let totalScore = 0;

  // Sum all component scores (each contributes to total)
  for (const component of Object.keys(SCORING_CONFIG.maxPoints)) {
    if (componentScores[component] !== undefined) {
      const score = componentScores[component];
      const maxPoints = SCORING_CONFIG.maxPoints[component];
      
      // Ensure score doesn't exceed its maximum allocation
      const contribution = Math.min(score, maxPoints);
      totalScore += contribution;
    }
  }

  // Cap total at 100
  return Math.min(Math.round(totalScore), 100);
};

/**
 * Determine risk level based on score
 */
const getRiskLevel = (score) => {
  if (score < SCORING_CONFIG.thresholds.suspicious) {
    return "safe";
  } else if (score < SCORING_CONFIG.thresholds.highRisk) {
    return "suspicious";
  } else if (score < SCORING_CONFIG.thresholds.likelyPhishing) {
    return "high risk";
  } else {
    return "likely phishing";
  }
};

// Generate risk level badge colors
const getRiskLevelColor = (level) => {
  const colors = {
    safe: { bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },           // Green
    suspicious: { bg: "#FEF3C7", text: "#B45309", dot: "#F59E0B" },     // Yellow
    "high risk": { bg: "#FECACA", text: "#991B1B", dot: "#DC2626" },    // Light Red
    "likely phishing": { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" }, // Dark Red
  };
  return colors[level] || colors["likely phishing"];
};

// Calculate confidence score (0-100)
// Based on indicator consistency and data quality
const calculateConfidence = (indicators, hasAttachments, hasManyUrls) => {
  let confidence = 60; // Base confidence

  // More indicators = higher confidence
  const indicatorCount = Object.values(indicators).flat().filter(i => i).length;
  if (indicatorCount >= 5) confidence += 20;
  if (indicatorCount >= 3) confidence += 10;

  // Multiple URL analysis points = higher confidence
  if (hasManyUrls) confidence += 10;

  // Attachment presence = more context = higher confidence
  if (hasAttachments) confidence += 5;

  return Math.min(confidence, 100);
};

// Compile all detected indicators
const compileIndicators = (results) => {
  const indicators = {
    senderDomain: [],
    urls: [],
    sensitiveInfo: [],
    urgency: [],
    scams: [],
    content: [],
    attachments: [],
  };

  // Sender domain indicators
  if (results.senderDomain) {
    if (results.senderDomain.isFreeProvider) {
      indicators.senderDomain.push("Free email provider used");
    }
    if (results.senderDomain.brandMismatch.length > 0) {
      indicators.senderDomain.push(
        `Brand mentioned but sent from different domain (${results.senderDomain.brandMismatch.join(", ")})`
      );
    }
  }

  // URL indicators
  if (results.urls) {
    results.urls.forEach(url => {
      if (url.isSuspicious) {
        indicators.urls.push(...url.risks);
      }
    });
  }

  // Sensitive info indicators
  if (results.sensitiveInfo && results.sensitiveInfo.detectedTypes) {
    indicators.sensitiveInfo = results.sensitiveInfo.detectedTypes;
  }

  // Urgency indicators
  if (results.contentPatterns?.urgency?.triggers) {
    indicators.urgency = results.contentPatterns.urgency.triggers.map(t => t.phrase);
  }

  // Scam indicators
  if (results.contentPatterns?.scams?.patterns) {
    indicators.scams = results.contentPatterns.scams.patterns.map(p => p.phrase);
  }

  // Content quality indicators
  if (results.contentPatterns?.quality?.issues) {
    indicators.content = results.contentPatterns.quality.issues;
  }

  // Attachment indicators
  if (results.attachments && results.attachments.details) {
    indicators.attachments = results.attachments.details
      .filter(a => a.isSuspicious)
      .map(a => `${a.filename}: ${a.risks.join(", ")}`);
  }

  return indicators;
};

// Generate human-readable explanation
const generateExplanation = (riskLevel, indicators, riskScore) => {
  const explanations = {
    safe: {
      title: "Email appears safe",
      message:
        "This email does not show significant phishing characteristics. However, always remain cautious with unexpected emails and verify sender identity through official channels.",
    },
    suspicious: {
      title: "Email shows suspicious patterns",
      message:
        "This email contains one or more red flags. Do not click links or download attachments. Do not provide personal information. Verify the sender through official channels before responding.",
    },
    "high risk": {
      title: "Email is likely a phishing attempt",
      message:
        "This email exhibits multiple phishing characteristics and is likely malicious. Do not click links, download attachments, or provide any information. Consider reporting to your email provider.",
    },
    "likely phishing": {
      title: "Email is almost certainly a phishing attempt",
      message:
        "This email exhibits strong indicators of a phishing attack. Delete immediately and report as phishing. Do not click links, download attachments, or provide any information under any circumstances.",
    },
  };

  const base = explanations[riskLevel] || explanations.suspicious;

  // Add specific indicators to explanation
  let detail = "";
  const indicatorSummary = [];

  if (indicators.senderDomain.length > 0) {
    indicatorSummary.push(`Domain issues: ${indicators.senderDomain[0]}`);
  }
  if (indicators.sensitiveInfo.length > 0) {
    indicatorSummary.push(
      `Asking for sensitive data: ${indicators.sensitiveInfo.join(", ")}`
    );
  }
  if (indicators.urgency.length > 0) {
    indicatorSummary.push(
      `Pressure tactics: "${indicators.urgency[0]}"`
    );
  }
  if (indicators.scams.length > 0) {
    indicatorSummary.push(
      `Suspicious offer: ${indicators.scams[0]}`
    );
  }

  if (indicatorSummary.length > 0) {
    detail = "\n\n" + indicatorSummary.join("\n");
  }

  return {
    title: base.title,
    message: base.message + detail,
    recommendation: getRecommendation(riskLevel),
  };
};

// Get action recommendation
const getRecommendation = (riskLevel) => {
  const recommendations = {
    safe: "✓ Safe to read\n✓ Links likely safe\n✓ No immediate action needed",
    suspicious:
      "⚠ Do not click links\n⚠ Do not download attachments\n⚠ Do not provide personal information\n⚠ Verify sender through official channels",
    "high risk":
      "✕ Delete this email\n✕ Report as phishing\n✕ Do not click links\n✕ Do not download attachments\n✕ Do not provide any information",
    "likely phishing":
      "✕ DELETE IMMEDIATELY\n✕ Report as phishing\n✕ Do NOT click any links\n✕ Do NOT download attachments\n✕ Do NOT provide any information\n✕ Contact your email provider",
  };

  return recommendations[riskLevel] || recommendations.suspicious;
};

module.exports = {
  SCORING_CONFIG,
  calculateWeightedScore,
  getRiskLevel,
  getRiskLevelColor,
  calculateConfidence,
  compileIndicators,
  generateExplanation,
  getRecommendation,
};
