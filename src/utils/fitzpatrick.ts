import type { QuestionnaireAnswers, FitzpatrickType } from "../types/questionnaire";
import type { SkinType } from "../types/sunscreen";
import { QUESTIONNAIRE_QUESTIONS } from "../constants/questionnaire";
import { FITZPATRICK_THRESHOLDS } from "../constants/config";

/**
 * Calculate Fitzpatrick skin type based on questionnaire answers
 * @param answers User's questionnaire responses
 * @returns Fitzpatrick type (1-6)
 */
export function calculateFitzpatrickType(
  answers: QuestionnaireAnswers
): FitzpatrickType {
  let totalScore = 0;

  // Calculate score from first 10 questions (exclude skinType question)
  for (let i = 0; i < QUESTIONNAIRE_QUESTIONS.length - 1; i++) {
    const question = QUESTIONNAIRE_QUESTIONS[i];
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

/**
 * Extract skin type from questionnaire answers
 * @param answers User's questionnaire responses
 * @returns Skin type (normal, oily, dry, combination, sensitive)
 */
export function getSkinType(answers: QuestionnaireAnswers): SkinType {
  const skinTypeQuestion = QUESTIONNAIRE_QUESTIONS.find(
    (q) => q.id === "skinType"
  );

  const answer = answers["skinType"];

  if (skinTypeQuestion && skinTypeQuestion.types && answer) {
    const optionIndex = skinTypeQuestion.options.indexOf(answer);
    if (optionIndex !== -1) {
      return skinTypeQuestion.types[optionIndex] as SkinType;
    }
  }

  return "normal";
}
