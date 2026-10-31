export default function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.17em] text-orange-500">
        VisualSort workspace
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}
