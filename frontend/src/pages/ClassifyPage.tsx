import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import ExamplePredictions from "../components/ExamplePredictions";
import UploadArea from "../components/UploadArea";
import PredictionResult from "../components/PredictionResult";
import { classifyWaste } from "../api";
import { materials } from "../constants";
import type { PredictionResponse } from "../types";

import CameraCapture from "../components/CameraCapture";
import { useApp } from "../AppContext";

export default function ClassifyPage() {
  const { savePrediction, settings } = useApp();
  const [cameraOpen, setCameraOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectFile(selected: File) {
    setError("");
    if (!selected.type.startsWith("image/")) {
      setError("Please choose an image file, such as a JPG or PNG.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("This image is a little large. Please choose one under 10 MB.");
      return;
    }
    setFile(selected);
    setResult(null);
  }

  async function classify() {
    if (!file) {
      setError("Choose an image first, then we can take a look.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await classifyWaste(file);
      setResult(response);
      await savePrediction(response, file);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-5 2xl:flex-row 2xl:items-center">
        <div>
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.17em] text-[#c88b65]">
            AI-powered waste recognition
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[27px]">
            Classify Waste Items
          </h1>
          <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-[13px]">
            Upload an image or use your camera to identify and classify waste.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-[#ec8243] px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-[#d97033] disabled:opacity-50"
          >
            <Icon name="upload" className="h-4 w-4" />
            Upload Image
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setCameraOpen(true)}
            className="flex items-center gap-2 rounded-lg border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Icon name="camera" className="h-4 w-4" />
            Use Camera
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border dark:border-slate-700 border-slate-200/90 bg-white dark:bg-slate-900 shadow-[0_4px_24px_#19253604]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b dark:border-slate-800 border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Icon name="classify" className="h-4 w-4 text-orange-400" />
            <h2 className="text-xs font-semibold">Classification workspace</h2>
          </div>
          <span className="text-[10px] text-slate-400">
            6 material categories
          </span>
        </div>
        <div className="grid divide-y divide-slate-100 dark:divide-slate-800 lg:grid-cols-[0.85fr_1.2fr_1fr] lg:divide-x lg:divide-y-0">
          <ExamplePredictions />
          <section
            aria-labelledby="upload-heading"
            className="min-w-0 p-6 xl:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="upload-heading" className="text-sm font-semibold">
                Your image
              </h2>
              <span className="rounded bg-slate-50 dark:bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
                Single image
              </span>
            </div>
            <UploadArea
              inputRef={inputRef}
              file={file}
              preview={preview}
              loading={loading}
              onSelect={selectFile}
              onPreviewError={() => {
                setFile(null);
                setResult(null);
                setError(
                  "This image could not be opened. Please try a JPG, PNG, or WebP image.",
                );
              }}
              onClear={() => {
                setFile(null);
                setResult(null);
                setError("");
              }}
            />
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 px-3 py-3 text-xs leading-5 text-red-700"
              >
                {error}
              </p>
            )}
            <button
              onClick={classify}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ec8243] px-3 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#d97033] disabled:cursor-wait disabled:opacity-60"
            >
              <Icon name="classify" className="h-4 w-4" />
              {loading ? "Analyzing image…" : "Predict Waste Type"}
              <Icon name="arrow" className="ml-auto h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-[10px] leading-5 text-slate-400">
              For best results, use a clear photo of a single item.
            </p>
          </section>
          <PredictionResult
            result={result}
            loading={loading}
            alternativeCount={settings.alternativeCount}
          />
        </div>
      </div>
      <section
        aria-labelledby="materials-heading"
        className="mt-7 flex flex-col gap-4 rounded-xl border dark:border-slate-700 border-slate-200/80 bg-white dark:bg-slate-900 px-5 py-4 2xl:flex-row 2xl:items-center 2xl:justify-between"
      >
        <h2
          id="materials-heading"
          className="shrink-0 text-[11px] font-medium text-slate-500 dark:text-slate-400"
        >
          Supported materials
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {Object.entries(materials).map(([key, material]) => (
            <span
              key={key}
              className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
            >
              <Icon
                name={key as keyof typeof materials}
                className="h-4 w-4 text-slate-400"
              />
              {material.label}
            </span>
          ))}
        </div>
      </section>
      <div className="mt-6 flex items-start gap-3 px-1">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <p className="max-w-3xl text-[11px] leading-5 text-slate-400">
          Built for better sorting decisions. AI predictions are estimates, and
          recycling requirements vary by location. Always follow your local
          waste disposal guidelines.
        </p>
      </div>
      {cameraOpen && (
        <CameraCapture
          onCapture={selectFile}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </>
  );
}
