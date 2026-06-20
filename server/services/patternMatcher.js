// Phishing pattern categories with weighted scores
const PHISHING_PATTERNS = [
  // Urgency patterns
  {
    category: "urgency",
    pattern: "urgent",
    score: 10,
    description: "Urgency trigger word detected",
  },
  {
    category: "urgency",
    pattern: "immediate action required",
    score: 15,
    description: "High urgency phrase detected",
  },
  {
    category: "urgency",
    pattern: "within 24 hours",
    score: 15,
    description: "Time pressure tactic detected",
  },
  {
    category: "urgency",
    pattern: "act now",
    score: 10,
    description: "Urgency call to action detected",
  },
  {
    category: "urgency",
    pattern: "limited time offer",
    score: 10,
    description: "Limited time pressure tactic detected",
  },
  {
    category: "urgency",
    pattern: "expires today",
    score: 15,
    description: "Expiry pressure tactic detected",
  },

  // Greed patterns
  {
    category: "greed",
    pattern: "you have won",
    score: 20,
    description: "Fake prize notification detected",
  },
  {
    category: "greed",
    pattern: "claim your reward",
    score: 20,
    description: "Fake reward claim detected",
  },
  {
    category: "greed",
    pattern: "free gift",
    score: 15,
    description: "Fake free gift offer detected",
  },
  {
    category: "greed",
    pattern: "guaranteed income",
    score: 20,
    description: "Unrealistic income promise detected",
  },
  {
    category: "greed",
    pattern: "work from home",
    score: 15,
    description: "Suspicious work from home offer detected",
  },
  {
    category: "greed",
    pattern: "million dollars",
    score: 20,
    description: "Unrealistic money offer detected",
  },

  // Fear patterns
  {
    category: "fear",
    pattern: "account suspended",
    score: 20,
    description: "Account suspension threat detected",
  },
  {
    category: "fear",
    pattern: "unauthorized access",
    score: 20,
    description: "Security breach fear tactic detected",
  },
  {
    category: "fear",
    pattern: "legal action",
    score: 15,
    description: "Legal threat tactic detected",
  },
  {
    category: "fear",
    pattern: "verify your identity",
    score: 15,
    description: "Identity verification phishing tactic detected",
  },
  {
    category: "fear",
    pattern: "suspicious activity",
    score: 15,
    description: "Suspicious activity fear tactic detected",
  },
  {
    category: "fear",
    pattern: "security alert",
    score: 15,
    description: "Fake security alert detected",
  },

  // Impersonation patterns
  {
    category: "impersonation",
    pattern: "dear customer",
    score: 10,
    description: "Generic greeting suggesting mass phishing email",
  },
  {
    category: "impersonation",
    pattern: "dear user",
    score: 10,
    description: "Generic greeting suggesting mass phishing email",
  },
  {
    category: "impersonation",
    pattern: "dear account holder",
    score: 10,
    description: "Generic greeting suggesting mass phishing email",
  },
  {
    category: "impersonation",
    pattern: "your account has been",
    score: 15,
    description: "Account impersonation tactic detected",
  },
  {
    category: "impersonation",
    pattern: "we have noticed",
    score: 10,
    description: "Impersonation of official organization detected",
  },
];

// Match patterns against email content
const matchPatterns = (subject, content) => {
  const fullText = `${subject} ${content}`.toLowerCase();
  const matched = [];
  const seenPatterns = new Set();

  PHISHING_PATTERNS.forEach((item) => {
    if (
      fullText.includes(item.pattern) &&
      !seenPatterns.has(item.pattern)
    ) {
      matched.push({
        category: item.category,
        pattern: item.pattern,
        score: item.score,
        description: item.description,
      });
      seenPatterns.add(item.pattern);
    }
  });

  // Group by category
  const grouped = matched.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Total pattern score
  const totalPatternScore = Math.min(
    matched.reduce((acc, item) => acc + item.score, 0),
    50
  );

  return {
    matched,
    grouped,
    totalPatternScore,
    patternCount: matched.length,
  };
};

// Get pattern summary for display
const getPatternSummary = (grouped) => {
  const summary = [];

  if (grouped.urgency?.length > 0) {
    summary.push(`${grouped.urgency.length} urgency tactic(s) detected`);
  }
  if (grouped.greed?.length > 0) {
    summary.push(`${grouped.greed.length} suspicious offer(s) detected`);
  }
  if (grouped.fear?.length > 0) {
    summary.push(`${grouped.fear.length} fear tactic(s) detected`);
  }
  if (grouped.impersonation?.length > 0) {
    summary.push(`${grouped.impersonation.length} impersonation tactic(s) detected`);
  }

  return summary;
};

module.exports = { matchPatterns, getPatternSummary, PHISHING_PATTERNS };