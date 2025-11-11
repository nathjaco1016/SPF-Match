import { useState, useEffect } from "react";
import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Alert, AlertDescription } from "../assets/alert";
import { Clock, MapPin, Sun, AlertCircle } from "lucide-react";

interface ReminderPageProps {
  fitzpatrickType?: number;
  location: { lat: number; lon: number } | null;
  setLocation: (location: { lat: number; lon: number } | null) => void;
  uvIndex: number | null;
  setUvIndex: (uvIndex: number | null) => void;
  timeRemaining: number | null;
  setTimeRemaining: (time: number | null) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export function ReminderPage({
  fitzpatrickType = 3,
  location,
  setLocation,
  uvIndex,
  setUvIndex,
  timeRemaining,
  setTimeRemaining,
  isActive,
  setIsActive,
}: ReminderPageProps) {
  const [error, setError] = useState<string>("");
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Automatically get location on mount
  useEffect(() => {
    if (location === null && uvIndex === null) {
      getLocation();
    }
  }, []);

  // Calculate reapplication time based on UV index and Fitzpatrick type
  const calculateReapplicationTime = (
    uv: number,
    fitzpatrick: number,
  ): number => {
    // Time in minutes based on Fitzpatrick type and UV index
    const timeTable: { [key: number]: { [key: string]: number } } = {
      1: { '1-2': 120, '3-5': 60, '6-7': 40, '8-10': 20, '11+': 10 },
      2: { '1-2': 120, '3-5': 80, '6-7': 60, '8-10': 30, '11+': 20 },
      3: { '1-2': 180, '3-5': 100, '6-7': 80, '8-10': 40, '11+': 30 },
      4: { '1-2': 180, '3-5': 120, '6-7': 100, '8-10': 60, '11+': 40 },
      5: { '1-2': 200, '3-5': 140, '6-7': 120, '8-10': 80, '11+': 60 },
      6: { '1-2': 200, '3-5': 160, '6-7': 140, '8-10': 100, '11+': 80 },
    };

    const skinTypeTable = timeTable[fitzpatrick] || timeTable[3];

    // Determine UV range
    if (uv >= 11) return skinTypeTable['11+'];
    if (uv >= 8) return skinTypeTable['8-10'];
    if (uv >= 6) return skinTypeTable['6-7'];
    if (uv >= 3) return skinTypeTable['3-5'];
    return skinTypeTable['1-2'];
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

    // If UV index is 1, don't start timer
    if (uvIndex <= 1) {
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
    setIsActive(false);
    setTimeRemaining(null);
    startTimer();
  };

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
          all areas of skin exposed to the sun, and apply at
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
                Fetching UV index...
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
            {error ? (
              <div className="text-sm text-destructive">
                {error}
              </div>
            ) : location ? (
              <div>
                <p className="mb-1">
                  Lat: {location.lat.toFixed(4)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Lon: {location.lon.toFixed(4)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Fetching location...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

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
                  ? uvIndex <= 1
                    ? "The UV index is currently very low. Check back later as UV levels typically increase throughout the day."
                    : `Recommended reapplication: every ${calculateReapplicationTime(
                        uvIndex,
                        fitzpatrickType,
                      )} minutes`
                  : "Get your location to calculate recommended reapplication time"}
              </p>
              <Button onClick={startTimer} disabled={uvIndex !== null && uvIndex <= 1}>
                {uvIndex !== null
                  ? uvIndex <= 1
                    ? "No Timer Needed Right Now"
                    : "Start Timer"
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
              ? `Fitzpatrick Type ${['I', 'II', 'III', 'IV', 'V', 'VI'][fitzpatrickType - 1]} - Your timer is adjusted based on your skin's sensitivity to UV exposure.`
              : "Complete the quiz to get a personalized timer based on your Fitzpatrick skin type."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}