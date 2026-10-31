import type { PredictionResponse } from "../types";
import { materials } from "../constants";
import ConfidenceBar from "./ConfidenceBar";
import Icon from "./Icon";

export default function PredictionResult({
  result,
  loading,
  alternativeCount = 5,
}: {
  result: PredictionResponse | null;
  loading: boolean;
  alternativeCount?: number;
}) {
  const material = result ? materials[result.prediction.class] : null;
  // Display returned probabilities up to the saved preference. Never fill absent categories with invented values.
  const probabilities = result
    ? [
        result.prediction,
        ...result.top_predictions
          .filter((item) => item.class !== result.prediction.class)
          .slice(0, alternativeCount),
      ]
    : [];
  return (
    <section
      aria-labelledby="result-heading"
      aria-busy={loading}
      className="flex min-w-0 flex-col p-6 xl:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="result-heading"
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium ${result ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${result ? "bg-emerald-500" : "bg-slate-400"}`}
          />
          {result ? "Prediction" : "Prediction results"}
        </h2>
        {result && (
          <span className="rounded-md border border-emerald-100 bg-emerald-50/60 dark:bg-emerald-950/40 px-2 py-1 text-[10px] font-medium tabular-nums text-emerald-700 dark:text-emerald-300">
            {result.prediction.confidence.toFixed(2)}% confidence
          </span>
        )}
      </div>
      <div aria-live="polite" className="flex flex-1 flex-col">
        {loading ? (
          <div className="flex min-h-96 flex-1 flex-col items-center justify-center text-center">
            <span className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-orange-100 border-t-orange-500 motion-reduce:animate-none" />
            <h3 className="text-sm font-medium">Analyzing your image</h3>
            <p className="mt-2 text-xs text-slate-400">
              Identifying material and probabilities…
            </p>
          </div>
        ) : result && material ? (
          <>
            <div className="pb-6 pt-7">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#df7b3d]">
                <Icon name={result.prediction.class} className="h-8 w-8" />
              </span>
              <h3 className="text-2xl font-semibold tracking-tight">
                {material.label}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                This item is classified as{" "}
                {result.prediction.class === "paper-cardboard"
                  ? "paper / cardboard"
                  : result.prediction.class}{" "}
                waste.
              </p>
            </div>
            <div className="border-t dark:border-slate-800 border-slate-100 pt-5">
              <h4 className="mb-5 text-xs font-semibold">
                Other Probabilities
              </h4>
              <div className="space-y-5">
                {probabilities.map((prediction) => (
                  <ConfidenceBar
                    key={prediction.class}
                    prediction={prediction}
                    first={prediction.class === result.prediction.class}
                  />
                ))}
              </div>
            </div>
            <p className="mt-5 text-[10px] leading-5 text-slate-400">
              Showing {probabilities.length} of{" "}
              {result
                ? new Set([
                    result.prediction.class,
                    ...result.top_predictions.map((item) => item.class),
                  ]).size
                : 0}{" "}
              returned model probabilities. Check local sorting guidelines
              before disposal.
            </p>
          </>
        ) : (
          <div className="flex min-h-96 flex-1 flex-col items-center justify-center text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border dark:border-slate-800 border-slate-100 bg-slate-50 dark:bg-slate-800 text-slate-300">
              <Icon name="classify" className="h-8 w-8" />
            </span>
            <h3 className="text-sm font-medium">Ready when you are</h3>
            <p className="mt-2 max-w-48 text-xs leading-6 text-slate-400">
              Upload an image and run a prediction to see its material and
              confidence.
            </p>
            <span className="mt-6 rounded-full bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-[10px] text-slate-400">
              Waiting for prediction
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
