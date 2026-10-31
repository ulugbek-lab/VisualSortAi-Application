import {
  DEFAULT_SETTINGS,
  HISTORY_KEY,
  SETTINGS_KEY,
  WASTE_CLASSES,
} from "./constants";
import type { PredictionHistoryItem, Settings, Prediction } from "./types";

export function isPrediction(value: unknown): value is Prediction {
  if (!value || typeof value !== "object") return false;
  const item = value as Prediction;
  return (
    WASTE_CLASSES.includes(item.class) &&
    Number.isFinite(item.confidence) &&
    item.confidence >= 0 &&
    item.confidence <= 100
  );
}
export function readHistory(): PredictionHistoryItem[] {
  const data: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  if (!Array.isArray(data)) throw new Error("Invalid saved history");
  return data
    .filter(
      (item): item is PredictionHistoryItem =>
        item &&
        typeof item.id === "string" &&
        typeof item.filename === "string" &&
        isPrediction({
          class: item.predictedClass,
          confidence: item.confidence,
        }) &&
        Number.isFinite(Date.parse(item.timestamp)) &&
        Array.isArray(item.topPredictions) &&
        item.topPredictions.every(isPrediction) &&
        (item.imagePreview === undefined ||
          (typeof item.imagePreview === "string" &&
            item.imagePreview.startsWith("data:image/jpeg;base64,"))),
    )
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
export function readSettings(): Settings {
  const data = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  return {
    theme: data?.theme === "dark" ? "dark" : "light",
    alternativeCount:
      Number.isInteger(data?.alternativeCount) &&
      data.alternativeCount >= 0 &&
      data.alternativeCount <= 5
        ? data.alternativeCount
        : DEFAULT_SETTINGS.alternativeCount,
  };
}

// Small compressed thumbnails keep full-size uploads out of localStorage.
export async function createThumbnail(file: File): Promise<string | undefined> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 160 / Math.max(image.width, image.height));
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.65);
  } catch {
    return undefined;
  } finally {
    URL.revokeObjectURL(url);
  }
}
