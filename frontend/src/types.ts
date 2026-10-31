import type { WASTE_CLASSES } from "./constants";
export type WasteClass = (typeof WASTE_CLASSES)[number];
export interface Prediction {
  class: WasteClass;
  confidence: number;
}
export interface PredictionResponse {
  filename: string;
  prediction: Prediction;
  top_predictions: Prediction[];
}
export interface PredictionHistoryItem {
  id: string;
  filename: string;
  predictedClass: WasteClass;
  confidence: number;
  topPredictions: Prediction[];
  timestamp: string;
  imagePreview?: string;
}
export interface Settings {
  theme: "light" | "dark";
  alternativeCount: number;
}
