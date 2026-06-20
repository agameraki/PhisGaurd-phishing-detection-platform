// // Advanced Phishing Detection Engine v3.0
// // Uses centralized scoring system for consistent threat evaluation

// const { analyzeSenderDomain, extractSenderDomain } = require("./detectors/senderDomainAnalyzer");
// const { extractURLs, analyzeURL, extractDomain } = require("./detectors/advancedURLAnalyzer");
// const { detectSensitiveInfo } = require("./detectors/sensitiveInfoDetector");
// const { analyzeAttachments } = require("./detectors/attachmentRiskAnalyzer");
// const { analyzeContentPatterns } = require("./detectors/contentPatternAnalyzer");
// const {
//   scoreEmail,
//   getRiskLevelColor,
//   getRecommendation,
// } = require("./scoringSystem");
// const { levenshteinDistance } = require("./detectors/utils");

// /**
//  * Main email analysis function
//  * @param {string} subject - Email subject
//  * @param {string} sender - Sender email address
//  * @param {string} content - Email body content
//  * @param {array} attachments - Optional array of attachment filenames
//  * @returns {object} Comprehensive phishing analysis result
//  */
// const analyzeEmail = (subject, sender, content, attachments = []) => {
//   try {
//     // 1. Analyze Sender Domain
//     const senderDomain = extractSenderDomain(sender);
//     const senderAnalysis = analyzeSenderDomain(sender, content);

//     // 2. Extract and Analyze URLs
//     const urls = extractURLs(content);
//     const urlAnalyses = urls.map(url => analyzeURL(url, senderDomain));

//     // 3. Detect Sensitive Information Requests
//     const sensitiveInfoAnalysis = detectSensitiveInfo(content);

//     // 4. Analyze Attachments
//     const attachmentAnalysis = analyzeAttachments(attachments);

//     // 5. Analyze Content Patterns
//     const contentAnalysis = analyzeContentPatterns(content + " " + subject);

//     // 6. Use centralized scoring system
//     const scoringResult = scoreEmail(
//       senderAnalysis,
//       urlAnalyses,
//       sensitiveInfoAnalysis,
//       contentAnalysis
//     );

//     // 7. Build Final Report
//     return {
//       // Core Results (from centralized scoring)
//       riskScore: scoringResult.riskScore,
//       riskLevel: scoringResult.riskLevel,
//       recommendation: scoringResult.recommendation,
//       color: scoringResult.color,

//       // Threat Breakdown (UI displays these directly)
//       threatBreakdown: scoringResult.threatBreakdown,

//       // Detailed breakdown for transparency
//       breakdown: scoringResult.details,

//       // Detailed Analysis
//       analysis: {
//         senderDomain: senderAnalysis,
//         urls: urlAnalyses,
//         sensitiveInfo: sensitiveInfoAnalysis,
//         contentPatterns: contentAnalysis,
//         attachments: attachmentAnalysis,
//       },

//       // Raw detections for debugging
//       detections: {
//         senderDomain,
//         urls,
//         sensitiveInfo: sensitiveInfoAnalysis,
//         attachments,
//       },
//     };
//   } catch (error) {
//     console.error("Error in analyzeEmail:", error);
//     // Return safe default on error
//     return {
//       riskScore: 0,
//       riskLevel: "safe",
//       recommendation: "Error analyzing email. Treat with caution.",
//       color: "#6B7280",
//       threatBreakdown: {
//         urgencyScore: 0,
//         domainRisk: 0,
//         contentIssues: 0,
//         sensitiveDataRisk: 0,
//         senderRisk: 0,
//       },
//       error: error.message,
//     };
//   }
// };


// module.exports = {
//   analyzeEmail,
// };
// Advanced Phishing Detection Engine v3.1
// Uses centralized scoring system for consistent threat evaluation

const { analyzeSenderDomain, extractSenderDomain } = require("./detectors/senderDomainAnalyzer");
const { extractURLs, analyzeURL, extractDomain } = require("./detectors/advancedURLAnalyzer");
const { detectSensitiveInfo } = require("./detectors/sensitiveInfoDetector");
const { analyzeAttachments } = require("./detectors/attachmentRiskAnalyzer");
const { analyzeContentPatterns } = require("./detectors/contentPatternAnalyzer");
const { detectAdvanceFeeFraud } = require("./detectors/advanceFeeDetector");
const {
  scoreEmail,
  getRiskLevelColor,
  getRecommendation,
} = require("./scoringSystem");

/**
 * Main email analysis function
 * @param {string} subject - Email subject
 * @param {string} sender - Sender email address (From header)
 * @param {string} content - Email body content
 * @param {array} attachments - Optional array of attachment filenames
 * @param {string} replyTo - Optional Reply-To email address
 * @returns {object} Comprehensive phishing analysis result
 */
const analyzeEmail = (subject, sender, content, attachments = [], replyTo = null) => {
  try {
    // 1. Analyze Sender Domain (now includes Reply-To mismatch check)
    const senderDomain = extractSenderDomain(sender);
    const senderAnalysis = analyzeSenderDomain(sender, content, replyTo);

    // 2. Extract and Analyze URLs
    const urls = extractURLs(content);
    const urlAnalyses = urls.map(url => analyzeURL(url, senderDomain));

    // 3. Detect Sensitive Information Requests
    const sensitiveInfoAnalysis = detectSensitiveInfo(content);

    // 4. Analyze Attachments
    const attachmentAnalysis = analyzeAttachments(attachments);

    // 5. Analyze Content Patterns (urgency, scams, quality)
    const contentAnalysis = analyzeContentPatterns(content + " " + subject);

    // 6. Detect Advance-Fee Fraud (offer + payment-to-unlock combo)
    const advanceFeeResult = detectAdvanceFeeFraud(content, subject);

    // 7. Use centralized scoring system
    const scoringResult = scoreEmail(
      senderAnalysis,
      urlAnalyses,
      sensitiveInfoAnalysis,
      contentAnalysis,
      advanceFeeResult
    );

    // 8. Build Final Report
    return {
      // Core Results (from centralized scoring)
      riskScore: scoringResult.riskScore,
      riskLevel: scoringResult.riskLevel,
      recommendation: scoringResult.recommendation,
      color: scoringResult.color,

      // Threat Breakdown (UI displays these directly)
      threatBreakdown: scoringResult.threatBreakdown,

      // Detailed breakdown for transparency
      breakdown: scoringResult.details,

      // Detailed Analysis
      analysis: {
        senderDomain: senderAnalysis,
        urls: urlAnalyses,
        sensitiveInfo: sensitiveInfoAnalysis,
        contentPatterns: contentAnalysis,
        attachments: attachmentAnalysis,
        advanceFee: advanceFeeResult,
      },

      // Raw detections for debugging
      detections: {
        senderDomain,
        urls,
        sensitiveInfo: sensitiveInfoAnalysis,
        attachments,
        replyTo,
      },
    };
  } catch (error) {
    console.error("Error in analyzeEmail:", error);
    return {
      riskScore: 0,
      riskLevel: "safe",
      recommendation: "Error analyzing email. Treat with caution.",
      color: "#6B7280",
      threatBreakdown: {
        urgencyScore: 0,
        domainRisk: 0,
        contentIssues: 0,
        sensitiveDataRisk: 0,
        senderRisk: 0,
      },
      error: error.message,
    };
  }
};

module.exports = {
  analyzeEmail,
};