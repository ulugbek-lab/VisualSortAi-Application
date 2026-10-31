import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

export default function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const active = useRef(true);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    active.current = true;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error(
            "Camera access needs a supported browser on localhost or HTTPS.",
          );
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (video.current) {
          video.current.srcObject = stream;
          await video.current.play();
        }
      } catch (failure) {
        if (cancelled) return;
        streamRef.current?.getTracks().forEach((track) => track.stop());
        const name = failure instanceof Error ? failure.name : "";
        setError(
          name === "NotAllowedError"
            ? "Camera permission was denied. Allow camera access in your browser settings, or upload an image."
            : name === "NotFoundError"
              ? "No camera was found. Connect a webcam or upload an image."
              : name === "NotReadableError"
                ? "Your camera may be in use by another app. Close it there and try again."
                : failure instanceof Error
                  ? failure.message
                  : "Unable to open the camera. Please upload an image instead.",
        );
      }
    }
    void start();
    return () => {
      cancelled = true;
      active.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      previousFocus?.focus();
    };
  }, []);
  async function capture() {
    const element = video.current;
    if (!element || !element.videoWidth || !ready) return;
    setCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      const scale = Math.min(
        1,
        1920 / Math.max(element.videoWidth, element.videoHeight),
      );
      canvas.width = Math.round(element.videoWidth * scale);
      canvas.height = Math.round(element.videoHeight * scale);
      const context = canvas.getContext("2d");
      if (!context)
        throw new Error("Image capture is unavailable in this browser.");
      context.drawImage(element, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9),
      );
      if (!active.current) return;
      if (!blob)
        throw new Error("Could not capture this frame. Please try again.");
      onCapture(
        new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }),
      );
      onClose();
    } catch (failure) {
      if (!active.current) return;
      setError(
        failure instanceof Error
          ? failure.message
          : "Capture failed. Please try again.",
      );
    } finally {
      if (active.current) setCapturing(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="camera-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key === "Tab") {
            const buttons = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                "button:not(:disabled)",
              ),
            );
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            }
            if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
        className="w-full max-w-2xl rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="camera-title" className="font-semibold">
            Capture a waste item
          </h2>
          <button
            ref={closeButton}
            onClick={onClose}
            aria-label="Close camera"
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Icon name="close" />
          </button>
        </div>
        <video
          ref={video}
          autoPlay
          playsInline
          muted
          onLoadedData={() => setReady(true)}
          className="aspect-video w-full rounded-xl bg-slate-950 object-contain"
        />
        {error ? (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        ) : (
          <p
            role="status"
            className="mt-4 text-xs text-slate-500 dark:text-slate-400"
          >
            {ready
              ? "Keep one item in frame, then capture a photo."
              : "Waiting for camera permission…"}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border dark:border-slate-700 border-slate-200 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={!ready || capturing || !!error}
            onClick={capture}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            <Icon name="camera" className="h-4 w-4" />
            {capturing ? "Capturing…" : "Capture"}
          </button>
        </div>
      </section>
    </div>
  );
}
