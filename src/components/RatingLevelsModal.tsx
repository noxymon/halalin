import React from "react";
import { motion } from "motion/react";
import { Layers, X } from "lucide-react";
import AboutLevels from "./AboutLevels";

interface RatingLevelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RatingLevelsModal({
  isOpen,
  onClose
}: RatingLevelsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      id="rating-levels-modal"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-slate-900/40 animate-fade-in"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
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
            onClick={onClose}
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
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
}
