import { useState } from "react";
import { useApp } from "../AppContext";
import { materials, WASTE_CLASSES } from "../constants";
import type { WasteClass } from "../types";
import PageHeading from "../components/PageHeading";
import EmptyState from "../components/EmptyState";
import ClearHistoryButton from "../components/ClearHistoryButton";
import Icon from "../components/Icon";

export default function HistoryPage() {
  const { history, settings } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<WasteClass | "">("");
  const filtered = history.filter(
    (item) =>
      (!category || item.predictedClass === category) &&
      item.filename.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        title="Prediction History"
        subtitle="Your saved classifications, kept locally in this browser."
      />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-slate-500 dark:text-slate-400">
            Search filename
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. bottle.jpg"
              className="mt-2 block w-56 rounded-lg border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200"
            />
          </label>
          <label className="text-xs text-slate-500 dark:text-slate-400">
            Waste category
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as WasteClass | "")
              }
              className="mt-2 block rounded-lg border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200"
            >
              <option value="">All categories</option>
              {WASTE_CLASSES.map((key) => (
                <option key={key} value={key}>
                  {materials[key].label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ClearHistoryButton />
      </div>
      {!history.length ? (
        <EmptyState
          title="Your sorting story starts here"
          description="Successful predictions will appear here automatically, including camera captures."
        />
      ) : !filtered.length ? (
        <EmptyState
          title="No matching predictions"
          description="Try a different filename or category filter."
          link={false}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900">
          <div className="border-b dark:border-slate-800 border-slate-100 px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} prediction{filtered.length === 1 ? "" : "s"} ·
            Newest first
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400">
                  {item.imagePreview ? (
                    <img
                      src={item.imagePreview}
                      alt={`Preview of ${item.filename}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon name={item.predictedClass} className="h-7 w-7" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      className="max-w-full truncate text-sm font-semibold"
                      title={item.filename}
                    >
                      {item.filename}
                    </h2>
                    <span className="rounded-md bg-orange-50 dark:bg-orange-950/40 px-2 py-1 text-[10px] text-orange-700 dark:text-orange-300">
                      {materials[item.predictedClass].label}
                    </span>
                  </div>
                  <time
                    dateTime={item.timestamp}
                    className="mt-2 block text-xs text-slate-400"
                  >
                    {new Date(item.timestamp).toLocaleString()}
                  </time>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    {item.topPredictions
                      .filter(
                        (prediction) =>
                          prediction.class !== item.predictedClass,
                      )
                      .slice(0, settings.alternativeCount)
                      .map((prediction) => (
                        <span
                          key={prediction.class}
                          className="rounded-md bg-slate-50 dark:bg-slate-800 px-2 py-1"
                        >
                          {materials[prediction.class].label} ·{" "}
                          {prediction.confidence.toFixed(2)}%
                        </span>
                      ))}
                  </div>
                </div>
                <div className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {item.confidence.toFixed(2)}%
                  <span className="mt-1 block text-[10px] font-normal text-slate-400">
                    confidence
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-5 text-xs leading-6 text-slate-400">
        History stays on this device and browser. Clearing site data removes it.
        Uploaded images are represented by small thumbnails when storage allows.
      </p>
    </>
  );
}
