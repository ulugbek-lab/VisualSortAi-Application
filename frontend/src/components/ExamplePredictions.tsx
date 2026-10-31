import paperPhoto from "../assets/images/examples/paper-cardboard.jpg";
import glassPhoto from "../assets/images/examples/glass.jpg";
import metalPhoto from "../assets/images/examples/metal.jpg";
import organicPhoto from "../assets/images/examples/organic.jpg";
import { materials } from "../constants";
import type { WasteClass } from "../types";

// These illustrative badges are demo examples, never model results.
const examples: { category: WasteClass; confidence: string; photo: string }[] =
  [
    { category: "paper-cardboard", confidence: "98.2%", photo: paperPhoto },
    { category: "glass", confidence: "96.5%", photo: glassPhoto },
    { category: "metal", confidence: "97.1%", photo: metalPhoto },
    { category: "organic", confidence: "99.0%", photo: organicPhoto },
  ];
export default function ExamplePredictions() {
  return (
    <section aria-labelledby="examples-heading" className="p-6 xl:p-7">
      <h2 id="examples-heading" className="text-sm font-semibold">
        Example Predictions
      </h2>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        A few things our model can identify.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {examples.map(({ category, confidence, photo }) => (
          <div
            key={category}
            className="overflow-hidden rounded-xl border dark:border-slate-700 border-slate-200/80"
          >
            <img
              src={photo}
              alt={`${materials[category].label} waste example`}
              loading="lazy"
              className="h-28 w-full object-cover"
            />
            <div className="p-3">
              <h3 className="min-h-8 text-[11px] font-medium leading-4">
                {category === "paper-cardboard"
                  ? "Paper / Cardboard"
                  : materials[category].label}
              </h3>
              <span className="inline-flex rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                {confidence}{" "}
                <span className="ml-1 text-emerald-600/70">example</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] leading-5 text-slate-400">
        Illustrative examples only. Your results come from the uploaded image.
      </p>
    </section>
  );
}
