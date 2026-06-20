const { extractURLs, analyzeURL, extractDomain } = require("./detectors/advancedURLAnalyzer");

// Analyze all links in email (wrapper for backward compatibility)
const analyzeLinks = (content) => {
  const urls = extractURLs(content);

  if (urls.length === 0) {
    return {
      links: [],
      totalLinks: 0,
      suspiciousLinks: 0,
      linkRiskScore: 0,
    };
  }

  // Analyze each URL with advanced detection
  const analyzedLinks = urls.map((url) => ({
    url,
    displayUrl: truncateUrl(url),
    isSuspicious: analyzeURL(url).isSuspicious,
    reasons: analyzeURL(url).risks,
    riskScore: analyzeURL(url).riskScore,
  }));

  const suspiciousLinks = analyzedLinks.filter((l) => l.isSuspicious);

  // Calculate total risk score (averaged to prevent inflation)
  let linkRiskScore = suspiciousLinks.length > 0
    ? suspiciousLinks.reduce((acc, link) => acc + link.riskScore, 0) / suspiciousLinks.length
    : 0;

  // Bonus for multiple suspicious links
  if (suspiciousLinks.length > 1) {
    linkRiskScore += Math.min(suspiciousLinks.length * 3, 15);
  }

  // Bonus for excessive total links
  if (urls.length > 5) {
    linkRiskScore += 10;
  }

  linkRiskScore = Math.min(linkRiskScore, 100);

  return {
    links: analyzedLinks,
    totalLinks: urls.length,
    suspiciousLinks: suspiciousLinks.length,
    linkRiskScore,
  };
};

// Analyze single link (backward compatibility wrapper)
const analyzeLink = (url) => {
  return analyzeURL(url);
};

// Truncate long URLs for display
const truncateUrl = (url) => {
  if (url.length > 50) {
    return url.substring(0, 47) + "...";
  }
  return url;
};

module.exports = {
  analyzeLinks,
  analyzeLink,
  extractLinks: extractURLs,
  extractDomain,
};