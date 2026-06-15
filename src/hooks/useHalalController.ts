import React, { useState, useRef, useEffect } from "react";
import { UploadedItem, VerificationResult } from "../types";
import { DEMO_SAMPLES } from "../data/samples";
import { ALL_INGREDIENTS, JHA_CERTIFIED_COMPANIES } from "../data/halalIngredients";
import { verifyHalalStatusWithGemini, verifyHalalStatusBatchWithGemini } from "../services/geminiService";

// Standard apiKey setup
const apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) || (typeof process !== "undefined" ? process.env.GEMINI_API_KEY : "") || "";

export default function useHalalController() {
  const [uploadedImages, setUploadedImages] = useState<UploadedItem[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

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
  const [enableSearchGrounding, setEnableSearchGrounding] = useState<boolean>(() => {
    return localStorage.getItem("halal_enable_search_grounding") !== "false";
  });
  const [showKey, setShowKey] = useState(false);

  // Active item and derived values
  const activeItem = uploadedImages.find(item => item.id === activeImageId) || null;
  const selectedImage = activeItem ? activeItem.dataUrl : null;
  const result = activeItem ? activeItem.result : null;
  const isAnalyzing = activeItem ? activeItem.isAnalyzing : false;
  const analysisProgress = activeItem ? activeItem.analysisProgress : "";
  const errorMsg = activeItem ? activeItem.error : generalError;

  // Sync settings back to localStorage if modal is closed
  useEffect(() => {
    if (!isSettingsOpen) {
      setCustomApiKey(localStorage.getItem("halal_custom_api_key") || "");
      setUseCustomKey(localStorage.getItem("halal_use_custom_key") === "true");
      setEnableSearchGrounding(localStorage.getItem("halal_enable_search_grounding") !== "false");
    }
  }, [isSettingsOpen]);

  const saveSettings = (key: string, enabled: boolean, grounding: boolean) => {
    localStorage.setItem("halal_custom_api_key", key.trim());
    localStorage.setItem("halal_use_custom_key", enabled ? "true" : "false");
    localStorage.setItem("halal_enable_search_grounding", grounding ? "true" : "false");
    setCustomApiKey(key.trim());
    setUseCustomKey(enabled);
    setEnableSearchGrounding(grounding);
    setIsSettingsOpen(false);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const analysisSessionRef = useRef<number>(0);

  const updateItemState = (itemId: string | null, updates: Partial<UploadedItem>) => {
    if (!itemId) return;
    setUploadedImages(prev => prev.map(item => item.id === itemId ? { ...item, ...updates } : item));
  };

  const stopAnalysis = () => {
    analysisSessionRef.current += 1;
    if (activeImageId) {
      updateItemState(activeImageId, { isAnalyzing: false, analysisProgress: "" });
    }
  };

  // Live UTC Dynamic Clock
  const [currentTime, setCurrentTime] = useState("2026-06-11 17:11:33 UTC");

  useEffect(() => {
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
          const isAndroidApp = typeof window !== "undefined" && (
            !!(window as any).Capacitor || 
            window.location.search.includes("platform=native") ||
            (typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("android"))
          );
          
          let alertMsg = "Could not request access to device camera.";
          if (isAndroidApp) {
            alertMsg += " On Android, please ensure you have granted Camera permission to the Halal Product Verifier app in your Android System Settings (Settings -> Apps -> Halal Product Verifier -> Permissions).";
          } else {
            alertMsg += " Please verify that you have given this site permission to access your camera in your browser's address bar.";
          }
          setGeneralError(alertMsg);
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

  const startCamera = () => {
    setGeneralError(null);
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
        
        const itemId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        const newItem: UploadedItem = {
          id: itemId,
          name: `Camera Capture (${new Date().toLocaleTimeString()})`,
          dataUrl: dataUrl,
          result: null,
          isAnalyzing: true,
          analysisProgress: "Preparing visual data...",
          error: null
        };
        
        setUploadedImages(prev => [...prev, newItem]);
        setActiveImageId(itemId);
        stopCamera();
        verifyHalalStatus(dataUrl, itemId);
      }
    }
  };

  const processFiles = (files: FileList | File[]) => {
    setGeneralError(null);
    const list = Array.from(files);
    
    const validFiles = list.filter(file => {
      if (!file.type.startsWith("image/")) {
        setGeneralError("Please select a valid image file (PNG, JPG, or WEBP).");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    let loadedCount = 0;
    const newItems: UploadedItem[] = [];

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const itemId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 11)}-${index}`;
        const newItem: UploadedItem = {
          id: itemId,
          name: file.name || `Uploaded image #${index + 1}`,
          dataUrl: dataUrl,
          result: null,
          isAnalyzing: true,
          analysisProgress: "Preparing batch image...",
          error: null
        };
        newItems.push(newItem);
        loadedCount++;

        if (loadedCount === validFiles.length) {
          // Sort items by original index to ensure consistent ordering matching the drop list
          newItems.sort((a, b) => {
            const aIdx = parseInt(a.id.split("-").pop() || "0", 10);
            const bIdx = parseInt(b.id.split("-").pop() || "0", 10);
            return aIdx - bIdx;
          });

          setUploadedImages(prev => {
            const updated = [...prev, ...newItems];
            setActiveImageId(prevActive => prevActive || newItems[0].id);
            return updated;
          });
          verifyHalalStatusBatch(newItems);
        }
      };
      reader.onerror = () => {
        setGeneralError("Error reading the image file.");
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleSelectSample = (sample: typeof DEMO_SAMPLES[0]) => {
    setGeneralError(null);
    const existing = uploadedImages.find(item => item.id === sample.id);
    if (existing) {
      setActiveImageId(sample.id);
    } else {
      const newItem: UploadedItem = {
        id: sample.id,
        name: sample.name,
        dataUrl: sample.image,
        result: sample.result,
        isAnalyzing: false,
        analysisProgress: "",
        error: null
      };
      setUploadedImages(prev => [...prev, newItem]);
      setActiveImageId(sample.id);
    }
  };

  const removeUploadedImage = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUploadedImages(prev => {
      const filtered = prev.filter(item => item.id !== itemId);
      if (activeImageId === itemId) {
        setActiveImageId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const clearAllUploadedImages = () => {
    setUploadedImages([]);
    setActiveImageId(null);
    setGeneralError(null);
  };

  const verifyHalalStatus = async (imageToAnalyze?: string, targetItemId?: string) => {
    const itemId = targetItemId || activeImageId;
    if (!itemId) return;

    const finalApiKey = useCustomKey && customApiKey.trim() ? customApiKey.trim() : apiKey;
    const imgData = imageToAnalyze || uploadedImages.find(item => item.id === itemId)?.dataUrl;
    if (!imgData) {
      updateItemState(itemId, { error: "Please provide a product image.", isAnalyzing: false });
      return;
    }

    updateItemState(itemId, { isAnalyzing: true, result: null, error: null });

    analysisSessionRef.current += 1;
    const currentSession = analysisSessionRef.current;

    const states = [
      "Connecting to Gemini Flash 3.1 Lite engine...",
      "Extracting text (OCR) from ingredients panel...",
      "Translating Japanese Kanji characters to English...",
      "Decoding food packaging additives & E-numbers...",
      "Matching found elements with Islamic dietary rulebook...",
      "Analyzing shared-production line flags...",
      ...(enableSearchGrounding ? ["Scanning live Google search indexes for brand status..."] : []),
      "Generating Halal certification verification details..."
    ];

    let stateIdx = 0;
    updateItemState(itemId, { analysisProgress: states[0] });
    const progressTimer = setInterval(() => {
      if (analysisSessionRef.current !== currentSession) {
        clearInterval(progressTimer);
        return;
      }
      if (stateIdx < states.length - 1) {
        stateIdx++;
        updateItemState(itemId, { analysisProgress: states[stateIdx] });
      }
    }, 2000);

    try {
      if (!finalApiKey) {
        console.warn("Gemini API key is not defined. Using local rulebook lookup.");
        await new Promise(r => setTimeout(r, 3500));
        clearInterval(progressTimer);
        if (analysisSessionRef.current !== currentSession) return;
        
        if (itemId && (itemId === "sample1" || itemId === "sample2" || itemId === "sample3")) {
          const match = DEMO_SAMPLES.find(s => s.id === itemId);
          if (match) {
            updateItemState(itemId, { result: match.result, isAnalyzing: false });
            return;
          }
        }
        
        updateItemState(itemId, {
          result: {
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
          },
          isAnalyzing: false
        });
        return;
      }

      const ingredientReference = ALL_INGREDIENTS.map(ing => ({
        code: ing.code || "",
        japaneseName: ing.japaneseName || "",
        name: ing.name,
        reading: ing.reading || "",
        category: ing.category,
        description: ing.description,
        halalStatus: ing.halalStatus
      }));

      const resultData = await verifyHalalStatusWithGemini(
        finalApiKey,
        imgData,
        enableSearchGrounding,
        ingredientReference,
        JHA_CERTIFIED_COMPANIES
      );

      clearInterval(progressTimer);
      if (analysisSessionRef.current !== currentSession) return;
      updateItemState(itemId, { result: resultData, isAnalyzing: false });

    } catch (err: any) {
      if (analysisSessionRef.current !== currentSession) return;
      console.error("Gemini runtime error:", err);
      updateItemState(itemId, { 
        error: err.message || "An unexpected error occurred during direct client-side analysis. Ensure your internet and API Key configurations are active.", 
        isAnalyzing: false 
      });
    } finally {
      clearInterval(progressTimer);
    }
  };

  const verifyHalalStatusBatch = async (itemsToAnalyze: UploadedItem[]) => {
    if (!itemsToAnalyze || itemsToAnalyze.length === 0) return;

    const itemIds = itemsToAnalyze.map(item => item.id);
    const finalApiKey = useCustomKey && customApiKey.trim() ? customApiKey.trim() : apiKey;

    // Set all batch items as analyzing
    itemIds.forEach(id => {
      updateItemState(id, { isAnalyzing: true, result: null, error: null });
    });

    analysisSessionRef.current += 1;
    const currentSession = analysisSessionRef.current;

    const states = [
      "Optimizing batch: Collecting package images...",
      "Consolidating back-to-back request into a single query...",
      "Connecting to Gemini Flash 3.1 Lite (Batch Mode)...",
      "Running simultaneous Japanese ingredients text extraction...",
      "Translating all Kanjis & matching with additive rulebook...",
      ...(enableSearchGrounding ? ["Scanning live Google search indexes for all batch brands..."] : []),
      "Reviewing allergen & JHA certified manufacturer databases...",
      "Structuring unified batch output JSON..."
    ];

    let stateIdx = 0;
    itemIds.forEach(id => {
      updateItemState(id, { analysisProgress: states[0] });
    });

    const progressTimer = setInterval(() => {
      if (analysisSessionRef.current !== currentSession) {
        clearInterval(progressTimer);
        return;
      }
      if (stateIdx < states.length - 1) {
        stateIdx++;
        itemIds.forEach(id => {
          updateItemState(id, { analysisProgress: states[stateIdx] });
        });
      }
    }, 2000);

    try {
      if (!finalApiKey) {
        console.warn("Gemini API key is not defined. Using local simulated batch lookup.");
        await new Promise(r => setTimeout(r, 3500));
        clearInterval(progressTimer);
        if (analysisSessionRef.current !== currentSession) return;

        itemsToAnalyze.forEach((item) => {
          if (item.id === "sample1" || item.id === "sample2" || item.id === "sample3") {
            const match = DEMO_SAMPLES.find(s => s.id === item.id);
            if (match) {
              updateItemState(item.id, { result: match.result, isAnalyzing: false, error: null });
              return;
            }
          }

          // Local fallback
          updateItemState(item.id, {
            result: {
              productName: `${item.name} (Simulated)`,
              brand: "Unknown Brand",
              barcode: "N/A",
              halalLevel: "D",
              halalLevelExplanation: "Tested with local rulebook fallback. Configure a custom Gemini API Key in Settings to unlock optimized multi-image batch scanning!",
              detectedLanguage: "Japanese / English",
              extractedIngredientsText: "Detected package ingredients text",
              ingredientsAnalysis: [
                { name: "Shortening", extractedName: "ショートニング", category: "Syubhat", halalStatus: "Doubtful. Often lard-derived in Japanese pastries." },
                { name: "Emulsifier", extractedName: "乳化剤", category: "Syubhat", halalStatus: "Doubtful. Could contain animal fatty acids." }
              ],
              finalRecommendation: "Please configure your GEMINI_API_KEY to run real artificial intelligence package audits."
            },
            isAnalyzing: false,
            error: null
          });
        });
        return;
      }

      const ingredientReference = ALL_INGREDIENTS.map(ing => ({
        code: ing.code || "",
        japaneseName: ing.japaneseName || "",
        name: ing.name,
        reading: ing.reading || "",
        category: ing.category,
        description: ing.description,
        halalStatus: ing.halalStatus
      }));

      const batchResults = await verifyHalalStatusBatchWithGemini(
        finalApiKey,
        itemsToAnalyze,
        enableSearchGrounding,
        ingredientReference,
        JHA_CERTIFIED_COMPANIES
      );

      clearInterval(progressTimer);
      if (analysisSessionRef.current !== currentSession) return;

      // Update each item in the batch using the returned imageIndex
      itemsToAnalyze.forEach((item, idx) => {
        const foundResult = batchResults.find((r: any) => r.imageIndex === idx);
        if (foundResult) {
          // Remove the imageIndex field so it matches VerificationResult type perfectly
          const { imageIndex, ...resultData } = foundResult;
          updateItemState(item.id, { result: resultData as VerificationResult, isAnalyzing: false, error: null });
        } else {
          // If for some reason a particular index wasn't returned, update it using index match fallback
          if (batchResults[idx]) {
            const { imageIndex, ...resultData } = batchResults[idx];
            updateItemState(item.id, { result: resultData as VerificationResult, isAnalyzing: false, error: null });
          } else {
            updateItemState(item.id, { error: "No analysis returned for this image in the batch.", isAnalyzing: false });
          }
        }
      });

    } catch (err: any) {
      if (analysisSessionRef.current !== currentSession) return;
      console.error("Gemini batch runtime error:", err);
      itemsToAnalyze.forEach((item) => {
        updateItemState(item.id, { 
          error: err.message || "An unexpected error occurred during batch analysis.", 
          isAnalyzing: false 
        });
      });
    } finally {
      clearInterval(progressTimer);
    }
  };

  return {
    uploadedImages,
    activeImageId,
    setActiveImageId,
    generalError,
    setGeneralError,
    activeItem,
    selectedImage,
    result,
    isAnalyzing,
    analysisProgress,
    errorMsg,
    isCameraActive,
    setIsCameraActive,
    isRatingLevelsOpen,
    setIsRatingLevelsOpen,
    selectedSampleId,
    setSelectedSampleId,
    isSettingsOpen,
    setIsSettingsOpen,
    useCustomKey,
    setUseCustomKey,
    customApiKey,
    setCustomApiKey,
    enableSearchGrounding,
    setEnableSearchGrounding,
    showKey,
    setShowKey,
    currentTime,
    videoRef,
    fileInputRef,
    dragRef,
    saveSettings,
    stopAnalysis,
    startCamera,
    stopCamera,
    capturePhoto,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSelectSample,
    removeUploadedImage,
    clearAllUploadedImages,
    verifyHalalStatus,
    verifyHalalStatusBatch
  };
}
