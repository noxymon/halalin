import React from "react";
import useHalalController from "./hooks/useHalalController";
import Header from "./components/Header";
import ScannerPanel from "./components/ScannerPanel";
import ResultsDisplay from "./components/ResultsDisplay";
import SettingsModal from "./components/SettingsModal";
import RatingLevelsModal from "./components/RatingLevelsModal";

export default function App() {
  const {
    uploadedImages,
    activeImageId,
    setActiveImageId,
    selectedImage,
    result,
    isAnalyzing,
    analysisProgress,
    errorMsg,
    isCameraActive,
    setIsCameraActive,
    isRatingLevelsOpen,
    setIsRatingLevelsOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    useCustomKey,
    setUseCustomKey,
    customApiKey,
    setCustomApiKey,
    enableSearchGrounding,
    setEnableSearchGrounding,
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
    verifyHalalStatusBatch
  } = useHalalController();

  const developerKeyAvailable = !!(
    ((import.meta as any).env?.VITE_GEMINI_API_KEY) || 
    (typeof process !== "undefined" && process.env.GEMINI_API_KEY) || 
    ""
  );

  return (
    <div id="halal-pro-app" className="min-h-screen bg-slate-50 flex flex-col font-sans text-stone-800 selection:bg-emerald-100 dark:bg-stone-950 dark:text-stone-100">
      
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden" 
      />

      {/* Top Polish Header element */}
      <Header 
        isCameraActive={isCameraActive}
        selectedImage={selectedImage}
        setIsRatingLevelsOpen={setIsRatingLevelsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        useCustomKey={useCustomKey}
        customApiKey={customApiKey}
        currentTime={currentTime}
      />

      {/* Main Container Viewport */}
      <main className={`flex-1 ${isCameraActive && !selectedImage ? "p-0" : "p-4 sm:p-8"} max-w-7xl w-full mx-auto overflow-y-auto`}>
        
        {/* OCR VERIFIER WORKFLOW PORTAL */}
        <div className="w-full">
            
            {/* Split layout view based on active selectedImage state */}
            {(!selectedImage || isCameraActive) ? (
              <ScannerPanel 
                isCameraActive={isCameraActive}
                selectedImage={selectedImage}
                uploadedImages={uploadedImages}
                activeImageId={activeImageId}
                setActiveImageId={setActiveImageId}
                isAnalyzing={isAnalyzing}
                videoRef={videoRef}
                fileInputRef={fileInputRef}
                dragRef={dragRef}
                startCamera={startCamera}
                stopCamera={stopCamera}
                capturePhoto={capturePhoto}
                handleFileChange={handleFileChange}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                handleSelectSample={handleSelectSample}
                removeUploadedImage={removeUploadedImage}
                clearAllUploadedImages={clearAllUploadedImages}
                verifyHalalStatusBatch={verifyHalalStatusBatch}
                stopAnalysis={stopAnalysis}
              />
            ) : (
              /* Selected Image is active: present full dual col sidebar details split dashboard */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side Scanner Feed Control */}
                <ScannerPanel 
                  isCameraActive={isCameraActive}
                  selectedImage={selectedImage}
                  uploadedImages={uploadedImages}
                  activeImageId={activeImageId}
                  setActiveImageId={setActiveImageId}
                  isAnalyzing={isAnalyzing}
                  videoRef={videoRef}
                  fileInputRef={fileInputRef}
                  dragRef={dragRef}
                  startCamera={startCamera}
                  stopCamera={stopCamera}
                  capturePhoto={capturePhoto}
                  handleFileChange={handleFileChange}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  handleSelectSample={handleSelectSample}
                  removeUploadedImage={removeUploadedImage}
                  clearAllUploadedImages={clearAllUploadedImages}
                  verifyHalalStatusBatch={verifyHalalStatusBatch}
                  stopAnalysis={stopAnalysis}
                />

                {/* Right Side Analysis Status Reporting & Visualizations */}
                <ResultsDisplay 
                  uploadedImages={uploadedImages}
                  developerKeyAvailable={developerKeyAvailable}
                  errorMsg={errorMsg}
                  isAnalyzing={isAnalyzing}
                  analysisProgress={analysisProgress}
                  result={result}
                />

              </div>
            )}
        </div>
      </main>

      {/* Modals & Dialogs overlays section */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        useCustomKey={useCustomKey}
        setUseCustomKey={setUseCustomKey}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        enableSearchGrounding={enableSearchGrounding}
        setEnableSearchGrounding={setEnableSearchGrounding}
        onSave={saveSettings}
        developerKeyAvailable={developerKeyAvailable}
      />

      <RatingLevelsModal 
        isOpen={isRatingLevelsOpen}
        onClose={() => setIsRatingLevelsOpen(false)}
      />

    </div>
  );
}
