// Dangerous executable file extensions
const DANGEROUS_EXTENSIONS = {
  highRisk: {
    extensions: ["exe", "scr", "bat", "cmd", "com", "pif", "msi"],
    description: "Executable file - can execute malicious code",
    risk: 50,
  },
  mediumRisk: {
    extensions: ["js", "vbs", "jse", "vbe", "ps1", "psm1", "zip", "rar", "7z"],
    description: "Script or archive - can contain malicious content",
    risk: 35,
  },
  lowRisk: {
    extensions: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt"],
    description: "Document file - generally safe if from trusted source",
    risk: 0,
  },
};

// Suspicious file naming patterns
const SUSPICIOUS_PATTERNS = [
  {
    pattern: /invoice|receipt|payment/i,
    description: "Suspicious file name pretending to be financial document",
    risk: 15,
  },
  {
    pattern: /resume|cv|application/i,
    description: "Suspicious job-related file - may contain malware",
    risk: 10,
  },
  {
    pattern: /update|patch|setup/i,
    description: "Suspicious file claiming to be software update",
    risk: 20,
  },
  {
    pattern: /password|login|credential/i,
    description: "Suspicious file related to credentials",
    risk: 25,
  },
];

// Extract file extension
const getFileExtension = (filename) => {
  if (!filename) return null;
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : null;
};

// Check if attachment has dangerous extension
const isDangerousExtension = (filename) => {
  const ext = getFileExtension(filename);
  if (!ext) return { isDangerous: false };

  for (const [riskLevel, data] of Object.entries(DANGEROUS_EXTENSIONS)) {
    if (data.extensions.includes(ext)) {
      return {
        isDangerous: riskLevel !== "lowRisk",
        riskLevel,
        extension: ext,
        description: data.description,
        risk: data.risk,
      };
    }
  }

  return { isDangerous: false, risk: 0 };
};

// Check for suspicious filename patterns
const checkSuspiciousFilename = (filename) => {
  const results = {
    isSuspicious: false,
    patterns: [],
    riskScore: 0,
  };

  for (const suspicious of SUSPICIOUS_PATTERNS) {
    if (suspicious.pattern.test(filename)) {
      results.isSuspicious = true;
      results.patterns.push({
        pattern: suspicious.pattern.source,
        description: suspicious.description,
        risk: suspicious.risk,
      });
      results.riskScore += suspicious.risk;
    }
  }

  return results;
};

// Analyze single attachment
const analyzeAttachment = (filename) => {
  const result = {
    filename,
    extension: getFileExtension(filename),
    isSuspicious: false,
    riskScore: 0,
    risks: [],
  };

  // Check dangerous extension
  const extCheck = isDangerousExtension(filename);
  if (extCheck.isDangerous) {
    result.isSuspicious = true;
    result.riskScore += extCheck.risk;
    result.risks.push(`Dangerous file extension: .${extCheck.extension} - ${extCheck.description}`);
  }

  // Check suspicious filename patterns
  const filenameCheck = checkSuspiciousFilename(filename);
  if (filenameCheck.isSuspicious) {
    result.isSuspicious = true;
    result.riskScore += filenameCheck.riskScore;
    filenameCheck.patterns.forEach(pattern => {
      result.risks.push(pattern.description);
    });
  }

  // Cap at 100
  result.riskScore = Math.min(result.riskScore, 100);

  return result;
};

// Analyze multiple attachments
const analyzeAttachments = (attachments = []) => {
  const results = {
    hasAttachments: attachments.length > 0,
    totalAttachments: attachments.length,
    suspiciousCount: 0,
    riskScore: 0,
    details: [],
    overallRisk: null,
  };

  if (attachments.length === 0) return results;

  // Analyze each attachment
  attachments.forEach(attachment => {
    const analysis = analyzeAttachment(attachment);
    results.details.push(analysis);
    
    if (analysis.isSuspicious) {
      results.suspiciousCount++;
      results.riskScore += analysis.riskScore;
    }
  });

  // Calculate overall risk
  if (results.suspiciousCount > 0) {
    results.riskScore = Math.min(
      Math.max(
        results.riskScore / results.suspiciousCount,
        10
      ),
      100
    );
    results.overallRisk = results.suspiciousCount === attachments.length 
      ? "dangerous" 
      : "suspicious";
  } else {
    results.overallRisk = "safe";
  }

  return results;
};

module.exports = {
  DANGEROUS_EXTENSIONS,
  SUSPICIOUS_PATTERNS,
  getFileExtension,
  isDangerousExtension,
  checkSuspiciousFilename,
  analyzeAttachment,
  analyzeAttachments,
};
