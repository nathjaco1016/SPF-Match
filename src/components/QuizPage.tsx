import { useState } from "react";
import { Button } from "../assets/button";
import { Card, CardContent } from "../assets/card";
import { Label } from "../assets/label";
import { RadioGroup, RadioGroupItem } from "../assets/radio-group";
import { Checkbox } from "../assets/checkbox";
import { AlertCircle } from "lucide-react";

interface QuizPageProps {
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

export const questions = [
  {
    id: "eyeColor",
    question: "What color are your eyes?",
    options: [
      "Light blue, gray, or green",
      "Blue, gray, or green",
      "Blue",
      "Dark brown",
      "Brownish black",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "hairColor",
    question: "What is the natural color of your hair?",
    options: [
      "Sandy red",
      "Blonde",
      "Chestnut/dark blonde",
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
  {
    id: "filterType",
    question: "Which sunscreen filter type would you like?",
    options: [
      "Physical",
      "Chemical",
      "Mixture",
      "Anything is fine",
    ],
  },
  {
    id: "tint",
    question: "Which sunscreen tint would you like?",
    options: [
      "Skin-colored",
      "Transparent",
      "No tint",
      "Anything is fine",
    ],
  },
  {
    id: "vehicle",
    question: "Which form of sunscreen would you like?",
    options: [
      "Cream/lotion",
      "Spray",
      "Powder",
      "Anything is fine",
    ],
  },
];

export function calculateFitzpatrickType(
  answers: Record<string, string | string[]>,
): number {
  let totalScore = 0;

  for (let i = 0; i < questions.length - 1; i++) {
    const question = questions[i];
    const answer = answers[question.id];
    // Skip if answer is an array (preference questions)
    if (typeof answer === 'string') {
      const optionIndex = question.options.indexOf(answer);
      if (optionIndex !== -1 && question.scores) {
        totalScore += question.scores[optionIndex];
      }
    }
  }

  if (totalScore <= 7) return 1;
  if (totalScore <= 16) return 2;
  if (totalScore <= 25) return 3;
  if (totalScore <= 30) return 4;
  if (totalScore <= 34) return 5;
  return 6;
}

export function QuizPage({
  onSubmit,
}: QuizPageProps) {
  const [answers, setAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [showValidation, setShowValidation] = useState(false);

  const handleAnswerChange = (
    questionId: string,
    value: string,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear validation when user answers a question
    if (showValidation) {
      setShowValidation(false);
    }
  };

  const handleCheckboxChange = (
    questionId: string,
    value: string,
  ) => {
    setAnswers((prev) => {
      const currentValues = (prev[questionId] as string[]) || [];
      
      // If "Anything is fine" is clicked
      if (value === "Anything is fine") {
        if (currentValues.includes("Anything is fine")) {
          // Uncheck "Anything is fine"
          return {
            ...prev,
            [questionId]: [],
          };
        } else {
          // Check only "Anything is fine" and clear others
          return {
            ...prev,
            [questionId]: ["Anything is fine"],
          };
        }
      }
      
      // If any other option is clicked, remove "Anything is fine"
      const filteredValues = currentValues.filter(
        (v) => v !== "Anything is fine",
      );
      
      if (filteredValues.includes(value)) {
        // Uncheck this value
        return {
          ...prev,
          [questionId]: filteredValues.filter((v) => v !== value),
        };
      } else {
        // Check this value
        return {
          ...prev,
          [questionId]: [...filteredValues, value],
        };
      }
    });
    // Clear validation when user answers a question
    if (showValidation) {
      setShowValidation(false);
    }
  };

  const isComplete = Object.keys(answers).length === questions.length &&
    Object.values(answers).every((value) => 
      typeof value === "string" ? value !== "" : (value as string[]).length > 0
    );

  const handleSubmit = () => {
    if (isComplete) {
      onSubmit(answers);
    } else {
      setShowValidation(true);
      // Scroll to first unanswered question
      const firstUnanswered = questions.find((q) => {
        const answer = answers[q.id];
        if (typeof answer === "string") {
          return !answer;
        } else {
          return !answer || answer.length === 0;
        }
      });
      if (firstUnanswered) {
        const element = document.getElementById(firstUnanswered.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-4">Skin Type Quiz</h1>
        <p className="text-muted-foreground">
          Answer all questions below to receive personalized
          sunscreen recommendations.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((question, index) => {
          const answer = answers[question.id];
          const isAnswered = typeof answer === "string" ? !!answer : (answer && answer.length > 0);
          const showError = showValidation && !isAnswered;
          
          return (
          <div key={question.id} id={question.id}>
            {index === questions.length - 3 && (
              <div className="mb-6 p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                <p className="text-foreground">
                  For the following questions, select all that apply or choose "Anything is fine" if you have no preference.
                </p>
              </div>
            )}
            <Card
              className={`border-2 shadow-md bg-card transition-colors ${
                showError 
                  ? "border-red-500" 
                  : "border-primary/20"
              }`}
            >
              <CardContent className="pt-6 pb-6">
                <Label className={`mb-5 block ${showError ? "text-red-600" : "text-foreground"}`}>
                  {index + 1}. {question.question}
                  {showError && <span className="ml-2 text-red-600">*Required</span>}
                </Label>
                {index >= questions.length - 3 ? (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const selectedValues = (answers[question.id] as string[]) || [];
                      const isChecked = selectedValues.includes(option);
                      return (
                        <div
                          key={optionIndex}
                          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            isChecked
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          onClick={() =>
                            handleCheckboxChange(question.id, option)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() =>
                                handleCheckboxChange(question.id, option)
                              }
                              id={`${question.id}-${optionIndex}`}
                              className={`border-2 ${
                                isChecked 
                                  ? "data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-primary" 
                                  : ""
                              }`}
                            />
                            <Label
                              htmlFor={`${question.id}-${optionIndex}`}
                              className="cursor-pointer flex-1"
                            >
                              {option}
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[question.id] as string || ""}
                    onValueChange={(value) =>
                      handleAnswerChange(question.id, value)
                    }
                    className="space-y-3"
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          answers[question.id] === option
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                        }`}
                        onClick={() =>
                          handleAnswerChange(question.id, option)
                        }
                      >
                        <RadioGroupItem
                          value={option}
                          id={`${question.id}-${optionIndex}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`${question.id}-${optionIndex}`}
                          className="cursor-pointer block"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          </div>
        );
        })}
      </div>

      <div className="text-center">
        <Button
          size="lg"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        {showValidation && !isComplete && (
          <div className="mt-4 flex justify-center">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg inline-flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="size-4" />
              <span>Please answer all required questions above</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}