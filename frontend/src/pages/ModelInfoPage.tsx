import PageHeading from "../components/PageHeading";
import Icon from "../components/Icon";
import { materials, WASTE_CLASSES } from "../constants";
const pipeline = [
  ["Image", "RGB photograph"],
  ["Resize + Normalize", "224 × 224 · ImageNet normalization"],
  ["MobileNetV2 CNN", "Convolutional feature extractor"],
  ["1280 visual features", "Compact representation of the image"],
  ["Linear classifier", "Maps features to waste categories"],
  ["6 logits", "One raw score per category"],
  ["Softmax", "Converts scores to probabilities"],
  ["Waste prediction", "Top category and available alternatives"],
];
export default function ModelInfoPage() {
  return (
    <>
      <PageHeading
        title="Behind the Model"
        subtitle="A lightweight vision model, fine-tuned to recognize everyday waste."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Model", "MobileNetV2"],
          ["Approach", "Transfer learning / Fine-tuning"],
          ["Framework", "PyTorch / TorchVision"],
          ["Input", "224 × 224 RGB image"],
        ].map(([label, value]) => (
          <section
            key={label}
            className="rounded-xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-5"
          >
            <h2 className="text-xs text-slate-400">{label}</h2>
            <p className="mt-3 text-sm font-semibold">{value}</p>
          </section>
        ))}
      </div>
      <section className="mt-6 rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-sm font-semibold">From pixels to prediction</h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          The inference pipeline used by the VisualSort AI backend.
        </p>
        <ol className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pipeline.map(([title, subtitle], index) => (
            <li
              key={title}
              className="relative rounded-xl border dark:border-slate-800 border-slate-100 bg-slate-50 dark:bg-slate-800 p-4"
            >
              <span className="mb-4 flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-950/50 text-[10px] font-semibold text-orange-700 dark:text-orange-300">
                {index + 1}
              </span>
              <h3 className="text-xs font-semibold">{title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
              {index < pipeline.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 text-slate-300"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-6 rounded-2xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-sm font-semibold">Six waste categories</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {WASTE_CLASSES.map((category) => (
            <div
              key={category}
              className="flex items-center gap-3 rounded-xl border dark:border-slate-800 border-slate-100 p-4"
            >
              <span className="rounded-lg bg-orange-50 dark:bg-orange-950/40 p-2 text-orange-500">
                <Icon name={category} />
              </span>
              <div>
                <h3 className="text-xs font-medium">
                  {materials[category].label}
                </h3>
                <p className="mt-1 text-[10px] text-slate-400">{category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {[
          [
            "Efficient visual understanding",
            "MobileNetV2 is a compact convolutional neural network. It uses efficient convolution blocks to extract visual patterns such as edges, shapes, and textures, producing 1280 features for the classifier.",
          ],
          [
            "Built through transfer learning",
            "VisualSort AI was fine-tuned on a custom waste dataset. Transfer learning reuses general visual patterns learned from images, providing a practical starting point for a specialized classifier without training a vision network from scratch.",
          ],
          [
            "Reading confidence responsibly",
            "Softmax transforms the six output scores into probabilities. The backend returns the top three classes. A high confidence score reflects model certainty; it does not guarantee correctness or determine local recyclability.",
          ],
        ].map(([title, text]) => (
          <section
            key={title}
            className="rounded-xl border dark:border-slate-700 border-slate-200 bg-white dark:bg-slate-900 p-5"
          >
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">
              {text}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-5 text-xs leading-6 text-slate-400">
        Dataset size, benchmark accuracy, and training duration are not
        documented in this project. No performance metrics are claimed here.
      </p>
    </>
  );
}
