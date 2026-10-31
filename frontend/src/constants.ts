import type { WasteClass } from "./types";

export const WASTE_CLASSES = [
  "paper-cardboard",
  "glass",
  "metal",
  "plastic",
  "organic",
  "textile",
] as const;
export const materials: Record<WasteClass, { label: string }> = {
  "paper-cardboard": { label: "Paper / Cardboard" },
  glass: { label: "Glass" },
  metal: { label: "Metal" },
  plastic: { label: "Plastic" },
  organic: { label: "Organic" },
  textile: { label: "Textile" },
};
export const DEFAULT_SETTINGS = {
  theme: "light" as "light" | "dark",
  alternativeCount: 5,
};
export const HISTORY_KEY = "visualsort-history-v1";
export const SETTINGS_KEY = "visualsort-settings-v1";
