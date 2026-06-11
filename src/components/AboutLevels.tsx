import React, { useState } from "react";
import { ShieldCheck, Info, AlertTriangle, ShieldX, Check, Building2, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { JHA_CERTIFIED_COMPANIES } from "../data/halalIngredients";

export interface HalalLevelInfo {
  code: string;
  title: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
  group: "Halal" | "Doubtful" | "Haram";
}

export default function AboutLevels() {
  const [activeTab, setActiveTab] = useState<"levels" | "brands">("levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const levels: HalalLevelInfo[] = [
    {
      code: "H1",
      title: "HALAL LV1",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      group: "Halal",
      description: "Halal certified by an authorized Halal Certification Organization. Complete assurance with active monitoring logos (e.g., JAKIM, MUIS, Japan Halal Association)."
    },
    {
      code: "H2",
      title: "HALAL LV2",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/60",
      icon: <Check className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
      group: "Halal",
      description: "Free from Haram ingredients, and production line is guaranteed 100% free from Haram or animal derivatives products. Perfect for clean plant-based consumption."
    },
    {
      code: "H3",
      title: "HALAL LV3",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900/60",
      icon: <Info className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />,
      group: "Halal",
      description: "Ingredients list contains zero Haram elements. However, the production line is shared with non-Halal animal ingredients, though appropriately cleaned before this product run."
    },
    {
      code: "D",
      title: "DOUBTFUL (Syubhat)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      group: "Doubtful",
      description: "Product contains trace alcohol with undisclosed source, or contains doubtful additives (Margarine, Emulsifier, or Shortening) without disclosing if they are animal- or vegetable-based."
    },
    {
      code: "HR1",
      title: "HARAM LV1",
      badgeColor: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40",
      icon: <ShieldX className="h-5 w-5 text-red-500 dark:text-red-400" />,
      group: "Haram",
      description: "Cross-contamination warning. The production line is confirmed contaminated with non-Halal animal ingredients, or a direct label alerts that the tool shares contact with pork products."
    },
    {
      code: "HR2",
      title: "HARAM LV2",
      badgeColor: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900/60",
      icon: <ShieldX className="h-5 w-5 text-red-700 dark:text-red-400" />,
      group: "Haram",
      description: "The product contains confirmed Haram animal derivatives (pork, lard, animal fat gelatin, non-halal slaughtered beef/chicken extract) or alcohol, mirin, wine, etc."
    }
  ];

  // Unique categories of JHA Certified Companies
  const categories = ["All", ...Array.from(new Set(JHA_CERTIFIED_COMPANIES.map(comp => comp.category)))];

  const filteredCompanies = JHA_CERTIFIED_COMPANIES.filter(comp => {
    const matchesCategory = selectedCategory === "All" || comp.category === selectedCategory;
    const searchLow = searchQuery.toLowerCase();
    const matchesSearch = 
      comp.companyName.toLowerCase().includes(searchLow) ||
      (comp.japaneseCompanyName && comp.japaneseCompanyName.toLowerCase().includes(searchLow)) ||
      comp.certifiedProducts.some(p => p.toLowerCase().includes(searchLow)) ||
      comp.category.toLowerCase().includes(searchLow);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="about-levels-container" className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 p-1 bg-stone-105 dark:bg-stone-950 rounded-xl">
        <button
          onClick={() => setActiveTab("levels")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "levels"
              ? "bg-white text-emerald-800 shadow-sm dark:bg-stone-800 dark:text-white"
              : "text-stone-500 hover:text-stone-705 dark:text-stone-400 dark:hover:text-stone-300"
          }`}
        >
          Rating Levels (H1-HR2)
        </button>
        <button
          onClick={() => setActiveTab("brands")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "brands"
              ? "bg-white text-emerald-800 shadow-sm dark:bg-stone-800 dark:text-white"
              : "text-stone-500 hover:text-stone-705 dark:text-stone-400 dark:hover:text-stone-300"
          }`}
        >
          <Building2 className="h-3.5 w-3.5 text-emerald-500" />
          JHA Certified Brands
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "levels" ? (
          <motion.div
            key="levels"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-4"
          >
            <div className="text-center mb-1">
              <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Halal Certification & Rating Levels</h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                Our verification system classifies products strictly into 6 standard security zones:
              </p>
            </div>

            <div className="grid gap-3">
              {levels.map((lvl) => (
                <div
                  key={lvl.code}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                    lvl.group === "Halal"
                      ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-950/20"
                      : lvl.group === "Doubtful"
                      ? "bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-950/20"
                      : "bg-rose-50/50 border-rose-100 dark:bg-rose-950/10 dark:border-rose-950/20"
                  }`}
                >
                  <div className="mt-0.5">{lvl.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvl.badgeColor}`}>
                        {lvl.code}
                      </span>
                      <span className="text-sm font-semibold text-stone-850 dark:text-stone-200">
                        {lvl.title}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="brands"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-3"
          >
            <div className="text-center mb-1">
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center justify-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Japan Halal Association (JHA) Database
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                Browse official JHA-certified companies & verified products in real time:
              </p>
            </div>

            {/* Brand Search & Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search Kewpie, Golden Curry, S&B, Soy Sauce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-250 dark:placeholder-stone-500"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1 pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                      selectedCategory === cat
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-750"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Certified Companies */}
            <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1 border-t border-stone-100 dark:border-stone-800 pt-2.5">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map(comp => (
                  <div
                    key={comp.id}
                    className="p-3 bg-white border border-stone-200 rounded-xl dark:bg-stone-800 dark:border-stone-700 space-y-1 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-stone-800 dark:text-white leading-tight">
                          {comp.companyName}
                        </h4>
                        {comp.japaneseCompanyName && (
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                            {comp.japaneseCompanyName}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider dark:bg-stone-900 dark:border-stone-850 dark:text-stone-400">
                        {comp.category}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-dashed border-stone-100 dark:border-stone-700">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 block mb-1">
                        JHA Certified Products:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {comp.certifiedProducts.map((p, idx) => (
                          <li key={idx} className="text-[11px] text-stone-605 dark:text-stone-300 leading-snug font-medium">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-stone-400 dark:text-stone-500 text-xs">
                  No matching certified brand or product found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-4 rounded-xl text-xs text-stone-500 dark:text-stone-400 mt-4 space-y-3 leading-relaxed">
        <div>
          <strong className="text-stone-700 dark:text-stone-300 block mb-1">🤖 AI-Powered Analysis</strong>
          Product detection, Japanese OCR extraction, translation, and final safety categorizations are fully analyzed by our integrated AI models. Always inspect the physical label packaging as a human failsafe.
        </div>
        <div className="border-t border-stone-100 dark:border-stone-800 pt-3">
          <strong className="text-stone-700 dark:text-stone-300 block mb-1">🔗 Reference Sources & Leveling</strong>
          The Halal Leveling criteria (H1-H3, Doubtful, HR1-HR2) implemented in this application are referenced from and based on the standard guidelines outlined in the <a href="https://www.halalinjapan.com/blog/halal-japan-mobile-app" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400 font-semibold inline-flex items-center gap-0.5">Halal In Japan Mobile Guide</a> page.
        </div>
        <div className="border-t border-stone-100 dark:border-stone-800 pt-3">
          <strong className="text-stone-700 dark:text-stone-300 block mb-1">🕌 Religious Consultation Disclaimer</strong>
          This application serves solely as an early, fast-check reference tool and does <strong>not replace official fatwas issued by qualified Islamic scholars (Ulama)</strong>. To obtain a definitive and religiously justifiable ruling on any questionable ingredients, we strongly encourage you to consult a nearby Imam or your local Muslim community authority.
        </div>
      </div>
    </div>
  );
}
