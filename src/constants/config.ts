// Fitzpatrick skin type score thresholds
export const FITZPATRICK_THRESHOLDS = {
  1: 7,
  2: 16,
  3: 25,
  4: 30,
  5: 34,
  6: Infinity,
} as const;

// Base reapplication time in minutes for each Fitzpatrick type
export const REAPPLICATION_BASE_TIME: Record<number, number> = {
  1: 30,  // Very fair skin
  2: 45,  // Fair skin
  3: 60,  // Medium skin
  4: 75,  // Olive skin
  5: 90,  // Brown skin
  6: 105, // Dark skin
};

// UV index adjustment factors for reapplication timing
export const UV_ADJUSTMENT_FACTORS = {
  extreme: { threshold: 8, factor: 0.5 },
  high: { threshold: 6, factor: 0.7 },
  moderate: { threshold: 3, factor: 0.85 },
} as const;

// UV index level classifications
export const UV_LEVELS = [
  { threshold: 11, level: "Extreme", color: "text-purple-600" },
  { threshold: 8, level: "Very High", color: "text-red-600" },
  { threshold: 6, level: "High", color: "text-orange-600" },
  { threshold: 3, level: "Moderate", color: "text-yellow-600" },
  { threshold: 0, level: "Low", color: "text-green-600" },
] as const;

// API endpoints
export const API_ENDPOINTS = {
  UV_INDEX: "https://api.open-meteo.com/v1/forecast",
} as const;

// Default UV index when API fails
export const DEFAULT_UV_INDEX = 5;
