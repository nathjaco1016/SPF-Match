import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Badge } from "../assets/badge";
import { ImageWithFallback } from "./ImageWithFallback";
import { calculateFitzpatrickType, getSkinType } from "../utils/fitzpatrick";
import { FITZPATRICK_INFO, SKIN_TYPE_INFO } from "../constants/skinTypeInfo";
import { SUNSCREEN_DATABASE } from "../constants/sunscreenDatabase";
import type { QuestionnaireAnswers } from "../types/questionnaire";

interface ResultsPageProps {
  answers: QuestionnaireAnswers;
  onRestart: () => void;
}

export function ResultsPage({
  answers,
  onRestart,
}: ResultsPageProps) {
  const fitzpatrickType = calculateFitzpatrickType(answers);
  const skinType = getSkinType(answers);
  const skinTypeKey = `${fitzpatrickType}-${skinType}`;

  const fitzpatrickData = FITZPATRICK_INFO[fitzpatrickType];
  const skinTypeDescription = SKIN_TYPE_INFO[skinType];

  const recommendations =
    SUNSCREEN_DATABASE[skinTypeKey] ||
    SUNSCREEN_DATABASE["3-normal"];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="mb-8">
        Your Recommended Sunscreen and Care
      </h1>

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

      <h2 className="mb-6">Recommended Sunscreens</h2>

      <div className="grid gap-6 mb-8">
        {recommendations.map((sunscreen, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-[200px_1fr] gap-6">
                <div className="bg-muted rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1556228841-a6b5e0e56f95?w=400&h=400&fit=crop`}
                    alt={sunscreen.name}
                    className="w-full h-[200px] object-cover"
                  />
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
                  <div className="flex items-center gap-6">
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
                    <div>
                      <span className="text-muted-foreground">
                        Unit Price:
                      </span>
                      <span className="ml-2">
                        $
                        {(
                          sunscreen.price / sunscreen.size
                        ).toFixed(2)}
                        /fl oz
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" onClick={onRestart}>
          Restart Questionnaire
        </Button>
      </div>
    </div>
  );
}
