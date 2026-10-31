import { WASTE_CLASSES } from "./constants";
import type { PredictionHistoryItem } from "./types";
export function calculateAnalytics(history: PredictionHistoryItem[]) {
  const classes = WASTE_CLASSES.map((category) => {
    const items = history.filter((item) => item.predictedClass === category);
    return {
      category,
      count: items.length,
      average: items.length
        ? items.reduce((sum, item) => sum + item.confidence, 0) / items.length
        : null,
    };
  });
  // Local calendar dates match the dates shown in History, including near midnight.
  const activity = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (13 - index));
    return {
      label: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      count: history.filter(
        (item) =>
          new Date(item.timestamp).toDateString() === date.toDateString(),
      ).length,
    };
  });
  const highestCount = Math.max(0, ...classes.map((item) => item.count));
  return {
    classes,
    activity,
    total: history.length,
    average: history.length
      ? history.reduce((sum, item) => sum + item.confidence, 0) / history.length
      : 0,
    common: classes.filter(
      (item) => item.count > 0 && item.count === highestCount,
    ),
    categoriesSeen: classes.filter((item) => item.count > 0).length,
  };
}
