import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { QuestionnairePage } from "./components/QuestionnairePage";
import { ResultsPage } from "./components/ResultsPage";
import { BlogsPage } from "./components/BlogsPage";
import { ReminderPage } from "./components/ReminderPage";

type Page = "home" | "questionnaire" | "results" | "blogs" | "reminder";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, string> | null>(null);
  const [fitzpatrickType, setFitzpatrickType] = useState<number | undefined>(undefined);

  const handleNavigate = (page: string) => {
    // Scroll to top of page
    window.scrollTo(0, 0);
    
    // If navigating to questionnaire but answers exist, go to results instead
    if (page === "questionnaire" && questionnaireAnswers) {
      setCurrentPage("results");
    } else {
      setCurrentPage(page as Page);
    }
  };

  const handleQuestionnaireSubmit = (answers: Record<string, string>) => {
    setQuestionnaireAnswers(answers);
    
    // Calculate Fitzpatrick type for the reminder page
    const questions = [
      { id: "eyeColor", scores: [0, 1, 2, 3, 4] },
      { id: "hairColor", scores: [0, 1, 2, 3, 4] },
      { id: "skinColor", scores: [0, 1, 2, 3, 4] },
      { id: "freckles", scores: [0, 1, 2, 3, 4] },
      { id: "sunReaction", scores: [0, 1, 2, 3, 4] },
      { id: "tanningDegree", scores: [0, 1, 2, 3, 4] },
      { id: "tanningHours", scores: [0, 1, 2, 3, 4] },
      { id: "faceReaction", scores: [0, 1, 2, 3, 4] },
      { id: "lastExposure", scores: [0, 1, 2, 3, 4] },
      { id: "faceExposure", scores: [0, 1, 2, 3, 4] },
    ];

    const options = [
      ["Light blue, gray or green", "Blue, gray, or green", "Blue", "Dark Brown", "Brownish Black"],
      ["Sandy red", "Blonde", "Chestnut/ Dark Blonde", "Dark brown", "Black"],
      ["Reddish", "Very Pale", "Pale with a beige tint", "Light brown", "Dark brown"],
      ["Many", "Several", "Few", "Incidental", "None"],
      ["Painful redness, blistering, peeling", "Blistering followed by peeling", "Burns sometimes followed by peeling", "Rare burns", "Never had burns"],
      ["Hardly or not at all", "Light color tan", "Reasonable tan", "Tan very easily", "Turn dark brown quickly"],
      ["Never", "Seldom", "Sometimes", "Often", "Always"],
      ["Very sensitive", "Sensitive", "Normal", "Very resistant", "Never had a problem"],
      ["More than 3 months ago", "2-3 months ago", "1-2 months ago", "Less than a month ago", "Less than 2 weeks ago"],
      ["Never", "Hardly ever", "Sometimes", "Often", "Always"],
    ];

    let totalScore = 0;
    questions.forEach((question, index) => {
      const answer = answers[question.id];
      const optionIndex = options[index].indexOf(answer);
      if (optionIndex !== -1) {
        totalScore += question.scores[optionIndex];
      }
    });

    let calculatedType = 3;
    if (totalScore <= 7) calculatedType = 1;
    else if (totalScore <= 16) calculatedType = 2;
    else if (totalScore <= 25) calculatedType = 3;
    else if (totalScore <= 30) calculatedType = 4;
    else if (totalScore <= 34) calculatedType = 5;
    else calculatedType = 6;

    setFitzpatrickType(calculatedType);
    window.scrollTo(0, 0);
    setCurrentPage("results");
  };

  const handleRestartQuestionnaire = () => {
    window.scrollTo(0, 0);
    setQuestionnaireAnswers(null);
    setCurrentPage("questionnaire");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      
      {currentPage === "questionnaire" && (
        <QuestionnairePage onSubmit={handleQuestionnaireSubmit} />
      )}
      
      {currentPage === "results" && questionnaireAnswers && (
        <ResultsPage
          answers={questionnaireAnswers}
          onRestart={handleRestartQuestionnaire}
        />
      )}
      
      {currentPage === "blogs" && <BlogsPage />}
      
      {currentPage === "reminder" && (
        <ReminderPage fitzpatrickType={fitzpatrickType} />
      )}
    </div>
  );
}
