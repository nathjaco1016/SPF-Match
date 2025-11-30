/**
 * Simple test runner for SPFMatch tests
 * Run with: node run-tests.js
 */

// Mock quiz questions and config
const QUIZ_QUESTIONS = [
  {
    id: "eyeColor",
    options: ["Light blue, gray, or green", "Blue or gray", "Hazel or light brown", "Dark brown", "Dark brown or black"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "hairColor",
    options: ["Red or light blonde", "Blonde", "Light brown", "Dark brown", "Black"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "skinColor",
    options: ["Ivory white", "Pale white", "Light brown or olive", "Moderate brown", "Dark brown or black"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "freckles",
    options: ["Many", "Some", "Few", "None", "None"],
    scores: [0, 1, 2, 4, 4]
  },
  {
    id: "sunTanning",
    options: ["Never, I only burn", "Rarely", "Sometimes", "Often", "My skin is naturally dark"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "sunBurning",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "skinReaction",
    options: ["Very sensitive, often burns", "Sensitive, burns easily", "Moderately sensitive", "Minimally sensitive", "Very resistant, never burns"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "familyBackground",
    options: ["Scandinavian, Irish, or Scottish", "Northern European", "European (mixed)", "Mediterranean, Asian, or Hispanic", "African or Afro-Caribbean"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "sunExposure",
    options: ["Rarely, I avoid the sun", "Rarely, I avoid the sun", "Occasionally", "Often", "Very often, I spend a lot of time outdoors"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "ageRange",
    options: ["Under 30", "30-40", "40-50", "50-60", "Over 60"],
    scores: [0, 1, 2, 3, 4]
  },
  {
    id: "skinType",
    options: [
      "Normal skin (balanced, not too oily or dry)",
      "Oily skin (shiny, prone to acne)",
      "Dry skin (flaky, tight, rough)",
      "Combination skin (oily T-zone, dry cheeks)",
      "Sensitive skin (easily irritated, red, reactive)"
    ],
    types: ["normal", "oily", "dry", "combination", "sensitive"]
  }
];

const FITZPATRICK_THRESHOLDS = {
  1: 7,
  2: 16,
  3: 25,
  4: 30,
  5: 34
};

// Utility functions
function calculateFitzpatrickType(answers) {
  let totalScore = 0;

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

// Test functions
function testFitzpatrickTypeI() {
  const answers = {
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

function testFitzpatrickTypeVI() {
  const answers = {
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

function testFitzpatrickTypeIII() {
  const answers = {
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

function testOilySkinType() {
  const answers = {
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

function testDrySkinType() {
  const answers = {
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

function testCombinationSkinType() {
  const answers = {
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

function testSensitiveSkinType() {
  const answers = {
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

function testDefaultSkinType() {
  const answers = {
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

function testFitzpatrickTypeII() {
  const answers = {
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

function testFitzpatrickTypeIV() {
  const answers = {
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

// Run all tests
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
