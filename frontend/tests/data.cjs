const assert = require("node:assert/strict");
const { calculateAnalytics } = require(process.argv[2] + "/analytics.js");
const { readHistory, readSettings, isPrediction } = require(
  process.argv[2] + "/storage.js",
);
const { HISTORY_KEY, SETTINGS_KEY } = require(
  process.argv[2] + "/constants.js",
);
const values = new Map();
global.localStorage = { getItem: (key) => values.get(key) ?? null };
const item = (id, category, confidence, timestamp) => ({
  id,
  filename: `${id}.jpg`,
  predictedClass: category,
  confidence,
  topPredictions: [{ class: category, confidence }],
  timestamp,
});
const now = new Date().toISOString();
const records = [
  item("a", "metal", 90, now),
  item("b", "metal", 70, now),
  item("c", "glass", 50, "2020-01-01T00:00:00.000Z"),
];
const stats = calculateAnalytics(records);
assert.equal(stats.total, 3);
assert.equal(stats.average, 70);
assert.equal(stats.categoriesSeen, 2);
assert.equal(stats.common[0].category, "metal");
assert.equal(stats.classes.find((row) => row.category === "metal").average, 80);
assert.equal(
  stats.classes.find((row) => row.category === "plastic").average,
  null,
);
assert.equal(stats.activity.at(-1).count, 2);
assert.equal(stats.activity.length, 14);
assert.equal(calculateAnalytics([]).common.length, 0);
assert.equal(calculateAnalytics([records[0], records[2]]).common.length, 2);
values.set(
  HISTORY_KEY,
  JSON.stringify([
    records[2],
    records[0],
    { ...records[1], confidence: 120 },
    { ...records[1], imagePreview: "https://example.com/tracker" },
  ]),
);
assert.deepEqual(
  readHistory().map((row) => row.id),
  ["a", "c"],
);
values.set(HISTORY_KEY, "broken json");
assert.throws(readHistory);
values.set(
  SETTINGS_KEY,
  JSON.stringify({ theme: "dark", alternativeCount: 0 }),
);
assert.deepEqual(readSettings(), { theme: "dark", alternativeCount: 0 });
values.set(
  SETTINGS_KEY,
  JSON.stringify({ theme: "unknown", alternativeCount: 99 }),
);
assert.deepEqual(readSettings(), { theme: "light", alternativeCount: 5 });
assert.equal(isPrediction({ class: "plastic", confidence: 94.72 }), true);
assert.equal(isPrediction({ class: "unknown", confidence: 90 }), false);
assert.equal(isPrediction({ class: "metal", confidence: Infinity }), false);
console.log(
  "Data checks passed: analytics, ties, daily activity, history validation/order, settings, response validation.",
);
