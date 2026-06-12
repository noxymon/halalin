import React from "react";
import { motion } from "motion/react";
import { 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle 
} from "lucide-react";
import { UploadedItem, VerificationResult } from "../types";
import AboutLevels from "./AboutLevels";

interface ResultsDisplayProps {
  uploadedImages: UploadedItem[];
  developerKeyAvailable: boolean;
  errorMsg: string | null;
  isAnalyzing: boolean;
  analysisProgress: string;
  result: VerificationResult | null;
}

export default function ResultsDisplay({
  uploadedImages,
  developerKeyAvailable,
  errorMsg,
  isAnalyzing,
  analysisProgress,
  result
}: ResultsDisplayProps) {
  return (
    <div className="lg:col-span-7 flex flex-col space-y-6">
      
      {/* 1. Consolidated Batch Scanning Summary */}
      {uploadedImages.length > 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm dark:bg-stone-900 dark:border-stone-800 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest dark:text-stone-500">
              Batch Scan Analysis Status ({uploadedImages.length} Images in Batch)
            </h3>
            <span className="text-[8px] bg-slate-100 dark:bg-stone-820 text-slate-600 dark:text-stone-300 px-2 py-0.5 rounded font-bold uppercase">
              Consolidated Summary
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5 dark:bg-emerald-950/20 dark:border-emerald-900/40">
              <span className="text-sm text-emerald-800 dark:text-emerald-300 font-extrabold block">
                {uploadedImages.filter(img => img.result && ["H1", "H2", "H3"].includes(img.result.halalLevel)).length}
              </span>
              <span className="text-[8px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Permitted (H1-H3)
              </span>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 dark:bg-amber-950/20 dark:border-amber-900/40">
              <span className="text-sm text-amber-800 dark:text-amber-300 font-extrabold block">
                {uploadedImages.filter(img => img.result?.halalLevel === "D").length}
              </span>
              <span className="text-[8px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Doubtful (D)
              </span>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-2.5 dark:bg-red-950/20 dark:border-red-900/40">
              <span className="text-sm text-red-800 dark:text-red-300 font-extrabold block">
                {uploadedImages.filter(img => img.result && ["HR1", "HR2"].includes(img.result.halalLevel)).length}
              </span>
              <span className="text-[8px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Haram / Caution (HR)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Missing API Key notice helper */}
      {!developerKeyAvailable && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm text-xs text-amber-800 dark:bg-amber-950/20 dark:border-amber-700 dark:text-amber-400">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold mb-0.5">Gemini API Key Required</h4>
              <p className="leading-relaxed">
                No developer-level API credentials detected in environmental properties.
                Analysis is executing in local offline catalog fallback. To run live scans, click <strong>API Settings</strong> on the top menu and securely paste your free Google Gemini API Key!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Error Alert banner */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        </div>
      )}

      {/* 4. Analysis Loading Loop Screen */}
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

      {/* 5. Welcome Dashboard panel */}
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
            <p className="text-xs text-slate-500 dark:text-stone-400 max-w-[420px] mx-auto mt-2 leading-relaxed font-medium">
              Simply select a <strong>Demo Preset Sample</strong> in the left column, snap a photo of your product ingredients label, or upload from your photoroll. 
              Our system verifies Japanese Kanji translation and E-numbers instantly.
            </p>
          </div>

          <AboutLevels />
        </motion.div>
      )}

      {/* 6. Active Output Report Content */}
      {result && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Dynamic Result Banner */}
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
            {/* Indicator Icon Stamp */}
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
                <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest text-white shadow ${
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
                  <span className="text-[10px] bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 font-bold">
                    {result.detectedLanguage} label
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1">
                {result.productName}
              </h3>
              
              {result.brand && (
                <p className="text-[11px] text-stone-500 font-bold dark:text-stone-400 mt-0.5">
                  Brand: <span className="text-stone-700 dark:text-stone-200 font-extrabold">{result.brand}</span>
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

          {/* Table Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12 space-y-4">
              
              {/* Additives Audit Card */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm dark:bg-stone-900 dark:border-stone-800">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center dark:border-stone-800 dark:bg-stone-800/50">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest dark:text-stone-400">Additives & Components Audit</h3>
                  <span className="text-[10px] text-slate-400 italic">
                    {result.ingredientsAnalysis.length} items logged
                  </span>
                </div>

                <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
                  {result.ingredientsAnalysis.length === 0 ? (
                    <p className="text-xs text-stone-500 italic p-4 text-center">No risky ingredients highlighted. Clear to consume or standard compounds with complete safety levels.</p>
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

                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase self-start sm:self-center tracking-widest border text-center ${
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

              {/* Rationale & OCR scroll block */}
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
  );
}
