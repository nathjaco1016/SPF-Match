import { useState, useEffect, useRef } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { QuizPage, questions, calculateFitzpatrickType } from "./components/QuizPage";
import { ResultsPage } from "./components/ResultsPage";
import { ResourcesPage } from "./components/ResourcesPage";
import { ReminderPage } from "./components/ReminderPage";

type Page = "home" | "quiz" | "results" | "resources" | "reminder";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]> | null>(null);
  const [fitzpatrickType, setFitzpatrickType] = useState<number | undefined>(undefined);

  // Update page title based on current page
  useEffect(() => {
    const pageTitles: Record<Page, string> = {
      home: "Home",
      quiz: "Quiz",
      results: "Results",
      resources: "Resources",
      reminder: "Reminder"
    };
    document.title = `${pageTitles[currentPage]} | SPFMatch`;
  }, [currentPage]);

  // Timer state lifted to App level for persistence
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect that runs at App level
  useEffect(() => {
    if (isActive && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Timer reached 0
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);

            // Show notification
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("SPFMatch Reminder", {
                body: "Time to reapply your sunscreen!",
                icon: "/favicon.ico",
                badge: "/favicon.ico",
              });
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const handleNavigate = (page: string) => {
    // Scroll to top of page
    window.scrollTo(0, 0);
    
    // If navigating to quiz but answers exist, go to results instead
    if (page === "quiz" && quizAnswers) {
      setCurrentPage("results");
    } else {
      setCurrentPage(page as Page);
    }
  };

  const handleQuizSubmit = (answers: Record<string, string | string[]>) => {
    setQuizAnswers(answers);
    
    // Calculate Fitzpatrick type for the reminder page
    const calculatedType = calculateFitzpatrickType(answers);
    setFitzpatrickType(calculatedType);
    window.scrollTo(0, 0);
    setCurrentPage("results");
  };

  const handleRestartQuiz = () => {
    window.scrollTo(0, 0);
    setQuizAnswers(null);
    setCurrentPage("quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        isTimerActive={isActive}
        timeRemaining={timeRemaining}
      />
      
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      
      {currentPage === "quiz" && (
        <QuizPage onSubmit={handleQuizSubmit} />
      )}
      
      {currentPage === "results" && quizAnswers && (
        <ResultsPage
          answers={quizAnswers}
          onRestart={handleRestartQuiz}
        />
      )}
      
      {currentPage === "resources" && <ResourcesPage />}
      
      {currentPage === "reminder" && (
        <ReminderPage 
          fitzpatrickType={fitzpatrickType}
          location={location}
          setLocation={setLocation}
          uvIndex={uvIndex}
          setUvIndex={setUvIndex}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      )}
    </div>
  );
}