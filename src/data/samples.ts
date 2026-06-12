import { DemoSample } from "../types";

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: "sample1",
    name: "Tokyo Strawberry Mochi (大福)",
    badge: "Haram (Pig Gelatin)",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    image: "https://images.unsplash.com/photo-1582293001026-e0fcf959ae27?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: "砂糖、もち粉、あずき、ゼラチン（豚由来）、コラーゲンペプチド、乳化剤、酒精、香料",
    result: {
      productName: "Tokyo Strawberry Sweet Mochi (東京いちご大福)",
      brand: "Tokyo Confectionery Corp",
      barcode: "4901234567890",
      halalLevel: "HR2",
      halalLevelExplanation: "The product contains 'ゼラチン (豚由来)' which translates directly to pork-derived gelatin. Additionally, it lists 'コラーゲンペプチド' (collagen peptide) from unverified animal bones and utilizes '酒精' (ethyl alcohol) as a direct preservative.",
      detectedLanguage: "Japanese",
      extractedIngredientsText: "砂糖、水飴、もち粉、あずき、ゼラチン（豚肉を含む）、乳化剤、コラーゲンペプチド、酒精、香料、着色料",
      ingredientsAnalysis: [
        { name: "Pork Gelatin", extractedName: "ゼラチン (豚由来)", category: "Haram", halalStatus: "Haram. Porcine gelling agent from boiled skin or tissue.", matchedKeyword: "ゼラチン" },
        { name: "Ethyl Alcohol (Brewers alcohol)", extractedName: "酒精", category: "Haram", halalStatus: "Haram. Pure alcohol added for preservation.", matchedKeyword: "酒精" },
        { name: "Collagen Peptide", extractedName: "コラーゲンペプチド", category: "Syubhat", halalStatus: "Doubtful (Syubhat). Typically derived from pig or non-halal beef in Japan.", matchedKeyword: "コラーゲンペプチド" },
        { name: "Emulsifier", extractedName: "乳化剤", category: "Syubhat", halalStatus: "Doubtful (Syubhat). Can be animal-derived fat unless labeled soy/plant source.", matchedKeyword: "乳化剤" }
      ],
      finalRecommendation: "Strictly avoid (Porcine/Alcohol content). Purchase only products with Halal-certified labels."
    }
  },
  {
    id: "sample2",
    name: "Kyoto Matcha Biscuit Cookies",
    badge: "Doubtful Additives",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    image: "https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: "小麦粉、砂糖、ショートニング、植物油脂、抹茶、食塩、乳化剤、香料",
    result: {
      productName: "Kyoto Premium Matcha Cookie Sand",
      brand: "Kyoto Nishiki Foods",
      barcode: "4971620002134",
      halalLevel: "D",
      halalLevelExplanation: "The biscuit uses 'ショートニング' (shortening) and '乳化剤' (emulsifiers) without specifying their source (whether vegetable-derived or lard-derived). The soybean base label (大豆由来) is absent, making it look doubtful.",
      detectedLanguage: "Japanese",
      extractedIngredientsText: "小麦粉、砂糖、ショートニング、植物油脂、抹茶、食塩、乳化剤、加工油脂、香料",
      ingredientsAnalysis: [
        { name: "Shortening", extractedName: "ショートニング", category: "Syubhat", halalStatus: "Doubtful (Syubhat). Common fat used in baking. Sourced from lard (pork) or plant oils.", matchedKeyword: "ショートニング" },
        { name: "Processed Fat", extractedName: "加工油脂", category: "Syubhat", halalStatus: "Doubtful (Syubhat). Sourced from animal fat/pork fatty acids unless plant base is explicitly declared.", matchedKeyword: "加工油脂" },
        { name: "Emulsifier", extractedName: "乳化剤", category: "Syubhat", halalStatus: "Doubtful (Syubhat). May be from animal fats.", matchedKeyword: "乳化剤" }
      ],
      finalRecommendation: "Doubtful (Syubhat). Avoid or check carefully if the package has the certified '植物性' (vegetable fat) or '植物由来' marking."
    }
  },
  {
    id: "sample3",
    name: "Asuka Premium Halal Curry Pack",
    badge: "H1 Certified Halal",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: "Halal Beef (slaughtered), Curry powder, Potatoes, Vegetable fat, JHF Halal Logo",
    result: {
      productName: "Japan Premium Halal Beef Curry",
      brand: "Asuka suriya Global Halal",
      barcode: "8859012356784",
      halalLevel: "H1",
      halalLevelExplanation: "The product carries an active, authorized Halal Logo from the Japan Halal Foundation (JHF) on the packing carton. It uses halal-slaughtered beef and cleanly sourced vegetable fat.",
      detectedLanguage: "English / Japanese",
      extractedIngredientsText: "Halal Beef, Potatoes, Carrots, Onions, Vegetable fat, Coconut milk, Curry powder, Salt, Spices.",
      ingredientsAnalysis: [
        { name: "Halal Beef", extractedName: "Halal Beef", category: "Halal", halalStatus: "Certified Halal. Slaughtered conforming precisely to authentic Islamic rites.", matchedKeyword: "牛肉" },
        { name: "Vegetable Fat", extractedName: "Vegetable fat", category: "Halal", halalStatus: "Naturally halal plant-derived lipid.", matchedKeyword: "大豆由来" }
      ],
      finalRecommendation: "Fully safe to consume! Authenticated by certified organization (JHF)."
    }
  }
];
