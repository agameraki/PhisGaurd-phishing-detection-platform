const { levenshteinDistance } = require("./utils");

// Suspicious TLDs
const SUSPICIOUS_TLDS = [
  ".xyz", ".top", ".click", ".loan", ".gq",
  ".ml", ".cf", ".tk", ".work", ".date",
  ".racing", ".download", ".stream", ".website",
  ".online", ".info", ".bid", ".review",
];

// Popular brands for typosquatting detection
const POPULAR_BRANDS = [
  "amazon", "paypal", "google", "microsoft", "apple",
  "netflix", "facebook", "instagram", "bank", "chase",
  "wellsfargo", "citibank", "yahoo", "outlook", "linkedin",
];

// Shortened URL services
const SHORTENED_URL_DOMAINS = [
  "bit.ly", "tinyurl.com", "goo.gl", "t.co",
  "ow.ly", "is.gd", "buff.ly", "short.link",
  "rebrand.ly", "cutt.ly", "shorturl.at",
];

// Extract all URLs from content
const extractURLs = (content) => {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+|www\.[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = content.match(urlRegex) || [];
  return [...new Set(matches.map(url => url.toLowerCase()))];
};

// Extract domain from URL
const extractDomain = (url) => {
  try {
    if (!url.startsWith("http")) {
      url = "http://" + url;
    }
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase();
  } catch {
    return null;
  }
};

// Check if URL is IP address
const isIPAddress = (domain) => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipRegex.test(domain);
};

// Count subdomains
const countSubdomains = (domain) => {
  if (!domain) return 0;
  return domain.split(".").length - 2; // Exclude TLD and root
};

// Check for excessive hyphens/numbers
const hasExcessiveHyphensOrNumbers = (domain) => {
  const hyphenCount = (domain.match(/-/g) || []).length;
  const numberCount = (domain.match(/\d/g) || []).length;
  const domainWithoutTld = domain.split(".")[0];
  
  return {
    hasExcessiveHyphens: hyphenCount > 2,
    hasTooManyNumbers: numberCount > 3,
    hyphenCount,
    numberCount,
  };
};

// Check for URL obfuscation techniques
const checkURLObfuscation = (url) => {
  const obfuscationChecks = {
    hasAtSign: url.includes("@"),
    hasPercentEncoding: /%[0-9A-F]{2}/i.test(url),
    hasUnicodeChars: /[^\x00-\x7F]/.test(url),
    hasHexEncoding: /&#x[0-9A-F]+;/i.test(url),
  };
  
  return {
    isObfuscated: Object.values(obfuscationChecks).some(v => v),
    details: obfuscationChecks,
  };
};

// Typosquatting detection using Levenshtein distance
const detectTyposquatting = (domain) => {
  const domainWithoutTld = domain.split(".")[0];

  // Split on hyphens too — "paypa1-verify" should check "paypa1" against brands,
  // not the whole hyphenated string which would never match anything.
  const segments = domainWithoutTld.split("-").filter(s => s.length > 0);
  const candidates = [domainWithoutTld, ...segments];

  let bestMatch = null;

  for (const candidate of candidates) {
    if (candidate.length <= 3) continue;

    for (const brand of POPULAR_BRANDS) {
      if (candidate === brand) continue;

      const distance = levenshteinDistance(candidate, brand);

      // Detect typos (distance <= 2)
      if (distance <= 2) {
        const confidence = 100 - (distance * 20);
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = {
            isSimilar: true,
            brand,
            distance,
            confidence,
            matchedSegment: candidate,
          };
        }
      }
    }
  }

  return bestMatch || { isSimilar: false };
};

// Comprehensive URL analysis
const analyzeURL = (url, senderDomain = null) => {
  const result = {
    url,
    domain: null,
    isSuspicious: false,
    riskScore: 0,
    risks: [],
  };

  const domain = extractDomain(url);
  if (!domain) {
    result.risks.push("Could not parse URL");
    result.riskScore += 20;
    return result;
  }

  result.domain = domain;

  // 1. IP Address Detection
  if (isIPAddress(domain)) {
    result.isSuspicious = true;
    result.risks.push("URL uses raw IP address instead of domain name");
    result.riskScore += 30;
  }

  // 2. Shortened URL Detection
  if (SHORTENED_URL_DOMAINS.some(d => domain.includes(d))) {
    result.isSuspicious = true;
    result.risks.push("Shortened URL - destination is hidden");
    result.riskScore += 25;
  }

  // 3. Suspicious TLD Detection
  const suspiciousTld = SUSPICIOUS_TLDS.find(tld => domain.endsWith(tld));
  if (suspiciousTld) {
    result.isSuspicious = true;
    result.risks.push(`Suspicious domain extension: ${suspiciousTld}`);
    result.riskScore += 20;
  }

  // 4. Excessive Subdomains
  const subdomainCount = countSubdomains(domain);
  if (subdomainCount > 4) {
    result.isSuspicious = true;
    result.risks.push(`Unusually long subdomain chain (${subdomainCount} levels)`);
    result.riskScore += 15;
  }

  // 5. Hyphens and Numbers
  const hyphenNumCheck = hasExcessiveHyphensOrNumbers(domain);
  if (hyphenNumCheck.hasExcessiveHyphens) {
    result.risks.push(`Excessive hyphens in domain (${hyphenNumCheck.hyphenCount})`);
    result.riskScore += 10;
  }
  if (hyphenNumCheck.hasTooManyNumbers) {
    result.risks.push(`Excessive numbers in domain (${hyphenNumCheck.numberCount})`);
    result.riskScore += 10;
  }

  // 6. URL Obfuscation
  const obfuscation = checkURLObfuscation(url);
  if (obfuscation.isObfuscated) {
    result.isSuspicious = true;
    const obfusDetails = Object.entries(obfuscation.details)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ");
    result.risks.push(`URL obfuscation detected: ${obfusDetails}`);
    result.riskScore += 25;
  }

  // 7. Typosquatting
  const typosquatResult = detectTyposquatting(domain);
  if (typosquatResult.isSimilar) {
    result.isSuspicious = true;
    result.risks.push(
      `Possible brand typosquatting: "${domain}" resembles "${typosquatResult.brand}" (similarity: ${typosquatResult.confidence}%)`
    );
    result.riskScore += 35;
  }

  // 8. Sender Domain Mismatch
  if (senderDomain && domain !== senderDomain) {
    // Ignore obvious third-party services
    const thirdPartyServices = ["bit.ly", "tinyurl.com", "goo.gl", "paypal.com"];
    if (!thirdPartyServices.some(service => domain.includes(service))) {
      result.risks.push(`URL domain differs from sender domain`);
      result.riskScore += 15;
    }
  }

  // 9. Misleading Keywords in Domain
  const misleadingKeywords = [
    "secure", "login", "verify", "update", "confirm",
    "account", "banking", "support", "paypal", "amazon",
    "apple", "microsoft", "google",
  ];
  
  const domainLower = domain.toLowerCase();
  const foundMisleading = misleadingKeywords.find(kw => 
    domainLower.includes(kw) && !domainLower.endsWith(kw.split(".")[0] + ".com")
  );
  
  if (foundMisleading) {
    result.risks.push(`Misleading keyword in domain: "${foundMisleading}"`);
    result.riskScore += 15;
  }

  // Cap score at 100
  result.riskScore = Math.min(result.riskScore, 100);

  return result;
};

module.exports = {
  extractURLs,
  extractDomain,
  analyzeURL,
  isIPAddress,
  countSubdomains,
  hasExcessiveHyphensOrNumbers,
  checkURLObfuscation,
  detectTyposquatting,
  SUSPICIOUS_TLDS,
  SHORTENED_URL_DOMAINS,
};
