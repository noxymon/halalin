export interface IngredientInfo {
  id: string;
  code?: string; // e.g., "E100", "430"
  name: string; // e.g., "Pork", "Yellow 2G", "Shortening"
  japaneseName?: string; // e.g., "豚肉", "ショートニング"
  reading?: string; // e.g., "Butaniku", "Shortening"
  category: "Haram" | "Syubhat" | "Halal" | "Mushbooh";
  description: string;
  halalStatus: string;
}

export const HARAM_KANJI_LIST: IngredientInfo[] = [
  {
    id: "h1",
    name: "Pork",
    japaneseName: "豚肉",
    reading: "Butaniku / ポーク (Pooku)",
    category: "Haram",
    description: "Meat from a pig.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h2",
    name: "Beef (Non-Halal)",
    japaneseName: "牛肉",
    reading: "Gyuuniku / ビーフ (Biifu)",
    category: "Haram",
    description: "Beef from cows. In Japan, unless explicitly labeled Halal certified, general beef is considered Haram due to standard slaughter methods.",
    halalStatus: "Haram (unless slaughtered according to Islamic rites)."
  },
  {
    id: "h3",
    name: "Chicken (Non-Halal)",
    japaneseName: "鶏肉",
    reading: "Toriniku / チキン (Chikin)",
    category: "Haram",
    description: "Chicken meat. In Japan, standard chicken is processed using non-Halal automated lines.",
    halalStatus: "Haram (unless slaughtered according to Islamic rites)."
  },
  {
    id: "h4",
    name: "Pork Extract",
    japaneseName: "豚肉エキス",
    reading: "Butaniku Ekisu / ポークエキス (Pooku Ekisu)",
    category: "Haram",
    description: "Flavoring extract derived from pork meat or bones.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h5",
    name: "Beef Extract",
    japaneseName: "牛肉エキス",
    reading: "Gyuuniku Ekisu / ビーフエキス (Biifu Ekisu)",
    category: "Haram",
    description: "Flavoring extract derived from beef.",
    halalStatus: "Haram (unless source meat is Halal)."
  },
  {
    id: "h6",
    name: "Chicken Extract",
    japaneseName: "鶏肉エキス",
    reading: "Toriniku Ekisu / チキンエキス (Chikin Ekisu)",
    category: "Haram",
    description: "Flavoring extract derived from chicken.",
    halalStatus: "Haram (unless source chicken is Halal)."
  },
  {
    id: "h7",
    name: "Pork Fat",
    japaneseName: "豚脂",
    reading: "Tonshi",
    category: "Haram",
    description: "Fat harvested directly from pigs.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h8",
    name: "Lard",
    japaneseName: "ラード",
    reading: "Raado",
    category: "Haram",
    description: "Rendered pork fat common in processed foods, pastries, and ramen.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h9",
    name: "Beef Fat (Tallow)",
    japaneseName: "牛脂",
    reading: "Gyuushi",
    category: "Haram",
    description: "Rendered beef fat.",
    halalStatus: "Haram (unless source cow is Halal slaughtered)."
  },
  {
    id: "h10",
    name: "Animal Fat / Oils",
    japaneseName: "動物性油脂",
    reading: "Doubutsusei-yushi",
    category: "Haram",
    description: "Mixed fats or oils extracted from animal tissue, typically contains pork fat or non-halal beef fat.",
    halalStatus: "Haram."
  },
  {
    id: "h11",
    name: "Processed Oils / Oils",
    japaneseName: "加工油脂",
    reading: "Kakou-yushi",
    category: "Syubhat",
    description: "Processed oils. Can contain animal fats unless sourced entirely from plants.",
    halalStatus: "Doubtful / Syubhat. Sourced from pork/animal fats unless labeled plant-derived."
  },
  {
    id: "h12",
    name: "Mixed Oils",
    japaneseName: "混合油脂",
    reading: "Kongou-yushi",
    category: "Haram",
    description: "Combined vegetable and animal oils, often hidden with non-Halal ingredients.",
    halalStatus: "Haram."
  },
  {
    id: "h13",
    name: "Consommé",
    japaneseName: "コンソメ",
    reading: "Konsome",
    category: "Haram",
    description: "Soup stock typically made with beef, pork, or chicken bases.",
    halalStatus: "Haram (unless verified Halal)."
  },
  {
    id: "h14",
    name: "Consommé Powder",
    japaneseName: "コンソメパウダー",
    reading: "Konsome Paudaa",
    category: "Haram",
    description: "Dehydrated soup stock powder containing animal meat extracts.",
    halalStatus: "Haram (unless verified Halal)."
  },
  {
    id: "h15",
    name: "Gelatin",
    japaneseName: "ゼラチン",
    reading: "Zerachin",
    category: "Haram",
    description: "Gelling agent made from boiled animal skin, tendons, and bones (mostly pig skin or non-Halal cow bones in Japan).",
    halalStatus: "Haram in Japan (mostly pig-derived)."
  },
  {
    id: "h16",
    name: "Alcohol",
    japaneseName: "アルコール",
    reading: "Arukooru",
    category: "Haram",
    description: "Ethyl alcohol used as a preservative, solvent, or flavor booster.",
    halalStatus: "Haram."
  },
  {
    id: "h17",
    name: "Liquor / Sake",
    japaneseName: "酒",
    reading: "Sake",
    category: "Haram",
    description: "Japanese rice wine, used heavily in cooking sauces and direct flavoring.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h18",
    name: "Western Liquor",
    japaneseName: "洋酒",
    reading: "Youshu",
    category: "Haram",
    description: "Rum, Brandy, Whiskey, or other distilled spirits used in bakery items and desserts.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h19",
    name: "Ethyl Alcohol (Brewers alcohol)",
    japaneseName: "酒精",
    reading: "Shusei",
    category: "Haram",
    description: "Preservative alcohol added to miso pastes, fresh noodles, and pastries.",
    halalStatus: "Haram."
  },
  {
    id: "h20",
    name: "Mirin",
    japaneseName: "味醂 / みりん",
    reading: "Mirin",
    category: "Haram",
    description: "Sweet cooking rice wine containing roughly 14% alcohol.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h21",
    name: "Rum",
    japaneseName: "ラム酒",
    reading: "Ramu-shu",
    category: "Haram",
    description: "Distilled liquor from sugarcane, commonly found in cakes and confectionery.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h22",
    name: "Wine",
    japaneseName: "ワイン",
    reading: "Wain",
    category: "Haram",
    description: "Fermented grape beverage used in stew, sauces, and baked products.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h23",
    name: "Brandy",
    japaneseName: "ブランディ",
    reading: "Burandi",
    category: "Haram",
    description: "Distilled wine used as aroma enhancer.",
    halalStatus: "Strictly Haram (Forbidden)."
  },
  {
    id: "h24",
    name: "Whiskey",
    japaneseName: "ウィスキー",
    reading: "Uisukii",
    category: "Haram",
    description: "Fermented grain mash alcohol.",
    halalStatus: "Strictly Haram (Forbidden)."
  }
];

export const SYUBHAT_INGREDIENTS: IngredientInfo[] = [
  {
    id: "s1",
    name: "Shortening",
    japaneseName: "ショートニング",
    reading: "Shootoningu",
    category: "Syubhat",
    description: "Solid fat used in baking. Sourced from either lard (pork) or plant oils.",
    halalStatus: "Syubhat (Doubtful). Halal only if explicitly labeled '大豆由来' (derived from soy) or '植物性' (vegetable base)."
  },
  {
    id: "s2",
    name: "Soy Sauce",
    japaneseName: "醤油 / しょうゆ",
    reading: "Shouyu",
    category: "Syubhat",
    description: "Fermented soy and wheat sauce. The standard brewing process constructs trace alcohol. Some manufacturers also add alcohol directly as a preservative.",
    halalStatus: "Syubhat (Doubtful). Sells as Halal if alcohol-free and naturally brewed without added ethanol."
  },
  {
    id: "s3",
    name: "Emulsifier",
    japaneseName: "乳化剤",
    reading: "Nyuka-zai",
    category: "Syubhat",
    description: "Agents that blend fats and water. May come from pork fat or halal vegetable fats.",
    halalStatus: "Syubhat (Doubtful). Halal only if labeled '大豆由来' (soy derivative) or '植物由来' (plant-derived)."
  },
  {
    id: "s4",
    name: "Margarine",
    japaneseName: "マーガリン",
    reading: "Maagarin",
    category: "Syubhat",
    description: "Butter substitute. In Japan, some margarines are blends with pork lard or animal gelatin.",
    halalStatus: "Syubhat (Doubtful). Halal only if plant-margarine (植物性マーガリン)."
  },
  {
    id: "s5",
    name: "Fats / Lipids",
    japaneseName: "油脂",
    reading: "Yushi",
    category: "Syubhat",
    description: "General category for grease, oil, or fat. Often animal-derived unless stated otherwise.",
    halalStatus: "Syubhat (Doubtful). Vegetable-driven fat is Halal, animal fat is Haram."
  },
  {
    id: "s6",
    name: "Fat Spread",
    japaneseName: "ファットスプレッド",
    reading: "Fatto Supureddo",
    category: "Syubhat",
    description: "Low-fat margarine-type spread. Can contain animal fats or gelatin.",
    halalStatus: "Syubhat (Doubtful). Plant-based is Halal."
  },
  {
    id: "s7",
    name: "Collagen Peptide",
    japaneseName: "コラーゲンペプチド",
    reading: "Koraagen Pepuchido",
    category: "Syubhat",
    description: "Hydrolyzed protein. Can be derived from fish (Halal) or cows, pigs, or chickens (Haram/Syubhat).",
    halalStatus: "Syubhat (Doubtful). Fish-derived is Halal; pork/unlawful animal beef-derived is Haram."
  }
];

export const NO_E_PREFIX_LIST: IngredientInfo[] = [
  { id: "ne107", code: "107", name: "Yellow 2G", category: "Mushbooh", description: "Synthetic dye", halalStatus: "Halal if used as 100% dry color. Mushbooh if used as liquid color (solvent has to be Halal)." },
  { id: "ne128", code: "128", name: "Red 2G", category: "Mushbooh", description: "Food dye", halalStatus: "Halal if used as 100% dry color. Mushbooh if used as liquid color (solvent has to be Halal)." },
  { id: "ne133", code: "133", name: "Brilliant Blue FCF", category: "Mushbooh", description: "Synthetic color", halalStatus: "Halal if used as 100% dry color. Mushbooh if used as liquid color (solvent has to be Halal)." },
  { id: "ne154", code: "154", name: "Brown FK", category: "Mushbooh", description: "Coloring", halalStatus: "Halal if used as 100% dry color. Mushbooh if used as liquid color (solvent has to be Halal)." },
  { id: "ne155", code: "155", name: "Brown HT", category: "Mushbooh", description: "Coloring", halalStatus: "Halal if used as 100% dry color. Mushbooh if used as liquid color (solvent has to be Halal)." },
  { id: "ne234", code: "234", name: "Nisin", category: "Halal", description: "Preservative - other", halalStatus: "Halal" },
  { id: "ne262", code: "262", name: "Sodium Acetate", category: "Halal", description: "Acids and salts", halalStatus: "Halal" },
  { id: "ne296", code: "296", name: "Malic Acid", category: "Halal", description: "Acids and salts", halalStatus: "Halal" },
  { id: "ne297", code: "297", name: "Fumaric Acid", category: "Halal", description: "Acids and salts", halalStatus: "Halal" },
  { id: "ne350", code: "350", name: "Sodium Malate", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne351", code: "351", name: "Potassium Malate", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne352", code: "352", name: "Calcium Malate", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne353", code: "353", name: "Metataric Acid", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne355", code: "355", name: "Adipic Acid", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne363", code: "363", name: "Succinic Acid", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne370", code: "370", name: "1,4-Heptonolactane", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne375", code: "375", name: "Nicotinic Acid", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne380", code: "380", name: "Triammonium Citrate", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne381", code: "381", name: "Ammonium Ferric Citrate", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne385", code: "385", name: "Calcium Disodium EDTA", category: "Halal", description: "Salts of Malic Acid", halalStatus: "Halal" },
  { id: "ne416", code: "416", name: "Karaya Gum", category: "Halal", description: "Emulsifiers and Stabilizers", halalStatus: "Halal" },
  { id: "ne430", code: "430", name: "Polyoxyethane (8) Stearate", category: "Mushbooh", description: "Fatty Acid derivative", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne431", code: "431", name: "Polyoxyethane (40) Stearate", category: "Mushbooh", description: "Fatty Acid derivative", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne432", code: "432", name: "Polyoxyethane (20) Sorbitan / Polysorbate 20", category: "Mushbooh", description: "Fatty Acid derivative", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne433", code: "433", name: "Polyoxyethane (20) Sorbitan Monooleate / Polysorbate 80", category: "Mushbooh", description: "Fatty Acid derivative", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne434", code: "434", name: "Polyoxyethane (20) Sorbitan Monopalmitate / Polysorbate 40", category: "Mushbooh", description: "Fatty Acid derivative", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne435", code: "435", name: "Polyoxyethane (20) Sorbitan Monostearate / Polysorbate 60", category: "Mushbooh", description: "Fatty Acid derivative", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne436", code: "436", name: "Polyoxyethane (20) Sorbitan Tristearate / Polysorbate 65", category: "Mushbooh", description: "Fatty Acid derivative", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne476", code: "476", name: "Polyglycerol Esters of Polycondensed Esters of Castor Oil", category: "Mushbooh", description: "Salts or Esters of Fatty Acids", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne478", code: "478", name: "Lactylated Fatty Acid Esters of Glycerol and Propane-1,2-Diol", category: "Mushbooh", description: "Salts or Esters of Fatty Acids", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne491", code: "491", name: "Sorbitan Monostearate", category: "Mushbooh", description: "Salts or Esters of Fatty Acids", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne492", code: "492", name: "Sorbitan Tristearate", category: "Mushbooh", description: "Salts or Esters of Fatty Acids", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne493", code: "493", name: "Sorbitan Monolaurate", category: "Mushbooh", description: "Salts or Esters of Fatty Acids", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne494", code: "494", name: "Sorbitan Mono-oleate", category: "Mushbooh", description: "Salts or Esters of Fatty Acids", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne495", code: "495", name: "Sorbitan Monopalmitate", category: "Mushbooh", description: "Salts or Esters of Fatty Acids", halalStatus: "Halal if plant-fat sourced, Haram if pork-fat sourced." },
  { id: "ne500", code: "500", name: "Sodium Carbonate / Bicarbonate", category: "Halal", description: "Carbonates", halalStatus: "Halal" },
  { id: "ne501", code: "501", name: "Potassium Carbonate / Bicarbonate", category: "Halal", description: "Carbonates", halalStatus: "Halal" },
  { id: "ne503", code: "503", name: "Ammonium Carbonate", category: "Halal", description: "Carbonates", halalStatus: "Halal" },
  { id: "ne504", code: "504", name: "Magnesium Carbonate", category: "Halal", description: "Carbonates", halalStatus: "Halal" },
  { id: "ne507", code: "507", name: "Hydrochloric Acid", category: "Halal", description: "Hydrochloric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne508", code: "508", name: "Potassium Chloride", category: "Halal", description: "Hydrochloric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne509", code: "509", name: "Calcium Chloride", category: "Halal", description: "Hydrochloric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne510", code: "510", name: "Ammonium Chloride", category: "Halal", description: "Hydrochloric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne513", code: "513", name: "Sulphuric Acid", category: "Halal", description: "Sulphuric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne514", code: "514", name: "Sodium Sulphate", category: "Halal", description: "Sulphuric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne515", code: "515", name: "Potassium Sulphate", category: "Halal", description: "Sulphuric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne516", code: "516", name: "Calcium Sulphate", category: "Halal", description: "Sulphuric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne518", code: "518", name: "Magnesium Sulphate", category: "Halal", description: "Sulphuric Acid and its Salts", halalStatus: "Halal" },
  { id: "ne524", code: "524", name: "Sodium Hydroxide", category: "Halal", description: "Alkalis", halalStatus: "Halal" },
  { id: "ne525", code: "525", name: "Potassium Hydroxide", category: "Halal", description: "Alkalis", halalStatus: "Halal" },
  { id: "ne526", code: "526", name: "Calcium Hydroxide", category: "Halal", description: "Alkalis", halalStatus: "Halal" },
  { id: "ne527", code: "527", name: "Ammonium Hydroxide", category: "Halal", description: "Alkalis", halalStatus: "Halal" },
  { id: "ne528", code: "528", name: "Magnesium Hydroxide", category: "Halal", description: "Alkalis", halalStatus: "Halal" },
  { id: "ne529", code: "529", name: "Calcium Oxide", category: "Halal", description: "Alkalis", halalStatus: "Halal" },
  { id: "ne530", code: "530", name: "Magnesium Oxide", category: "Halal", description: "Alkalis", halalStatus: "Halal" },
  { id: "ne535", code: "535", name: "Sodium Ferrocyanide", category: "Halal", description: "Other Salts", halalStatus: "Halal" },
  { id: "ne536", code: "536", name: "Potassium Ferrocyanide", category: "Halal", description: "Other Salts", halalStatus: "Halal" },
  { id: "ne540", code: "540", name: "Dicalcium Ferrocyanide", category: "Halal", description: "Other Salts", halalStatus: "Halal" },
  { id: "ne541", code: "541", name: "Sodium Aluminium Phosphate", category: "Halal", description: "Other Salts", halalStatus: "Halal" },
  { id: "ne542", code: "542", name: "Edible Bone Phosphate (Bone-Meal)", category: "Haram", description: "Anti-Caking Agents", halalStatus: "Haram if the bones are from pig." },
  { id: "ne544", code: "544", name: "Calcium Polyphosphates", category: "Mushbooh", description: "Anti-Caking Agents", halalStatus: "Mushbooh (Halal if from minerals, Haram if pig bones)." },
  { id: "ne545", code: "545", name: "Ammonium Polyphosphates", category: "Halal", description: "Anti-Caking Agents", halalStatus: "Halal" },
  { id: "ne551", code: "551", name: "Silicon Dioxide (Silica Salt)", category: "Halal", description: "Silicon Salts", halalStatus: "Halal" },
  { id: "ne552", code: "552", name: "Calcium Silicate", category: "Halal", description: "Silicon Salts", halalStatus: "Halal" },
  { id: "ne553", code: "553", name: "Magnesium Silicate / Talc", category: "Halal", description: "Silicon Salts", halalStatus: "Halal" },
  { id: "ne554", code: "554", name: "Aluminium Sodium Silicate", category: "Halal", description: "Silicon Salts", halalStatus: "Halal" },
  { id: "ne556", code: "556", name: "Aluminium Calcium Silicate", category: "Mushbooh", description: "Silicon Salts", halalStatus: "Mushbooh (Halal if mineral rocks, Haram if pig bones)." },
  { id: "ne558", code: "558", name: "Bentonite", category: "Halal", description: "Other compounds", halalStatus: "Halal" },
  { id: "ne559", code: "559", name: "Kaolin (Aluminium Silicate)", category: "Halal", description: "Other compounds", halalStatus: "Halal" },
  { id: "ne570", code: "570", name: "Stearic Acid", category: "Mushbooh", description: "Other compounds", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "ne572", code: "572", name: "Magnesium Stearate", category: "Mushbooh", description: "Other compounds", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "ne575", code: "575", name: "Glucono Delta-Lactone", category: "Halal", description: "Other compounds", halalStatus: "Halal" },
  { id: "ne576", code: "576", name: "Sodium Gluconate", category: "Halal", description: "Other compounds", halalStatus: "Halal" },
  { id: "ne577", code: "577", name: "Potassium Gluconate", category: "Halal", description: "Other compounds", halalStatus: "Halal" },
  { id: "ne578", code: "578", name: "Calcium Gluconate", category: "Halal", description: "Other compounds", halalStatus: "Halal" },
  { id: "ne620", code: "620", name: "L-Glutamic Acid", category: "Mushbooh", description: "Flavour Enhancers", halalStatus: "Mushbooh (Halal if plant protein, Haram if pig protein)." },
  { id: "ne621", code: "621", name: "Monosodium Glutamate (MSG)", category: "Mushbooh", description: "Flavour Enhancers", halalStatus: "Mushbooh (Halal if culture media is Halal, Haram if media contains pork fat)." },
  { id: "ne622", code: "622", name: "Monopotassium Glutamate", category: "Mushbooh", description: "Flavour Enhancers", halalStatus: "Mushbooh (Halal if culture media is Halal, Haram if media contains pork fat)." },
  { id: "ne623", code: "623", name: "Calcium Glutamate", category: "Mushbooh", description: "Flavour Enhancers", halalStatus: "Mushbooh (Halal if culture media is Halal, Haram if media contains pork fat)." },
  { id: "ne627", code: "627", name: "Sodium Guanylate", category: "Mushbooh", description: "Flavour Enhancers", halalStatus: "Halal if sardines/yeast extract. Mushbooh if brewer yeast extract (beer product)." },
  { id: "ne631", code: "631", name: "Sodium Inosinate", category: "Mushbooh", description: "Flavour Enhancers", halalStatus: "Halal if from sardines. Mushbooh if brewer yeast. Haram if from pig meat." },
  { id: "ne635", code: "635", name: "Sodium 5-Ribonucleotide", category: "Mushbooh", description: "Flavour Enhancers", halalStatus: "Mushbooh (it is a combination of E627 and E631)." },
  { id: "ne636", code: "636", name: "Maltol", category: "Halal", description: "Flavour Enhancers", halalStatus: "Halal" },
  { id: "ne637", code: "637", name: "Ethyl Maltol", category: "Halal", description: "Flavour Enhancers", halalStatus: "Halal" },
  { id: "ne900", code: "900", name: "Dimethylpolysiloxane", category: "Halal", description: "Flavour Enhancers", halalStatus: "Halal" },
  { id: "ne901", code: "901", name: "Beeswax", category: "Halal", description: "Glazing Agents", halalStatus: "Halal" },
  { id: "ne903", code: "903", name: "Carnauba Wax", category: "Halal", description: "Glazing Agents", halalStatus: "Halal" },
  { id: "ne904", code: "904", name: "Shellac", category: "Mushbooh", description: "Glazing Agents", halalStatus: "Halal if not treated with alcohol." },
  { id: "ne905", code: "905", name: "Mineral Hydrocarbons", category: "Halal", description: "Glazing Agents", halalStatus: "Halal" },
  { id: "ne907", code: "907", name: "Refined Microcrystalline Wax", category: "Mushbooh", description: "Glazing Agents", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "ne920", code: "920", name: "L-Cysteine Hydrochloride", category: "Mushbooh", description: "Flour treatment compound", halalStatus: "Mushbooh (Haram if human hair, Halal if synthetic/feather derived)." },
  { id: "ne924", code: "924", name: "Potassium Bromate", category: "Halal", description: "Flour treatment compound", halalStatus: "Halal" },
  { id: "ne925", code: "925", name: "Chlorine", category: "Halal", description: "Flour treatment compound", halalStatus: "Halal" },
  { id: "ne926", code: "926", name: "Chlorine Dioxide", category: "Halal", description: "Flour treatment compound", halalStatus: "Halal" },
  { id: "ne927", code: "927", name: "Azodicarbonamide", category: "Halal", description: "Flour treatment compound", halalStatus: "Halal" }
];

export const E_PREFIX_LIST: IngredientInfo[] = [
  { id: "e100", code: "E100", name: "Curcumin / Turmeric", category: "Mushbooh", description: "Natural color", halalStatus: "Halal if pure turmeric. Mushbooh if liquid (solvent must be Halal). Haram if dry mix pork fat based emulsifier is hidden." },
  { id: "e101", code: "E101", name: "Riboflavin (Vitamin B2)", category: "Mushbooh", description: "Color", halalStatus: "Mushbooh (Haram if pork liver/kidney. Halal if 100% plant material)." },
  { id: "e102", code: "E102", name: "Tartrazine", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e104", code: "E104", name: "Quinoline Yellow", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent other than water must be Halal)." },
  { id: "e110", code: "E110", name: "Sunset Yellow FCF / Orange Yellow S", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e120", code: "E120", name: "Cochineal / Carminic Acid", category: "Haram", description: "Red color from insects", halalStatus: "Haram according to Hanafi Fiqh." },
  { id: "e122", code: "E122", name: "Carmoisine / Azorubine", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e123", code: "E123", name: "Amaranth", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e124", code: "E124", name: "Ponceau 4R / Cochineal Red A", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e127", code: "E127", name: "Erythrosine BS", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e131", code: "E131", name: "Patent Blue V", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e132", code: "E132", name: "Indigo Carmine / Idigotine", category: "Haram", description: "Color", halalStatus: "Halal if 100% synthetic, but Haram if pork glycerin is added as a solvent." },
  { id: "e140", code: "E140", name: "Chlorophyll", category: "Halal", description: "Natural green color", halalStatus: "Halal if 100% powder, or water/vegetable oil used as solvent." },
  { id: "e141", code: "E141", name: "Copper Complex of Chlorophyll", category: "Halal", description: "Natural green dye", halalStatus: "Halal if 100% powder, or water/vegetable oil used as solvent." },
  { id: "e142", code: "E142", name: "Green S / Acid Brilliant Green BS", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e150", code: "E150(a-d)", name: "Caramel Color with chemicals", category: "Halal", description: "Color", halalStatus: "Halal" },
  { id: "e151", code: "E151", name: "Black PN / Brilliant Black BN", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e153", code: "E153", name: "Carbon Black / Vegetable Carbon (Charcoal)", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e160a", code: "E160a", name: "Alpha, Beta, Gamma Carotene", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e160b", code: "E160b", name: "Annatto, Bixin, Norbixin", category: "Halal", description: "Color", halalStatus: "Halal" },
  { id: "e160c", code: "E160c", name: "Capsanthin / Capsorbin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e160d", code: "E160d", name: "Lycopene", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e160e", code: "E160e", name: "Beta-apo-8-carotenal", category: "Mushbooh", description: "Color - Carotene", halalStatus: "Halal if 100% dry powder or veg oil solvent. Haram if pork gelatin is hidden carrier/ingredient." },
  { id: "e160f", code: "E160f", name: "Ethyl ester of Beta-apo-8-cartonoic acid", category: "Mushbooh", description: "Color - Carotene", halalStatus: "Halal if 100% dry powder or veg oil solvent. Haram if pork gelatin is hidden carrier." },
  { id: "e161a", code: "E161a", name: "Flavoxanthin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e161b", code: "E161b", name: "Lutein", category: "Haram", description: "Yellow color pigment", halalStatus: "Halal if dry powder. Haram if pork gelatin or pork glycerin added in dry/liquid form." },
  { id: "e161c", code: "E161c", name: "Cryptoxanthin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e161d", code: "E161d", name: "Rubixanthin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e161e", code: "E161e", name: "Violaxanthin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e161f", code: "E161f", name: "Rhodoxanthin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e161g", code: "E161g", name: "Canthaxanthin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e162", code: "E162", name: "Beetroot Red / Betanin", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e163", code: "E163", name: "Anthocyanins", category: "Mushbooh", description: "Color", halalStatus: "Halal if dry color. Mushbooh if liquid color (solvent must be Halal)." },
  { id: "e170", code: "E170", name: "Calcium Carbonate (Chalk)", category: "Mushbooh", description: "Inorganic color", halalStatus: "Halal if rock mineral/dry powder. Mushbooh if liquid solvent must be Halal." },
  { id: "e171", code: "E171", name: "Titanium Dioxide", category: "Halal", description: "Inorganic color", halalStatus: "Halal" },
  { id: "e172", code: "E172", name: "Iron Oxides and Hydroxides", category: "Halal", description: "Inorganic color", halalStatus: "Halal" },
  { id: "e173", code: "E173", name: "Aluminium", category: "Halal", description: "Inorganic color", halalStatus: "Halal" },
  { id: "e174", code: "E174", name: "Silver", category: "Halal", description: "Inorganic color", halalStatus: "Halal" },
  { id: "e175", code: "E175", name: "Gold", category: "Halal", description: "Inorganic color", halalStatus: "Halal" },
  { id: "e180", code: "E180", name: "Pigment Rubine / Lithol Rubine BK", category: "Mushbooh", description: "Inorganic color", halalStatus: "Halal if dry. Mushbooh if liquid solvent must be Halal." },
  { id: "e200", code: "E200", name: "Sorbic Acid", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e201", code: "E201", name: "Sodium Sorbate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e202", code: "E202", name: "Potassium Sorbate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e203", code: "E203", name: "Calcium Sorbate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e210", code: "E210", name: "Benzoic Acid", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e211", code: "E211", name: "Sodium Benzoate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e212", code: "E212", name: "Potassium Benzoate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e213", code: "E213", name: "Calcium Benzoate", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if mineral derived, Mushbooh if from bones." },
  { id: "e214", code: "E214", name: "Ethyl 4-hydroxybenzoate", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if dry. Haram if alcohol solvent used." },
  { id: "e215", code: "E215", name: "Ethyl 4-hydroxybenzoate Sodium Salt", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if dry. Haram if alcohol solvent used." },
  { id: "e216", code: "E216", name: "Propyl 4-hydroxybenzoate", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if dry. Haram if alcohol solvent used." },
  { id: "e217", code: "E217", name: "Propyl 4-hydroxybenzoate Sodium Salt", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if dry. Haram if alcohol solvent used." },
  { id: "e218", code: "E218", name: "Methyl 4-hydroxybenzoate", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if dry. Haram if alcohol solvent used." },
  { id: "e219", code: "E219", name: "Methyl 4-hydroxybenzoate Sodium Salt", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if dry. Haram if alcohol solvent used." },
  { id: "e220", code: "E220", name: "Sulphur Dioxide", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e221", code: "E221", name: "Sodium Sulphite", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e222", code: "E222", name: "Sodium Hydrogen Sulphite", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e223", code: "E223", name: "Sodium Metabisulphite", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e224", code: "E224", name: "Potassium Metabisulphite", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e226", code: "E226", name: "Calcium Sulphite", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e227", code: "E227", name: "Calcium Hydrogen Sulphite", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if mineral/chemical. Mushbooh if from bones." },
  { id: "e230", code: "E230", name: "Biphenyl / Diphenyl", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if no alcohol solvent used." },
  { id: "e231", code: "E231", name: "2-Hydroxybiphenyl", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if no alcohol solvent used." },
  { id: "e232", code: "E232", name: "Sodium Biphenyl-2-yl Oxide", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if no alcohol solvent used." },
  { id: "e233", code: "E233", name: "2-(Thiazol-4-yl) Benzimidazole", category: "Mushbooh", description: "Preservative", halalStatus: "Halal if no alcohol solvent used." },
  { id: "e239", code: "E239", name: "Hexamine", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e249", code: "E249", name: "Potassium Nitrate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e250", code: "E250", name: "Sodium Nitrite", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e251", code: "E251", name: "Sodium Nitrate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e252", code: "E252", name: "Potassium Nitrate", category: "Halal", description: "Preservative", halalStatus: "Halal" },
  { id: "e260", code: "E260", name: "Acetic Acid", category: "Halal", description: "Acid", halalStatus: "Halal" },
  { id: "e261", code: "E261", name: "Potassium Acetate", category: "Halal", description: "Acid", halalStatus: "Halal" },
  { id: "e262", code: "E262", name: "Potassium Hydrogen Diacetate", category: "Halal", description: "Acid", halalStatus: "Halal" },
  { id: "e263", code: "E263", name: "Calcium Acetate", category: "Halal", description: "Acid", halalStatus: "Halal" },
  { id: "e270", code: "E270", name: "Lactic Acid", category: "Halal", description: "Acid", halalStatus: "Halal if non-whey source. (In USA always non-dairy source)." },
  { id: "e280", code: "E280", name: "Propionic Acid", category: "Halal", description: "Preservative Acid", halalStatus: "Halal" },
  { id: "e281", code: "E281", name: "Sodium Propionate", category: "Halal", description: "Preservative Acid", halalStatus: "Halal" },
  { id: "e282", code: "E282", name: "Calcium Propionate", category: "Mushbooh", description: "Preservative Acid", halalStatus: "Halal if mineral, Mushbooh if from bones." },
  { id: "e283", code: "E283", name: "Potassium Propionate", category: "Halal", description: "Preservative Acid", halalStatus: "Halal" },
  { id: "e290", code: "E290", name: "Carbon Dioxide", category: "Halal", description: "Gas", halalStatus: "Halal" },
  { id: "e300", code: "E300", name: "L-Ascorbic Acid (Vitamin C)", category: "Halal", description: "Antioxidant", halalStatus: "Halal" },
  { id: "e301", code: "E301", name: "Sodium-L-Ascorbate", category: "Halal", description: "Antioxidant", halalStatus: "Halal" },
  { id: "e302", code: "E302", name: "Calcium-L-Ascorbate", category: "Mushbooh", description: "Antioxidant", halalStatus: "Halal if mineral, Mushbooh if from animal bones." },
  { id: "e304", code: "E304", name: "Ascorbyl Palmitate", category: "Mushbooh", description: "Antioxidant", halalStatus: "Halal if Palmitic Acid from plants. Haram if from pork fat." },
  { id: "e306", code: "E306", name: "Natural Extracts of Tocopherols (Vitamin E)", category: "Mushbooh", description: "Antioxidant", halalStatus: "Halal if from plant fat. Haram if from pork fat." },
  { id: "e307", code: "E307", name: "Synthetic Alpha-Tocopherol", category: "Halal", description: "Antioxidant", halalStatus: "Halal only if made with synthetic materials without alcoholic fermentation." },
  { id: "e308", code: "E308", name: "Synthetic Gamma-Tocopherol", category: "Halal", description: "Antioxidant", halalStatus: "Halal only if made with synthetic materials without alcoholic fermentation." },
  { id: "e309", code: "E309", name: "Synthetic Delta-Tocopherol", category: "Halal", description: "Antioxidant", halalStatus: "Halal only if made with synthetic materials without alcoholic fermentation." },
  { id: "e310", code: "E310", name: "Propyl Gallate", category: "Halal", description: "Antioxidant", halalStatus: "Halal" },
  { id: "e311", code: "E311", name: "Octyl Gallate", category: "Halal", description: "Antioxidant", halalStatus: "Halal if from nutgalls or plant secretion." },
  { id: "e312", code: "E312", name: "Dodecly Gallate", category: "Mushbooh", description: "Antioxidant", halalStatus: "Halal if from nutgalls. Haram if alcohol solvent was used." },
  { id: "e320", code: "E320", name: "Butylated Hydroxyanisole (BHA)", category: "Mushbooh", description: "Antioxidant", halalStatus: "Halal if vegetable oil carrier. Haram if carrier is pork fat." },
  { id: "e321", code: "E321", name: "Butylated Hydroxytoluene (BHT)", category: "Mushbooh", description: "Antioxidant", halalStatus: "Halal if vegetable oil carrier. Haram if carrier is pork fat." },
  { id: "e322", code: "E322", name: "Lecithin", category: "Halal", description: "Emulsifier", halalStatus: "Halal if soy fat or egg yolk. In USA always soy fat (Halal)." },
  { id: "e325", code: "E325", name: "Sodium Lactate", category: "Halal", description: "Acid salt", halalStatus: "Halal if lactic acid is from non-dairy." },
  { id: "e326", code: "E326", name: "Potassium Lactate", category: "Halal", description: "Acid salt", halalStatus: "Halal if lactic acid is from non-dairy." },
  { id: "e327", code: "E327", name: "Calcium Lactate", category: "Halal", description: "Acid salt", halalStatus: "Halal if lactic acid is from non-dairy and calcium from mineral." },
  { id: "e330", code: "E330", name: "Citric Acid", category: "Halal", description: "Acid", halalStatus: "Halal" },
  { id: "e331", code: "E331", name: "Sodium Citrates", category: "Halal", description: "Acid salt", halalStatus: "Halal" },
  { id: "e332", code: "E332", name: "Potassium Citrates", category: "Halal", description: "Acid salt", halalStatus: "Halal" },
  { id: "e333", code: "E333", name: "Calcium Citrates", category: "Halal", description: "Acid salt", halalStatus: "Halal if calcium source is not from bones." },
  { id: "e334", code: "E334", name: "Tartaric Acid", category: "Halal", description: "Acid", halalStatus: "Halal if not wine by-product. (In USA always from unfermented grapes, Halal)." },
  { id: "e335", code: "E335", name: "Sodium Tartrates", category: "Halal", description: "Acid salt", halalStatus: "Halal if not wine by-product." },
  { id: "e336", code: "E336", name: "Potassium Tartrates (Cream of Tartar)", category: "Halal", description: "Acid salt", halalStatus: "Halal if not wine by-product." },
  { id: "e337", code: "E337", name: "Potassium Sodium Tartrates", category: "Halal", description: "Acid salt", halalStatus: "Halal if not wine by-product." },
  { id: "e338", code: "E338", name: "Orthophosphoric Acid", category: "Halal", description: "Acid", halalStatus: "Halal" },
  { id: "e339", code: "E339", name: "Sodium Phosphates", category: "Halal", description: "Acid salt", halalStatus: "Halal" },
  { id: "e340", code: "E340", name: "Potassium Phosphates", category: "Halal", description: "Acid salt", halalStatus: "Halal" },
  { id: "e341", code: "E341", name: "Calcium Phosphates", category: "Halal", description: "Acid salt", halalStatus: "Halal if calcium from mineral source." },
  { id: "e400", code: "E400", name: "Alginic Acid", category: "Halal", description: "Alginates", halalStatus: "Halal" },
  { id: "e401", code: "E401", name: "Sodium Alginate", category: "Halal", description: "Alginates", halalStatus: "Halal" },
  { id: "e402", code: "E402", name: "Potassium Alginate", category: "Halal", description: "Alginates", halalStatus: "Halal" },
  { id: "e403", code: "E403", name: "Ammonium Alginate", category: "Halal", description: "Alginates", halalStatus: "Halal" },
  { id: "e404", code: "E404", name: "Calcium Alginate", category: "Halal", description: "Alginates", halalStatus: "Halal if calcium source is from mineral." },
  { id: "e405", code: "E405", name: "Propane-1,2-Diol Alginate", category: "Halal", description: "Alginates", halalStatus: "Halal" },
  { id: "e406", code: "E406", name: "Agar", category: "Halal", description: "Plant gum", halalStatus: "Halal" },
  { id: "e407", code: "E407", name: "Carrageenan", category: "Halal", description: "Seaweed extract gum", halalStatus: "Halal" },
  { id: "e410", code: "E410", name: "Locust Bean Gum (Carob)", category: "Halal", description: "Plant gum", halalStatus: "Halal" },
  { id: "e412", code: "E412", name: "Guar Gum", category: "Halal", description: "Plant gum", halalStatus: "Halal" },
  { id: "e413", code: "E413", name: "Tragacanth", category: "Halal", description: "Plant gum", halalStatus: "Halal" },
  { id: "e414", code: "E414", name: "Gum Acacia (Gum Arabic)", category: "Halal", description: "Plant gum", halalStatus: "Halal" },
  { id: "e415", code: "E415", name: "Xanthan Gum", category: "Halal", description: "Bacterial gum", halalStatus: "Halal" },
  { id: "e420", code: "E420", name: "Sorbitol", category: "Halal", description: "Sugar Alcohol", halalStatus: "Halal" },
  { id: "e421", code: "E421", name: "Mannitol", category: "Halal", description: "Sugar Alcohol", halalStatus: "Halal" },
  { id: "e422", code: "E422", name: "Glycerol / Glycerin", category: "Mushbooh", description: "Sugar Alcohol", halalStatus: "Mushbooh. Halal if from plant fat. Haram if from pork fat." },
  { id: "e440a", code: "E440a", name: "Pectin", category: "Halal", description: "Pectin", halalStatus: "Halal" },
  { id: "e440b", code: "E440b", name: "Amidated Pectin", category: "Halal", description: "Pectin", halalStatus: "Halal" },
  { id: "e450", code: "E450(a-c)", name: "Sodium & Potassium Phosphates", category: "Halal", description: "Additive", halalStatus: "Halal" },
  { id: "e460", code: "E460", name: "Microcrystalline / Powdered Cellulose", category: "Halal", description: "Cellulose derivative", halalStatus: "Halal" },
  { id: "e461", code: "E461", name: "Methylcellulose", category: "Halal", description: "Cellulose derivative", halalStatus: "Halal" },
  { id: "e463", code: "E463", name: "Hydroxypropylcellulose", category: "Halal", description: "Cellulose derivative", halalStatus: "Halal" },
  { id: "e464", code: "E464", name: "Hydroxypropyl-Methylcellulose", category: "Halal", description: "Cellulose derivative", halalStatus: "Halal" },
  { id: "e465", code: "E465", name: "Ethylmethylcellulose", category: "Halal", description: "Cellulose derivative", halalStatus: "Halal" },
  { id: "e466", code: "E466", name: "Carboxymethylcellulose Sodium Salt", category: "Halal", description: "Cellulose derivative", halalStatus: "Halal" },
  { id: "e470", code: "E470", name: "Sodium, Potassium, Calcium Salts of Fatty Acids", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e471", code: "E471", name: "Mono- and Diglycerides of Fatty Acids", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e472", code: "E472", name: "Various Esters of Mono- and Diglycerides of Fatty Acids", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e473", code: "E473", name: "Sucrose Esters of Fatty Acids", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e474", code: "E474", name: "Sucroglycerides", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e475", code: "E475", name: "Polyglycerol Esters of Fatty Acids", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e477", code: "E477", name: "Propane-1,2-Diol Esters of Fatty Acids", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e481", code: "E481", name: "Sodium Stearoyl-2-Lactylate", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e482", code: "E482", name: "Calcium Stearoyl-2-Lactylate", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." },
  { id: "e483", code: "E483", name: "Stearyl Tartrate", category: "Mushbooh", description: "Esters of Fatty Acids", halalStatus: "Mushbooh (Halal if plant fat, Haram if pork fat)." }
];

export interface CertifiedCompany {
  id: string;
  companyName: string;
  japaneseCompanyName?: string;
  certifiedProducts: string[];
  category: string;
  certificateNo?: string;
}

export const JHA_CERTIFIED_COMPANIES: CertifiedCompany[] = [
  {
    id: "jha1",
    companyName: "Kikkoman Corporation",
    japaneseCompanyName: "キッコーマン株式会社",
    certifiedProducts: [
      "Kikkoman Halal Soy Sauce (ハラールしょうゆ)",
      "Kikkoman Halal Gluten-Free Soy Sauce"
    ],
    category: "Seasoning / Soy Sauce"
  },
  {
    id: "jha2",
    companyName: "Yamasa Corporation",
    japaneseCompanyName: "ヤマサ醤油株式会社",
    certifiedProducts: [
      "Yamasa Halal Soy Sauce (ヤマサ ハラールしょうゆ)",
      "Yamasa Halal Tamari Soy Sauce"
    ],
    category: "Seasoning / Soy Sauce"
  },
  {
    id: "jha3",
    companyName: "S&B Foods Inc.",
    japaneseCompanyName: "エスビー食品株式会社",
    certifiedProducts: [
      "S&B Halal Curry Powder",
      "S&B Halal Golden Curry Mix (Medium Hot / Hot)",
      "S&B Prepared Wasabi (ハラールおろし生わさび)"
    ],
    category: "Curry / Wasabi / Spices"
  },
  {
    id: "jha4",
    companyName: "Otsuka Foods Co., Ltd.",
    japaneseCompanyName: "大塚食品株式会社",
    certifiedProducts: [
      "Halal Bon Curry Gold (Mild, Medium, Hot)",
      "Halal Veggie Bon Curry",
      "Mannanhikari (Processed Konjac Rice)"
    ],
    category: "Retort Curry / Processed Food"
  },
  {
    id: "jha5",
    companyName: "House Foods Corporation",
    japaneseCompanyName: "ハウス食品株式会社",
    certifiedProducts: [
      "House Business-use Halal Curry Flakes",
      "Java Curry Halal series",
      "Kokumaru Curry Halal series"
    ],
    category: "Curry Flakes / Seasoning"
  },
  {
    id: "jha6",
    companyName: "Seiu Co., Ltd.",
    japaneseCompanyName: "整宇株式会社 / セイウ",
    certifiedProducts: [
      "Halal Non-Alcohol Sweet Cooking Liquid (ハラールみりんタイプ)",
      "Halal Soy Sauce (ハラールしょうゆ)",
      "Halal Gyoza (Chicken & Vegetable)",
      "Halal Salad Dressings"
    ],
    category: "Cooking Wine / Soy Sauce / Frozen Gyoza"
  },
  {
    id: "jha7",
    companyName: "Hikari Miso Co., Ltd.",
    japaneseCompanyName: "ひかり味噌株式会社",
    certifiedProducts: [
      "Organic Miso Paste (additive-free)",
      "Halal Certified Instant Miso Soup series"
    ],
    category: "Miso Paste / Instant Soup"
  },
  {
    id: "jha8",
    companyName: "Ajinomoto Co., Inc.",
    japaneseCompanyName: "味の素株式会社",
    certifiedProducts: [
      "AJI-NO-MOTO Monosodium Glutamate (specifically certified grades)",
      "Hondashi Halal-compliant seasoning",
      "Pure Amino Acid product ingredients"
    ],
    category: "Flavor Enhancer / Amino Acids"
  },
  {
    id: "jha9",
    companyName: "Kewpie Corporation",
    japaneseCompanyName: "キユーピー株式会社",
    certifiedProducts: [
      "Halal Liquid Whole Egg, Egg Yolk, Egg Whites",
      "Halal Dressing & Mayonnaise lines (export/custom lines)"
    ],
    category: "Mayonnaise / Industrial Eggs"
  },
  {
    id: "jha10",
    companyName: "Morinaga Milk Industry Co., Ltd.",
    japaneseCompanyName: "森永乳業株式会社",
    certifiedProducts: [
      "Morinaga Whey Powder, Skim Milk Powder, Lactose ingredients",
      "Halal-certified infant formula raw materials"
    ],
    category: "Dairy powder / Sweeteners"
  },
  {
    id: "jha11",
    companyName: "Marusan-Ai Co., Ltd.",
    japaneseCompanyName: "マルサンアイ株式会社",
    certifiedProducts: [
      "Marusan Halal Organic Soy Milk",
      "Marusan Additive-Free Miso Paste"
    ],
    category: "Soy Milk / Miso Paste"
  },
  {
    id: "jha12",
    companyName: "Tamanoi Vinegar Co., Ltd.",
    japaneseCompanyName: "タマノイ酢株式会社",
    certifiedProducts: [
      "Sushi Vinegar Powder (Sushinoko)",
      "Tamanoi Apple Vinegar drinks"
    ],
    category: "Vinegar powder"
  },
  {
    id: "jha13",
    companyName: "Mizkan Holdings Co., Ltd.",
    japaneseCompanyName: "Mizkan株式会社",
    certifiedProducts: [
      "Halal Grain Vinegar",
      "Halal Sushi Seasoning (for exports)"
    ],
    category: "Vinegar / Sushi Seasoning"
  }
];

export const ALL_INGREDIENTS = [
  ...HARAM_KANJI_LIST,
  ...SYUBHAT_INGREDIENTS,
  ...NO_E_PREFIX_LIST,
  ...E_PREFIX_LIST
];
