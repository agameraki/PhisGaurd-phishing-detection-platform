/**
 * Comprehensive Scoring System Test Suite
 * Tests the centralized scoring system with various phishing scenarios
 */

const { analyzeEmail } = require("../services/riskEngine");

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

// Test tracker
let testsPassed = 0;
let testsFailed = 0;
const failedTests = [];

/**
 * Assert helper
 */
function assert(condition, testName, expected, actual) {
  if (condition) {
    testsPassed++;
    console.log(`  ${colors.green}✓${colors.reset} ${testName}`);
  } else {
    testsFailed++;
    console.log(`  ${colors.red}✗${colors.reset} ${testName}`);
    if (expected !== undefined && actual !== undefined) {
      console.log(`      Expected: ${expected}`);
      console.log(`      Actual: ${actual}`);
    }
    failedTests.push(testName);
  }
}

/**
 * Test 1: Primary Requirement - Multiple Sensitive Data Requests
 */
function testMultipleSensitiveDataRequests() {
  console.log(`\n${colors.blue}Test 1: Multiple Sensitive Data Requests${colors.reset}`);

  const subject = "URGENT: Verify Your Account";
  const sender = "security@gmail.com";
  const content = `
    Dear Customer,

    Your account requires immediate verification.

    Please provide the following information:
    1. Your password: ________________
    2. Your OTP (One-Time Password): ________________
    3. Your PIN: ________________
    4. Your credit card details: ________________
    5. Your bank account details: ________________

    Click here to verify your account: http://192.168.1.1/verify

    This is urgent and must be completed within 24 hours or your account will be suspended.

    Thank you,
    Support Team
  `;

  const result = analyzeEmail(subject, sender, content, []);

  console.log(`\n  Results:`);
  console.log(`    Risk Score: ${result.riskScore}/100`);
  console.log(`    Risk Level: ${result.riskLevel}`);
  console.log(`    Recommendation: ${result.recommendation}`);
  console.log(`\n  Threat Breakdown:`);
  console.log(`    Urgency Score: ${result.threatBreakdown.urgencyScore}`);
  console.log(`    Domain Risk: ${result.threatBreakdown.domainRisk}`);
  console.log(`    Content Issues: ${result.threatBreakdown.contentIssues}`);
  console.log(`    Sensitive Data Risk: ${result.threatBreakdown.sensitiveDataRisk}`);
  console.log(`    Sender Risk: ${result.threatBreakdown.senderRisk}`);

  // Assertions
  assert(
    result.riskScore >= 90,
    "Risk score >= 90",
    ">= 90",
    result.riskScore
  );

  assert(
    result.riskLevel === "likely phishing",
    'Risk level is "likely phishing"',
    "likely phishing",
    result.riskLevel
  );

  assert(
    result.threatBreakdown.domainRisk > 0,
    "Domain Risk > 0",
    "> 0",
    result.threatBreakdown.domainRisk
  );

  assert(
    result.threatBreakdown.sensitiveDataRisk > 0,
    "Sensitive Data Risk > 0",
    "> 0",
    result.threatBreakdown.sensitiveDataRisk
  );

  assert(
    result.threatBreakdown.sensitiveDataRisk >= 125, // 5 requests × 25 points
    "Sensitive Data Risk = 125 (5 requests × 25 each)",
    "125",
    result.threatBreakdown.sensitiveDataRisk
  );

  assert(
    result.recommendation.toLowerCase().includes("phishing") ||
    result.recommendation.toLowerCase().includes("delete") ||
    result.recommendation.toLowerCase().includes("not click"),
    "Recommendation warns about phishing",
    "phishing warning",
    result.recommendation.substring(0, 50)
  );
}

/**
 * Test 2: Safe Email (Low Risk)
 */
function testLegitimateEmail() {
  console.log(`\n${colors.blue}Test 2: Legitimate Email (Baseline)${colors.reset}`);

  const subject = "Your Order Confirmation";
  const sender = "noreply@amazon.com";
  const content = `
    Hello John,

    Thank you for your order!

    Order ID: 123456789
    Total: $49.99

    Your items will arrive in 3-5 business days.

    Best regards,
    Amazon Team
  `;

  const result = analyzeEmail(subject, sender, content, []);

  console.log(`\n  Results:`);
  console.log(`    Risk Score: ${result.riskScore}/100`);
  console.log(`    Risk Level: ${result.riskLevel}`);

  assert(
    result.riskScore < 30,
    "Risk score < 30 for legitimate email",
    "< 30",
    result.riskScore
  );

  assert(
    result.riskLevel === "safe",
    'Risk level is "safe"',
    "safe",
    result.riskLevel
  );
}

/**
 * Test 3: Suspicious Email (Medium Risk)
 */
function testSuspiciousEmail() {
  console.log(`\n${colors.blue}Test 3: Suspicious Email (Medium Risk)${colors.reset}`);

  const subject = "Urgent: Verify Your PayPal Account";
  const sender = "support@paypall.com"; // Typo in domain
  const content = `
    Dear PayPal User,

    Your account has been flagged. 

    Please verify your information here: http://paypa1-verify.com/login

    You have 24 hours to respond.

    PayPal Team
  `;

  const result = analyzeEmail(subject, sender, content, []);

  console.log(`\n  Results:`);
  console.log(`    Risk Score: ${result.riskScore}/100`);
  console.log(`    Risk Level: ${result.riskLevel}`);

  assert(
    result.riskScore >= 30 && result.riskScore < 80,
    "Risk score in suspicious/high risk range",
    "30-79",
    result.riskScore
  );

  assert(
    result.riskLevel === "suspicious" || result.riskLevel === "high risk",
    'Risk level is suspicious or high risk',
    "suspicious or high risk",
    result.riskLevel
  );
}

/**
 * Test 4: Free Email Provider Issue
 */
function testFreeEmailProvider() {
  console.log(`\n${colors.blue}Test 4: Free Email Provider Impersonating Bank${colors.reset}`);

  const subject = "Chase Bank Security Alert";
  const sender = "security@gmail.com";
  const content = `
    Chase Bank Customer,

    Your account requires verification.
    Please click here to verify: https://chase-verify.xyz/login

    This is urgent!
  `;

  const result = analyzeEmail(subject, sender, content, []);

  console.log(`\n  Results:`);
  console.log(`    Risk Score: ${result.riskScore}/100`);
  console.log(`    Domain Risk: ${result.threatBreakdown.domainRisk}`);

  assert(
    result.threatBreakdown.domainRisk > 0,
    "Domain Risk detected for free email provider",
    "> 0",
    result.threatBreakdown.domainRisk
  );
}

/**
 * Test 5: Content Quality Issues
 */
function testContentQualityIssues() {
  console.log(`\n${colors.blue}Test 5: Content Quality Issues${colors.reset}`);

  const subject = "URGENT!!!";
  const sender = "unknown@example.com";
  const content = `
    Dear User,

    THIS IS VERY IMPORTANT!!!!!

    Your account has been SUSPENDED!!!!!!

    Click hear to verify immediately!!!

    DO NOT IGNORE THIS MESSAGE!!!
  `;

  const result = analyzeEmail(subject, sender, content, []);

  console.log(`\n  Results:`);
  console.log(`    Risk Score: ${result.riskScore}/100`);
  console.log(`    Content Issues: ${result.threatBreakdown.contentIssues}`);
  console.log(`    Urgency Score: ${result.threatBreakdown.urgencyScore}`);

  assert(
    result.threatBreakdown.contentIssues > 0,
    "Content issues detected",
    "> 0",
    result.threatBreakdown.contentIssues
  );
}

/**
 * Test 6: Verify Threat Breakdown Totals
 */
function testThreatBreakdownTotals() {
  console.log(`\n${colors.blue}Test 6: Threat Breakdown Totals Match Risk Score${colors.reset}`);

  const subject = "Action Required";
  const sender = "noreply@suspicious.xyz";
  const content = `
    Hello,

    Your password is needed: ________________
    Your credit card: ________________

    Action required immediately!

    Within 24 hours or account closed.
  `;

  const result = analyzeEmail(subject, sender, content, []);

  const calculatedTotal =
    result.threatBreakdown.urgencyScore +
    result.threatBreakdown.domainRisk +
    result.threatBreakdown.contentIssues +
    result.threatBreakdown.sensitiveDataRisk +
    result.threatBreakdown.senderRisk;

  const expectedCapped = Math.min(calculatedTotal, 100);

  console.log(`\n  Results:`);
  console.log(`    Calculated Total: ${calculatedTotal}`);
  console.log(`    Expected (capped): ${expectedCapped}`);
  console.log(`    Actual Risk Score: ${result.riskScore}`);

  assert(
    result.riskScore === expectedCapped || result.riskScore === Math.min(calculatedTotal, 100),
    "Risk score matches breakdown total (capped at 100)",
    expectedCapped,
    result.riskScore
  );
}

/**
 * Test 7: Risk Level Thresholds
 */
function testRiskLevelThresholds() {
  console.log(`\n${colors.blue}Test 7: Risk Level Thresholds${colors.reset}`);

  const testCases = [
    {
      name: "Score 0-29 should be SAFE",
      subject: "Hello",
      sender: "friend@example.com",
      content: "Hi, how are you?",
      expectedLevel: "safe",
    },
    {
      name: "Score 30+ should be at least SUSPICIOUS",
      subject: "Verify Account",
      sender: "noreply@suspicious.com",
      content: "Click here to verify: http://suspicious.xyz\nPassword needed",
      expectedLevel: "suspicious",
    },
  ];

  for (const testCase of testCases) {
    const result = analyzeEmail(testCase.subject, testCase.sender, testCase.content, []);
    const isValid = 
      (testCase.expectedLevel === "safe" && result.riskLevel === "safe") ||
      (testCase.expectedLevel === "suspicious" && 
       (result.riskLevel === "suspicious" || result.riskLevel === "high risk" || result.riskLevel === "likely phishing"));

    assert(
      isValid,
      testCase.name,
      testCase.expectedLevel,
      result.riskLevel
    );
  }
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log(`\n${colors.bold}${colors.blue}╔════════════════════════════════════════════════════════════╗`);
  console.log(`║         Centralized Scoring System Test Suite               ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  testMultipleSensitiveDataRequests();
  testLegitimateEmail();
  testSuspiciousEmail();
  testFreeEmailProvider();
  testContentQualityIssues();
  testThreatBreakdownTotals();
  testRiskLevelThresholds();

  // Print summary
  console.log(`\n${colors.bold}${colors.blue}╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                    Test Summary                            ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const total = testsPassed + testsFailed;
  console.log(`  Total Tests: ${total}`);
  console.log(`  ${colors.green}Passed: ${testsPassed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${testsFailed}${colors.reset}`);

  if (testsFailed > 0) {
    console.log(`\n  ${colors.red}Failed Tests:${colors.reset}`);
    failedTests.forEach(test => console.log(`    - ${test}`));
    process.exit(1);
  } else {
    console.log(`\n  ${colors.green}${colors.bold}✓ All tests passed!${colors.reset}`);
    process.exit(0);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
