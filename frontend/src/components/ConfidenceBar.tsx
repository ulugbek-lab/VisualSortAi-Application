import { materials } from "../constants";
import type { Prediction } from "../types";

export default function ConfidenceBar({
  prediction,
  first,
}: {
  prediction: Prediction;
  first: boolean;
}) {
  const material = materials[prediction.class];
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span
          className={
            first
              ? "font-medium text-slate-800 dark:text-slate-200"
              : "text-slate-500 dark:text-slate-400"
          }
        >
          {material.label}
        </span>
        <span
          className={`tabular-nums ${first ? "font-semibold text-orange-600" : "text-slate-500 dark:text-slate-400"}`}
        >
          {prediction.confidence.toFixed(2)}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${material.label} confidence`}
        aria-valuenow={prediction.confidence}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      >
        <div
          className={`h-full rounded-full ${first ? "bg-[#ed8546]" : "bg-slate-300"}`}
          style={{ width: `${prediction.confidence}%` }}
        />
      </div>
    </div>
  );
}
