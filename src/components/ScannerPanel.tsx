import React from "react";
import { Camera, Upload, X, Sparkles } from "lucide-react";
import { UploadedItem, DemoSample } from "../types";
import { DEMO_SAMPLES } from "../data/samples";

interface ScannerPanelProps {
  isCameraActive: boolean;
  selectedImage: string | null;
  uploadedImages: UploadedItem[];
  activeImageId: string | null;
  setActiveImageId: (id: string | null) => void;
  isAnalyzing: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  dragRef: React.RefObject<HTMLDivElement | null>;
  startCamera: () => void;
  stopCamera: () => void;
  capturePhoto: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleSelectSample: (sample: DemoSample) => void;
  removeUploadedImage: (id: string, e?: React.MouseEvent) => void;
  clearAllUploadedImages: () => void;
  verifyHalalStatusBatch: (items: UploadedItem[]) => void;
  stopAnalysis: () => void;
}

export default function ScannerPanel({
  isCameraActive,
  selectedImage,
  uploadedImages,
  activeImageId,
  setActiveImageId,
  isAnalyzing,
  videoRef,
  fileInputRef,
  dragRef,
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
  verifyHalalStatusBatch,
  stopAnalysis
}: ScannerPanelProps) {
  // Input file handler hidden trigger
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // State 1: Standalone Real-Time Viewfinder
  if (isCameraActive && !selectedImage) {
    return (
      <div className="max-w-6xl mx-auto w-full py-0">
        <div className="relative w-full aspect-[4/3] sm:aspect-video min-h-screen md:min-h-[calc(100vh-40px)] rounded-none sm:rounded-3xl overflow-hidden border-0 sm:border border-slate-200 dark:border-stone-800 bg-black shadow-2xl">
          <video 
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          <button 
            onClick={stopCamera}
            className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all cursor-pointer border border-white/10 shadow-lg"
            title="Cancel Scan"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-2xl max-h-[80%] border-2 border-dashed border-emerald-500/40 rounded-xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
              <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <button 
              onClick={capturePhoto}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-555 active:scale-95 text-white rounded-full text-xs font-black tracking-wider shadow-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-emerald-500/30"
            >
              <Camera className="h-4.5 w-4.5" />
              <span>Capture & Verify</span>
            </button>
          </div>

          <div className="absolute top-4 left-4 bg-black/60 px-2.5 py-1 rounded text-[10px] text-emerald-450 font-bold tracking-wide uppercase flex items-center gap-1.5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>Live Camera Feed</span>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Welcome First-Time Display (No image active)
  if (!selectedImage && !isCameraActive) {
    return (
      <div className="max-w-xl mx-auto w-full py-4 text-center animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* CTA 1: Live Webcam Streamer */}
          <button 
            id="cta-camera-scan"
            onClick={startCamera}
            className="flex flex-col items-center justify-center p-6 bg-emerald-600 hover:bg-emerald-550 text-white rounded-2xl border border-emerald-555 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-[0.98] transition-all group cursor-pointer"
          >
            <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center mb-4 border border-emerald-400/30 group-hover:scale-105 transition-transform shadow-inner text-white">
              <Camera className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-sm tracking-wide">Live Camera Scan</span>
            <span className="text-[11px] text-emerald-100/95 mt-1 px-1.5 leading-snug font-medium">
              Point your lens at standard Japanese food ingredients list to analyze them step-by-step.
            </span>
          </button>

          {/* CTA 2: Upload File */}
          <button 
            id="cta-upload-photo"
            onClick={triggerFileInput}
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
      </div>
    );
  }

  // State 3: Left-Side Scan Controls column inside active split grid view (selectedImage is true)
  return (
    <div className="lg:col-span-5 flex flex-col space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full dark:bg-stone-900 dark:border-stone-800">
        
        {/* Header Label */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center dark:border-stone-800 dark:bg-stone-800/50">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest dark:text-stone-400">Product Image Feed</h2>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded font-bold uppercase dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
            OCR Scanner
          </span>
        </div>

        {/* Scrollable Gallery Thumb Row */}
        {uploadedImages.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-150 bg-slate-100/40 dark:border-stone-850 dark:bg-stone-900/40">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                Scan Batch ({uploadedImages.length} {uploadedImages.length === 1 ? "item" : "items"})
              </span>
              
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => verifyHalalStatusBatch(uploadedImages)}
                  className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/60 transition-all cursor-pointer inline-flex items-center gap-1.5"
                  title="Analyze this entire batch in a single consolidated Gemini call"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  Optimize & Scan All
                </button>
                <button 
                  onClick={clearAllUploadedImages}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-350 transition-all cursor-pointer"
                >
                  Clear Batch
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-1 select-none">
              {uploadedImages.map((item) => {
                const isActive = item.id === activeImageId;
                const level = item.result?.halalLevel;
                let badgeColor = "bg-stone-550 border-stone-600 text-white";
                let label = "Pending";
                
                if (item.isAnalyzing) {
                  badgeColor = "bg-sky-500 animate-pulse text-white";
                  label = "Scanning";
                } else if (item.error) {
                  badgeColor = "bg-amber-500 text-amber-950 font-bold";
                  label = "Error";
                } else if (level) {
                  if (["H1", "H2", "H3"].includes(level)) {
                    badgeColor = "bg-emerald-600 text-white";
                    label = level;
                  } else if (level === "D") {
                    badgeColor = "bg-amber-500 text-white";
                    label = "Doubt";
                  } else {
                    badgeColor = "bg-red-650 text-white";
                    label = "Haram";
                  }
                }
                
                return (
                  <div 
                    key={item.id}
                    onClick={() => { setActiveImageId(item.id); stopCamera(); }}
                    className={`relative flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isActive 
                        ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20 scale-105" 
                        : "border-slate-200 hover:border-slate-400 dark:border-stone-800 dark:hover:border-stone-750"
                    }`}
                  >
                    <img 
                      src={item.dataUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className={`absolute bottom-0 inset-x-0 py-0.5 text-[8px] font-black text-center truncate ${badgeColor}`}>
                      {label}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUploadedImage(item.id);
                      }}
                      className="absolute top-1 right-1 h-4 w-4 bg-black/60 hover:bg-red-600 rounded-full text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Remove item"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                );
              })}

              {/* Quick Add photo inside row */}
              <button 
                onClick={triggerFileInput}
                className="flex-shrink-0 w-16 h-20 rounded-xl border border-dashed border-slate-350 hover:border-slate-450 dark:border-stone-750 dark:hover:border-stone-650 bg-slate-50 hover:bg-slate-100 dark:bg-stone-900 dark:hover:bg-stone-850 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 dark:text-stone-500 dark:hover:text-stone-300 gap-1 cursor-pointer transition-all"
                title="Upload more"
              >
                <Upload className="h-4 w-4" />
                <span className="text-[8px] font-black uppercase tracking-wider">Add</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Workspace Area */}
        <div 
          id="interactive-stage"
          ref={dragRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex-1 bg-stone-900 min-h-[350px] relative flex flex-col items-center justify-center p-5 transition-all duration-300"
        >
          {/* Workspace State 1: Active camera box */}
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="h-4 w-4" /> Capture Photo
                  </button>
                  <button 
                    onClick={stopCamera}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full shadow-md transition-all cursor-pointer"
                    title="Cancel camera scan"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Workspace State 2: Selected preview thumbnail */}
          {selectedImage && !isCameraActive && (
            <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex items-center justify-center shadow-inner">
              <img 
                src={selectedImage} 
                alt="Current preview" 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-x-0 h-0.5 bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_12px_#10b981] animate-[scan_2.5s_ease-in-out_infinite]"></div>
              
              {!isAnalyzing && (
                <button 
                  onClick={(e) => { 
                    if (activeImageId) {
                      removeUploadedImage(activeImageId, e);
                    }
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-650 rounded-full text-white transition-colors shadow cursor-pointer"
                  title="Remove image"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          )}

          {/* Workspace State 3: Empty panel triggers */}
          {!selectedImage && !isCameraActive && (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
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

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-[290px] sm:max-w-none justify-center">
                <button
                  onClick={startCamera}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-900/20 transition-all active:scale-[0.97] w-full sm:w-auto shrink-0 cursor-pointer"
                >
                  <Camera className="h-4 w-4" /> Live Camera Scan
                </button>

                <button
                  onClick={triggerFileInput}
                  className="px-4 py-2.5 bg-stone-800 border border-stone-700 hover:bg-stone-750 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.97] w-full sm:w-auto shrink-0 cursor-pointer"
                >
                  <Upload className="h-4 w-4" /> Upload Packaging Photo
                </button>
              </div>

              <div className="mt-8 pt-5 border-t border-stone-800/60 w-full max-w-[320px]">
                <p className="text-[10px] text-stone-500 uppercase tracking-widest font-extrabold mb-2.5">
                  Or Instantly Test Presets
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <button 
                    onClick={() => handleSelectSample(DEMO_SAMPLES[0])}
                    className="text-[10px] bg-stone-800 hover:bg-stone-750 hover:text-white text-stone-300 px-3 py-1.5 rounded-lg border border-stone-750 font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🍓 Mochi (Haram)</span>
                  </button>
                  <button 
                    onClick={() => handleSelectSample(DEMO_SAMPLES[2])}
                    className="text-[10px] bg-stone-800 hover:bg-stone-750 hover:text-white text-stone-300 px-3 py-1.5 rounded-lg border border-stone-750 font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🍛 Curry (Certified Halal)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls action */}
        {selectedImage && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex dark:bg-stone-850 dark:border-stone-800">
            {isAnalyzing ? (
              <button 
                onClick={stopAnalysis}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-50 border border-red-200 text-red-650 hover:bg-red-100 rounded-lg text-xs font-bold transition-all dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 animate-pulse" />
                <span>Stop Analyze</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (activeImageId) {
                    removeUploadedImage(activeImageId);
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-750 cursor-pointer"
              >
                <span>Remove Selected Image</span>
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
