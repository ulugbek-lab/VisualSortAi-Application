import type { PredictionResponse } from "./types";
import { isPrediction } from "./storage";

export async function classifyWaste(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);
  let response: Response;
  try {
    // Vite forwards /api/predict to http://127.0.0.1:8000/predict.
    // Do not set Content-Type: the browser supplies the multipart boundary.
    response = await fetch("/api/predict", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw new Error(
      "Could not reach the classifier. Check that FastAPI is running on port 8000, then try again.",
    );
  }
  if (!response.ok)
    throw new Error(
      "We couldn’t classify this image. Try a clear JPG or PNG photo and try again.",
    );
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The classifier returned an unreadable response. Please try again.",
    );
  }
  const result = data as PredictionResponse | null;
  if (
    !result ||
    !isPrediction(result.prediction) ||
    !Array.isArray(result.top_predictions) ||
    !result.top_predictions.length ||
    !result.top_predictions.every(isPrediction)
  ) {
    throw new Error(
      "The classifier returned an unexpected result. Please try again.",
    );
  }
  return result;
}
