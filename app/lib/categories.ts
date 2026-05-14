export interface Category {
  id: string;
  name: string;
  emoji: string;
  hint: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "fit",
    name: "The Fit",
    emoji: "👟",
    hint: "Outfit cohesion & commitment to an aesthetic lane. Sambas, Docs, Birks, jorts, flannels, cuffed everything.",
  },
  {
    id: "accessories",
    name: "Accessory Game",
    emoji: "🔑",
    hint: "Carabiners, crystals, tote bags, rings on Significant Fingers, enamel pins, suspicious number of keychains.",
  },
  {
    id: "depth",
    name: "Stereotype Depth",
    emoji: "📚",
    hint: "Surface-level or deep lore? Bonus for references that make the Elder Council nod knowingly.",
  },
  {
    id: "commitment",
    name: "Commitment to the Bit",
    emoji: "🔥",
    hint: "Is there a concept? A narrative? Props? Did they arrive in a Subaru with a rescue dog?",
  },
  {
    id: "swagger",
    name: "Swagger & Presentation",
    emoji: "💅",
    hint: "The walk, the confidence, the aura of someone with strong feelings about Cate Blanchett.",
  },
  {
    id: "wildcard",
    name: "Elder Council Wildcard",
    emoji: "🔮",
    hint: "The intangible. Would you let them borrow your truck? Your years earned you this.",
  },
];

export interface Score {
  judge: number;
  contestant: number;
  categories: number[];
  total: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  contestant: number;
  judges: { judge: number; categories: number[]; total: number }[];
  totalScore: number;
  categoryTotals: number[];
  judgeCount: number;
  avgScore: number;
}
