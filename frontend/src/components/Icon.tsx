import type { WasteClass } from "../types";

type IconName =
  | WasteClass
  | "classify"
  | "history"
  | "analytics"
  | "info"
  | "settings"
  | "sun"
  | "upload"
  | "camera"
  | "image"
  | "close"
  | "arrow";
const paths: Record<IconName, string> = {
  classify: "M4 8V4h4m8 0h4v4M4 16v4h4m8 0h4v-4M8 12h8m-4-4v8",
  history: "M3 11a9 9 0 1 1 2 7M3 4v7h7m2-5v6l4 2",
  analytics: "M4 20h16M7 16v-5m5 5V5m5 11V8",
  info: "M12 11v6m0-10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  settings:
    "m9 3-1 3-3 1-2 5 2 5 3 1 1 3h6l1-3 3-1 2-5-2-5-3-1-1-3H9m6 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5",
  camera: "M8 6l2-3h4l2 3h5v14H3V6h5m8 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  image: "M4 3h16v18H4V3m0 13 5-5 4 4 3-3 4 5M9 7h.01",
  close: "m6 6 12 12M6 18 18 6",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  "paper-cardboard": "m3 7 9-4 9 4-9 4-9-4m0 0v10l9 4 9-4V7M12 11v10M7 5l10 5",
  glass: "M9 3h6m-5 0v5l-3 4v9h10v-9l-3-4V3M7 15h10",
  metal: "M6 6c0-4 12-4 12 0s-12 4-12 0m0 0v13c0 3 12 3 12 0V6M6 10h12M6 17h12",
  plastic: "M10 2h4v5l3 3v11H7V10l3-3V2M7 12h10M7 17h10M10 5h4",
  organic: "M5 19C-1 6 13 3 21 3c0 12-5 19-14 15m-3 4L17 8",
  textile: "m8 3-6 4 3 6 3-2v10h8V11l3 2 3-6-6-4c0 4-8 4-8 0",
};
export default function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
