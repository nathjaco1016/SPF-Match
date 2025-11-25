import { useState, useEffect } from "react";
import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Alert, AlertDescription } from "../assets/alert";
import { Clock, MapPin, Sun, AlertCircle } from "lucide-react";
import { REAPPLICATION_TIME_TABLE, UV_LEVELS } from "../constants/config";

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
    const skinTypeTable = REAPPLICATION_TIME_TABLE[fitzpatrick] || REAPPLICATION_TIME_TABLE[3];

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
    const uvLevel = UV_LEVELS.find(level => uv >= level.threshold);
    return { level: uvLevel?.level || "Low", color: uvLevel?.color || "text-green-600" };
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

      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Remember to reapply
          sunscreen after swimming, sweating, and towel drying,
          regardless of the time interval. Apply sunscreen to
          all areas of skin exposed to the sun, and apply at
          least 15 minutes before sun exposure.
        </AlertDescription>
      </Alert>

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

      <Card>
        <CardHeader>
          <h3>Reapplication Time Guidelines</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Recommended sunscreen reapplication intervals (in minutes) based on Fitzpatrick skin type and UV index:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Fitzpatrick Type</th>
                  <th className="text-center py-2 px-2">UV 1-2</th>
                  <th className="text-center py-2 px-2">UV 3-5</th>
                  <th className="text-center py-2 px-2">UV 6-7</th>
                  <th className="text-center py-2 px-2">UV 8-10</th>
                  <th className="text-center py-2 px-2">UV 11+</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(REAPPLICATION_TIME_TABLE).map(([type, times]) => (
                  <tr
                    key={type}
                    className={`border-b ${fitzpatrickType && parseInt(type) === fitzpatrickType ? 'bg-primary/10' : ''}`}
                  >
                    <td className="py-2 px-2 font-medium">
                      Type {['I', 'II', 'III', 'IV', 'V', 'VI'][parseInt(type) - 1]}
                    </td>
                    <td className="text-center py-2 px-2">{times['1-2']}</td>
                    <td className="text-center py-2 px-2">{times['3-5']}</td>
                    <td className="text-center py-2 px-2">{times['6-7']}</td>
                    <td className="text-center py-2 px-2">{times['8-10']}</td>
                    <td className="text-center py-2 px-2">{times['11+']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fitzpatrickType && (
            <p className="text-xs text-muted-foreground mt-4">
              Your skin type (Type {['I', 'II', 'III', 'IV', 'V', 'VI'][fitzpatrickType - 1]}) is highlighted above.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
