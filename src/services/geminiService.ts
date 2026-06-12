import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult } from "../types";

// Prepare base64/mime object helper
function forceBase64Format(dataUrl: string): { mimeType: string; data: string } {
  let base64Data = dataUrl;
  let mimeType = "image/jpeg";
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    mimeType = matches[1];
    base64Data = matches[2];
  }
  return { mimeType, data: base64Data };
}

export async function verifyHalalStatusWithGemini(
  apiKey: string,
  dataUrl: string,
  enableSearchGrounding: boolean,
  ingredientsCatalog: any[],
  certifiedCompanies: any[]
): Promise<VerificationResult> {
  const activeAi = new GoogleGenAI({ apiKey });
  const { mimeType, data } = forceBase64Format(dataUrl);

  const imagePart = {
    inlineData: { mimeType, data }
  };

  const promptText = `
You are an expert Halal Food Auditor and Certification Consultant. Analyze this product image (which contains an ingredients list, packing front, or barcode).

Your instructions:
1. Examine any visible Halal certification seals (JAKIM, MUIS, IFANCA, Halal Japan Association, etc.). If certified, label as H1.
2. Review printed ingredients. Identify any Haram components like "豚肉" (Pork), "ゼラチン" (Gelatin), "豚脂 / ラード" (Lard / Pork fat), "酒精 / 酒 / みりん" (Ethyl alcohol / Cooking sake / Mirin).
3. Identify doubtful elements like Shortening (ショートニング), Soap base Emulsifiers (乳化剤), or Collagen Peptide (コラーゲンペプチド).
4. Assign one of 6 levels strictly:
   - "H1": Active Halal certification logo found.
   - "H2": Guaranteed 100% free of animal derivatives, vegan/plant-based, no alcohol.
   - "H3": No haram items, but processed on shared lines with non-halal items.
   - "D": Contains alcohol of unknown source, or doubtful ingredients (Shortening, Emulsifier, Margarine) with undisclosed origins.
   - "HR1": Contaminated lines/cross-contact explicit warning.
   - "HR2": Definite pork, lard, gelatin (pork derived), or direct mirin/wine/cooking liquor.
5. IMPORTANT SYMMETRY FOR ADDITIVES AND E-NUMBERS:
   On product packaging (including Japanese ingredients and international listings), food additives can be listed as E-numbers (e.g., "E120", "E471") or as raw numbers without any "E" prefix (e.g., "120", "471"). Both notations are completely symmetric and identical.
   They refer to the exact same substance listed in the reference catalog and are classified under the same category of Halal/Haram/Syubhat status.
   Map any raw numbers found in the ingredients text (like "471" or "322") directly to their matching E-number representation in the catalog (like "E471" or "E322") and vice-versa.
${enableSearchGrounding ? `6. GOOGLE SEARCH GROUNDING: Use Google Search Grounding to cross-examine and look up details about this Japanese product or its ingredients, brand manufacturer declarations, or recent inquiries regarding its Halal certification status. Verify online if the specific food brand or product ingredients panel contains non-halal derivatives. Use these search results to provide highly precise and factual explanations.` : ""}

Reference catalog of ingredients and additives to use (derived from Numbers_With_No_E_Prefix.pdf and E_Numbers_With_E_Prefix.pdf):
${JSON.stringify(ingredientsCatalog, null, 2)}

Official Japan Halal Association (JHA) Certified Brand Reference List:
If the audited brand name or company matches one of these companies, and the product matches their certified product entries, categorize the product immediately as "H1" (Active Halal logo or manufacturer certification active):
${JSON.stringify(certifiedCompanies, null, 2)}

Provide your analysis in clean JSON.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING, description: "Display name of the food item" },
      brand: { type: Type.STRING, description: "Manufacturer brand" },
      barcode: { type: Type.STRING, description: "Digits of the barcode if visible" },
      halalLevel: { type: Type.STRING, description: "H1, H2, H3, D, HR1, or HR2" },
      halalLevelExplanation: { type: Type.STRING, description: "Explain why this level was selected" },
      detectedLanguage: { type: Type.STRING, description: "Language parsed on label" },
      extractedIngredientsText: { type: Type.STRING, description: "Raw block of extracted ingredient text" },
      ingredientsAnalysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            extractedName: { type: Type.STRING },
            category: { type: Type.STRING },
            halalStatus: { type: Type.STRING },
            matchedKeyword: { type: Type.STRING }
          },
          required: ["name", "extractedName", "category", "halalStatus"]
        }
      },
      finalRecommendation: { type: Type.STRING }
    },
    required: ["productName", "halalLevel", "halalLevelExplanation", "extractedIngredientsText", "ingredientsAnalysis", "finalRecommendation"]
  };

  const apiConfig: any = {
    responseMimeType: "application/json",
    responseSchema: schema,
    temperature: 0.1
  };

  if (enableSearchGrounding) {
    apiConfig.tools = [{ googleSearch: {} }];
  }

  const resultCall = await activeAi.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [imagePart, { text: promptText }],
    config: apiConfig
  });

  const cleanedText = resultCall.text ? resultCall.text.trim() : "";
  if (!cleanedText) {
    throw new Error("Empty feedback from Gemini model. Try uploading a clearer picture.");
  }

  const result: VerificationResult = JSON.parse(cleanedText);
  return result;
}

export async function verifyHalalStatusBatchWithGemini(
  apiKey: string,
  items: { id: string; name: string; dataUrl: string }[],
  enableSearchGrounding: boolean,
  ingredientsCatalog: any[],
  certifiedCompanies: any[]
): Promise<any[]> {
  const activeAi = new GoogleGenAI({ apiKey });

  const contents: any[] = [];
  items.forEach((item) => {
    const { mimeType, data } = forceBase64Format(item.dataUrl);
    contents.push({
      inlineData: { mimeType, data }
    });
  });

  const promptText = `
You are an expert Halal Food Auditor and Certification Consultant. Analyze the provided batch of ${items.length} product images.
Images are provided sequentially from index 0 to ${items.length - 1} in the exact order they appear in the model input contents.

For each image, perform a robust Halal Food audit:
1. Examine any visible Halal certification seals (JAKIM, MUIS, IFANCA, Halal Japan Association, etc.). If certified, label as H1.
2. Review printed ingredients. Identify any Haram components like "豚肉" (Pork), "ゼラチン" (Gelatin), "豚脂 / ラード" (Lard / Pork fat), "酒精 / 酒 / みりん" (Ethyl alcohol / Cooking sake / Mirin).
3. Identify doubtful elements like Shortening (ショートニング), Soap base Emulsifiers (乳化剤), or Collagen Peptide (コラーゲンペプチド).
4. Assign one of 6 levels strictly:
   - "H1": Active Halal certification logo found.
   - "H2": Guaranteed 100% free of animal derivatives, vegan/plant-based, no alcohol.
   - "H3": No haram items, but processed on shared lines with non-halal items.
   - "D": Contains alcohol of unknown source, or doubtful ingredients (Shortening, Emulsifier, Margarine) with undisclosed origins.
   - "HR1": Contaminated lines/cross-contact explicit warning.
   - "HR2": Definite pork, lard, gelatin (pork derived), or direct mirin/wine/cooking liquor.
5. IMPORTANT SYMMETRY FOR ADDITIVES AND E-NUMBERS:
   Food additives can be listed as E-numbers (e.g., "E120", "E471") or as raw numbers without any "E" prefix (e.g., "120", "471"). Both notations are completely symmetric and identical. Match any raw numbers in the ingredients text to their corresponding E-number representation in our catalog (like "E471" for "471") and vice-versa.
${enableSearchGrounding ? `6. GOOGLE SEARCH GROUNDING: Use Google Search Grounding to cross-examine and look up details about these Japanese products or their ingredients, brand manufacturer declarations, or recent inquiries regarding their Halal certification status. Verify online if the specific food brand or product ingredients panel contains non-halal derivatives. Use these search results to provide highly precise and factual explanations.` : ""}

Reference catalog of ingredients and additives to use:
${JSON.stringify(ingredientsCatalog, null, 2)}

Official Japan Halal Association (JHA) Certified Brand Reference List:
If the audited brand name or company matches one of these companies, and the product matches their certified product entries, categorize the product immediately as "H1":
${JSON.stringify(certifiedCompanies, null, 2)}

Produce a JSON output containing a "results" array, where each element corresponds to one of the input images in the order provided (0-based index matched with "imageIndex").
  `;

  contents.push({ text: promptText });

  const schema = {
    type: Type.OBJECT,
    properties: {
      results: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            imageIndex: { type: Type.INTEGER, description: "The 0-based index of the image this result corresponds to in the input contents." },
            productName: { type: Type.STRING, description: "Display name of the food item" },
            brand: { type: Type.STRING, description: "Manufacturer brand" },
            barcode: { type: Type.STRING, description: "Digits of the barcode if visible" },
            halalLevel: { type: Type.STRING, description: "H1, H2, H3, D, HR1, or HR2" },
            halalLevelExplanation: { type: Type.STRING, description: "Explain why this level was selected" },
            detectedLanguage: { type: Type.STRING, description: "Language parsed on label" },
            extractedIngredientsText: { type: Type.STRING, description: "Raw block of extracted ingredient text" },
            ingredientsAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  extractedName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  halalStatus: { type: Type.STRING },
                  matchedKeyword: { type: Type.STRING }
                },
                required: ["name", "extractedName", "category", "halalStatus"]
              }
            },
            finalRecommendation: { type: Type.STRING }
          },
          required: ["imageIndex", "productName", "halalLevel", "halalLevelExplanation", "extractedIngredientsText", "ingredientsAnalysis", "finalRecommendation"]
        }
      }
    },
    required: ["results"]
  };

  const apiConfig: any = {
    responseMimeType: "application/json",
    responseSchema: schema,
    temperature: 0.1
  };

  if (enableSearchGrounding) {
    apiConfig.tools = [{ googleSearch: {} }];
  }

  const resultCall = await activeAi.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: contents,
    config: apiConfig
  });

  const cleanedText = resultCall.text ? resultCall.text.trim() : "";
  if (!cleanedText) {
    throw new Error("Empty feedback from Gemini model. Try uploading clearer picture(s).");
  }

  const parsedJSON = JSON.parse(cleanedText);
  return parsedJSON.results || [];
}
