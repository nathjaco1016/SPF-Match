/**
 * Simple test suite for SPFMatch application
 * Tests use ONLY actual quiz questions and answers from the website
 */

import { calculateFitzpatrickType, getSkinType } from "./utils/fitzpatrick";
import type { QuizAnswers } from "./types/quiz";

// Test results tracker
const testResults: { name: string; passed: boolean; message: string }[] = [];

/**
 * Helper function to run a test and track results
 */
function runTest(
  testName: string,
  testFn: () => boolean,
  successMsg: string,
  failMsg: string
) {
  try {
    const passed = testFn();
    testResults.push({
      name: testName,
      passed,
      message: passed ? successMsg : failMsg,
    });
    console.log(`${passed ? "✓" : "✗"} ${testName}: ${passed ? successMsg : failMsg}`);
  } catch (error) {
    testResults.push({
      name: testName,
      passed: false,
      message: `Error: ${error}`,
    });
    console.log(`✗ ${testName}: Error - ${error}`);
  }
}

/**
 * Test 1: Verify Fitzpatrick Type I calculation (score 0-7)
 * Uses answers that should score very low (0 points each)
 */
function testFitzpatrickTypeI() {
  const answers: QuizAnswers = {
    eyeColor: "Light blue, gray or green",
    hairColor: "Sandy red",
    skinColor: "Reddish",
    freckles: "Many",
    sunReaction: "Painful redness, blistering, peeling",
    tanningDegree: "Hardly or not at all",
    tanningHours: "Never",
    faceReaction: "Very sensitive",
    lastExposure: "More than 3 months ago",
    faceExposure: "Never",
    skinType: "Hydrated and comfortable",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 1;
}

/**
 * Test 2: Verify Fitzpatrick Type II calculation (score 8-16)
 * Uses answers that should score 1 point each
 */
function testFitzpatrickTypeII() {
  const answers: QuizAnswers = {
    eyeColor: "Blue, gray, or green",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Several",
    sunReaction: "Blistering followed by peeling",
    tanningDegree: "Light color tan",
    tanningHours: "Seldom",
    faceReaction: "Sensitive",
    lastExposure: "2-3 months ago",
    faceExposure: "Hardly ever",
    skinType: "Hydrated and comfortable",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 2;
}

/**
 * Test 3: Verify Fitzpatrick Type III calculation (score 17-25)
 * Uses answers that should score 2 points each
 */
function testFitzpatrickTypeIII() {
  const answers: QuizAnswers = {
    eyeColor: "Blue",
    hairColor: "Chestnut/ Dark Blonde",
    skinColor: "Pale with a beige tint",
    freckles: "Few",
    sunReaction: "Burns sometimes followed by peeling",
    tanningDegree: "Reasonable tan",
    tanningHours: "Sometimes",
    faceReaction: "Normal",
    lastExposure: "1-2 months ago",
    faceExposure: "Sometimes",
    skinType: "Hydrated and comfortable",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 3;
}

/**
 * Test 4: Verify Fitzpatrick Type IV calculation (score 26-30)
 * Uses answers that should score 3 points each
 */
function testFitzpatrickTypeIV() {
  const answers: QuizAnswers = {
    eyeColor: "Dark Brown",
    hairColor: "Dark brown",
    skinColor: "Light brown",
    freckles: "Incidental",
    sunReaction: "Rare burns",
    tanningDegree: "Tan very easily",
    tanningHours: "Often",
    faceReaction: "Very resistant",
    lastExposure: "Less than a month ago",
    faceExposure: "Often",
    skinType: "Hydrated and comfortable",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 4;
}

/**
 * Test 5: Verify Fitzpatrick Type V calculation (score 31-34)
 * Uses mix of answers scoring 3-4 points to reach 31-34 range
 */
function testFitzpatrickTypeV() {
  const answers: QuizAnswers = {
    eyeColor: "Dark Brown",
    hairColor: "Black",
    skinColor: "Dark brown",
    freckles: "None",
    sunReaction: "Never had burns",
    tanningDegree: "Turn dark brown quickly",
    tanningHours: "Always",
    faceReaction: "Very resistant",
    lastExposure: "1-2 months ago",
    faceExposure: "Sometimes",
    skinType: "Hydrated and comfortable",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 5;
}

/**
 * Test 6: Verify Fitzpatrick Type VI calculation (score 35+)
 * Uses answers that should score 4 points each (maximum)
 */
function testFitzpatrickTypeVI() {
  const answers: QuizAnswers = {
    eyeColor: "Brownish Black",
    hairColor: "Black",
    skinColor: "Dark brown",
    freckles: "None",
    sunReaction: "Never had burns",
    tanningDegree: "Turn dark brown quickly",
    tanningHours: "Always",
    faceReaction: "Never had a problem",
    lastExposure: "Less than 2 weeks ago",
    faceExposure: "Always",
    skinType: "Hydrated and comfortable",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 6;
}

/**
 * Test 7: Verify normal skin type extraction
 */
function testNormalSkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Blue",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Few",
    sunReaction: "Burns sometimes followed by peeling",
    tanningDegree: "Reasonable tan",
    tanningHours: "Sometimes",
    faceReaction: "Normal",
    lastExposure: "1-2 months ago",
    faceExposure: "Sometimes",
    skinType: "Hydrated and comfortable",
  };

  const result = getSkinType(answers);
  return result === "normal";
}

/**
 * Test 8: Verify oily skin type extraction
 */
function testOilySkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Blue",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Few",
    sunReaction: "Burns sometimes followed by peeling",
    tanningDegree: "Reasonable tan",
    tanningHours: "Sometimes",
    faceReaction: "Normal",
    lastExposure: "1-2 months ago",
    faceExposure: "Sometimes",
    skinType: "Shiny and greasy",
  };

  const result = getSkinType(answers);
  return result === "oily";
}

/**
 * Test 9: Verify dry skin type extraction
 */
function testDrySkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Blue",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Few",
    sunReaction: "Burns sometimes followed by peeling",
    tanningDegree: "Reasonable tan",
    tanningHours: "Sometimes",
    faceReaction: "Normal",
    lastExposure: "1-2 months ago",
    faceExposure: "Sometimes",
    skinType: "Flaky, rough, and tight, sometimes itchy or irritated",
  };

  const result = getSkinType(answers);
  return result === "dry";
}

/**
 * Test 10: Verify combination skin type extraction
 */
function testCombinationSkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Blue",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Few",
    sunReaction: "Burns sometimes followed by peeling",
    tanningDegree: "Reasonable tan",
    tanningHours: "Sometimes",
    faceReaction: "Normal",
    lastExposure: "1-2 months ago",
    faceExposure: "Sometimes",
    skinType: "Oily in some areas and dry in other areas",
  };

  const result = getSkinType(answers);
  return result === "combination";
}

/**
 * Test 11: Verify sensitive skin type extraction
 */
function testSensitiveSkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Blue",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Few",
    sunReaction: "Burns sometimes followed by peeling",
    tanningDegree: "Reasonable tan",
    tanningHours: "Sometimes",
    faceReaction: "Normal",
    lastExposure: "1-2 months ago",
    faceExposure: "Sometimes",
    skinType: "Often stings or turns red in response to irritants",
  };

  const result = getSkinType(answers);
  return result === "sensitive";
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log("\n🧪 Running SPFMatch Test Suite...\n");

  runTest(
    "Test 1: Fitzpatrick Type I",
    testFitzpatrickTypeI,
    "Correctly calculates Type I (score 0-7)",
    "Failed to calculate Type I"
  );

  runTest(
    "Test 2: Fitzpatrick Type II",
    testFitzpatrickTypeII,
    "Correctly calculates Type II (score 8-16)",
    "Failed to calculate Type II"
  );

  runTest(
    "Test 3: Fitzpatrick Type III",
    testFitzpatrickTypeIII,
    "Correctly calculates Type III (score 17-25)",
    "Failed to calculate Type III"
  );

  runTest(
    "Test 4: Fitzpatrick Type IV",
    testFitzpatrickTypeIV,
    "Correctly calculates Type IV (score 26-30)",
    "Failed to calculate Type IV"
  );

  runTest(
    "Test 5: Fitzpatrick Type V",
    testFitzpatrickTypeV,
    "Correctly calculates Type V (score 31-34)",
    "Failed to calculate Type V"
  );

  runTest(
    "Test 6: Fitzpatrick Type VI",
    testFitzpatrickTypeVI,
    "Correctly calculates Type VI (score 35+)",
    "Failed to calculate Type VI"
  );

  runTest(
    "Test 7: Normal Skin Type",
    testNormalSkinType,
    "Correctly identifies normal skin type",
    "Failed to identify normal skin type"
  );

  runTest(
    "Test 8: Oily Skin Type",
    testOilySkinType,
    "Correctly identifies oily skin type",
    "Failed to identify oily skin type"
  );

  runTest(
    "Test 9: Dry Skin Type",
    testDrySkinType,
    "Correctly identifies dry skin type",
    "Failed to identify dry skin type"
  );

  runTest(
    "Test 10: Combination Skin Type",
    testCombinationSkinType,
    "Correctly identifies combination skin type",
    "Failed to identify combination skin type"
  );

  runTest(
    "Test 11: Sensitive Skin Type",
    testSensitiveSkinType,
    "Correctly identifies sensitive skin type",
    "Failed to identify sensitive skin type"
  );

  // Print summary
  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Test Summary: ${passedTests}/${totalTests} tests passed`);
  if (failedTests > 0) {
    console.log(`❌ ${failedTests} test(s) failed`);
  } else {
    console.log("✅ All tests passed!");
  }
  console.log("=".repeat(50) + "\n");

  return testResults;
}

// Auto-run tests when this file is imported
runAllTests();