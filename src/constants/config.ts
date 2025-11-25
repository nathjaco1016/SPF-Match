// Fitzpatrick skin type score thresholds
export const FITZPATRICK_THRESHOLDS = {
  1: 7,
  2: 16,
  3: 25,
  4: 30,
  5: 34,
  6: Infinity,
} as const;

// Reapplication time table (minutes) based on Fitzpatrick type and UV index
// Source: Based on dermatological guidelines for sun protection
export const REAPPLICATION_TIME_TABLE: { [key: number]: { [key: string]: number } } = {
  1: { '1-2': 120, '3-5': 60, '6-7': 40, '8-10': 20, '11+': 10 },
  2: { '1-2': 120, '3-5': 80, '6-7': 60, '8-10': 30, '11+': 20 },
  3: { '1-2': 180, '3-5': 100, '6-7': 80, '8-10': 40, '11+': 30 },
  4: { '1-2': 180, '3-5': 120, '6-7': 100, '8-10': 60, '11+': 40 },
  5: { '1-2': 200, '3-5': 140, '6-7': 120, '8-10': 80, '11+': 60 },
  6: { '1-2': 200, '3-5': 160, '6-7': 140, '8-10': 100, '11+': 80 },
};

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
