// Sensitive information patterns
const SENSITIVE_INFO_PATTERNS = {
  passwords: {
    patterns: [
      /(?:change|reset|update|confirm|enter|verify)[\s:]*(?:your\s+)?(?:password|passwd|pwd)/gi,
      /(?:password|passwd|pwd)[\s:]*(?:required|needed|now|immediately)/gi,
      /re[?-]*enter[\s:]*(?:your\s+)?password/gi,
    ],
    keywords: ["password", "passwd", "pwd"],
    risk: 35,
    description: "Password information request detected",
  },
  otp: {
    patterns: [
      /(?:enter|provide|verify)[\s:]*(?:your\s+)?(?:otp|one[- ]?time[\s]?(?:password|pin|code))/gi,
      /(?:otp|one[- ]?time[\s]?(?:password|pin|code))[\s:]*(?:required|needed|now)/gi,
    ],
    keywords: ["otp", "one-time password", "one time code"],
    risk: 40,
    description: "One-time password (OTP) request detected",
  },
  pin: {
    patterns: [
      /(?:enter|provide|verify)[\s:]*(?:your\s+)?(?:pin|personal\s+identification\s+number)/gi,
      /(?:pin|personal\s+identification\s+number)[\s:]*(?:required|needed|now)/gi,
    ],
    keywords: ["pin", "personal identification number"],
    risk: 35,
    description: "PIN request detected",
  },
  cvv: {
    patterns: [
      /(?:enter|provide|verify)[\s:]*(?:your\s+)?(?:cvv|cv2|cvc|security\s+code)/gi,
      /(?:cvv|cv2|cvc|security\s+code)[\s:]*(?:required|needed|now)/gi,
    ],
    keywords: ["cvv", "cv2", "cvc", "security code"],
    risk: 40,
    description: "Credit card CVV/security code request detected",
  },
  creditCard: {
    patterns: [
      /(?:enter|provide|verify)[\s:]*(?:your\s+)?(?:credit|debit|card)[\s]?(?:card\s+)?(?:number|details|information)/gi,
      /(?:credit|debit)[\s]?card[\s]?(?:number|details|information)[\s:]*(?:required|needed)/gi,
      /(?:card[\s]?number|card[\s]?details)[\s:]*(?:\d\s*){4,}/gi,
    ],
    keywords: ["credit card", "debit card", "card number", "card details"],
    risk: 45,
    description: "Credit/debit card information request detected",
  },
  bankAccount: {
    patterns: [
      /(?:enter|provide|verify)[\s:]*(?:your\s+)?(?:bank\s+)?(?:account|routing)[\s]?(?:account\s+)?(?:number|details)/gi,
      /(?:bank\s+)?(?:account|routing)[\s]?(?:number|details)[\s:]*(?:required|needed)/gi,
      /routing\s+number[\s:]*required/gi,
      /account[\s]?number[\s:]*(?:for\s+)?(?:verification|confirmation)/gi,
    ],
    keywords: ["bank account", "routing number", "account number", "bank details"],
    risk: 45,
    description: "Bank account information request detected",
  },
  ssn: {
    patterns: [
      /(?:social[\s]?security|ssn|ss#)[\s:]*(?:number|required|verification)/gi,
      /(?:provide|verify|enter)[\s:]*(?:your\s+)?(?:social[\s]?security|ssn)[\s]?number/gi,
    ],
    keywords: ["social security", "ssn", "ss#"],
    risk: 50,
    description: "Social Security Number request detected",
  },
  personalID: {
    patterns: [
      /(?:driver|drivers?|state\s+id|passport|national\s+id)[\s:]*(?:number|information)/gi,
      /identification[\s]?(?:number|information|document)[\s:]*(?:required|needed)/gi,
    ],
    keywords: ["driver license", "passport", "national id", "identification"],
    risk: 40,
    description: "Government ID information request detected",
  },
  dob: {
    patterns: [
      /(?:date[\s]?of[\s]?birth|dob|birth\s+date)[\s:]*(?:required|needed|verification)/gi,
      /(?:provide|verify|enter)[\s:]*(?:your\s+)?(?:date[\s]?of[\s]?birth|dob)/gi,
    ],
    keywords: ["date of birth", "dob", "birth date"],
    risk: 25,
    description: "Date of birth request detected",
  },
};

// Detect sensitive information requests
const detectSensitiveInfo = (emailContent) => {
  const results = {
    hasSensitiveRequests: false,
    detectedTypes: [],
    riskScore: 0,
    details: [],
  };

  const contentLower = emailContent.toLowerCase();

  for (const [type, info] of Object.entries(SENSITIVE_INFO_PATTERNS)) {
    let foundMatch = false;

    // Check patterns
    for (const pattern of info.patterns) {
      if (pattern.test(emailContent)) {
        foundMatch = true;
        break;
      }
    }

    // Check keywords
    if (!foundMatch) {
      const keywordMatch = info.keywords.some(kw => contentLower.includes(kw));
      if (keywordMatch) {
        // Verify it's in a request context
        const contextPatterns = /(?:provide|enter|verify|confirm|update|submit|send|give|share)/gi;
        const hasContext = contextPatterns.test(emailContent);
        if (hasContext) {
          foundMatch = true;
        }
      }
    }

    if (foundMatch) {
      results.hasSensitiveRequests = true;
      results.detectedTypes.push(type);
      results.riskScore += info.risk;
      results.details.push({
        type,
        description: info.description,
        riskContribution: info.risk,
      });
    }
  }

  // Cap risk at 100
  results.riskScore = Math.min(results.riskScore, 100);

  return results;
};

// Generate explanation for detected sensitive requests
const explainSensitiveRequests = (detectedTypes) => {
  if (detectedTypes.length === 0) return null;

  const typeExplanations = {
    passwords: "Legitimate companies never ask for passwords via email",
    otp: "Never share your one-time password with anyone",
    pin: "Your PIN should remain confidential - never share it",
    cvv: "Legitimate merchants never request CVV via email",
    creditCard: "Real banks/merchants never ask for full card details via email",
    bankAccount: "Banks never request account numbers via email",
    ssn: "Government agencies never request SSN via unsecured email",
    personalID: "Never send government-issued ID copies via email",
    dob: "Be cautious - DOB combined with other info can enable identity theft",
  };

  return detectedTypes.map(type => typeExplanations[type] || `Be cautious about ${type}`);
};

module.exports = {
  SENSITIVE_INFO_PATTERNS,
  detectSensitiveInfo,
  explainSensitiveRequests,
};
