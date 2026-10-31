import { useState } from "react";
import { useApp } from "../AppContext";
export default function ClearHistoryButton() {
  const { history, clearHistory } = useApp();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {confirming ? (
        <>
          <span role="status">
            Delete all {history.length} saved predictions?
          </span>
          <button
            onClick={() => {
              clearHistory();
              setConfirming(false);
            }}
            className="rounded-lg bg-red-600 px-3 py-2 text-white"
          >
            Yes, clear history
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded-lg border dark:border-slate-700 border-slate-200 px-3 py-2"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          disabled={!history.length}
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          Clear history
        </button>
      )}
    </div>
  );
}
