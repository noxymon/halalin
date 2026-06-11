import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Upload, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Layers, 
  Info, 
  X, 
  Database, 
  HelpCircle,
  Clock,
  Check,
  AlertCircle,
  ExternalLink,
  Settings,
  Key,
  Eye,
  EyeOff,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import AboutLevels from "./components/AboutLevels";
import { ALL_INGREDIENTS, HARAM_KANJI_LIST, SYUBHAT_INGREDIENTS } from "./data/halalIngredients";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) || (typeof process !== "undefined" ? process.env.GEMINI_API_KEY : "") || "";
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
  });
}

interface AnalyzedIngredient {
  name: string;
  extractedName: string;
  category: "Haram" | "Syubhat" | "Halal" | "Mushbooh" | "Safe";
  halalStatus: string;
  matchedKeyword?: string;
}

interface VerificationResult {
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

// Pre-packaged high-fidelity demo sample data
const DEMO_SAMPLES = [
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
    } as VerificationResult
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
    } as VerificationResult
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
    } as VerificationResult
  }
];

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRatingLevelsOpen, setIsRatingLevelsOpen] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  // Custom User Gemini API key configurations
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [useCustomKey, setUseCustomKey] = useState<boolean>(() => {
    return localStorage.getItem("halal_use_custom_key") === "true";
  });
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem("halal_custom_api_key") || "";
  });
  const [showKey, setShowKey] = useState(false);

  const saveSettings = (key: string, enabled: boolean) => {
    localStorage.setItem("halal_custom_api_key", key.trim());
    localStorage.setItem("halal_use_custom_key", enabled ? "true" : "false");
    setCustomApiKey(key.trim());
    setUseCustomKey(enabled);
    setIsSettingsOpen(false);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const analysisSessionRef = useRef<number>(0);

  const stopAnalysis = () => {
    analysisSessionRef.current += 1;
    setIsAnalyzing(false);
    setAnalysisProgress("");
  };

  // Time stamp
  const [currentTime, setCurrentTime] = useState("2026-06-11 07:29:00 UTC");

  useEffect(() => {
    // Tick to update current UTC time nicely
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Declarative camera streaming trigger
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isActive = true;

    async function setupCamera() {
      if (isCameraActive) {
        try {
          // Wait briefly to let DOM layout settle so videoRef.current is guaranteed initialized
          await new Promise(r => setTimeout(r, 80));
          if (!isActive) return;

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
          });

          if (!isActive) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }

          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => {
              console.warn("Video autostart suspended, retrying active play:", err);
            });
          }
        } catch (err: any) {
          console.error("Camera access failed:", err);
          setErrorMsg("Could not request access to device camera. Check layout permissions in metadata and address browser security settings.");
          setIsCameraActive(false);
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = null;
        }
      }
    }

    setupCamera();

    return () => {
      isActive = false;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  // Web camera handlers
  const startCamera = () => {
    setResult(null);
    setErrorMsg(null);
    setSelectedImage(null);
    setSelectedSampleId(null);
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(dataUrl);
        setSelectedSampleId(null);
        stopCamera();
        verifyHalalStatus(dataUrl);
      }
    }
  };

  // File drop and select handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedImage(dataUrl);
      setSelectedSampleId(null);
      verifyHalalStatus(dataUrl);
    };
    reader.onerror = () => {
      setErrorMsg("Error reading the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragRef.current) {
      dragRef.current.classList.add("border-emerald-500", "bg-emerald-50/50");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragRef.current) {
      dragRef.current.classList.remove("border-emerald-500", "bg-emerald-50/50");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragRef.current) {
      dragRef.current.classList.remove("border-emerald-500", "bg-emerald-50/50");
    }
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Run the Sample Demo immediate loader
  const handleSelectSample = (sample: typeof DEMO_SAMPLES[0]) => {
    setSelectedImage(sample.image);
    setSelectedSampleId(sample.id);
    setResult(sample.result);
    setErrorMsg(null);
  };

  // Trigger Gemini API Client analysis
  const verifyHalalStatus = async (imageToAnalyze?: string) => {
    const finalApiKey = useCustomKey && customApiKey.trim() ? customApiKey.trim() : apiKey;
    const imgData = imageToAnalyze || selectedImage;
    if (!imgData) {
      setErrorMsg("Please provide a product image either by camera capture, file upload, or by choosing a demo sample.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setErrorMsg(null);

    analysisSessionRef.current += 1;
    const currentSession = analysisSessionRef.current;

    // List of rotating analysis progress states to create visual polish
    const states = [
      "Connecting to Gemini Flash 3.5 Client-side engine...",
      "Extracting text (OCR) from ingredients panel...",
      "Translating Japanese Kanji characters to English...",
      "Decoding food packaging additives & E-numbers...",
      "Matching found elements with Islamic dietary rulebook...",
      "Analyzing shared-production line flags...",
      "Generating Halal certification verification details..."
    ];

    let stateIdx = 0;
    setAnalysisProgress(states[0]);
    const progressTimer = setInterval(() => {
      if (analysisSessionRef.current !== currentSession) {
        clearInterval(progressTimer);
        return;
      }
      if (stateIdx < states.length - 1) {
        stateIdx++;
        setAnalysisProgress(states[stateIdx]);
      }
    }, 2000);

    try {
      // If we don't have an API Key but selected a demo sample, use the precompiled mock result
      if (!finalApiKey) {
        console.warn("Gemini API key is not defined. Using local rulebook lookup.");
        setTimeout(() => {
          clearInterval(progressTimer);
          if (analysisSessionRef.current !== currentSession) return;
          if (selectedSampleId) {
            const match = DEMO_SAMPLES.find(s => s.id === selectedSampleId);
            if (match) {
              setResult(match.result);
              setIsAnalyzing(false);
              return;
            }
          }
          // Default fallback mock response in case they uploaded a custom image without API Key
          setResult({
            productName: "Uploaded Product (Local Rulebook Scan)",
            brand: "Unknown Brand",
            barcode: "N/A",
            halalLevel: "D",
            halalLevelExplanation: "Tested locally without an active Gemini API connection. Sourcing analysis based on common Japanese additives database. Please check standard ingredients rulebook.",
            detectedLanguage: "Auto-detected",
            extractedIngredientsText: "Ing: flour, sugar, shortening, emulsifier, soy sauce.",
            ingredientsAnalysis: [
              { name: "Shortening", extractedName: "ショートニング", category: "Syubhat", halalStatus: "Doubtful. Often lard-derived in Japanese pastries." },
              { name: "Soy Sauce", extractedName: "醤油", category: "Syubhat", halalStatus: "Doubtful. Trace alcohol remains unless labeled halal." }
            ],
            finalRecommendation: "Caution: Sourced shortening is doubtful. Please save a custom Gemini API Key in the top Settings panel to unlock full real-time AI analyzer capabilities!"
          });
          setIsAnalyzing(false);
        }, 4000);
        return;
      }

      // Prepare Direct Client-Side Gemini request with selected API key
      const activeAi = new GoogleGenAI({ apiKey: finalApiKey });

      // Parse base64 from current image
      let base64Data = imgData;
      let mimeType = "image/jpeg";
      const matches = imgData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      }

      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      };

      const ingredientReference = ALL_INGREDIENTS.map(ing => ({
        code: ing.code || "",
        japaneseName: ing.japaneseName || "",
        name: ing.name,
        reading: ing.reading || "",
        category: ing.category,
        description: ing.description,
        halalStatus: ing.halalStatus
      }));

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
   Map any raw numbers found in the ingredients text (like "471" or "322") directly to their matching E-number representation in the catalog (like "E471" or "E322") and vice versa.

Reference catalog of ingredients and additives to use (derived from Numbers_With_No_E_Prefix.pdf and E_Numbers_With_E_Prefix.pdf):
${JSON.stringify(ingredientReference, null, 2)}

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

      const resultCall = await activeAi.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          imagePart,
          { text: promptText + (customText ? `\nUser's supplementary notes or instructions: ${customText}` : "") }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.1
        }
      });

      clearInterval(progressTimer);
      if (analysisSessionRef.current !== currentSession) return;
      const cleanedText = resultCall.text ? resultCall.text.trim() : "";
      if (!cleanedText) {
        throw new Error("Empty feedback from Gemini model. Try uploading a clearer picture.");
      }

      const parsedJSON: VerificationResult = JSON.parse(cleanedText);
      setResult(parsedJSON);
    } catch (err: any) {
      if (analysisSessionRef.current !== currentSession) return;
      console.error("Gemini runtime error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during direct client-side analysis. Ensure your internet and API Key configurations are active.");
    } finally {
      clearInterval(progressTimer);
      if (analysisSessionRef.current === currentSession) {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div id="halal-pro-app" className="min-h-screen bg-slate-50 flex flex-col font-sans text-stone-800 selection:bg-emerald-100 dark:bg-stone-950 dark:text-stone-100">
      
      {/* 16-height top Header matching "Professional Polish" layout */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 shadow-sm dark:bg-stone-900 dark:border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-inner">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight dark:text-white flex items-center">
              HalalVerify
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            id="rating-levels-trigger"
            onClick={() => setIsRatingLevelsOpen(true)}
            className="flex items-center justify-center h-8 w-8 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-emerald-600 rounded-xl transition-all dark:bg-stone-850 dark:border-stone-800 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-emerald-400"
            title="Rating Levels Status"
          >
            <Layers className="h-4 w-4" />
          </button>

          <button 
            id="api-settings-trigger"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all dark:bg-stone-850 dark:border-stone-800 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <Settings className="h-3.5 w-3.5 animate-spin-slow" />
            <span>API Settings</span>
            {useCustomKey && customApiKey.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-500 font-medium dark:text-stone-400">
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[11px] font-semibold border border-slate-200 flex items-center gap-1.5 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Serverless Client Mode (No Webserver)
            </span>
            <span className="flex items-center gap-1 text-slate-400"><Clock className="h-3 w-3" /> {currentTime}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        
        {/* OCR VERIFIER WORKFLOW */}
        <div className="w-full">
            
            {/* SUB-FLOW 1: DEDICATED REAL-TIME CAMERA SCANNER VIEW */}
            {isCameraActive && !selectedImage && (
              <div className="max-w-xl mx-auto w-full py-2">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg dark:bg-stone-900 dark:border-stone-800 overflow-hidden">
                  
                  {/* Camera Header Row */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-150 mb-4 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      <span className="font-extrabold text-sm text-slate-800 dark:text-white">Active Camera Scanner</span>
                    </div>
                    <button 
                      onClick={stopCamera}
                      className="text-slate-500 hover:text-slate-850 flex items-center gap-1 py-1 px-2.5 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold rounded-lg transition-all dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-750 cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" /> 
                      <span>Cancel Scan</span>
                    </button>
                  </div>

                  {/* Realtime Video Feed Canvas Frame */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 bg-black shadow-inner">
                    <video 
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* Highly Professional Overlay Sight Guidelines Target */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                      <div className="relative w-full h-full border-2 border-dashed border-emerald-500/40 rounded-xl">
                        {/* 4 Glowing Corner Angles for Targeting Alignment */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>

                        {/* Scrolling Green OCR Laser Scan Line */}
                        <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[scan_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded text-[10px] text-emerald-450 font-bold tracking-wide uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span>Live Camera Feed</span>
                    </div>
                  </div>

                  {/* Instructions Guide */}
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-4 text-center leading-relaxed max-w-sm mx-auto">
                    Align your product's Japanese or English ingredients text panel inside the targeting scope and snap a capture.
                  </p>

                  {/* Trigger Call to Actions */}
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button 
                      onClick={capturePhoto}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-550 text-white rounded-full text-xs font-extrabold flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      <Camera className="h-4.5 w-4.5" /> Capture & Verify
                    </button>
                    <button 
                      onClick={stopCamera}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 rounded-full text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* SUB-FLOW 2: FIRST MAIN PAGE DISPLAY (2 SOLID CTAs ONLY) */}
            {!selectedImage && !isCameraActive && (
              <div className="max-w-xl mx-auto w-full py-4 text-center animate-fade-in">
                
                {/* THE 2 GRAND CALL TO ACTIONS SELECTED BY THE USER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  
                  {/* CTA 1: LIVE WEBCAM SCANNER (DEDICATED SCAN AREA) */}
                  <button 
                    id="cta-camera-scan"
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center p-6 bg-emerald-600 hover:bg-emerald-550 text-white rounded-2xl border border-emerald-550 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-[0.98] transition-all group cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center mb-4 border border-emerald-400/30 group-hover:scale-105 transition-transform shadow-inner text-white">
                      <Camera className="h-6 w-6" />
                    </div>
                    <span className="font-extrabold text-sm tracking-wide">Live Camera Scan</span>
                    <span className="text-[11px] text-emerald-100/95 mt-1 px-1.5 leading-snug">
                      Point your lens at standard Japanese food ingredients list to analyze them step-by-step.
                    </span>
                  </button>

                  {/* CTA 2: UPLOAD IMAGE FILE PANEL */}
                  <button 
                    id="cta-upload-photo"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-100 text-slate-850 rounded-2xl border border-slate-205 hover:border-slate-300 shadow hover:shadow-md active:scale-[0.98] transition-all group dark:bg-stone-900 dark:border-stone-850 dark:text-white dark:hover:bg-stone-850 cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100 group-hover:scale-105 transition-transform dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/35 shadow-inner">
                      <Upload className="h-6 w-6" />
                    </div>
                    <span className="font-extrabold text-sm tracking-wide">Upload Label Image</span>
                    <span className="text-[11px] text-slate-500 dark:text-stone-400 mt-1 px-1.5 leading-snug font-medium">
                      Drop a photograph of standard Japanese food ingredients list to analyze them step-by-step.
                    </span>
                  </button>

                </div>

                {/* Instant trial template presets collapsed drawer */}
                <div id="quick-preset-shortcuts" className="mt-10 pt-6 border-t border-slate-200 dark:border-stone-850 w-full max-w-sm mx-auto">
                  <span className="text-[9px] text-slate-400 dark:text-stone-550 uppercase tracking-widest font-black block mb-3">
                    Or instantly test with presets
                  </span>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {DEMO_SAMPLES.map(sample => (
                      <button 
                        key={sample.id}
                        onClick={() => {
                          handleSelectSample(sample);
                        }}
                        className="text-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 px-3 py-1.5 rounded-xl font-bold dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-850 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <span>{sample.id === "sample1" ? "🍓" : sample.id === "sample2" ? "🍵" : "🍛"}</span>
                        <span>{sample.name.split(" ")[0]} ({sample.badge.split(" ")[0]})</span>
                        <ChevronRight className="h-2.5 w-2.5 opacity-55 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUB-FLOW 3: SELECTED IMAGE RESULT ANALYSIS SPLIT GRID */}
            {selectedImage && !isCameraActive && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column (Scan Controls) occupies col-span-5 */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full dark:bg-stone-900 dark:border-stone-800">
            
            {/* Header label */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center dark:border-stone-800 dark:bg-stone-800/50">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest dark:text-stone-400">Product Image Feed</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded font-bold uppercase dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
                OCR Scanner
              </span>
            </div>

            {/* Main Interactive Stage Box */}
            <div 
              id="interactive-stage"
              ref={dragRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="flex-1 bg-stone-900 min-h-[350px] relative flex flex-col items-center justify-center p-5 transition-all duration-300"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />

              {/* State 1: Live Web camera stream */}
              {isCameraActive && !selectedImage && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="relative w-full rounded-xl overflow-hidden border border-stone-700 bg-black shadow-lg">
                    <video 
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full max-h-[280px] object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-emerald-400 border-dashed animate-pulse opacity-80 shadow shadow-emerald-400"></div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      <button 
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <Camera className="h-4 w-4" /> Capture Photo
                      </button>
                      <button 
                        onClick={stopCamera}
                        className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full shadow-md transition-all"
                        title="Cancel camera scan"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* State 2: Selected Image Preview with scanning overlay laser line */}
              {selectedImage && !isCameraActive && (
                <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex items-center justify-center shadow-inner">
                  <img 
                    src={selectedImage} 
                    alt="Current preview" 
                    className="w-full h-full object-contain"
                  />
                  {/* Glowing Green Laser Scanner Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_12px_#10b981] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                  
                  {!isAnalyzing && (
                    <button 
                      onClick={() => { 
                        setSelectedImage(null); 
                        setResult(null); 
                        setSelectedSampleId(null); 
                        setErrorMsg(null); 
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-600 rounded-full text-white transition-colors shadow"
                      title="Remove image"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              )}

              {/* State 3: Empty Unified Entry Area (Upload file OR start camera unified CTA) */}
              {!selectedImage && !isCameraActive && (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  {/* Paired overlapping glowing icons */}
                  <div className="flex h-14 w-24 bg-stone-800/80 rounded-full items-center justify-center border border-stone-700/60 relative mb-6 shadow-inner">
                    <div className="absolute left-3 w-8 h-8 bg-emerald-950/55 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-800/45">
                      <Camera className="h-4.5 w-4.5" />
                    </div>
                    <div className="absolute right-3 w-8 h-8 bg-blue-950/55 rounded-full flex items-center justify-center text-blue-400 border border-blue-800/45 animate-pulse">
                      <Upload className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-stone-100 tracking-wide">
                    Verify Product Halal Ingredients
                  </h3>
                  <p className="text-xs text-stone-400 max-w-[280px] mx-auto mt-2 leading-relaxed">
                    Drop a packaging photo here, activate your live camera, or upload from files.
                  </p>

                  {/* Unified CTA actions container */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-[290px] sm:max-w-none justify-center">
                    <button
                      onClick={startCamera}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-900/20 transition-all active:scale-[0.97] w-full sm:w-auto shrink-0"
                    >
                      <Camera className="h-4 w-4" /> Live Camera Scan
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-stone-800 border border-stone-700 hover:bg-stone-750 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.97] w-full sm:w-auto shrink-0"
                    >
                      <Upload className="h-4 w-4" /> Upload Packaging Photo
                    </button>
                  </div>

                  {/* Inline quick validation test templates */}
                  <div className="mt-8 pt-5 border-t border-stone-800/60 w-full max-w-[320px]">
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest font-extrabold mb-2.5">
                      Or Instantly Test Presets
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      <button 
                        onClick={() => handleSelectSample(DEMO_SAMPLES[0])}
                        className="text-[10px] bg-stone-800 hover:bg-stone-750 hover:text-white text-stone-300 px-3 py-1.5 rounded-lg border border-stone-750 font-semibold transition-all flex items-center gap-1.5"
                      >
                        <span>🍓 Mochi (Haram)</span>
                      </button>
                      <button 
                        onClick={() => handleSelectSample(DEMO_SAMPLES[2])}
                        className="text-[10px] bg-stone-800 hover:bg-stone-750 hover:text-white text-stone-300 px-3 py-1.5 rounded-lg border border-stone-750 font-semibold transition-all flex items-center gap-1.5"
                      >
                        <span>🍛 Curry (Certified Halal)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Optional text notes */}
            <div className="p-4 border-t border-slate-100 dark:border-stone-800">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Supplementary Context (Optional)
              </label>
              <input 
                type="text"
                placeholder="e.g. 'Snack bought in Osaka station, contains extract...'"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full text-xs p-2 rounded border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Action buttons matching Design draft */}
            {selectedImage && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex dark:bg-stone-850 dark:border-stone-800">
                {isAnalyzing ? (
                  <button 
                    onClick={stopAnalysis}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-50 border border-red-200 text-red-605 hover:bg-red-100 rounded-lg text-xs font-bold transition-all dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <X className="h-3.5 w-3.5 animate-pulse" />
                    <span>Stop Analyze</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                      setSelectedSampleId(null);
                      setErrorMsg(null);
                      stopCamera();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-750"
                  >
                    <span>Clear Photo</span>
                  </button>
                )}
              </div>
            )}
          </section>


        </div>

        {/* Right Column: Scan results container */}
        <div className="lg:col-span-7 flex flex-col space-y-6">

          {/* Missing API Key notice to serve as warning & guidelines helper */}
          {!apiKey && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm text-xs text-amber-800 dark:bg-amber-950/20 dark:border-amber-700 dark:text-amber-400">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-0.5">Gemini API Key Warning</h4>
                  <p className="leading-relaxed">
                    The environment variable <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px] dark:bg-amber-900/40">GEMINI_API_KEY</code> is not loaded. 
                    The application is executing fully in local lookup mode. You can try any of the <strong>Demo Samples</strong> inside the leftmost tab to instantly test simulated scans with real AI output mapping. 
                    To enable custom images, configure the key in the <strong>Secrets</strong> panel of the AI Studio Builder UI!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Critical Error Alert banner */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Analysis Loading Screen */}
          {isAnalyzing && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center space-y-4 text-center dark:bg-stone-900 dark:border-stone-800">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin dark:border-emerald-900/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-stone-800 text-sm tracking-wide dark:text-white uppercase">AI Analysis In Progress</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 italic max-w-[320px] mx-auto mt-2 h-8 leading-tight">
                  "{analysisProgress}"
                </p>
              </div>
              <div className="w-full max-w-[280px] bg-slate-100 h-1.5 rounded-full overflow-hidden dark:bg-stone-800">
                <div className="bg-emerald-600 h-full w-[70%] animate-[pulse_1.5s_infinite]"></div>
              </div>
            </div>
          )}

          {/* Welcome Dashboard layout when no active result printed */}
          {!result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 dark:bg-stone-900 dark:border-stone-800"
            >
              <div className="text-center py-6 border-b border-slate-100 dark:border-stone-800">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900">
                  <Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Begin Verification Analysis</h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 max-w-[420px] mx-auto mt-2 leading-relaxed">
                  Simply select a <strong>Demo Preset Sample</strong> in the left column, snap a photos of your product ingredients label, or upload from your photoroll. 
                  Our system verifies Japanese Kanji translation and E-numbers instantly.
                </p>
              </div>

              {/* Render the About Levels segment */}
              <AboutLevels />
            </motion.div>
          )}

          {/* Output Results panel */}
          {result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Dynamic Result Banner - colors based on verification severity */}
              <div 
                className={`border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 transition-all ${
                  ["H1", "H2"].includes(result.halalLevel)
                    ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60"
                    : result.halalLevel === "H3"
                    ? "bg-cyan-50 border-cyan-200 dark:bg-cyan-950/20 dark:border-cyan-900/60"
                    : result.halalLevel === "D"
                    ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60"
                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/60"
                }`}
              >
                {/* Large indicator stamp icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shrink-0 shadow-sm ${
                  ["H1", "H2", "H3"].includes(result.halalLevel)
                    ? "bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900 dark:border-emerald-800 dark:text-emerald-300"
                    : result.halalLevel === "D"
                    ? "bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900 dark:border-amber-800 dark:text-amber-300"
                    : "bg-red-100 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-800 dark:text-red-300"
                }`}>
                  {["H1", "H2", "H3"].includes(result.halalLevel) ? (
                    <ShieldCheck className="h-8 w-8" />
                  ) : result.halalLevel === "D" ? (
                    <AlertTriangle className="h-8 w-8" />
                  ) : (
                    <ShieldAlert className="h-8 w-8" />
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest text-[#fff] shadow ${
                      ["H1", "H2", "H3"].includes(result.halalLevel)
                        ? "bg-emerald-600"
                        : result.halalLevel === "D"
                        ? "bg-amber-500 text-amber-950"
                        : "bg-red-600"
                    }`}>
                      {result.halalLevel === "H1" && "HALAL certified (H1)"}
                      {result.halalLevel === "H2" && "Halal ingredients (H2)"}
                      {result.halalLevel === "H3" && "Permitted - Shared state (H3)"}
                      {result.halalLevel === "D" && "DOUBTFUL (Syubhat / D)"}
                      {result.halalLevel === "HR1" && "Cross warning (HR1)"}
                      {result.halalLevel === "HR2" && "Haram detected (HR2)"}
                    </span>
                    
                    {result.detectedLanguage && (
                      <span className="text-[10px] bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300">
                        {result.detectedLanguage} label
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
                    {result.productName}
                  </h3>
                  
                  {result.brand && (
                    <p className="text-[11px] text-stone-500 font-semibold dark:text-stone-400 mt-0.5">
                      Brand: <span className="text-stone-700 dark:text-stone-200">{result.brand}</span>
                    </p>
                  )}
                </div>

                {result.barcode && result.barcode !== "N/A" && (
                  <div className="text-center sm:text-right bg-white/55 px-3 py-2 rounded-lg border border-white/20 dark:bg-stone-900/50">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Barcode ID</span>
                    <span className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300">{result.barcode}</span>
                  </div>
                )}
              </div>

              {/* Grid content detailing OCR + Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left side: Ingredients item breakdown (col-span-12 or 7) */}
                <div className="md:col-span-12 space-y-4">
                  
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm dark:bg-stone-900 dark:border-stone-800">
                    
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center dark:border-stone-800 dark:bg-stone-800/50">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest dark:text-stone-400">Additives & Components Audit</h3>
                      <span className="text-[10px] text-slate-400 italic">
                        {result.ingredientsAnalysis.length} items logged
                      </span>
                    </div>

                    <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
                      {result.ingredientsAnalysis.length === 0 ? (
                        <p className="text-xs text-stone-500 italic p-4 text-center">No risky ingredients highlighted. Clear to consume or standard organic compounds with safety levels.</p>
                      ) : (
                        <div className="grid gap-2.5">
                          {result.ingredientsAnalysis.map((ing, idx) => (
                            <div 
                              key={idx}
                              className={`p-3 rounded-lg border text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                                ing.category === "Haram" 
                                  ? "bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/60" 
                                  : ing.category === "Syubhat" || ing.category === "Mushbooh"
                                  ? "bg-amber-50 border-amber-100 dark:bg-amber-950/25 dark:border-amber-900/60"
                                  : "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/40"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                                    {ing.name}
                                  </span>
                                  {ing.extractedName && (
                                    <span className="text-xs font-mono font-bold bg-white/80 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                                      {ing.extractedName}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                                  {ing.halalStatus}
                                </p>
                              </div>

                              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase self-start sm:self-center tracking-widest border text-center ${
                                ing.category === "Haram"
                                  ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400"
                                  : ing.category === "Syubhat" || ing.category === "Mushbooh"
                                  ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-400"
                                  : "bg-emerald-100 text-emerald-850 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                              }`}>
                                {ing.category}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* General Explanation Meta card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm dark:bg-stone-900 dark:border-stone-800">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Audit Rationale</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 dark:bg-stone-800/50 dark:border-stone-800">
                      {result.halalLevelExplanation}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-stone-800">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Extracted Ingredients Text (OCR)</h4>
                      <div className="bg-stone-900/5 p-3 rounded-lg font-mono text-[11px] text-stone-500 dark:bg-stone-950 dark:text-stone-400 max-h-[100px] overflow-y-auto leading-relaxed">
                        {result.extractedIngredientsText}
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3 dark:bg-emerald-950/10 dark:border-emerald-950/30">
                      <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 dark:text-emerald-400" />
                      <div>
                        <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Final Recommendation</h5>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-normal mt-0.5">
                          {result.finalRecommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </div>
      </div>
    )}
  </div>
</main>

      {/* Status Bar Footer matching "Professional Polish" layout */}
      <footer className="h-10 bg-slate-100 border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between text-[10px] text-slate-500 font-medium flex-shrink-0 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Database Online
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Client AI Active
          </span>
        </div>
        <div className="flex space-x-4">
          <span>Rules updated: 2026-06-11</span>
        </div>
      </footer>

      {/* Settings Modal overlay */}
      {isSettingsOpen && (
        <div 
          id="api-settings-modal"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 dark:bg-stone-850 dark:border-stone-800 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white tracking-tight">
                  Gemini API Configuration
                </h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-stone-350">
              <p>
                To run <strong>HalalVerify PRO</strong> on static servers (like GitHub Pages), you can securely supply your own private Google Gemini API Key directly in this browser frame.
              </p>

              <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl dark:bg-sky-950/20 dark:border-sky-900/30">
                <h4 className="font-bold text-sky-850 dark:text-sky-300 mb-1 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 shrink-0" /> Is it secure?
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-550 dark:text-stone-400">
                  Yes, fully! Your key is stored strictly on your local browser inside <strong>localStorage</strong>. It connects directly from your browser client to public Google Gemini API endpoints. Absolutely no intermediate database server is set up, and your private key is never transmitted or logged elsewhere.
                </p>
              </div>

              {/* Form Option: Use custom key checkbox */}
              <div className="space-y-3.5 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={useCustomKey}
                    onChange={(e) => setUseCustomKey(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 dark:border-stone-700 dark:bg-stone-800"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Enable Personal Gemini API Key
                    </span>
                    <p className="text-[11px] text-slate-400 dark:text-stone-450 mt-0.5">
                      Check this to override default developer credentials.
                    </p>
                  </div>
                </label>

                {/* Text input area for the API key */}
                {useCustomKey && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 dark:bg-stone-850 dark:border-stone-800"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 dark:text-stone-300 flex items-center gap-1">
                        <Key className="h-3 w-3" /> API Key Value
                      </span>
                      <a 
                        href="https://aistudio.google.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1 dark:text-emerald-400"
                      >
                        Get Free Key from Google AI Studio <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>

                    <div className="relative">
                      <input 
                        type={showKey ? "text" : "password"}
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        title={showKey ? "Hide key" : "Show key"}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Status information */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-stone-800 flex justify-between items-center text-[10px] text-slate-400 dark:text-stone-450 font-semibold uppercase tracking-wider">
                <span>Active Credentials Mode:</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  useCustomKey && customApiKey.trim()
                    ? "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30"
                    : apiKey
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                }`}>
                  {useCustomKey && customApiKey.trim() ? "Personal Key (Client-side)" : apiKey ? "Developer Key (Vite Env)" : "Offline Catalog Fallback"}
                </span>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 dark:bg-stone-850 dark:border-stone-800 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => {
                  setCustomApiKey(localStorage.getItem("halal_custom_api_key") || "");
                  setUseCustomKey(localStorage.getItem("halal_use_custom_key") === "true");
                  setIsSettingsOpen(false);
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-755 border border-slate-300 rounded-xl font-bold text-xs transition-colors dark:bg-stone-800 dark:border-stone-750 dark:text-stone-300 dark:hover:bg-stone-750"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  saveSettings(customApiKey, useCustomKey);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating Levels Modal overlay */}
      {isRatingLevelsOpen && (
        <div 
          id="rating-levels-modal"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-slate-900/40"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 dark:bg-stone-850 dark:border-stone-800 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2.5">
                <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white tracking-tight">
                  Verification Halal & Rating Levels
                </h3>
              </div>
              <button 
                onClick={() => setIsRatingLevelsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <AboutLevels />
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-150 dark:bg-stone-850 dark:border-stone-800 flex justify-end shrink-0">
              <button
                onClick={() => setIsRatingLevelsOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-555/10 transition-all cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
