import { useState, useEffect, useRef } from "react";
import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Alert, AlertDescription } from "../assets/alert";
import { Clock, MapPin, Sun, AlertCircle } from "lucide-react";
import { REAPPLICATION_BASE_TIME, UV_ADJUSTMENT_FACTORS, API_ENDPOINTS, DEFAULT_UV_INDEX, UV_LEVELS } from "../constants/config";

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
    const skinBaseTime = REAPPLICATION_BASE_TIME[fitzpatrick] || REAPPLICATION_BASE_TIME[3];

    // Adjust based on UV index
    if (uv >= UV_ADJUSTMENT_FACTORS.extreme.threshold) {
      return Math.floor(skinBaseTime * UV_ADJUSTMENT_FACTORS.extreme.factor);
    }
    if (uv >= UV_ADJUSTMENT_FACTORS.high.threshold) {
      return Math.floor(skinBaseTime * UV_ADJUSTMENT_FACTORS.high.factor);
    }
    if (uv >= UV_ADJUSTMENT_FACTORS.moderate.threshold) {
      return Math.floor(skinBaseTime * UV_ADJUSTMENT_FACTORS.moderate.factor);
    }
    return skinBaseTime;
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
            `${API_ENDPOINTS.UV_INDEX}?latitude=${latitude}&longitude=${longitude}&current=uv_index`,
          );

          if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (!data?.current?.uv_index && data?.current?.uv_index !== 0) {
            throw new Error("Invalid API response structure");
          }

          setUvIndex(data.current.uv_index);
        } catch (err) {
          console.error("UV Index fetch failed:", err);
          const errorMessage = err instanceof Error
            ? `Failed to fetch UV index: ${err.message}`
            : "Failed to fetch UV index. Using default value.";
          setError(errorMessage);
          setUvIndex(DEFAULT_UV_INDEX);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(
          `Unable to retrieve your location: ${err.message}. Please enable location services.`,
        );
        // Use default UV index if location fails
        setUvIndex(DEFAULT_UV_INDEX);
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
    for (const level of UV_LEVELS) {
      if (uv >= level.threshold) {
        return { level: level.level, color: level.color };
      }
    }
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