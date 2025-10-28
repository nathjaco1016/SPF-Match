import { Button } from "../assets/button";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Badge } from "../assets/badge";
import { ImageWithFallback } from "./ImageWithFallback";

interface ResultsPageProps {
  answers: Record<string, string>;
  onRestart: () => void;
}

const questions = [
  {
    id: "eyeColor",
    options: [
      "Light blue, gray or green",
      "Blue, gray, or green",
      "Blue",
      "Dark Brown",
      "Brownish Black",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "hairColor",
    options: [
      "Sandy red",
      "Blonde",
      "Chestnut/ Dark Blonde",
      "Dark brown",
      "Black",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "skinColor",
    options: [
      "Reddish",
      "Very Pale",
      "Pale with a beige tint",
      "Light brown",
      "Dark brown",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "freckles",
    options: ["Many", "Several", "Few", "Incidental", "None"],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "sunReaction",
    options: [
      "Painful redness, blistering, peeling",
      "Blistering followed by peeling",
      "Burns sometimes followed by peeling",
      "Rare burns",
      "Never had burns",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "tanningDegree",
    options: [
      "Hardly or not at all",
      "Light color tan",
      "Reasonable tan",
      "Tan very easily",
      "Turn dark brown quickly",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "tanningHours",
    options: [
      "Never",
      "Seldom",
      "Sometimes",
      "Often",
      "Always",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "faceReaction",
    options: [
      "Very sensitive",
      "Sensitive",
      "Normal",
      "Very resistant",
      "Never had a problem",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "lastExposure",
    options: [
      "More than 3 months ago",
      "2-3 months ago",
      "1-2 months ago",
      "Less than a month ago",
      "Less than 2 weeks ago",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "faceExposure",
    options: [
      "Never",
      "Hardly ever",
      "Sometimes",
      "Often",
      "Always",
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: "skinType",
    options: [
      "Hydrated and comfortable",
      "Shiny and greasy",
      "Flaky, rough, and tight, sometimes itchy or irritated",
      "Oily in some areas and dry in other areas",
      "Often stings or turns red in response to irritants",
    ],
    types: [
      "normal",
      "oily",
      "dry",
      "combination",
      "sensitive",
    ],
  },
];

function calculateFitzpatrickType(
  answers: Record<string, string>,
): number {
  let totalScore = 0;

  for (let i = 0; i < questions.length - 1; i++) {
    const question = questions[i];
    const answer = answers[question.id];
    const optionIndex = question.options.indexOf(answer);
    if (optionIndex !== -1 && question.scores) {
      totalScore += question.scores[optionIndex];
    }
  }

  if (totalScore <= 7) return 1;
  if (totalScore <= 16) return 2;
  if (totalScore <= 25) return 3;
  if (totalScore <= 30) return 4;
  if (totalScore <= 34) return 5;
  return 6;
}

function getSkinType(answers: Record<string, string>): string {
  const skinTypeQuestion = questions.find(
    (q) => q.id === "skinType",
  );
  const answer = answers["skinType"];
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
      description:
        "Oil-free formula with niacinamide, perfect for sensitive and acne-prone skin.",
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle clear",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle cream",
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
      imageQuery: "sunscreen bottle blue",
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
      imageQuery: "sunscreen bottle blue",
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
      imageQuery: "sunscreen bottle orange",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle purple",
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
      imageQuery: "sunscreen bottle tropical",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle yellow",
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
      imageQuery: "sunscreen bottle blue",
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
      imageQuery: "sunscreen bottle pink",
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
      imageQuery: "sunscreen bottle yellow",
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
      imageQuery: "sunscreen bottle white",
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
      imageQuery: "sunscreen bottle brown",
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
      imageQuery: "sunscreen bottle beige",
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
      imageQuery: "sunscreen bottle brown",
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
      imageQuery: "sunscreen bottle natural",
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
      imageQuery: "sunscreen bottle gold",
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
      imageQuery: "sunscreen bottle purple",
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
      imageQuery: "sunscreen bottle clear",
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
      imageQuery: "sunscreen bottle cream",
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
      imageQuery: "sunscreen bottle brown",
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
      imageQuery: "sunscreen bottle beige",
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

  const recommendations =
    sunscreenDatabase[skinTypeKey] ||
    sunscreenDatabase["3-normal"];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="mb-8">
        Your Recommended Sunscreen and Care
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
              <div className="grid md:grid-cols-[200px_1fr] gap-6">
                <div className="bg-muted rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1556228841-a6b5e0e56f95?w=400&h=400&fit=crop`}
                    alt={sunscreen.name}
                    className="w-full h-[200px] object-cover"
                  />
                </div>
                <div>
                  <h3 className="mb-3">{sunscreen.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {sunscreen.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
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
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-muted-foreground">
                        Price:
                      </span>
                      <span className="ml-2">
                        ${sunscreen.price.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Size:
                      </span>
                      <span className="ml-2">
                        {sunscreen.size} fl oz
                      </span>
                    </div>
                    <div>
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" onClick={onRestart}>
          Restart Questionnaire
        </Button>
      </div>
    </div>
  );
}