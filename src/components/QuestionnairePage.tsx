import { useState } from "react";
import { Button } from "../assets/button";
import { Card, CardContent } from "../assets/card";
import { Label } from "../assets/label";
import { RadioGroup, RadioGroupItem } from "../assets/radio-group";
import { QUESTIONNAIRE_QUESTIONS } from "../constants/questionnaire";
import type { QuestionnaireAnswers } from "../types/questionnaire";

interface QuestionnairePageProps {
  onSubmit: (answers: QuestionnaireAnswers) => void;
}

export function QuestionnairePage({
  onSubmit,
}: QuestionnairePageProps) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});

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
    Object.keys(answers).length === QUESTIONNAIRE_QUESTIONS.length;

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
        {QUESTIONNAIRE_QUESTIONS.map((question, index) => (
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