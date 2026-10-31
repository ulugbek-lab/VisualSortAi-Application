import { useApp } from "../AppContext";
import { calculateAnalytics } from "../analytics";
import { materials } from "../constants";
import PageHeading from "../components/PageHeading";
import EmptyState from "../components/EmptyState";

export default function AnalyticsPage() {
  const { history } = useApp();
  const data = calculateAnalytics(history);
  const maxCount = Math.max(1, ...data.classes.map((item) => item.count));
  const maxActivity = Math.max(1, ...data.activity.map((item) => item.count));
  return (
    <>
      <PageHeading
        title="Waste Analytics"
        subtitle="A clear view of your classification activity, calculated from saved predictions."
      />
      {!history.length ? (
        <EmptyState
          title="Real insights need real predictions"
          description="Classify your first item to see material distribution, confidence trends, and prediction activity."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              [
                "Total Predictions",
                data.total.toLocaleString(),
                "Successful classifications",
              ],
              [
                "Average Confidence",
                `${data.average.toFixed(2)}%`,
                "Mean of predicted-class confidence",
              ],
              [
                "Most Common Waste Type",
                data.common
                  .map((item) => materials[item.category].label)
                  .join(" / "),
                data.common.length > 1
                  ? `Tie · ${data.common[0].count} predictions each`
                  : `${data.common[0].count} predictions`,
              ],
              [
                "Waste Categories Seen",
                `${data.categoriesSeen} / 6`,
                "Unique predicted materials",
              ],
            ].map(([title, value, note]) => (
              <section
                key={title}
                className="rounded-xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-5"
              >
                <h2 className="text-xs text-slate-500 dark:text-slate-400">
                  {title}
                </h2>
                <p className="mt-3 text-xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="mt-2 text-[10px] text-slate-400">{note}</p>
              </section>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-6">
              <h2 className="text-sm font-semibold">
                Predictions by Waste Type
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                All saved predictions · count per class
              </p>
              <div className="mt-7 space-y-5">
                {data.classes.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span>{materials[item.category].label}</span>
                      <span className="tabular-nums text-slate-500 dark:text-slate-400">
                        {item.count} ·{" "}
                        {((100 * item.count) / data.total).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-orange-400"
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-6">
              <h2 className="text-sm font-semibold">
                Average Confidence by Class
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Predicted class confidence · 0–100%
              </p>
              <div className="mt-7 space-y-5">
                {data.classes.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span>{materials[item.category].label}</span>
                      <span className="tabular-nums text-slate-500 dark:text-slate-400">
                        {item.average === null
                          ? "No predictions"
                          : `${item.average.toFixed(2)}%`}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${item.average ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="mt-6 rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-sm font-semibold">Prediction Activity</h2>
            <p className="mt-2 text-xs text-slate-400">
              Last 14 days · your local time
            </p>
            <div className="mt-6 overflow-x-auto">
              <div className="flex min-w-[560px] gap-3">
                {data.activity.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-w-0 flex-1 flex-col items-center"
                  >
                    <span className="mb-2 text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
                      {item.count}
                    </span>
                    <div className="flex h-36 w-full items-end rounded-t-md bg-slate-50 dark:bg-slate-800">
                      <div
                        className="w-full rounded-t-md bg-orange-400"
                        style={{
                          height: `${(100 * item.count) / maxActivity}%`,
                        }}
                      />
                    </div>
                    <span className="mt-3 text-[9px] text-slate-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <p className="mt-5 text-xs text-slate-400">
            Confidence describes the model’s certainty, not measured accuracy.
            These charts contain no demo data.
          </p>
        </>
      )}
    </>
  );
}
