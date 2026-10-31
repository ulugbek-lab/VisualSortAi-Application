import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AppProvider, useApp } from "./AppContext";
import Icon from "./components/Icon";
import ClassifyPage from "./pages/ClassifyPage";
import HistoryPage from "./pages/HistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ModelInfoPage from "./pages/ModelInfoPage";
import SettingsPage from "./pages/SettingsPage";

const navigation = [
  { path: "/classify", icon: "classify", label: "Classify" },
  { path: "/history", icon: "history", label: "History" },
  { path: "/analytics", icon: "analytics", label: "Analytics" },
  { path: "/model-info", icon: "info", label: "Model Info" },
  { path: "/settings", icon: "settings", label: "Settings" },
] as const;
function Dashboard() {
  const { settings, updateSettings, notice, dismissNotice } = useApp();
  const location = useLocation();
  const current =
    navigation.find((item) => item.path === location.pathname)?.label ??
    "Workspace";
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[76px] flex-col border-r dark:border-slate-700 border-slate-200/80 bg-white dark:bg-slate-900 md:flex xl:w-56">
        <Link
          to="/classify"
          aria-label="VisualSort AI home"
          className="flex h-20 items-center justify-center gap-2.5 px-5 xl:justify-start"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ec8243] text-white">
            <Icon name="classify" />
          </span>
          <span className="hidden whitespace-nowrap text-lg font-semibold tracking-tight xl:block">
            VisualSort <span className="text-[#e98042]">AI</span>
          </span>
        </Link>
        <div className="px-3 pt-8">
          <p className="mb-4 hidden px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 xl:block">
            Workspace
          </p>
          <nav aria-label="Main navigation" className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-[13px] xl:justify-start ${isActive ? "bg-orange-50 dark:bg-orange-950/40 font-medium text-orange-700 dark:text-orange-300" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                }
              >
                <Icon name={item.icon} />
                <span className="hidden xl:block">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto hidden p-5 xl:block">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
            <Icon name="organic" className="mb-2 h-5 w-5 text-orange-400" />
            <p className="text-xs font-medium">Smarter sorting starts here.</p>
            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              One item. One informed choice.
            </p>
          </div>
          <p className="mt-5 text-[10px] text-slate-400">
            VisualSort AI · Waste classification
          </p>
        </div>
      </aside>
      <div className="md:ml-[76px] xl:ml-56">
        <header className="flex h-20 items-center justify-between border-b dark:border-slate-700 border-slate-200/80 bg-white dark:bg-slate-900 px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/classify"
              className="flex items-center gap-2 font-semibold md:hidden"
            >
              <span className="rounded-lg bg-orange-50 dark:bg-orange-950/40 p-2 text-orange-500">
                <Icon name="classify" className="h-4 w-4" />
              </span>
              VisualSort AI
            </Link>
            <span className="hidden text-slate-400 md:inline">Workspace</span>
            <span className="hidden px-2 text-slate-300 md:inline">/</span>
            <span className="hidden font-medium md:inline">{current}</span>
          </div>
          <button
            onClick={() =>
              updateSettings({
                ...settings,
                theme: settings.theme === "light" ? "dark" : "light",
              })
            }
            title={`Switch to ${settings.theme === "light" ? "dark" : "light"} theme`}
            aria-label={`Switch to ${settings.theme === "light" ? "dark" : "light"} theme`}
            className="rounded-lg border dark:border-slate-700 border-slate-200 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Icon name="sun" className="h-4 w-4" />
          </button>
        </header>
        <nav
          aria-label="Mobile navigation"
          className="flex overflow-x-auto border-b dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-3 py-2 md:hidden"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2.5 text-[11px] ${isActive ? "bg-orange-50 dark:bg-orange-950/40 font-medium text-orange-700 dark:text-orange-300" : "text-slate-500 dark:text-slate-400"}`
              }
            >
              <Icon name={item.icon} className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {notice && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-800"
            >
              <p className="flex-1">{notice}</p>
              <button
                onClick={dismissNotice}
                aria-label="Dismiss storage message"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/classify" replace />} />
            <Route path="/classify" element={<ClassifyPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/model-info" element={<ModelInfoPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/classify" replace />} />
          </Routes>
          <footer className="mt-12 flex flex-wrap justify-between gap-2 border-t dark:border-slate-700 border-slate-200/70 pt-5 text-[10px] text-slate-400">
            <p>VisualSort AI</p>
            <p>Intelligent classification. Thoughtful impact.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Dashboard />
      </AppProvider>
    </BrowserRouter>
  );
}
