#!/usr/bin/env node

/**
 * Risk Score Calculation Audit Report
 * This script runs comprehensive unit tests on the phishing detection scoring system
 */

const path = require("path");

// Load test suite
const testSuite = require("./tests/scoringTest");

console.log("\n🔍 Running Phishing Risk Score Calculation Audit...\n");

try {
  testSuite.runAllTests();
} catch (error) {
  console.error("\n❌ Test execution failed:", error.message);
  console.error(error.stack);
  process.exit(1);
}
