import type { FitzpatrickType } from "../types/quiz";
import type { SkinType } from "../types/sunscreen";

export const FITZPATRICK_INFO: Record<FitzpatrickType, { name: string; description: string }> = {
  1: {
    name: "Type I",
    description:
      "Very fair skin, always burns, never tans. Extremely sensitive to sun exposure.",
  },
  2: {
    name: "Type II",
    description:
      "Fair skin, usually burns, tans minimally. Very sensitive to sun exposure.",
  },
  3: {
    name: "Type III",
    description:
      "Medium skin, sometimes burns, tans gradually. Moderately sensitive to sun.",
  },
  4: {
    name: "Type IV",
    description:
      "Olive skin, rarely burns, tans easily. Less sensitive to sun exposure.",
  },
  5: {
    name: "Type V",
    description:
      "Brown skin, very rarely burns, tans very easily. Minimally sensitive to sun.",
  },
  6: {
    name: "Type VI",
    description:
      "Dark brown to black skin, never burns, deeply pigmented. Least sensitive to sun.",
  },
};

export const SKIN_TYPE_INFO: Record<SkinType, string> = {
  normal:
    "Your skin is well-balanced, neither too oily nor too dry. Look for lightweight, non-comedogenic formulas.",
  oily: "Your skin produces excess sebum. Look for oil-free, mattifying sunscreens that won't clog pores.",
  dry: "Your skin lacks moisture and may feel tight. Look for hydrating sunscreens with moisturizing ingredients.",
  combination:
    "Your skin is oily in some areas and dry in others. Look for balanced formulas that won't over-dry or make you greasy.",
  sensitive:
    "Your skin is prone to irritation. Look for mineral-based, fragrance-free sunscreens with gentle ingredients.",
};
