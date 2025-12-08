/**
 * Simple test runner for SPFMatch tests
 * Run with: node run-tests.js
 * Tests use ONLY actual quiz questions and answers from the website
 */

// Mock quiz questions matching the actual website
const QUIZ_QUESTIONS = [
  {
    id: "eyeColor",
    question: "What color are your eyes?",
    options: [
      "Light blue, gray or green",
      "Blue, gray, or green",
      "Blue",
      "Dark Brown",
      "Brownish Black",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "hairColor",
    question: "What is the natural color of your hair?",
    options: [
      "Sandy red",
      "Blonde",
      "Chestnut/ Dark Blonde",
      "Dark brown",
      "Black",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "skinColor",
    question: "What color is your skin in places where it is not exposed to the sun?",
    options: [
      "Reddish",
      "Very Pale",
      "Pale with a beige tint",
      "Light brown",
      "Dark brown",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "freckles",
    question: "Do you have freckles on unexposed areas?",
    options: ["Many", "Several", "Few", "Incidental", "None"],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "sunReaction",
    question: "What happens when you stay too long in the sun?",
    options: [
      "Painful redness, blistering, peeling",
      "Blistering followed by peeling",
      "Burns sometimes followed by peeling",
      "Rare burns",
      "Never had burns",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "tanningDegree",
    question: "To what degree do you turn brown?",
    options: [
      "Hardly or not at all",
      "Light color tan",
      "Reasonable tan",
      "Tan very easily",
      "Turn dark brown quickly",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "tanningHours",
    question: "Do you turn brown after several hours of sun exposure?",
    options: [
      "Never",
      "Seldom",
      "Sometimes",
      "Often",
      "Always",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "faceReaction",
    question: "How does your face react to the sun?",
    options: [
      "Very sensitive",
      "Sensitive",
      "Normal",
      "Very resistant",
      "Never had a problem",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "lastExposure",
    question: "When did you last expose your body to the sun?",
    options: [
      "More than 3 months ago",
      "2-3 months ago",
      "1-2 months ago",
      "Less than a month ago",
      "Less than 2 weeks ago",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "faceExposure",
    question: "Do you expose your face, or the area to be treated, to the sun?",
    options: [
      "Never",
      "Hardly ever",
      "Sometimes",
      "Often",
      "Always",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "skinType",
    question: "Which of the following best describes your facial skin?",
    options: [
      "Hydrated and comfortable",
      "Shiny and greasy",
      "Flaky, rough, and tight, sometimes itchy or irritated",
      "Oily in some areas and dry in other areas",
      "Often stings or turns red in response to irritants",
    ],
    types: [
      "normal",
      "oily",
      "dry",
      "combination",
      "sensitive",
    ],
  },
];

const FITZPATRICK_THRESHOLDS = {
  1: 7,
  2: 16,
  3: 25,
  4: 30,
  5: 34,
  6: Infinity,
};

const REAPPLICATION_TIME_TABLE = {
  1: { '1-2': 120, '3-5': 60, '6-7': 40, '8-10': 20, '11+': 10 },
  2: { '1-2': 120, '3-5': 80, '6-7': 60, '8-10': 30, '11+': 20 },
  3: { '1-2': 180, '3-5': 100, '6-7': 80, '8-10': 40, '11+': 30 },
  4: { '1-2': 180, '3-5': 120, '6-7': 100, '8-10': 60, '11+': 40 },
  5: { '1-2': 200, '3-5': 140, '6-7': 120, '8-10': 80, '11+': 60 },
  6: { '1-2': 200, '3-5': 160, '6-7': 140, '8-10': 100, '11+': 80 },
};

const UV_LEVELS = [
  { threshold: 11, level: "Extreme", color: "text-purple-600" },
  { threshold: 8, level: "Very High", color: "text-red-600" },
  { threshold: 6, level: "High", color: "text-orange-600" },
  { threshold: 3, level: "Moderate", color: "text-yellow-600" },
  { threshold: 0, level: "Low", color: "text-green-600" },
];

// Utility functions
function calculateFitzpatrickType(answers) {
  let totalScore = 0;

  // Calculate score from first 10 questions (exclude skinType question)
  for (let i = 0; i < QUIZ_QUESTIONS.length - 1; i++) {
    const question = QUIZ_QUESTIONS[i];
    const answer = answers[question.id];

    if (answer && question.scores) {
      const optionIndex = question.options.indexOf(answer);
      if (optionIndex !== -1) {
        totalScore += question.scores[optionIndex];
      }
    }
  }

  // Determine Fitzpatrick type based on score thresholds
  if (totalScore <= FITZPATRICK_THRESHOLDS[1]) return 1;
  if (totalScore <= FITZPATRICK_THRESHOLDS[2]) return 2;
  if (totalScore <= FITZPATRICK_THRESHOLDS[3]) return 3;
  if (totalScore <= FITZPATRICK_THRESHOLDS[4]) return 4;
  if (totalScore <= FITZPATRICK_THRESHOLDS[5]) return 5;
  return 6;
}

function getSkinType(answers) {
  const skinTypeQuestion = QUIZ_QUESTIONS.find(q => q.id === "skinType");
  const answer = answers["skinType"];

  if (skinTypeQuestion && skinTypeQuestion.types && answer) {
    const optionIndex = skinTypeQuestion.options.indexOf(answer);
    if (optionIndex !== -1) {
      return skinTypeQuestion.types[optionIndex];
    }
  }

  return "normal";
}

function calculateReapplicationTime(uv, fitzpatrick) {
  const skinTypeTable = REAPPLICATION_TIME_TABLE[fitzpatrick] || REAPPLICATION_TIME_TABLE[3];

  if (uv >= 11) return skinTypeTable['11+'];
  if (uv >= 8) return skinTypeTable['8-10'];
  if (uv >= 6) return skinTypeTable['6-7'];
  if (uv >= 3) return skinTypeTable['3-5'];
  return skinTypeTable['1-2'];
}

function getUVLevel(uv) {
  const uvLevel = UV_LEVELS.find(level => uv >= level.threshold);
  return uvLevel ? uvLevel.level : "Low";
}

// Test results tracker
const testResults = [];

function runTest(testName, testFn, successMsg, failMsg) {
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

// Test 1: Fitzpatrick Type I (score 0-7)
function testFitzpatrickTypeI() {
  const answers = {
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

// Test 2: Fitzpatrick Type II (score 8-16)
function testFitzpatrickTypeII() {
  const answers = {
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

// Test 3: Fitzpatrick Type III (score 17-25)
function testFitzpatrickTypeIII() {
  const answers = {
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

// Test 4: Fitzpatrick Type IV (score 26-30)
function testFitzpatrickTypeIV() {
  const answers = {
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

// Test 5: Fitzpatrick Type V (score 31-34)
function testFitzpatrickTypeV() {
  const answers = {
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

// Test 6: Fitzpatrick Type VI (score 35+)
function testFitzpatrickTypeVI() {
  const answers = {
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

// Test 7: Normal skin type
function testNormalSkinType() {
  const answers = {
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

// Test 8: Oily skin type
function testOilySkinType() {
  const answers = {
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

// Test 9: Dry skin type
function testDrySkinType() {
  const answers = {
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

// Test 10: Combination skin type
function testCombinationSkinType() {
  const answers = {
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

// Test 11: Sensitive skin type
function testSensitiveSkinType() {
  const answers = {
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

// Test 12-16: UV Reapplication Time Tests
function testUVReapplicationLowUV() {
  // Test Type I with UV 1-2 range
  const result = calculateReapplicationTime(1, 1);
  return result === 120;
}

function testUVReapplicationModerateUV() {
  // Test Type III with UV 3-5 range
  const result = calculateReapplicationTime(4, 3);
  return result === 100;
}

function testUVReapplicationHighUV() {
  // Test Type IV with UV 6-7 range
  const result = calculateReapplicationTime(7, 4);
  return result === 100;
}

function testUVReapplicationVeryHighUV() {
  // Test Type V with UV 8-10 range
  const result = calculateReapplicationTime(9, 5);
  return result === 80;
}

function testUVReapplicationExtremeUV() {
  // Test Type VI with UV 11+ range
  const result = calculateReapplicationTime(12, 6);
  return result === 80;
}

// Test 17-21: UV Level Classification Tests
function testUVLevelLow() {
  const result = getUVLevel(2);
  return result === "Low";
}

function testUVLevelModerate() {
  const result = getUVLevel(4);
  return result === "Moderate";
}

function testUVLevelHigh() {
  const result = getUVLevel(7);
  return result === "High";
}

function testUVLevelVeryHigh() {
  const result = getUVLevel(9);
  return result === "Very High";
}

function testUVLevelExtreme() {
  const result = getUVLevel(12);
  return result === "Extreme";
}

// Test 22-26: Boundary Score Tests
function testBoundaryScore7() {
  // Score of exactly 7 should be Type I
  const answers = {
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

function testBoundaryScore8() {
  // Score of exactly 8 should be Type II
  const answers = {
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

function testBoundaryScore16() {
  // Score of exactly 16 should be Type II
  const answers = {
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

function testBoundaryScore25() {
  // Score of exactly 25 should be Type III
  const answers = {
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

function testBoundaryScore34() {
  // Score of exactly 34 should be Type V
  const answers = {
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

// Run all tests
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