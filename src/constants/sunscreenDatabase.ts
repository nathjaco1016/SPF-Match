import type { SunscreenProduct } from "../types/sunscreen";

export const SUNSCREEN_DATABASE: Record<string, SunscreenProduct[]> = {
  "1-normal": [
    {
      name: "EltaMD UV Clear Broad-Spectrum SPF 46",
      filterType: "Mineral",
      spf: 46,
      vehicle: "Lotion",
      tint: "No",
      price: 39.0,
      size: 1.7,
      description:
        "Oil-free formula with niacinamide, perfect for sensitive and acne-prone skin.",
    },
  ],
  "1-oily": [
    {
      name: "La Roche-Posay Anthelios Clear Skin SPF 60",
      filterType: "Chemical",
      spf: 60,
      vehicle: "Gel",
      tint: "No",
      price: 19.99,
      size: 1.7,
      description:
        "Oil-free, mattifying formula that won't clog pores.",
    },
  ],
  "1-dry": [
    {
      name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 2.5,
      description:
        "Hydrating formula with ceramides and hyaluronic acid.",
    },
  ],
  "1-combination": [
    {
      name: "Neutrogena Ultra Sheer Dry-Touch SPF 55",
      filterType: "Chemical",
      spf: 55,
      vehicle: "Lotion",
      tint: "No",
      price: 10.99,
      size: 3.0,
      description:
        "Lightweight, non-greasy formula suitable for combination skin.",
    },
  ],
  "1-sensitive": [
    {
      name: "Vanicream Facial Moisturizer SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 14.69,
      size: 3.0,
      description:
        "Fragrance-free, gentle formula for sensitive skin.",
    },
  ],
  "2-normal": [
    {
      name: "Supergoop! Unseen Sunscreen SPF 40",
      filterType: "Chemical",
      spf: 40,
      vehicle: "Gel",
      tint: "No",
      price: 36.0,
      size: 1.7,
      description:
        "Invisible, weightless formula that works as a makeup primer.",
    },
  ],
  "2-oily": [
    {
      name: "Paula's Choice Extra Care Non-Greasy SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 33.0,
      size: 4.2,
      description:
        "Matte finish, oil-free formula for oily skin.",
    },
  ],
  "2-dry": [
    {
      name: "First Aid Beauty Ultra Repair Tinted Moisturizer SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Cream",
      tint: "Yes",
      price: 32.0,
      size: 1.7,
      description:
        "Hydrating tinted moisturizer with SPF protection.",
    },
  ],
  "2-combination": [
    {
      name: "Biore UV Aqua Rich Watery Essence SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Essence",
      tint: "No",
      price: 14.0,
      size: 1.7,
      description:
        "Ultra-lightweight, watery texture that absorbs quickly.",
    },
  ],
  "2-sensitive": [
    {
      name: "Blue Lizard Sensitive Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 5.0,
      description:
        "Reef-safe, fragrance-free mineral sunscreen.",
    },
  ],
  "3-normal": [
    {
      name: "Coppertone Pure & Simple SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 11.99,
      size: 6.0,
      description:
        "Gentle, zinc-based formula for everyday use.",
    },
  ],
  "3-oily": [
    {
      name: "Cetaphil Pro Oil Absorbing Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 16.99,
      size: 4.0,
      description:
        "Oil-control technology with SPF protection.",
    },
  ],
  "3-dry": [
    {
      name: "Aveeno Positively Radiant Daily Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 17.99,
      size: 2.5,
      description:
        "Moisturizing formula with soy for brighter skin.",
    },
  ],
  "3-combination": [
    {
      name: "Hawaiian Tropic Sheer Touch Lotion SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 9.99,
      size: 8.0,
      description:
        "Lightweight, non-greasy formula with island botanicals.",
    },
  ],
  "3-sensitive": [
    {
      name: "Eucerin Daily Hydration SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 9.99,
      size: 8.0,
      description:
        "Gentle, fragrance-free daily moisturizer with SPF.",
    },
  ],
  "4-normal": [
    {
      name: "Banana Boat Sport Ultra SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 8.99,
      size: 8.0,
      description:
        "Water-resistant, active formula for outdoor activities.",
    },
  ],
  "4-oily": [
    {
      name: "Neutrogena Clear Face SPF 55",
      filterType: "Chemical",
      spf: 55,
      vehicle: "Lotion",
      tint: "No",
      price: 10.99,
      size: 3.0,
      description: "Oil-free, won't cause breakouts.",
    },
  ],
  "4-dry": [
    {
      name: "Olay Complete Daily Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 12.99,
      size: 2.5,
      description: "Hydrating daily moisturizer with vitamins.",
    },
  ],
  "4-combination": [
    {
      name: "Sun Bum Original SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 3.0,
      description: "Reef-friendly, vitamin E enriched formula.",
    },
  ],
  "4-sensitive": [
    {
      name: "Cetaphil Sheer Mineral SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 3.0,
      description:
        "100% mineral active ingredients, gentle on skin.",
    },
  ],
  "5-normal": [
    {
      name: "Black Girl Sunscreen SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 3.0,
      description:
        "No white cast, designed for melanin-rich skin.",
    },
  ],
  "5-oily": [
    {
      name: "Unsun Mineral Tinted Face Sunscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 29.0,
      size: 1.7,
      description: "Tinted mineral formula, no white cast.",
    },
  ],
  "5-dry": [
    {
      name: "Bolden SPF 30 Moisturizer",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 22.0,
      size: 2.0,
      description:
        "Hydrating formula formulated for melanin-rich skin.",
    },
  ],
  "5-combination": [
    {
      name: "EiR NYC Surf Mud Pro SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Cream",
      tint: "Yes",
      price: 24.0,
      size: 2.4,
      description:
        "Water-resistant, reef-safe mineral formula.",
    },
  ],
  "5-sensitive": [
    {
      name: "Mele No Shade Sunscreen Oil SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Oil",
      tint: "No",
      price: 19.99,
      size: 1.7,
      description: "Lightweight oil formula with niacinamide.",
    },
  ],
  "6-normal": [
    {
      name: "Black Girl Sunscreen Kids SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 3.0,
      description: "High SPF protection without white cast.",
    },
  ],
  "6-oily": [
    {
      name: "Fenty Skin Hydra Vizor SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Serum",
      tint: "No",
      price: 36.0,
      size: 1.69,
      description:
        "Invisible, refillable moisturizer with SPF.",
    },
  ],
  "6-dry": [
    {
      name: "Topicals Like Butter SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Cream",
      tint: "No",
      price: 36.0,
      size: 1.7,
      description: "Rich, hydrating formula for very dry skin.",
    },
  ],
  "6-combination": [
    {
      name: "Relevant Mineral Sunscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 20.0,
      size: 2.0,
      description:
        "Tinted mineral formula designed for melanin-rich skin.",
    },
  ],
  "6-sensitive": [
    {
      name: "Supergoop! Mineral Sheerscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 38.0,
      size: 1.7,
      description:
        "100% mineral, sheer tint for all skin tones.",
    },
  ],
};
