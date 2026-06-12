import React from "react";
import { ShieldCheck, Layers, Settings, Clock } from "lucide-react";

interface HeaderProps {
  isCameraActive: boolean;
  selectedImage: string | null;
  setIsRatingLevelsOpen: (val: boolean) => void;
  setIsSettingsOpen: (val: boolean) => void;
  useCustomKey: boolean;
  customApiKey: string;
  currentTime: string;
}

export default function Header({
  isCameraActive,
  selectedImage,
  setIsRatingLevelsOpen,
  setIsSettingsOpen,
  useCustomKey,
  customApiKey,
  currentTime
}: HeaderProps) {
  // 16-height top Header matching "Professional Polish" layout - Hidden when camera or selectedImage is active
  if (isCameraActive || selectedImage) return null;

  return (
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
          className="flex items-center justify-center h-8 w-8 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-emerald-600 rounded-xl transition-all dark:bg-stone-850 dark:border-stone-800 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-emerald-400 cursor-pointer"
          title="Rating Levels Status"
        >
          <Layers className="h-4 w-4" />
        </button>

        <button 
          id="api-settings-trigger"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all dark:bg-stone-850 dark:border-stone-800 dark:text-stone-200 dark:hover:bg-stone-800 cursor-pointer"
        >
          <Settings className="h-3.5 w-3.5" />
          <span>API Settings</span>
          {useCustomKey && customApiKey.trim() && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <div className="hidden md:flex items-center space-x-6 text-xs text-slate-500 font-medium dark:text-stone-400">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="h-3 w-3" /> {currentTime}
          </span>
        </div>
      </div>
    </header>
  );
}
