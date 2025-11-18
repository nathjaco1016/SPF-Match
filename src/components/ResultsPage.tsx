import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Badge } from "../assets/badge";
import { Alert, AlertTitle, AlertDescription } from "../assets/alert";
import { calculateFitzpatrickType, getSkinType } from "./QuizPage";
import { FITZPATRICK_INFO, SKIN_TYPE_INFO } from "../constants/skinTypeInfo";
import type { SunscreenProduct } from "../types/sunscreen";

interface ResultsPageProps {
  answers: Record<string, string | string[]>;
  onRestart: () => void;
}

export function ResultsPage({
  answers,
  onRestart,
}: ResultsPageProps) {
  const [sunscreenDatabase, setSunscreenDatabase] = useState<
    Record<string, SunscreenProduct[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fitzpatrickType = calculateFitzpatrickType(answers);
  const skinType = getSkinType(answers);
  const skinTypeKey = `${fitzpatrickType}-${skinType}`;

  const fitzpatrickData = FITZPATRICK_INFO[fitzpatrickType as keyof typeof FITZPATRICK_INFO];
  const skinTypeDescription = SKIN_TYPE_INFO[skinType as keyof typeof SKIN_TYPE_INFO];

  // Extract user preferences from answers
  const preferences = {
    filterType: Array.isArray(answers.filterType) ? answers.filterType : [],
    tint: Array.isArray(answers.tint) ? answers.tint : [],
    vehicle: Array.isArray(answers.vehicle) ? answers.vehicle : [],
  };

  // Fetch sunscreen data from static JSON file
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/data/sunscreen-database.json');
        if (!response.ok) {
          throw new Error('Failed to load sunscreen data');
        }

        const data = await response.json();
        setSunscreenDatabase(data);
      } catch (err) {
        console.error("Failed to load sunscreen data:", err);
        setError("Failed to load sunscreen recommendations.");
        setSunscreenDatabase({});
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Get base recommendations for skin type
  const baseRecommendations = sunscreenDatabase[skinTypeKey] || [];

  // Apply preference filtering
  const filterByPreferences = (
    products: SunscreenProduct[],
    prefs: { filterType: string[]; tint: string[]; vehicle: string[] }
  ): SunscreenProduct[] => {
    if (prefs.filterType.length === 0 && prefs.tint.length === 0 && prefs.vehicle.length === 0) {
      return products;
    }

    return products.filter((product) => {
      const matchesFilterType = prefs.filterType.length === 0 || prefs.filterType.includes(product.filterType);
      const matchesTint = prefs.tint.length === 0 || prefs.tint.includes(product.tint);
      const matchesVehicle = prefs.vehicle.length === 0 || prefs.vehicle.includes(product.vehicle);

      return matchesFilterType && matchesTint && matchesVehicle;
    });
  };

  const recommendations = filterByPreferences(baseRecommendations, preferences);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading sunscreen recommendations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="mb-8">
        Your Skin
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <h2>
              Fitzpatrick Skin Type: {fitzpatrickData.name}
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {fitzpatrickData.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2>
              Facial Skin Type:{" "}
              {skinType.charAt(0).toUpperCase() +
                skinType.slice(1)}
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {skinTypeDescription}
            </p>
          </CardContent>
        </Card>
      </div>

      {baseRecommendations.length > 0 && (
        <>
          <h2 className="mb-6">Recommended Sunscreens</h2>

          {recommendations.length === 0 ? (
            <Alert className="mb-8">
              <AlertTitle>No matches found</AlertTitle>
              <AlertDescription>
                We couldn't find any sunscreens matching your exact preferences. Try adjusting your filter, tint, or vehicle preferences in the quiz.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-6 mb-8">
              {recommendations.map((sunscreen, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-[200px_1fr] gap-6">
                      <div className="bg-muted rounded-lg overflow-hidden h-[200px] flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Product Image</span>
                      </div>
                      <div>
                        <h3 className="mb-3">{sunscreen.name}</h3>
                        <p className="text-muted-foreground mb-4">
                          {sunscreen.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <span className="text-muted-foreground">
                              Filter Type:
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-2"
                            >
                              {sunscreen.filterType}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              SPF:
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-2"
                            >
                              {sunscreen.spf}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Vehicle:
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-2"
                            >
                              {sunscreen.vehicle}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Tint:
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-2"
                            >
                              {sunscreen.tint}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <span className="text-muted-foreground">
                              Price:
                            </span>
                            <span className="ml-2">
                              ${sunscreen.price.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Size:
                            </span>
                            <span className="ml-2">
                              {sunscreen.size} fl oz
                            </span>
                          </div>
                          {sunscreen.unitPrice && (
                            <div>
                              <span className="text-muted-foreground">
                                Unit Price:
                              </span>
                              <span className="ml-2">
                                ${sunscreen.unitPrice.toFixed(2)}/fl oz
                              </span>
                            </div>
                          )}
                        </div>
                        {sunscreen.link && (
                          <div className="mt-4">
                            <Button
                              asChild
                              variant="default"
                              size="sm"
                            >
                              <a
                                href={sunscreen.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Product
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" onClick={onRestart}>
          Restart Quiz
        </Button>
        <Button size="lg" variant="outline" asChild className="gap-2">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfY9xCSju8owhTAGZZphkUsMWJflbYndIDjeNf78UFoeWOkGQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share Feedback
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
