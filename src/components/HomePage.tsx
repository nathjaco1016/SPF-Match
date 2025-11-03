import { Button } from "../assets/button";
import { Card, CardContent } from "../assets/card";
import { Sun, Sparkles, Shield, Clock, BookOpen } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber-50 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Sun className="w-10 h-10 text-primary" />
            </div>
            <h1 className="mb-6">
              Find Your Perfect Sunscreen Match
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Get personalized sunscreen recommendations based
              on your unique skin characteristics, Fitzpatrick
              skin type, and skin care needs. Our science-backed
              questionnaire analyzes your features to find the
              perfect SPF protection for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => onNavigate("questionnaire")}
                className="gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Take the Questionnaire
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("blogs")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="mb-4">How SPFMatch Helps You</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Protect your skin with confidence using our
            comprehensive sun protection tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
            onClick={() => onNavigate("questionnaire")}
          >
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Find Your Match</h3>
              <p className="text-muted-foreground">
                Answer 11 questions about your skin, hair, and
                sun sensitivity to get personalized sunscreen
                recommendations.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
            onClick={() => onNavigate("reminder")}
          >
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Smart Reminders</h3>
              <p className="text-muted-foreground">
                Get UV-based reapplication reminders tailored to
                your location and skin type for optimal
                protection.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
            onClick={() => onNavigate("blogs")}
          >
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Expert Resources</h3>
              <p className="text-muted-foreground">
                Access curated articles and guides about
                sunscreen application, UV protection, and skin
                health.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Why Section */}
      <div className="bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center">
            <h2 className="mb-6">Why Use SPFMatch?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="mb-1">
                    Scientifically Validated
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Based on the Fitzpatrick skin type
                    classification system used by dermatologists
                    worldwide
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="mb-1">Personalized Results</h4>
                  <p className="text-muted-foreground text-sm">
                    Recommendations tailored to your unique skin
                    characteristics and sensitivity
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="mb-1">Complete Information</h4>
                  <p className="text-muted-foreground text-sm">
                    Get details on SPF, filter type, vehicle,
                    pricing, and more for each recommendation
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="mb-1">
                    Location-Based Alerts
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Real-time UV index monitoring for accurate
                    reapplication timing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}