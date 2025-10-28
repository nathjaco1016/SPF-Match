import { useState, useEffect, useRef } from "react";
import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Alert, AlertDescription } from "../assets/alert";
import { Clock, MapPin, Sun, AlertCircle } from "lucide-react";

interface ReminderPageProps {
  fitzpatrickType?: number;
}

export function ReminderPage({
  fitzpatrickType = 3,
}: ReminderPageProps) {
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<
    number | null
  >(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [permissionGranted, setPermissionGranted] =
    useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate reapplication time based on UV index and Fitzpatrick type
  const calculateReapplicationTime = (
    uv: number,
    fitzpatrick: number,
  ): number => {
    // Base time in minutes - more sensitive skin needs more frequent application
    const baseTime = {
      1: 30, // Very fair skin - 30 min
      2: 45, // Fair skin - 45 min
      3: 60, // Medium skin - 60 min
      4: 75, // Olive skin - 75 min
      5: 90, // Brown skin - 90 min
      6: 105, // Dark skin - 105 min
    };

    const skinBaseTime =
      baseTime[fitzpatrick as keyof typeof baseTime] || 60;

    // Adjust based on UV index
    if (uv >= 8) return Math.floor(skinBaseTime * 0.5); // Extreme UV
    if (uv >= 6) return Math.floor(skinBaseTime * 0.7); // High UV
    if (uv >= 3) return Math.floor(skinBaseTime * 0.85); // Moderate UV
    return skinBaseTime; // Low UV
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        setPermissionGranted(true);
        setError("");

        // Fetch UV index from Open-Meteo API
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index`,
          );
          const data = await response.json();
          const currentUV = data.current.uv_index;
          setUvIndex(currentUV);
        } catch (err) {
          setError(
            "Failed to fetch UV index. Using default value.",
          );
          setUvIndex(5); // Default moderate UV
        }
      },
      (err) => {
        setError(
          "Unable to retrieve your location. Please enable location services.",
        );
        // Use default UV index if location fails
        setUvIndex(5);
      },
    );
  };

  const startTimer = () => {
    if (uvIndex === null) {
      getLocation();
      return;
    }

    const minutes = calculateReapplicationTime(
      uvIndex,
      fitzpatrickType,
    );
    const seconds = minutes * 60;
    setTimeRemaining(seconds);
    setIsActive(true);

    // Request notification permission
    if (
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  };

  const restartTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsActive(false);
    setTimeRemaining(null);
    startTimer();
  };

  useEffect(() => {
    if (
      isActive &&
      timeRemaining !== null &&
      timeRemaining > 0
    ) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Timer reached 0
            if (timerRef.current)
              clearInterval(timerRef.current);
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getUVLevel = (
    uv: number,
  ): { level: string; color: string } => {
    if (uv >= 11)
      return { level: "Extreme", color: "text-purple-600" };
    if (uv >= 8)
      return { level: "Very High", color: "text-red-600" };
    if (uv >= 6)
      return { level: "High", color: "text-orange-600" };
    if (uv >= 3)
      return { level: "Moderate", color: "text-yellow-600" };
    return { level: "Low", color: "text-green-600" };
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-4">
          Sunscreen Reapplication Reminder
        </h1>
        <p className="text-muted-foreground">
          Set a personalized reminder based on your location's
          UV index and your skin type.
        </p>
      </div>

      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Remember to reapply
          sunscreen after swimming, sweating, and towel drying,
          regardless of the time interval. Apply sunscreen to
          all areas of skin exposed to the sun and apply at
          least 15 minutes before sun exposure.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              <h3>Current UV Index</h3>
            </div>
          </CardHeader>
          <CardContent>
            {uvIndex !== null ? (
              <div>
                <div className="mb-2">
                  <span className={getUVLevel(uvIndex).color}>
                    {uvIndex.toFixed(1)} -{" "}
                    {getUVLevel(uvIndex).level}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {location
                    ? "Based on your current location"
                    : "Using default value"}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Click 'Get Location' to fetch UV index
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h3>Location</h3>
            </div>
          </CardHeader>
          <CardContent>
            {location ? (
              <div>
                <p className="mb-1">
                  Lat: {location.lat.toFixed(4)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Lon: {location.lon.toFixed(4)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-2">
                  Location not set
                </p>
                <Button size="sm" onClick={getLocation}>
                  Get Location
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h3>Reapplication Timer</h3>
          </div>
        </CardHeader>
        <CardContent>
          {timeRemaining !== null ? (
            <div className="text-center">
              <div className="mb-4">
                {timeRemaining === 0 ? (
                  <p className="text-red-600">
                    Time to reapply sunscreen!
                  </p>
                ) : (
                  <p className="text-muted-foreground mb-2">
                    Time until reapplication:
                  </p>
                )}
              </div>
              <div className="mb-6">
                {formatTime(timeRemaining)}
              </div>
              <Button onClick={restartTimer}>
                Restart Timer
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {uvIndex !== null
                  ? `Recommended reapplication: every ${calculateReapplicationTime(
                      uvIndex,
                      fitzpatrickType,
                    )} minutes`
                  : "Get your location to calculate recommended reapplication time"}
              </p>
              <Button onClick={startTimer}>
                {uvIndex !== null
                  ? "Start Timer"
                  : "Get Location & Start Timer"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3>Your Skin Type</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {fitzpatrickType
              ? `Fitzpatrick Type ${fitzpatrickType} - Your timer is adjusted based on your skin's sensitivity to UV exposure.`
              : "Complete the questionnaire to get a personalized timer based on your Fitzpatrick skin type."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}