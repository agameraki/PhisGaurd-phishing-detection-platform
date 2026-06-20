// Advance-fee / "pay to unlock" scam detection
// Covers fake job offers, fake prizes, fake inheritance releases
// where the victim is asked to pay a fee to receive something

const FEE_REQUEST_PATTERNS = [
  { pattern: /verification\s+fee/i, risk: 30, label: "Verification fee request" },
  { pattern: /processing\s+fee/i, risk: 30, label: "Processing fee request" },
  { pattern: /registration\s+fee/i, risk: 25, label: "Registration fee request" },
  { pattern: /security\s+deposit/i, risk: 25, label: "Security deposit request" },
  { pattern: /administrative\s+fee/i, risk: 25, label: "Administrative fee request" },
  { pattern: /unlock\s+fee/i, risk: 35, label: "Unlock fee request" },
  { pattern: /pay\s+(?:a\s+|the\s+)?fee\s+to\s+(?:unlock|receive|claim|access)/i, risk: 35, label: "Pay-to-unlock scheme detected" },
  { pattern: /to\s+unlock[\s\S]{0,40}(?:pay|fee|₹|\$)/i, risk: 30, label: "Payment required to unlock content" },
];

const OFFER_BAIT_PATTERNS = [
  { pattern: /offer\s+letter/i },
  { pattern: /internship/i },
  { pattern: /selected\s+for/i },
  { pattern: /congratulations[!,.]?\s+you/i },
  { pattern: /scholarship/i },
];

/**
 * Detect advance-fee fraud: any email that combines a "you've been
 * selected / here's your offer" bait with a request for upfront payment.
 *
 * @param {string} content - Email body
 * @param {string} subject - Email subject
 * @returns {object} { isDetected, riskScore, details }
 */
const detectAdvanceFeeFraud = (content, subject = "") => {
  const fullText = `${subject} ${content}`;
  const result = {
    isDetected: false,
    riskScore: 0,
    details: [],
  };

  let feeScore = 0;
  FEE_REQUEST_PATTERNS.forEach(({ pattern, risk, label }) => {
    if (pattern.test(fullText)) {
      feeScore += risk;
      result.details.push(label);
    }
  });

  const baitMatches = OFFER_BAIT_PATTERNS.filter(({ pattern }) =>
    pattern.test(fullText)
  ).length;

  // Only treat as full advance-fee fraud if BOTH a fee request AND bait exist together
  if (feeScore > 0 && baitMatches > 0) {
    result.isDetected = true;
    result.riskScore = Math.min(feeScore + baitMatches * 5, 60);
    result.details.unshift(
      "Combines a job/prize offer with an upfront payment demand — classic advance-fee fraud pattern"
    );
  } else if (feeScore > 0) {
    // Fee request alone, no obvious bait — still worth flagging, less severe
    result.isDetected = true;
    result.riskScore = Math.min(feeScore, 35);
  }

  return result;
};

module.exports = { detectAdvanceFeeFraud, FEE_REQUEST_PATTERNS, OFFER_BAIT_PATTERNS };