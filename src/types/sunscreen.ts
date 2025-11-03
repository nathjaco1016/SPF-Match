export interface SunscreenProduct {
  name: string;
  filterType: "Mineral" | "Chemical";
  spf: number;
  vehicle: string;
  tint: "Yes" | "No";
  price: number;
  size: number;
  description: string;
}

export type SkinType = "normal" | "oily" | "dry" | "combination" | "sensitive";
