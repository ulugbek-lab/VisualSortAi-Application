import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_SETTINGS, HISTORY_KEY, SETTINGS_KEY } from "./constants";
import { createThumbnail, readHistory, readSettings } from "./storage";
import type {
  PredictionHistoryItem,
  PredictionResponse,
  Settings,
} from "./types";

interface AppState {
  history: PredictionHistoryItem[];
  settings: Settings;
  notice: string;
  dismissNotice: () => void;
  savePrediction: (result: PredictionResponse, file: File) => Promise<void>;
  clearHistory: () => void;
  updateSettings: (settings: Settings) => void;
}
const AppContext = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<PredictionHistoryItem[]>(() => {
    try {
      return readHistory();
    } catch {
      return [];
    }
  });
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      return readSettings();
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [notice, setNotice] = useState("");
  const historyRef = useRef(history);
  const generation = useRef(0);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark",
    );
    document.documentElement.style.colorScheme = settings.theme;
  }, [settings.theme]);
  useEffect(() => {
    try {
      readHistory();
      readSettings();
    } catch {
      setNotice(
        "Saved browser data could not be read. You can clear history or reset settings to start fresh.",
      );
    }
    function sync(event: StorageEvent) {
      try {
        if (event.key === HISTORY_KEY || event.key === null) {
          if (event.newValue === null) generation.current++;
          const next = readHistory();
          historyRef.current = next;
          setHistory(next);
        }
        if (event.key === SETTINGS_KEY || event.key === null)
          setSettings(readSettings());
      } catch {
        setNotice("Could not synchronize saved browser data.");
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  async function savePrediction(result: PredictionResponse, file: File) {
    const version = generation.current;
    const timestamp = new Date().toISOString();
    const imagePreview = await createThumbnail(file);
    if (version !== generation.current) return; // Do not restore history cleared during thumbnail creation.
    const item: PredictionHistoryItem = {
      id: crypto.randomUUID(),
      filename: result.filename || file.name,
      predictedClass: result.prediction.class,
      confidence: result.prediction.confidence,
      topPredictions: result.top_predictions,
      timestamp,
      imagePreview,
    };
    let next = [item, ...historyRef.current].sort(
      (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
    );
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // If thumbnails fill browser storage, preserve all prediction metadata first.
      next = next.map(({ imagePreview: _thumbnail, ...entry }) => entry);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        setNotice(
          "History saved without thumbnails because browser storage is full.",
        );
      } catch {
        setNotice(
          "Prediction succeeded, but history could not be saved. It is available for this session only.",
        );
      }
    }
    historyRef.current = next;
    setHistory(next);
  }
  function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      setNotice(
        "Browser storage could not be cleared. Please allow site storage and try again.",
      );
      return;
    }
    generation.current++;
    historyRef.current = [];
    setHistory([]);
  }
  function updateSettings(next: Settings) {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      setNotice(
        "Settings apply for this session, but browser storage is unavailable.",
      );
    }
  }
  return (
    <AppContext.Provider
      value={{
        history,
        settings,
        notice,
        dismissNotice: () => setNotice(""),
        savePrediction,
        clearHistory,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
