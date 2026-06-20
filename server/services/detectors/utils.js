/**
 * Utility Functions for Phishing Detection
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used for typosquatting detection and fuzzy matching
 * 
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = Array.from({ length: str2.length + 1 }, (_, i) =>
    Array.from({ length: str1.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2[i - 1] === str1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
};

/**
 * Extract domain from URL or email address
 * 
 * @param {string} str - URL or email to parse
 * @returns {string|null} - Extracted domain or null
 */
const extractDomain = (str) => {
  try {
    if (!str) return null;
    
    if (str.includes("@")) {
      return str.split("@")[1].toLowerCase().trim();
    }
    
    if (!str.startsWith("http")) {
      str = "http://" + str;
    }
    
    const urlObj = new URL(str);
    return urlObj.hostname.toLowerCase();
  } catch {
    return null;
  }
};

/**
 * Normalize string for comparison
 * Removes special characters and lowercases
 * 
 * @param {string} str - String to normalize
 * @returns {string} - Normalized string
 */
const normalizeString = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
};

/**
 * Check if text contains any of the keywords (case-insensitive)
 * 
 * @param {string} text - Text to search in
 * @param {array} keywords - Keywords to search for
 * @returns {boolean} - True if any keyword found
 */
const containsKeywords = (text, keywords) => {
  const textLower = text.toLowerCase();
  return keywords.some(keyword => textLower.includes(keyword));
};

/**
 * Check if any regex pattern matches the text
 * 
 * @param {string} text - Text to test
 * @param {array} patterns - Array of RegExp patterns
 * @returns {boolean} - True if any pattern matches
 */
const matchesAnyPattern = (text, patterns) => {
  return patterns.some(pattern => pattern.test(text));
};

/**
 * Extract numeric value from string (first number found)
 * 
 * @param {string} str - String to extract from
 * @returns {number|null} - First number found or null
 */
const extractNumber = (str) => {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

/**
 * Truncate string to max length with ellipsis
 * 
 * @param {string} str - String to truncate
 * @param {number} maxLen - Maximum length
 * @returns {string} - Truncated string
 */
const truncateString = (str, maxLen = 50) => {
  if (str.length > maxLen) {
    return str.substring(0, maxLen - 3) + "...";
  }
  return str;
};

module.exports = {
  levenshteinDistance,
  extractDomain,
  normalizeString,
  containsKeywords,
  matchesAnyPattern,
  extractNumber,
  truncateString,
};
