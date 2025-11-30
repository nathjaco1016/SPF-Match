/**
 * Simple test suite for SPFMatch application
 * This file contains 10 test functions to validate core functionality
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
 */
function testFitzpatrickTypeI() {
  const answers: QuizAnswers = {
    eyeColor: "Light blue, gray, or green",
    hairColor: "Red or light blonde",
    skinColor: "Ivory white",
    freckles: "Many",
    sunTanning: "Never, I only burn",
    sunBurning: "Always",
    skinReaction: "Very sensitive, often burns",
    familyBackground: "Scandinavian, Irish, or Scottish",
    sunExposure: "Rarely, I avoid the sun",
    ageRange: "Under 30",
    skinType: "Normal skin (balanced, not too oily or dry)",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 1;
}

/**
 * Test 2: Verify Fitzpatrick Type VI calculation (score 35+)
 */
function testFitzpatrickTypeVI() {
  const answers: QuizAnswers = {
    eyeColor: "Dark brown or black",
    hairColor: "Black",
    skinColor: "Dark brown or black",
    freckles: "None",
    sunTanning: "My skin is naturally dark",
    sunBurning: "Never",
    skinReaction: "Very resistant, never burns",
    familyBackground: "African or Afro-Caribbean",
    sunExposure: "Very often, I spend a lot of time outdoors",
    ageRange: "Over 60",
    skinType: "Normal skin (balanced, not too oily or dry)",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 6;
}

/**
 * Test 3: Verify Fitzpatrick Type III calculation (score 17-25)
 */
function testFitzpatrickTypeIII() {
  const answers: QuizAnswers = {
    eyeColor: "Hazel or light brown",
    hairColor: "Light brown",
    skinColor: "Light brown or olive",
    freckles: "Few",
    sunTanning: "Sometimes",
    sunBurning: "Sometimes",
    skinReaction: "Moderately sensitive",
    familyBackground: "European (mixed)",
    sunExposure: "Occasionally",
    ageRange: "30-40",
    skinType: "Normal skin (balanced, not too oily or dry)",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 3;
}

/**
 * Test 4: Verify oily skin type extraction
 */
function testOilySkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Blue or gray",
    hairColor: "Blonde",
    skinColor: "Pale white",
    freckles: "Some",
    sunTanning: "Rarely",
    sunBurning: "Often",
    skinReaction: "Sensitive, burns easily",
    familyBackground: "Northern European",
    sunExposure: "Rarely, I avoid the sun",
    ageRange: "Under 30",
    skinType: "Oily skin (shiny, prone to acne)",
  };

  const result = getSkinType(answers);
  return result === "oily";
}

/**
 * Test 5: Verify dry skin type extraction
 */
function testDrySkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Dark brown or black",
    hairColor: "Black",
    skinColor: "Dark brown or black",
    freckles: "None",
    sunTanning: "My skin is naturally dark",
    sunBurning: "Never",
    skinReaction: "Very resistant, never burns",
    familyBackground: "African or Afro-Caribbean",
    sunExposure: "Very often, I spend a lot of time outdoors",
    ageRange: "Over 60",
    skinType: "Dry skin (flaky, tight, rough)",
  };

  const result = getSkinType(answers);
  return result === "dry";
}

/**
 * Test 6: Verify combination skin type extraction
 */
function testCombinationSkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Hazel or light brown",
    hairColor: "Light brown",
    skinColor: "Light brown or olive",
    freckles: "Few",
    sunTanning: "Sometimes",
    sunBurning: "Sometimes",
    skinReaction: "Moderately sensitive",
    familyBackground: "European (mixed)",
    sunExposure: "Occasionally",
    ageRange: "30-40",
    skinType: "Combination skin (oily T-zone, dry cheeks)",
  };

  const result = getSkinType(answers);
  return result === "combination";
}

/**
 * Test 7: Verify sensitive skin type extraction
 */
function testSensitiveSkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Blue or gray",
    hairColor: "Blonde",
    skinColor: "Pale white",
    freckles: "Some",
    sunTanning: "Rarely",
    sunBurning: "Often",
    skinReaction: "Sensitive, burns easily",
    familyBackground: "Northern European",
    sunExposure: "Rarely, I avoid the sun",
    ageRange: "Under 30",
    skinType: "Sensitive skin (easily irritated, red, reactive)",
  };

  const result = getSkinType(answers);
  return result === "sensitive";
}

/**
 * Test 8: Verify default skin type is normal
 */
function testDefaultSkinType() {
  const answers: QuizAnswers = {
    eyeColor: "Hazel or light brown",
    hairColor: "Light brown",
    skinColor: "Light brown or olive",
    freckles: "Few",
    sunTanning: "Sometimes",
    sunBurning: "Sometimes",
    skinReaction: "Moderately sensitive",
    familyBackground: "European (mixed)",
    sunExposure: "Occasionally",
    ageRange: "30-40",
    skinType: "Normal skin (balanced, not too oily or dry)",
  };

  const result = getSkinType(answers);
  return result === "normal";
}

/**
 * Test 9: Verify Fitzpatrick Type II calculation (score 8-16)
 */
function testFitzpatrickTypeII() {
  const answers: QuizAnswers = {
    eyeColor: "Blue or gray",
    hairColor: "Blonde",
    skinColor: "Pale white",
    freckles: "Some",
    sunTanning: "Rarely",
    sunBurning: "Often",
    skinReaction: "Sensitive, burns easily",
    familyBackground: "Northern European",
    sunExposure: "Rarely, I avoid the sun",
    ageRange: "Under 30",
    skinType: "Normal skin (balanced, not too oily or dry)",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 2;
}

/**
 * Test 10: Verify Fitzpatrick Type IV calculation (score 26-30)
 */
function testFitzpatrickTypeIV() {
  const answers: QuizAnswers = {
    eyeColor: "Dark brown",
    hairColor: "Dark brown",
    skinColor: "Moderate brown",
    freckles: "None",
    sunTanning: "Often",
    sunBurning: "Rarely",
    skinReaction: "Minimally sensitive",
    familyBackground: "Mediterranean, Asian, or Hispanic",
    sunExposure: "Often",
    ageRange: "40-50",
    skinType: "Normal skin (balanced, not too oily or dry)",
  };

  const result = calculateFitzpatrickType(answers);
  return result === 4;
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log("\n🧪 Running SPFMatch Test Suite...\n");

  runTest(
    "Test 1: Fitzpatrick Type I",
    testFitzpatrickTypeI,
    "Correctly calculates Type I (very fair skin)",
    "Failed to calculate Type I"
  );

  runTest(
    "Test 2: Fitzpatrick Type VI",
    testFitzpatrickTypeVI,
    "Correctly calculates Type VI (deeply pigmented skin)",
    "Failed to calculate Type VI"
  );

  runTest(
    "Test 3: Fitzpatrick Type III",
    testFitzpatrickTypeIII,
    "Correctly calculates Type III (medium skin)",
    "Failed to calculate Type III"
  );

  runTest(
    "Test 4: Oily Skin Type",
    testOilySkinType,
    "Correctly identifies oily skin type",
    "Failed to identify oily skin type"
  );

  runTest(
    "Test 5: Dry Skin Type",
    testDrySkinType,
    "Correctly identifies dry skin type",
    "Failed to identify dry skin type"
  );

  runTest(
    "Test 6: Combination Skin Type",
    testCombinationSkinType,
    "Correctly identifies combination skin type",
    "Failed to identify combination skin type"
  );

  runTest(
    "Test 7: Sensitive Skin Type",
    testSensitiveSkinType,
    "Correctly identifies sensitive skin type",
    "Failed to identify sensitive skin type"
  );

  runTest(
    "Test 8: Default Normal Skin Type",
    testDefaultSkinType,
    "Correctly defaults to normal skin type",
    "Failed to default to normal skin type"
  );

  runTest(
    "Test 9: Fitzpatrick Type II",
    testFitzpatrickTypeII,
    "Correctly calculates Type II (fair skin)",
    "Failed to calculate Type II"
  );

  runTest(
    "Test 10: Fitzpatrick Type IV",
    testFitzpatrickTypeIV,
    "Correctly calculates Type IV (moderate brown skin)",
    "Failed to calculate Type IV"
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
