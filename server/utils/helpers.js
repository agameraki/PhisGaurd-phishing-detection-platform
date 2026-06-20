// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get risk level color
const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case "safe":
      return "green";
    case "suspicious":
      return "amber";
    case "dangerous":
      return "red";
    default:
      return "gray";
  }
};

// Get risk level label
const getRiskLabel = (riskLevel) => {
  switch (riskLevel) {
    case "safe":
      return "Safe";
    case "suspicious":
      return "Suspicious";
    case "dangerous":
      return "Dangerous";
    default:
      return "Unknown";
  }
};

// Truncate text
const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Calculate percentage
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Generate random string
const generateRandomString = (length = 10) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

module.exports = {
  formatDate,
  getRiskColor,
  getRiskLabel,
  truncateText,
  calculatePercentage,
  isValidEmail,
  generateRandomString,
};