#!/usr/bin/env node

/**
 * Quick Test Runner for Centralized Scoring System
 * 
 * Usage: node quickTest.js
 */

const { analyzeEmail } = require("./services/riskEngine");

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log("║          Centralized Scoring System - Quick Test          ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

// Primary Test: Multiple Sensitive Data Requests
console.log("TEST 1: Multiple Sensitive Data Requests (Primary Requirement)");
console.log("─".repeat(60));

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

console.log("\nRESULT:");
console.log(`  Risk Score: ${result.riskScore}/100`);
console.log(`  Risk Level: ${result.riskLevel}`);
console.log(`  Recommendation: ${result.recommendation.substring(0, 60)}...`);

console.log("\nTHREAT BREAKDOWN:");
console.log(`  • Urgency Score: ${result.threatBreakdown.urgencyScore}`);
console.log(`  • Domain Risk: ${result.threatBreakdown.domainRisk}`);
console.log(`  • Content Issues: ${result.threatBreakdown.contentIssues}`);
console.log(`  • Sensitive Data Risk: ${result.threatBreakdown.sensitiveDataRisk}`);
console.log(`  • Sender Risk: ${result.threatBreakdown.senderRisk}`);

const total =
  result.threatBreakdown.urgencyScore +
  result.threatBreakdown.domainRisk +
  result.threatBreakdown.contentIssues +
  result.threatBreakdown.sensitiveDataRisk +
  result.threatBreakdown.senderRisk;

console.log(`  ─────────────────────────`);
console.log(`  Total (before cap): ${total}`);
console.log(`  Final Score (capped): ${result.riskScore}`);

console.log("\nVERIFICATION:");
let allPass = true;

if (result.riskScore >= 90) {
  console.log(`  ✓ Risk Score >= 90: ${result.riskScore} ✓`);
} else {
  console.log(`  ✗ Risk Score >= 90: ${result.riskScore} ✗`);
  allPass = false;
}

if (result.riskLevel === "likely phishing") {
  console.log(`  ✓ Risk Level = "likely phishing": ${result.riskLevel} ✓`);
} else {
  console.log(`  ✗ Risk Level = "likely phishing": ${result.riskLevel} ✗`);
  allPass = false;
}

if (result.threatBreakdown.domainRisk > 0) {
  console.log(`  ✓ Domain Risk > 0: ${result.threatBreakdown.domainRisk} ✓`);
} else {
  console.log(`  ✗ Domain Risk > 0: ${result.threatBreakdown.domainRisk} ✗`);
  allPass = false;
}

if (result.threatBreakdown.sensitiveDataRisk > 0) {
  console.log(
    `  ✓ Sensitive Data Risk > 0: ${result.threatBreakdown.sensitiveDataRisk} ✓`
  );
} else {
  console.log(
    `  ✗ Sensitive Data Risk > 0: ${result.threatBreakdown.sensitiveDataRisk} ✗`
  );
  allPass = false;
}

const hasPhishingWarning =
  result.recommendation.toLowerCase().includes("phishing") ||
  result.recommendation.toLowerCase().includes("delete") ||
  result.recommendation.toLowerCase().includes("not click");

if (hasPhishingWarning) {
  console.log(
    `  ✓ Recommendation warns about phishing ✓`
  );
} else {
  console.log(
    `  ✗ Recommendation warns about phishing ✗`
  );
  allPass = false;
}

console.log("\n" + "═".repeat(60));
if (allPass) {
  console.log("✓ ALL CHECKS PASSED - Scoring system is working correctly!");
  process.exit(0);
} else {
  console.log("✗ SOME CHECKS FAILED - Review the output above");
  process.exit(1);
}
