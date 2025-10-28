import { useState } from "react";
import { Button } from "../assets/button";
import { Card, CardContent } from "../assets/card";
import { Label } from "../assets/label";
import { RadioGroup, RadioGroupItem } from "../assets/radio-group";

interface QuestionnairePageProps {
  onSubmit: (answers: Record<string, string>) => void;
}

const questions = [
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

export function QuestionnairePage({
  onSubmit,
}: QuestionnairePageProps) {
  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  const handleAnswerChange = (
    questionId: string,
    value: string,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isComplete =
    Object.keys(answers).length === questions.length;

  const handleSubmit = () => {
    if (isComplete) {
      onSubmit(answers);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-4">Skin Type Questionnaire</h1>
        <p className="text-muted-foreground">
          Answer all questions below to receive personalized
          sunscreen recommendations.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((question, index) => (
          <Card
            key={question.id}
            className="border-2 border-primary/20 shadow-md bg-card"
          >
            <CardContent className="pt-6 pb-6">
              <Label className="mb-5 block text-foreground">
                {index + 1}. {question.question}
              </Label>
              <RadioGroup
                value={answers[question.id] || ""}
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!isComplete}
          className={
            !isComplete ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          Submit
        </Button>
      </div>
    </div>
  );
}