import React, { useState } from "react";
import { motion } from "motion/react";
import { Settings, X, Info, Key, ExternalLink, Eye, EyeOff, Globe } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  useCustomKey: boolean;
  setUseCustomKey: (val: boolean) => void;
  customApiKey: string;
  setCustomApiKey: (val: string) => void;
  enableSearchGrounding: boolean;
  setEnableSearchGrounding: (val: boolean) => void;
  onSave: (key: string, enabled: boolean, grounding: boolean) => void;
  developerKeyAvailable: boolean;
}

export default function SettingsModal({
  isOpen,
  onClose,
  useCustomKey,
  setUseCustomKey,
  customApiKey,
  setCustomApiKey,
  enableSearchGrounding,
  setEnableSearchGrounding,
  onSave,
  developerKeyAvailable
}: SettingsModalProps) {
  const [showKey, setShowKey] = useState(false);
  const [internalKey, setInternalKey] = useState(customApiKey);
  const [internalUse, setInternalUse] = useState(useCustomKey);
  const [internalSearch, setInternalSearch] = useState(enableSearchGrounding);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(internalKey, internalUse, internalSearch);
  };

  return (
    <div 
      id="api-settings-modal"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
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
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-stone-350">
          <p>
            To run <strong>HalalVerify PRO</strong>, you can securely configure your own private Google Gemini API Key directly in this browser frame.
          </p>

          <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl dark:bg-sky-950/20 dark:border-sky-900/30">
            <h4 className="font-bold text-sky-850 dark:text-sky-300 mb-1 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0" /> Is it secure?
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-550 dark:text-stone-400">
              Yes, fully! Your key is stored strictly on your local browser inside <strong>localStorage</strong>. It connects directly from your browser client to the public Google Gemini API endpoints. Absolutely no intermediate database server is set up, and your private key is never transmitted or logged elsewhere.
            </p>
          </div>

          {/* Form Option: Use custom key checkbox */}
          <div className="space-y-3.5 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input 
                type="checkbox"
                checked={internalUse}
                onChange={(e) => setInternalUse(e.target.checked)}
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
            {internalUse && (
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
                    value={internalKey}
                    onChange={(e) => setInternalKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-3 pr-10 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100"
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

            {/* Google Search Grounding Toggle */}
            <div className="pt-3.5 border-t border-slate-100 dark:border-stone-800">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 dark:border-stone-700 dark:bg-stone-800"
                />
                <div>
                  <span className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-sky-500" />
                    Enable Google Search Grounding
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-stone-450 mt-0.5 leading-relaxed">
                    Allow the model to leverage Google Search in real-time to cross-examine Japanese brand declarations and Halal status. <strong>Disable this to conserve API quota and make scans faster.</strong>
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Status information */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-stone-800 flex justify-between items-center text-[10px] text-slate-400 dark:text-stone-450 font-semibold uppercase tracking-wider">
            <span>Active Credentials Mode:</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
              internalUse && internalKey.trim()
                ? "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30"
                : developerKeyAvailable
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
            }`}>
              {internalUse && internalKey.trim() ? "Personal Key (Client-side)" : developerKeyAvailable ? "Developer Key (Vite Env)" : "Offline Catalog Fallback"}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 dark:bg-stone-850 dark:border-stone-800 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-100 transition-colors cursor-pointer dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
