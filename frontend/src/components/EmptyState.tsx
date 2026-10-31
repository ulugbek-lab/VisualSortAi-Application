import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function EmptyState({
  title,
  description,
  link = true,
}: {
  title: string;
  description: string;
  link?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-dashed dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 px-6 py-16 text-center">
      <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500">
        <Icon name="classify" className="h-7 w-7" />
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {link && (
        <Link
          to="/classify"
          className="mt-6 inline-flex rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-orange-700"
        >
          Classify an item
        </Link>
      )}
    </div>
  );
}
