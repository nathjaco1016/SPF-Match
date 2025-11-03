import type { QuestionnaireQuestion } from "../types/questionnaire";

export const QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
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
    question:
      "What color is your skin in places where it is not exposed to the sun?",
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
    question:
      "Do you turn brown after several hours of sun exposure?",
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
    question:
      "Do you expose your face, or the area to be treated, to the sun?",
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
    question:
      "Which of the following best describes your facial skin?",
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
