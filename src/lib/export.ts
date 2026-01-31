export interface ExportData {
  logs: Array<{
    date: string;
    foodName: string;
    quantityGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }>;
  weightLogs: Array<{
    date: string;
    weight: number;
  }>;
  dailySummaries: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }>;
}

export function exportToJSON(data: ExportData, filename: string = "insighteats-data") {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(
  data: ExportData,
  type: "logs" | "weightLogs" | "dailySummaries",
  filename: string = "insighteats-data"
) {
  let csv = "";
  let rows: string[][] = [];

  switch (type) {
    case "logs":
      csv = "Date,Food Name,Quantity (g),Calories,Protein (g),Carbs (g),Fat (g),Fiber (g)\n";
      rows = data.logs.map((log) => [
        log.date,
        `"${log.foodName}"`,
        log.quantityGrams.toString(),
        log.calories.toFixed(1),
        log.protein.toFixed(1),
        log.carbs.toFixed(1),
        log.fat.toFixed(1),
        (log.fiber || 0).toFixed(1),
      ]);
      break;

    case "weightLogs":
      csv = "Date,Weight (kg)\n";
      rows = data.weightLogs.map((log) => [log.date, log.weight.toString()]);
      break;

    case "dailySummaries":
      csv = "Date,Calories,Protein (g),Carbs (g),Fat (g),Fiber (g)\n";
      rows = data.dailySummaries.map((summary) => [
        summary.date,
        summary.calories.toFixed(0),
        summary.protein.toFixed(1),
        summary.carbs.toFixed(1),
        summary.fat.toFixed(1),
        (summary.fiber || 0).toFixed(1),
      ]);
      break;
  }

  const csvRows = rows.map((row) => row.join(","));
  csv += csvRows.join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
