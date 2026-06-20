// // Urgency and threat patterns
// const URGENCY_PATTERNS = {
//   immediate: {
//     phrases: [
//       "immediate action required",
//       "act now",
//       "urgent action",
//       "urgent required",
//       "urgent please",
//       "immediately",
//       "asap",
//       "right away",
//       "hurry",
//       "quickly",
//     ],
//     risk: 15,
//   },
//   deadline: {
//     phrases: [
//       "within 24 hours",
//       "within 48 hours",
//       "today only",
//       "expires today",
//       "deadline",
//       "time sensitive",
//       "limited time",
//       "ends tonight",
//       "last chance",
//       "final notice",
//     ],
//     risk: 12,
//   },
//   threat: {
//     phrases: [
//       "account suspended",
//       "account will be suspended",
//       "account has been compromised",
//       "verify immediately",
//       "confirm immediately",
//       "final warning",
//       "take action now",
//       "failure to respond",
//       "legal action",
//       "court order",
//     ],
//     risk: 20,
//   },
// };

// // Giveaway and reward scam patterns
// const SCAM_PATTERNS = {
//   lottery: {
//     phrases: [
//       "you have won",
//       "you've won",
//       "congratulations you",
//       "you are the winner",
//       "prize winner",
//       "lottery winner",
//       "claim your prize",
//       "claim your reward",
//     ],
//     risk: 25,
//   },
//   inheritance: {
//     phrases: [
//       "inheritance",
//       "legacy",
//       "uncle left you",
//       "relative left you",
//       "claim inheritance",
//       "unclaimed funds",
//     ],
//     risk: 25,
//   },
//   freeStuff: {
//     phrases: [
//       "free gift",
//       "free offer",
//       "100% free",
//       "no cost",
//       "risk free",
//       "at no charge",
//       "completely free",
//     ],
//     risk: 15,
//   },
//   moneyPromise: {
//     phrases: [
//       "guaranteed income",
//       "make money fast",
//       "work from home",
//       "earn extra income",
//       "passive income",
//       "unlimited income",
//       "financial freedom",
//       "million dollars",
//       "easy money",
//     ],
//     risk: 20,
//   },
// };

// // Analyze content quality (grammar, formatting)
// const analyzeContentQuality = (content) => {
//   const results = {
//     riskScore: 0,
//     issues: [],
//   };

//   // 1. Excessive punctuation (!!!??)
//   const excessivePunct = (content.match(/[!?]{2,}/g) || []).length;
//   if (excessivePunct > 2) {
//     results.issues.push(
//       `Excessive punctuation detected (${excessivePunct} instances) - common in phishing emails`
//     );
//     results.riskScore += 10;
//   }

//   // 2. ALL CAPS sentences
//   const sentences = content.match(/[^.!?]*[.!?]/g) || [];
//   const capsCount = sentences.filter(sent => {
//     const words = sent.match(/\b[A-Z]+\b/g) || [];
//     return words.length > 2 && words.length === sent.match(/\b\w+\b/g).length;
//   }).length;

//   if (capsCount > 2) {
//     results.issues.push(`Excessive use of ALL CAPS (${capsCount} sentences)`);
//     results.riskScore += 10;
//   }

//   // 3. Generic greetings
//   const genericGreetings = [
//     "dear user",
//     "dear customer",
//     "dear valued customer",
//     "to whom it may concern",
//     "hello there",
//   ];
//   const hasGenericGreeting = genericGreetings.some(greeting =>
//     content.toLowerCase().includes(greeting)
//   );

//   if (hasGenericGreeting) {
//     results.issues.push("Generic greeting detected instead of personalized name");
//     results.riskScore += 5;
//   }

//   // 4. Spelling/grammar patterns (common phishing indicators)
//   const commonErrors = [
//     { pattern: /recieve/gi, description: "Misspelling: 'recieve' instead of 'receive'" },
//     { pattern: /occured/gi, description: "Misspelling: 'occured' instead of 'occurred'" },
//     { pattern: /seperate/gi, description: "Misspelling: 'seperate' instead of 'separate'" },
//     { pattern: /neccessary/gi, description: "Misspelling: 'neccessary' instead of 'necessary'" },
//     { pattern: /accomodate/gi, description: "Misspelling: 'accomodate' instead of 'accommodate'" },
//   ];

//   let spellingErrors = 0;
//   commonErrors.forEach(error => {
//     const matches = content.match(error.pattern) || [];
//     if (matches.length > 0) {
//       spellingErrors += matches.length;
//       results.issues.push(error.description);
//     }
//   });

//   if (spellingErrors > 0) {
//     results.riskScore += 8;
//   }

//   // 5. Unusual spacing/formatting
//   if (/\s{2,}/g.test(content)) {
//     results.issues.push("Excessive spacing detected");
//     results.riskScore += 3;
//   }

//   // Cap at 30
//   results.riskScore = Math.min(results.riskScore, 30);

//   return results;
// };

// // Detect urgency phrases
// const detectUrgency = (content) => {
//   const results = {
//     hasUrgency: false,
//     riskScore: 0,
//     triggers: [],
//   };

//   const contentLower = content.toLowerCase();

//   for (const [category, data] of Object.entries(URGENCY_PATTERNS)) {
//     const found = data.phrases.filter(phrase => contentLower.includes(phrase));
    
//     found.forEach(phrase => {
//       results.hasUrgency = true;
//       results.riskScore += data.risk;
//       results.triggers.push({
//         phrase,
//         category,
//         riskContribution: data.risk,
//       });
//     });
//   }

//   // Multiple urgency triggers = higher risk
//   if (results.triggers.length > 2) {
//     results.riskScore += 10;
//     results.triggers.push({
//       phrase: "Multiple urgency tactics combined",
//       category: "combined_urgency",
//       riskContribution: 10,
//     });
//   }

//   // Cap at 50
//   results.riskScore = Math.min(results.riskScore, 50);

//   return results;
// };

// // Detect scam patterns
// const detectScamPatterns = (content) => {
//   const results = {
//     hasScamIndicators: false,
//     riskScore: 0,
//     patterns: [],
//   };

//   const contentLower = content.toLowerCase();

//   for (const [category, data] of Object.entries(SCAM_PATTERNS)) {
//     const found = data.phrases.filter(phrase => contentLower.includes(phrase));
    
//     found.forEach(phrase => {
//       results.hasScamIndicators = true;
//       results.riskScore += data.risk;
//       results.patterns.push({
//         phrase,
//         category,
//         type: category,
//         riskContribution: data.risk,
//       });
//     });
//   }

//   // Cap at 50
//   results.riskScore = Math.min(results.riskScore, 50);

//   return results;
// };

// // Comprehensive content analysis
// const analyzeContentPatterns = (content) => {
//   return {
//     quality: analyzeContentQuality(content),
//     urgency: detectUrgency(content),
//     scams: detectScamPatterns(content),
//   };
// };

// module.exports = {
//   URGENCY_PATTERNS,
//   SCAM_PATTERNS,
//   analyzeContentQuality,
//   detectUrgency,
//   detectScamPatterns,
//   analyzeContentPatterns,
// };


// Urgency and threat patterns
const URGENCY_PATTERNS = {
  immediate: {
    phrases: [
      "immediate action required",
      "act now",
      "urgent action",
      "urgent required",
      "urgent please",
      "immediately",
      "asap",
      "right away",
      "hurry",
      "quickly",
    ],
    risk: 15,
  },
  deadline: {
    phrases: [
      "within 24 hours",
      "within 48 hours",
      "today only",
      "expires today",
      "deadline",
      "time sensitive",
      "limited time",
      "ends tonight",
      "last chance",
      "final notice",
    ],
    risk: 12,
  },
  shortWindow: {
    phrases: [
      "within 30 minutes",
      "within 15 minutes",
      "within 10 minutes",
      "within 1 hour",
      "within an hour",
      "in the next 30 minutes",
      "in the next 15 minutes",
      "confirm in 30 minutes",
      "respond in 30 minutes",
    ],
    risk: 22,
  },
  threat: {
    phrases: [
      "account suspended",
      "account will be suspended",
      "account has been compromised",
      "verify immediately",
      "confirm immediately",
      "final warning",
      "take action now",
      "failure to respond",
      "legal action",
      "court order",
      "offer will be cancelled",
      "offer cancelled permanently",
    ],
    risk: 20,
  },
};

// Giveaway and reward scam patterns
const SCAM_PATTERNS = {
  lottery: {
    phrases: [
      "you have won",
      "you've won",
      "congratulations you",
      "you are the winner",
      "prize winner",
      "lottery winner",
      "claim your prize",
      "claim your reward",
    ],
    risk: 25,
  },
  inheritance: {
    phrases: [
      "inheritance",
      "legacy",
      "uncle left you",
      "relative left you",
      "claim inheritance",
      "unclaimed funds",
    ],
    risk: 25,
  },
  freeStuff: {
    phrases: [
      "free gift",
      "free offer",
      "100% free",
      "no cost",
      "risk free",
      "at no charge",
      "completely free",
    ],
    risk: 15,
  },
  moneyPromise: {
    phrases: [
      "guaranteed income",
      "make money fast",
      "work from home",
      "earn extra income",
      "passive income",
      "unlimited income",
      "financial freedom",
      "million dollars",
      "easy money",
    ],
    risk: 20,
  },
  advanceFee: {
    phrases: [
      "pay verification fee",
      "pay processing fee",
      "pay a fee to unlock",
      "pay to unlock",
      "verification fee",
      "processing fee",
      "registration fee",
      "unlock fee",
      "security deposit",
      "administrative fee",
    ],
    risk: 30,
  },
};

// Analyze content quality (grammar, formatting)
const analyzeContentQuality = (content) => {
  const results = {
    riskScore: 0,
    issues: [],
  };

  // 1. Excessive punctuation (!!!??)
  const excessivePunct = (content.match(/[!?]{2,}/g) || []).length;
  if (excessivePunct > 2) {
    results.issues.push(
      `Excessive punctuation detected (${excessivePunct} instances) - common in phishing emails`
    );
    results.riskScore += 10;
  }

  // 2. ALL CAPS sentences
  const sentences = content.match(/[^.!?]*[.!?]/g) || [];
  const capsCount = sentences.filter(sent => {
    const words = sent.match(/\b[A-Z]+\b/g) || [];
    return words.length > 2 && words.length === sent.match(/\b\w+\b/g).length;
  }).length;

  if (capsCount > 2) {
    results.issues.push(`Excessive use of ALL CAPS (${capsCount} sentences)`);
    results.riskScore += 10;
  }

  // 3. Generic greetings
  const genericGreetings = [
    "dear user",
    "dear customer",
    "dear valued customer",
    "to whom it may concern",
    "hello there",
    "dear applicant",
  ];
  const hasGenericGreeting = genericGreetings.some(greeting =>
    content.toLowerCase().includes(greeting)
  );

  if (hasGenericGreeting) {
    results.issues.push("Generic greeting detected instead of personalized name");
    results.riskScore += 5;
  }

  // 4. Spelling/grammar patterns (common phishing indicators)
  const commonErrors = [
    { pattern: /recieve/gi, description: "Misspelling: 'recieve' instead of 'receive'" },
    { pattern: /occured/gi, description: "Misspelling: 'occured' instead of 'occurred'" },
    { pattern: /seperate/gi, description: "Misspelling: 'seperate' instead of 'separate'" },
    { pattern: /neccessary/gi, description: "Misspelling: 'neccessary' instead of 'necessary'" },
    { pattern: /accomodate/gi, description: "Misspelling: 'accomodate' instead of 'accommodate'" },
  ];

  let spellingErrors = 0;
  commonErrors.forEach(error => {
    const matches = content.match(error.pattern) || [];
    if (matches.length > 0) {
      spellingErrors += matches.length;
      results.issues.push(error.description);
    }
  });

  if (spellingErrors > 0) {
    results.riskScore += 8;
  }

  // 5. Unusual spacing/formatting
  if (/\s{2,}/g.test(content)) {
    results.issues.push("Excessive spacing detected");
    results.riskScore += 3;
  }

  // Cap at 30
  results.riskScore = Math.min(results.riskScore, 30);

  return results;
};

// Detect urgency phrases
const detectUrgency = (content) => {
  const results = {
    hasUrgency: false,
    riskScore: 0,
    triggers: [],
  };

  const contentLower = content.toLowerCase();

  for (const [category, data] of Object.entries(URGENCY_PATTERNS)) {
    const found = data.phrases.filter(phrase => contentLower.includes(phrase));

    found.forEach(phrase => {
      results.hasUrgency = true;
      results.riskScore += data.risk;
      results.triggers.push({
        phrase,
        category,
        riskContribution: data.risk,
      });
    });
  }

  // Multiple urgency triggers = higher risk
  if (results.triggers.length > 2) {
    results.riskScore += 10;
    results.triggers.push({
      phrase: "Multiple urgency tactics combined",
      category: "combined_urgency",
      riskContribution: 10,
    });
  }

  // Cap at 50
  results.riskScore = Math.min(results.riskScore, 50);

  return results;
};

// Detect scam patterns
const detectScamPatterns = (content) => {
  const results = {
    hasScamIndicators: false,
    riskScore: 0,
    patterns: [],
  };

  const contentLower = content.toLowerCase();

  for (const [category, data] of Object.entries(SCAM_PATTERNS)) {
    const found = data.phrases.filter(phrase => contentLower.includes(phrase));

    found.forEach(phrase => {
      results.hasScamIndicators = true;
      results.riskScore += data.risk;
      results.patterns.push({
        phrase,
        category,
        type: category,
        riskContribution: data.risk,
      });
    });
  }

  // Cap at 60 (raised slightly to accommodate advanceFee category)
  results.riskScore = Math.min(results.riskScore, 60);

  return results;
};

// Comprehensive content analysis
const analyzeContentPatterns = (content) => {
  return {
    quality: analyzeContentQuality(content),
    urgency: detectUrgency(content),
    scams: detectScamPatterns(content),
  };
};

module.exports = {
  URGENCY_PATTERNS,
  SCAM_PATTERNS,
  analyzeContentQuality,
  detectUrgency,
  detectScamPatterns,
  analyzeContentPatterns,
};