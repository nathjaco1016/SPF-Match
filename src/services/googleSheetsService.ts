import type { SunscreenProduct } from "../types/sunscreen";

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const RANGE = "Sunscreen!A2:L"; // Fetch all columns from row 2 onwards

/**
 * Converts Fitzpatrick scale range (e.g., "V–VI", "I-III") to array of numbers
 */
function parseFitzpatrickScale(scale: string): number[] {
  if (!scale) return [];

  const romanToNumber: Record<string, number> = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
  };

  // Handle ranges like "V–VI" or "I-III"
  const cleanScale = scale.trim().replace(/\s/g, "");
  const parts = cleanScale.split(/[–-]/);

  if (parts.length === 2) {
    const start = romanToNumber[parts[0]];
    const end = romanToNumber[parts[1]];
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  } else if (parts.length === 1) {
    return [romanToNumber[parts[0]]];
  }

  return [];
}

/**
 * Parse skin types from comma-separated string
 */
function parseSkinTypes(skinTypeStr: string): string[] {
  if (!skinTypeStr) return [];
  return skinTypeStr
    .split(",")
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Normalize filter type to match the type definition
 */
function normalizeFilterType(
  filterType: string
): "Mineral" | "Chemical" | "Mixture" | "Physical" {
  const normalized = filterType.trim();
  if (normalized === "Physical") return "Physical";
  if (normalized === "Mineral") return "Mineral";
  if (normalized === "Mixture") return "Mixture";
  return "Chemical";
}

/**
 * Normalize tint value
 */
function normalizeTint(tint: string): "Yes" | "No" | "Transparent" {
  const normalized = tint.trim().toLowerCase();
  if (normalized === "transparent") return "Transparent";
  if (normalized === "yes") return "Yes";
  return "No";
}

/**
 * Transform raw sheet row to SunscreenProduct
 */
function transformRowToProduct(row: string[]): SunscreenProduct | null {
  if (row.length < 9) return null; // Need at least basic fields

  const [
    sunscreenName,
    fitzpatrickScale,
    skinType,
    filterType,
    spf,
    vehicle,
    tint,
    price,
    size,
    unitPrice = "",
    image = "",
    link = "",
  ] = row;

  if (!sunscreenName || !sunscreenName.trim()) return null;

  return {
    name: sunscreenName.trim(),
    filterType: normalizeFilterType(filterType),
    spf: parseInt(spf) || 30,
    vehicle: vehicle.trim(),
    tint: normalizeTint(tint),
    price: parseFloat(price.replace(/[$,]/g, "")) || 0,
    size: parseFloat(size) || 0,
    description: `${filterType} sunscreen, SPF ${spf}`,
    link: link.trim() || undefined,
    image: image.trim() || undefined,
    unitPrice: parseFloat(unitPrice.replace(/[$,]/g, "")) || undefined,
    fitzpatrickScale: fitzpatrickScale.trim(),
    skinTypes: parseSkinTypes(skinType),
  };
}

/**
 * Fetch sunscreen data from Google Sheets
 */
export async function fetchSunscreenData(): Promise<SunscreenProduct[]> {
  if (!SHEET_ID || !API_KEY) {
    console.error("Missing Google Sheets credentials");
    throw new Error("Google Sheets API credentials not configured");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      console.warn("No data found in sheet");
      return [];
    }

    // Transform rows to products
    const products = data.values
      .map((row: string[]) => transformRowToProduct(row))
      .filter((product): product is SunscreenProduct => product !== null);

    return products;
  } catch (error) {
    console.error("Error fetching sunscreen data:", error);
    throw error;
  }
}

/**
 * Group products by Fitzpatrick type and skin type for easy lookup
 */
export function groupProductsByType(
  products: SunscreenProduct[]
): Record<string, SunscreenProduct[]> {
  const grouped: Record<string, SunscreenProduct[]> = {};

  products.forEach((product) => {
    if (!product.fitzpatrickScale || !product.skinTypes) return;

    const fitzpatrickTypes = parseFitzpatrickScale(product.fitzpatrickScale);

    // Add product to all matching combinations
    fitzpatrickTypes.forEach((fitzType) => {
      product.skinTypes!.forEach((skinType) => {
        const key = `${fitzType}-${skinType}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(product);
      });
    });
  });

  return grouped;
}
