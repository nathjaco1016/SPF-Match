import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Badge } from "../assets/badge";
import { ImageWithFallback } from "./ImageWithFallback";
import { ExternalLink } from "lucide-react";
import { questions, calculateFitzpatrickType } from "./QuizPage";

interface ResultsPageProps {
  answers: Record<string, string | string[]>;
  onRestart: () => void;
}

function getSkinType(answers: Record<string, string | string[]>): string {
  const skinTypeQuestion = questions.find(
    (q) => q.id === "skinType",
  );
  const answer = answers["skinType"] as string;
  if (skinTypeQuestion && skinTypeQuestion.types) {
    const optionIndex =
      skinTypeQuestion.options.indexOf(answer);
    return skinTypeQuestion.types[optionIndex] || "normal";
  }
  return "normal";
}

const fitzpatrickInfo = {
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

const skinTypeInfo = {
  normal:
    "Your skin is well-balanced, neither too oily nor too dry. Look for lightweight, non-comedogenic formulas.",
  oily: "Your skin produces excess sebum. Look for oil-free, mattifying sunscreens that won't clog pores.",
  dry: "Your skin lacks moisture and may feel tight. Look for hydrating sunscreens with moisturizing ingredients.",
  combination:
    "Your skin is oily in some areas and dry in others. Look for balanced formulas that won't over-dry or make you greasy.",
  sensitive:
    "Your skin is prone to irritation. Look for mineral-based, fragrance-free sunscreens with gentle ingredients.",
};

const sunscreenDatabase: Record<string, any[]> = {
  "1-normal": [
    {
      name: "EltaMD UV Clear Broad-Spectrum SPF 46",
      filterType: "Mineral",
      spf: 46,
      vehicle: "Lotion",
      tint: "No",
      price: 39.0,
      size: 1.7,
      fitzpatrick: "I–III",
      facialSkinType: "Normal, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 2.5,
      fitzpatrick: "I–III",
      facialSkinType: "Normal, Dry, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Vanicream Facial Moisturizer SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 14.69,
      size: 3.0,
      fitzpatrick: "I–III",
      facialSkinType: "Normal, Dry, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Oily, Combination, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Neutrogena Ultra Sheer Dry-Touch SPF 55",
      filterType: "Chemical",
      spf: 55,
      vehicle: "Lotion",
      tint: "No",
      price: 10.99,
      size: 3.0,
      fitzpatrick: "I–III",
      facialSkinType: "Oily, Combination, Normal",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Paula's Choice Extra Care Non-Greasy SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 33.0,
      size: 4.2,
      fitzpatrick: "I–III",
      facialSkinType: "Oily, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Dry, Normal, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "First Aid Beauty Ultra Repair Tinted Moisturizer SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Cream",
      tint: "Yes",
      price: 32.0,
      size: 1.7,
      fitzpatrick: "I–III",
      facialSkinType: "Dry, Sensitive, Combination",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Aveeno Positively Radiant Daily Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 17.99,
      size: 2.5,
      fitzpatrick: "I–III",
      facialSkinType: "Dry, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Combination, Normal, Oily",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Biore UV Aqua Rich Watery Essence SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Essence",
      tint: "No",
      price: 14.0,
      size: 1.7,
      fitzpatrick: "I–III",
      facialSkinType: "Combination, Oily, Sensitive",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Hawaiian Tropic Sheer Touch Lotion SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 9.99,
      size: 8.0,
      fitzpatrick: "I–III",
      facialSkinType: "Normal, Dry, Oily, Combination",
      image: "https://images.unsplash.com/photo-1608357032732-1e8cb6291d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Sensitive, Dry, Normal",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Blue Lizard Sensitive Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 5.0,
      fitzpatrick: "I–III",
      facialSkinType: "Sensitive, Normal, Combination",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Eucerin Daily Hydration SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 9.99,
      size: 8.0,
      fitzpatrick: "I–III",
      facialSkinType: "Sensitive, Normal, Dry",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Normal, Combination, Oily",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Coppertone Pure & Simple SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 11.99,
      size: 6.0,
      fitzpatrick: "I–IV",
      facialSkinType: "Normal, Dry, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Neutrogena Ultra Sheer Dry-Touch SPF 55",
      filterType: "Chemical",
      spf: 55,
      vehicle: "Lotion",
      tint: "No",
      price: 10.99,
      size: 3.0,
      fitzpatrick: "I–IV",
      facialSkinType: "Normal, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Oily, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "La Roche-Posay Anthelios Clear Skin SPF 60",
      filterType: "Chemical",
      spf: 60,
      vehicle: "Gel",
      tint: "No",
      price: 19.99,
      size: 1.7,
      fitzpatrick: "I–III",
      facialSkinType: "Oily, Combination, Normal",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Cetaphil Pro Oil Absorbing Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 16.99,
      size: 4.0,
      fitzpatrick: "I–IV",
      facialSkinType: "Oily, Normal, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Dry, Sensitive, Normal",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 2.5,
      fitzpatrick: "I–III",
      facialSkinType: "Dry, Normal, Combination",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Aveeno Positively Radiant Daily Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 17.99,
      size: 2.5,
      fitzpatrick: "I–IV",
      facialSkinType: "Dry, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Combination, Oily, Normal",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Supergoop! Unseen Sunscreen SPF 40",
      filterType: "Chemical",
      spf: 40,
      vehicle: "Gel",
      tint: "No",
      price: 36.0,
      size: 1.7,
      fitzpatrick: "I–III",
      facialSkinType: "Combination, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Hawaiian Tropic Sheer Touch Lotion SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 9.99,
      size: 8.0,
      fitzpatrick: "I–IV",
      facialSkinType: "Normal, Dry, Oily, Combination",
      image: "https://images.unsplash.com/photo-1608357032732-1e8cb6291d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–III",
      facialSkinType: "Sensitive, Normal, Combination",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Vanicream Facial Moisturizer SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 14.69,
      size: 3.0,
      fitzpatrick: "I–III",
      facialSkinType: "Sensitive, Dry, Normal",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Eucerin Daily Hydration SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 9.99,
      size: 8.0,
      fitzpatrick: "I–IV",
      facialSkinType: "Sensitive, Normal, Dry",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–IV",
      facialSkinType: "Normal, Dry, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Neutrogena Ultra Sheer Dry-Touch SPF 55",
      filterType: "Chemical",
      spf: 55,
      vehicle: "Lotion",
      tint: "No",
      price: 10.99,
      size: 3.0,
      fitzpatrick: "I–IV",
      facialSkinType: "Normal, Combination, Oily",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Banana Boat Sport Ultra SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 8.99,
      size: 8.0,
      fitzpatrick: "II–IV",
      facialSkinType: "Normal, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1608357032732-1e8cb6291d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–IV",
      facialSkinType: "Oily, Combination, Normal",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "La Roche-Posay Anthelios Clear Skin SPF 60",
      filterType: "Chemical",
      spf: 60,
      vehicle: "Gel",
      tint: "No",
      price: 19.99,
      size: 1.7,
      fitzpatrick: "I–IV",
      facialSkinType: "Oily, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Neutrogena Clear Face SPF 55",
      filterType: "Chemical",
      spf: 55,
      vehicle: "Lotion",
      tint: "No",
      price: 10.99,
      size: 3.0,
      fitzpatrick: "II–IV",
      facialSkinType: "Oily, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–IV",
      facialSkinType: "Dry, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 2.5,
      fitzpatrick: "I–IV",
      facialSkinType: "Dry, Normal, Combination",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Olay Complete Daily Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 12.99,
      size: 2.5,
      fitzpatrick: "II–IV",
      facialSkinType: "Dry, Sensitive, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–IV",
      facialSkinType: "Normal, Dry, Oily, Combination",
      image: "https://images.unsplash.com/photo-1608357032732-1e8cb6291d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Biore UV Aqua Rich Watery Essence SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Essence",
      tint: "No",
      price: 14.0,
      size: 1.7,
      fitzpatrick: "I–IV",
      facialSkinType: "Combination, Oily, Sensitive",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Coppertone Pure & Simple SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 11.99,
      size: 6.0,
      fitzpatrick: "II–IV",
      facialSkinType: "Combination, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "I–IV",
      facialSkinType: "Sensitive, Normal, Dry",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Vanicream Facial Moisturizer SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 14.69,
      size: 3.0,
      fitzpatrick: "I–IV",
      facialSkinType: "Sensitive, Dry, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Blue Lizard Sensitive Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 5.0,
      fitzpatrick: "II–IV",
      facialSkinType: "Sensitive, Normal, Combination",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "II–V",
      facialSkinType: "Normal, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1608357032732-1e8cb6291d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Coppertone Pure & Simple SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 11.99,
      size: 6.0,
      fitzpatrick: "III–V",
      facialSkinType: "Normal, Dry, Combination",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Sun Bum Original SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 3.0,
      fitzpatrick: "III–V",
      facialSkinType: "Normal, Combination, Oily",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "III–V",
      facialSkinType: "Oily, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "La Roche-Posay Anthelios Clear Skin SPF 60",
      filterType: "Chemical",
      spf: 60,
      vehicle: "Gel",
      tint: "No",
      price: 19.99,
      size: 1.7,
      fitzpatrick: "III–V",
      facialSkinType: "Oily, Combination, Normal",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Cetaphil Pro Oil Absorbing Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 16.99,
      size: 4.0,
      fitzpatrick: "II–V",
      facialSkinType: "Oily, Normal, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "III–V",
      facialSkinType: "Dry, Sensitive, Normal",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Aveeno Positively Radiant Daily Moisturizer SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 17.99,
      size: 2.5,
      fitzpatrick: "III–V",
      facialSkinType: "Dry, Normal, Combination",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 14.99,
      size: 2.5,
      fitzpatrick: "II–V",
      facialSkinType: "Dry, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "III–V",
      facialSkinType: "Normal, Dry, Oily, Combination",
      image: "https://images.unsplash.com/photo-1608357032732-1e8cb6291d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Hawaiian Tropic Sheer Touch Lotion SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 9.99,
      size: 8.0,
      fitzpatrick: "III–V",
      facialSkinType: "Combination, Normal, Dry",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Biore UV Aqua Rich Watery Essence SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Essence",
      tint: "No",
      price: 14.0,
      size: 1.7,
      fitzpatrick: "II–V",
      facialSkinType: "Combination, Oily, Normal",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "III–V",
      facialSkinType: "Sensitive, Normal, Combination",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Blue Lizard Sensitive Mineral Sunscreen SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 5.0,
      fitzpatrick: "III–V",
      facialSkinType: "Sensitive, Dry, Normal",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Vanicream Facial Moisturizer SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 14.69,
      size: 3.0,
      fitzpatrick: "II–V",
      facialSkinType: "Sensitive, Dry, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "IV–VI",
      facialSkinType: "Normal, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Bolden SPF 30 Moisturizer",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 22.0,
      size: 2.0,
      fitzpatrick: "IV–VI",
      facialSkinType: "Normal, Dry, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "EiR NYC Surf Mud Pro SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Cream",
      tint: "Yes",
      price: 24.0,
      size: 2.4,
      fitzpatrick: "IV–VI",
      facialSkinType: "Normal, Combination, Oily",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "IV–VI",
      facialSkinType: "Oily, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Fenty Skin Hydra Vizor SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Serum",
      tint: "No",
      price: 36.0,
      size: 1.69,
      fitzpatrick: "IV–VI",
      facialSkinType: "Oily, Normal, Combination",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Black Girl Sunscreen SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 3.0,
      fitzpatrick: "IV–VI",
      facialSkinType: "Oily, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "IV–VI",
      facialSkinType: "Dry, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Topicals Like Butter SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Cream",
      tint: "No",
      price: 36.0,
      size: 1.7,
      fitzpatrick: "IV–VI",
      facialSkinType: "Dry, Sensitive, Combination",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "EiR NYC Surf Mud Pro SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Cream",
      tint: "Yes",
      price: 24.0,
      size: 2.4,
      fitzpatrick: "IV–VI",
      facialSkinType: "Dry, Combination, Normal",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "IV–VI",
      facialSkinType: "Normal, Dry, Oily, Combination",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Black Girl Sunscreen SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 3.0,
      fitzpatrick: "IV–VI",
      facialSkinType: "Combination, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Relevant Mineral Sunscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 20.0,
      size: 2.0,
      fitzpatrick: "IV–VI",
      facialSkinType: "Combination, Oily, Normal",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "IV–VI",
      facialSkinType: "Sensitive, Dry, Normal",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Unsun Mineral Tinted Face Sunscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 29.0,
      size: 1.7,
      fitzpatrick: "IV–VI",
      facialSkinType: "Sensitive, Normal, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Supergoop! Mineral Sheerscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 38.0,
      size: 1.7,
      fitzpatrick: "IV–VI",
      facialSkinType: "Sensitive, Dry, Combination",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "V–VI",
      facialSkinType: "Normal, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Bolden SPF 30 Moisturizer",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 22.0,
      size: 2.0,
      fitzpatrick: "V–VI",
      facialSkinType: "Normal, Dry, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Relevant Mineral Sunscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 20.0,
      size: 2.0,
      fitzpatrick: "V–VI",
      facialSkinType: "Normal, Combination, Oily",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "V–VI",
      facialSkinType: "Oily, Normal, Combination",
      image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Black Girl Sunscreen SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 3.0,
      fitzpatrick: "V–VI",
      facialSkinType: "Oily, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Unsun Mineral Tinted Face Sunscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 29.0,
      size: 1.7,
      fitzpatrick: "V–VI",
      facialSkinType: "Oily, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "V–VI",
      facialSkinType: "Dry, Sensitive, Normal",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Bolden SPF 30 Moisturizer",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Cream",
      tint: "No",
      price: 22.0,
      size: 2.0,
      fitzpatrick: "V–VI",
      facialSkinType: "Dry, Normal, Combination",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "EiR NYC Surf Mud Pro SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Cream",
      tint: "Yes",
      price: 24.0,
      size: 2.4,
      fitzpatrick: "V–VI",
      facialSkinType: "Dry, Combination, Sensitive",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "V–VI",
      facialSkinType: "Normal, Dry, Oily, Combination",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Black Girl Sunscreen Kids SPF 50",
      filterType: "Chemical",
      spf: 50,
      vehicle: "Lotion",
      tint: "No",
      price: 15.99,
      size: 3.0,
      fitzpatrick: "V–VI",
      facialSkinType: "Combination, Normal, Sensitive",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "EiR NYC Surf Mud Pro SPF 50",
      filterType: "Mineral",
      spf: 50,
      vehicle: "Cream",
      tint: "Yes",
      price: 24.0,
      size: 2.4,
      fitzpatrick: "V–VI",
      facialSkinType: "Combination, Dry, Normal",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
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
      fitzpatrick: "V–VI",
      facialSkinType: "Sensitive, Dry, Normal",
      image: "https://images.unsplash.com/photo-1698664434322-94a43b98b9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Unsun Mineral Tinted Face Sunscreen SPF 30",
      filterType: "Mineral",
      spf: 30,
      vehicle: "Lotion",
      tint: "Yes",
      price: 29.0,
      size: 1.7,
      fitzpatrick: "V–VI",
      facialSkinType: "Sensitive, Normal, Combination",
      image: "https://images.unsplash.com/photo-1737007516314-27508948ab4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Mele No Shade Sunscreen Oil SPF 30",
      filterType: "Chemical",
      spf: 30,
      vehicle: "Oil",
      tint: "No",
      price: 19.99,
      size: 1.7,
      fitzpatrick: "V–VI",
      facialSkinType: "Sensitive, Dry, Combination",
      image: "https://images.unsplash.com/photo-1594527964562-32ed6eb11709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ],
};

export function ResultsPage({
  answers,
  onRestart,
}: ResultsPageProps) {
  const fitzpatrickType = calculateFitzpatrickType(answers);
  const skinType = getSkinType(answers);
  const skinTypeKey = `${fitzpatrickType}-${skinType}`;

  const fitzpatrickData =
    fitzpatrickInfo[
      fitzpatrickType as keyof typeof fitzpatrickInfo
    ];
  const skinTypeDescription =
    skinTypeInfo[skinType as keyof typeof skinTypeInfo];

  let recommendations =
    sunscreenDatabase[skinTypeKey] ||
    sunscreenDatabase["3-normal"];

  // Filter by user preferences
  const filterTypePreference = answers["filterType"] as string[] | undefined;
  const tintPreference = answers["tint"] as string[] | undefined;
  const vehiclePreference = answers["vehicle"] as string[] | undefined;

  recommendations = recommendations.filter((product) => {
    // Filter by filter type
    if (filterTypePreference && filterTypePreference.length > 0 && !filterTypePreference.includes("Anything is fine")) {
      let matchesFilterType = false;
      if (filterTypePreference.includes("Physical") && product.filterType === "Mineral") {
        matchesFilterType = true;
      }
      if (filterTypePreference.includes("Chemical") && product.filterType === "Chemical") {
        matchesFilterType = true;
      }
      if (filterTypePreference.includes("Mixture") && product.filterType === "Combination") {
        matchesFilterType = true;
      }
      if (!matchesFilterType) {
        return false;
      }
    }

    // Filter by tint
    if (tintPreference && tintPreference.length > 0 && !tintPreference.includes("Anything is fine")) {
      let matchesTint = false;
      if (tintPreference.includes("Skin-colored") && product.tint === "Yes") {
        matchesTint = true;
      }
      if (tintPreference.includes("Transparent") && product.tint === "Transparent") {
        matchesTint = true;
      }
      if (tintPreference.includes("No tint") && product.tint === "No") {
        matchesTint = true;
      }
      if (!matchesTint) {
        return false;
      }
    }

    // Filter by vehicle
    if (vehiclePreference && vehiclePreference.length > 0 && !vehiclePreference.includes("Anything is fine")) {
      let matchesVehicle = false;
      if (vehiclePreference.includes("Cream/lotion") && ["Lotion", "Cream"].includes(product.vehicle)) {
        matchesVehicle = true;
      }
      if (vehiclePreference.includes("Spray") && product.vehicle === "Spray") {
        matchesVehicle = true;
      }
      if (vehiclePreference.includes("Powder") && product.vehicle === "Powder") {
        matchesVehicle = true;
      }
      if (!matchesVehicle) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="mb-8">
        Your Skin Type
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <h2>
              Fitzpatrick Skin Type: {fitzpatrickData.name}
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {fitzpatrickData.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2>
              Facial Skin Type:{" "}
              {skinType.charAt(0).toUpperCase() +
                skinType.slice(1)}
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {skinTypeDescription}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-6">Recommended Sunscreens</h2>

      <div className="grid gap-6 mb-8">
        {recommendations.map((sunscreen, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-6">
                <div className="bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={sunscreen.image}
                    alt={sunscreen.name}
                    className="w-full h-[200px] object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3">{sunscreen.name}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 mb-3">
                    <div>
                      <span className="text-muted-foreground">
                        Fitzpatrick:
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2"
                      >
                        {sunscreen.fitzpatrick}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Facial Type:
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2"
                      >
                        {sunscreen.facialSkinType}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
                    <div>
                      <span className="text-muted-foreground">
                        Filter Type:
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2"
                      >
                        {sunscreen.filterType}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        SPF:
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2"
                      >
                        {sunscreen.spf}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Vehicle:
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2"
                      >
                        {sunscreen.vehicle}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Tint:
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2"
                      >
                        {sunscreen.tint}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                    <div className="whitespace-nowrap">
                      <span className="text-muted-foreground">
                        Price:
                      </span>
                      <span className="ml-2">
                        ${sunscreen.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-muted-foreground">
                        Size:
                      </span>
                      <span className="ml-2">
                        {sunscreen.size} fl oz
                      </span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-muted-foreground">
                        Unit Price:
                      </span>
                      <span className="ml-2">
                        $
                        {(
                          sunscreen.price / sunscreen.size
                        ).toFixed(2)}
                        /fl oz
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="gap-2"
                    asChild
                  >
                    <a
                      href={`https://www.amazon.com/s?k=${encodeURIComponent(sunscreen.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Purchase
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" onClick={onRestart}>
          Restart Quiz
        </Button>
        <Button size="lg" variant="outline" asChild className="gap-2">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfY9xCSju8owhTAGZZphkUsMWJflbYndIDjeNf78UFoeWOkGQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share Feedback
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
