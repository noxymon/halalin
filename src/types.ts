export interface AnalyzedIngredient {
  name: string;
  extractedName: string;
  category: "Haram" | "Syubhat" | "Halal" | "Mushbooh" | "Safe";
  halalStatus: string;
  matchedKeyword?: string;
}

export interface VerificationResult {
  productName: string;
  brand?: string;
  barcode?: string;
  halalLevel: "H1" | "H2" | "H3" | "D" | "HR1" | "HR2";
  halalLevelExplanation: string;
  detectedLanguage: string;
  extractedIngredientsText: string;
  ingredientsAnalysis: AnalyzedIngredient[];
  finalRecommendation: string;
}

export interface UploadedItem {
  id: string;
  name: string;
  dataUrl: string;
  result: VerificationResult | null;
  isAnalyzing: boolean;
  analysisProgress: string;
  error: string | null;
}

export interface DemoSample {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  image: string;
  ingredients: string;
  result: VerificationResult;
}
