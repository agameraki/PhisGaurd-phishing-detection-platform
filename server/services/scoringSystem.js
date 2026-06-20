// /**
//  * Centralized Phishing Risk Scoring System v3.0
//  * 
//  * This is the single source of truth for all risk scoring.
//  * Every threat detected contributes exact weights to categories.
//  * UI displays numbers directly from threatBreakdown object.
//  */

// // ============================================================================
// // THREAT WEIGHTS CONFIGURATION
// // ============================================================================

// const THREAT_WEIGHTS = {
//   // Sensitive Data Requests (each request type)
//   PASSWORD_REQUEST: 25,
//   OTP_REQUEST: 25,
//   PIN_REQUEST: 25,
//   CREDIT_CARD_REQUEST: 25,
//   BANK_ACCOUNT_REQUEST: 25,

//   // URL Analysis
//   SUSPICIOUS_URL: 20,
//   DOMAIN_MISMATCH: 20,
//   MISLEADING_KEYWORD: 15,
//   EXCESSIVE_HYPHENS: 10,
//   IP_ADDRESS_URL: 20,
//   URL_SHORTENER: 15,

//   // Sender Analysis
//   FREE_EMAIL_COMPANY_CLAIM: 20,
//   BRAND_IMPERSONATION: 25,
//   TYPOSQUATTING_DOMAIN: 20,

//   // Content Analysis
//   GENERIC_GREETING: 5,
//   EXCESSIVE_SPACING: 5,
//   EXCESSIVE_PUNCTUATION: 5,
//   ALL_CAPS_SECTIONS: 5,

//   // Urgency Analysis
//   ACCOUNT_SUSPENDED: 10,
//   IMMEDIATE_ACTION: 10,
//   WITHIN_24_HOURS: 10,
//   FINAL_WARNING: 10,
//   LEGAL_ACTION: 10,
// };

// // ============================================================================
// // RISK LEVEL DEFINITIONS
// // ============================================================================

// const RISK_LEVELS = {
//   SAFE: { range: [0, 29], label: "safe", color: "#10B981" },
//   SUSPICIOUS: { range: [30, 59], label: "suspicious", color: "#F59E0B" },
//   HIGH_RISK: { range: [60, 79], label: "high risk", color: "#DC2626" },
//   LIKELY_PHISHING: { range: [80, 100], label: "likely phishing", color: "#991B1B" },
// };

// // ============================================================================
// // RECOMMENDATION MESSAGES
// // ============================================================================

// const RECOMMENDATIONS = {
//   safe:
//     "This email appears legitimate. Continue using normal caution.",
//   suspicious:
//     "This email contains some suspicious indicators. Verify the sender before taking action.",
//   "high risk":
//     "This email shows multiple phishing indicators. Avoid clicking links or sharing information.",
//   "likely phishing":
//     "This email is highly likely to be a phishing attempt. Do not click links, open attachments, or provide sensitive information.",
// };

// // ============================================================================
// // SCORING FUNCTIONS
// // ============================================================================

// /**
//  * Calculate Sensitive Data Risk Score
//  * Checks for password, OTP, PIN, credit card, and bank account requests
//  * 
//  * @param {object} sensitiveInfoAnalysis - Result from sensitiveInfoDetector
//  * @returns {object} { score, details: [] }
//  */
// const calculateSensitiveDataRisk = (sensitiveInfoAnalysis) => {
//   let score = 0;
//   const details = [];

//   if (!sensitiveInfoAnalysis || !sensitiveInfoAnalysis.detectedTypes) {
//     return { score: 0, details: [] };
//   }

//   const types = sensitiveInfoAnalysis.detectedTypes;

//   if (types.includes("password")) {
//     score += THREAT_WEIGHTS.PASSWORD_REQUEST;
//     details.push("Password request detected");
//   }
//   if (types.includes("otp")) {
//     score += THREAT_WEIGHTS.OTP_REQUEST;
//     details.push("OTP request detected");
//   }
//   if (types.includes("pin")) {
//     score += THREAT_WEIGHTS.PIN_REQUEST;
//     details.push("PIN request detected");
//   }
//   if (types.includes("creditCard")) {
//     score += THREAT_WEIGHTS.CREDIT_CARD_REQUEST;
//     details.push("Credit card details request");
//   }
//   if (types.includes("bankAccount")) {
//     score += THREAT_WEIGHTS.BANK_ACCOUNT_REQUEST;
//     details.push("Bank account details request");
//   }

//   return { score, details };
// };

// /**
//  * Calculate Domain Risk Score
//  * Checks for free email providers, brand impersonation, and typosquatting
//  * 
//  * @param {object} senderAnalysis - Result from senderDomainAnalyzer
//  * @returns {object} { score, details: [] }
//  */
// const calculateDomainRisk = (senderAnalysis) => {
//   let score = 0;
//   const details = [];

//   if (!senderAnalysis) {
//     return { score: 0, details: [] };
//   }

//   // Free email provider claiming company identity
//   if (senderAnalysis.isFreeProvider && senderAnalysis.brandMismatch && senderAnalysis.brandMismatch.length > 0) {
//     score += THREAT_WEIGHTS.FREE_EMAIL_COMPANY_CLAIM;
//     details.push("Free email provider claiming company identity");
//   }

//   // Brand impersonation detected
//   if (senderAnalysis.brandMismatch && senderAnalysis.brandMismatch.length > 0) {
//     score += THREAT_WEIGHTS.BRAND_IMPERSONATION;
//     details.push(`Brand impersonation: ${senderAnalysis.brandMismatch.join(", ")}`);
//   }

//   // Check for typosquatting in domain
//   if (senderAnalysis.domain && senderAnalysis.risks) {
//     const riskText = senderAnalysis.risks.join(" ").toLowerCase();
//     if (riskText.includes("typo") || riskText.includes("similar") || riskText.includes("misspell")) {
//       score += THREAT_WEIGHTS.TYPOSQUATTING_DOMAIN;
//       details.push("Typosquatting domain detected");
//     }
//   }

//   return { score, details };
// };

// /**
//  * Calculate URL Risk Score
//  * Checks for suspicious URLs, domain mismatches, misleading keywords, excessive hyphens, IP addresses, shorteners
//  * 
//  * @param {array} urlAnalyses - Array of URL analysis results
//  * @returns {object} { score, details: [] }
//  */
// const calculateURLRisk = (urlAnalyses) => {
//   let score = 0;
//   const details = [];

//   if (!urlAnalyses || urlAnalyses.length === 0) {
//     return { score: 0, details: [] };
//   }

//   for (const analysis of urlAnalyses) {
//     if (!analysis) continue;

//     // Check each risk type in the risks array
//     const riskText = (analysis.risks || []).join(" ").toLowerCase();
    
//     // IP address URL
//     if (riskText.includes("ip address")) {
//       score += THREAT_WEIGHTS.IP_ADDRESS_URL;
//       details.push(`IP address used instead of domain`);
//     }
    
//     // URL shortener
//     if (riskText.includes("shortened")) {
//       score += THREAT_WEIGHTS.URL_SHORTENER;
//       details.push(`Shortened URL detected`);
//     }
    
//     // Domain mismatch
//     if (riskText.includes("domain differ")) {
//       score += THREAT_WEIGHTS.DOMAIN_MISMATCH;
//       details.push(`Domain mismatch in URL`);
//     }
    
//     // Misleading keywords
//     if (riskText.includes("misleading keyword")) {
//       score += THREAT_WEIGHTS.MISLEADING_KEYWORD;
//       details.push(`Misleading keywords in URL`);
//     }
    
//     // Excessive hyphens
//     if (riskText.includes("excessive hyphens") || riskText.includes("hyphens in domain")) {
//       score += THREAT_WEIGHTS.EXCESSIVE_HYPHENS;
//       details.push(`URL has excessive hyphens`);
//     }
    
//     // URL obfuscation or other suspicious patterns
//     if (riskText.includes("obfuscation") || riskText.includes("typosquatting")) {
//       score += THREAT_WEIGHTS.SUSPICIOUS_URL;
//       details.push(`Suspicious URL pattern detected`);
//     }
    
//     // Generic suspicious flag
//     if (analysis.isSuspicious && score === 0) {
//       score += THREAT_WEIGHTS.SUSPICIOUS_URL;
//       details.push(`Suspicious URL: ${analysis.url}`);
//     }
//   }

//   return { score, details };
// };

// /**
//  * Calculate Content Issue Risk Score
//  * Checks for generic greetings, excessive spacing, excessive punctuation, ALL CAPS
//  * 
//  * @param {object} contentAnalysis - Result from contentPatternAnalyzer
//  * @returns {object} { score, details: [] }
//  */
// const calculateContentIssues = (contentAnalysis) => {
//   let score = 0;
//   const details = [];

//   if (!contentAnalysis || !contentAnalysis.quality) {
//     return { score: 0, details: [] };
//   }

//   const quality = contentAnalysis.quality;
//   const issues = quality.issues || [];

//   // Add points based on detected issues
//   for (const issue of issues) {
//     const issueLower = issue.toLowerCase();

//     if (issueLower.includes("generic greeting")) {
//       score += THREAT_WEIGHTS.GENERIC_GREETING;
//       details.push("Generic greeting detected");
//     } else if (issueLower.includes("excessive spacing")) {
//       score += THREAT_WEIGHTS.EXCESSIVE_SPACING;
//       details.push("Excessive spacing in email");
//     } else if (issueLower.includes("excessive punctuation")) {
//       score += THREAT_WEIGHTS.EXCESSIVE_PUNCTUATION;
//       details.push("Excessive punctuation detected");
//     } else if (issueLower.includes("all caps")) {
//       score += THREAT_WEIGHTS.ALL_CAPS_SECTIONS;
//       details.push("ALL CAPS sections detected");
//     }
//   }

//   return { score, details };
// };

// /**
//  * Calculate Scam Pattern Risk Score
//  * 
//  * @param {object} contentAnalysis - Result from contentPatternAnalyzer
//  * @returns {object} { score, details: [] }
//  */
// const calculateScamPatternScore = (contentAnalysis) => {
//   let score = 0;
//   const details = [];

//   if (!contentAnalysis || !contentAnalysis.scams) {
//     return { score: 0, details: [] };
//   }

//   const scams = contentAnalysis.scams;
//   const patterns = scams.patterns || [];

//   for (const pattern of patterns) {
//     const phrase = pattern.phrase || "";
//     const category = pattern.category || "";
    
//     if (phrase) {
//       details.push(`${category}: "${phrase}"`);
//       score += pattern.riskContribution || 10;
//     }
//   }

//   return { score, details };
// };

// /**
//  * Calculate Content Quality Risk Score
//  * Uses the quality score from content analyzer
//  * 
//  * @param {object} contentAnalysis - Result from contentPatternAnalyzer
//  * @returns {object} { score, details: [] }
//  */
// const calculateQualityScore = (contentAnalysis) => {
//   if (!contentAnalysis || !contentAnalysis.quality) {
//     return { score: 0, details: [] };
//   }

//   const quality = contentAnalysis.quality;
//   return {
//     score: quality.riskScore || 0,
//     details: quality.issues || [],
//   };
// };

// /**
//  * Calculate Urgency Risk Score
//  * Checks for account suspended, immediate action, within 24 hours, final warning, legal action
//  * 
//  * @param {object} contentAnalysis - Result from contentPatternAnalyzer
//  * @returns {object} { score, details: [] }
//  */
// const calculateUrgencyScore = (contentAnalysis) => {
//   let score = 0;
//   const details = [];

//   if (!contentAnalysis || !contentAnalysis.urgency) {
//     return { score: 0, details: [] };
//   }

//   const urgency = contentAnalysis.urgency;
//   const triggers = urgency.triggers || [];

//   // Map phrases to threat weights
//   const phraseWeights = {
//     "account suspended": THREAT_WEIGHTS.ACCOUNT_SUSPENDED,
//     "account will be suspended": THREAT_WEIGHTS.ACCOUNT_SUSPENDED,
//     "immediate action": THREAT_WEIGHTS.IMMEDIATE_ACTION,
//     "immediate action required": THREAT_WEIGHTS.IMMEDIATE_ACTION,
//     "act now": THREAT_WEIGHTS.IMMEDIATE_ACTION,
//     "within 24 hours": THREAT_WEIGHTS.WITHIN_24_HOURS,
//     "final warning": THREAT_WEIGHTS.FINAL_WARNING,
//     "legal action": THREAT_WEIGHTS.LEGAL_ACTION,
//   };

//   for (const trigger of triggers) {
//     const phrase = trigger.phrase || "";
//     const phraseLower = phrase.toLowerCase();

//     // Check for specific threats
//     if (phraseLower.includes("account") && phraseLower.includes("suspend")) {
//       score += THREAT_WEIGHTS.ACCOUNT_SUSPENDED;
//       details.push(`Urgency: Account suspension threat`);
//     } else if (phraseLower.includes("immediate") || phraseLower.includes("act now")) {
//       score += THREAT_WEIGHTS.IMMEDIATE_ACTION;
//       details.push(`Urgency: Immediate action required`);
//     } else if (phraseLower.includes("24 hour")) {
//       score += THREAT_WEIGHTS.WITHIN_24_HOURS;
//       details.push(`Urgency: Action required within 24 hours`);
//     } else if (phraseLower.includes("final") && phraseLower.includes("warning")) {
//       score += THREAT_WEIGHTS.FINAL_WARNING;
//       details.push(`Urgency: Final warning issued`);
//     } else if (phraseLower.includes("legal")) {
//       score += THREAT_WEIGHTS.LEGAL_ACTION;
//       details.push(`Urgency: Legal action threatened`);
//     }
//   }

//   return { score, details };
// };

// /**
//  * Calculate Total Risk Score
//  * Sums all category scores and caps at 100
//  * 
//  * @param {object} threatBreakdown - Object with urgencyScore, domainRisk, contentIssues, sensitiveDataRisk, senderRisk
//  * @returns {number} Final risk score (0-100)
//  */
// const calculateTotalRiskScore = (threatBreakdown) => {
//   const {
//     urgencyScore = 0,
//     domainRisk = 0,
//     contentIssues = 0,
//     sensitiveDataRisk = 0,
//     senderRisk = 0,
//   } = threatBreakdown;

//   const total = urgencyScore + domainRisk + contentIssues + sensitiveDataRisk + senderRisk;

//   // Cap at 100
//   return Math.min(total, 100);
// };

// /**
//  * Determine Risk Level from Score
//  * 
//  * @param {number} riskScore - Risk score (0-100)
//  * @returns {string} Risk level (safe, suspicious, high risk, likely phishing)
//  */
// const getRiskLevel = (riskScore) => {
//   if (riskScore < 30) return "safe";
//   if (riskScore < 60) return "suspicious";
//   if (riskScore < 80) return "high risk";
//   return "likely phishing";
// };

// /**
//  * Get Recommendation Message
//  * 
//  * @param {string} riskLevel - Risk level
//  * @returns {string} Recommendation message
//  */
// const getRecommendation = (riskLevel) => {
//   return RECOMMENDATIONS[riskLevel] || RECOMMENDATIONS.safe;
// };

// /**
//  * Get Color for Risk Level
//  * 
//  * @param {string} riskLevel - Risk level
//  * @returns {string} Hex color code
//  */
// const getRiskLevelColor = (riskLevel) => {
//   switch (riskLevel) {
//     case "safe":
//       return "#10B981"; // Green
//     case "suspicious":
//       return "#F59E0B"; // Yellow
//     case "high risk":
//       return "#DC2626"; // Red
//     case "likely phishing":
//       return "#991B1B"; // Dark Red
//     default:
//       return "#6B7280"; // Gray
//   }
// };

// /**
//  * Complete Phishing Scoring Analysis
//  * This is the main function called from riskEngine.js
//  * 
//  * @param {object} senderAnalysis - Result from senderDomainAnalyzer
//  * @param {array} urlAnalyses - Array of URL analysis results
//  * @param {object} sensitiveInfoAnalysis - Result from sensitiveInfoDetector
//  * @param {object} contentAnalysis - Result from contentPatternAnalyzer
//  * @returns {object} Complete scoring result with all components
//  */
// const scoreEmail = (
//   senderAnalysis,
//   urlAnalyses,
//   sensitiveInfoAnalysis,
//   contentAnalysis
// ) => {
//   // Calculate all threat categories
//   const sensitiveDataResult = calculateSensitiveDataRisk(sensitiveInfoAnalysis);
//   const domainResult = calculateDomainRisk(senderAnalysis);
//   const urlResult = calculateURLRisk(urlAnalyses);
//   const contentQualityResult = calculateContentIssues(contentAnalysis);
//   const scamResult = calculateScamPatternScore(contentAnalysis);
//   const qualityResult = calculateQualityScore(contentAnalysis);
//   const urgencyResult = calculateUrgencyScore(contentAnalysis);

//   // Build threat breakdown
//   // Combine related threats into categories
//   const threatBreakdown = {
//     urgencyScore: urgencyResult.score + scamResult.score,
//     domainRisk: domainResult.score + urlResult.score,
//     contentIssues: contentQualityResult.score + qualityResult.score,
//     sensitiveDataRisk: sensitiveDataResult.score,
//     senderRisk: domainResult.score, // Already counted in domainRisk
//   };

//   // Actually, let's not double count. Let's restructure this.
//   // The user specified: urgencyScore, domainRisk, contentIssues, sensitiveDataRisk, senderRisk
//   // I should map components to these categories properly
  
//   const threatBreakdown2 = {
//     urgencyScore: urgencyResult.score,
//     domainRisk: domainResult.score + urlResult.score,
//     contentIssues: contentQualityResult.score + qualityResult.score,
//     sensitiveDataRisk: sensitiveDataResult.score,
//     senderRisk: scamResult.score, // Scam patterns indicate a suspicious sender
//   };

//   // Calculate final risk score
//   const riskScore = calculateTotalRiskScore(threatBreakdown2);

//   // Determine risk level
//   const riskLevel = getRiskLevel(riskScore);

//   // Get recommendation
//   const recommendation = getRecommendation(riskLevel);

//   // Get color
//   const color = getRiskLevelColor(riskLevel);

//   return {
//     riskScore,
//     riskLevel,
//     recommendation,
//     color,
//     threatBreakdown: threatBreakdown2,
//     details: {
//       urgency: urgencyResult,
//       domain: domainResult,
//       url: urlResult,
//       sensitiveData: sensitiveDataResult,
//       contentQuality: contentQualityResult,
//       scams: scamResult,
//       quality: qualityResult,
//     },
//   };
// };

// module.exports = {
//   THREAT_WEIGHTS,
//   RISK_LEVELS,
//   RECOMMENDATIONS,
//   calculateSensitiveDataRisk,
//   calculateDomainRisk,
//   calculateURLRisk,
//   calculateContentIssues,
//   calculateScamPatternScore,
//   calculateQualityScore,
//   calculateUrgencyScore,
//   calculateTotalRiskScore,
//   getRiskLevel,
//   getRecommendation,
//   getRiskLevelColor,
//   scoreEmail,
// };

/**
 * Centralized Phishing Risk Scoring System v3.1
 *
 * This is the single source of truth for all risk scoring.
 * Every threat detected contributes exact weights to categories.
 * UI displays numbers directly from threatBreakdown object.
 */

// ============================================================================
// THREAT WEIGHTS CONFIGURATION
// ============================================================================

const THREAT_WEIGHTS = {
  // Sensitive Data Requests (each request type)
  PASSWORD_REQUEST: 25,
  OTP_REQUEST: 25,
  PIN_REQUEST: 25,
  CREDIT_CARD_REQUEST: 25,
  BANK_ACCOUNT_REQUEST: 25,

  // URL Analysis
  SUSPICIOUS_URL: 20,
  DOMAIN_MISMATCH: 20,
  MISLEADING_KEYWORD: 15,
  EXCESSIVE_HYPHENS: 10,
  IP_ADDRESS_URL: 20,
  URL_SHORTENER: 15,

  // Sender Analysis
  FREE_EMAIL_COMPANY_CLAIM: 20,
  BRAND_IMPERSONATION: 25,
  TYPOSQUATTING_DOMAIN: 20,
  REPLY_TO_MISMATCH: 25,

  // Content Analysis
  GENERIC_GREETING: 5,
  EXCESSIVE_SPACING: 5,
  EXCESSIVE_PUNCTUATION: 5,
  ALL_CAPS_SECTIONS: 5,

  // Urgency Analysis
  ACCOUNT_SUSPENDED: 10,
  IMMEDIATE_ACTION: 10,
  WITHIN_24_HOURS: 10,
  SHORT_WINDOW: 22,
  FINAL_WARNING: 10,
  LEGAL_ACTION: 10,

  // Scam / Bait Analysis
  SCAM_BAIT: 0, // dynamic, uses riskContribution directly
  ADVANCE_FEE_FRAUD: 0, // dynamic, uses detector's own score
};

// ============================================================================
// RISK LEVEL DEFINITIONS
// ============================================================================

const RISK_LEVELS = {
  SAFE: { range: [0, 29], label: "safe", color: "#10B981" },
  SUSPICIOUS: { range: [30, 59], label: "suspicious", color: "#F59E0B" },
  HIGH_RISK: { range: [60, 79], label: "high risk", color: "#DC2626" },
  LIKELY_PHISHING: { range: [80, 100], label: "likely phishing", color: "#991B1B" },
};

// ============================================================================
// RECOMMENDATION MESSAGES
// ============================================================================

const RECOMMENDATIONS = {
  safe:
    "This email appears legitimate. Continue using normal caution.",
  suspicious:
    "This email contains some suspicious indicators. Verify the sender before taking action.",
  "high risk":
    "This email shows multiple phishing indicators. Avoid clicking links or sharing information.",
  "likely phishing":
    "This email is highly likely to be a phishing attempt. Do not click links, open attachments, or provide sensitive information.",
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

const calculateSensitiveDataRisk = (sensitiveInfoAnalysis) => {
  let score = 0;
  const details = [];

  if (!sensitiveInfoAnalysis || !sensitiveInfoAnalysis.detectedTypes) {
    return { score: 0, details: [] };
  }

  const types = sensitiveInfoAnalysis.detectedTypes;

  if (types.includes("password")) {
    score += THREAT_WEIGHTS.PASSWORD_REQUEST;
    details.push("Password request detected");
  }
  if (types.includes("otp")) {
    score += THREAT_WEIGHTS.OTP_REQUEST;
    details.push("OTP request detected");
  }
  if (types.includes("pin")) {
    score += THREAT_WEIGHTS.PIN_REQUEST;
    details.push("PIN request detected");
  }
  if (types.includes("creditCard")) {
    score += THREAT_WEIGHTS.CREDIT_CARD_REQUEST;
    details.push("Credit card details request");
  }
  if (types.includes("bankAccount")) {
    score += THREAT_WEIGHTS.BANK_ACCOUNT_REQUEST;
    details.push("Bank account details request");
  }

  return { score, details };
};

const calculateDomainRisk = (senderAnalysis) => {
  let score = 0;
  const details = [];

  if (!senderAnalysis) {
    return { score: 0, details: [] };
  }

  if (senderAnalysis.isFreeProvider && senderAnalysis.brandMismatch && senderAnalysis.brandMismatch.length > 0) {
    score += THREAT_WEIGHTS.FREE_EMAIL_COMPANY_CLAIM;
    details.push("Free email provider claiming company identity");
  }

  if (senderAnalysis.brandMismatch && senderAnalysis.brandMismatch.length > 0) {
    score += THREAT_WEIGHTS.BRAND_IMPERSONATION;
    details.push(`Brand impersonation: ${senderAnalysis.brandMismatch.join(", ")}`);
  }

  if (senderAnalysis.domain && senderAnalysis.risks) {
    const riskText = senderAnalysis.risks.join(" ").toLowerCase();
    if (riskText.includes("typo") || riskText.includes("similar") || riskText.includes("misspell")) {
      score += THREAT_WEIGHTS.TYPOSQUATTING_DOMAIN;
      details.push("Typosquatting domain detected");
    }
  }

  // Reply-To mismatch
  if (senderAnalysis.replyToMismatch && senderAnalysis.replyToMismatch.hasMismatch) {
    score += THREAT_WEIGHTS.REPLY_TO_MISMATCH;
    details.push(
      `Reply-To domain differs from sender domain (${senderAnalysis.replyToMismatch.replyToDomain} vs ${senderAnalysis.replyToMismatch.fromDomain})`
    );
  }

  return { score, details };
};

const calculateURLRisk = (urlAnalyses) => {
  let score = 0;
  const details = [];

  if (!urlAnalyses || urlAnalyses.length === 0) {
    return { score: 0, details: [] };
  }

  for (const analysis of urlAnalyses) {
    if (!analysis) continue;

    const riskText = (analysis.risks || []).join(" ").toLowerCase();

    if (riskText.includes("ip address")) {
      score += THREAT_WEIGHTS.IP_ADDRESS_URL;
      details.push(`IP address used instead of domain`);
    }

    if (riskText.includes("shortened")) {
      score += THREAT_WEIGHTS.URL_SHORTENER;
      details.push(`Shortened URL detected`);
    }

    if (riskText.includes("domain differ")) {
      score += THREAT_WEIGHTS.DOMAIN_MISMATCH;
      details.push(`Domain mismatch in URL`);
    }

    if (riskText.includes("misleading keyword")) {
      score += THREAT_WEIGHTS.MISLEADING_KEYWORD;
      details.push(`Misleading keywords in URL`);
    }

    if (riskText.includes("excessive hyphens") || riskText.includes("hyphens in domain")) {
      score += THREAT_WEIGHTS.EXCESSIVE_HYPHENS;
      details.push(`URL has excessive hyphens`);
    }

    if (riskText.includes("obfuscation") || riskText.includes("typosquatting")) {
      score += THREAT_WEIGHTS.SUSPICIOUS_URL;
      details.push(`Suspicious URL pattern detected`);
    }

    if (analysis.isSuspicious && score === 0) {
      score += THREAT_WEIGHTS.SUSPICIOUS_URL;
      details.push(`Suspicious URL: ${analysis.url}`);
    }
  }

  return { score, details };
};

const calculateContentIssues = (contentAnalysis) => {
  let score = 0;
  const details = [];

  if (!contentAnalysis || !contentAnalysis.quality) {
    return { score: 0, details: [] };
  }

  const quality = contentAnalysis.quality;
  const issues = quality.issues || [];

  for (const issue of issues) {
    const issueLower = issue.toLowerCase();

    if (issueLower.includes("generic greeting")) {
      score += THREAT_WEIGHTS.GENERIC_GREETING;
      details.push("Generic greeting detected");
    } else if (issueLower.includes("excessive spacing")) {
      score += THREAT_WEIGHTS.EXCESSIVE_SPACING;
      details.push("Excessive spacing in email");
    } else if (issueLower.includes("excessive punctuation")) {
      score += THREAT_WEIGHTS.EXCESSIVE_PUNCTUATION;
      details.push("Excessive punctuation detected");
    } else if (issueLower.includes("all caps")) {
      score += THREAT_WEIGHTS.ALL_CAPS_SECTIONS;
      details.push("ALL CAPS sections detected");
    }
  }

  return { score, details };
};

/**
 * Calculate Scam/Bait Pattern Score
 * Covers lottery, inheritance, free gifts, money promises, AND advance-fee fraud.
 * This represents "is the email baiting the victim with a fake reward/offer".
 */
const calculateScamPatternScore = (contentAnalysis) => {
  let score = 0;
  const details = [];

  if (!contentAnalysis || !contentAnalysis.scams) {
    return { score: 0, details: [] };
  }

  const scams = contentAnalysis.scams;
  const patterns = scams.patterns || [];

  for (const pattern of patterns) {
    const phrase = pattern.phrase || "";
    const category = pattern.category || "";

    if (phrase) {
      details.push(`${category}: "${phrase}"`);
      score += pattern.riskContribution || 10;
    }
  }

  return { score: Math.min(score, 60), details };
};

const calculateQualityScore = (contentAnalysis) => {
  if (!contentAnalysis || !contentAnalysis.quality) {
    return { score: 0, details: [] };
  }

  const quality = contentAnalysis.quality;
  return {
    score: quality.riskScore || 0,
    details: quality.issues || [],
  };
};

const calculateUrgencyScore = (contentAnalysis) => {
  let score = 0;
  const details = [];

  if (!contentAnalysis || !contentAnalysis.urgency) {
    return { score: 0, details: [] };
  }

  const urgency = contentAnalysis.urgency;
  const triggers = urgency.triggers || [];

  for (const trigger of triggers) {
    const phrase = trigger.phrase || "";
    const phraseLower = phrase.toLowerCase();
    const category = trigger.category || "";

    if (category === "shortWindow") {
      score += THREAT_WEIGHTS.SHORT_WINDOW;
      details.push(`Urgency: Extremely short response window ("${phrase}")`);
    } else if (phraseLower.includes("account") && phraseLower.includes("suspend")) {
      score += THREAT_WEIGHTS.ACCOUNT_SUSPENDED;
      details.push(`Urgency: Account suspension threat`);
    } else if (phraseLower.includes("immediate") || phraseLower.includes("act now")) {
      score += THREAT_WEIGHTS.IMMEDIATE_ACTION;
      details.push(`Urgency: Immediate action required`);
    } else if (phraseLower.includes("24 hour")) {
      score += THREAT_WEIGHTS.WITHIN_24_HOURS;
      details.push(`Urgency: Action required within 24 hours`);
    } else if (phraseLower.includes("final") && phraseLower.includes("warning")) {
      score += THREAT_WEIGHTS.FINAL_WARNING;
      details.push(`Urgency: Final warning issued`);
    } else if (phraseLower.includes("legal")) {
      score += THREAT_WEIGHTS.LEGAL_ACTION;
      details.push(`Urgency: Legal action threatened`);
    } else if (phraseLower.includes("cancelled")) {
      score += THREAT_WEIGHTS.FINAL_WARNING;
      details.push(`Urgency: Offer/benefit cancellation threat`);
    }
  }

  return { score, details };
};

/**
 * Calculate Advance-Fee Fraud Score
 * Uses the dedicated advanceFeeDetector result directly.
 */
const calculateAdvanceFeeScore = (advanceFeeResult) => {
  if (!advanceFeeResult || !advanceFeeResult.isDetected) {
    return { score: 0, details: [] };
  }
  return {
    score: advanceFeeResult.riskScore,
    details: advanceFeeResult.details,
  };
};

const calculateTotalRiskScore = (threatBreakdown) => {
  const {
    urgencyScore = 0,
    domainRisk = 0,
    contentIssues = 0,
    sensitiveDataRisk = 0,
    senderRisk = 0,
  } = threatBreakdown;

  const total = urgencyScore + domainRisk + contentIssues + sensitiveDataRisk + senderRisk;

  return Math.min(total, 100);
};

const getRiskLevel = (riskScore) => {
  if (riskScore < 30) return "safe";
  if (riskScore < 60) return "suspicious";
  if (riskScore < 80) return "high risk";
  return "likely phishing";
};

const getRecommendation = (riskLevel) => {
  return RECOMMENDATIONS[riskLevel] || RECOMMENDATIONS.safe;
};

const getRiskLevelColor = (riskLevel) => {
  switch (riskLevel) {
    case "safe":
      return "#10B981";
    case "suspicious":
      return "#F59E0B";
    case "high risk":
      return "#DC2626";
    case "likely phishing":
      return "#991B1B";
    default:
      return "#6B7280";
  }
};

/**
 * Complete Phishing Scoring Analysis
 * This is the main function called from riskEngine.js
 *
 * @param {object} senderAnalysis - Result from senderDomainAnalyzer
 * @param {array} urlAnalyses - Array of URL analysis results
 * @param {object} sensitiveInfoAnalysis - Result from sensitiveInfoDetector
 * @param {object} contentAnalysis - Result from contentPatternAnalyzer
 * @param {object} advanceFeeResult - Result from advanceFeeDetector
 * @returns {object} Complete scoring result with all components
 */
const scoreEmail = (
  senderAnalysis,
  urlAnalyses,
  sensitiveInfoAnalysis,
  contentAnalysis,
  advanceFeeResult = null
) => {
  const sensitiveDataResult = calculateSensitiveDataRisk(sensitiveInfoAnalysis);
  const domainResult = calculateDomainRisk(senderAnalysis);
  const urlResult = calculateURLRisk(urlAnalyses);
  const contentQualityResult = calculateContentIssues(contentAnalysis);
  const scamResult = calculateScamPatternScore(contentAnalysis);
  const qualityResult = calculateQualityScore(contentAnalysis);
  const urgencyResult = calculateUrgencyScore(contentAnalysis);
  const advanceFeeScoreResult = calculateAdvanceFeeScore(advanceFeeResult);

  // Single, clean threat breakdown — no dead/duplicate objects.
  // Scam-bait patterns (lottery, fake offers, advance-fee asks) now
  // live under urgencyScore since they represent manipulation tactics,
  // not literal sender-identity risk.
  const threatBreakdown = {
    urgencyScore: urgencyResult.score + scamResult.score + advanceFeeScoreResult.score,
    domainRisk: domainResult.score + urlResult.score,
    contentIssues: contentQualityResult.score + qualityResult.score,
    sensitiveDataRisk: sensitiveDataResult.score,
    senderRisk: domainResult.score > 0 ? Math.round(domainResult.score * 0.3) : 0,
  };

  const riskScore = calculateTotalRiskScore(threatBreakdown);
  const riskLevel = getRiskLevel(riskScore);
  const recommendation = getRecommendation(riskLevel);
  const color = getRiskLevelColor(riskLevel);

  return {
    riskScore,
    riskLevel,
    recommendation,
    color,
    threatBreakdown,
    details: {
      urgency: urgencyResult,
      domain: domainResult,
      url: urlResult,
      sensitiveData: sensitiveDataResult,
      contentQuality: contentQualityResult,
      scams: scamResult,
      quality: qualityResult,
      advanceFee: advanceFeeScoreResult,
    },
  };
};

module.exports = {
  THREAT_WEIGHTS,
  RISK_LEVELS,
  RECOMMENDATIONS,
  calculateSensitiveDataRisk,
  calculateDomainRisk,
  calculateURLRisk,
  calculateContentIssues,
  calculateScamPatternScore,
  calculateQualityScore,
  calculateUrgencyScore,
  calculateAdvanceFeeScore,
  calculateTotalRiskScore,
  getRiskLevel,
  getRecommendation,
  getRiskLevelColor,
  scoreEmail,
};