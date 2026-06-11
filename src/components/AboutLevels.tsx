import React from "react";
import { ShieldCheck, Info, AlertTriangle, ShieldX, Check } from "lucide-react";
import { motion } from "motion/react";

export interface HalalLevelInfo {
  code: string;
  title: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
  group: "Halal" | "Doubtful" | "Haram";
}

export default function AboutLevels() {
  const levels: HalalLevelInfo[] = [
    {
      code: "H1",
      title: "HALAL LV1",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      group: "Halal",
      description: "Halal certified by an authorized Halal Certification Organization. Complete assurance with active monitoring logos (e.g., JAKIM, MUIS, Halal Japan Association)."
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

  return (
    <div id="about-levels-container" className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Halal Certification & Rating Levels</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Our verification system classifies products strictly into 6 standard security zones:
        </p>
      </div>

      <div className="grid gap-3">
        {levels.map((lvl, index) => (
          <motion.div
            key={lvl.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
              lvl.group === "Halal"
                ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-950/40"
                : lvl.group === "Doubtful"
                ? "bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-950/40"
                : "bg-rose-50/50 border-rose-100 dark:bg-rose-950/10 dark:border-rose-950/40"
            }`}
          >
            <div className="mt-0.5">{lvl.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvl.badgeColor}`}>
                  {lvl.code}
                </span>
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {lvl.title}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {lvl.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-3 rounded-xl text-xs text-stone-500 dark:text-stone-400 mt-4 leading-relaxed">
        <strong className="text-stone-700 dark:text-stone-300 block mb-1">💡 Scan Disclaimer</strong>
        Our verification matches the product components instantly based on OCR, visual search and Japanese-to-English translation mapping. However, please inspect physical package seals or consult local certified imams if you see inconsistencies.
      </div>
    </div>
  );
}
