import { useApp } from "../AppContext";
import { DEFAULT_SETTINGS } from "../constants";
import PageHeading from "../components/PageHeading";
import ClearHistoryButton from "../components/ClearHistoryButton";
export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="A few preferences to make the workspace yours. Saved in this browser."
      />
      <section className="max-w-3xl overflow-hidden rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900">
        <h2 className="border-b dark:border-slate-800 border-slate-100 px-6 py-5 text-sm font-semibold">
          Workspace preferences
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <label htmlFor="theme" className="text-sm font-medium">
                Appearance
              </label>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Choose a light or dark workspace.
              </p>
            </div>
            <select
              id="theme"
              value={settings.theme}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  theme: event.target.value as "light" | "dark",
                })
              }
              className="rounded-lg border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="max-w-md">
              <label htmlFor="alternatives" className="text-sm font-medium">
                Alternative predictions
              </label>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Maximum alternatives shown in results and history. The winning
                prediction always remains visible. Only returned API values are
                shown.
              </p>
            </div>
            <select
              id="alternatives"
              value={settings.alternativeCount}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  alternativeCount: Number(event.target.value),
                })
              }
              className="rounded-lg border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            >
              {[0, 1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count === 5 ? "All available (up to 5)" : count}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h3 className="text-sm font-medium">Prediction history</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Remove saved results and thumbnails from this browser.
              </p>
            </div>
            <ClearHistoryButton />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h3 className="text-sm font-medium">Reset preferences</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Restore light theme and show all available alternatives.
              </p>
            </div>
            <button
              onClick={() => updateSettings({ ...DEFAULT_SETTINGS })}
              className="rounded-lg border dark:border-slate-700 border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Reset settings
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
