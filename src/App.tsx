import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { QuestionnairePage } from "./components/QuestionnairePage";
import { ResultsPage } from "./components/ResultsPage";
import { BlogsPage } from "./components/BlogsPage";
import { ReminderPage } from "./components/ReminderPage";
import { calculateFitzpatrickType } from "./utils/fitzpatrick";
import type { QuestionnaireAnswers, FitzpatrickType } from "./types/questionnaire";

type Page = "home" | "questionnaire" | "results" | "blogs" | "reminder";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [fitzpatrickType, setFitzpatrickType] = useState<FitzpatrickType | undefined>(undefined);

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

  const handleQuestionnaireSubmit = (answers: QuestionnaireAnswers) => {
    setQuestionnaireAnswers(answers);

    // Calculate Fitzpatrick type for the reminder page
    const calculatedType = calculateFitzpatrickType(answers);
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
