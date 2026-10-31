import { useState } from "react";
import type { RefObject } from "react";
import Icon from "./Icon";

interface Props {
  file: File | null;
  preview: string;
  loading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onSelect: (file: File) => void;
  onClear: () => void;
  onPreviewError: () => void;
}

export default function UploadArea({
  file,
  preview,
  loading,
  inputRef,
  onSelect,
  onClear,
  onPreviewError,
}: Props) {
  const [dragging, setDragging] = useState(false);
  return (
    <div>
      <input
        ref={inputRef}
        id="waste-image"
        aria-label="Upload waste image"
        type="file"
        accept="image/*"
        disabled={loading}
        className="sr-only"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onSelect(selected);
          event.target.value = "";
        }}
      />
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!loading) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const selected = event.dataTransfer.files[0];
          if (selected && !loading) onSelect(selected);
        }}
        className={`flex h-72 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-5 text-center transition-colors xl:h-80 ${dragging ? "border-orange-400 bg-orange-50 dark:bg-orange-950/40" : "dark:border-slate-700 border-slate-200 bg-[#fafbfc] dark:bg-slate-950"}`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Selected waste to classify"
            className="h-full w-full rounded-lg object-contain"
            onError={onPreviewError}
          />
        ) : (
          <>
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 text-slate-400 shadow-xs">
              <Icon name="image" className="h-7 w-7" />
            </span>
            <p className="text-sm font-medium">Drag & drop your image</p>
            <p className="mt-2 text-xs text-slate-400">
              or browse files from your device
            </p>
            <button
              disabled={loading}
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 rounded-lg border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-medium hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
            >
              Choose an image
            </button>
            <p className="mt-4 text-[10px] text-slate-400">
              Image files only · Maximum 10 MB
            </p>
          </>
        )}
      </div>
      <div className="mt-3 flex h-9 min-w-0 items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-500 dark:text-slate-400">
        <Icon name="image" className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">
          {file ? file.name : "No image selected"}
        </span>
        {file && (
          <button
            type="button"
            aria-label="Remove selected image"
            disabled={loading}
            onClick={onClear}
            className="rounded p-1 hover:bg-slate-200 disabled:opacity-40"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
