// const { getBrandByKeyword, getBrandByDomain } = require("./brandDatabase");

// const FREE_EMAIL_PROVIDERS = [
//   "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
//   "aol.com", "mail.com", "protonmail.com", "tutanota.com",
//   "yandex.com", "mail.ru", "zoho.com", "icloud.com",
// ];

// // Extract domain from email address
// const extractSenderDomain = (email) => {
//   try {
//     if (!email || !email.includes("@")) return null;
//     return email.split("@")[1].toLowerCase().trim();
//   } catch {
//     return null;
//   }
// };

// // Check if domain is a free email provider
// const isFreeEmailProvider = (domain) => {
//   return FREE_EMAIL_PROVIDERS.includes(domain);
// };

// // Analyze sender domain for phishing indicators
// const analyzeSenderDomain = (email, emailContent) => {
//   const results = {
//     email,
//     domain: null,
//     isFreeProvider: false,
//     brandMismatch: [],
//     risks: [],
//     riskScore: 0,
//   };

//   const domain = extractSenderDomain(email);
//   if (!domain) return results;

//   results.domain = domain;

//   // Check if free email provider
//   if (isFreeEmailProvider(domain)) {
//     results.isFreeProvider = true;
    
//     // Extract brand mentions from email content
//     const mentionedBrands = getBrandByKeyword(emailContent);
    
//     if (mentionedBrands.length > 0) {
//       mentionedBrands.forEach(brand => {
//         results.brandMismatch.push(brand.name);
//         results.risks.push(
//           `Email mentions "${brand.name}" but is sent from free email provider "${domain}"`
//         );
//         results.riskScore += 25;
//       });
//     }
    
//     // Check for official-sounding phrases
//     const officialPhrases = [
//       "verify your account",
//       "confirm your identity",
//       "security alert",
//       "urgent action required",
//       "update your profile",
//       "banking services",
//       "financial information",
//     ];
    
//     const emailLower = emailContent.toLowerCase();
//     const hasOfficialPhrase = officialPhrases.some(phrase => emailLower.includes(phrase));
    
//     if (hasOfficialPhrase) {
//       results.risks.push("Free email provider used with official-sounding language");
//       results.riskScore += 20;
//     }
//   }

//   // Check domain reputation against known brands
//   const senderBrand = getBrandByDomain(domain);
//   if (senderBrand) {
//     // Legitimate brand domain - reduce risk
//     results.riskScore = Math.max(0, results.riskScore - 10);
//   }

//   return results;
// };

// module.exports = {
//   extractSenderDomain,
//   isFreeEmailProvider,
//   analyzeSenderDomain,
//   FREE_EMAIL_PROVIDERS,
// };
 

const { getBrandByKeyword, getBrandByDomain } = require("./brandDatabase");

const FREE_EMAIL_PROVIDERS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "aol.com", "mail.com", "protonmail.com", "tutanota.com",
  "yandex.com", "mail.ru", "zoho.com", "icloud.com",
];

// Extract domain from email address
const extractSenderDomain = (email) => {
  try {
    if (!email || !email.includes("@")) return null;
    return email.split("@")[1].toLowerCase().trim();
  } catch {
    return null;
  }
};

// Check if domain is a free email provider
const isFreeEmailProvider = (domain) => {
  return FREE_EMAIL_PROVIDERS.includes(domain);
};

/**
 * Check if Reply-To domain differs from the From domain.
 * Classic phishing technique: From looks legitimate (or free email),
 * but replies are routed to a completely different, often suspicious domain.
 *
 * @param {string} fromEmail - The From address
 * @param {string} replyToEmail - The Reply-To address (optional)
 * @returns {object} { hasMismatch, fromDomain, replyToDomain, risk }
 */
const checkReplyToMismatch = (fromEmail, replyToEmail) => {
  const result = {
    hasMismatch: false,
    fromDomain: null,
    replyToDomain: null,
    risk: 0,
  };

  if (!replyToEmail) return result;

  const fromDomain = extractSenderDomain(fromEmail);
  const replyToDomain = extractSenderDomain(replyToEmail);

  result.fromDomain = fromDomain;
  result.replyToDomain = replyToDomain;

  if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
    result.hasMismatch = true;
    result.risk = 25;
  }

  return result;
};

// Analyze sender domain for phishing indicators
const analyzeSenderDomain = (email, emailContent, replyToEmail = null) => {
  const results = {
    email,
    domain: null,
    isFreeProvider: false,
    brandMismatch: [],
    replyToMismatch: null,
    risks: [],
    riskScore: 0,
  };

  const domain = extractSenderDomain(email);
  if (!domain) return results;

  results.domain = domain;

  // Check if free email provider
  if (isFreeEmailProvider(domain)) {
    results.isFreeProvider = true;

    // Extract brand mentions from email content
    const mentionedBrands = getBrandByKeyword(emailContent);

    if (mentionedBrands.length > 0) {
      mentionedBrands.forEach(brand => {
        results.brandMismatch.push(brand.name);
        results.risks.push(
          `Email mentions "${brand.name}" but is sent from free email provider "${domain}"`
        );
        results.riskScore += 25;
      });
    }

    // Check for official-sounding phrases
    const officialPhrases = [
      "verify your account",
      "confirm your identity",
      "security alert",
      "urgent action required",
      "update your profile",
      "banking services",
      "financial information",
      "offer letter",
      "selected for",
    ];

    const emailLower = emailContent.toLowerCase();
    const hasOfficialPhrase = officialPhrases.some(phrase => emailLower.includes(phrase));

    if (hasOfficialPhrase) {
      results.risks.push("Free email provider used with official-sounding language");
      results.riskScore += 20;
    }
  }

  // Check Reply-To mismatch
  const replyToCheck = checkReplyToMismatch(email, replyToEmail);
  if (replyToCheck.hasMismatch) {
    results.replyToMismatch = replyToCheck;
    results.risks.push(
      `Reply-To domain ("${replyToCheck.replyToDomain}") differs from sender domain ("${replyToCheck.fromDomain}")`
    );
    results.riskScore += replyToCheck.risk;
  }

  // Check domain reputation against known brands
  const senderBrand = getBrandByDomain(domain);
  if (senderBrand) {
    // Legitimate brand domain - reduce risk
    results.riskScore = Math.max(0, results.riskScore - 10);
  }

  return results;
};

module.exports = {
  extractSenderDomain,
  isFreeEmailProvider,
  checkReplyToMismatch,
  analyzeSenderDomain,
  FREE_EMAIL_PROVIDERS,
};