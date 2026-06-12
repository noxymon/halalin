import React, { useState } from "react";
import useHalalController from "./hooks/useHalalController";
import { REACT_NATIVE_FILES } from "./data/nativeCode";
import { DEMO_SAMPLES } from "./data/samples";
import { JHA_CERTIFIED_COMPANIES } from "./data/halalIngredients";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  Settings, 
  Clock, 
  Camera, 
  Upload, 
  X, 
  Search, 
  Building2, 
  Copy, 
  Check, 
  RotateCcw, 
  Smartphone, 
  Terminal, 
  ArrowLeft, 
  Layers,
  Info,
  Share2,
  ExternalLink
} from "lucide-react";

export default function App() {
  const {
    uploadedImages,
    activeImageId,
    setActiveImageId,
    selectedImage,
    result,
    isAnalyzing,
    errorMsg,
    isCameraActive,
    setIsCameraActive,
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
    useCustomKey,
    setUseCustomKey,
    customApiKey,
    setCustomApiKey,
    enableSearchGrounding,
    setEnableSearchGrounding
  } = useHalalController();

  // Navigation: 'scan' | 'brands' | 'levels' | 'settings'
  const [simulatorTab, setSimulatorTab] = useState<"scan" | "brands" | "levels" | "settings">("scan");
  
  // Code editor states
  const [activeCodeFileIndex, setActiveCodeFileIndex] = useState(0);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);

  // Search sets for brand catalog
  const [brandSearch, setBrandSearch] = useState("");
  const [brandCategory, setBrandCategory] = useState("All");

  // Share button visual status
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");

  const backupCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2500);
      })
      .catch(() => {
        setShareStatus("error");
        setTimeout(() => setShareStatus("idle"), 2500);
      });
  };

  const handleShareReport = async () => {
    if (!result) return;

    const brandStr = result.brand ? `\n🏢 Brand: ${result.brand}` : "";
    const ingredientsStr = result.ingredientsAnalysis && result.ingredientsAnalysis.length > 0
      ? "\n\n🔬 Ingredient Analysis Details:\n" + result.ingredientsAnalysis.map(
          (ing) => `• ${ing.name}${ing.extractedName ? ` (${ing.extractedName})` : ""}: ${ing.category.toUpperCase()} - ${ing.halalStatus}`
        ).join("\n")
      : "\n\n🔬 No detailed chemical stabilizers list detected.";

    const reportText = `📋 HALAL VERIFY REPORT
----------------------------------
📦 Product: ${result.productName}${brandStr}
🛡️ Halal Compliance: LEVEL ${result.halalLevel}
📝 Rating Summary: ${result.halalLevelExplanation}${ingredientsStr}

📱 Verified using HalalVerify Mobile Sandbox`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Halal Report: ${result.productName}`,
          text: reportText,
        });
        setShareStatus("shared");
        setTimeout(() => setShareStatus("idle"), 2500);
      } catch (err) {
        // Fallback to clipboard if sharing fails or is cancelled
        backupCopyToClipboard(reportText);
      }
    } else {
      backupCopyToClipboard(reportText);
    }
  };

  const developerKeyAvailable = !!(
    ((import.meta as any).env?.VITE_GEMINI_API_KEY) || 
    (typeof process !== "undefined" && process.env.GEMINI_API_KEY) || 
    ""
  );

  const activeCodeFile = REACT_NATIVE_FILES[activeCodeFileIndex];

  // Copy code element target
  const handleCopyCode = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFileIndex(index);
    setTimeout(() => {
      setCopiedFileIndex(null);
    }, 1800);
  };

  // Upload click forwarder
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Reboot Device Simulation state
  const [isSimulatorRebooting, setIsSimulatorRebooting] = useState(false);
  const handleRebootSimulator = () => {
    setIsSimulatorRebooting(true);
    stopCamera();
    clearAllUploadedImages();
    setTimeout(() => {
      setIsSimulatorRebooting(false);
      setSimulatorTab("scan");
    }, 800);
  };

  // Brand database filtering
  const JHA_categories = ["All", ...Array.from(new Set(JHA_CERTIFIED_COMPANIES.map(comp => comp.category)))];
  const filteredBrandsList = JHA_CERTIFIED_COMPANIES.filter(comp => {
    const matchesCategory = brandCategory === "All" || comp.category === brandCategory;
    const s = brandSearch.toLowerCase();
    return matchesCategory && (
      comp.companyName.toLowerCase().includes(s) ||
      (comp.japaneseCompanyName && comp.japaneseCompanyName.toLowerCase().includes(s)) ||
      comp.certifiedProducts.some(p => p.toLowerCase().includes(s))
    );
  });

  return (
    <div id="halal-pro-app" className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-stone-850 select-none dark:bg-stone-950 dark:text-stone-100 transition-colors duration-300">
      
      {/* Hidden browser file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden" 
      />

      {/* Primary Top IDE Bar Header */}
      <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-sm dark:bg-stone-900 dark:border-stone-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow">
            <Smartphone className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black text-slate-800 tracking-tight dark:text-white flex items-center gap-1">
              HalalVerify <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider dark:bg-stone-800 dark:text-emerald-400">RN Sandbox</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 dark:text-stone-500 font-bold font-mono">
            <Clock className="h-3 w-3" /> {currentTime}
          </span>
          <button
            onClick={handleRebootSimulator}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-750 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Box</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame container */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 overflow-y-auto selection:bg-emerald-150">
        
        {/* Left Column: Mobile Simulator */}
        <div className="lg:w-[380px] w-full flex flex-col items-center shrink-0">
          
          <div className="text-center mb-3">
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider block">EXPO SIMULATION PREVIEW</span>
            <p className="text-[10px] text-slate-400 font-bold">Interactive applet running in clean iOS bezel</p>
          </div>

          {/* iOS Bezel Frame */}
          <div className="relative w-[345px] h-[680px] bg-neutral-900 rounded-[44px] p-2.5 shadow-2xl border-4 border-neutral-800 ring-8 ring-neutral-900/60 ring-offset-2 ring-offset-slate-100 dark:ring-offset-stone-950 overflow-hidden flex flex-col">
            
            {/* Bezel Camera Hole / Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5 select-none">
              <div className="w-2 h-2 rounded-full bg-neutral-950 border border-neutral-80 text-[1px]"></div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/85 animate-pulse"></span>
            </div>

            {/* Inner viewport of phone */}
            <div 
              ref={dragRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative w-full h-full bg-[#f8fafc] dark:bg-stone-950 rounded-[34px] overflow-hidden flex flex-col text-stone-800 dark:text-stone-100 select-text"
            >
              
              {/* Phone Status Bar */}
              <div className="h-9 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-between px-5 shrink-0 z-40 border-b border-slate-100/40 select-none">
                <span className="text-[10px] font-black font-mono text-neutral-800 dark:text-neutral-200">09:41</span>
                <span className="text-[10.5px] tracking-tighter">⚡ Wi-Fi 📶</span>
              </div>

              {/* Viewport content area */}
              <div className="flex-1 flex flex-col relative min-h-0">
                
                {isSimulatorRebooting ? (
                  <div className="absolute inset-0 bg-neutral-950 z-50 flex flex-col items-center justify-center space-y-2 text-center">
                    <Smartphone className="h-5 w-5 text-emerald-500 animate-bounce" />
                    <span className="text-white font-extrabold text-[11px]">HalalVerify Mobile</span>
                    <span className="text-neutral-500 font-mono text-[8px]">Expo Hot Reloading...</span>
                  </div>
                ) : (
                  <>
                    {/* Native navigation backward bar */}
                    {activeImageId && selectedImage && (
                      <div className="px-3 py-1.5 bg-white dark:bg-stone-900 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between shrink-0 select-none">
                        <button 
                          onClick={() => {
                            setActiveImageId(null);
                            stopCamera();
                          }}
                          className="flex items-center gap-0.5 text-[11px] font-black text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          <span>Layout</span>
                        </button>
                        <span className="text-[8px] font-black uppercase text-slate-405 tracking-widest">AI Report details</span>
                        <div className="w-10" />
                      </div>
                    )}

                    {activeImageId && selectedImage ? (
                      
                      /* 📱 PANEL 1: DETAILED RESULT PAGE */
                      <div className="p-3.5 space-y-3.5 text-left flex-1 overflow-y-auto">
                        
                        <div className="relative w-full h-[155px] bg-stone-900 rounded-xl overflow-hidden border flex items-center justify-center">
                          <img src={selectedImage} alt="Focused tag" className="w-full h-full object-contain" />
                          {isAnalyzing && (
                            <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_6px_#10b981] animate-[scan_2s_ease-in-out_infinite]"></div>
                          )}
                          <button
                            onClick={() => {
                              stopAnalysis();
                              removeUploadedImage(activeImageId);
                            }}
                            className="absolute top-2.5 right-2.5 p-1 bg-black/60 hover:bg-red-600 rounded-full text-white cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        {errorMsg && (
                          <div className="bg-red-50 border border-red-100 p-2.5 rounded-lg text-[10px] text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
                            {errorMsg}
                          </div>
                        )}

                        {isAnalyzing ? (
                          <div className="bg-white border rounded-xl p-5 text-center shadow-sm space-y-2 dark:bg-stone-900">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-100 border-t-emerald-600 animate-spin mx-auto"></div>
                            <span className="text-[10px] font-bold uppercase text-stone-500 block">Parsing Ingredients...</span>
                            <button onClick={stopAnalysis} className="text-[9px] text-red-500 underline">Abort</button>
                          </div>
                        ) : (
                          result && (
                            <div className="space-y-3">
                              
                              <div className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 ${
                                ["H1", "H2", "H3"].includes(result.halalLevel)
                                  ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10"
                                  : "bg-red-50/50 border-red-100 dark:bg-red-950/10"
                              }`}>
                                <span className={`px-1.5 py-0.5 text-[8px] font-black rounded text-white ${
                                  ["H1", "H2", "H3"].includes(result.halalLevel) ? "bg-emerald-600" : "bg-red-600"
                                }`}>
                                  LEVEL {result.halalLevel}
                                </span>
                                <h3 className="font-extrabold text-xs text-stone-900 dark:text-white line-clamp-1">{result.productName}</h3>
                                {result.brand && <span className="text-[9.5px] text-stone-400 font-bold">{result.brand}</span>}
                              </div>

                              {/* Breakdown list */}
                              <div className="bg-white border rounded-xl overflow-hidden dark:bg-stone-900 dark:border-stone-800">
                                <div className="px-3 py-1.5 bg-slate-50 border-b text-[8px] tracking-wider uppercase font-black text-slate-400 dark:bg-stone-850">Chemical / Additive Breakdown</div>
                                <div className="p-2.5 max-h-[145px] overflow-y-auto divide-y divide-slate-100 dark:divide-stone-800">
                                  {result.ingredientsAnalysis.map((item, id) => (
                                    <div key={id} className="py-1.5 flex justify-between gap-1 text-[10.5px]">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="font-bold text-stone-800 dark:text-stone-205">{item.name}</span>
                                          {item.extractedName && <span className="text-[8px] px-1 bg-slate-100 rounded text-slate-500">{item.extractedName}</span>}
                                        </div>
                                        <p className="text-[9.5px] text-stone-400 mt-0.5 leading-tight">{item.halalStatus}</p>
                                      </div>
                                      <span className={`text-[8px] uppercase font-black px-1 rounded h-fit shrink-0 ${
                                        item.category === "Haram" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                                      }`}>{item.category}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Explanations */}
                              <div className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg dark:bg-emerald-950/10">
                                <p className="text-[10px] text-emerald-800 dark:text-stone-300 leading-snug">
                                  {result.halalLevelExplanation}
                                </p>
                              </div>

                            </div>
                          )
                        )}

                        {uploadedImages.length > 0 && (
                          <div className="bg-slate-50/60 dark:bg-stone-900 border border-slate-150 dark:border-stone-800 rounded-xl p-2.5 text-left space-y-1.5 shrink-0">
                            <span className="text-[8px] text-slate-400 font-black uppercase">Active Snap Batch</span>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
                              {uploadedImages.map(img => (
                                <div 
                                  key={img.id}
                                  onClick={() => { setActiveImageId(img.id); stopCamera(); }}
                                  className={`relative w-10 h-10 border rounded overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                                    img.id === activeImageId 
                                      ? "ring-2 ring-emerald-500 border-transparent scale-[1.05] shadow-sm animate-pulse-subtle" 
                                      : "border-slate-200 dark:border-stone-700 hover:scale-[1.02]"
                                  }`}
                                >
                                  <img src={img.dataUrl} className="w-full h-full object-cover animate-fade-in" />
                                  <div className="absolute bottom-0 inset-x-0 text-[6.5px] bg-black/60 text-white text-center font-bold">
                                    {img.result?.halalLevel || "Pnd"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button 
                            onClick={handleShareReport}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all text-white ${
                              shareStatus === "shared" || shareStatus === "copied"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : shareStatus === "error"
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
                            }`}
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>
                              {shareStatus === "shared" 
                                ? "Shared!" 
                                : shareStatus === "copied" 
                                ? "Report Copied!" 
                                : shareStatus === "error"
                                ? "Failed to copy!"
                                : "Share Report"}
                            </span>
                          </button>
                          
                          <button 
                            onClick={() => { setActiveImageId(null); stopCamera(); }}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black cursor-pointer transition-colors dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800"
                          >
                            Close Report
                          </button>
                        </div>

                      </div>

                    ) : (
                      
                      /* 📱 PANEL 2: HOME SCENE DIRECTORY AND SCREENS */
                      <div className="flex flex-col flex-1 h-full min-h-0 relative">
                        <div className="flex-1 overflow-y-auto min-h-0 pb-16">
                        
                        {/* TAB 1: SCANNER */}
                        {simulatorTab === "scan" && (
                          <div className="p-3.5 space-y-4 flex-1 flex flex-col">
                            
                            {!developerKeyAvailable && !useCustomKey && (
                              <div className="p-2 bg-amber-50 rounded-lg border border-amber-100/60 text-left shrink-0">
                                <span className="text-[8px] font-black text-amber-800 uppercase block">Sandbox Offline Mode</span>
                                <p className="text-[8.5px] text-amber-600 mt-0.5 leading-tight">No config key detected. Toggle key in Settings tab.</p>
                              </div>
                            )}

                            {isCameraActive ? (
                              <div className="relative w-full flex-1 min-h-[220px] bg-black rounded-xl overflow-hidden flex items-center justify-center">
                                <video ref={videoRef} playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                                <div className="absolute top-2 left-2 bg-black/60 text-[7.5px] px-1.5 font-bold text-emerald-400 uppercase rounded">Live stream lens</div>
                                <div className="absolute bottom-2 inset-x-2 flex justify-between">
                                  <button onClick={stopCamera} className="p-1 bg-black/50 text-white rounded cursor-pointer text-[9px]">Close</button>
                                  <button onClick={capturePhoto} className="px-3 py-1 bg-emerald-600 text-white font-bold text-[9px] rounded cursor-pointer">Snap Photo</button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full flex-1 py-6 px-4 bg-white border border-slate-200/80 dark:bg-stone-900 rounded-2xl text-center space-y-4 flex flex-col justify-center items-center shadow-[0_4px_18px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                  <Camera className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 tracking-tight">Lens Scanner Hub</h4>
                                  <p className="text-[10px] text-slate-500 dark:text-stone-400 max-w-[220px] leading-relaxed mx-auto">
                                    Capture Japanese packaging labels or ingredients to analyze E-numbers & Halal compliance in real time.
                                  </p>
                                </div>
                                <div className="flex gap-2.5 w-full max-w-[260px] justify-center text-[12px]">
                                  <button 
                                    onClick={startCamera} 
                                    className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-extrabold cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97] shadow-md shadow-emerald-600/10 hover:bg-emerald-700 flex items-center justify-center gap-2"
                                  >
                                    <Camera className="h-4 w-4 shrink-0" />
                                    <span>Camera</span>
                                  </button>
                                  <button 
                                    onClick={triggerFileInput} 
                                    className="flex-1 py-3.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-extrabold cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97] dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 hover:bg-slate-200/60 dark:hover:bg-stone-750 flex items-center justify-center gap-2"
                                  >
                                    <Upload className="h-4 w-4 shrink-0" />
                                    <span>Upload</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Batch gallery */}
                            <div className="bg-white border rounded-xl p-2.5 text-left space-y-1.5 dark:bg-stone-900 border-slate-150">
                              <span className="text-[8.5px] text-slate-400 font-black uppercase">Active Snap Batch</span>
                              {uploadedImages.length === 0 ? (
                                <span className="text-[9.5px] italic text-slate-400 block py-1">No pictures snapped yet.</span>
                              ) : (
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
                                  {uploadedImages.map(img => (
                                    <div 
                                      key={img.id}
                                      onClick={() => { setActiveImageId(img.id); stopCamera(); }}
                                      className="relative w-10 h-10 border rounded overflow-hidden flex-shrink-0 cursor-pointer"
                                    >
                                      <img src={img.dataUrl} className="w-full h-full object-cover" />
                                      <div className="absolute bottom-0 inset-x-0 text-[6.5px] bg-black/60 text-white text-center font-bold">
                                        {img.result?.halalLevel || "Pnd"}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                          </div>
                        )}

                        {/* TAB 2: BRAND DIRECTORY */}
                        {simulatorTab === "brands" && (
                          <div className="p-3.5 flex-1 flex flex-col space-y-2 text-left">
                            <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 shrink-0">JHA Certified Companies</h3>
                            <input 
                              type="text" 
                              placeholder="Search brands database..." 
                              value={brandSearch} 
                              onChange={(e) => setBrandSearch(e.target.value)}
                              className="w-full bg-white px-2.5 py-1.5 border rounded-lg text-[11.5px] focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-stone-800 dark:border-stone-700" 
                            />
                            <div className="flex gap-1 overflow-x-auto select-none shrink-0 py-0.5">
                              {JHA_categories.map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => setBrandCategory(cat)}
                                  className={`px-2 py-0.5 border rounded-full text-[8px] uppercase font-black shrink-0 ${
                                    brandCategory === cat ? "bg-emerald-600 border-emerald-650 text-white" : "bg-white text-slate-500 dark:bg-stone-800"
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-1.5 pb-4">
                              {filteredBrandsList.map(comp => (
                                <div key={comp.id} className="p-2 bg-white border border-slate-200 rounded-lg dark:bg-stone-905">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-extrabold text-[11px] text-slate-800 dark:text-white leading-none">{comp.companyName}</h4>
                                    <span className="text-[7px] font-bold uppercase text-slate-400">{comp.category}</span>
                                  </div>
                                  <div className="mt-1.5 border-l border-dashed border-emerald-400 pl-2 text-[9.5.px]">
                                    <ul className="text-[9.5px] text-slate-500 space-y-0.5">
                                      {comp.certifiedProducts.map((p, pIdx) => <li key={pIdx}>• {p}</li>)}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TAB 3: RATING CRITERIA */}
                        {simulatorTab === "levels" && (
                          <div className="p-3.5 flex-1 flex flex-col space-y-3 text-left">
                            <div className="flex items-center justify-between shrink-0">
                              <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">Classification Guide</h3>
                              <span className="text-[8px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded dark:bg-stone-800 dark:text-stone-400">Halal Status Levels</span>
                            </div>

                            {/* Guideline Informational Reference block */}
                            <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3 text-left space-y-1.5 dark:bg-stone-900/60 dark:border-stone-800 shrink-0">
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                  <span className="text-[9.5px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wide block leading-none">Verification Standard</span>
                                  <p className="text-[9.2px] text-slate-600 dark:text-stone-300 leading-relaxed font-medium">
                                    Our rating levels strictly follow classification parameters described in:
                                  </p>
                                  <a 
                                    href="https://www.halalinjapan.com/blog/halal-japan-mobile-app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[9px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-black hover:underline mt-0.5"
                                  >
                                    <span>Halal in Japan Mobile App Blog</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Scrollable list of ratings */}
                            <div className="space-y-2 pr-0.5 pb-4">
                              {[
                                { 
                                  code: "H1", 
                                  title: "Certified Halal",
                                  desc: "Certified by authorized international organization (MUIS / JAKIM / JHA, etc.).",
                                  badgeClass: "bg-emerald-100/90 text-emerald-800 border-emerald-250 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900",
                                  cardClass: "border-l-4 border-l-emerald-500 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                                },
                                { 
                                  code: "H2", 
                                  title: "Pure Botanical / Organic",
                                  desc: "No Haram source or derivatives on the list. Consists of fully botanical, mineral, or clean synthetics.",
                                  badgeClass: "bg-teal-100/90 text-teal-800 border-teal-250 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-900",
                                  cardClass: "border-l-4 border-l-teal-500 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                                },
                                { 
                                  code: "H3", 
                                  title: "Synthesized Syntlers",
                                  desc: "Permitted chemical formula. Shares fully clean pipelines & sanitized processing systems.",
                                  badgeClass: "bg-sky-100/90 text-sky-800 border-sky-250 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-900",
                                  cardClass: "border-l-4 border-l-sky-500 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                                },
                                { 
                                  code: "D", 
                                  title: "Mushbooh (Doubtful)",
                                  desc: "Has chemical stabilizers, additives, or enzymes of undetermined animal/plant origins.",
                                  badgeClass: "bg-amber-100 text-amber-805 border-amber-250 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
                                  cardClass: "border-l-4 border-l-amber-500 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                                },
                                { 
                                  code: "HR1", 
                                  title: "Cross-Pollution Trace",
                                  desc: "Confirmed production/processing pipelines share contact with non-halal raw materials.",
                                  badgeClass: "bg-orange-100 text-orange-800 border-orange-250 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900",
                                  cardClass: "border-l-4 border-l-orange-500 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                                },
                                { 
                                  code: "HR2", 
                                  title: "Halal Violation Status",
                                  desc: "Product has direct porcine fat animal extract, pork by-products, or cooking alcohol. Strictly Haram.",
                                  badgeClass: "bg-rose-100 text-rose-800 border-rose-250 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900",
                                  cardClass: "border-l-4 border-l-rose-500 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                                }
                              ].map((item, idx) => (
                                <div key={idx} className={`p-2.5 rounded-xl flex flex-col gap-1 ${item.cardClass}`}>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border uppercase ${item.badgeClass}`}>
                                      {item.code} Level
                                    </span>
                                    <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-stone-100 leading-none">{item.title}</h4>
                                  </div>
                                  <p className="text-[9.5px] text-slate-500 dark:text-stone-400 leading-snug">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TAB 4: SETTINGS PANEL */}
                        {simulatorTab === "settings" && (
                          <div className="p-4 flex-1 flex flex-col space-y-3.5 text-left">
                            <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">Local Sandbox Variables</h3>
                            
                            <div className="space-y-3">
                              <label className="flex items-start gap-1.5 cursor-pointer">
                                <input 
                                  type="checkbox"
                                  checked={useCustomKey}
                                  onChange={(e) => setUseCustomKey(e.target.checked)}
                                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                                />
                                <div className="text-[10.5px]">
                                  <span className="font-bold block">Apply Developer Key</span>
                                  <p className="text-[8.5px] text-slate-405">Provide API credential to execute calls.</p>
                                </div>
                              </label>

                              {useCustomKey && (
                                <div className="space-y-1 p-2 bg-slate-50 border rounded-lg dark:bg-stone-900">
                                  <span className="text-[8.5px] font-bold font-mono">Gemini Key:</span>
                                  <input 
                                    type="password"
                                    value={customApiKey}
                                    onChange={(e) => {
                                      setCustomApiKey(e.target.value);
                                      localStorage.setItem("halal_custom_api_key", e.target.value);
                                      localStorage.setItem("halal_use_custom_key", "true");
                                    }}
                                    placeholder="AIzaSy..."
                                    className="w-full px-2 py-1 bg-white border rounded font-mono text-[9px] dark:bg-stone-800 dark:border-stone-700" 
                                  />
                                </div>
                              )}

                              <div className="pt-2 border-t border-slate-100">
                                <label className="flex items-start gap-1.5 cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    checked={enableSearchGrounding}
                                    onChange={(e) => {
                                      setEnableSearchGrounding(e.target.checked);
                                      localStorage.setItem("halal_enable_search_grounding", e.target.checked ? "true" : "false");
                                    }}
                                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                                  />
                                  <div className="text-[10.5px]">
                                    <span className="font-bold block">Google Grounding API</span>
                                    <p className="text-[8.5px] text-slate-405">Validate brand declarations against web indices.</p>
                                  </div>
                                </label>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                saveSettings(customApiKey, useCustomKey, enableSearchGrounding);
                                setSimulatorTab("scan");
                              }}
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-705 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                            >
                              Save settings
                            </button>
                          </div>
                        )}
                        </div>

                        {/* Interactive Tab bar */}
                        <div className="absolute bottom-3 inset-x-3 h-11 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-xl flex items-center justify-around shadow-sm z-40">
                          <button onClick={() => { setSimulatorTab("scan"); setActiveImageId(null); }} className={`flex flex-col items-center gap-0.5 text-[8.5px] ${simulatorTab === "scan" && !activeImageId ? "text-emerald-600 font-extrabold" : "text-slate-400"}`}>
                            <Camera className="h-4 w-4" />
                            <span>Scan</span>
                          </button>
                          <button onClick={() => { setSimulatorTab("brands"); setActiveImageId(null); }} className={`flex flex-col items-center gap-0.5 text-[8.5px] ${simulatorTab === "brands" ? "text-emerald-600 font-extrabold" : "text-slate-400"}`}>
                            <Building2 className="h-4 w-4" />
                            <span>Brands</span>
                          </button>
                          <button onClick={() => { setSimulatorTab("levels"); setActiveImageId(null); }} className={`flex flex-col items-center gap-0.5 text-[8.5px] ${simulatorTab === "levels" ? "text-emerald-600 font-extrabold" : "text-slate-400"}`}>
                            <Layers className="h-4 w-4" />
                            <span>Levels</span>
                          </button>
                          <button onClick={() => { setSimulatorTab("settings"); setActiveImageId(null); }} className={`flex flex-col items-center gap-0.5 text-[8.5px] ${simulatorTab === "settings" ? "text-emerald-600 font-extrabold" : "text-slate-400"}`}>
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Physical home pill indicia */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-stone-300 dark:bg-stone-800 rounded-full z-40"></div>

            </div>
          </div>
          
        </div>

        {/* Right Column: React Native Code repository exploration workspace */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm dark:bg-stone-900 dark:border-stone-800">
          
          {/* Header explorer info */}
          <div className="px-5 py-3 bg-slate-50 border-b flex justify-between items-center dark:bg-stone-850 dark:border-stone-800">
            <div className="flex items-center gap-2 text-left">
              <Terminal className="h-4 w-4 text-emerald-600" />
              <div>
                <h3 className="font-extrabold text-xs text-stone-800 dark:text-white leading-none">Native Code Explorer</h3>
                <span className="text-[9px] text-stone-400">Ready-compilable React Native TSX blocks for Expo iOS/Android</span>
              </div>
            </div>

            <button
              onClick={() => handleCopyCode(activeCodeFileIndex, activeCodeFile.content)}
              className="flex items-center gap-1 px-3 py-1 bg-white border hover:bg-slate-50 border-slate-200 text-stone-705 text-[10px] font-bold rounded-lg shadow-sm transition dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 cursor-pointer"
            >
              {copiedFileIndex === activeCodeFileIndex ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500 animate-[pulse_1s_infinite]" />
                  <span className="text-emerald-600 font-extrabold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code File</span>
                </>
              )}
            </button>
          </div>

          {/* Directory styled tabs */}
          <div className="flex bg-slate-100 border-b select-none overflow-x-auto dark:bg-stone-950 dark:border-stone-850">
            {REACT_NATIVE_FILES.map((file, idx) => {
              const isActive = idx === activeCodeFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setActiveCodeFileIndex(idx)}
                  className={`px-3 py-2 text-[10.5px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer border-r border-slate-200 dark:border-stone-850 ${
                    isActive 
                      ? "bg-white text-stone-900 font-extrabold border-b border-b-emerald-600 dark:bg-stone-900 dark:text-white" 
                      : "text-stone-500 dark:text-stone-400 hover:bg-slate-50/50"
                  }`}
                >
                  <span className="text-emerald-500 font-bold text-[8px]">📄</span>
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          {/* Real pre with clean monospace list */}
          <div className="flex-1 bg-neutral-950 p-4 font-mono text-[11px] overflow-y-auto text-left max-h-[480px]">
            <pre className="text-neutral-350 leading-normal font-mono whitespace-pre select-text">
              <code>{activeCodeFile.content}</code>
            </pre>
          </div>

          <div className="p-3 bg-slate-50 border-t text-[10px] text-slate-500 leading-normal text-left dark:bg-stone-850 dark:border-stone-800 flex items-center gap-1 rounded-b-2xl">
            <span className="text-emerald-650 font-black">💡 Tip:</span>
            <span>These screens use <strong>native-compatible elements</strong> like <code>StyleSheet.create</code>, <code>FlatList</code>, and <code>expo-camera</code> which run out-of-the-box on actual mobile phones.</span>
          </div>

        </div>

      </main>

    </div>
  );
}
