/**
 * Simple test suite for SPFMatch application
 * Tests use ONLY actual quiz questions and answers from the website
 */

import { calculateFitzpatrickType, getSkinType } from "./utils/fitzpatrick";
import type { QuizAnswers } from "./types/quiz";
import { REAPPLICATION_TIME_TABLE, UV_LEVELS } from "./constants/config";

// Test results tracker
const testResults: { name: string; passed: boolean; message: string }[] = [];

/**
 * Helper function to calculate UV reapplication time
 */
function calculateReapplicationTime(uv: number, fitzpatrick: number): number {
  const skinTypeTable = REAPPLICATION_TIME_TABLE[fitzpatrick as keyof typeof REAPPLICATION_TIME_TABLE] || REAPPLICATION_TIME_TABLE[3];

  if (uv >= 11) return skinTypeTable['11+'];
  if (uv >= 8) return skinTypeTable['8-10'];
  if (uv >= 6) return skinTypeTable['6-7'];
  if (uv >= 3) return skinTypeTable['3-5'];
  return skinTypeTable['1-2'];
}

/**
 * Helper function to get UV level classification
 */
function getUVLevel(uv: number): string {
  const uvLevel = UV_LEVELS.find(level => uv >= level.threshold);
  return uvLevel ? uvLevel.level : "Low";
}

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
 * Test 12: UV Reapplication Time - Low UV
 */
function testUVReapplicationLowUV() {
  const result = calculateReapplicationTime(1, 1);
  return result === 120;
}

/**
 * Test 13: UV Reapplication Time - Moderate UV
 */
function testUVReapplicationModerateUV() {
  const result = calculateReapplicationTime(4, 3);
  return result === 100;
}

/**
 * Test 14: UV Reapplication Time - High UV
 */
function testUVReapplicationHighUV() {
  const result = calculateReapplicationTime(7, 4);
  return result === 100;
}

/**
 * Test 15: UV Reapplication Time - Very High UV
 */
function testUVReapplicationVeryHighUV() {
  const result = calculateReapplicationTime(9, 5);
  return result === 80;
}

/**
 * Test 16: UV Reapplication Time - Extreme UV
 */
function testUVReapplicationExtremeUV() {
  const result = calculateReapplicationTime(12, 6);
  return result === 80;
}

/**
 * Test 17: UV Level Classification - Low
 */
function testUVLevelLow() {
  const result = getUVLevel(2);
  return result === "Low";
}

/**
 * Test 18: UV Level Classification - Moderate
 */
function testUVLevelModerate() {
  const result = getUVLevel(4);
  return result === "Moderate";
}

/**
 * Test 19: UV Level Classification - High
 */
function testUVLevelHigh() {
  const result = getUVLevel(7);
  return result === "High";
}

/**
 * Test 20: UV Level Classification - Very High
 */
function testUVLevelVeryHigh() {
  const result = getUVLevel(9);
  return result === "Very High";
}

/**
 * Test 21: UV Level Classification - Extreme
 */
function testUVLevelExtreme() {
  const result = getUVLevel(12);
  return result === "Extreme";
}

/**
 * Test 22: Boundary Score 7 (Type I)
 */
function testBoundaryScore7() {
  const answers: QuizAnswers = {
    eyeColor: "Light blue, gray or green",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Several",
    sunReaction: "Blistering followed by peeling",
    tanningDegree: "Light color tan",
    tanningHours: "Seldom",
    faceReaction: "Sensitive",
    lastExposure: "More than 3 months ago",
    faceExposure: "Never",
    skinType: "Hydrated and comfortable",
  };
  const result = calculateFitzpatrickType(answers);
  return result === 1;
}

/**
 * Test 23: Boundary Score 8 (Type II)
 */
function testBoundaryScore8() {
  const answers: QuizAnswers = {
    eyeColor: "Light blue, gray or green",
    hairColor: "Blonde",
    skinColor: "Very Pale",
    freckles: "Several",
    sunReaction: "Blistering followed by peeling",
    tanningDegree: "Light color tan",
    tanningHours: "Seldom",
    faceReaction: "Sensitive",
    lastExposure: "2-3 months ago",
    faceExposure: "Never",
    skinType: "Hydrated and comfortable",
  };
  const result = calculateFitzpatrickType(answers);
  return result === 2;
}

/**
 * Test 24: Boundary Score 16 (Type II)
 */
function testBoundaryScore16() {
  const answers: QuizAnswers = {
    eyeColor: "Blue, gray, or green",
    hairColor: "Chestnut/ Dark Blonde",
    skinColor: "Pale with a beige tint",
    freckles: "Few",
    sunReaction: "Burns sometimes followed by peeling",
    tanningDegree: "Reasonable tan",
    tanningHours: "Sometimes",
    faceReaction: "Normal",
    lastExposure: "More than 3 months ago",
    faceExposure: "Never",
    skinType: "Hydrated and comfortable",
  };
  const result = calculateFitzpatrickType(answers);
  return result === 2;
}

/**
 * Test 25: Boundary Score 25 (Type III)
 */
function testBoundaryScore25() {
  const answers: QuizAnswers = {
    eyeColor: "Blue",
    hairColor: "Dark brown",
    skinColor: "Light brown",
    freckles: "Incidental",
    sunReaction: "Rare burns",
    tanningDegree: "Tan very easily",
    tanningHours: "Often",
    faceReaction: "Very resistant",
    lastExposure: "More than 3 months ago",
    faceExposure: "Never",
    skinType: "Hydrated and comfortable",
  };
  const result = calculateFitzpatrickType(answers);
  return result === 3;
}

/**
 * Test 26: Boundary Score 34 (Type V)
 */
function testBoundaryScore34() {
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

  runTest(
    "Test 12: UV Reapplication (Low UV)",
    testUVReapplicationLowUV,
    "Correctly calculates reapplication time for low UV",
    "Failed to calculate reapplication time for low UV"
  );

  runTest(
    "Test 13: UV Reapplication (Moderate UV)",
    testUVReapplicationModerateUV,
    "Correctly calculates reapplication time for moderate UV",
    "Failed to calculate reapplication time for moderate UV"
  );

  runTest(
    "Test 14: UV Reapplication (High UV)",
    testUVReapplicationHighUV,
    "Correctly calculates reapplication time for high UV",
    "Failed to calculate reapplication time for high UV"
  );

  runTest(
    "Test 15: UV Reapplication (Very High UV)",
    testUVReapplicationVeryHighUV,
    "Correctly calculates reapplication time for very high UV",
    "Failed to calculate reapplication time for very high UV"
  );

  runTest(
    "Test 16: UV Reapplication (Extreme UV)",
    testUVReapplicationExtremeUV,
    "Correctly calculates reapplication time for extreme UV",
    "Failed to calculate reapplication time for extreme UV"
  );

  runTest(
    "Test 17: UV Level Classification (Low)",
    testUVLevelLow,
    "Correctly classifies low UV level",
    "Failed to classify low UV level"
  );

  runTest(
    "Test 18: UV Level Classification (Moderate)",
    testUVLevelModerate,
    "Correctly classifies moderate UV level",
    "Failed to classify moderate UV level"
  );

  runTest(
    "Test 19: UV Level Classification (High)",
    testUVLevelHigh,
    "Correctly classifies high UV level",
    "Failed to classify high UV level"
  );

  runTest(
    "Test 20: UV Level Classification (Very High)",
    testUVLevelVeryHigh,
    "Correctly classifies very high UV level",
    "Failed to classify very high UV level"
  );

  runTest(
    "Test 21: UV Level Classification (Extreme)",
    testUVLevelExtreme,
    "Correctly classifies extreme UV level",
    "Failed to classify extreme UV level"
  );

  runTest(
    "Test 22: Boundary Score 7 (Type I)",
    testBoundaryScore7,
    "Correctly calculates Type I at boundary score 7",
    "Failed at boundary score 7"
  );

  runTest(
    "Test 23: Boundary Score 8 (Type II)",
    testBoundaryScore8,
    "Correctly calculates Type II at boundary score 8",
    "Failed at boundary score 8"
  );

  runTest(
    "Test 24: Boundary Score 16 (Type II)",
    testBoundaryScore16,
    "Correctly calculates Type II at boundary score 16",
    "Failed at boundary score 16"
  );

  runTest(
    "Test 25: Boundary Score 25 (Type III)",
    testBoundaryScore25,
    "Correctly calculates Type III at boundary score 25",
    "Failed at boundary score 25"
  );

  runTest(
    "Test 26: Boundary Score 34 (Type V)",
    testBoundaryScore34,
    "Correctly calculates Type V at boundary score 34",
    "Failed at boundary score 34"
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