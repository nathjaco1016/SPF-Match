export interface SunscreenProduct {
  name: string;
  filterType: "Mineral" | "Chemical" | "Mixture" | "Physical";
  spf: number;
  vehicle: string;
  tint: "Yes" | "No" | "Transparent";
  price: number;
  size: number;
  description: string;
  link?: string;
  image?: string;
  unitPrice?: number;
  fitzpatrickScale?: string; // e.g., "IV-V", "I-III", "II"
  skinTypes?: string[]; // e.g., ["oily", "combination"]
}

export type SkinType = "normal" | "oily" | "dry" | "combination" | "sensitive";
